
(function () {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, mouse = { x: -9999, y: -9999 };
  const PARTICLE_COUNT = 132;
  const LINK_DIST      = 125;
  const REPULSE_DIST   = 135;
  const SPEED = 0.16;
  const ESCAPE_FORCE = 0.40;
  const WANDER_FORCE = 0.006;
  const COLOR          = '0, 255, 136'; // green channels

  let particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * SPEED;
    this.vy = (Math.random() - 0.5) * SPEED;
    this.r  = Math.random() * 1.8 + 0.8;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.08;
  }

  Particle.prototype.update = function () {
    this.angle += this.spin;
    this.vx += Math.cos(this.angle) * WANDER_FORCE;
    this.vy += Math.sin(this.angle) * WANDER_FORCE;

    // repulse from mouse
    const dx   = this.x - mouse.x;
    const dy   = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < REPULSE_DIST && dist > 0) {
      const force = Math.pow((REPULSE_DIST - dist) / REPULSE_DIST, 1.7);
      this.vx += (dx / dist) * force * ESCAPE_FORCE;
      this.vy += (dy / dist) * force * ESCAPE_FORCE;
    }

    // speed cap
    const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (spd > 1.45) { this.vx = (this.vx / spd) * 1.45; this.vy = (this.vy / spd) * 1.45; }

    // damping
    this.vx *= 0.992;
    this.vy *= 0.992;

    this.x += this.vx;
    this.y += this.vy;

    // wrap edges
    if (this.x < 0)  this.x = W;
    if (this.x > W)  this.x = 0;
    if (this.y < 0)  this.y = H;
    if (this.y > H)  this.y = 0;
  };

  function init() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // draw links
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.14;
          ctx.strokeStyle = `rgba(${COLOR}, ${alpha})`;
          ctx.lineWidth   = 0.7;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // draw dots
    particles.forEach(p => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR}, 0.48)`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  resize();
  init();
  draw();
})();



(function () {
  const lines = [
    'Song\u00fcl \u00d6z\u00fcg\u00fcrler - Guvenlik Arastirmacisi',
    'Pentest, tehdit avciligi ve',
    'guvenlik arastirmasi odakli'
  ];
  const el = document.getElementById('typewriter');
  let ci = 0;
  const full = lines.join('\n');

  function type() {
    if (ci >= full.length) return;
    el.textContent += full[ci++];
    setTimeout(type, ci === 1 ? 180 : 24);
  }

  setTimeout(type, 500);

  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  const items = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(item => obs.observe(item));

  const spySections = document.querySelectorAll('section[id]');
  const spyLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      spyLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-35% 0px -45% 0px', threshold: 0.01 });
  spySections.forEach(section => spy.observe(section));

  const output = document.getElementById('terminal-output');
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');
  const commandMap = {
    help: ['about', 'skills', 'projects', 'writeups', 'blog', 'tools', 'experience', 'certs', 'github', 'medium', 'linkedin', 'lang', 'cv', 'flag', 'contact', 'clear', 'sudo'],
    about: ['Tum profil /tr/about.html sayfasinda.', 'Red team, blue team, bug bounty, mentorluk ve sertifikalar.'],
    skills: ['web pentest', 'api guvenligi', 'bug bounty', 'red / blue team', 'burp suite', 'python / bash'],
    projects: ['Recon Automation Pack', 'Writeup Knowledge Base', 'Blue Team Lab Notes'],
    writeups: ['/#writeups', "Son writeup'lar, PortSwigger lab'lari ve pratik notlar"],
    blog: ['/tr/blog.html', 'Filtreli, aramali tum yazi arsivi'],
    tools: ['/#tools', 'One cikan projeler, GitHub reposu ve arastirma araclari'],
    experience: ['/tr/about.html', 'Red team, blue team, SOC, mentorluk ve operasyon deneyimi'],
    certs: ['CEH Practical', 'BGA Penetration Tester Training Program', 'CCNA: Intro to Networks', 'AWS Security Fundamentals'],
    github: ['github.com/songulkizilay', 'One cikanlar: unionhunter, xfcheck, PortswiggerAllLabs, favicon.hash'],
    medium: ['medium.com/@songulkizilay', 'Writeup, lab notlari ve security research yazilari'],
    linkedin: ['linkedin.com/in/songulozugurler', 'Deneyim, sertifika ve profesyonel profil'],
    lang: ['/index.html -> English', '/tr/index.html -> Turkce'],
    cv: ['/tr/about.html', 'Deneyim, sertifikalar ve operator profili ozeti'],
    flag: ['flag{guzel_deneme}', 'Komik gorsel aciliyor...'],
    contact: ['songulkizilay46@gmail.com', 'github.com/songulkizilay', 'medium.com/@songulkizilay', 'linkedin.com/in/songulozugurler'],
    sudo: ['Permission denied.', 'Nice try :)']
  };

  const commandActions = {
    about: { type: 'same-tab', target: '/tr/about.html' },
    projects: { type: 'hash', target: '#tools' },
    writeups: { type: 'hash', target: '#writeups' },
    blog: { type: 'same-tab', target: '/tr/blog.html' },
    tools: { type: 'hash', target: '#tools' },
    experience: { type: 'same-tab', target: '/tr/about.html#experience' },
    certs: { type: 'same-tab', target: '/tr/about.html#certifications' },
    github: { type: 'new-tab', target: 'https://github.com/Songul-Kizilay' },
    medium: { type: 'new-tab', target: 'https://medium.com/@songulkizilay' },
    linkedin: { type: 'new-tab', target: 'https://www.linkedin.com/in/songulozugurler/' },
    lang: { type: 'same-tab', target: '/index.html' },
    cv: { type: 'same-tab', target: '/tr/about.html' },
    flag: { type: 'same-tab', target: '/funny-flag.svg' },
    contact: { type: 'mailto', target: 'mailto:songulkizilay46@gmail.com' }
  };

  function pushLine(text, extraClass) {
    const line = document.createElement('div');
    line.className = 'terminal-line' + (extraClass ? ' ' + extraClass : '');
    line.textContent = text;
    output.appendChild(line);
  }

  function performCommandAction(command) {
    const action = commandActions[command];
    if (!action) return;
    window.setTimeout(() => {
      if (action.type === 'hash') {
        window.location.hash = action.target;
      } else if (action.type === 'same-tab' || action.type === 'mailto') {
        window.location.href = action.target;
      } else if (action.type === 'new-tab') {
        window.open(action.target, '_blank', 'noopener');
      }
    }, 180);
  }

  function runCommand(value) {
    const command = value.trim().toLowerCase();
    if (!command) return;
    pushLine('songul@sec:~$ ' + command);
    if (command === 'clear') {
      output.innerHTML = '';
      return;
    }
    (commandMap[command] || ['Komut bulunamadi.', 'Dene: help']).forEach(line => pushLine(line, 'out'));
    output.scrollTop = output.scrollHeight;
    performCommandAction(command);
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    runCommand(input.value);
    input.value = '';
  });

  document.querySelectorAll('.terminal-action').forEach(button => {
    button.addEventListener('click', () => runCommand(button.dataset.command));
  });

  const track = document.getElementById('project-track');
  const dots = document.querySelectorAll('.carousel-dot');
  const prev = document.getElementById('carousel-prev');
  const next = document.getElementById('carousel-next');
  let currentSlide = 0;

  function setSlide(index) {
    currentSlide = (index + dots.length) % dots.length;
    track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
    dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === currentSlide));
  }

  prev.addEventListener('click', () => setSlide(currentSlide - 1));
  next.addEventListener('click', () => setSlide(currentSlide + 1));
  dots.forEach(dot => dot.addEventListener('click', () => setSlide(Number(dot.dataset.slide))));
})();
