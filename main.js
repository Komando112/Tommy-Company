/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ===== MOBILE MENU ===== */
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});
// Close on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===== PARTICLES CANVAS ===== */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function randomBetween(a, b) { return a + Math.random() * (b - a); }

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: randomBetween(-0.15, 0.15),
    vy: randomBetween(-0.15, 0.15),
    size: randomBetween(0.5, 1.8),
    alpha: randomBetween(0.2, 0.7),
    color: Math.random() > 0.5 ? '0, 200, 255' : '185, 79, 255',
  };
}

for (let i = 0; i < 120; i++) particles.push(createParticle());

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 200, 255, ${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
    ctx.fill();
  });
  connectParticles();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===== SCROLL ANIMATIONS ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .stat-card, .why-card, .about-stat, .contact-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = target / (duration / 16);
  const update = () => {
    start += step;
    if (start >= target) {
      el.textContent = target + suffix;
      return;
    }
    el.textContent = Math.floor(start) + suffix;
    requestAnimationFrame(update);
  };
  update();
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const values = [
        { selector: '.stat-value:nth-of-type(1)', value: 200, suffix: '+' },
      ];
      document.querySelectorAll('.stat-value').forEach((el, i) => {
        const text = el.textContent;
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const hasM = text.includes('M');
        const num = parseInt(text.replace(/\D/g, ''));
        const suffix = hasM ? 'M+' : hasPlus ? '+' : hasPercent ? '%' : '';
        if (!isNaN(num)) animateCounter(el, num, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.getElementById('stats');
if (statsSection) statsObserver.observe(statsSection);

/* ===== CONTACT FORM ===== */
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'جارٍ الإرسال...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'تم الإرسال بنجاح ✅';
      showToast('✅ تم إرسال رسالتك! سنتواصل معك قريباً.');
      form.reset();
      setTimeout(() => {
        btn.textContent = 'إرسال الرسالة ✉️';
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });
}

/* ===== ACTIVE NAV LINK ON SCROLL ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('text-primary');
    link.classList.add('text-gray-300');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('text-primary');
      link.classList.remove('text-gray-300');
    }
  });
});
