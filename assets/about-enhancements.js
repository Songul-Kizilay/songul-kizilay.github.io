(() => {
  const shell = document.querySelector("main.shell");
  if (!shell) return;
  const isTr = /\/tr\//.test(window.location.pathname);
  const copy = isTr
    ? {
        title: "Deneyim Zaman Cizgisi",
        intro: "Red team, savunma gorunurlugu, egitmenlik ve saha destegi tarafini tek akis icinde gosteriyorum.",
        entries: [
          ["2025", "Enforsec", "Red Team Intern", "PortSwigger lablari, manuel OWASP Top 10 dogrulamasi ve Burp Suite ile exploit/PoC akisi."],
          ["2023-2024", "BITES", "IT Support / Yazilim Destek", "Zabbix ile izleme, RPA surecleri ve acik kaynak arastirmasi uzerinden risk azaltma destegi."],
          ["2023", "Icisleri Bakanligi", "Cyber Security Intern", "Blue team ve SOC gorunurlugu; ag, log ve operasyon akisina daha yakin saha deneyimi."],
          ["2022-2023", "Deneyap Turkiye", "Cyber Security Instructor", "Guvenlik laboratuvarlari, ogrenci senaryolari ve uygulamali egitim akislarinin kurulumu."],
          ["2022", "CyberHero Academy", "Student Mentor", "CEH odakli icerik destegi, ogrenci rehberligi ve lab hazirliklari."],
          ["2021", "Xena Vision / ISTECENTER", "Cyber Security Intern", "Erken donem web uygulama guvenligi, Linux ve pentest pratikleri."]
        ]
      }
    : {
        title: "Experience Timeline",
        intro: "A cleaner view of how red team exposure, defensive visibility, mentoring, and support work fit together.",
        entries: [
          ["2025", "Enforsec", "Red Team Intern", "PortSwigger labs, manual OWASP Top 10 validation, and Burp-driven exploit / PoC work."],
          ["2023-2024", "BITES", "IT Support / Software Support", "Monitoring with Zabbix, security-adjacent RPA flows, and open-source research support."],
          ["2023", "Ministry of Interior", "Cyber Security Intern", "Blue team and SOC visibility with stronger exposure to logs, networks, and operational flow."],
          ["2022-2023", "Deneyap Turkiye", "Cyber Security Instructor", "Hands-on lab scenarios, student exercises, and practical security training delivery."],
          ["2022", "CyberHero Academy", "Student Mentor", "CEH-oriented guidance, student support, and lab preparation work."],
          ["2021", "Xena Vision / ISTECENTER", "Cyber Security Intern", "Early web application security, Linux, and pentesting practice in internship environments."]
        ]
      };

  const style = document.createElement("style");
  style.textContent = ".timeline-section{padding:0 1.5rem 3.2rem;max-width:1120px;margin:0 auto}.timeline-panel{border:1px solid var(--border);background:linear-gradient(180deg,rgba(15,20,22,.96),rgba(10,14,15,.98));border-radius:16px;padding:1.35rem 1.45rem;box-shadow:0 22px 54px rgba(0,0,0,.18)}.timeline-panel h2{font-family:var(--mono);font-size:.98rem;letter-spacing:.08em;color:var(--green);margin-bottom:.48rem}.timeline-panel p{font-size:.84rem;color:var(--text-dim);line-height:1.84;margin-bottom:1.05rem}.timeline-list{display:grid;gap:.9rem}.timeline-item{display:grid;grid-template-columns:92px 1fr;gap:1rem;border:1px solid var(--border);border-radius:12px;padding:1rem 1.05rem;background:rgba(255,255,255,.025)}.timeline-year{font-family:var(--mono);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--green)}.timeline-body strong{display:block;font-family:var(--mono);font-size:.8rem;color:#fff;margin-bottom:.22rem;line-height:1.5}.timeline-body span{display:block;font-size:.75rem;color:var(--cyan);margin-bottom:.32rem;letter-spacing:.02em}.timeline-body p{margin:0;font-size:.8rem;line-height:1.72}@media(max-width:700px){.timeline-item{grid-template-columns:1fr}}";
  document.head.appendChild(style);

  if (document.querySelector(".timeline-section")) return;
  const section = document.createElement("section");
  section.className = "timeline-section reveal";
  section.id = "experience";
  section.innerHTML = '<div class="timeline-panel"><h2>' + copy.title + '</h2><p>' + copy.intro + '</p><div class="timeline-list"></div></div>';
  const list = section.querySelector(".timeline-list");
  copy.entries.forEach(entry => {
    const item = document.createElement("article");
    item.className = "timeline-item";
    item.innerHTML = '<div class="timeline-year">' + entry[0] + '</div><div class="timeline-body"><strong>' + entry[1] + '</strong><span>' + entry[2] + '</span><p>' + entry[3] + '</p></div>';
    list.appendChild(item);
  });
  shell.appendChild(section);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  observer.observe(section);
})();
