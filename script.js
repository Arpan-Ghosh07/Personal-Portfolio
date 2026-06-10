const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    /* Close nav when a link is clicked on mobile */
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });

    /* ── Light / Dark mode toggle ── */
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon   = document.getElementById('theme-icon');
    const themeLabel  = document.getElementById('theme-label');

    // Load saved preference
    if (localStorage.getItem('theme') === 'light') {
      document.body.classList.add('light');
      themeIcon.textContent  = '☀️';
      themeLabel.textContent = 'Light';
    }

    themeToggle.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light');
      themeIcon.textContent  = isLight ? '☀️' : '🌙';
      themeLabel.textContent = isLight ? 'Light' : 'Dark';
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    /* ── Scroll-triggered fade-in + gauge bar animation ── */
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Animate any skill gauge bars inside this element
          entry.target.querySelectorAll('.skill-fill').forEach(bar => {
            const pct = bar.getAttribute('data-pct');
            if (pct) {
              // Small delay so the card fade-in completes first
              setTimeout(() => { bar.style.width = pct + '%'; }, 200);
            }
          });

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    /* ── Active nav link highlight on scroll ── */
    const sections = document.querySelectorAll('section[id]');
    const navAs    = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
      });
      navAs.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${current}`
          ? 'var(--neon)'
          : '';
      });
    });

    /* ── Contact form handler ── */
    document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const status = document.getElementById('form-status');
  const btn = this.querySelector('button[type="submit"]');

  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const response = await fetch(this.action, {
      method: 'POST',
      body: new FormData(this),
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      status.textContent = "✓ Message sent! I'll get back to you soon.";
      this.reset();
    } else {
      status.textContent = "✗ Failed to send message.";
    }
  } catch (error) {
    status.textContent = "✗ Network error. Please try again.";
  }

  btn.textContent = 'Send Message →';
  btn.disabled = false;

  setTimeout(() => {
    status.textContent = '';
  }, 5000);
});