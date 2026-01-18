document.addEventListener("DOMContentLoaded", () => {
  // --- Custom Cursor ---
  const cursor = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Smooth follow for outline
  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Expand cursor on clickable elements
  const clickables = document.querySelectorAll("a, button");
  clickables.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.width = "20px";
      cursor.style.height = "20px";
      cursorOutline.style.width = "60px";
      cursorOutline.style.height = "60px";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.width = "8px";
      cursor.style.height = "8px";
      cursorOutline.style.width = "40px";
      cursorOutline.style.height = "40px";
    });
  });

  // --- Particle Canvas Animation ---
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 50;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 214, 10, ${this.opacity})`;
      ctx.fill();

      // Draw glow
      const gradient = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.radius * 3
      );
      gradient.addColorStop(0, `rgba(255, 214, 10, ${this.opacity * 0.3})`);
      gradient.addColorStop(1, "rgba(255, 214, 10, 0)");
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, i) => {
      particle.update();
      particle.draw();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[j].x - particle.x;
        const dy = particles[j].y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 214, 10, ${0.2 * (1 - distance / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // --- OS Detection for Download Buttons ---
  const userAgent = window.navigator.userAgent.toLowerCase();
  const windowsButton = document.getElementById("download-windows");
  const macosButton = document.getElementById("download-macos");
  const macosSiliconButton = document.getElementById("download-macos-silicon");

  // Download URLs from Google Drive
  const downloadLinks = {
    windows: "https://drive.google.com/file/d/1acr3ozBq2ZYpG4PSaeFpX3VsZvWu5HLm/view?usp=sharing",
    macos: "https://drive.google.com/file/d/1QnER_9NROoIXcteSOpc0PctABZ0776_h/view?usp=sharing",
    macosSilicon: "https://drive.google.com/file/d/1fGLXjGd-PBgBb3-WVYdF7al4h7pIxjRc/view?usp=sharing"
  };

  if (windowsButton) windowsButton.href = downloadLinks.windows;
  if (macosButton) macosButton.href = downloadLinks.macos;
  if (macosSiliconButton) macosSiliconButton.href = downloadLinks.macosSilicon;

  if (userAgent.includes("win")) {
    windowsButton?.classList.add("recommended");
  } else if (userAgent.includes("mac")) {
    // Detect Apple Silicon vs Intel
    const isAppleSilicon = /Mac OS.*ARM|Apple.*Silicon/i.test(userAgent);
    if (isAppleSilicon) {
      macosSiliconButton?.classList.add("recommended");
    } else {
      macosButton?.classList.add("recommended");
    }
  }

  // --- Banana Rain Animation ---
  const bananaContainer = document.querySelector(".banana-rain");
  if (bananaContainer) {
    const bananas = bananaContainer.querySelectorAll(".banana");
    bananas.forEach((banana) => {
      banana.style.left = `${Math.random() * 100}vw`;
      banana.style.animationDuration = `${Math.random() * 5 + 5}s`; // 5s to 10s duration
      banana.style.animationDelay = `${Math.random() * 5}s`;
    });
  }

  // --- Screenshot Carousel ---
  const gallery = document.querySelector(".screenshot-gallery");
  if (gallery) {
    const screenshots = gallery.querySelectorAll(".screenshot-image");
    const prevButton = gallery.querySelector(".carousel-prev");
    const nextButton = gallery.querySelector(".carousel-next");
    let currentIndex = 0;

    const showScreenshot = (index) => {
      screenshots.forEach((img, i) => {
        img.classList.toggle("active", i === index);
      });
      if (prevButton) prevButton.disabled = index === 0;
      if (nextButton) nextButton.disabled = index === screenshots.length - 1;
    };

    prevButton?.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        if (showScreenshot) showScreenshot(currentIndex);
      }
    });

    nextButton?.addEventListener("click", () => {
      if (currentIndex < screenshots.length - 1) {
        currentIndex++;
        if (showScreenshot) showScreenshot(currentIndex);
      }
    });

    // Initialize
    showScreenshot(currentIndex);
  }

  // --- Personality Card Hover Effect ---
  const personalityCards = document.querySelectorAll(".personality-card");
  personalityCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = (y / rect.height - 0.5) * -20; // Max 10deg rotation
      const rotateY = (x / rect.width - 0.5) * 20; // Max 10deg rotation

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
    });
  });

  // --- Scroll-based Animations ---
  let animatedElements = document.querySelectorAll(".scroll-animate");

  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Optional: Stop observing the element after it has become visible
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 0.1 // Trigger when 10% of the element is visible
      }
    );

    animatedElements.forEach((el) => {
      // Stagger the animations for a nicer effect
      const delay = el.dataset.delay || 0;
      el.style.transitionDelay = `${delay}ms`;
      observer.observe(el);
    });
  }

  // --- Dynamic Background on Scroll ---
  const sections = {
    "hero-section": "bg-hero",
    "features-section": "bg-features",
    "personalities-section": "bg-personalities",
    "screenshots-section": "bg-screenshots"
  };

  const backgroundObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const newClass = sections[sectionId];
          if (newClass) {
            document.body.className = document.body.className.replace(/bg-\w+/g, "");
            document.body.classList.add(newClass);
          }
        }
      });
    },
    { threshold: 0.2, rootMargin: "-40% 0px -40% 0px" }
  );

  document.querySelectorAll("section[id]").forEach((section) => {
    backgroundObserver.observe(section);
  });

  // --- Floating Elements Animation ---
  const floatingElements = document.querySelectorAll(".float-item");
  floatingElements.forEach((element) => {
    // Random starting position
    element.style.left = `${Math.random() * 100}vw`;
    element.style.top = `${Math.random() * 100}vh`;

    // Random animation duration (10s to 20s)
    const duration = Math.random() * 10 + 10;
    element.style.animationDuration = `${duration}s`;

    // Random delay
    element.style.animationDelay = `${Math.random() * 5}s`;

    // Add parallax effect on mouse move
    document.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      element.style.transform = `translate(${x}px, ${y}px) rotate(${Math.sin(Date.now() / 1000) * 15}deg)`;
    });
  });

  // --- 3D Banana Hover Effect ---
  const heroBanana = document.querySelector(".hero-image img");
  if (heroBanana) {
    heroBanana.addEventListener("mousemove", (e) => {
      const rect = heroBanana.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = (y / rect.height - 0.5) * -30;
      const rotateY = (x / rect.width - 0.5) * 30;

      heroBanana.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
    });

    heroBanana.addEventListener("mouseleave", () => {
      heroBanana.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
    });
  }
});