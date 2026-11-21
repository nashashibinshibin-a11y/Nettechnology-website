/**
 * Hero Section — Scroll-Driven Cinematic Image-Sequence Experience
 * 
 * Uses GSAP ScrollTrigger to pin the hero section and drive a 192-frame
 * image sequence based on scroll position. Overlay content cards fade in/out
 * at specific scroll milestones to describe technology environments.
 * 
 * Features:
 * - Scroll-driven: user controls animation progress via scrolling
 * - GSAP ScrollTrigger pin: hero stays fixed during the entire sequence
 * - Canvas rendering with cover-fit and Retina support
 * - Progressive frame loading with loading indicator
 * - Overlay content cards appear/disappear at mapped scroll positions
 * - Unpins after full sequence completes, revealing Services section
 * - Mobile: uses every 2nd frame to reduce data
 */

(function () {
  'use strict';

  // ─── Configuration ───────────────────────────────────────────
  const CONFIG = {
    framePath: 'images/imagez/hero section/frame_',
    frameExtension: '.jpg',
    totalFrames: 192,
    progressiveThreshold: 40,
    mobileBreakpoint: 768,
    canvasId: 'hero-sequence-canvas',
    loadingId: 'hero-sequence-loader',
    heroId: 'hero-cinematic',
    // Scroll distance multiplier (how many viewport-heights the pin lasts)
    // Higher = more scroll distance for the animation
    scrollMultiplier: 6
  };

  // ─── Overlay Card Definitions ────────────────────────────────
  // Each card maps to a progress range [start, end] from 0–1
  // Progress 0 = frame_001 (exterior), Progress 1 = frame_192 (deep interior)
  const OVERLAY_CARDS = [
    {
      id: 'card-workplace',
      progress: [0.16, 0.34],
      icon: 'monitor',
      label: 'Modern Workplace',
      title: 'Connected Work Environments',
      desc: 'Smart office spaces designed for productivity, collaboration, and seamless connectivity.'
    },
    {
      id: 'card-collaboration',
      progress: [0.38, 0.56],
      icon: 'users',
      label: 'Collaboration',
      title: 'Collaboration Environments',
      desc: 'Hybrid meeting rooms and boardrooms equipped with enterprise AV and video conferencing.'
    },
    {
      id: 'card-systems',
      progress: [0.60, 0.78],
      icon: 'layers',
      label: 'AV & ELV Systems',
      title: 'Integrated Infrastructure Control',
      desc: 'Digital signage, building management, lighting control, and smart security systems.'
    },
    {
      id: 'card-connected',
      progress: [0.82, 0.98],
      icon: 'cpu',
      label: 'Connected Intelligence',
      title: 'Connected Intelligent Environment',
      desc: 'Where every system converges into a unified, intelligent infrastructure.'
    }
  ];

  // ─── State ───────────────────────────────────────────────────
  let frames = [];
  let loadedCount = 0;
  let currentFrameIndex = -1;
  let canvas, ctx;
  let isMobile = false;
  let effectiveTotalFrames = CONFIG.totalFrames;
  let frameStep = 1;
  let scrollTriggerInstance = null;
  let framesReady = false;
  let playhead = { frame: 0 };

  // ─── Frame Index Helpers ─────────────────────────────────────
  function padNumber(num, size) {
    let s = String(num);
    while (s.length < size) s = '0' + s;
    return s;
  }

  function getFramePath(index) {
    const fileIndex = (index * frameStep) + 1;
    return CONFIG.framePath + padNumber(fileIndex, 3) + CONFIG.frameExtension;
  }

  // ─── Canvas Resize ───────────────────────────────────────────
  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    canvas.displayWidth = rect.width;
    canvas.displayHeight = rect.height;

    // Force redraw at new size
    if (currentFrameIndex >= 0) {
      const saved = currentFrameIndex;
      currentFrameIndex = -1;
      drawFrame(saved);
    }
  }

  let resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      // Refresh ScrollTrigger after resize
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 150);
  }

  // ─── Canvas Drawing ──────────────────────────────────────────
  function drawFrame(frameIndex) {
    if (frameIndex === currentFrameIndex) return;
    if (frameIndex < 0 || frameIndex >= frames.length) return;

    const img = frames[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    currentFrameIndex = frameIndex;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.displayWidth || (canvas.width / dpr);
    const H = canvas.displayHeight || (canvas.height / dpr);

    ctx.clearRect(0, 0, W, H);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = W / H;

    let drawW, drawH, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawW = W;
      drawH = W / imgRatio;
      drawX = 0;
      drawY = (H - drawH) / 2;
    } else {
      drawH = H;
      drawW = H * imgRatio;
      drawX = (W - drawW) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  // Helper to calculate custom direction transforms for each quadrant card
  function getCardTransform(id, t, phase) {
    const isMobileDevice = window.innerWidth <= CONFIG.mobileBreakpoint;
    if (isMobileDevice) {
      const translateY = 20 * (1 - t);
      return `translateX(-50%) translateY(${translateY}px)`;
    }

    let dx = 0;
    let dy = 0;

    if (phase === 'in') {
      if (id === 'card-workplace') dx = -20 * (1 - t); // slide in from left
      if (id === 'card-collaboration') dx = 20 * (1 - t); // slide in from right
      if (id === 'card-systems') dx = 20 * (1 - t); // slide in from right
      if (id === 'card-connected') dy = 20 * (1 - t); // slide in from bottom
    } else if (phase === 'out') {
      if (id === 'card-workplace') dy = -15 * (1 - t); // slide up to exit
      if (id === 'card-collaboration') dy = -15 * (1 - t);
      if (id === 'card-systems') dy = -15 * (1 - t);
      if (id === 'card-connected') dy = -15 * (1 - t);
    } else if (phase === 'none') {
      if (t === 0) {
        if (id === 'card-workplace') dx = -20;
        if (id === 'card-collaboration') dx = 20;
        if (id === 'card-systems') dx = 20;
        if (id === 'card-connected') dy = 20;
      }
    }

    return `translate(${dx}px, ${dy}px)`;
  }

  // ─── Overlay Card Visibility ─────────────────────────────────
  function updateOverlayCards(progress) {
    OVERLAY_CARDS.forEach(card => {
      const el = document.getElementById(card.id);
      if (!el) return;

      const [start, end] = card.progress;
      // Fade margins: 4% of total progress for smooth fade in/out
      const fadeIn = 0.04;
      const fadeOut = 0.04;

      let opacity = 0;
      let transform = '';

      if (progress >= start && progress <= end) {
        // Calculate fade-in
        if (progress < start + fadeIn) {
          const t = (progress - start) / fadeIn;
          opacity = t;
          transform = getCardTransform(card.id, t, 'in');
        }
        // Full visibility
        else if (progress <= end - fadeOut) {
          opacity = 1;
          transform = getCardTransform(card.id, 1, 'none');
        }
        // Calculate fade-out
        else {
          const t = (end - progress) / fadeOut;
          opacity = t;
          transform = getCardTransform(card.id, t, 'out');
        }
      } else {
        opacity = 0;
        transform = getCardTransform(card.id, 0, 'none');
      }

      el.style.opacity = opacity;
      el.style.transform = transform;
    });
  }

  // Also handle the initial hero headline content
  function updateHeroContent(progress) {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    // Hero headline fades out as scroll begins (0% to 12%)
    if (progress <= 0.02) {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    } else if (progress < 0.12) {
      const t = (progress - 0.02) / 0.10;
      heroContent.style.opacity = String(1 - t);
      heroContent.style.transform = `translateY(${-30 * t}px)`;
    } else {
      heroContent.style.opacity = '0';
      heroContent.style.transform = 'translateY(-30px)';
    }

    // Hide scroll indicator immediately
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.style.opacity = progress > 0.03 ? '0' : '';
    }
  }

  // Helper to redraw the frame currently active on the playhead (used during background loads)
  function redrawCurrentFrame() {
    if (!framesReady) return;
    const targetFrame = Math.min(
      Math.floor(playhead.frame),
      frames.length - 1
    );
    drawFrame(targetFrame);
  }

  // ─── GSAP ScrollTrigger Setup ────────────────────────────────
  function setupScrollTrigger() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP/ScrollTrigger not available for hero scroll sequence.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const heroSection = document.getElementById(CONFIG.heroId);
    if (!heroSection) return;

    // Ensure canvas dimensions are fully sized to parent container before pinning
    resizeCanvas();

    // Smoothly scrub playhead.frame from 0 to total frames using a GSAP tween
    scrollTriggerInstance = gsap.to(playhead, {
      frame: frames.length - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: () => '+=' + (window.innerHeight * CONFIG.scrollMultiplier),
        pin: true,
        pinSpacing: true,
        scrub: 0.6, // Butter-smooth tracking with inertia
        invalidateOnRefresh: true
      },
      onUpdate: () => {
        if (!framesReady) return;

        const targetFrame = Math.min(
          Math.floor(playhead.frame),
          frames.length - 1
        );

        const progress = playhead.frame / (frames.length - 1);

        drawFrame(targetFrame);
        updateOverlayCards(progress);
        updateHeroContent(progress);
      }
    });
  }

  // ─── Loading ─────────────────────────────────────────────────
  function showLoader() {
    const loader = document.getElementById(CONFIG.loadingId);
    if (loader) loader.style.opacity = '1';
  }

  function hideLoader() {
    const loader = document.getElementById(CONFIG.loadingId);
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 400);
    }
  }

  function updateLoaderProgress() {
    const loader = document.getElementById(CONFIG.loadingId);
    if (!loader) return;
    const progressBar = loader.querySelector('.hero-loader-bar-fill');
    if (progressBar) {
      const pct = Math.round((loadedCount / effectiveTotalFrames) * 100);
      progressBar.style.width = pct + '%';
    }
  }

  function loadFrames() {
    isMobile = window.innerWidth <= CONFIG.mobileBreakpoint;
    frameStep = isMobile ? 2 : 1;
    effectiveTotalFrames = Math.ceil(CONFIG.totalFrames / frameStep);

    frames = new Array(effectiveTotalFrames);
    loadedCount = 0;
    let thresholdReached = false;

    for (let i = 0; i < effectiveTotalFrames; i++) {
      const img = new Image();
      img.decoding = 'async';

      img.onload = function () {
        loadedCount++;
        updateLoaderProgress();

        if (!thresholdReached && loadedCount >= Math.min(CONFIG.progressiveThreshold, effectiveTotalFrames)) {
          thresholdReached = true;
          framesReady = true;
          hideLoader();

          // Setup GSAP scroll-driven animation
          setupScrollTrigger();

          // Draw first frame (exterior building) or redraw
          redrawCurrentFrame();
        } else if (framesReady) {
          // If the page is active and another frame loads in the background, redraw to prevent frame freeze
          redrawCurrentFrame();
        }
      };

      img.onerror = function () {
        loadedCount++;
        updateLoaderProgress();
      };

      img.src = getFramePath(i);
      frames[i] = img;
    }
  }

  // ─── Initialization ──────────────────────────────────────────
  function init() {
    canvas = document.getElementById(CONFIG.canvasId);
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initial sizing
    resizeCanvas();

    // Dark background initially
    const W = canvas.displayWidth || canvas.width;
    const H = canvas.displayHeight || canvas.height;
    ctx.fillStyle = '#030305';
    ctx.fillRect(0, 0, W, H);

    // Resize listener
    window.addEventListener('resize', onResize);

    // Show loader and begin loading
    showLoader();
    loadFrames();
  }

  // ─── Boot ────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
