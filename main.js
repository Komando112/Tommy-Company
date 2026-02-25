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

/* ===== ANIMATED GRID CANVAS ===== */
const bgGrid = document.getElementById('bgGrid');
const bgCtx = bgGrid.getContext('2d');

function resizeGrid() {
  bgGrid.width = window.innerWidth;
  bgGrid.height = window.innerHeight;
}
resizeGrid();
window.addEventListener('resize', resizeGrid);

let gridTime = 0;
function drawGrid() {
  bgCtx.clearRect(0, 0, bgGrid.width, bgGrid.height);
  const spacing = 60;
  const cols = Math.ceil(bgGrid.width / spacing) + 1;
  const rows = Math.ceil(bgGrid.height / spacing) + 1;
  const offsetX = (bgGrid.width % spacing) / 2;
  const offsetY = (bgGrid.height % spacing) / 2;

  // Draw vertical lines
  for (let i = 0; i < cols; i++) {
    const x = offsetX + i * spacing;
    const pulse = 0.025 + 0.015 * Math.sin(gridTime * 0.4 + i * 0.5);
    bgCtx.beginPath();
    bgCtx.moveTo(x, 0);
    bgCtx.lineTo(x, bgGrid.height);
    bgCtx.strokeStyle = `rgba(0, 200, 255, ${pulse})`;
    bgCtx.lineWidth = 0.5;
    bgCtx.stroke();
  }
  // Draw horizontal lines
  for (let j = 0; j < rows; j++) {
    const y = offsetY + j * spacing;
    const pulse = 0.025 + 0.015 * Math.sin(gridTime * 0.3 + j * 0.6);
    bgCtx.beginPath();
    bgCtx.moveTo(0, y);
    bgCtx.lineTo(bgGrid.width, y);
    bgCtx.strokeStyle = `rgba(185, 79, 255, ${pulse})`;
    bgCtx.lineWidth = 0.5;
    bgCtx.stroke();
  }

  // Glowing intersection dots
  for (let i = 0; i < cols; i += 3) {
    for (let j = 0; j < rows; j += 3) {
      const x = offsetX + i * spacing;
      const y = offsetY + j * spacing;
      const alpha = 0.05 + 0.08 * Math.abs(Math.sin(gridTime * 0.5 + i * 0.7 + j * 0.4));
      bgCtx.beginPath();
      bgCtx.arc(x, y, 1.5, 0, Math.PI * 2);
      bgCtx.fillStyle = `rgba(0, 200, 255, ${alpha})`;
      bgCtx.fill();
    }
  }

  gridTime += 0.016;
  requestAnimationFrame(drawGrid);
}
drawGrid();

/* ===== PARTICLES CANVAS ===== */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null, radius: 120 };

window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); resizeGrid(); });

function randomBetween(a, b) { return a + Math.random() * (b - a); }

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    ox: 0, oy: 0,
    vx: randomBetween(-0.2, 0.2),
    vy: randomBetween(-0.2, 0.2),
    size: randomBetween(0.8, 2.5),
    alpha: randomBetween(0.25, 0.8),
    color: Math.random() > 0.5 ? '0, 200, 255' : '185, 79, 255',
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: randomBetween(0.01, 0.04),
  };
}

for (let i = 0; i < 160; i++) particles.push(createParticle());

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) {
        const opacity = 0.12 * (1 - dist / 110);
        ctx.beginPath();
        const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
        grad.addColorStop(0, `rgba(0,200,255,${opacity})`);
        grad.addColorStop(1, `rgba(185,79,255,${opacity * 0.5})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.6;
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
    // Mouse repulsion
    if (mouse.x !== null) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        p.x += (dx / dist) * force * 1.5;
        p.y += (dy / dist) * force * 1.5;
      }
    }

    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    // Twinkle effect
    p.twinkle += p.twinkleSpeed;
    const twinkleAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.twinkle));

    // Draw glow
    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
    grd.addColorStop(0, `rgba(${p.color}, ${twinkleAlpha})`);
    grd.addColorStop(1, `rgba(${p.color}, 0)`);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // Core dot
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color}, ${twinkleAlpha})`;
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
