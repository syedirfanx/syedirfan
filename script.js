// Initialize everything
// Ensure critical functions are globally available
window.showToast = showToast;
window.openMobileMenu = openMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.toggleDropdown = toggleDropdown;
window.selectCategory = selectCategory;
window.selectStack = selectStack;
window.resetFilters = resetFilters;
window.filterByCategory = filterByCategory;
window.filterByStack = filterByStack;
window.updateResetButton = updateResetButton;
window.generateProjectPortfolioPDF = generateProjectPortfolioPDF;
window.generateCVPDF = generateCVPDF;
window.openVideoIntro = openVideoIntro;
window.closeVideoIntro = closeVideoIntro;
window.scrollToSlideId = scrollToSlideId;

// Smooth slide navigation
function scrollToSlideId(id) {
  const el = document.getElementById(id);
  if (el) {
    const isDesktopSnap = window.matchMedia('(min-width: 1024px) and (min-height: 750px)').matches;
    if (isDesktopSnap) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 64;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      // Subtract the header height + a 24px aesthetic buffer to ensure perfect, comfortable alignment
      const offsetPosition = elementPosition - headerHeight - 24;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}

// Dynamic indicator dots observer
function initSlideObserver() {
  const dots = {
    'slide-welcome': document.getElementById('dot-slide-welcome'),
    'slide-focus': document.getElementById('dot-slide-focus'),
    'slide-highlights': document.getElementById('dot-slide-highlights'),
    'slide-projects': document.getElementById('dot-slide-projects')
  };

  // Only run if welcome slide actually exists (homepage-specific)
  if (!dots['slide-welcome']) return;

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -30% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('slide-active');
        const id = entry.target.id;
        Object.entries(dots).forEach(([key, dot]) => {
          if (dot) {
            dot.classList.remove('bg-white', 'scale-125');
            dot.classList.add('bg-zinc-800');
          }
        });
        const activeDot = dots[id];
        if (activeDot) {
          activeDot.classList.remove('bg-zinc-800');
          activeDot.classList.add('bg-white', 'scale-125');
        }
      } else {
        entry.target.classList.remove('slide-active');
      }
    });
  }, observerOptions);

  ['slide-welcome', 'slide-focus', 'slide-highlights', 'slide-projects'].forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize loader first
  initPageLoader();

  // Mobile menu should be initialized first as it's critical for navigation
  try {
    initMobileMenu();
  } catch (e) {
    console.error('Mobile menu init failed:', e);
  }

  try {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  } catch (e) {
    console.error('Lucide icons init failed:', e);
  }

  try {
    initStars();
  } catch (e) {
    console.error('Stars init failed:', e);
  }

  try {
    initPortraitMilkyway();
  } catch (e) {
    console.error('Portrait MilkyWay init failed:', e);
  }

  try {
    initWishes();
  } catch (e) {
    console.error('Wishes init failed:', e);
  }

  try {
    initSlideObserver();
  } catch (e) {
    console.error('Slide observer init failed:', e);
  }

  try {
    initNebulaCanvas();
  } catch (e) {
    console.error('Nebula canvas init failed:', e);
  }
});

// Interactive Ambient Canvas (The Nebula) Particle System
function initNebulaCanvas() {
  const canvas = document.getElementById('nebula-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrameId = null;
  const mouse = { x: null, y: null, radius: 220, active: false };

  const parent = canvas.parentElement;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = parent.clientHeight;
    initParticles();
  }

  const resizeObserver = new ResizeObserver(() => {
    resize();
  });
  resizeObserver.observe(parent);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.18; // elegant slow drift
      this.vy = (Math.random() - 0.5) * 0.18;
      this.radius = Math.random() * 1.5 + 0.6;
      this.baseAlpha = Math.random() * 0.2 + 0.12;
      this.alpha = this.baseAlpha;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      if (mouse.active && mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          // Soft magnetic pull towards mouse cursor
          this.x += dx * force * 0.008;
          this.y += dy * force * 0.008;
          this.alpha = Math.min(0.7, this.baseAlpha + force * 0.35);
        } else {
          if (this.alpha > this.baseAlpha) {
            this.alpha -= 0.005;
          }
        }
      } else {
        if (this.alpha > this.baseAlpha) {
          this.alpha -= 0.005;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const area = canvas.width * canvas.height;
    const density = Math.min(100, Math.floor(area / 12000));
    for (let i = 0; i < density; i++) {
      particles.push(new Particle());
    }
  }

  // Draw cybernetic 3D mesh grid mimicking Terafab.ai
  function drawWarpedGrid() {
    const gridSpacing = 48;
    const padding = 60;
    const cols = Math.ceil((canvas.width + padding * 2) / gridSpacing);
    const rows = Math.ceil((canvas.height + padding * 2) / gridSpacing);

    // Calculate warped point coordinate based on physical interaction
    const getWarpedPoint = (x, y) => {
      if (!mouse.active || mouse.x === null || mouse.y === null) {
        return { x, y, glow: 0 };
      }
      const dx = x - mouse.x;
      const dy = y - mouse.y;
      const dist = Math.hypot(dx, dy);
      const warpRadius = 240;
      
      if (dist < warpRadius) {
        const force = (warpRadius - dist) / warpRadius;
        const intensity = Math.sin(force * Math.PI); // beautiful smooth curve
        const displacement = intensity * -20; // elegant physical gravitational indentation
        const angle = Math.atan2(dy, dx);
        return {
          x: x + Math.cos(angle) * displacement,
          y: y + Math.sin(angle) * displacement,
          glow: intensity
        };
      }
      return { x, y, glow: 0 };
    };

    // Draw horizontal grid lines
    for (let r = 0; r < rows; r++) {
      const py = r * gridSpacing - padding;
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        const px = c * gridSpacing - padding;
        const pt = getWarpedPoint(px, py);
        if (c === 0) {
          ctx.moveTo(pt.x, pt.y);
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)'; // base subtle cyber layout line
      ctx.lineWidth = 0.45;
      ctx.stroke();
    }

    // Draw vertical grid lines
    for (let c = 0; c < cols; c++) {
      const px = c * gridSpacing - padding;
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        const py = r * gridSpacing - padding;
        const pt = getWarpedPoint(px, py);
        if (r === 0) {
          ctx.moveTo(pt.x, pt.y);
        } else {
          ctx.lineTo(pt.x, pt.y);
        }
      }
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
      ctx.lineWidth = 0.45;
      ctx.stroke();
    }

    // Highlight active nodes at grid intersections near mouse
    if (mouse.active && mouse.x !== null && mouse.y !== null) {
      const startC = Math.max(0, Math.floor((mouse.x - 240 + padding) / gridSpacing));
      const endC = Math.min(cols, Math.ceil((mouse.x + 240 + padding) / gridSpacing));
      const startR = Math.max(0, Math.floor((mouse.y - 240 + padding) / gridSpacing));
      const endR = Math.min(rows, Math.ceil((mouse.y + 240 + padding) / gridSpacing));

      for (let c = startC; c < endC; c++) {
        for (let r = startR; r < endR; r++) {
          const px = c * gridSpacing - padding;
          const py = r * gridSpacing - padding;
          const pt = getWarpedPoint(px, py);
          if (pt.glow > 0.1) {
            // Draw a subtle high-tech dot at warped intersection
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.35 * pt.glow, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(14, 165, 233, ${pt.glow * 0.18})`;
            ctx.fill();
          }
        }
      }
    }
  }

  function connectParticles() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDist) {
          let alpha = (1 - dist / maxDist) * 0.1;
          if (mouse.active && mouse.x !== null && mouse.y !== null) {
            const mDist = Math.hypot(mouse.x - particles[i].x, mouse.y - particles[i].y);
            if (mDist < mouse.radius) {
              const boost = (1 - mDist / mouse.radius);
              alpha *= (1.5 + boost * 1.5);
            }
          }
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(14, 165, 233, ${Math.min(0.35, alpha)})`;
          ctx.lineWidth = 0.55;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw glowing spotlight under the grid
    if (mouse.active && mouse.x !== null && mouse.y !== null) {
      const gradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, 240
      );
      gradient.addColorStop(0, 'rgba(14, 165, 233, 0.06)'); // sky cyan spotlight core
      gradient.addColorStop(0.5, 'rgba(14, 165, 233, 0.02)'); // soft glow bloom
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // fade out
      
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 240, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // 1. Draw Mesh Fabric Grid (Warped Space)
    drawWarpedGrid();

    // 2. Clearer and sharper stars
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    
    // 3. Glowing neural connections
    connectParticles();

    animationFrameId = requestAnimationFrame(animate);
  }

  parent.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  parent.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  parent.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      mouse.active = true;
    }
  }, { passive: true });

  parent.addEventListener('touchend', () => {
    mouse.active = false;
  });

  resize();
  animate();
}

// Toast Notification System
function showToast(message, title = 'Access Restricted') {
  // Remove existing toast if any
  const existingToast = document.querySelector('.custom-toast');
  if (existingToast) existingToast.remove();

  const overlay = document.createElement('div');
  overlay.className = 'custom-toast fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm';
  overlay.style.animation = 'fadeIn 0.3s ease-out forwards';
  
  overlay.innerHTML = `
    <div class="bg-zinc-950 border border-zinc-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-4 transform transition-all" style="animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards">
      <div class="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <div class="space-y-2">
        <h4 class="text-white font-bold tracking-tight">${title}</h4>
        <p class="text-zinc-400 text-sm leading-relaxed">${message}</p>
      </div>
      <button onclick="this.closest('.custom-toast').remove()" class="w-full py-3 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors">
        Understood
      </button>
    </div>
  `;
  
  document.body.appendChild(overlay);

  // Auto-remove after 5 seconds if not clicked
  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.5s ease';
      setTimeout(() => overlay.remove(), 500);
    }
  }, 5000);
}
function openMobileMenu(e) {
  const mobileMenu = document.getElementById('mobile-menu');
  if (!mobileMenu) return;
  if (e) e.preventDefault();
  
  mobileMenu.classList.remove('hidden');
  mobileMenu.style.display = 'flex'; // Force display flex
  document.body.style.overflow = 'hidden';
  
  // Push state for back button support
  if (!history.state || history.state.modal !== 'menu') {
    history.pushState({ modal: 'menu' }, '');
  }
}

function closeMobileMenu(fromPopState = false) {
  const mobileMenu = document.getElementById('mobile-menu');
  if (!mobileMenu) return;
  
  mobileMenu.classList.add('hidden');
  mobileMenu.style.display = 'none'; // Force display none
  document.body.style.overflow = 'auto';
  
  // If closed via UI (not back button), and state exists, go back
  if (!fromPopState && history.state && history.state.modal === 'menu') {
    history.back();
  }
}

function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menuCloseBtn = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!menuBtn || !mobileMenu) {
    console.warn('Mobile menu elements not found');
    return;
  }

  menuBtn.addEventListener('click', openMobileMenu);

  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', () => closeMobileMenu());
  }

  // Close menu on link click
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => closeMobileMenu());
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      closeMobileMenu();
    }
  });
}

// Page Loader Logic
function initPageLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  // Hide loader on initial load
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 500);
  });

  // Handle back-forward cache (bfcache)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      loader.classList.add('hidden');
    }
  });

  // Fallback if window load doesn't fire or takes too long
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 2500);

  // Show loader on link clicks
  document.querySelectorAll('a').forEach(link => {
    // Only for internal links
    const href = link.getAttribute('href');
    if (href && 
        !href.startsWith('http') && 
        !href.startsWith('#') && 
        !href.startsWith('mailto:') && 
        !href.startsWith('tel:') && 
        !link.getAttribute('target') &&
        !link.hasAttribute('download')) {
      link.addEventListener('click', (e) => {
        const targetHref = link.href;
        
        // Don't show loader if it's the same page
        if (targetHref === window.location.href) return;

        e.preventDefault();
        loader.classList.remove('hidden');
        
        setTimeout(() => {
          window.location.href = targetHref;
        }, 400);
      });
    }
  });
}

// Star Background Animation
function initStars() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let stars = [];
  const starCount = 400;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resize);
  resize();
  
  class Star {
    constructor() {
      this.reset();
    }
    
    reset() {
      // Center of orbit is bottom right
      const cx = canvas.width;
      const cy = canvas.height;
      
      this.angle = Math.random() * Math.PI * 2;
      this.radius = Math.random() * Math.sqrt(cx * cx + cy * cy);
      // Parallax effect: further stars move slower
      this.speed = (Math.random() * 0.00015 + 0.00005) * (1 - this.radius / (canvas.width * 1.5));
      
      this.baseSize = Math.random() * 1.2 + 0.3;
      this.size = this.baseSize;
      
      // Twinkle properties
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.twinkleSpeed = (Math.random() * 0.04 + 0.01);
      this.opacity = Math.random() * 0.5 + 0.2;
      
      const colors = [
        '255, 255, 255', // Pure White
        '210, 230, 255', // Ice Blue
        '255, 240, 220', // Warm White
        '180, 210, 255', // Deep Sky Blue
        '255, 255, 200'  // Pale Gold
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
      this.angle -= this.speed;
      
      this.x = canvas.width + Math.cos(this.angle) * this.radius;
      this.y = canvas.height + Math.sin(this.angle) * this.radius;
      
      // Pulsing/Twinkling logic
      this.twinklePhase += this.twinkleSpeed;
      const pulse = Math.sin(this.twinklePhase);
      this.opacity = 0.4 + pulse * 0.3;
      this.size = this.baseSize * (1 + pulse * 0.2);
    }
    
    draw() {
      // Visibility check
      if (this.x < -50 || this.y < -50 || this.x > canvas.width + 50 || this.y > canvas.height + 50) return;

      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      // glow for brighter stars
      if (this.size > 1.1 && this.opacity > 0.6) {
        ctx.shadowBlur = this.size * 3;
        ctx.shadowColor = `rgba(${this.color}, ${this.opacity * 0.4})`;
      } else {
        ctx.shadowBlur = 0;
      }
    }
  }

  class Galaxy {
    constructor() {
      this.reset();
    }

    reset() {
      const cx = canvas.width;
      const cy = canvas.height;
      this.angle = Math.random() * Math.PI * 2;
      this.radius = Math.random() * canvas.width * 0.8;
      this.speed = (0.00004 + Math.random() * 0.00004);
      this.size = Math.random() * 40 + 60;
      this.rotation = Math.random() * Math.PI * 2;
      this.opacity = Math.random() * 0.15 + 0.05;
      
      const colors = ['180, 200, 255', '255, 200, 255', '200, 255, 255'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.angle -= this.speed;
      this.x = canvas.width + Math.cos(this.angle) * this.radius;
      this.y = canvas.height + Math.sin(this.angle) * this.radius;
    }

    draw() {
      if (this.x < -this.size || this.y < -this.size || this.x > canvas.width + this.size || this.y > canvas.height + this.size) return;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
      gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
      gradient.addColorStop(0.4, `rgba(${this.color}, ${this.opacity * 0.4})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.scale(2, 0.6); // Oval spiral shape
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
  }

  class Planet {
    constructor() {
      this.reset();
    }

    reset() {
      const cx = canvas.width;
      const cy = canvas.height;
      this.angle = Math.random() * Math.PI * 2;
      this.radius = canvas.width * 0.8 + Math.random() * canvas.width * 0.5;
      this.speed = (0.00002 + Math.random() * 0.00003);
      this.size = Math.random() * 15 + 10;
      
      const planetColors = [
        '#2a4d69', // Deep Blue
        '#63ace5', // Light Blue
        '#adcbe3', // Pale Blue
        '#e7d3d3', // Dusty Rose
        '#4b3832'  // Deep Brown
      ];
      this.color = planetColors[Math.floor(Math.random() * planetColors.length)];
      this.opacity = 0.4 + Math.random() * 0.3;
    }

    update() {
      this.angle -= this.speed;
      this.x = canvas.width + Math.cos(this.angle) * this.radius;
      this.y = canvas.height + Math.sin(this.angle) * this.radius;
    }

    draw() {
      if (this.x < -this.size || this.y < -this.size || this.x > canvas.width + this.size || this.y > canvas.height + this.size) return;

      const gradient = ctx.createRadialGradient(
        this.x - this.size * 0.3, this.y - this.size * 0.3, 0,
        this.x, this.y, this.size
      );
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, 'rgba(0,0,0,0.8)');

      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.shadowBlur = 20;
      ctx.shadowColor = this.color;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Comet {
    constructor() {
      this.reset();
    }

    reset() {
      this.active = false;
      this.waitTime = Math.random() * 40000 + 20000;
      this.startTime = Date.now() + this.waitTime;
      
      this.x = -100;
      this.y = Math.random() * (canvas.height * 0.5);
      this.speed = Math.random() * 0.2 + 0.1;
      this.size = Math.random() * 2 + 1;
      this.length = Math.random() * 100 + 150;
    }

    update() {
      if (!this.active) {
        if (Date.now() > this.startTime) this.active = true;
        return;
      }

      this.x += this.speed;
      this.y += this.speed * 0.3;

      if (this.x > canvas.width + this.length) this.reset();
    }

    draw() {
      if (!this.active) return;

      const gradient = ctx.createLinearGradient(this.x, this.y, this.x - this.length, this.y - this.length * 0.3);
      gradient.addColorStop(0, 'rgba(200, 220, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(100, 150, 255, 0)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = this.size;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.length, this.y - this.length * 0.3);
      ctx.stroke();

      // Nucleus
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class ShootingStar {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * (canvas.height * 0.5);
      this.len = Math.random() * 80 + 20;
      this.speed = Math.random() * 15 + 10;
      this.opacity = 0;
      this.angle = (Math.PI / 4) + (Math.random() * 0.1 - 0.05); 
      this.active = false;
      this.waitTime = Math.random() * 20000 + 10000;
      this.startTime = Date.now() + this.waitTime;
    }

    update() {
      if (!this.active) {
        if (Date.now() > this.startTime) {
          this.active = true;
        }
        return;
      }

      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.opacity += 0.01;

      if (this.x > canvas.width + this.len || this.y > canvas.height + this.len) {
        this.reset();
      }
    }

    draw() {
      if (!this.active) return;
      
      const grad = ctx.createLinearGradient(
        this.x, this.y,
        this.x - Math.cos(this.angle) * this.len,
        this.y - Math.sin(this.angle) * this.len
      );
      
      grad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(this.opacity, 0.4)})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - Math.cos(this.angle) * this.len, this.y - Math.sin(this.angle) * this.len);
      ctx.stroke();
    }
  }

  for (let i = 0; i < starCount; i++) {
    stars.push(new Star());
  }

  const shootingStars = Array.from({ length: 2 }, () => new ShootingStar());
  const planets = Array.from({ length: 3 }, () => new Planet());
  const galaxies = Array.from({ length: 2 }, () => new Galaxy());
  const comets = Array.from({ length: 1 }, () => new Comet());
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    galaxies.forEach(galaxy => {
      galaxy.update();
      galaxy.draw();
    });

    planets.forEach(planet => {
      planet.update();
      planet.draw();
    });

    stars.forEach(star => {
      star.update();
      star.draw();
    });

    comets.forEach(comet => {
      comet.update();
      comet.draw();
    });
    
    shootingStars.forEach(sStar => {
      sStar.update();
      sStar.draw();
    });

    requestAnimationFrame(animate);
  }
  
  animate();
}

// Dynamic Milky Way Diagonal Stardust Backdrop for Syed Irfan's portrait
function initPortraitMilkyway() {
  const canvas = document.getElementById('portrait-milkyway-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let stars = [];
  const starCount = 1400; // Dense cluster of thousands of tiny stars representing the Milky Way
  
  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    // Expand the canvas bounds beyond the container circle to let the stardust spill out elegantly
    canvas.width = rect.width + 192; // +192px spill width
    canvas.height = rect.height + 192; // +192px spill height
    // Center alignment offsets
    canvas.style.transform = `translate(-96px, -96px)`;
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  class MilkyStar {
    constructor() {
      this.reset();
      this.twinklePhase = Math.random() * Math.PI * 2;
    }
    
    reset(isRegen = false) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Uniform angle in all directions to completely eliminate any aligned line appearance
      const theta = Math.random() * Math.PI * 2;
      
      // Distance from center: higher density around the center/portrait boundary, fading out radially
      const maxRadius = Math.max(canvas.width, canvas.height) * 0.8;
      const r = Math.pow(Math.random(), 1.35) * maxRadius;
      
      this.x = centerX + Math.cos(theta) * r;
      this.y = centerY + Math.sin(theta) * r;
      
      // Extremely tiny micro-stardust to resemble a real milky way from a distance
      const randType = Math.random();
      if (randType < 0.92) {
        this.baseSize = Math.random() * 0.45 + 0.15; // Tiny micro-dust (0.15px to 0.6px)
      } else {
        this.baseSize = Math.random() * 0.55 + 0.6; // Subtle glisten (0.6px to 1.15px)
      }
      this.size = this.baseSize;
      
      this.twinkleSpeed = Math.random() * 0.03 + 0.01;
      this.baseOpacity = Math.random() * 0.7 + 0.15;
      this.opacity = this.baseOpacity;
      
      // Palette resembling soft, rich cosmic neutral/white tones matching the background without any cyan
      const colors = [
        '255, 255, 255', // Pure White
        '244, 244, 245', // Zinc 100 white-silver
        '228, 228, 231', // Zinc 200 soft silver
        '255, 250, 240', // Floral cream
        '255, 248, 220'  // Warm Cosmic cream
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
      this.twinklePhase += this.twinkleSpeed;
      const pulse = Math.sin(this.twinklePhase);
      this.opacity = Math.max(0.1, this.baseOpacity + pulse * 0.3);
      this.size = this.baseSize * (1 + pulse * 0.15);
      
      // Slow micro-drift simulating cosmic orbital flow
      this.x += 0.02;
      this.y -= 0.02;
      
      // Reset if it flows completely off canvas bounds
      if (this.x > canvas.width + 100 || this.y < -100) {
        this.reset(true);
      }
    }
    
    draw() {
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Fill particle system buffer
  for (let i = 0; i < starCount; i++) {
    stars.push(new MilkyStar());
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
      star.update();
      star.draw();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

// Project Modal Logic
const projectsData = {
  'disease-classification': {
    title: 'Rice Leaf Disease Detection using Machine Learning Techniques',
    category: 'Publication',
    overview: 'This project presents a rice leaf disease detection system using machine learning approaches. Three of the most common rice plant diseases namely leaf smut, bacterial leaf blight and brown spot diseases are detected in this work. Clear images of affected rice leaves with white background were used as the input. After necessary pre-processing, the dataset was trained on with a range of different machine learning algorithms including that of KNN(K-Nearest Neighbour), J48(Decision Tree), Naive Bayes and Logistic Regression. Decision tree algorithm, after 10-fold cross validation, achieved an accuracy of over 97% when applied on the test dataset.',
    collaborators: ['Kawser Ahmed', 'Tasmia Rahman Shahidi', '<span class="text-white font-bold">Syed Irfan</span>', 'Sifat Momen'],
    github: 'closed',
    document: 'https://scholar.google.com/citations?view_op=list_works&hl=en&authuser=1&hl=en&user=MG9ta8wAAAAJ&authuser=1',
    tags: ['Machine Learning', 'Classification', 'Data Analysis']
  },
  'swarm-intelligence': {
    title: 'Feature Selection using Swarm Intelligence Techniques',
    category: 'MSc Thesis',
    overview: `
      <div class="space-y-4">
        <p>This project applies Particle Swarm Optimization (PSO) and Dispersive Flies Optimization (DFO) techniques for feature selection. The goal is to identify the optimal subset of features from a large dataset to improve classification accuracy in machine learning tasks.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Algorithm Implementation:</strong> Implemented PSO and DFO algorithms to select relevant features.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Dimensionality Reduction:</strong> Reduced dimensionality of datasets while enhancing model performance.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Performance Evaluation:</strong> Evaluated selected features on classification tasks to demonstrate accuracy improvements.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Language:</strong> Python</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Data Processing:</strong> NumPy, Pandas</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Machine Learning:</strong> Scikit-learn (for classification models)</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Optimization:</strong> Custom implementations of PSO and DFO</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>', 'Mohammad Majid al-Rifaie', 'Oroojeni MJ Hooman'],
    github: 'https://github.com/syedirfanx/swarm-intelligence',
    document: 'private',
    tags: ['Feature Engineering', 'Swarm Intelligence', 'Optimization']
  },
  'starpals-ai': {
    title: 'StarPals AI: Revolutionizing Talent Casting with Artificial Intelligence',
    category: 'Personal Innovation',
    overview: `
      <div class="space-y-4">
        <p>StarPals AI is a cutting-edge film casting platform that leverages advanced generative artificial intelligence to streamline the talent discovery process. It facilitates precise role-matching by analyzing actor profiles, scripts, and visual data through multi-modal learning.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">AI-Driven Profiling:</strong> Developed a platform for automated actor profiling, script analysis, and lookalike detection.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Intelligent Matching:</strong> Implemented precise role-matching algorithms using Generative AI and Natural Language Processing (NLP).</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Workflow Optimization:</strong> Streamlined the casting workflow for the entertainment industry with automated character extraction and visual similarity tools.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Generative AI:</strong> Google Gemini 2.5 Flash</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">AI Orchestration:</strong> Genkit</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Frameworks:</strong> Next.js 15 & React 19</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Language:</strong> TypeScript & Node.js</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">UI/UX:</strong> Tailwind CSS & Shadcn UI</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Database:</strong> In-memory MVP (Ready for Firebase Firestore integration)</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span> (Lead Developer)'],
    github: 'https://github.com/syedirfanx/StarPalsAI',
    document: 'https://github.com/syedirfanx/StarPalsAI/tree/main/documents',
    tags: ['Generative AI', 'NLP', 'Next.js', 'TypeScript']
  },
  'network-flow-optimization': {
    title: 'AI Network Flow Prediction and Resource Optimization',
    category: 'Personal Project',
    overview: `
      <div class="space-y-4">
        <p>An intelligent system designed to predict dynamic network traffic patterns and proactively allocate resources. This project addresses the reactive nature of traditional network systems by implementing a machine learning-based framework for predictive optimization.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Highlights</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Traffic Prediction:</strong> Implemented a Random Forest Regressor to estimate future network congestion with high precision.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Dynamic Resource Allocation:</strong> Developed a rule-based decision engine for load-adaptive routing and scaling.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Research Significance:</strong> Demonstrates proactive optimization in SDN, Network Traffic Engineering, and AI-driven communication systems.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">AI/ML:</strong> Random Forest Regressor, Scikit-learn</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">NetOps:</strong> Traffic Engineering & Resource Simulation</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Data Processing:</strong> Python, Pandas, NumPy</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Visualization:</strong> Matplotlib</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>'],
    github: 'https://github.com/syedirfanx/ai-network-traffic-optimization',
    document: 'https://github.com/syedirfanx/ai-network-traffic-optimization/blob/main/README.md',
    tags: ['AI', 'SDN', 'ML Optimization', 'Network Traffic', 'Network']
  },
  'face-mask-detector': {
    title: 'Face Mask Detection & Warning Systems',
    category: 'Industrial Project',
    overview: `
      <div class="space-y-6">
        <div class="space-y-4">
          <p>A real-time safety compliance system designed for public and industrial spaces. The platform utilizes deep learning models to detect face mask usage with high precision and trigger automated warnings for non-compliance.</p>
          
          <div class="aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 theme-photo-shade">
            <iframe 
              class="w-full h-full" 
              src="https://www.youtube.com/embed/kOOOnQBQ7Iw" 
              title="Face Mask Detection Showcase" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerpolicy="strict-origin-when-cross-origin" 
              allowfullscreen>
            </iframe>
          </div>
        </div>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Real-time Detection:</strong> Developed a high-accuracy system using Convolutional Neural Networks (CNN) to monitor public spaces.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Automated Alerts:</strong> Integrated a warning mechanism that triggers notifications or audio alerts upon detecting non-compliance.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Performance Optimization:</strong> Achieved 95% detection accuracy through extensive model training and optimization for edge deployment.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Deep Learning:</strong> CNN, TensorFlow/Keras</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Computer Vision:</strong> OpenCV</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Language:</strong> Python</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Deployment:</strong> Real-time Video Stream Processing</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span> (Lead Developer)', 'Sakib Mukter', 'Nafis Faysal'],
    github: 'closed',
    document: '#',
    tags: ['CNN', 'OpenCV', 'Deep Learning']
  },
  'id-card-ocr': {
    title: 'NID Card OCR System (Bangla & English)',
    category: 'Industrial Project',
    overview: `
      <div class="space-y-4">
        <p>An advanced OCR pipeline designed to extract both Bangla and English text from National ID cards. The system processes images to output structured JSON data, facilitating automated data entry for financial and governmental services.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Multi-Language Extraction:</strong> Developed a robust pipeline for extracting both Bangla and English text from complex National ID layouts.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Structured Data Output:</strong> Implemented post-processing logic to convert raw OCR text into structured JSON format for seamless integration.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Preprocessing Pipeline:</strong> Integrated image enhancement techniques to improve OCR accuracy on low-quality scans and photos.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">OCR Engine:</strong> Tesseract OCR</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Language:</strong> Python</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Image Processing:</strong> OpenCV</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Data Formatting:</strong> JSON Serialization</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span> (Lead Developer)', 'Nafis Faysal'],
    github: 'closed',
    document: '#',
    tags: ['OCR', 'Tesseract', 'python']
  },
  'flight-booking': {
    title: 'Flight Booking System',
    category: 'Academic Project',
    overview: `
      <div class="space-y-4">
        <p>A comprehensive web-based flight management system developed for the CSE 311 Database Systems course (Spring 2020). The platform facilitates seamless flight discovery, real-time status tracking, and secure reservation management through a robust relational database backend.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">User Management:</strong> Implemented secure user registration and login systems to manage passenger profiles and booking history.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Flight Discovery:</strong> Developed advanced search functionality allowing users to find flights based on specific criteria and check real-time flight status.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Reservation System:</strong> Built a complete booking workflow from seat selection to final reservation, ensuring data consistency across the flight database.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Backend:</strong> PHP</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Database:</strong> MySQL</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Frontend:</strong> HTML5 & CSS3</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Architecture:</strong> Relational Database Design</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span> (Project Lead)', 'Nafis Faysal', 'Tamanna Rahman'],
    github: 'https://github.com/syedirfanx/FlightBooking',
    document: '#',
    tags: ['Full Stack', 'Database Systems', 'PHP']
  },
  'crowdfunding': {
    title: 'Secure Crowdfunding using BlockChain Technology',
    category: 'Academic Project',
    overview: `
      <div class="space-y-4">
        <p>A decentralized crowdfunding solution addressing accountability issues through Ethereum-based Smart Contracts. The system integrates ERC-20 tokens to ensure transparent, secure, and interchangeable fund management across the ecosystem.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">ERC-20 Integration:</strong> Utilized standard fungible tokens for uniform and interchangeable transactions, securing the funding process.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">P2P Trading:</strong> Developed a decentralized peer-to-peer platform allowing direct investment and funding without intermediaries, reducing costs.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Smart Contract Functions:</strong> Implemented core ERC-20 functions (transfer, approve, transferFrom, allowance) to handle secure balance updates and authorized transfers.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technical Implementation</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Smart Contracts:</strong> Solidity with OpenZeppelin libraries</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Blockchain:</strong> Ethereum (EVM-based)</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Tools:</strong> Remix IDE, Metamask, Web3 Applications</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Key Features:</strong> Balance tracking, token sale/buy logic, and automated authorization checks.</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>', 'Georgios Samakovitis'],
    github: 'closed',
    document: 'https://www.linkedin.com/posts/syedirfanx_blockchain-for-fintech-activity-7142599184020373504-mI22?',
    tags: ['ERC-20', 'Solidity', 'Ethereum', 'Smart Contracts', 'P2P Trading', 'OpenZeppelin']
  },
  'bank-transaction': {
    title: 'Bank Transaction Monitoring using BlockChain Technology',
    category: 'Academic Project',
    overview: `
      <div class="space-y-4">
        <p>A smart contract-based system designed to monitor bank transactions in real-time, identifying and flagging suspicious activities through predefined criteria on the Ethereum network. The system ensures transparency and security while providing a robust auditing trail for regulatory authorities.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Real-time Monitoring:</strong> Developed smart contracts to monitor every bank transaction and flag activities meeting suspicious criteria.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Suspicious Activity Detection:</strong> Implemented criteria including threshold values, irregular timing/location, and association with known criminal activity.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Automated Response:</strong> System immediately freezes accounts and triggers notifications to relevant authorities upon detection of suspicious behavior.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Immutable Ledger:</strong> Maintains a tamper-proof, private ledger of all transactions and alerts for auditing by authorized agencies.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Blockchain:</strong> Ethereum Network</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Language:</strong> Solidity</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Execution Environment:</strong> Ethereum Virtual Machine (EVM)</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Integration:</strong> APIs for bank transaction process interaction</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Notifications:</strong> SMTP, SMS, and Push Notification protocols</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Storage:</strong> Private Blockchain Ledger</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>', 'Georgios Samakovitis'],
    github: '#',
    document: 'https://www.linkedin.com/posts/syedirfanx_anti-money-laundering-ugcPost-7142918121555652612-fhUW/',
    tags: ['Blockchain', 'FinTech', 'Smart Contracts']
  },
  'smart-door-lock': {
    title: 'Smart Door Lock (2FA)',
    category: 'Academic Project',
    overview: 'An advanced IoT-based security system that implements two-factor authentication (2FA) using face recognition and fingerprint scanning. This dual-layer biometric approach significantly increases security for physical access control in homes and offices.',
    collaborators: ['Hassan Kafi (Project Lead)', 'Tauhidur Rahman', '<span class="text-white font-bold">Syed Irfan</span>', 'Syeda Nowrin'],
    github: 'closed',
    document: 'private',
    tags: ['IoT', 'Security', '2FA', 'Embedded Systems']
  },
  'traffic-monitor': {
    title: 'Traffic Monitor App',
    category: 'Academic Project',
    overview: `
      <div class="space-y-4">
        <p>An Android application developed for the CSE 299 Junior Project Design (Fall 2018). It empowers traffic authorities to detect speed limit violations in real-time within sensitive zones using precise GPS tracking.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Zone-Specific Monitoring:</strong> Automated speed detection in sensitive areas like schools, hospitals, mosques, and highways.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">GPS Tracking:</strong> Utilizes real-time location data to calculate vehicle speed and cross-reference with zone speed limits.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Violation Detection:</strong> Automatically flags and records speed violations for traffic management and enforcement.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Platform:</strong> Android Studio</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Language:</strong> Java</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Core Services:</strong> Google Maps API & GPS Location Services</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span> (Project Lead)', 'Hassan Kafi', 'Tauhidur Rahman', 'Shadman Sadiq'],
    github: 'https://github.com/syedirfanx/traffic-monitor-app',
    document: '#',
    tags: ['Android', 'Java', 'GPS', 'Mobile App']
  },
  'machine-overheat': {
    title: 'Machine Overheat Detection',
    category: 'Academic Project',
    overview: `
      <div class="space-y-4">
        <p>An Arduino-based industrial monitoring system developed for the CSE 323 Operating Systems Design (Fall 2018) course. It provides real-time detection of machinery overheating in industrial environments where visual monitoring is insufficient.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Industrial Monitoring:</strong> Designed for factories with heavy machinery to detect thermal anomalies invisible to the naked eye.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Predictive Maintenance:</strong> Triggers immediate alerts upon detecting dangerous temperature thresholds, ensuring machines operate within safe thermal limits.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Operational Efficiency:</strong> Helps maintain peak performance and prevents hardware damage or downtime by ensuring consistent thermal regulation.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Hardware:</strong> Arduino Board & Temperature Sensors</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Monitoring:</strong> Real-time Serial Feedback</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Integration:</strong> Alert & Maintenance Workflow logic</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span> (Project Lead)', 'Sazzad Hossain Risad', 'Ahsanul Kabir'],
    github: 'https://github.com/syedirfanx/machine-overheat-detection',
    document: '#',
    tags: ['Arduino', 'IoT', 'Embedded Systems', 'Sensors']
  },
  'study-theatre': {
    title: 'Study Theatre',
    category: 'Industrial Project',
    overview: `
      <div class="space-y-4">
        <p>A specialized mobile application developed in Flutter that enables teachers to stream live lectures directly to students. The platform focuses on secure, high-quality educational broadcasting with real-time interaction.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Key Features</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Live Streaming:</strong> Facilitates seamless real-time video broadcasting for academic lectures.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Access Control:</strong> Implements a verification system where only paid, verified accounts can access premium lecture content.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Interactive Stream:</strong> Students can ask questions and engage with the lecturer directly during the live session.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Platform:</strong> Android Studio & Flutter</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Language:</strong> Dart</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Backend:</strong> Google Firebase</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['Taufiq Rahman', '<span class="text-white font-bold">Syed Irfan</span>', 'Nafis Faysal'],
    github: 'closed',
    document: 'private',
    tags: ['Flutter', 'Dart', 'Firebase', 'Streaming']
  },
  'digital-logic': {
    title: 'Digital Logic Design',
    category: 'Academic Project',
    overview: `
      <div class="space-y-6">
        <div class="space-y-4">
          <p>This project involved the design and simulation of complex digital systems for the CSE 231 Digital Logic Design course. The implementation focuses on combinational and sequential circuit design with rigorous verification.</p>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 theme-photo-shade">
              <img src="projects/dld1.jpg" alt="DLD Circuit 1" class="w-full h-full object-cover" referrerPolicy="no-referrer">
            </div>
            <div class="aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 theme-photo-shade">
              <img src="projects/dld2.png" alt="DLD Circuit 2" class="w-full h-full object-cover" referrerPolicy="no-referrer">
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technical Specifications</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Displayed Digits:</strong> Circuitry designed to correctly render the sequence 10864.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Combinational Circuit:</strong> Optimized using Simplified SOP (Sum of Products) expressions.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Counter Arrangement:</strong> Designed for the specific sequence: 1, 5, 7, 9, 13.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Registers:</strong> Implemented using D Flip-flops with dedicated parallel/serial load registers.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Simulation:</strong> Logisim</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>'],
    github: 'https://github.com/syedirfanx/digital-logic-design',
    document: '#',
    tags: ['Logisim', 'Circuit Design', 'Digital Logic']
  },
  'whack-a-mole': {
    title: 'Whack A Mole',
    category: 'Academic Project',
    overview: `
      <div class="space-y-4">
        <p>A classic arcade game implementation developed for the CSE 215 Programming Language II course. This project focuses on object-oriented programming, event-driven logic, and UI design within the Java ecosystem.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Overview</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Event-Driven Gameplay:</strong> Implemented real-time mouse interaction and synchronized timing logic for mole visibility.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">OOP Architecture:</strong> Leveraged Java's object-oriented principles to manage game state, scoring, and UI components.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Language:</strong> Java</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['Abdul Ahad Alif', '<span class="text-white font-bold">Syed Irfan</span>', 'Alin Mostafa'],
    github: 'https://github.com/syedirfanx/whack-a-mole',
    document: '#',
    tags: ['Java', 'OOP', 'Game Dev']
  },
  'synthetic-face': {
    title: 'Synthetic Face Generation using GAN',
    category: 'Academic Project',
    overview: `
      <div class="space-y-4">
        <p>A Deep Learning project developed for CSE 465 (Spring 2020). The project focuses on designing and training a Deep Convolutional Generative Adversarial Network (DCGAN) to synthesize high-fidelity human faces.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Goal</h4>
          <p class="text-sm text-zinc-400 leading-relaxed">The primary objective was to architect a generator network capable of producing realistic facial images that resemble non-existent celebrities by learning features from a large-scale face dataset.</p>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Architecture:</strong> DCGAN</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Deep Learning:</strong> TensorFlow/Keras or PyTorch</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>', 'Asaduzzaman Khan'],
    github: 'https://github.com/syedirfanx/face-generation',
    document: '#',
    tags: ['GANs', 'Deep Learning', 'Generative AI', 'DCGAN']
  },
  'valentines-data': {
    title: 'Valentine\'s Day Consumer Data Analysis',
    category: 'Personal Project',
    overview: `
      <div class="space-y-4">
        <p>A data-driven exploration of Valentine’s Day consumer trends, behaviors, and sentiments — uncovering insights from gift preferences to spending patterns using 10 years of National Retail Federation survey data.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Insights</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Spending Disparity:</strong> Analysis revealed that men tend to spend significantly more on flowers than women.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Generational Shifts:</strong> Younger age groups show a preference for flowers, while older consumers shift spending towards greeting cards.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Tech Stack</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Tools:</strong> Python (Pandas, NumPy, Matplotlib, Seaborn)</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Environment:</strong> Jupyter Notebook</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>'],
    github: 'https://github.com/syedirfanx/ValentineConsumerTrends',
    document: '#',
    tags: ['Data Science', 'Data Analysis', 'Python', 'Matplotlib']
  },
  'file-organizer': {
    title: 'Auto File Organizer',
    category: 'Personal Project',
    overview: `
      <div class="space-y-4">
        <p>AutoFileOrganizer is a Python-based automated file management system that continuously monitors a folder, organizes files by type and date, and logs all activities in real-time.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Key Features</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Real-time Monitoring:</strong> Active directory watching for instant file organization upon detection.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Structured Storage:</strong> Moves files into a <code>MyFiles/YYYY-MM-DD/EXTENSION/</code> directory structure.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Detailed Logging:</strong> Generates CSV logs containing timestamps, file names, and path history.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Language:</strong> Python</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Analysis:</strong> Matplotlib (Visualization script)</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>'],
    github: 'https://github.com/syedirfanx/auto-file-organizer',
    document: '#',
    tags: ['Automation', 'Python', 'File Management']
  },
  'bangla-newspaper-summarizer': {
    title: 'Bangla Newspaper Image Summarizer',
    category: 'Personal Project',
    overview: `
      <div class="space-y-4">
        <p>An AI-powered tool designed to automate reading Bangla newspaper images, extracting text via OCR, generating summaries, and securely storing them on Google Drive.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Pipeline Flow</h4>
          <div class="text-[10px] font-bold text-zinc-500 bg-zinc-950 p-4 rounded-xl border border-zinc-800 leading-tight">
            Images (data/) → OCR → Preprocessing → Summarization → Google Drive Upload
          </div>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Key Features</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Full Bangla OCR:</strong> High-precision text extraction from scanned newspaper clippings.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Advanced NLP:</strong> LexRank summarization with frequency-based fallback for Bangla text.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Cloud Integration:</strong> Automated uploads of summaries in CSV, JSON, and text formats to Drive.</span>
            </li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>'],
    github: 'https://github.com/syedirfanx/bangla-news-summarizer',
    document: '#',
    tags: ['OCR', 'NLP', 'Bangla AI', 'Summarization', 'LexRank']
  },
  'news-aggregator': {
    title: 'Web Scraping Service',
    category: 'Industrial Project',
    overview: `
      <div class="space-y-4">
        <p>A specialized news data extraction service that scrapes headlines, complete articles, and publication dates from various portals for structured analysis.</p>
        
        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Key Features</h4>
          <ul class="space-y-2 text-sm text-zinc-400">
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Multi-Portal Extraction:</strong> Scrapes news data including headlines, article bodies, and metadata.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span>
              <span><strong class="text-zinc-200">Structured Output:</strong> Saves extracted datasets in CSV and JSON formats for analytical portability.</span>
            </li>
          </ul>
        </div>

        <div class="space-y-2">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Technologies Used</h4>
          <ul class="space-y-1 text-sm text-zinc-400">
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Scraping:</strong> Python, BeautifulSoup, Requests</span></li>
            <li class="flex items-start gap-3"><span class="w-1 h-1 rounded-full bg-zinc-700 mt-2 shrink-0"></span><span><strong class="text-zinc-200">Analysis:</strong> Pandas</span></li>
          </ul>
        </div>
      </div>
    `,
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>', 'Nafis Faysal'],
    github: 'https://github.com/syedirfanx/web-scraping',
    document: '#',
    tags: ['Web Scraping', 'BeautifulSoup', 'Python', 'Data Science']
  },
  'shell-lubricants': {
    title: 'Shell Lubricants E-commerce App',
    category: 'Industrial Project',
    overview: 'A robust e-commerce mobile application developed for Shell Lubricants using Flutter. The app features a streamlined product catalog, secure checkout, and real-time order tracking tailored for industrial and consumer lubricant sales.',
    collaborators: ['<span class="text-white font-bold">Syed Irfan</span>', 'Ranjit Das', 'Asiful Alam Fahim'],
    github: 'closed',
    document: 'private',
    tags: ['Mobile App Dev', 'Flutter', 'E-commerce', 'Industrial']
  },
  'greenwich': {
    title: 'Master of Science (MSc) in Data Science',
    category: 'Academic Background',
    tags: [],
    overview: `
      <div class="space-y-6">
        <div>
          <p class="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">University of Greenwich • London, UK</p>
        </div>
        <div>
          <p class="text-zinc-400 text-sm leading-relaxed">A comprehensive program focusing on advanced data analysis, machine learning, and their applications in the financial sector.</p>
        </div>
        <div class="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
          <p class="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">MSc Project</p>
          <div class="flex justify-between text-sm text-zinc-300">
            <span>Feature Selection using Swarm Intelligence Techniques</span>
            <span class="text-zinc-600">60cr</span>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 pt-2">
          <p class="text-xs font-bold text-zinc-500 uppercase tracking-widest col-span-full mb-2">Core Modules</p>
          <div class="flex justify-between text-sm text-zinc-400 border-b border-zinc-800/30 pb-1"><span>Applied Machine Learning</span><span class="text-zinc-600">15cr</span></div>
          <div class="flex justify-between text-sm text-zinc-400 border-b border-zinc-800/30 pb-1"><span>Big Data</span><span class="text-zinc-600">15cr</span></div>
          <div class="flex justify-between text-sm text-zinc-400 border-b border-zinc-800/30 pb-1"><span>Blockchain for FinTech</span><span class="text-zinc-600">15cr</span></div>
          <div class="flex justify-between text-sm text-zinc-400 border-b border-zinc-800/30 pb-1"><span>Data Visualisation</span><span class="text-zinc-600">15cr</span></div>
          <div class="flex justify-between text-sm text-zinc-400 border-b border-zinc-800/30 pb-1"><span>Machine Learning</span><span class="text-zinc-600">15cr</span></div>
          <div class="flex justify-between text-sm text-zinc-400 border-b border-zinc-800/30 pb-1"><span>Programming Fundamentals</span><span class="text-zinc-600">15cr</span></div>
          <div class="flex justify-between text-sm text-zinc-400 border-b border-zinc-800/30 pb-1"><span>Statistical Methods</span><span class="text-zinc-600">15cr</span></div>
          <div class="flex justify-between text-sm text-zinc-400 border-b border-zinc-800/30 pb-1"><span>AML & Financial Crime</span><span class="text-zinc-600">15cr</span></div>
        </div>
      </div>
    `
  },
  'nsu': {
    title: 'Bachelor of Science (BSc) in Computer Science & Engineering',
    category: 'Academic Background',
    tags: [],
    overview: `
      <div class="space-y-6">
        <div>
          <p class="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">North South University • Dhaka, Bangladesh</p>
        </div>
        <div>
          <p class="text-zinc-400 text-sm leading-relaxed">Specialized in Artificial Intelligence, focusing on neural networks, pattern recognition, and software engineering.</p>
        </div>
        <div class="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 space-y-3">
          <div>
            <p class="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Thesis</p>
            <p class="text-zinc-300 text-sm">Generating Faces from Fingerprints using Artificial Neural Networks</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Senior Project</p>
              <p class="text-zinc-300 text-sm">Smart Door Lock System</p>
            </div>
            <div>
              <p class="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Junior Project</p>
              <p class="text-zinc-300 text-sm">Traffic Monitor Android App</p>
            </div>
          </div>
        </div>
        <div class="pt-2">
          <p class="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Key Coursework</p>
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">Data Structures & Algorithms</span>
            <span class="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">Machine Learning</span>
            <span class="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">Pattern Recognition</span>
            <span class="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">Neural Networks</span>
            <span class="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">Operating Systems</span>
            <span class="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">Database Systems</span>
            <span class="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">Software Engineering</span>
          </div>
        </div>
      </div>
    `
  },
  'exp-career-break': {
    title: 'Machine Learning Engineer',
    category: 'Career Break • London & Chattogram',
    tags: ['Generative AI', 'LLMs', 'Web Development', 'Data Analysis'],
    overview: `
      <div class="space-y-4">
        <p class="text-zinc-400 text-sm leading-relaxed">Dedicated period of self-directed research, skill acquisition, and project development focusing on modern AI technologies and full-stack engineering.</p>
        <div class="space-y-4">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Key Achievements</h4>
          <ul class="list-disc list-outside ml-4 space-y-2 text-zinc-400 text-sm leading-relaxed marker:text-zinc-600">
            <li>Developed <span class="text-zinc-200">StarPals AI</span>, a film casting platform leveraging Gemini 2.5 Flash and Genkit to automate actor profiling and talent matching.</li>
            <li>Built <span class="text-zinc-200">Auto File Organizer</span>, with real-time monitoring, file categorization, CSV logging & visualization.</li>
            <li>Engineered <span class="text-zinc-200">Bangla News Image Summarizer</span>, an NLP pipeline with OCR, LexRank summarization & Google Drive integration.</li>
            <li>Developed <span class="text-zinc-200">Network Intrusion Detection</span> system classifying network traffic as normal or malicious.</li>
            <li>Built <span class="text-zinc-200">Network Traffic Prediction</span> model to predict load and automate resource allocation (R²: 0.78).</li>
            <li>Completed data analysis projects on consumer trends, salary insights, and inflation forecasting.</li>
          </ul>
        </div>
      </div>
    `
  },
  'exp-swift71': {
    title: 'Software Engineer',
    category: 'Swift71 • Dhaka, Bangladesh',
    tags: ['Flutter', 'UI/UX', 'Client Communication', 'Documentation'],
    overview: `
      <div class="space-y-4">
        <p class="text-zinc-400 text-sm leading-relaxed">Contributed to mobile application development lifecycle, specifically focusing on cross-platform solutions and client-centric design.</p>
        <div class="space-y-4">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Key Responsibilities</h4>
          <ul class="list-disc list-outside ml-4 space-y-2 text-zinc-400 text-sm leading-relaxed marker:text-zinc-600">
            <li>Designed UI/UX using hybrid framework <span class="text-zinc-200">Flutter</span>.</li>
            <li>Effectively communicated with clients to discern and address their specific requirements.</li>
            <li>Crafted documentation for app design, ensuring clarity and alignment with client objectives.</li>
          </ul>
        </div>
      </div>
    `
  },
  'exp-codephilics': {
    title: 'Machine Learning Engineer',
    category: 'Codephilics • Dhaka, Bangladesh',
    tags: ['CNN', 'OCR', 'Data Scraping', 'Computer Vision', 'Python'],
    overview: `
      <div class="space-y-4">
        <p class="text-zinc-400 text-sm leading-relaxed">Focused on industrial AI applications, including computer vision and automated data processing pipelines.</p>
        <div class="space-y-4">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Key Achievements</h4>
          <ul class="list-disc list-outside ml-4 space-y-2 text-zinc-400 text-sm leading-relaxed marker:text-zinc-600">
            <li>Developed a <span class="text-zinc-200">CNN-based</span> machine learning model for face mask detection, with 95% detection accuracy.</li>
            <li>Prepared an OCR system, to extract Bangla and English text data from NID cards and store them in json.</li>
            <li>Directed an automated data scraping utilizing Python libraries, achieving a 50% reduction in data collection time.</li>
          </ul>
        </div>
      </div>
    `
  },
  'exp-nsu-ra': {
    title: 'Research Assistant',
    category: 'North South University • Dhaka, Bangladesh',
    tags: ['Machine Learning', 'Data Analysis', 'Publication', 'Classification'],
    overview: `
      <div class="space-y-4">
        <p class="text-zinc-400 text-sm leading-relaxed">Assisted in academic research focusing on agricultural applications of machine learning, specifically in automated Rice Leaf Disease detection and classification.</p>
        <div class="space-y-4">
          <h4 class="text-xs font-bold uppercase tracking-widest text-zinc-500">Key Achievements</h4>
          <ul class="list-disc list-outside ml-4 space-y-2 text-zinc-400 text-sm leading-relaxed marker:text-zinc-600">
            <li>Analyzed Dataset using 10-fold cross validation, evaluation and classification algorithms.</li>
            <li>Achieved highest testing accuracy of <span class="text-zinc-200">97.92%</span> with Decision Tree (J48).</li>
            <li>Evaluated additional performance metrics (TPR, FPR, Precision, Recall, F-Measure, AUC).</li>
            <li>Co-authored a conference paper presenting our findings in disease classification.</li>
          </ul>
        </div>
      </div>
    `
  },
  'collab-toastmasters': {
    title: 'Toastmasters International',
    category: 'Charter Member • Dhaka, Bangladesh',
    tags: ['Leadership', 'Public Speaking', 'Communication'],
    overview: `
      <div class="space-y-4">
        <ul class="list-disc list-outside ml-4 space-y-2 text-zinc-400 text-sm leading-relaxed marker:text-zinc-600">
          <li>Developed public speaking and leadership skills, improving communication and team collaboration.</li>
          <li>Certified as an active charter member.</li>
        </ul>
      </div>
    `
  },
  'collab-nsu-acm': {
    title: 'NSU ACM Student Chapter',
    category: 'Team Member • Dhaka, Bangladesh',
    tags: ['Community', 'Workshops', 'Technical Events'],
    overview: `
      <div class="space-y-4">
        <p class="text-zinc-400 text-sm leading-relaxed">Contributed to technical events and workshops, fostering a community of student developers and researchers within the ACM network.</p>
      </div>
    `
  },
  'collab-nsu-problem-solvers': {
    title: 'NSU Problem Solvers',
    category: 'Team Member • Dhaka, Bangladesh',
    tags: ['Competitive Programming', 'Algorithms', 'Logic'],
    overview: `
      <div class="space-y-4">
        <p class="text-zinc-400 text-sm leading-relaxed">Engaged in competitive programming and algorithmic problem-solving sessions, honing analytical skills and efficient coding practices.</p>
      </div>
    `
  },
  'collab-nsu-ece': {
    title: 'NSU ECE Department Iftar',
    category: 'Organizer • Dhaka, Bangladesh',
    tags: ['Organization', 'Logistics', 'Leadership'],
    overview: `
      <div class="space-y-4">
        <p class="text-zinc-400 text-sm leading-relaxed">Successfully organized and managed the departmental Iftar event, coordinating logistics and team efforts for a large-scale gathering.</p>
      </div>
    `
  }
};

let currentCategory = 'all';
let currentStack = 'all';
let searchQuery = '';

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const filteredProjects = Object.entries(projectsData).filter(([id, project]) => {
    // Skip academic background, professional experience, and collaboration items in the research grid
    if (id === 'greenwich' || id === 'nsu' || id.startsWith('exp-') || id.startsWith('collab-')) return false;

    const tags = project.tags || [];

    // Category Filter
    const matchesCategory = currentCategory === 'all' || 
                           (currentCategory === 'Conference Paper' && (project.category === 'Conference Paper' || project.category === 'Publication')) ||
                           (currentCategory === 'Academic Project' && (project.category === 'Academic Project' || project.category === 'Thesis Research' || project.category === 'MSc Thesis')) ||
                           (currentCategory === 'Personal Innovation' && (project.category === 'Personal Innovation' || project.category === 'Personal Project')) ||
                           project.category === currentCategory;
    
    // Stack Filter
    const matchesStack = currentStack === 'all' || 
                        tags.some(tag => tag.toLowerCase().includes(currentStack.toLowerCase())) ||
                        (currentStack === 'AI/ML/Data Science' && tags.some(tag => ['AI', 'ML', 'Deep Learning', 'CNN', 'GANs', 'Data Science', 'Machine Learning', 'Sentiment Analysis'].some(t => tag.includes(t)))) ||
                        (currentStack === 'Web/Mobile App Dev' && tags.some(tag => ['Web', 'Full Stack', 'Backend', 'Mobile', 'Flutter', 'Android', 'iOS'].some(t => tag.includes(t))));

    // Search Filter (Advanced: includes category)
    const searchContent = `${project.title} ${project.overview} ${project.category} ${tags.join(' ')}`.toLowerCase();
    const matchesSearch = searchContent.includes(searchQuery.toLowerCase());

    return matchesCategory && matchesStack && matchesSearch;
  });

  if (filteredProjects.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-20 text-center">
        <p class="text-zinc-500 text-lg">No projects found matching your criteria.</p>
        <button onclick="resetFilters()" class="mt-4 text-white hover:underline text-sm">Reset all filters</button>
      </div>
    `;
    return;
  }

  filteredProjects.forEach(([id, project]) => {
    const card = document.createElement('div');
    card.className = 'grok-card p-8 rounded-2xl flex flex-col group hover:border-zinc-700 transition-all cursor-pointer';
    card.onclick = () => openProjectModal(id);
    
    card.innerHTML = `
      <div class="flex justify-between items-start mb-6">
        <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">${project.category}</span>
      </div>
      <h3 class="text-xl font-bold mb-3">${project.title}</h3>
      <div class="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors mb-6 uppercase tracking-widest">
        <span>See details</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </div>
      <div class="mt-auto flex flex-wrap gap-2">
        ${project.tags.slice(0, 2).map(tag => `
          <span class="px-3 py-1 rounded-full bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-widest border border-zinc-800">${tag}</span>
        `).join('')}
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterByCategory(category) {
  currentCategory = category;
  renderProjects();
}

function selectCategory(category, label) {
  currentCategory = category;
  document.getElementById('category-label').innerText = `Category: ${label}`;
  document.getElementById('category-menu').classList.add('hidden');
  updateResetButton();
  renderProjects();
}

function filterByStack(stack) {
  currentStack = stack;
  renderProjects();
}

function selectStack(stack, label) {
  currentStack = stack;
  document.getElementById('stack-label').innerText = `Stack: ${label}`;
  document.getElementById('stack-menu').classList.add('hidden');
  updateResetButton();
  renderProjects();
}

function toggleDropdown(id) {
  const menu = document.getElementById(id);
  const isHidden = menu.classList.contains('hidden');
  
  // Close all other dropdowns
  document.querySelectorAll('[id$="-menu"]').forEach(m => m.classList.add('hidden'));
  
  if (isHidden) {
    menu.classList.remove('hidden');
  }
}

function updateResetButton() {
  const btn = document.getElementById('reset-filters-btn');
  if (currentCategory !== 'all' || currentStack !== 'all' || searchQuery !== '') {
    btn.classList.remove('hidden');
    btn.classList.add('flex');
  } else {
    btn.classList.add('hidden');
    btn.classList.remove('flex');
  }
}

function resetFilters() {
  currentCategory = 'all';
  currentStack = 'all';
  searchQuery = '';
  
  const searchInput = document.getElementById('project-search');
  if (searchInput) searchInput.value = '';
  
  document.getElementById('category-label').innerText = 'Category: All';
  document.getElementById('stack-label').innerText = 'Stack: All';
  
  updateResetButton();
  renderProjects();
}

// Close dropdowns on click outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.group')) {
    document.querySelectorAll('[id$="-menu"]').forEach(m => m.classList.add('hidden'));
  }
});

// Initialize Search
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('project-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      updateResetButton();
      renderProjects();
    });
  }
  
  // Initial render
  renderProjects();
});

function openProjectModal(projectId) {
  const project = projectsData[projectId];
  if (!project) {
    console.warn(`Project data not found for ID: ${projectId}`);
    return;
  }

  const modal = document.getElementById('project-modal');
  const content = document.getElementById('modal-content');
  
  if (!modal || !content) {
    console.warn('Project modal elements not found in DOM');
    return;
  }
  
  // Push state for back button support
  if (!history.state || history.state.modal !== 'project') {
    history.pushState({ modal: 'project' }, '');
  }

  const titleEl = document.getElementById('modal-title');
  if (titleEl) titleEl.innerText = project.title;
  
  const categoryLabel = document.getElementById('modal-category');
  if (categoryLabel) {
    if (project.category) {
      categoryLabel.innerText = project.category;
      categoryLabel.classList.remove('hidden');
    } else {
      categoryLabel.classList.add('hidden');
    }
  }

  const overviewEl = document.getElementById('modal-overview');
  if (overviewEl) overviewEl.innerHTML = project.overview;
  
  const collaboratorsContainer = document.getElementById('modal-collaborators');
  const collaboratorsSection = collaboratorsContainer ? collaboratorsContainer.parentElement : null;
  
  const githubLink = document.getElementById('modal-github');
  const documentLink = document.getElementById('modal-document');
  const linksSection = githubLink ? githubLink.parentElement.parentElement : null;
  
  const tagsContainer = document.getElementById('modal-tags');
  const metaGrid = collaboratorsSection ? collaboratorsSection.parentElement : null;

  // Handle Collaborators
  if (collaboratorsSection && project.collaborators && project.collaborators.length > 0) {
    collaboratorsSection.classList.remove('hidden');
    if (collaboratorsContainer) {
      collaboratorsContainer.innerHTML = project.collaborators.map(c => `<div>${c}</div>`).join('');
    }
  } else if (collaboratorsSection) {
    collaboratorsSection.classList.add('hidden');
  }

  // Handle Links
  if (linksSection && (project.github || project.document)) {
    linksSection.classList.remove('hidden');
    if (githubLink) {
      githubLink.onclick = null; // Reset
      githubLink.removeAttribute('target'); // Reset
      if (project.github === 'closed') {
        githubLink.href = 'javascript:void(0)';
        githubLink.onclick = (e) => {
          e.preventDefault();
          showToast('This repository is closed source and not publicly available.', 'Repository Access');
        };
        githubLink.classList.remove('hidden');
      } else if (project.github && project.github !== '#') {
        githubLink.href = project.github;
        githubLink.setAttribute('target', '_blank');
        githubLink.classList.remove('hidden');
      } else {
        githubLink.classList.add('hidden');
      }
    }
    if (documentLink) {
      documentLink.onclick = null; // Reset
      documentLink.removeAttribute('target'); // Reset
      if (project.document === 'private') {
        documentLink.href = 'javascript:void(0)';
        documentLink.onclick = (e) => {
          e.preventDefault();
          showToast('This documentation is private and not available publicly.', 'Document Access');
        };
        documentLink.classList.remove('hidden');
      } else if (project.document && project.document !== '#') {
        documentLink.href = project.document;
        documentLink.setAttribute('target', '_blank');
        documentLink.classList.remove('hidden');
      } else {
        documentLink.classList.add('hidden');
      }
    }
    
    // If both links are hidden after checking values
    if (githubLink && documentLink && githubLink.classList.contains('hidden') && documentLink.classList.contains('hidden')) {
      linksSection.classList.add('hidden');
    }
  } else if (linksSection) {
    linksSection.classList.add('hidden');
  }

  // Handle Tags
  if (tagsContainer) {
    if (project.tags && project.tags.length > 0) {
      tagsContainer.classList.remove('hidden');
      tagsContainer.innerHTML = project.tags.map(tag => `
        <span class="px-3 py-1 rounded-full bg-zinc-800/50 text-zinc-400 text-[10px] uppercase tracking-widest border border-zinc-800">${tag}</span>
      `).join('');
    } else {
      tagsContainer.classList.add('hidden');
    }
  }

  // Hide Meta Grid if both sub-sections are hidden
  if (metaGrid && collaboratorsSection && linksSection) {
    if (collaboratorsSection.classList.contains('hidden') && linksSection.classList.contains('hidden')) {
      metaGrid.classList.add('hidden');
    } else {
      metaGrid.classList.remove('hidden');
    }
  }

  modal.classList.remove('hidden');
  setTimeout(() => {
    content.classList.remove('scale-95', 'opacity-0');
    content.classList.add('scale-100', 'opacity-100');
  }, 10);
  
  document.body.style.overflow = 'hidden';
}

function closeProjectModal(fromPopState = false) {
  const modal = document.getElementById('project-modal');
  const content = document.getElementById('modal-content');
  if (!modal || modal.classList.contains('hidden')) return;
  
  content.classList.remove('scale-100', 'opacity-100');
  content.classList.add('scale-95', 'opacity-0');
  
  setTimeout(() => {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }, 300);

  // If closed via UI (not back button), and state exists, go back
  if (!fromPopState && history.state && history.state.modal === 'project') {
    history.back();
  }
}

// Global Popstate Listener for Back Button Support
window.addEventListener('popstate', (event) => {
  // Hide loader if it was shown
  const loader = document.getElementById('page-loader');
  if (loader) loader.classList.add('hidden');

  // Close any open modals or menus when back button is pressed
  closeProjectModal(true);
  closeMobileMenu(true);
  closeVideoIntro(true);
  
  // Also handle gallery modal if it exists (defined in favorites.html)
  if (typeof closeGallery === 'function') {
    closeGallery(true);
  }
});

let videoAutoCloseTimeout = null;

/**
 * Video Intro Modal Logic
 */
function openVideoIntro() {
  const modal = document.getElementById('video-modal');
  const content = document.getElementById('video-modal-content');
  const video = document.getElementById('intro-video');
  const overlay = document.getElementById('video-neural-overlay');
  
  if (!modal || !content || !video) return;

  // Clear any existing timeout
  if (videoAutoCloseTimeout) {
    clearTimeout(videoAutoCloseTimeout);
    videoAutoCloseTimeout = null;
  }

  modal.classList.remove('hidden');
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';

  // Handle Lucide Icons within the modal
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Reset overlay
  if (overlay) {
    overlay.style.opacity = '1';
    overlay.classList.remove('hidden');
  }

  // Animate in
  setTimeout(() => {
    content.classList.remove('scale-95', 'opacity-0');
    content.classList.add('scale-100', 'opacity-100');
  }, 10);

  // Play video with intro delay
  video.currentTime = 0;
  
  const startVideo = () => {
    setTimeout(() => {
      if (overlay) overlay.style.opacity = '0';
      video.play().catch(e => {
        console.warn('Auto-play blocked or failed:', e);
        video.controls = true;
      });
      setTimeout(() => {
        if (overlay) overlay.classList.add('hidden');
      }, 1000);
    }, 1500); // 1.5s delay for futuristic feel
  };

  // Add listener for auto-close
  video.onended = () => {
    videoAutoCloseTimeout = setTimeout(() => {
      closeVideoIntro();
    }, 5000);
  };

  // Wait for enough data to play or just timeout
  if (video.readyState >= 3) {
    startVideo();
  } else {
    video.addEventListener('canplay', startVideo, { once: true });
  }

  // Push state
  if (!history.state || history.state.modal !== 'video') {
    history.pushState({ modal: 'video' }, '');
  }
}

function closeVideoIntro(fromPopState = false) {
  const modal = document.getElementById('video-modal');
  const content = document.getElementById('video-modal-content');
  const video = document.getElementById('intro-video');
  
  if (!modal || !content || !video) return;

  // Clear auto-close timeout if exists
  if (videoAutoCloseTimeout) {
    clearTimeout(videoAutoCloseTimeout);
    videoAutoCloseTimeout = null;
  }

  // Pause video
  video.pause();
  video.onended = null; // Remove listener

  content.classList.remove('scale-100', 'opacity-100');
  content.classList.add('scale-95', 'opacity-0');

  setTimeout(() => {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }, 300);

  if (!fromPopState && history.state && history.state.modal === 'video') {
    history.back();
  }
}

// Wishes Spot Logic
async function initWishes() {
  const wishesSpot = document.getElementById('wishes-spot');
  const decodeText = document.getElementById('decode-text');
  const particlesContainer = document.getElementById('particles-container');
  
  if (!wishesSpot || !decodeText) return;

  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const dayOfWeek = now.getDay();

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#&$%§*+=-";

  const solveText = async (targetText, iterations = 10) => {
    const isBangla = /[\u0980-\u09FF]/.test(targetText);
    if (isBangla) decodeText.classList.add('font-bangla');
    else decodeText.classList.remove('font-bangla');

    let currentText = "";
    
    // Initial scramble
    for (let i = 0; i < targetText.length; i++) {
      currentText += chars[Math.floor(Math.random() * chars.length)];
    }
    decodeText.textContent = currentText;

    // Solve character by character
    for (let i = 0; i < targetText.length; i++) {
      for (let j = 0; j < 3; j++) {
        let scrambled = targetText.substring(0, i);
        for (let k = i; k < targetText.length; k++) {
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
        decodeText.textContent = scrambled;
        await new Promise(r => setTimeout(r, 40));
      }
      decodeText.textContent = targetText.substring(0, i + 1) + currentText.substring(i + 1);
    }
    decodeText.textContent = targetText;
  };

  const clearText = async () => {
    const originalText = decodeText.textContent;
    for (let i = originalText.length; i >= 0; i--) {
      let scrambled = "";
      for (let j = 0; j < i; j++) {
        scrambled += chars[Math.floor(Math.random() * chars.length)];
      }
      decodeText.textContent = scrambled;
      await new Promise(r => setTimeout(r, 20));
    }
    decodeText.textContent = "";
  };

  const startCycling = async (title, message) => {
    wishesSpot.classList.remove('hidden');

    if (particlesContainer) {
      setInterval(() => {
        if (!decodeText.textContent.trim()) return;
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 1.5 + 0.5;
        const duration = 1.5 + Math.random() * 1.5;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.setProperty('--duration', `${duration}s`);
        particle.style.setProperty('--x-drift', `${(Math.random() - 0.5) * 30}px`);
        const color = `hsl(${210 + Math.random() * 20}, 100%, 75%)`; // Precise tech blue
        particle.style.background = color;
        particle.style.color = color;
        particle.style.boxShadow = `0 0 4px ${color}`;
        particlesContainer.appendChild(particle);
        setTimeout(() => particle.remove(), duration * 1000);
      }, 600);
    }

    const phrases = [title, message];
    let index = 0;
    while (true) {
      await solveText(phrases[index]);
      await new Promise(r => setTimeout(r, 5000));
      await clearText();
      await new Promise(r => setTimeout(r, 1000));
      index = (index + 1) % phrases.length;
    }
  };

  // 1. Check Fixed National/International Days
  const fixedDays = [
    { month: 4, day: 13, title: "শুভ নববর্ষ!", message: "সবাইকে বাংলা নববর্ষের শুভেচ্ছা।" },
    { month: 2, day: 21, title: "International Mother Language Day", message: "Remembering the Language Martyrs" },
    { month: 3, day: 26, title: "Independence Day", message: "Celebrating freedom and unity" },
    { month: 12, day: 16, title: "Victory Day", message: "The red and green flag flies high" }
  ];

  if (month === 1 && day <= 10) {
    startCycling(`Happy New Year ${now.getFullYear()}`, "A Year Of Innovation And Growth");
    return;
  }

  const todayFixed = fixedDays.find(d => d.month === month && d.day === day);
  if (todayFixed) {
    startCycling(todayFixed.title, todayFixed.message);
    return;
  }

  // 2. Check for Eid (Automatic via Aladhan API)
  try {
    const formattedDate = `${day}-${month}-${now.getFullYear()}`;
    const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${formattedDate}`);
    const data = await response.json();
    
    if (data.code === 200) {
      const hijri = data.data.hijri;
      const hDay = parseInt(hijri.day);
      const hMonth = hijri.month.number;

      if (hMonth === 10 && (hDay === 1 || hDay === 2 || hDay === 3)) {
        startCycling("Eid Mubarak", "Wishing You A Blessed Eid");
        return;
      }
      
      if (hMonth === 12 && (hDay === 10 || hDay === 11 || hDay === 12)) {
        startCycling("Eid Mubarak", "Wishing You A Blessed Eid");
        return;
      }
    }
  } catch (error) {
    console.error("Failed to fetch Hijri date:", error);
  }

  // 3. Check for Jummah (Friday)
  if (dayOfWeek === 5) {
    startCycling("Jummah Mubarak", "Have A Blessed Friday");
    return;
  }

  // 4. Default: keep hidden when no special event/wish is active
  wishesSpot.classList.add('hidden');
}

/**
 * Generates a dynamic PDF of all projects using jsPDF
 */
// --- CUSTOM CV GENERATION ---
function generateCVPDF() {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // 1. Header Background (Matching Portfolio)
  doc.setFillColor(24, 24, 27);
  doc.rect(0, 0, pageWidth, 55, 'F');
  
  // Dot grid pattern
  doc.setFillColor(63, 63, 70);
  for (let x = 5; x < pageWidth; x += 8) {
    for (let y = 5; y < 50; y += 8) {
      doc.circle(x, y, 0.15, 'F');
    }
  }
  
  // Brand Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.setLineWidth(0.1);
  doc.setDrawColor(255, 255, 255);
  doc.text('SYED IRFAN', 14, 22, { renderingMode: 'fillThenStroke' });
  
  // Tagline
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(161, 161, 170);
  doc.text('MACHINE LEARNING ENGINEER', 14, 28, { charSpace: 0.8 });
  
  doc.setDrawColor(63, 63, 70);
  doc.setLineWidth(0.3);
  doc.line(14, 32, 50, 32);

  // Address under the underline
  doc.setFontSize(8.5);
  doc.setTextColor(161, 161, 170); // Zinc-400 for consistency with tagline
  doc.text('Dhaka, Bangladesh', 14, 39);

  // Contact Info (Right Aligned in Header)
  doc.setFontSize(8.5);
  doc.setTextColor(212, 212, 216); // Zinc-300
  const rightX = pageWidth - 14;
  
  const emailStr = 'syedirfaanx@gmail.com';
  const githubStr = 'github.com/syedirfanx';
  const linkedinStr = 'linkedin.com/in/syedirfanx';
  const webStr = 'syedirfan.co.uk';

  // Calculate widths for manual linking
  const emailWidth = doc.getTextWidth(emailStr);
  const linkedinWidth = doc.getTextWidth(linkedinStr);
  const githubWidth = doc.getTextWidth(githubStr);
  const webWidth = doc.getTextWidth(webStr);
  const pipeWidth = doc.getTextWidth(' | ');

  // Email
  doc.text(emailStr, rightX, 22, { align: 'right' });
  doc.link(rightX - emailWidth, 18, emailWidth, 6, { url: 'mailto:syedirfaanx@gmail.com' });
  
  // LinkedIn
  doc.text(linkedinStr, rightX, 27, { align: 'right' });
  doc.link(rightX - linkedinWidth, 23, linkedinWidth, 6, { url: 'https://linkedin.com/in/syedirfanx' });
  
  // Pipe separator
  doc.text(' | ', rightX - linkedinWidth, 27, { align: 'right' });
  
  // GitHub
  doc.text(githubStr, rightX - linkedinWidth - pipeWidth, 27, { align: 'right' });
  doc.link(rightX - linkedinWidth - pipeWidth - githubWidth, 23, githubWidth, 6, { url: 'https://github.com/syedirfanx' });

  // Website
  doc.text(webStr, rightX, 32, { align: 'right' });
  doc.link(rightX - webWidth, 28, webWidth, 6, { url: 'https://syedirfan.co.uk' });

  let yPos = 72;
  const LEFT_MARGIN = 14;
  const RIGHT_MARGIN = 14;
  const CONTENT_X = LEFT_MARGIN + 4; // Standardized alignment for content and header text

  // Helper for Section Titles
  const addSectionTitle = (title) => {
    // Ensure enough space for section or add page
    if (yPos > 245) {
      doc.addPage();
      yPos = 30; 
    }

    // Draw Dark Block Background (Zinc-950)
    doc.setFillColor(24, 24, 27); 
    doc.rect(LEFT_MARGIN, yPos - 7, pageWidth - (LEFT_MARGIN + RIGHT_MARGIN), 10, 'F');
    
    // Subtle left accent (White)
    doc.setFillColor(255, 255, 255);
    doc.rect(LEFT_MARGIN, yPos - 7, 1.5, 10, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    // Draw text vertically centered in the 10-unit block
    doc.text(title.toUpperCase(), CONTENT_X, yPos - 0.5);
    
    yPos += 13; // Space after title block
  };

  // 2. Education Section
  addSectionTitle('Education');
  
  // MSc
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(24, 24, 27);
  doc.text('Master of Science (MSc) in Data Science', CONTENT_X, yPos);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(113, 113, 122);
  doc.text('2022 - 2023', pageWidth - RIGHT_MARGIN, yPos, { align: 'right' });
  
  doc.setTextColor(39, 39, 42);
  doc.text('University of Greenwich, London, UK', CONTENT_X, yPos + 5.5);
  yPos += 16;
  
  // BSc
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(24, 24, 27);
  doc.text('Bachelor of Science (BSc) in Computer Science & Engineering', CONTENT_X, yPos);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(113, 113, 122);
  doc.text('2015 - 2020', pageWidth - RIGHT_MARGIN, yPos, { align: 'right' });
  
  doc.setTextColor(39, 39, 42);
  doc.text('North South University, Dhaka, Bangladesh', CONTENT_X, yPos + 5.5);
  yPos += 18;

  // 3. Work Experience
  addSectionTitle('Work Experience');
  const experiences = [
    { role: 'Machine Learning Engineer', org: 'Career Break', location: 'London & Chattogram', period: 'Present' },
    { role: 'Software Engineer', org: 'Swift71', location: 'Dhaka, Bangladesh', period: '2020 - 2021' },
    { role: 'Machine Learning Engineer', org: 'Codephilics', location: 'Dhaka, Bangladesh', period: '2020' },
    { role: 'Research Assistant', org: 'North South University', location: 'Dhaka, Bangladesh', period: '2019 - 2020' }
  ];
  
  experiences.forEach(exp => {
    if (yPos > 260) {
      doc.addPage();
      yPos = 30;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(24, 24, 27);
    doc.text(exp.role, CONTENT_X, yPos);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(113, 113, 122);
    doc.text(exp.period, pageWidth - RIGHT_MARGIN, yPos, { align: 'right' });
    
    doc.setTextColor(39, 39, 42);
    doc.text(`${exp.org} • ${exp.location}`, CONTENT_X, yPos + 5.5);
    yPos += 14;
  });
  yPos += 8;

  // 4. Publication (One primary)
  addSectionTitle('Publications');
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(39, 39, 42);
  const pub = "• Rice Leaf Disease Detection using Machine Learning Techniques. (Presented at International Conference on Sustainable Technologies for Industry 4.0)";
  const pubLines = doc.splitTextToSize(pub, pageWidth - (CONTENT_X + RIGHT_MARGIN));
  doc.text(pubLines, CONTENT_X, yPos);
  yPos += (pubLines.length * 6) + 14;

  // 5. Research & Projects (Curated)
  addSectionTitle('Selected Research & Projects');
  const selectedProjects = [
    { title: 'Feature Selection using Swarm Intelligence Techniques', cat: 'MSc Thesis' },
    { title: 'StarPals AI: Revolutionizing Talent Casting', cat: 'Personal Innovation' },
    { title: 'Study Theatre: Live Streaming for Education', cat: 'Industrial Project' },
    { title: 'Face Mask Detection & Warning Systems', cat: 'Industrial Project' },
    { title: 'NID Card OCR System (Bangla & English)', cat: 'Industrial Project' },
    { title: 'Secure Crowdfunding using BlockChain Technology', cat: 'Academic Project' },
    { title: 'Bank Transaction Monitoring using BlockChain', cat: 'Academic Project' },
    { title: 'Flight Booking System', cat: 'Academic Project' },
    { title: 'Traffic Monitor App: GPS Speed Detection', cat: 'Academic Project' },
    { title: 'Machine Overheat Detection (Arduino IoT)', cat: 'Academic Project' },
    { title: 'AI Network Flow Prediction and Optimization', cat: 'Personal Project' }
  ];
  
  selectedProjects.forEach(proj => {
    if (yPos > 275) {
      doc.addPage();
      yPos = 30;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(24, 24, 27);
    doc.text(`• ${proj.title}`, CONTENT_X, yPos);
    
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(113, 113, 122);
    doc.text(proj.cat, pageWidth - RIGHT_MARGIN, yPos, { align: 'right' });
    
    yPos += 7;
  });
  yPos += 14;

  // 6. Skills
  if (yPos > 220) {
    doc.addPage();
    yPos = 30;
  }
  addSectionTitle('Technical Skills');
  const skillsList = ['Python (PyTorch, TensorFlow)', 'Computer Vision (CNNs, GANs)', 'Natural Language Processing', 'Data Engineering (SQL, Pandas)', 'Mobile Dev (Flutter, Firebase)', 'Cloud (Google Cloud Platform)', 'Machine Learning (Scikit-learn)', 'Blockchain (Solidity)'];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(39, 39, 42);
  const skillsText = skillsList.join('  •  ');
  const skillLines = doc.splitTextToSize(skillsText, pageWidth - (CONTENT_X + RIGHT_MARGIN));
  doc.text(skillLines, CONTENT_X, yPos);
  yPos += (skillLines.length * 6) + 14; 

  // 7. Extra-Curricular
  addSectionTitle('Leadership & Activities');
  const extracurriculars = [
    { title: 'Charter Member | Toastmasters International', period: '2017 - 2018' },
    { title: 'Team Member | NSU Problem Solvers', period: '2017' },
    { title: 'Student Chapter Member | NSU ACM Student Chapter', period: '2018' }
  ];
  
  extracurriculars.forEach(item => {
    if (yPos > 275) {
      doc.addPage();
      yPos = 30;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(24, 24, 27);
    doc.text(item.title, CONTENT_X, yPos);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(113, 113, 122);
    doc.text(item.period, pageWidth - RIGHT_MARGIN, yPos, { align: 'right' });
    yPos += 7;
  });
  yPos += 12;

  // 7. Languages
  addSectionTitle('Languages');
  const languages = [
    { name: 'Bangla', level: 'Native or bilingual proficiency' },
    { name: 'English', level: 'Professional working proficiency' },
    { name: 'Hindi', level: 'Elementary proficiency' }
  ];
  
  languages.forEach((lang) => {
    if (yPos > 275) {
      doc.addPage();
      yPos = 30;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(24, 24, 27);
    doc.text(lang.name, CONTENT_X, yPos);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(113, 113, 122);
    doc.text(lang.level, CONTENT_X, yPos + 4.5);
    yPos += 11;
  });
  yPos += 6;

  // 8. References
  addSectionTitle('References');
  const refs = [
    {
      name: 'Dr Mohammad Majid al-Rifaie',
      title: 'Professor in Artificial Intelligence',
      org: 'University of Greenwich, London',
      email: 'm.alrifaie@greenwich.ac.uk'
    },
    {
      name: 'Dr Rajesh Palit',
      title: 'Professor in Electrical and Computer Engineering',
      org: 'North South University, Dhaka',
      email: 'rajesh.palit@northsouth.edu'
    }
  ];

  refs.forEach((ref, index) => {
    const x = index % 2 === 0 ? CONTENT_X : (pageWidth / 2) + 4;
    if (yPos > 250) {
      doc.addPage();
      yPos = 30;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(24, 24, 27);
    doc.text(ref.name, x, yPos);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(39, 39, 42);
    doc.text(ref.title, x, yPos + 5.5);
    doc.text(ref.org, x, yPos + 10);
    doc.setTextColor(113, 113, 122);
    doc.text(`Email: ${ref.email}`, x, yPos + 14.5);
    
    if (index % 2 !== 0 || index === refs.length - 1) {
      yPos += 28;
    }
  });
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(161, 161, 170);
    doc.text(`Page ${i} of ${pageCount} | Generated on ${new Date().toLocaleDateString()} | syedirfan.co.uk`, 14, doc.internal.pageSize.height - 10);
  }

  doc.save('Syed_Irfan_Website_CV.pdf');
}

function generateProjectPortfolioPDF() {
  if (typeof jspdf === 'undefined') {
    showToast('PDF library not loaded yet. Please ensure you are on the Research page.', 'Error');
    return;
  }

  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  
  // Header Background (Zinc-900)
  doc.setFillColor(24, 24, 27);
  doc.rect(0, 0, doc.internal.pageSize.width, 50, 'F');
  
  // Add subtle dot grid pattern (matching website technical feel)
  doc.setFillColor(63, 63, 70); // Zinc-700 dots
  for (let x = 5; x < doc.internal.pageSize.width; x += 8) {
    for (let y = 5; y < 45; y += 8) {
      doc.circle(x, y, 0.15, 'F');
    }
  }
  
  // Brand Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  // Simulate Extra Bold (800)
  doc.setLineWidth(0.1);
  doc.setDrawColor(255, 255, 255);
  doc.text('SYED IRFAN', 14, 22, { renderingMode: 'fillThenStroke' });
  
  // Tagline
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(161, 161, 170); // Zinc-400
  doc.text('MACHINE LEARNING ENGINEER', 14, 29, { charSpace: 0.8 });
  
  // Horizontal Rule
  doc.setDrawColor(63, 63, 70); // Zinc-700
  doc.setLineWidth(0.3);
  doc.line(14, 33, 50, 33);

  // Document Info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('RESEARCH & PROJECTS', 14, 42);
  
  // Right side header info
  doc.setFontSize(7.5);
  doc.setTextColor(113, 113, 122); // Zinc-500
  doc.text('syedirfan.co.uk/research', doc.internal.pageSize.width - 14, 22, { align: 'right' });
  
  const columns = ["Title", "Category", "Description", "Source / Link"];
  const rows = [];
  const linkData = [];
  
  // Helper to strip HTML tags from overview and normalize whitespace
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    let text = tmp.textContent || tmp.innerText || "";
    // Normalize: replace multiple spaces/newlines with a single space and trim
    return text.replace(/\s+/g, ' ').trim();
  };

  // Convert projectsData to rows matching the Research page filters
  if (typeof projectsData !== 'undefined') {
    const filteredProjects = Object.entries(projectsData).filter(([id, project]) => {
      // Filter out non-project items
      if (id === 'greenwich' || id === 'nsu' || id.startsWith('exp-') || id.startsWith('collab-')) return false;

      const tags = project.tags || [];
      const matchesCategory = currentCategory === 'all' || 
                             (currentCategory === 'Conference Paper' && (project.category === 'Conference Paper' || project.category === 'Publication')) ||
                             (currentCategory === 'Academic Project' && (project.category === 'Academic Project' || project.category === 'Thesis Research' || project.category === 'MSc Thesis')) ||
                             (currentCategory === 'Personal Innovation' && (project.category === 'Personal Innovation' || project.category === 'Personal Project')) ||
                             project.category === currentCategory;
      
      const matchesStack = currentStack === 'all' || 
                          tags.some(tag => tag.toLowerCase().includes(currentStack.toLowerCase())) ||
                          (currentStack === 'AI/ML/Data Science' && tags.some(tag => ['AI', 'ML', 'Deep Learning', 'CNN', 'GANs', 'Data Science', 'Machine Learning', 'Sentiment Analysis'].some(t => tag.includes(t)))) ||
                          (currentStack === 'Web/Mobile App Dev' && tags.some(tag => ['Web', 'Full Stack', 'Backend', 'Mobile', 'Flutter', 'Android', 'iOS'].some(t => tag.includes(t))));

      const searchContent = `${project.title} ${project.overview} ${project.category} ${tags.join(' ')}`.toLowerCase();
      const matchesSearch = searchContent.includes(searchQuery.toLowerCase());

      return matchesCategory && matchesStack && matchesSearch;
    });

    // Sort projects by specific category priority requested by consumer
    const categoryPriority = {
      'Conference Paper': 1,
      'Publication': 1,
      'MSc Thesis': 2,
      'Thesis Research': 3,
      'Academic Project': 4,
      'Industrial Project': 5,
      'Personal Innovation': 6,
      'Personal Project': 7
    };

    filteredProjects.sort((a, b) => {
      const priorityA = categoryPriority[a[1].category] || 99;
      const priorityB = categoryPriority[b[1].category] || 99;
      return priorityA - priorityB;
    });

    filteredProjects.forEach(([id, p]) => {
      // Extract links
      let linkTextParts = [];
      let primaryUrl = null;
      
      // Check GitHub
      if (p.github && p.github.startsWith('http')) {
        linkTextParts.push(p.github);
        primaryUrl = p.github;
      }

      // Check Live Demo / Documentation
      const liveLink = p.link || p.url || (p.document && p.document.startsWith('http') ? p.document : null);
      if (liveLink && liveLink.startsWith('http')) {
        linkTextParts.push(liveLink);
        if (!primaryUrl) primaryUrl = liveLink;
      }
      
      const fullText = stripHtml(p.overview);
      let shortDesc = fullText;
      
      // Smart extraction: try to get the first sentence
      const firstSentenceMatch = fullText.match(/^[^.!?]+[.!?]/);
      if (firstSentenceMatch) {
        shortDesc = firstSentenceMatch[0];
        // If first sentence is too long, truncate at word boundary
        if (shortDesc.length > 130) {
          const cutIndex = shortDesc.lastIndexOf(' ', 125);
          shortDesc = shortDesc.substring(0, cutIndex > 0 ? cutIndex : 125) + '...';
        }
      } else {
        // Fallback truncation at word boundary
        if (fullText.length > 120) {
          const cutIndex = fullText.lastIndexOf(' ', 115);
          shortDesc = fullText.substring(0, cutIndex > 0 ? cutIndex : 115) + '...';
        }
      }

      rows.push([
        p.title,
        p.category || 'N/A',
        shortDesc,
        linkTextParts.join('\n\n')
      ]);
      // Store primary link for the whole cell click (fallback to gh then docs)
      linkData.push(primaryUrl);
    });
  }

  // Generate Table
  doc.autoTable({
    head: [columns],
    body: rows,
    startY: 60,
    margin: { left: 14, right: 14 },
    rowPageBreak: 'avoid',
    styles: { fontSize: 10, cellPadding: 2.5, font: "helvetica", halign: 'left', textColor: [39, 39, 42] },
    headStyles: { fillStyle: 'F', fillColor: [24, 24, 27], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [228, 228, 231] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 35, textColor: [0, 0, 0] },
      1: { cellWidth: 33 },
      2: { cellWidth: 77 },
      3: { cellWidth: 'auto', textColor: [37, 99, 235], fontSize: 8.5 } 
    },
    didDrawCell: (data) => {
      if (data.column.index === 3 && data.cell.section === 'body') {
        const url = linkData[data.row.index];
        if (url) {
          doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: url });
        }
      }
    }
  });

  // Footer with Page Numbers
  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount} | Generated on ${new Date().toLocaleDateString()} | syedirfan.co.uk`, 14, doc.internal.pageSize.height - 10);
  }

  // Save the PDF
  doc.save('Syed_Irfan_Research_&_Projects.pdf');
}
