document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle Menu
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const body = document.body;

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      
      // Transform hamburger to X
      const lines = navToggle.querySelectorAll('.hamburger-line');
      if (navMenu.classList.contains('active')) {
        lines[0].style.transform = 'translateY(7px) rotate(45deg)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
      }
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const lines = navToggle.querySelectorAll('.hamburger-line');
        lines[0].style.transform = 'none';
        lines[1].style.opacity = '1';
        lines[2].style.transform = 'none';
      });
    });
  }

  // Header scroll indicator / class transform
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Highlight active link based on current page filename
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Dynamic Date in Footer
  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // Contact Form Mock Submission Handlers
  const contactForm = document.getElementById('abc-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      // Animate to submitting state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Sending... <span class="spinner" style="display:inline-block; width:12px; height:12px; border:2px solid var(--bg-dark); border-top-color:transparent; border-radius:50%; animation:spin 1s linear infinite;"></span>`;
      
      // Add custom spin animation keyframe programmatically if not defined
      if (!document.getElementById('spin-keyframes')) {
        const style = document.createElement('style');
        style.id = 'spin-keyframes';
        style.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
      }
      
      // Simulate API call
      setTimeout(() => {
        submitBtn.innerHTML = `Message Sent Successfully! ✓`;
        submitBtn.style.background = 'linear-gradient(135deg, #27c93f 0%, #17a02c 100%)';
        submitBtn.style.color = '#fff';
        
        // Reset form
        contactForm.reset();
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
        }, 3500);
      }, 1500);
    });
  }

  // Smooth scroll helper for explore button
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const targetSection = document.querySelector('.section');
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  }
});
