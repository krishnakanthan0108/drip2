// ============================================================
// DRIP. — Global Animation & UX Enhancements
// Include this on every page
// ============================================================

(function () {
  'use strict';

  // ── Cursor glow (desktop only) ──────────────────────────────
  if (window.matchMedia('(hover: hover)').matches) {
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    document.body.appendChild(glow);
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => glow.style.opacity = '0');
    document.addEventListener('mouseenter', () => glow.style.opacity = '1');
  }

  // ── Background orbs ────────────────────────────────────────
  const orbs = document.createElement('div');
  orbs.className = 'bg-orbs';
  orbs.innerHTML = `
    <div class="bg-orb" style="width:600px;height:600px;background:var(--gold);top:-10%;left:-10%;animation-duration:18s"></div>
    <div class="bg-orb" style="width:400px;height:400px;background:#3498db;bottom:-5%;right:-5%;animation-duration:24s"></div>
    <div class="bg-orb" style="width:300px;height:300px;background:var(--gold);top:40%;right:10%;animation-duration:20s"></div>
  `;
  document.body.prepend(orbs);

  // ── Scroll reveal ───────────────────────────────────────────
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  function initReveal() {
    document.querySelectorAll('.product-card, .category-card, .section-title, .section-subtitle, .stat-card').forEach((el, i) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        if (i % 4 === 1) el.classList.add('reveal-delay-1');
        if (i % 4 === 2) el.classList.add('reveal-delay-2');
        if (i % 4 === 3) el.classList.add('reveal-delay-3');
      }
      observer.observe(el);
    });
  }

  // Run on DOM ready, and again after dynamic content loads
  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    setTimeout(initReveal, 800);
    setTimeout(initReveal, 2000);
  });

  // ── Back to top button ──────────────────────────────────────
  const backTop = document.createElement('button');
  backTop.id = 'back-to-top';
  backTop.innerHTML = '↑';
  backTop.title = 'Back to top';
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(backTop);

  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // ── Mobile nav drawer ───────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    if (!hamburger) return;

    const mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-overlay';
    const mobileNav = document.createElement('nav');
    mobileNav.className = 'mobile-nav';
    mobileNav.innerHTML = `
      <button style="position:absolute;top:24px;right:24px;font-size:24px;color:var(--text-soft);background:none;border:none;cursor:pointer" id="mobile-nav-close">✕</button>
      <a href="/index.html">Home</a>
      <a href="/pages/shop.html">All Products</a>
      <a href="/pages/shop.html?category=men">Men</a>
      <a href="/pages/shop.html?category=women">Women</a>
      <a href="/pages/shop.html?category=streetwear">Streetwear</a>
      <a href="/pages/shop.html?category=accessories">Accessories</a>
      <a href="/pages/shop.html?sale=true" style="color:var(--gold)">🔥 Sale</a>
      <a href="/pages/auth.html">Account</a>
    `;
    document.body.appendChild(mobileOverlay);
    document.body.appendChild(mobileNav);

    const openNav = () => { mobileNav.classList.add('open'); mobileOverlay.classList.add('open'); };
    const closeNav = () => { mobileNav.classList.remove('open'); mobileOverlay.classList.remove('open'); };

    hamburger.addEventListener('click', openNav);
    mobileOverlay.addEventListener('click', closeNav);
    mobileNav.querySelector('#mobile-nav-close').addEventListener('click', closeNav);
  });

  // ── Magnetic buttons ─────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  });

  // ── Animated number counters ────────────────────────────────
  function animateCounter(el, target, suffix = '') {
    const start = 0;
    const duration = 1800;
    const startTime = performance.now();
    const isDecimal = target.toString().includes('.');

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = start + (target - start) * eased;
      el.textContent = (isDecimal ? value.toFixed(1) : Math.floor(value).toLocaleString('en-IN')) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const statObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const raw = el.textContent.replace(/[^0-9.KM★+]/g, '');
        const suffix = el.textContent.replace(/[0-9.,]/g, '').trim();
        const num = parseFloat(raw.replace(/[KM]/g, '')) * (raw.includes('K') ? 1000 : raw.includes('M') ? 1000000 : 1);
        if (!isNaN(num)) animateCounter(el, num, suffix.replace(/[0-9]/g, ''));
        statObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));
  });

  // ── Navbar scroll shadow ─────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(0,0,0,0.4)' : '';
    }, { passive: true });
  }

  // ── Image lazy load with fade ────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img[loading=lazy]').forEach(img => {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s ease';
      img.addEventListener('load', () => { img.style.opacity = '1'; });
      if (img.complete) img.style.opacity = '1';
    });
  });

})();
