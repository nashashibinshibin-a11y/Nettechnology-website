// GSAP and ScrollTrigger Animation Orchestration
document.addEventListener('DOMContentLoaded', () => {
  // Always initialize the neural network canvas background first
  initHeroNetworkCanvas();

  // Respect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.info('Prefers-reduced-motion is active. Skipping animations.');
    initReducedMotionState();
    return;
  }

  // Check if GSAP is available
  if (typeof gsap !== 'undefined') {
    // Register ScrollTrigger plugin
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    
    initHeroAnimations();
    initAboutBrandMarkAnimations();
    initServicesHubAnimations();
    initAMCShieldAnimations();
    initContactSignalAnimations();
    
    initStatsCounterAnimations();
    initRevealAnimations();
    initICTRibbonAnimations();
    initHorizonArcAnimations();
    initFloatingShapesAnimations();
  } else {
    console.warn('GSAP is not loaded. Activating CSS fallback.');
    initFallbackAnimations();
  }
});

// A. Static Final State fallback for prefers-reduced-motion
function initReducedMotionState() {
  // Set all items to their completed states statically
  document.querySelectorAll('.kinetic-word').forEach(w => {
    w.style.opacity = '1';
    w.style.transform = 'none';
    w.style.filter = 'none';
  });
  const tagline = document.querySelector('.hero-tagline');
  const actions = document.querySelector('.hero-actions');
  const scroll = document.querySelector('.scroll-indicator');
  if (tagline) { tagline.style.opacity = '1'; tagline.style.transform = 'none'; }
  if (actions) { actions.style.opacity = '1'; actions.style.transform = 'none'; }
  if (scroll) { scroll.style.opacity = '1'; }
  
  // Counters
  document.querySelectorAll('.stat-number').forEach(stat => {
    const target = stat.getAttribute('data-target') || '0';
    const suffix = stat.getAttribute('data-suffix') || '';
    stat.textContent = target + suffix;
  });

  // General reveals
  document.querySelectorAll('.reveal-card, .fade-up-trigger, .horizon-tag-card, .av-solution-item, .ict-solution-row').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });

  // Services line path
  const linePath = document.querySelector('.ict-network-line');
  if (linePath) linePath.style.strokeDashoffset = '0';

  // Services circuit diagram
  document.querySelectorAll('.hub-line').forEach(line => line.style.strokeDashoffset = '0');
  document.querySelectorAll('.hub-node').forEach(node => node.style.opacity = '1');

  // AMC Shield
  document.querySelectorAll('.shield-piece').forEach(p => {
    p.style.opacity = '1';
    p.style.transform = 'none';
  });

  // Contact Signal
  document.querySelectorAll('.signal-piece').forEach(p => {
    p.style.opacity = '1';
    p.style.transform = 'none';
  });
}

// 1. Home Hero Page — Showcase Load reveal (no pinning or scroll-jacking)
function initHeroAnimations() {
  const words = document.querySelectorAll('.kinetic-word');
  
  // Stagger kinetic text reveal first
  if (words.length > 0) {
    gsap.fromTo(words, 
      { opacity: 0, y: 20, filter: 'blur(4px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        stagger: 0.04,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          gsap.to('.hero-tagline', { opacity: 1, y: 0, duration: 0.6 });
          gsap.to('.hero-actions', { opacity: 1, y: 0, duration: 0.6, delay: 0.1 });
          gsap.to('.hero-trust-badge', { opacity: 1, y: 0, duration: 0.6, delay: 0.15 });
          if (document.querySelector('.scroll-indicator')) {
            gsap.to('.scroll-indicator', { opacity: 1, duration: 0.6, delay: 0.25 });
          }
        }
      }
    );
  }

  // Smooth entrance for interactive graphic panel
  const interactiveGraphic = document.querySelector('.hero-interactive-graphic');
  if (interactiveGraphic) {
    gsap.fromTo(interactiveGraphic,
      { opacity: 0, y: 30, scale: 0.98 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 1.2, 
        ease: 'power3.out', 
        delay: 0.3,
        onComplete: () => {
          // Stagger reveal of interactive nodes & labels
          const dots = interactiveGraphic.querySelectorAll('.hotspot-dot');
          const labels = interactiveGraphic.querySelectorAll('.hotspot-label');
          const paths = interactiveGraphic.querySelectorAll('.hero-net-path');

          // Initialize opacity for graphic components
          gsap.set([dots, labels], { opacity: 0 });

          // Animate SVG paths drawing
          paths.forEach(path => {
            const length = path.getTotalLength() || 150;
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            gsap.to(path, {
              strokeDashoffset: 0,
              duration: 1.2,
              ease: 'power2.out'
            });
          });

          // Stagger reveal dots (pop-in scale)
          gsap.fromTo(dots,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'back.out(1.5)', delay: 0.1 }
          );

          // Stagger reveal labels
          gsap.fromTo(labels,
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power2.out', delay: 0.3 }
          );
        }
      }
    );

    // Setup interactive hover linking
    const interactives = interactiveGraphic.querySelectorAll('.hotspot-dot, .hotspot-label');
    interactives.forEach(el => {
      const nodeName = el.getAttribute('data-node');
      if (!nodeName) return;

      const group = interactiveGraphic.querySelectorAll(`[data-node="${nodeName}"]`);

      el.addEventListener('mouseenter', () => {
        group.forEach(item => item.classList.add('hovered'));
      });

      el.addEventListener('mouseleave', () => {
        group.forEach(item => item.classList.remove('hovered'));
      });
    });
  }
}

// 2. About Us — Brand Mark Formation (clean fade/slide reveal)
function initAboutBrandMarkAnimations() {
  const brandContainer = document.querySelector('.logo-formation-container');
  if (brandContainer) {
    gsap.fromTo('.piece-1', 
      { x: -30, opacity: 0 },
      {
        x: -20,
        opacity: 1,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about-hero',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );

    gsap.fromTo('.piece-2', 
      { x: 30, opacity: 0 },
      {
        x: 20,
        opacity: 1,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about-hero',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }
}

// 3. Services — Circuit / Hub Reveal
function initServicesHubAnimations() {
  const hubDiagram = document.querySelector('.services-hub-diagram');
  if (hubDiagram) {
    const lines = document.querySelectorAll('.hub-line');
    const nodes = document.querySelectorAll('.hub-node');
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.services-hub-diagram',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    tl.to(lines, {
      strokeDashoffset: 0,
      stagger: 0.1,
      duration: 1.2,
      ease: 'power2.out'
    })
    .to(nodes, {
      opacity: 1,
      stagger: 0.1,
      duration: 0.4
    }, '-=0.4');
  }
}

// 4. AMC — Shield Assembly (clean pulse & rotation, no scroll explosion)
function initAMCShieldAnimations() {
  const shieldWrapper = document.querySelector('.amc-shield-wrapper');
  if (shieldWrapper) {
    gsap.fromTo('.shield-piece', 
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        stagger: 0.1,
        duration: 1.0,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: '.amc-shield-wrapper',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        onComplete: () => {
          // Slow idle rotation + pulse glow of shield once completed
          gsap.to('.shield-assembled-group', {
            rotation: 360,
            duration: 45,
            repeat: -1,
            ease: 'none'
          });
          
          gsap.to('.shield-assembled-group', {
            scale: 1.02,
            duration: 3,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
          });
        }
      }
    );
  }
}

// 5. Contact — Converging Signal (simple clean entry)
function initContactSignalAnimations() {
  const signalWrapper = document.querySelector('.contact-signal-wrapper');
  if (signalWrapper) {
    gsap.fromTo('.signal-piece',
      { y: 15, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.contact-signal-wrapper',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }
}

// 6. Stats Section Number Counters
function initStatsCounterAnimations() {
  const stats = document.querySelectorAll('.stat-number');
  stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
    const suffix = stat.getAttribute('data-suffix') || '';
    
    // Set initially to 0
    stat.textContent = '0' + suffix;
    
    const countObj = { val: 0 };
    gsap.to(countObj, {
      val: target,
      duration: 2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: stat,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      onUpdate: () => {
        stat.textContent = Math.floor(countObj.val) + suffix;
      }
    });
  });
}

// 7. Grid elements entry reveal (General card lists & Section staggers page-wide)
function initRevealAnimations() {
  // Respect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // Select all content sections (excluding hero and navbar)
    const sections = document.querySelectorAll('section:not(.hero-pinned-container):not(.navbar)');
    
    sections.forEach(sec => {
      // Find headers, badges, titles and cards inside this section
      const badge = sec.querySelector('.section-badge:not(.amc-spotlight-panel *)');
      const title = sec.querySelector('.section-title');
      const header = sec.querySelector('.solutions-header, .about-section-header, .section-header');
      
      // Filter out solution-card, pricing-card and spotlight elements from general section timeline
      const cards = Array.from(sec.querySelectorAll('.bento-card, .about-bento-card, .glass-card, .usp-item, .reveal-card, .fade-up-trigger, .industry-card, .amc-benefit-card, .horizon-tag-card'))
        .filter(c => !c.closest('.amc-spotlight-panel'));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      // 1. Animate header elements
      const headerElements = [];
      if (badge) headerElements.push(badge);
      if (title) headerElements.push(title);
      if (header) headerElements.push(header);

      if (headerElements.length > 0) {
        tl.fromTo(headerElements,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.08 }
        );
      }

      // 2. Premium stagger reveal cards and widgets (fade, translate, and scale)
      if (cards.length > 0) {
        tl.fromTo(cards,
          { opacity: 0, y: 40, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power4.out', stagger: 0.07 },
          headerElements.length > 0 ? '-=0.4' : '0'
        );
      } else if (headerElements.length === 0) {
        // Fallback for simple sections with no headers or cards
        // Only run if it's not the container of amc-spotlight-panel, which we animate customly below
        if (!sec.querySelector('.amc-spotlight-panel')) {
          tl.fromTo(sec,
            { opacity: 0, y: 35 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
          );
        }
      }
    });

    // 3. 3D Perspective Reveal for Solution and Pricing Cards
    const solutionCards = document.querySelectorAll('.solution-card, .pricing-card, .service-detail-card');
    solutionCards.forEach(card => {
      gsap.fromTo(card,
        {
          opacity: 0,
          y: 60,
          rotationX: 12,
          transformPerspective: 1000,
          transformOrigin: "top center",
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // 4. Convergence Split Reveal for AMC Spotlight panel
    const amcSpotlight = document.querySelector('.amc-spotlight-panel');
    if (amcSpotlight) {
      const amcImg = amcSpotlight.querySelector('.amc-spotlight-img-box');
      const amcContent = amcSpotlight.querySelector('.amc-spotlight-content');
      
      const amcTl = gsap.timeline({
        scrollTrigger: {
          trigger: amcSpotlight,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
      
      amcTl.fromTo(amcSpotlight,
        { opacity: 0, y: 55 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
      
      if (amcImg && amcContent) {
        amcTl.fromTo(amcImg,
          { opacity: 0, x: -60 },
          { opacity: 1, x: 0, duration: 0.95, ease: 'power4.out' },
          '-=0.45'
        );
        amcTl.fromTo(amcContent,
          { opacity: 0, x: 60 },
          { opacity: 1, x: 0, duration: 0.95, ease: 'power4.out' },
          '-=0.95'
        );
      }
    }

    // Handle standalone fade-ups outside sections
    const standaloneFadeUps = document.querySelectorAll('.fade-up-trigger:not(section *)');
    standaloneFadeUps.forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 30, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

  } else {
    // Failsafe IntersectionObserver fallback for scroll reveal
    const sections = document.querySelectorAll('section:not(.hero-pinned-container)');
    
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sec = entry.target;
          sec.style.opacity = '1';
          sec.style.transform = 'translateY(0)';
          
          // Stagger child elements
          sec.querySelectorAll('.solution-card, .bento-card, .about-bento-card, .glass-card, .reveal-card, .fade-up-trigger, .industry-card, .horizon-tag-card, .pricing-card, .service-detail-card').forEach((c, idx) => {
            setTimeout(() => {
              c.style.opacity = '1';
              c.style.transform = 'translateY(0) scale(1) rotateX(0)';
            }, idx * 60);
          });

          // Custom handle AMC Spotlight split fallback
          const spotlight = sec.querySelector('.amc-spotlight-panel');
          if (spotlight) {
            spotlight.style.opacity = '1';
            spotlight.style.transform = 'translateY(0)';
            const img = spotlight.querySelector('.amc-spotlight-img-box');
            const content = spotlight.querySelector('.amc-spotlight-content');
            if (img) {
              img.style.opacity = '1';
              img.style.transform = 'translateX(0)';
            }
            if (content) {
              content.style.opacity = '1';
              content.style.transform = 'translateX(0)';
            }
          }
          
          obs.unobserve(sec);
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(sec => {
      sec.style.opacity = '0';
      sec.style.transform = 'translateY(20px)';
      sec.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
      
      sec.querySelectorAll('.solution-card, .bento-card, .about-bento-card, .glass-card, .reveal-card, .fade-up-trigger, .horizon-tag-card, .pricing-card, .service-detail-card').forEach(c => {
        c.style.opacity = '0';
        c.style.transform = 'translateY(20px) scale(0.96)';
        c.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      });

      const spotlight = sec.querySelector('.amc-spotlight-panel');
      if (spotlight) {
        spotlight.style.opacity = '0';
        spotlight.style.transform = 'translateY(25px)';
        spotlight.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';

        const img = spotlight.querySelector('.amc-spotlight-img-box');
        const content = spotlight.querySelector('.amc-spotlight-content');
        if (img) {
          img.style.opacity = '0';
          img.style.transform = 'translateX(-25px)';
          img.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
        }
        if (content) {
          content.style.opacity = '0';
          content.style.transform = 'translateX(25px)';
          content.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
        }
      }

      observer.observe(sec);
    });
  }
}

// 8. ICT Solutions Network Ribbon Drawing line
function initICTRibbonAnimations() {
  const linePath = document.querySelector('.ict-network-line');
  if (linePath) {
    // Draw SVG path on scroll
    gsap.fromTo(linePath, {
      strokeDashoffset: 1000
    }, {
      strokeDashoffset: 0,
      scrollTrigger: {
        trigger: '.ict-solutions-layout',
        start: 'top 60%',
        end: 'bottom 80%',
        scrub: 1.2
      }
    });

    // Stagger items connected to ribbon
    const rowItems = document.querySelectorAll('.ict-solution-row');
    rowItems.forEach(row => {
      gsap.from(row.querySelector('.ict-content-panel'), {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 75%'
        }
      });
      
      gsap.from(row.querySelector('.ict-visual-panel'), {
        x: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 75%'
        }
      });
    });
  }
}

// 9. Industries We Serve Horizon Arc Reveal
function initHorizonArcAnimations() {
  const horizonArc = document.querySelector('.horizon-arc-wrapper');
  if (horizonArc) {
    gsap.fromTo(horizonArc, 
      { y: 150, scaleX: 0.8, opacity: 0 },
      {
        y: 0,
        scaleX: 1.1,
        opacity: 1,
        scrollTrigger: {
          trigger: '.horizon-section',
          start: 'top 80%',
          end: 'bottom 100%',
          scrub: 1
        }
      }
    );

    const tagCards = document.querySelectorAll('.horizon-tag-card');
    if (tagCards.length > 0) {
      gsap.to(tagCards, {
        y: 0,
        opacity: 1,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.horizon-tags-grid',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }
  }
}

// 10. Floating Glass Elements (Orbiting final CTA)
function initFloatingShapesAnimations() {
  const shapes = document.querySelectorAll('.floating-shape');
  shapes.forEach((shape, index) => {
    gsap.to(shape, {
      y: '+=20',
      x: '-=15',
      rotation: index % 2 === 0 ? '+=15' : '-=15',
      duration: 6 + index * 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  });
}

// Graceful fallback for offline / failed load using Intersection Observer
function initFallbackAnimations() {
  const words = document.querySelectorAll('.kinetic-word');
  words.forEach((word, index) => {
    setTimeout(() => {
      word.style.opacity = '1';
      word.style.transform = 'translateY(0)';
      word.style.filter = 'blur(0)';
    }, index * 80);
  });
  
  setTimeout(() => {
    const tagline = document.querySelector('.hero-tagline');
    const actions = document.querySelector('.hero-actions');
    const scroll = document.querySelector('.scroll-indicator');
    if (tagline) tagline.style.opacity = '1';
    if (tagline) tagline.style.transform = 'translateY(0)';
    if (actions) actions.style.opacity = '1';
    if (actions) actions.style.transform = 'translateY(0)';
    if (scroll) scroll.style.opacity = '1';
  }, words.length * 80 + 100);

  const stats = document.querySelectorAll('.stat-number');
  stats.forEach(stat => {
    const target = stat.getAttribute('data-target') || '0';
    const suffix = stat.getAttribute('data-suffix') || '';
    stat.textContent = target + suffix;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-card, .fade-up-trigger, .horizon-tag-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}

// Recalculate ScrollTrigger points after page is fully loaded (images, fonts, etc.)
window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});

// Premium Scoped Animated Tech Waves & Hex Grids backdrop
function initHeroNetworkCanvas() {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;

  // Mouse parallax tracking
  let mouseX = window.innerWidth * 0.5;
  let mouseY = window.innerHeight * 0.5;
  let targetMouseX = window.innerWidth * 0.5;
  let targetMouseY = window.innerHeight * 0.5;

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    targetMouseX = e.clientX - rect.left;
    targetMouseY = e.clientY - rect.top;
  }
  window.addEventListener('mousemove', onMouseMove);

  // Resize handler scoped to parent dimensions
  function resizeCanvas() {
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Ribbon configurations
  const ribbons = [
    {
      numStrands: 45,
      baseFraction: 0.45,
      speed: 0.16,
      phase: 0,
      freq1: 1.1,
      freq2: 0.7,
      amp1: 65,
      amp2: 30,
      squeezeFreq: 1.4,
      spread: 32,
      strandFreq: 2.1,
      strandOffset: 0.08,
      color1: { r: 15, g: 98, b: 254 }, // Royal Blue
      color2: { r: 120, g: 169, b: 255 }, // Light Blue
      baseAlpha: 0.085, // Increased opacity
      lineWidth: 1.1,
      depth: 14
    },
    {
      numStrands: 40,
      baseFraction: 0.53,
      speed: 0.13,
      phase: Math.PI * 0.45,
      freq1: 0.8,
      freq2: 1.3,
      amp1: 70,
      amp2: 35,
      squeezeFreq: 1.1,
      spread: 42,
      strandFreq: 1.7,
      strandOffset: 0.07,
      color1: { r: 0, g: 194, b: 203 }, // Teal/Cyan
      color2: { r: 15, g: 98, b: 254 }, // Royal Blue
      baseAlpha: 0.070, // Increased opacity
      lineWidth: 0.9,
      depth: 22
    }
  ];

  function getStrandY(x, s, W, H, t, pxOffsetY, config) {
    const timeSec = t * 0.001 * config.speed;
    
    // Base ribbon path curve
    const baseAngle1 = (x / W) * config.freq1 * Math.PI * 2 + timeSec * 0.7 + config.phase;
    const baseAngle2 = (x / W) * config.freq2 * Math.PI * 2 - timeSec * 0.4 + config.phase;
    const yBase = H * config.baseFraction + Math.sin(baseAngle1) * config.amp1 + Math.cos(baseAngle2) * config.amp2;

    // Squeezing and fanning logic
    const squeezeAngle = (x / W) * config.squeezeFreq * Math.PI * 2 + timeSec * 0.25;
    const squeeze = Math.sin(squeezeAngle);
    const maxOffset = config.spread * (1.0 + 0.65 * squeeze);

    // Individual strand offset calculation
    const strandAngle = (x / W) * config.strandFreq * Math.PI * 2 + timeSec * 1.1 + s * config.strandOffset;
    const offset = Math.sin(strandAngle) * maxOffset;

    return yBase + offset + pxOffsetY * config.depth;
  }

  function drawRibbon(ctx, W, H, t, pxOffsetX, pxOffsetY, config) {
    const numStrands = config.numStrands;
    const steps = 65; // High resolution steps across viewport
    const segmentWidth = (W + 100) / steps;
    const startX = -50;

    for (let s = 0; s < numStrands; s++) {
      const ratio = s / numStrands;
      const r = Math.round(config.color1.r * (1 - ratio) + config.color2.r * ratio);
      const g = Math.round(config.color1.g * (1 - ratio) + config.color2.g * ratio);
      const b = Math.round(config.color1.b * (1 - ratio) + config.color2.b * ratio);
      
      // Strand alpha breathing animation
      const alpha = config.baseAlpha * (0.65 + 0.35 * Math.sin(s * 0.12 + t * 0.0008)) * (1.0 - Math.abs(ratio - 0.5) * 0.4);

      ctx.save();
      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.lineWidth = config.lineWidth;
      ctx.beginPath();

      const initialX = startX + pxOffsetX * config.depth * 0.5;
      const initialY = getStrandY(initialX - pxOffsetX * config.depth * 0.5, s, W, H, t, pxOffsetY, config);
      ctx.moveTo(initialX, initialY);

      for (let i = 1; i <= steps; i++) {
        const localX = startX + i * segmentWidth;
        const screenX = localX + pxOffsetX * config.depth * 0.5;
        const screenY = getStrandY(localX, s, W, H, t, pxOffsetY, config);
        ctx.lineTo(screenX, screenY);
      }

      ctx.stroke();
      ctx.restore();
    }
  }

  // Animation Loop
  function animate() {
    const W = canvas.width;
    const H = canvas.height;
    const t = performance.now();

    // 1. Base brand navy canvas
    ctx.fillStyle = '#030914';
    ctx.fillRect(0, 0, W, H);

    // 2. Parallax mouse easing
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;
    const pxOffsetX = (mouseX - W * 0.5) / W;
    const pxOffsetY = (mouseY - H * 0.5) / H;

    // 3. Ambient Backlights (Royal Blue and Cyan glowing pools)
    const blueGlow = ctx.createRadialGradient(
      W * 0.3 + pxOffsetX * 20, H * 0.4 + pxOffsetY * 20, 0,
      W * 0.3 + pxOffsetX * 20, H * 0.4 + pxOffsetY * 20, W * 0.45
    );
    blueGlow.addColorStop(0, 'rgba(15, 98, 254, 0.12)');
    blueGlow.addColorStop(0.5, 'rgba(3, 9, 20, 0.01)');
    blueGlow.addColorStop(1, 'rgba(3, 9, 20, 0)');
    ctx.fillStyle = blueGlow;
    ctx.fillRect(0, 0, W, H);

    const cyanGlow = ctx.createRadialGradient(
      W * 0.7 + pxOffsetX * 25, H * 0.5 + pxOffsetY * 25, 0,
      W * 0.7 + pxOffsetX * 25, H * 0.5 + pxOffsetY * 25, W * 0.4
    );
    cyanGlow.addColorStop(0, 'rgba(0, 194, 203, 0.09)');
    cyanGlow.addColorStop(0.5, 'rgba(3, 9, 20, 0.01)');
    cyanGlow.addColorStop(1, 'rgba(3, 9, 20, 0)');
    ctx.fillStyle = cyanGlow;
    ctx.fillRect(0, 0, W, H);

    // 4. Render Generative Silk Ribbons
    ribbons.forEach((ribbon) => {
      drawRibbon(ctx, W, H, t, pxOffsetX, pxOffsetY, ribbon);
    });

    // 5. Vignette Darkening (keeps headlines legible)
    const rCenter = Math.hypot(W * 0.5, H * 0.5);
    const vignette = ctx.createRadialGradient(W * 0.5, H * 0.5, rCenter * 0.2, W * 0.5, H * 0.5, rCenter);
    vignette.addColorStop(0, 'rgba(3, 9, 20, 0)');
    vignette.addColorStop(0.6, 'rgba(3, 9, 20, 0.4)');
    vignette.addColorStop(1, 'rgba(3, 9, 20, 0.95)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);

    // 6. Bottom edge fade
    const bottomFade = ctx.createLinearGradient(0, H * 0.7, 0, H);
    bottomFade.addColorStop(0, 'rgba(3, 9, 20, 0)');
    bottomFade.addColorStop(1, '#030914');
    ctx.fillStyle = bottomFade;
    ctx.fillRect(0, 0, W, H);

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();

  // Cleanup handler
  return () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', resizeCanvas);
    cancelAnimationFrame(animationFrameId);
  };
}

