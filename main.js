/* ═══════════════════════════════════════════════
   VETRIVEL FARMS — Main JavaScript
   Three.js 3D + GSAP Animations + Interactivity
   ═══════════════════════════════════════════════ */

'use strict';

// ── Preloader ──────────────────────────────────────────
const preloader = document.getElementById('preloader');
const preloaderFill = document.getElementById('preloaderFill');
let progress = 0;
const fillInt = setInterval(() => {
  progress += Math.random() * 4 + 1;
  if (progress >= 100) {
    progress = 100;
    clearInterval(fillInt);
    setTimeout(hidePreloader, 400);
  }
  preloaderFill.style.width = progress + '%';
}, 40);

// Custom Cursor Logic
const cursorDot = document.getElementById('cursorDot')
const cursorRing = document.getElementById('cursorRing')

if (cursorDot && cursorRing) {
  let mouseX = window.innerWidth / 2
  let mouseY = window.innerHeight / 2
  let ringX = mouseX
  let ringY = mouseY

  // Follow mouse
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY

    // Instant dot movement
    cursorDot.style.left = `${mouseX}px`
    cursorDot.style.top = `${mouseY}px`
  })

  // Smooth ring animation
  function animateCursorRing() {
    ringX += (mouseX - ringX) * 0.15
    ringY += (mouseY - ringY) * 0.15

    cursorRing.style.left = `${ringX}px`
    cursorRing.style.top = `${ringY}px`

    requestAnimationFrame(animateCursorRing)
  }
  animateCursorRing()

  // Hover effect on clickable elements
  const clickables = document.querySelectorAll('a, button, input, select, textarea, .glass-card, .alevior-product-card, .csr-card, .pillar-3d-card')
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.width = '50px'
      cursorRing.style.height = '50px'
      cursorRing.style.backgroundColor = 'rgba(117, 214, 117, 0.1)'
    })
    el.addEventListener('mouseleave', () => {
      cursorRing.style.width = '36px'
      cursorRing.style.height = '36px'
      cursorRing.style.backgroundColor = 'transparent'
    })
  })
}

// Ensure preloader works
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader')
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0'
      setTimeout(() => {
        preloader.style.display = 'none'
      }, 500)
    }, 1500)
  }
})

function hidePreloader() {
  gsap.to(preloader, {
    opacity: 0,
    duration: 0.7,
    ease: 'power2.inOut',
    onComplete: () => {
      preloader.style.display = 'none';
      initHeroAnimations();
      initGXSlider();
      initPillarCarousel();
    }
  });
}

// ── GSAP ScrollTrigger Registration ───────────────────
gsap.registerPlugin(ScrollTrigger);

// ── Custom Cursor Removed ──────────────────────────────


// ── Navbar Scroll Behavior ─────────────────────────────
const navbar = document.getElementById('navbar');
// navProgress removed
const navLinks = document.querySelectorAll('.nav-link');

function updateNav() {
  const scrollY = window.scrollY;
  // navProgress update removed
  navbar.classList.toggle('scrolled', scrollY > 50);

  // Highlight active nav link
  const sections = ['home', 'mission', 'coconut', 'alevior', 'csr', 'careers', 'contact'];
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= 100) current = id;
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.dataset.section === current);
  });

  // Back to top
  document.getElementById('backToTop').classList.toggle('visible', scrollY > 500);
}
window.addEventListener('scroll', updateNav, { passive: true });

// ── Hamburger Menu ─────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = navLinksEl.classList.contains('open');
  gsap.to(spans[0], { rotate: isOpen ? 45 : 0, y: isOpen ? 7 : 0, duration: 0.3 });
  gsap.to(spans[1], { opacity: isOpen ? 0 : 1, duration: 0.2 });
  gsap.to(spans[2], { rotate: isOpen ? -45 : 0, y: isOpen ? -7 : 0, duration: 0.3 });
});
navLinksEl.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
  navLinksEl.classList.remove('open');
  const spans = hamburger.querySelectorAll('span');
  gsap.to(spans[0], { rotate: 0, y: 0, duration: 0.3 });
  gsap.to(spans[1], { opacity: 1, duration: 0.2 });
  gsap.to(spans[2], { rotate: 0, y: 0, duration: 0.3 });
}));

// ── Back to Top ────────────────────────────────────────
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Three.js Hero 3D Background ───────────────────────
function initThreeHero() {
  const canvas = document.getElementById('heroCanvas');
  console.log('initThreeHero: canvas element:', canvas);
  if (!canvas) {
    console.error('initThreeHero: heroCanvas NOT found in DOM!');
    return;
  }
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5;

  // Floating geometric particles (heavily muted)
  const geometry = new THREE.TetrahedronGeometry(0.08, 0);
  const material = new THREE.MeshPhongMaterial({
    color: 0x75d675,
    emissive: 0x3ea03e,
    shininess: 100,
    transparent: true,
    opacity: 0.05, // Heavily muted opacity
  });

  const particles = [];
  for (let i = 0; i < 60; i++) {
    const mesh = new THREE.Mesh(geometry, material.clone());
    mesh.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 8
    );
    mesh.scale.setScalar(Math.random() * 1.5 + 0.5);
    mesh.userData = {
      vx: (Math.random() - 0.5) * 0.004,
      vy: (Math.random() - 0.5) * 0.004,
      vz: (Math.random() - 0.5) * 0.003,
      rx: (Math.random() - 0.5) * 0.01,
      ry: (Math.random() - 0.5) * 0.01,
    };
    scene.add(mesh);
    particles.push(mesh);
  }

  // Lighting (Subtle)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2) // Muted from 0.5
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0x75D675, 0.2) // Muted from 1
  dirLight.position.set(5, 5, 5)
  scene.add(dirLight)

  const dirLight2 = new THREE.DirectionalLight(0x75D675, 0.1) // Muted from 0.5
  dirLight2.position.set(-5, -5, -5)
  scene.add(dirLight2)

  const sphere2Mat = new THREE.MeshBasicMaterial({ color: 0x75d675, wireframe: true, transparent: true, opacity: 0.03 });
  const sphere2 = new THREE.Mesh(sphere2Geo, sphere2Mat);
  sphere2.position.set(-5, 2, -4);
  scene.add(sphere2);

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animateThree() {
    requestAnimationFrame(animateThree);
    const t = Date.now() * 0.001;
    particles.forEach((p, i) => {
      p.position.x += p.userData.vx;
      p.position.y += p.userData.vy;
      p.position.z += p.userData.vz;
      p.rotation.x += p.userData.rx;
      p.rotation.y += p.userData.ry;
      // Wrap
      if (p.position.x > 10) p.position.x = -10;
      if (p.position.x < -10) p.position.x = 10;
      if (p.position.y > 7) p.position.y = -7;
      if (p.position.y < -7) p.position.y = 7;
      // Pulse opacity
      p.material.opacity = 0.3 + Math.sin(t + i * 0.7) * 0.3;
    });

    sphere.rotation.y = t * 0.08;
    sphere.rotation.x = t * 0.04;
    sphere2.rotation.y = -t * 0.06;
    sphere2.rotation.z = t * 0.03;

    // Camera parallax
    camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.03;
    camera.position.y += (mouseY * 0.2 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animateThree();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

if (document.getElementById('heroCanvas')) {
  try { initThreeHero(); } catch (e) { console.warn('Three.js init failed:', e); }
}


// ── Particles.js background for hero ──────────────────
// ── Particles.js background for hero ──────────────────
// Removing particlesJS as the container no longer exists for African Hero
// if (typeof particlesJS !== 'undefined') {
//   particlesJS('particlesBg', { ... });
// }

// ── Hero Entrance Animations ───────────────────────────
function initHeroAnimations() {
  // Stat number counter animation
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  statNums.forEach(el => {
    const target = +el.dataset.target;
    gsap.to(el, {
      innerText: target,
      duration: 2.5,
      ease: 'power2.out',
      delay: 1.5,
      snap: { innerText: 1 },
      onUpdate() { el.textContent = Math.round(+el.innerText); }
    });
  });
}

// ── Reveal on Scroll (IntersectionObserver) ────────────
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.1 + 's';
  revealObserver.observe(el);
});

// ── Count-Up for CSR Impact Section ───────────────────
const countUps = document.querySelectorAll('.count-up');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.target;
      gsap.to({ val: 0 }, {
        val: target,
        duration: 2.5,
        ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].val); }
      });
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });
countUps.forEach(el => countObserver.observe(el));

// ── Vanilla Tilt Init ──────────────────────────────────
if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
    max: 10,
    speed: 400,
    glare: true,
    'max-glare': 0.2,
    perspective: 1000,
  });
}

// ── Contact Form ───────────────────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const formSubmitBtn = document.getElementById('formSubmitBtn');

contactForm && contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Button loading state
  const btnText = formSubmitBtn.querySelector('.btn-text');
  const btnIcon = formSubmitBtn.querySelector('.btn-icon');
  btnText.textContent = 'Sending...';
  btnIcon.textContent = '⏳';
  formSubmitBtn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    formSuccess.classList.add('visible');
    gsap.fromTo(formSuccess, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 });
    contactForm.reset();
    btnText.textContent = 'Send Inquiry';
    btnIcon.textContent = '→';
    formSubmitBtn.disabled = false;
  }, 1800);
});

// ── Smooth Anchor Scrolling ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── Parallax on Hero BG ────────────────────────────────
const heroBgImg = document.querySelector('.hero-bg-img');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (heroBgImg && scrollY < window.innerHeight) {
    heroBgImg.style.transform = `translateY(${scrollY * 0.3}px)`;
  }
}, { passive: true });

// ── Full-Width Parallax Hero ───────────────────────────
const parallaxHero = document.querySelector('.parallax-hero');
const parallaxBg = document.querySelector('.parallax-bg-wrapper');
const parallaxTitle = document.querySelector('.parallax-title-masked');

if (parallaxHero && parallaxBg && parallaxTitle) {
  // We use ScrollTrigger to move the background slower than the scroll speed.
  // We rigorously sync the text mask's background position to match it exactly.
  gsap.to([parallaxBg, parallaxTitle], {
    y: () => window.innerHeight * 0.4, // Move down by 40% of viewport over the scroll
    backgroundPosition: () => `center calc(50% + ${window.innerHeight * 0.4}px)`,
    ease: 'none',
    scrollTrigger: {
      trigger: parallaxHero,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}

// ── Globe Express Hero Slider (Infinite Carousel) ──────
function initGXSlider() {
  const slides     = Array.from(document.querySelectorAll('.gx-slide'));
  const carousel   = document.getElementById('gxCarousel');
  const label      = document.getElementById('gxLabel');
  const title      = document.getElementById('gxTitle');
  const desc       = document.getElementById('gxDesc');
  const cta        = document.getElementById('gxCta');
  const prevBtn    = document.querySelector('.prev-slide');
  const nextBtn    = document.querySelector('.next-slide');
  const hero       = document.querySelector('.gx-hero');
  const contentEls = [label, title, desc, cta];

  if (!slides.length || !carousel) return;

  const slidesData = [
    {
      label: "ESTABLISHED 2024",
      title: "Vetrivel<br>FARMS",
      desc: "Cultivating sustainability to power Coconut (Pure Oil) and enhance Alevior (Conscious Beauty).",
      cta: "DISCOVER FARMS",
      href: "#projects"
    },
    {
      label: "NATURE'S BEST",
      title: "Pure<br>COCONUT OIL",
      desc: "Superior quality coconut oil for food, industry, and personal care across domestic and international markets.",
      cta: "OUR PRODUCTS",
      href: "#coconut"
    },
    {
      label: "CONSCIOUS BEAUTY",
      title: "Alevior<br>BEAUTY",
      desc: "Leveraging the purity of VetriVel Farms' ingredients for premium cosmetic and personal care products.",
      cta: "DISCOVER MORE",
      href: "#alevior"
    },
    {
      label: "IMPACT",
      title: "Impact &amp;<br>SUSTAINABILITY",
      desc: "Focused on uplifting farming communities and practicing regenerative agriculture for a better future.",
      cta: "READ OUR STORY",
      href: "#impact"
    }
  ];

  let current    = 0;
  let isMoving   = false;
  let autoTimer  = null;

  // ── Calculate Card Item Width dynamically ──
  function getCardItemWidth() {
    const card = carousel.querySelector('.gx-card');
    if (!card) return 175 + 16;
    const style = window.getComputedStyle(carousel);
    const gap = parseFloat(style.gap) || 16;
    return card.offsetWidth + gap;
  }
  let CARD_W = getCardItemWidth();
  window.addEventListener('resize', () => { 
    CARD_W = getCardItemWidth(); 
    // Re-center on resize while preserving current index
    carouselX = -CARD_W * (cardCount + current);
    gsap.set(carousel, { x: carouselX });
  });

  // ── Clone cards for seamless loop ──
  function buildCarousel() {
    const origCards = Array.from(carousel.children);
    
    // Append a full set at the end
    origCards.forEach(c => {
      const clone = c.cloneNode(true);
      clone.dataset.clone = '1';
      clone.addEventListener('click', onCardClick);
      carousel.appendChild(clone);
    });

    // Prepend a full set at the start (in reverse order to maintain visual sequence)
    [...origCards].reverse().forEach(c => {
      const clone = c.cloneNode(true);
      clone.dataset.clone = '1';
      clone.addEventListener('click', onCardClick);
      carousel.prepend(clone);
    });

    // Start offset: show original set (middle)
    gsap.set(carousel, { x: -CARD_W * origCards.length });
    return origCards.length;
  }

  // ── Infinite scroll via GSAP + DOM repositioning ──
  let cardCount   = 0;
  let carouselX   = 0;
  let totalOrigW  = 0;

  function advanceCarousel(steps) {
    carouselX -= steps * CARD_W;
    
    gsap.to(carousel, {
      x: carouselX,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        const totalW = CARD_W * cardCount;
        // Silent rebalance: Keep carouselX within the bounded Clone1-Original-Clone2 range
        if (carouselX <= -totalW * 2) {
          carouselX += totalW;
        } else if (carouselX > -totalW) {
          carouselX -= totalW;
        }
        gsap.set(carousel, { x: carouselX });
      }
    });
  }

  // ── Cinematic Anchored Inward-Zoom Expansion Reveal ──
  function goTo(nextIdx, cardDir = 1, clickedCard = null) {
    if (isMoving) return;
    isMoving = true;

    const next = ((nextIdx % slides.length) + slides.length) % slides.length;
    const data = slidesData[next];
    
    const nextSlide    = slides[next];
    const currentSlide = slides[current];
    const nextBg       = nextSlide.querySelector('.gx-slide-bg');

    // 1. Identify VISIBLE source for clip-path expansion
    const heroRect = hero.getBoundingClientRect();
    let sourceCard = clickedCard;
    if (!sourceCard) {
      const allCards = Array.from(carousel.children);
      // Find the card for 'next' slide that is most centered in the hero viewport
      sourceCard = allCards.filter(c => parseInt(c.dataset.slide) === next)
        .sort((a,b) => {
          const distA = Math.abs((a.getBoundingClientRect().left + a.offsetWidth/2) - heroRect.width/2);
          const distB = Math.abs((b.getBoundingClientRect().left + b.offsetWidth/2) - heroRect.width/2);
          return distA - distB;
        })[0] || allCards.find(c => !c.dataset.clone);
    }

    const rect = sourceCard.getBoundingClientRect();

    // 2. Calculate Center Point for Anchored Zoom (transform-origin)
    const centerX = ((rect.left + rect.width / 2) - heroRect.left);
    const centerY = ((rect.top + rect.height / 2) - heroRect.top);
    const originX = (centerX / heroRect.width) * 100;
    const originY = (centerY / heroRect.height) * 100;

    // 3. Calculate Insets (%) for Clip-Path
    const top    = ((rect.top - heroRect.top) / heroRect.height) * 100;
    const left   = ((rect.left - heroRect.left) / heroRect.width) * 100;
    const right  = 100 - (((rect.left - heroRect.left) + rect.width) / heroRect.width) * 100;
    const bottom = 100 - (((rect.top - heroRect.top) + rect.height) / heroRect.height) * 100;

    const startClip = `inset(${top}% ${right}% ${bottom}% ${left}% round 18px)`;
    const endClip   = `inset(0% 0% 0% 0% round 0px)`;

    const tl = gsap.timeline({
      onComplete: () => {
        currentSlide.classList.remove('active');
        nextSlide.classList.remove('transitioning');
        gsap.set(nextSlide, { clipPath: 'none' }); 
        isMoving = false;
        current = next;
      }
    });

    // A. Initial State for Next (Anchored, Scale at 1.0)
    nextSlide.classList.add('active', 'transitioning');
    gsap.set(nextSlide, { clipPath: startClip });
    gsap.set(nextBg, { 
      scale: 1.0, 
      opacity: 1,
      transformOrigin: `${originX}% ${originY}%` // Anchored to card center
    });

    // B. Content Fade Out (Fast)
    tl.to(contentEls, { opacity: 0, y: -15, duration: 0.25, stagger: 0.03, ease: 'power2.in' });

    // C. Anchored Expansion (Expansion + Zoom IN from the card origin)
    tl.to(nextSlide, {
      clipPath: endClip,
      duration: 1.3,
      ease: 'expo.inOut'
    }, 0.1);

    tl.to(nextBg, {
      scale: 1.25, // Powerful inward zoom originating from the card
      duration: 1.8,
      ease: 'power2.out'
    }, 0.1);

    // D. Update Text Content (Hidden)
    tl.add(() => {
      label.textContent = data.label;
      title.innerHTML   = data.title;
      desc.textContent  = data.desc;
      cta.textContent   = data.cta;
      cta.href          = data.href;
      gsap.set(contentEls, { y: 25, opacity: 0 });
    }, 0.9);

    // E. Content Reveal (Staggered Fade In Up)
    tl.to(contentEls, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    }, 1.1);

    // Sync Carousel
    advanceCarousel(cardDir);
  }

  // ── Drag & Swipe Logic ──
  let touchStartX = 0;
  let touchEndX = 0;
  let isPointerDown = false;

  const carouselWrap = document.querySelector('.gx-carousel-wrap');
  if (carouselWrap) {
    // Touch Events
    carouselWrap.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
      stopAuto();
    }, { passive: true });

    carouselWrap.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAuto();
    }, { passive: true });

    // Mouse Events for Desktop Testing
    carouselWrap.addEventListener('pointerdown', e => {
      isPointerDown = true;
      touchStartX = e.clientX;
      stopAuto();
    });
    
    window.addEventListener('pointerup', e => {
      if (!isPointerDown) return;
      isPointerDown = false;
      touchEndX = e.clientX;
      handleSwipe();
      startAuto();
    });

    function handleSwipe() {
      const diff = touchEndX - touchStartX;
      const threshold = 30; // 30px swipe threshold
      if (Math.abs(diff) > threshold) {
        if (diff > 0) goTo(current - 1, -1);
        else goTo(current + 1, 1);
      }
    }
    
    // Trackpad (Wheel) Events
    let wheelTimeout;
    carouselWrap.addEventListener('wheel', e => {
      // Only react to mostly horizontal scrolls
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 10) {
        e.preventDefault();
        if (!isMoving && !wheelTimeout) {
          stopAuto();
          if (e.deltaX > 0) goTo(current + 1, 1);
          else goTo(current - 1, -1);
          
          wheelTimeout = setTimeout(() => {
            wheelTimeout = null;
            startAuto();
          }, 600); // Prevent triggering multiple times per swipe
        }
      }
    }, { passive: false });

    carouselWrap.addEventListener('dragstart', e => e.preventDefault());
  }

  // ── Card click ──
  function onCardClick(e) {
    const card = e.currentTarget;
    const slideIdx = parseInt(card.dataset.slide);
    if (!isNaN(slideIdx) && slideIdx !== current) {
      const allCards = Array.from(carousel.children);
      
      // Calculate how many steps in the DOM to move to center the clicked card
      const currentCards = allCards.filter(c => parseInt(c.dataset.slide) === current);
      const heroRect = hero.getBoundingClientRect();
      const activeCard = currentCards.find(c => {
        const r = c.getBoundingClientRect();
        return r.left >= 0 && r.left < heroRect.width;
      }) || currentCards[0];

      const activeIdx = allCards.indexOf(activeCard);
      const clickedIdx = allCards.indexOf(card);
      const steps = clickedIdx - activeIdx;

      stopAuto();
      goTo(slideIdx, steps, card);
      startAuto();
    }
  }

  // ── Initial Reveal ──
  function initialReveal() {
    gsap.to(contentEls, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.1,
      delay: 0.5,
      ease: 'power3.out'
    });
  }

  // ── Auto play ──
  function startAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      goTo(current + 1, 1);
    }, 5500);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  // ── Init ──
  cardCount = buildCarousel();
  carouselX = -CARD_W * cardCount; // Start after initial clones

  // Attach original card listeners
  Array.from(carousel.children).forEach(c => {
    if (!c.dataset.clone) c.addEventListener('click', onCardClick);
  });

  // Navigate on arrows
  nextBtn?.addEventListener('click', () => { stopAuto(); goTo(current + 1, 1);  startAuto(); });
  prevBtn?.addEventListener('click', () => { stopAuto(); goTo(current - 1, -1); startAuto(); });

  // Pause on hover
  hero?.addEventListener('mouseenter', stopAuto);
  hero?.addEventListener('mouseleave', startAuto);

  initialReveal();
  startAuto();
}


// ── GSAP ScrollTrigger: Section heading animations ─────
gsap.utils.toArray('.section-title').forEach(el => {
  gsap.fromTo(el,
    { backgroundPosition: '200% center' },
    {
      backgroundPosition: '0% center',
      duration: 1.5,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%' }
    }
  );
});

// ── Marquee speed control on hover ────────────────────
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  const marqueeWrap = marqueeTrack.parentElement;
  marqueeWrap.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeWrap.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

// ── Product image 3D hover effect (CSS tilt override) ──
document.querySelectorAll('.product-float').forEach(el => {
  let ticking = false;
  el.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      gsap.to(el, {
        rotateY: dx * 20,
        rotateX: -dy * 15,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 800
      });
      ticking = false;
    });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  });
});

// ── Feature cards stagger on scroll ───────────────────
ScrollTrigger.batch('.feature-card', {
  onEnter: batch => {
    gsap.fromTo(batch,
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out' }
    );
  },
  once: true,
});

// ── CSR Cards stagger ──────────────────────────────────
ScrollTrigger.batch('.csr-card', {
  onEnter: batch => {
    gsap.fromTo(batch,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out' }
    );
  },
  once: true,
});

// ── Alevior cards stagger ──────────────────────────────
ScrollTrigger.batch('.alevior-card', {
  onEnter: batch => {
    gsap.fromTo(batch,
      { opacity: 0, scale: 0.92, y: 40 },
      { opacity: 1, scale: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'back.out(1.5)' }
    );
  },
  once: true,
});

// Pillar cards animation removed - handled by 3D Carousel

// ── Impact counter bar animation ───────────────────────
gsap.fromTo('.impact-counters',
  { opacity: 0, y: 50, scale: 0.96 },
  {
    opacity: 1, y: 0, scale: 1,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.impact-counters', start: 'top 80%', once: true }
  }
);

// ── Floating orbs parallax ─────────────────────────────
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  if (orb1) orb1.style.transform = `translateY(${scrollY * 0.15}px)`;
  if (orb2) orb2.style.transform = `translateY(${-scrollY * 0.08}px)`;
}, { passive: true });

// ── 3D Pillars Carousel ──────────────────────────────
function initPillarCarousel() {
  const cards = document.querySelectorAll('.pillar-3d-card');
  const wrapper = document.getElementById('pillarsCarousel');
  const dotsContainer = document.getElementById('pillarDots');
  const prevBtn = document.getElementById('pillarPrev');
  const nextBtn = document.getElementById('pillarNext');

  if (!cards.length || !wrapper) return;

  let currentIndex = 0;
  let autoTimer;
  let touchStartX = 0;
  let touchEndX = 0;
  let isDragging = false;

  // Create Dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = `c-nav-dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => updateCarousel(i));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.c-nav-dot');

  function updateCarousel(index) {
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;
    currentIndex = index;

    cards.forEach((card, i) => {
      card.className = 'pillar-3d-card'; // Reset
      dots[i].classList.remove('active');

      const isMobile = window.innerWidth <= 480;
      const isTablet = window.innerWidth <= 968;
      
      let xOffset = isMobile ? 140 : (isTablet ? 180 : 240);
      let zOffset = isMobile ? -80 : -100;
      let rotateAngle = isMobile ? 35 : 45;



      if (i === currentIndex) {
        card.classList.add('active');
        dots[i].classList.add('active');
        gsap.to(card, {
          x: 0,
          z: isMobile ? 100 : 160,
          rotateY: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          overwrite: true
        });
      } else if (i === (currentIndex + 1) % cards.length) {
        card.classList.add('next');
        gsap.to(card, {
          x: xOffset,
          z: zOffset,
          rotateY: -rotateAngle,
          opacity: 0.7,
          duration: 0.8,
          ease: 'power3.out',
          overwrite: true
        });
      } else if (i === (currentIndex - 1 + cards.length) % cards.length) {
        card.classList.add('prev');
        gsap.to(card, {
          x: -xOffset,
          z: zOffset,
          rotateY: rotateAngle,
          opacity: 0.7,
          duration: 0.8,
          ease: 'power3.out',
          overwrite: true
        });
      } else {
        gsap.to(card, {
          x: 0,
          z: -600,
          rotateY: 0,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          overwrite: true
        });
      }
    });

    startAutoRotate();
  }

  // Handle Resize for Carousel
  window.addEventListener('resize', () => {
    updateCarousel(currentIndex);
  });


  function startAutoRotate() {
    stopAutoRotate();
    autoTimer = setInterval(() => {
      updateCarousel(currentIndex + 1);
    }, 5000);
  }

  function stopAutoRotate() {
    if (autoTimer) clearInterval(autoTimer);
  }

  prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
  nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));

  // Initialize
  updateCarousel(0);

  // Drag & Swipe Logic
  function handleDragStart(e) {
    if (e.target.closest('.c-nav-btn, .c-nav-dot')) return; // Don't interrupt buttons
    isDragging = true;
    touchStartX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    stopAutoRotate();
  }

  function handleDragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    
    // Support both mouse and touch end events
    const finalX = (e.type.includes('touch')) 
      ? (e.changedTouches ? e.changedTouches[0].clientX : touchStartX) 
      : e.clientX;
      
    touchEndX = finalX;
    const diff = touchEndX - touchStartX;
    const threshold = 40; // Slightly more sensitive

    if (Math.abs(diff) > threshold) {
      if (diff > 0) updateCarousel(currentIndex - 1);
      else updateCarousel(currentIndex + 1);
    } else {
      startAutoRotate(); // Resume if no movement
    }
  }

  // Prevent image/text dragging from interfering
  wrapper.addEventListener('dragstart', (e) => e.preventDefault());

  wrapper.addEventListener('mousedown', handleDragStart);
  window.addEventListener('mouseup', handleDragEnd);
  wrapper.addEventListener('touchstart', handleDragStart, { passive: true });
  wrapper.addEventListener('touchend', handleDragEnd);

  // Pause on hover
  wrapper.addEventListener('mouseenter', stopAutoRotate);
  wrapper.addEventListener('mouseleave', startAutoRotate);
}

console.log('%cVetriVel Farms 🌿', 'color:#10b981; font-size:20px; font-weight:bold');
console.log('%cFrom Earth to Life.', 'color:#34d399; font-size:14px;');

// ═══════════════════ LIQUID GLASS BLOBS ═══════════════════
function initLiquidBlobs() {
  const blobs = document.querySelectorAll('.liquid-blob');
  if (!blobs.length) return;

  console.log('Initializing Liquid Blobs Animation...');

  blobs.forEach((blob, i) => {
    // Movement
    gsap.to(blob, {
      x: 'random(-150, 150)',
      y: 'random(-150, 150)',
      duration: 'random(15, 25)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 3
    });

    // Pulse
    gsap.to(blob, {
      scale: 'random(0.7, 1.3)',
      opacity: 'random(0.2, 0.6)',
      duration: 'random(8, 12)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  });
}

// ── Cinematic Reveal Animation - Local Integration ────────
function initRevealAnimation() {
  const canvas = document.getElementById('reveal-canvas');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  const frameCount = 192;
  
  const currentFrame = index => (
    `public/coconut/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
  );

  const images = [];
  const revealData = { frame: 0 };

  // Preload frames
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }

  // Draw first frame
  images[0].onload = () => render(images[0]);

  gsap.to(revealData, {
    frame: frameCount - 1,
    snap: 'frame',
    ease: 'none',
    scrollTrigger: {
      trigger: '#coconut',
      start: 'top 80%', // Start as the section nears the viewport
      end: 'bottom 20%', // End as it leaves
      scrub: 1.5, // Smoother scrub for local feel
      onUpdate: () => render(images[revealData.frame])
    }
  });

  function render(img) {
    if (!img || !img.complete) return;
    
    // Scale canvas for HD rendering
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.9; // Slight padding
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
  }

  window.addEventListener('resize', () => render(images[revealData.frame]));
}

// ── Card Spotlight Tracking ───────────────────────────
function initSpotlightCards() {
  const cards = document.querySelectorAll('.alevior-card, .csr-card, .pillar-3d-card, .job-card, .career-project-card, .glass-contact-wrapper, .contact-vitals, .glass-form-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// Call on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initLiquidBlobs();
    initRevealAnimation();
    initSpotlightCards();
  });
} else {
  initLiquidBlobs();
  initRevealAnimation();
  initSpotlightCards();
}
