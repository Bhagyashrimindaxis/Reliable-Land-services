/**
 * RELIABLE LAND SURVEY CONSULTANCY - MAIN JAVASCRIPT
 * Professional Surveying • Geospatial • LiDAR • Drone Mapping • Infrastructure
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Header scroll effect
  const siteHeader = document.querySelector('.site-header');
  const scrollToTopBtn = document.querySelector('.scroll-to-top');

  const handleScroll = () => {
    const scrollPos = window.scrollY || window.pageYOffset;
    
    if (siteHeader) {
      if (scrollPos > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    if (scrollToTopBtn) {
      if (scrollPos > 400) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Scroll to top click
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 2. Active nav link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  const highlightNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // 3. Close mobile navbar on link click
  const navCollapse = document.querySelector('.navbar-collapse');
  if (navCollapse) {
    const allNavLinks = document.querySelectorAll('.nav-link[href^="#"], .dropdown-item[href^="#"]');
    allNavLinks.forEach(link => {
      if (!link.classList.contains('dropdown-toggle')) {
        link.addEventListener('click', () => {
          if (navCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
            if (bsCollapse) {
              bsCollapse.hide();
            }
          }
        });
      }
    });
  }

  // 4. Hero Animated Topographic Contour Canvas
  const canvas = document.getElementById('heroContourCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let time = 0;

    const resizeCanvas = () => {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Generate topographic elevation curves
    const drawContours = () => {
      ctx.clearRect(0, 0, width, height);

      const numLines = 14;
      const stepY = height / (numLines + 2);

      for (let i = 1; i <= numLines; i++) {
        ctx.beginPath();
        const baseElevation = i * stepY;
        
        ctx.moveTo(0, baseElevation);

        for (let x = 0; x <= width; x += 25) {
          const angle1 = (x * 0.003) + (time * 0.0008) + (i * 0.35);
          const angle2 = (x * 0.007) - (time * 0.001) + (i * 0.2);
          const yOffset = Math.sin(angle1) * 35 + Math.cos(angle2) * 20;
          ctx.lineTo(x, baseElevation + yOffset);
        }

        // Distinct colors for index contours vs regular contours
        if (i % 4 === 0) {
          ctx.strokeStyle = 'rgba(0, 163, 255, 0.45)';
          ctx.lineWidth = 1.5;
        } else {
          ctx.strokeStyle = 'rgba(0, 163, 255, 0.15)';
          ctx.lineWidth = 0.8;
        }

        ctx.stroke();
      }

      time += 1;
      requestAnimationFrame(drawContours);
    };

    drawContours();
  }

  // 5. Stat Counter Animations (using Intersection Observer)
  const counterElements = document.querySelectorAll('.stat-number[data-count]');
  let counted = false;

  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1800; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + (el.getAttribute('data-suffix') || '');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + (el.getAttribute('data-suffix') || '');
      }
    }, stepTime);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        counterElements.forEach(el => countUp(el));
      }
    });
  }, { threshold: 0.25 });

  const statsSection = document.querySelector('.stats-bar-section');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // 6. Infrastructure Project Sector Interactive Switcher
  const infraButtons = document.querySelectorAll('.infra-tab-btn');
  const infraPanels = document.querySelectorAll('.infra-content-panel');

  infraButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      infraButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      infraPanels.forEach(panel => {
        if (panel.id === targetId) {
          panel.style.display = 'block';
          panel.style.opacity = '0';
          setTimeout(() => {
            panel.style.transition = 'opacity 0.35s ease';
            panel.style.opacity = '1';
          }, 10);
        } else {
          panel.style.display = 'none';
        }
      });
    });
  });

  // 7. Survey Services Category Filter
  const filterBtns = document.querySelectorAll('.service-filter-btn');
  const serviceCards = document.querySelectorAll('.service-card-col');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        serviceCards.forEach(col => {
          if (filterValue === 'all' || col.getAttribute('data-category').includes(filterValue)) {
            col.style.display = 'block';
            col.style.animation = 'fadeInUp 0.4s ease forwards';
          } else {
            col.style.display = 'none';
          }
        });
      });
    });
  }

  // 8. Contact / Consultation Form Handling (Client side simulation)
  const contactForm = document.getElementById('consultancyInquiryForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Submitting Inquiry...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        
        if (formSuccessAlert) {
          formSuccessAlert.classList.remove('d-none');
          setTimeout(() => {
            formSuccessAlert.classList.add('d-none');
          }, 6000);
        }
      }, 1000);
    });
  }

  // 9. Intersection Observer for Scroll Fade-In
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // 10. Methodology Alternating Timeline Scroll Animation & Line Fill
  const methodologySection = document.getElementById('methodology');
  const timelineItems = document.querySelectorAll('.timeline-v-item');
  const timelineProgressBar = document.querySelector('.timeline-v-progress');
  const timelineTree = document.querySelector('.timeline-v-tree');

  if (methodologySection && timelineItems.length > 0) {
    const handleTimelineScroll = () => {
      const windowHeight = window.innerHeight;

      // Reveal each step one by one when scrolled into view
      timelineItems.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top < windowHeight * 0.82) {
          item.classList.add('is-visible');
        }
      });

      // Calculate progress percentage for glowing vertical line
      if (timelineProgressBar && timelineTree) {
        const treeRect = timelineTree.getBoundingClientRect();
        const treeHeight = treeRect.height;
        const triggerPoint = windowHeight * 0.70;
        const currentProgress = triggerPoint - treeRect.top;
        const progressPercent = Math.min(100, Math.max(0, (currentProgress / treeHeight) * 100));
        timelineProgressBar.style.height = `${progressPercent}%`;
      }
    };

    window.addEventListener('scroll', handleTimelineScroll, { passive: true });
    // Check initially on load
    setTimeout(handleTimelineScroll, 200);
  }
});

