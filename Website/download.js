document.addEventListener("DOMContentLoaded", () => {
  // --- OS Detection for Download Buttons ---
  const userAgent = window.navigator.userAgent.toLowerCase();
  const windowsButton = document.getElementById("download-windows");
  const macosButton = document.getElementById("download-macos");
  const linuxButton = document.getElementById("download-linux");

  // Placeholder URLs - replace with your actual release URLs
  const downloadLinks = {
    windows: "https://example.com/banana4u-setup.exe",
    macos: "https://example.com/banana4u.dmg",
    linux: "https://example.com/banana4u.AppImage",
  };

  if (windowsButton) windowsButton.href = downloadLinks.windows;
  if (macosButton) macosButton.href = downloadLinks.macos;
  if (linuxButton) linuxButton.href = downloadLinks.linux;

  if (userAgent.includes("win")) {
    windowsButton?.classList.add("recommended");
  } else if (userAgent.includes("mac")) {
    macosButton?.classList.add("recommended");
  } else if (userAgent.includes("linux")) {
    linuxButton?.classList.add("recommended");
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
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
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
        threshold: 0.1, // Trigger when 10% of the element is visible
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
    "screenshots-section": "bg-screenshots",
  };

  const backgroundObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const newClass = sections[sectionId];
          if (newClass) {
            document.body.className = document.body.className.replace(/bg-\w+/g, '');
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
});
