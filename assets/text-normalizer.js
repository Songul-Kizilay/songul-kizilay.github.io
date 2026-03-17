(() => {
  const replacements = [
    ["Ã¼", "ü"], ["Ãœ", "Ü"], ["Ã¶", "ö"], ["Ã–", "Ö"], ["Ã§", "ç"], ["Ã‡", "Ç"],
    ["ÄŸ", "ğ"], ["Ä", "Ğ"], ["Ä±", "ı"], ["Ä°", "İ"], ["ÅŸ", "ş"], ["Å", "Ş"],
    ["ÃƒÂ¼", "ü"], ["ÃƒÅ“", "Ü"], ["ÃƒÂ¶", "ö"], ["Ãƒâ€“", "Ö"], ["ÃƒÂ§", "ç"], ["Ãƒâ€¡", "Ç"],
    ["Ã„Å¸", "ğ"], ["Ã„Å¾", "Ğ"], ["Ã…Å¸", "ş"], ["Ã…Å¾", "Ş"], ["Ã„Â±", "ı"], ["Ã„Â°", "İ"],
    ["Ã¢â‚¬â„¢", "’"], ["Ã¢â‚¬Ëœ", "‘"], ["Ã¢â‚¬Å“", "“"], ["Ã¢â‚¬Â", "”"], ["Ã¢â‚¬â€œ", "–"], ["Ã¢â‚¬â€", "—"],
    ["Ã¢â‚¬Â¦", "…"], ["Ã¢â‚¬Â¢", "•"], ["Ã¢â€ â€™", "→"], ["Ã‚ ", " "], ["Ã‚", ""], ["ï¿½", ""]
  ];

  const selectors = ["title", "input[placeholder]", "meta[name='description']", "[aria-label]", "[title]"];
  const skipTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"]);
  const suspicious = /Ã|Ä|Å|Â|â€™|â€|ï¿½/;

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
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(node => {
        if (node.tagName === "TITLE") {
          node.textContent = fixText(node.textContent);
        } else if (node.tagName === "META") {
          node.setAttribute("content", fixText(node.getAttribute("content") || ""));
        } else if (node.hasAttribute("placeholder")) {
          node.setAttribute("placeholder", fixText(node.getAttribute("placeholder") || ""));
        } else if (node.hasAttribute("aria-label")) {
          node.setAttribute("aria-label", fixText(node.getAttribute("aria-label") || ""));
        } else if (node.hasAttribute("title")) {
          node.setAttribute("title", fixText(node.getAttribute("title") || ""));
        }
      });
    });
    document.title = fixText(document.title);
  }

  fixAttributes();
  if (document.body) walk(document.body);
})();
