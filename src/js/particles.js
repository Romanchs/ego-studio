/**
 * Luxury Gold Dust & Sparkles Canvas Particle System
 * High performance, interactive mouse/touch reaction, twinkling glow
 */

export function initParticles(canvasId = 'gold-particles-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;
  let particles = [];
  let sparkles = [];
  const PARTICLE_COUNT = 65;

  const mouse = {
    x: null,
    y: null,
    radius: 100,
    isInteracting: false,
  };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.size = Math.random() * 2.2 + 0.8;
      this.baseAlpha = Math.random() * 0.5 + 0.3;
      this.alpha = this.baseAlpha;
      this.speedY = Math.random() * 0.35 + 0.15;
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.twinkleSpeed = Math.random() * 0.03 + 0.01;
      this.twinkleOffset = Math.random() * Math.PI * 2;
      
      // Luxury warm gold palette
      const goldTones = [
        '#f7e2a9',
        '#dfb976',
        '#c59b27',
        '#fbeac7',
        '#e8caa4'
      ];
      this.color = goldTones[Math.floor(Math.random() * goldTones.length)];
    }

    update(time) {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(time * 0.001 + this.twinkleOffset) * 0.15;

      // Twinkle effect
      this.alpha = this.baseAlpha + Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.25;
      this.alpha = Math.max(0.1, Math.min(0.9, this.alpha));

      // Touch / mouse interaction: gentle repulsion / glow
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 1.5;
          this.x -= (dx / dist) * force;
          this.y -= (dy / dist) * force;
          this.alpha = Math.min(1, this.alpha + 0.3);
        }
      }

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.shadowColor = '#ecc37c';
      ctx.shadowBlur = this.size * 3;
      ctx.fill();
      ctx.restore();
    }
  }

  class Sparkle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2 - 0.5;
      this.size = Math.random() * 2 + 1;
      this.life = 1;
      this.decay = Math.random() * 0.03 + 0.02;
      this.color = '#fff6d6';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
    }

    draw() {
      if (this.life <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.life;
      ctx.shadowColor = '#fbeac7';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function addSparkles(x, y, count = 3) {
    for (let i = 0; i < count; i++) {
      sparkles.push(new Sparkle(x, y));
    }
  }

  function animate(timestamp) {
    ctx.clearRect(0, 0, width, height);

    // Update & draw background dust particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update(timestamp);
      particles[i].draw();
    }

    // Update & draw trailing interactive sparkles
    for (let i = sparkles.length - 1; i >= 0; i--) {
      sparkles[i].update();
      sparkles[i].draw();
      if (sparkles[i].life <= 0) {
        sparkles.splice(i, 1);
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  // Event handlers for interactivity
  function handlePointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.isInteracting = true;
    if (Math.random() > 0.6) {
      addSparkles(mouse.x, mouse.y, 1);
    }
  }

  function handleTouchMove(e) {
    if (e.touches && e.touches[0]) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      mouse.isInteracting = true;
      if (Math.random() > 0.5) {
        addSparkles(mouse.x, mouse.y, 2);
      }
    }
  }

  function handlePointerLeave() {
    mouse.x = null;
    mouse.y = null;
    mouse.isInteracting = false;
  }

  function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addSparkles(x, y, 8);
  }

  window.addEventListener('resize', resize);
  
  const container = canvas.parentElement || window;
  container.addEventListener('mousemove', handlePointerMove);
  container.addEventListener('touchmove', handleTouchMove, { passive: true });
  container.addEventListener('mouseleave', handlePointerLeave);
  container.addEventListener('touchend', handlePointerLeave);
  container.addEventListener('click', handleClick);

  init();
  animationFrameId = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resize);
    container.removeEventListener('mousemove', handlePointerMove);
    container.removeEventListener('touchmove', handleTouchMove);
    container.removeEventListener('mouseleave', handlePointerLeave);
    container.removeEventListener('touchend', handlePointerLeave);
    container.removeEventListener('click', handleClick);
  };
}
