document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');
  const sections = document.querySelectorAll('.services-category-section');

  function switchTab(tabId) {
    if (!tabId) return;

    // Remove active state from all buttons and sections
    tabs.forEach(t => t.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));

    // Find tab button with data-tab matching tabId
    const activeTab = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    const activeSection = document.getElementById(`services-${tabId}`);

    if (activeTab && activeSection) {
      activeTab.classList.add('active');
      activeSection.classList.add('active');
      
      // Trigger GSAP or scroll trigger refresh so the triggers align!
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
      
      // Animate active category contents
      if (typeof gsap !== 'undefined') {
        const cardsToAnimate = activeSection.querySelectorAll('.reveal-card, .av-solution-item, .ict-solution-row');
        gsap.fromTo(cardsToAnimate, 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out', overwrite: 'auto' }
        );
      }
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');
      switchTab(tabId);
      
      // Update URL parameters without trigger page reload
      const url = new URL(window.location);
      url.searchParams.set('tab', tabId);
      window.history.pushState({}, '', url);
    });
  });

  // Check URL query parameters on load
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab');
  
  if (initialTab && ['av', 'elv', 'ict', 'automation', 'security', 'specialized'].includes(initialTab)) {
    switchTab(initialTab);
  } else {
    switchTab('av'); // Default to AV solutions
  }
});
