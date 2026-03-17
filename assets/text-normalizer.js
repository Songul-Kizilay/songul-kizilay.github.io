(() => {
  const replacements = [
    ["Ã¼", "ü"], ["Ãœ", "Ü"], ["Ã¶", "ö"], ["Ã–", "Ö"], ["Ã§", "ç"], ["Ã‡", "Ç"],
    ["ÄŸ", "ğ"], ["Äž", "Ğ"], ["ÅŸ", "ş"], ["Åž", "Ş"], ["Ä±", "ı"], ["Ä°", "İ"],
    ["â€™", "’"], ["â€˜", "‘"], ["â€œ", "“"], ["â€", "”"], ["â€“", "–"], ["â€”", "—"],
    ["â€¦", "…"], ["â€¢", "•"], ["â†’", "→"], ["Â ", " "], ["Â", ""], ["�", ""]
  ];

  const textSelectors = ["title", "input[placeholder]", "meta[name='description']"];
  const skipTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"]);
  const suspicious = /Ã|â€|â€“|â€”|â€¦|Å|Ä|Â|�/;

  function fixText(value) {
    if (!value || !suspicious.test(value)) return value;
    let next = value;
    replacements.forEach(([from, to]) => {
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
      node.nodeValue = fixText(node.nodeValue);
    });
  }

  function fixAttributes() {
    textSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(node => {
        if (node.tagName === "TITLE") {
          node.textContent = fixText(node.textContent);
        } else if (node.tagName === "META") {
          node.setAttribute("content", fixText(node.getAttribute("content") || ""));
        } else if (node.hasAttribute("placeholder")) {
          node.setAttribute("placeholder", fixText(node.getAttribute("placeholder") || ""));
        }
      });
    });
    document.title = fixText(document.title);
  }

  fixAttributes();
  walk(document.body);
})();
