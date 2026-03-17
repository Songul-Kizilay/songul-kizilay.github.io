(() => {
  const root = document.getElementById("articles-list");
  if (!root) return;
  const isTr = /\/tr\//.test(window.location.pathname);
  const copy = isTr
    ? {
        featuredTitle: "# One Cikan Yazilar",
        featuredCopy: "Ise alim tarafinin once bakacagi teknik yazilari burada ayiriyorum.",
        quickTitle: "Hizli filtreler",
        difficulty: "Zorluk",
        noText: "Ozet yakinda",
        chips: {
          easy: "Kolay",
          medium: "Orta",
          hard: "Zor",
          offensive: "Ofansif",
          tutorial: "Tutorial",
          lab: "Lab",
          note: "Not",
          htb: "HTB",
          portswigger: "PortSwigger",
          web: "Web",
          recon: "Recon"
        },
        filters: [
          ["xss", "XSS"],
          ["sqli", "SQLi"],
          ["idor", "IDOR"],
          ["recon", "Recon"],
          ["htb", "HTB"],
          ["portswigger", "PortSwigger"]
        ]
      }
    : {
        featuredTitle: "# Featured Writeups",
        featuredCopy: "A shorter shortlist of the most useful technical pieces to read first.",
        quickTitle: "Quick filters",
        difficulty: "Difficulty",
        noText: "Summary coming soon",
        chips: {
          easy: "Easy",
          medium: "Medium",
          hard: "Hard",
          offensive: "Offensive",
          tutorial: "Tutorial",
          lab: "Lab",
          note: "Notes",
          htb: "HTB",
          portswigger: "PortSwigger",
          web: "Web",
          recon: "Recon"
        },
        filters: [
          ["xss", "XSS"],
          ["sqli", "SQLi"],
          ["idor", "IDOR"],
          ["recon", "Recon"],
          ["htb", "HTB"],
          ["portswigger", "PortSwigger"]
        ]
      };

  const style = document.createElement("style");
  style.textContent = ".featured-panel,.quick-filter-panel{background:linear-gradient(180deg,rgba(15,20,22,.96),rgba(10,14,15,.98));border:1px solid var(--border);border-radius:12px;padding:1.05rem 1.15rem;margin-bottom:1rem;box-shadow:0 18px 40px rgba(0,0,0,.15)}.featured-head h2{font-family:var(--mono);font-size:.96rem;letter-spacing:.08em;color:var(--green);margin-bottom:.38rem}.featured-head p{font-size:.8rem;color:var(--text-dim);line-height:1.8}.featured-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.9rem;margin-top:1rem}.featured-card{display:block;border:1px solid var(--border);border-radius:12px;padding:1rem 1.05rem;text-decoration:none;color:inherit;transition:border-color .2s,transform .2s,box-shadow .2s;background:rgba(255,255,255,.02)}.featured-card:hover{border-color:var(--green);transform:translateY(-3px);box-shadow:0 16px 36px rgba(0,255,136,.08)}.featured-card strong{display:block;font-family:var(--mono);font-size:.8rem;color:#fff;line-height:1.6;margin-bottom:.38rem}.featured-card p{font-size:.76rem;color:var(--text-dim);line-height:1.7}.meta-chips,.quick-filter-list{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:.58rem}.meta-chip,.quick-filter{font-family:var(--mono);font-size:.61rem;border:1px solid var(--border);border-radius:999px;padding:.2rem .58rem;background:rgba(255,255,255,.025);color:var(--text-dim);letter-spacing:.05em}.meta-chip.level-hard{color:#ff8e8e;border-color:rgba(255,71,87,.4)}.meta-chip.level-medium{color:#ffd37a;border-color:rgba(255,189,46,.35)}.meta-chip.level-easy{color:var(--green);border-color:rgba(0,255,136,.28)}.quick-filter{cursor:pointer;transition:border-color .2s,color .2s,transform .2s}.quick-filter.active,.quick-filter:hover{color:var(--green);border-color:var(--green);transform:translateY(-1px)}.article-body .meta-chips{margin-top:.55rem}.article-body p.is-empty{opacity:.75;font-style:italic}.article-item{box-shadow:0 12px 28px rgba(0,0,0,.08)}@media(max-width:820px){.featured-grid{grid-template-columns:1fr}}";
  document.head.appendChild(style);

  const items = Array.from(root.querySelectorAll(".article-item"));
  const parsed = items.map(item => {
    const titleEl = item.querySelector(".article-body h3");
    const textEl = item.querySelector(".article-body p");
    const tagEl = item.querySelector(".article-cat");
    const href = item.getAttribute("href");
    const title = titleEl ? titleEl.textContent.trim() : "";
    const text = textEl && textEl.textContent.trim() ? textEl.textContent.trim() : copy.noText;
    const category = tagEl ? tagEl.textContent.trim() : "";
    const haystack = (title + " " + text + " " + category).toLowerCase();
    const chips = [];
    let score = 0;
    if (/sql|sqli|union/.test(haystack)) { chips.push("sqli"); score += 4; }
    if (/xss|script/.test(haystack)) { chips.push("xss"); score += 4; }
    if (/idor|access control/.test(haystack)) { chips.push("idor"); score += 3; }
    if (/dns|proxy|recon|certificate|subdomain|vhost/.test(haystack)) { chips.push("recon"); score += 2; }
    if (/htb|hackthebox|cap /.test(haystack)) { chips.push("htb"); score += 2; }
    if (/portswigger|lab/.test(haystack)) { chips.push("portswigger"); score += 2; }
    if (/lab|walkthrough/.test(haystack)) chips.push("lab");
    else if (/notes|notlar|note/.test(haystack)) chips.push("note");
    else chips.push("tutorial");
    chips.push(/web|csrf|xss|sql|proxy/.test(haystack) ? "web" : "offensive");
    const difficulty = /union|multiple values|other tables|blind|deserialization|auth/i.test(title) ? "hard"
      : /lab|xss|csrf|proxy|dns|htb/i.test(title) ? "medium"
      : "easy";
    return { item, href, title, text, category, chips: Array.from(new Set(chips)), difficulty, score };
  });

  parsed.forEach(entry => {
    const body = entry.item.querySelector(".article-body");
    const textEl = body.querySelector("p");
    if (textEl && !textEl.textContent.trim()) {
      textEl.textContent = copy.noText;
      textEl.classList.add("is-empty");
    }
    const row = document.createElement("div");
    row.className = "meta-chips";
    const level = document.createElement("span");
    level.className = "meta-chip level-" + entry.difficulty;
    level.textContent = copy.difficulty + ": " + copy.chips[entry.difficulty];
    row.appendChild(level);
    entry.chips.slice(0, 3).forEach(chip => {
      const span = document.createElement("span");
      span.className = "meta-chip";
      span.textContent = copy.chips[chip] || chip;
      row.appendChild(span);
    });
    body.appendChild(row);
  });

  const pageHeader = document.querySelector(".page-header");
  if (pageHeader && !document.querySelector(".featured-panel")) {
    const featured = parsed.slice().sort((a, b) => b.score - a.score).slice(0, 3);
    const panel = document.createElement("section");
    panel.className = "featured-panel";
    panel.innerHTML = '<div class="featured-head"><h2>' + copy.featuredTitle + '</h2><p>' + copy.featuredCopy + '</p></div><div class="featured-grid"></div>';
    const grid = panel.querySelector(".featured-grid");
    featured.forEach(entry => {
      const card = document.createElement("a");
      card.className = "featured-card";
      card.href = entry.href;
      card.innerHTML = "<strong>" + entry.title + "</strong><p>" + entry.text + "</p>";
      grid.appendChild(card);
    });
    pageHeader.insertAdjacentElement("afterend", panel);
  }

  const searchBox = document.querySelector(".search-box");
  if (searchBox && !document.querySelector(".quick-filter-panel")) {
    const panel = document.createElement("section");
    panel.className = "quick-filter-panel";
    panel.innerHTML = '<div class="featured-head"><h2>' + copy.quickTitle + '</h2></div><div class="quick-filter-list"></div>';
    const list = panel.querySelector(".quick-filter-list");
    copy.filters.forEach(filter => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quick-filter";
      button.dataset.term = filter[0];
      button.textContent = filter[1];
      button.addEventListener("click", () => {
        const input = document.getElementById("search");
        if (!input) return;
        input.value = input.value.toLowerCase() === filter[0] ? "" : filter[0];
        input.dispatchEvent(new Event("input", { bubbles: true }));
        list.querySelectorAll(".quick-filter").forEach(node => node.classList.toggle("active", node === button && input.value));
      });
      list.appendChild(button);
    });
    searchBox.insertAdjacentElement("afterend", panel);
  }

  const searchInput = document.getElementById("search");
  const query = new URLSearchParams(window.location.search).get("q");
  if (searchInput && query) {
    searchInput.value = query;
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
  }
})();
