/**
 * Día de las Flores Amarillas — Enhanced Script
 * Stars, petals, garden flowers, typing effect, scroll animations, popups
 */

// ===== 1. STARRY BACKGROUND =====
(function initStars() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = document.body.scrollHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Star {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.3;
      this.baseOpacity = Math.random() * 0.6 + 0.2;
      this.opacity = this.baseOpacity;
      this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      this.phase = Math.random() * Math.PI * 2;
    }
    update() {
      this.phase += this.twinkleSpeed;
      this.opacity = this.baseOpacity + Math.sin(this.phase) * 0.3;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(253, 211, 77, ${Math.max(0, this.opacity)})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 200; i++) stars.push(new Star());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(animate);
  }
  animate();

  // Resize stars on scroll-height change
  const ro = new ResizeObserver(() => resize());
  ro.observe(document.body);
})();


// ===== 2. FALLING PETALS =====
(function initPetals() {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let petals = [];
  const PETAL_COUNT = 30;
  const COLORS = [
    'rgba(251,191,36,0.65)',
    'rgba(253,211,77,0.55)',
    'rgba(254,243,199,0.45)',
    'rgba(245,158,11,0.5)',
    'rgba(217,119,6,0.4)',
  ];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Petal {
    constructor(burst = false, x = null, y = null) {
      this.x = x !== null ? x : Math.random() * canvas.width;
      this.y = burst ? (y ?? canvas.height / 2) : -20;
      this.size = Math.random() * 10 + 5;
      this.speedY = burst ? (Math.random() * 5 - 2.5) : (Math.random() * 1 + 0.4);
      this.speedX = burst ? (Math.random() * 8 - 4) : (Math.random() * 0.8 - 0.4);
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;
      this.opacity = Math.random() * 0.5 + 0.35;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.wobbleAmp = Math.random() * 1.5 + 0.5;
      this.wobbleSpeed = Math.random() * 0.02 + 0.008;
      this.wobblePhase = Math.random() * Math.PI * 2;
      this.gravity = burst ? 0.07 : 0;
      this.life = burst ? 1 : null;
      this.decay = burst ? (Math.random() * 0.008 + 0.004) : 0;
    }
    update() {
      this.wobblePhase += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobblePhase) * this.wobbleAmp;
      this.y += this.speedY;
      this.speedY += this.gravity;
      this.rotation += this.rotSpeed;
      if (this.life !== null) this.life -= this.decay;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.life !== null ? Math.max(0, this.life) * this.opacity : this.opacity;
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.6, this.size * 0.6, this.size * 0.4, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.6, this.size * 0.4, -this.size * 0.8, -this.size * 0.6, 0, -this.size);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
    isAlive() {
      if (this.life !== null) return this.life > 0;
      return this.y < canvas.height + 30 && this.x > -30 && this.x < canvas.width + 30;
    }
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    const p = new Petal();
    p.y = Math.random() * canvas.height;
    petals.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    while (petals.filter(p => p.life === null).length < PETAL_COUNT) petals.push(new Petal());
    petals.forEach(p => { p.update(); p.draw(); });
    petals = petals.filter(p => p.isAlive());
    requestAnimationFrame(animate);
  }
  animate();

  window.burstPetals = function (x, y, count = 50) {
    for (let i = 0; i < count; i++) petals.push(new Petal(true, x, y));
  };
})();


// ===== 3. FIREFLIES =====
(function initFireflies() {
  const count = 12;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'firefly';
    el.style.left = Math.random() * 100 + '%';
    el.style.animationDuration = (Math.random() * 10 + 8) + 's';
    el.style.animationDelay = (Math.random() * 10) + 's';
    el.style.width = (Math.random() * 4 + 3) + 'px';
    el.style.height = el.style.width;
    document.body.appendChild(el);
  }
})();


// ===== 4. FLOWER GARDEN (Canvas) =====
(function initFlowerGarden() {
  const canvas = document.getElementById('flower-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let time = 0;
  let fireflies = [];

  function resize() {
    const section = canvas.parentElement;
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Fireflies
  for (let i = 0; i < 20; i++) {
    fireflies.push({
      x: Math.random(),
      y: Math.random() * 0.6,
      size: Math.random() * 3 + 1.5,
      speedX: (Math.random() - 0.5) * 0.0003,
      speedY: (Math.random() - 0.5) * 0.0002,
      phase: Math.random() * Math.PI * 2,
    });
  }

  function drawGradientBackground() {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, 'rgba(5, 2, 8, 0)'); 
    grad.addColorStop(0.6, 'rgba(5, 2, 8, 0)'); // Keep top 60% completely transparent
    grad.addColorStop(0.8, '#071015');
    grad.addColorStop(1, '#0d2818');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawFireflies() {
    fireflies.forEach(f => {
      f.x += f.speedX + Math.sin(time * 0.01 + f.phase) * 0.0003;
      f.y += f.speedY + Math.cos(time * 0.008 + f.phase) * 0.0002;
      if (f.x < 0) f.x = 1; if (f.x > 1) f.x = 0;
      if (f.y < 0.2) f.y = 0.8; if (f.y > 0.8) f.y = 0.2; // Constrain to middle/bottom
      const fx = f.x * canvas.width;
      const fy = f.y * canvas.height;
      const brightness = Math.sin(time * 0.03 + f.phase) * 0.4 + 0.6;

      const glow = ctx.createRadialGradient(fx, fy, 0, fx, fy, f.size * 6);
      glow.addColorStop(0, `rgba(120, 255, 200, ${brightness * 0.6})`);
      glow.addColorStop(0.5, `rgba(80, 220, 180, ${brightness * 0.2})`);
      glow.addColorStop(1, 'rgba(80, 220, 180, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(fx - f.size * 6, fy - f.size * 6, f.size * 12, f.size * 12);

      ctx.beginPath();
      ctx.arc(fx, fy, f.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150, 255, 220, ${brightness})`;
      ctx.fill();
    });
  }

  function drawCurvedBlade(x, baseY, height, width, lean, color1, color2) {
    const sway = Math.sin(time * 0.015 + x * 0.01) * 8 * (height / 200);
    ctx.beginPath();
    const tipX = x + lean + sway;
    const tipY = baseY - height;
    const cpx = x + lean * 0.3 + sway * 0.3;
    const cpy = baseY - height * 0.5;
    ctx.moveTo(x - width / 2, baseY);
    ctx.quadraticCurveTo(cpx - width * 0.3, cpy, tipX, tipY);
    ctx.quadraticCurveTo(cpx + width * 0.3, cpy, x + width / 2, baseY);
    ctx.closePath();
    const grad = ctx.createLinearGradient(x, baseY, tipX, tipY);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // Pre-generate grass data so it doesn't flicker
  let grassBlades = null;
  function generateGrass() {
    grassBlades = [];
    const cx = canvas.width / 2;
    for (let i = 0; i < 55; i++) {
      const spread = (Math.random() - 0.5) * canvas.width * 0.5;
      const x = cx + spread;
      const h = Math.random() * 140 + 50;
      const lean = (spread / canvas.width) * 70 + (Math.random() - 0.5) * 20;
      const w = Math.random() * 5 + 3;
      const depth = Math.abs(spread) / (canvas.width * 0.3);
      const brightness = 1 - depth * 0.35;
      const g1 = `rgb(${Math.floor(15 * brightness)}, ${Math.floor(60 * brightness)}, ${Math.floor(30 * brightness)})`;
      const g2 = `rgb(${Math.floor(30 * brightness)}, ${Math.floor((100 + Math.random() * 60) * brightness)}, ${Math.floor(50 * brightness)})`;
      grassBlades.push({ x, h, lean, w, g1, g2, depth });
    }
    grassBlades.sort((a, b) => b.depth - a.depth);
  }

  function drawGrass(baseY) {
    if (!grassBlades) generateGrass();
    grassBlades.forEach(g => {
      drawCurvedBlade(g.x, baseY, g.h, g.w, g.lean, g.g1, g.g2);
    });
  }

  function drawLeaf(cx, cy, angle, length, width, color1, color2, flip) {
    const sway = Math.sin(time * 0.012 + cx * 0.005) * 3;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((angle + sway * 0.02) * Math.PI / 180);
    if (flip) ctx.scale(-1, 1);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(width * 0.8, -length * 0.3, width * 0.6, -length * 0.7, 0, -length);
    ctx.bezierCurveTo(-width * 0.6, -length * 0.7, -width * 0.8, -length * 0.3, 0, 0);
    const grad = ctx.createLinearGradient(0, 0, 0, -length);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Vein
    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.quadraticCurveTo(1, -length * 0.5, 0, -length + 5);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function drawStem(x1, y1, x2, y2, cpx, cpy, width) {
    const sway = Math.sin(time * 0.012 + x1 * 0.01) * 5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cpx + sway * 0.5, cpy, x2 + sway, y2);
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, '#0d6b5e');
    grad.addColorStop(0.5, '#14a085');
    grad.addColorStop(1, '#1ec49a');
    ctx.strokeStyle = grad;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  function drawFlowerHead(x, y, petalCount, petalLen, petalWid) {
    const sway = Math.sin(time * 0.012 + x * 0.01) * 5;
    const fx = x + sway;
    const fy = y;
    const pulse = Math.sin(time * 0.03) * 0.05 + 1;

    // Outer glow
    const outerGlow = ctx.createRadialGradient(fx, fy, 0, fx, fy, petalLen * 2.5);
    outerGlow.addColorStop(0, 'rgba(253, 224, 71, 0.18)');
    outerGlow.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(fx, fy, petalLen * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Petals
    for (let i = 0; i < petalCount; i++) {
      const angle = (Math.PI * 2 / petalCount) * i - Math.PI / 2;
      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(angle);
      ctx.scale(pulse, pulse);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(petalWid, -petalLen * 0.3, petalWid * 0.8, -petalLen * 0.8, 0, -petalLen);
      ctx.bezierCurveTo(-petalWid * 0.8, -petalLen * 0.8, -petalWid, -petalLen * 0.3, 0, 0);

      const petalGrad = ctx.createLinearGradient(0, 0, 0, -petalLen);
      petalGrad.addColorStop(0, '#d4a017');
      petalGrad.addColorStop(0.3, '#f5d030');
      petalGrad.addColorStop(0.7, '#fde68a');
      petalGrad.addColorStop(1, '#fef9c3');
      ctx.fillStyle = petalGrad;
      ctx.fill();
      ctx.restore();
    }

    // Center glow
    const centerGlow = ctx.createRadialGradient(fx, fy, 0, fx, fy, petalLen * 0.6);
    centerGlow.addColorStop(0, 'rgba(255, 255, 240, 0.9)');
    centerGlow.addColorStop(0.4, 'rgba(253, 224, 71, 0.6)');
    centerGlow.addColorStop(1, 'rgba(234, 179, 8, 0)');
    ctx.fillStyle = centerGlow;
    ctx.beginPath();
    ctx.arc(fx, fy, petalLen * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Center disc
    const discGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, petalLen * 0.28);
    discGrad.addColorStop(0, '#fef9c3');
    discGrad.addColorStop(0.5, '#fde047');
    discGrad.addColorStop(1, '#ca8a04');
    ctx.fillStyle = discGrad;
    ctx.beginPath();
    ctx.arc(fx, fy, petalLen * 0.28, 0, Math.PI * 2);
    ctx.fill();

    // White reflection
    ctx.beginPath();
    ctx.ellipse(fx, fy + petalLen * 0.12, petalLen * 0.18, petalLen * 0.06, 0, 0, Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fill();
  }

  function draw() {
    time++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGradientBackground();
    drawFireflies();

    const cx = canvas.width / 2;
    const baseY = canvas.height * 0.85;
    const s = Math.min(canvas.width / 800, canvas.height / 600) * 1.5; // Scale factor

    drawGrass(baseY);

    // Teal/green leaves at base
    drawLeaf(cx - 60*s, baseY - 30*s, -30, 130*s, 55*s, '#0d5c5c', '#1a9a8a', false);
    drawLeaf(cx - 90*s, baseY - 10*s, -50, 110*s, 50*s, '#0a4e3c', '#12906a', false);
    drawLeaf(cx - 40*s, baseY - 50*s, -15, 100*s, 45*s, '#0f6b5e', '#2dd4bf', false);
    drawLeaf(cx - 120*s, baseY - 5*s, -65, 90*s, 40*s, '#064e3b', '#10b981', false);
    drawLeaf(cx + 60*s, baseY - 30*s, 30, 130*s, 55*s, '#0d5c5c', '#1a9a8a', true);
    drawLeaf(cx + 90*s, baseY - 10*s, 50, 110*s, 50*s, '#0a4e3c', '#12906a', true);
    drawLeaf(cx + 40*s, baseY - 50*s, 15, 100*s, 45*s, '#0f6b5e', '#2dd4bf', true);
    drawLeaf(cx + 120*s, baseY - 5*s, 65, 90*s, 40*s, '#064e3b', '#10b981', true);

    // Small leaves on stems
    drawLeaf(cx - 30*s, baseY - 150*s, -20, 50*s, 22*s, '#15803d', '#4ade80', false);
    drawLeaf(cx + 25*s, baseY - 180*s, 15, 45*s, 20*s, '#15803d', '#4ade80', true);
    drawLeaf(cx - 70*s, baseY - 120*s, -35, 55*s, 24*s, '#0d6b5e', '#2dd4bf', false);
    drawLeaf(cx + 65*s, baseY - 100*s, 30, 50*s, 22*s, '#0d6b5e', '#2dd4bf', true);
    drawLeaf(cx, baseY - 200*s, 5, 40*s, 18*s, '#15803d', '#4ade80', false);
    drawLeaf(cx - 15*s, baseY - 230*s, -10, 35*s, 16*s, '#15803d', '#4ade80', true);

    // Stems
    drawStem(cx, baseY - 40*s, cx, baseY - 350*s, cx, baseY - 180*s, 6*s);
    drawStem(cx - 15*s, baseY - 40*s, cx - 120*s, baseY - 270*s, cx - 60*s, baseY - 160*s, 5*s);
    drawStem(cx + 15*s, baseY - 40*s, cx + 120*s, baseY - 270*s, cx + 60*s, baseY - 160*s, 5*s);

    // Flowers
    drawFlowerHead(cx, baseY - 360*s, 5, 45*s, 22*s);
    drawFlowerHead(cx - 120*s, baseY - 280*s, 5, 35*s, 18*s);
    drawFlowerHead(cx + 120*s, baseY - 280*s, 5, 35*s, 18*s);

    requestAnimationFrame(draw);
  }

  setTimeout(() => { resize(); generateGrass(); draw(); }, 300);
})();


// ===== 5. TYPING EFFECT =====
(function initTyping() {
  const output = document.getElementById('typed-output');
  if (!output) return;

  const phrases = [
    'Te amo, amorchi 💛',
    'Eres mi flor más bonita 🌻',
    'Mi vida contigo es más bonita ✨',
    'Amorcito, me haces tan feliz 🌼',
    'Cada día te amo más 💕',
    'Eres mi sol y mis estrellas ☀️',
    'Te regalo todas mis flores amarillas 🌻',
    'Amor, contigo todo es mejor 💛',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let pauseTimer = 0;

  function tick() {
    const current = phrases[phraseIdx];

    if (!isDeleting) {
      output.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        pauseTimer = 60; // pause at full phrase
        isDeleting = true;
      }
    } else {
      if (pauseTimer > 0) {
        pauseTimer--;
        requestAnimationFrame(tick);
        return;
      }
      output.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    const speed = isDeleting ? 30 : 65;
    setTimeout(() => requestAnimationFrame(tick), speed);
  }

  setTimeout(tick, 1500);
})();


// ===== 6. SCROLL ANIMATIONS =====
(function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const anim = el.dataset.animate;

        if (anim === 'fade') {
          el.classList.add('visible');
        } else if (anim === 'stagger') {
          // Stagger siblings
          const parent = el.parentElement;
          const siblings = [...parent.querySelectorAll('[data-animate="stagger"]')];
          siblings.forEach((sib, i) => {
            setTimeout(() => sib.classList.add('visible'), i * 120);
          });
          // Unobserve all siblings
          siblings.forEach(sib => observer.unobserve(sib));
          return;
        }

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
})();


// ===== 7. LOVE LETTER HEARTS =====
(function initLetterHearts() {
  const container = document.getElementById('letter-hearts');
  if (!container) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const hearts = ['💛', '🌻', '💛', '🌼', '💛'];
        hearts.forEach((h, i) => {
          const span = document.createElement('span');
          span.textContent = h;
          span.style.animationDelay = (0.8 + i * 0.2) + 's';
          container.appendChild(span);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(container);
})();





// ===== 9. FLOWER CARD POPUPS =====
(function initPopups() {
  const data = {
    girasol: { emoji: '🌻', text: '¡El girasol siempre busca la luz! Como tú, mi amorchi, que iluminas todo a tu alrededor. Regalar un girasol es decir: "Eres mi sol".' },
    rosa: { emoji: '🌹', text: '¡La rosa amarilla es el símbolo de nuestro amor! Regalarla es decir: "Eres mi persona favorita en este mundo, amorcito".' },
    tulipan: { emoji: '🌷', text: '¡El tulipán amarillo representa la alegría! Es una promesa de días felices juntos, amor mío.' },
    margarita: { emoji: '🌼', text: '¡La margarita es la flor de la inocencia! Su belleza simple y perfecta me recuerda a ti, mi amor.' },
  };

  const popup = document.getElementById('popup');
  const overlay = document.getElementById('popup-overlay');
  const pEmoji = document.getElementById('popup-emoji');
  const pText = document.getElementById('popup-text');
  const pClose = document.getElementById('popup-close');

  function open(flower) {
    const d = data[flower];
    if (!d) return;
    pEmoji.textContent = d.emoji;
    pText.textContent = d.text;
    popup.classList.add('active');
    overlay.classList.add('active');
  }

  function close() {
    popup.classList.remove('active');
    overlay.classList.remove('active');
  }

  document.querySelectorAll('.flower-card').forEach(card => {
    card.addEventListener('click', () => {
      const rect = card.getBoundingClientRect();
      if (window.burstPetals) window.burstPetals(rect.left + rect.width / 2, rect.top, 25);
      open(card.dataset.flower);
    });
  });

  pClose.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();


// ===== 10. BLOOM BUTTON =====
(function initBloom() {
  const btn = document.getElementById('bloom-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const rect = btn.getBoundingClientRect();
    if (window.burstPetals) window.burstPetals(rect.left + rect.width / 2, rect.top, 80);
    btn.style.transform = 'scale(0.92)';
    setTimeout(() => { btn.style.transform = 'scale(1.08)'; }, 120);
    setTimeout(() => { btn.style.transform = ''; }, 300);
  });
})();
