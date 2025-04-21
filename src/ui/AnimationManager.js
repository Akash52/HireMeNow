/**
 * AnimationManager provides Vite-like animations for the eBook reader
 */
export class AnimationManager {
  constructor() {
    this.intersectionObserver = null;
    this.resizeObserver = null;
    this.spotlightElements = new Set();
  }

  /**
   * Initialize animation effects
   */
  init() {
    this.setupScrollAnimations();
    this.setupSpotlightEffect();
    this.setupTypewriterEffect();
    this.handleFadeInSections();
  }

  /**
   * Setup intersection observer for scroll-based animations
   */
  setupScrollAnimations() {
    // Set up intersection observer for fade-in animations
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('loaded');
              // Unobserve after animation has been triggered
              this.intersectionObserver.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.1,
        }
      );

      // Observe all elements with the vite-section class
      document.querySelectorAll('.vite-section').forEach((element) => {
        this.intersectionObserver.observe(element);
      });
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      document.querySelectorAll('.vite-section').forEach((element) => {
        element.classList.add('loaded');
      });
    }
  }

  /**
   * Apply the spotlight hover effect
   */
  setupSpotlightEffect() {
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    
    spotlightCards.forEach((card) => {
      this.spotlightElements.add(card);
      
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--x', `${x}%`);
        card.style.setProperty('--y', `${y}%`);
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--x', '50%');
        card.style.setProperty('--y', '50%');
      });
    });
  }

  /**
   * Setup typewriter effect for hero elements
   */
  setupTypewriterEffect() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach((element) => {
      // Store original text
      const originalText = element.textContent;
      element.textContent = '';
      
      // Add characters one by one
      let i = 0;
      const typeCharacter = () => {
        if (i < originalText.length) {
          element.textContent += originalText.charAt(i);
          i++;
          setTimeout(typeCharacter, 100);
        }
      };
      
      // Start typing effect
      setTimeout(typeCharacter, 500);
    });
  }

  /**
   * Add staggered fade-in effect to sections
   */
  handleFadeInSections() {
    document.querySelectorAll('.stagger-fade-in').forEach((container) => {
      // Force a reflow to ensure the animation triggers properly
      void container.offsetWidth;
      
      // Add a class to trigger animations
      container.classList.add('animate');
    });
  }

  /**
   * Create a fluid animation for the header background
   * @param {HTMLElement} element - The element to animate
   */
  createFluidBackground(element) {
    if (!element) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Make canvas full size of the element
    const resizeCanvas = () => {
      canvas.width = element.offsetWidth;
      canvas.height = element.offsetHeight;
    };
    
    // Setup canvas
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.4';
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    
    element.appendChild(canvas);
    resizeCanvas();
    
    // Add resize listener
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(resizeCanvas);
      this.resizeObserver.observe(element);
    } else {
      window.addEventListener('resize', resizeCanvas);
    }
    
    // Animation parameters
    const circles = [];
    for (let i = 0; i < 5; i++) {
      circles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 50 + Math.random() * 100,
        color: `rgba(79, 70, 229, ${0.05 + Math.random() * 0.1})`,
        speed: 0.2 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2,
      });
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update circles
      circles.forEach((circle) => {
        // Move in a random direction
        circle.x += Math.cos(circle.angle) * circle.speed;
        circle.y += Math.sin(circle.angle) * circle.speed;
        
        // Bounce off walls
        if (circle.x < 0 || circle.x > canvas.width) {
          circle.angle = Math.PI - circle.angle;
        }
        if (circle.y < 0 || circle.y > canvas.height) {
          circle.angle = -circle.angle;
        }
        
        // Draw circle
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
  }

  /**
   * Add to the observer list for new sections
   * @param {HTMLElement} element - The element to observe
   */
  observeElement(element) {
    if (this.intersectionObserver && element) {
      this.intersectionObserver.observe(element);
    }
  }

  /**
   * Cleanup resources when no longer needed
   */
  cleanup() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    // Remove event listeners from spotlight elements
    this.spotlightElements.forEach((element) => {
      element.removeEventListener('mousemove', null);
      element.removeEventListener('mouseleave', null);
    });
  }
}
