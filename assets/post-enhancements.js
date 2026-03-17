(() => {
  const article = document.querySelector("article");
  const footer = article && article.querySelector("footer");
  const titleEl = article && article.querySelector("h1");
  if (!article || !footer || !titleEl) return;

  const style = document.createElement("style");
  style.textContent = ".continue-reading{width:640px;max-width:calc(100% - 40px);margin:2.35rem auto;border:1px solid rgba(0,255,136,.12);border-radius:16px;padding:1.2rem 1.25rem;background:linear-gradient(180deg,rgba(15,20,22,.96),rgba(10,14,15,.98));position:relative;z-index:1;box-shadow:0 22px 48px rgba(0,0,0,.18)}.continue-reading h3{font-family:'JetBrains Mono',monospace;font-size:.92rem;letter-spacing:.08em;color:#00ff88;margin:0 0 .48rem}.continue-reading p{font-size:.84rem;color:#8b949e;line-height:1.82;margin:0 0 .95rem}.continue-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.85rem}.continue-card{display:block;text-decoration:none;border:1px solid rgba(0,255,136,.12);border-radius:12px;padding:.9rem .95rem;background:rgba(255,255,255,.025);transition:border-color .2s,transform .2s,box-shadow .2s}.continue-card:hover{border-color:#00ff88;transform:translateY(-2px);box-shadow:0 14px 32px rgba(0,255,136,.07)}.continue-card strong{display:block;font-family:'JetBrains Mono',monospace;font-size:.75rem;color:#fff;line-height:1.58;margin-bottom:.34rem}.continue-card span{display:block;font-size:.74rem;color:#8b949e;line-height:1.65}.continue-nav{display:flex;gap:.75rem;margin-top:.95rem;flex-wrap:wrap}.continue-nav a{font-family:'JetBrains Mono',monospace;font-size:.73rem;color:#00ff88;text-decoration:none;border:1px solid rgba(0,255,136,.12);border-radius:999px;padding:.36rem .76rem;transition:border-color .2s,color .2s}.continue-nav a:hover{border-color:#00ff88;color:#c9d1d9}@media(max-width:720px){.continue-reading{width:auto}.continue-grid{grid-template-columns:1fr}}";
  document.head.appendChild(style);

  const currentPath = window.location.pathname.split("/").pop();
  const currentTitle = titleEl.textContent.trim().toLowerCase();

  fetch("../blog.html")
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const links = Array.from(doc.querySelectorAll(".article-item")).map(link => {
        const href = link.getAttribute("href") || "";
        const title = (link.querySelector(".article-body h3") || {}).textContent || "";
        const summary = (link.querySelector(".article-body p") || {}).textContent || "";
        const category = (link.querySelector(".article-cat") || {}).textContent || "";
        return { href, title: title.trim(), summary: summary.trim(), category: category.trim() };
      });
      const currentIndex = links.findIndex(entry => entry.href.split("/").pop() === currentPath);
      const previous = currentIndex > 0 ? links[currentIndex - 1] : null;
      const next = currentIndex >= 0 && currentIndex < links.length - 1 ? links[currentIndex + 1] : null;
      const related = links
        .filter(entry => entry.href.split("/").pop() !== currentPath)
        .map(entry => {
          let score = 0;
          const haystack = (entry.title + " " + entry.summary + " " + entry.category).toLowerCase();
          if (entry.category && currentTitle.includes(entry.category.toLowerCase())) score += 3;
          if (/xss/.test(currentTitle) && /xss/.test(haystack)) score += 4;
          if (/sql|union|sqli/.test(currentTitle) && /sql|union|sqli/.test(haystack)) score += 4;
          if (/htb|hackthebox/.test(currentTitle) && /htb|hackthebox/.test(haystack)) score += 4;
          if (/recon|dns|proxy|certificate/.test(currentTitle) && /recon|dns|proxy|certificate/.test(haystack)) score += 3;
          if (currentTitle.split(/\s+/).some(word => word.length > 4 && haystack.includes(word))) score += 1;
          return { ...entry, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      const block = document.createElement("section");
      block.className = "continue-reading";
      block.innerHTML = '<h3>Continue reading</h3><p>Follow the next writeup in the archive or jump to related material from the same lane.</p><div class="continue-grid"></div><div class="continue-nav"></div>';
      const grid = block.querySelector(".continue-grid");
      related.forEach(entry => {
        const card = document.createElement("a");
        card.className = "continue-card";
        card.href = entry.href;
        card.innerHTML = "<strong>" + entry.title + "</strong><span>" + (entry.summary || entry.category || "Archive link") + "</span>";
        grid.appendChild(card);
      });
      const nav = block.querySelector(".continue-nav");
      if (previous) {
        const link = document.createElement("a");
        link.href = previous.href;
        link.textContent = "Previous: " + previous.title;
        nav.appendChild(link);
      }
      if (next) {
        const link = document.createElement("a");
        link.href = next.href;
        link.textContent = "Next: " + next.title;
        nav.appendChild(link);
      }
      const archive = document.createElement("a");
      archive.href = "../blog.html";
      archive.textContent = "Back to archive";
      nav.appendChild(archive);
      footer.parentNode.insertBefore(block, footer);
    })
    .catch(() => {});
})();
