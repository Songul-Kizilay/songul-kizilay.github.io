(() => {
  const directReplacements = [
    ["Ã¼", "ü"], ["Ãœ", "Ü"], ["Ã¶", "ö"], ["Ã–", "Ö"], ["Ã§", "ç"], ["Ã‡", "Ç"],
    ["ÄŸ", "ğ"], ["Äž", "Ğ"], ["Ä±", "ı"], ["Ä°", "İ"], ["ÅŸ", "ş"], ["Åž", "Ş"],
    ["â€™", "'"], ["â€˜", "'"], ["â€œ", "\""], ["â€", "\""], ["â€“", "-"], ["â€”", "-"],
    ["â€¦", "..."], ["â€¢", "•"], ["Â ", " "], ["Â", ""], ["ï¿½", ""]
  ];

  const selectors = ["title", "input[placeholder]", "meta[name='description']", "[aria-label]", "[title]"];
  const skipTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"]);
  const suspicious = /Ã|Ä|Å|Â|â€|ï¿½/;

  function latin1ToUtf8(value) {
    try {
      return decodeURIComponent(Array.from(value, ch => {
        const code = ch.charCodeAt(0);
        return "%" + (code & 0xff).toString(16).padStart(2, "0").toUpperCase();
      }).join(""));
    } catch (error) {
      return value;
    }
  }

  function repairMojibake(value) {
    if (!value || !suspicious.test(value)) return value;
    let next = value;

    for (let i = 0; i < 3; i++) {
      const decoded = latin1ToUtf8(next);
      if (decoded === next) break;
      next = decoded;
      if (!suspicious.test(next)) break;
    }

    directReplacements.forEach(([from, to]) => {
      next = next.split(from).join(to);
    });

    return next;
  }

  function walk(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentNode;
        if (!parent || skipTags.has(parent.nodeName)) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || !suspicious.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      node.nodeValue = repairMojibake(node.nodeValue);
    });
  }

  function fixAttributes() {
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(node => {
        if (node.tagName === "TITLE") {
          node.textContent = repairMojibake(node.textContent);
        } else if (node.tagName === "META") {
          node.setAttribute("content", repairMojibake(node.getAttribute("content") || ""));
        } else if (node.hasAttribute("placeholder")) {
          node.setAttribute("placeholder", repairMojibake(node.getAttribute("placeholder") || ""));
        } else if (node.hasAttribute("aria-label")) {
          node.setAttribute("aria-label", repairMojibake(node.getAttribute("aria-label") || ""));
        } else if (node.hasAttribute("title")) {
          node.setAttribute("title", repairMojibake(node.getAttribute("title") || ""));
        }
      });
    });
    document.title = repairMojibake(document.title);
  }

  function normalize() {
    fixAttributes();
    if (document.body) walk(document.body);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", normalize, { once: true });
  } else {
    normalize();
  }
})();
