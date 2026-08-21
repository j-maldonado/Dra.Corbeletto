(() => {
  "use strict";

  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector("[data-menu-button]");
  const menuLabel = document.querySelector("[data-menu-label]");
  const navigation = document.querySelector("[data-navigation]");

  const setMenu = (open) => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", String(open));
    navigation.classList.toggle("is-open", open);
    header?.classList.toggle("menu-visible", open);
    document.body.classList.toggle("menu-open", open);
    if (menuLabel) menuLabel.textContent = open ? "Cerrar" : "Menú";
  };

  menuButton?.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });

  navigation?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      document.documentElement.classList.add("is-anchor-jump");
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
      window.history.pushState(null, "", hash);
      window.setTimeout(() => {
        document.documentElement.classList.remove("is-anchor-jump");
      }, 900);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const revealItems = document.querySelectorAll("[data-reveal]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const testimonials = document.querySelector("[data-testimonials]");
  const previousTestimonial = document.querySelector("[data-testimonial-prev]");
  const nextTestimonial = document.querySelector("[data-testimonial-next]");

  const moveTestimonials = (direction) => {
    if (!testimonials) return;
    const card = testimonials.querySelector(".testimonial-card");
    const gap = Number.parseFloat(getComputedStyle(testimonials).columnGap) || 20;
    const distance = (card?.getBoundingClientRect().width || testimonials.clientWidth) + gap;
    testimonials.scrollBy({ left: distance * direction, behavior: "smooth" });
  };

  let testimonialTimer = null;

  const stopTestimonialAutoplay = () => {
    if (!testimonialTimer) return;
    window.clearInterval(testimonialTimer);
    testimonialTimer = null;
  };

  const advanceTestimonials = () => {
    if (!testimonials) return;
    const reachedEnd =
      testimonials.scrollLeft + testimonials.clientWidth >=
      testimonials.scrollWidth - 8;

    if (reachedEnd) {
      testimonials.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    moveTestimonials(1);
  };

  const startTestimonialAutoplay = () => {
    if (reducedMotion || !testimonials || document.hidden) return;
    stopTestimonialAutoplay();
    testimonialTimer = window.setInterval(advanceTestimonials, 5600);
  };

  const restartTestimonialAutoplay = () => {
    stopTestimonialAutoplay();
    startTestimonialAutoplay();
  };

  previousTestimonial?.addEventListener("click", () => {
    moveTestimonials(-1);
    restartTestimonialAutoplay();
  });
  nextTestimonial?.addEventListener("click", () => {
    moveTestimonials(1);
    restartTestimonialAutoplay();
  });

  ["pointerenter", "focusin", "touchstart"].forEach((eventName) => {
    testimonials?.addEventListener(eventName, stopTestimonialAutoplay, {
      passive: eventName !== "focusin",
    });
  });
  ["pointerleave", "focusout", "touchend"].forEach((eventName) => {
    testimonials?.addEventListener(eventName, startTestimonialAutoplay, {
      passive: eventName !== "focusout",
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopTestimonialAutoplay();
    else startTestimonialAutoplay();
  });

  startTestimonialAutoplay();

  const socialPosts = document.querySelector(".social-posts");
  const socialMobileQuery = window.matchMedia("(max-width: 820px)");
  let socialTimer = null;

  const stopSocialAutoplay = () => {
    if (!socialTimer) return;
    window.clearInterval(socialTimer);
    socialTimer = null;
  };

  const advanceSocialPosts = () => {
    if (!socialPosts || !socialMobileQuery.matches) return;
    const card = socialPosts.querySelector(".social-post");
    const gap = Number.parseFloat(getComputedStyle(socialPosts).columnGap) || 12;
    const distance = (card?.getBoundingClientRect().width || socialPosts.clientWidth) + gap;
    const reachedEnd =
      socialPosts.scrollLeft + socialPosts.clientWidth >= socialPosts.scrollWidth - 8;

    socialPosts.scrollTo({
      left: reachedEnd ? 0 : socialPosts.scrollLeft + distance,
      behavior: "smooth",
    });
  };

  const startSocialAutoplay = () => {
    if (
      reducedMotion ||
      !socialPosts ||
      !socialMobileQuery.matches ||
      document.hidden
    ) {
      return;
    }
    stopSocialAutoplay();
    socialTimer = window.setInterval(advanceSocialPosts, 6200);
  };

  ["pointerdown", "focusin", "touchstart"].forEach((eventName) => {
    socialPosts?.addEventListener(eventName, stopSocialAutoplay, {
      passive: eventName !== "focusin",
    });
  });
  ["pointerup", "focusout", "touchend"].forEach((eventName) => {
    socialPosts?.addEventListener(eventName, startSocialAutoplay, {
      passive: eventName !== "focusout",
    });
  });
  socialMobileQuery.addEventListener?.("change", () => {
    stopSocialAutoplay();
    startSocialAutoplay();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopSocialAutoplay();
    else startSocialAutoplay();
  });
  startSocialAutoplay();

  const parallaxItems = Array.from(document.querySelectorAll("[data-parallax]"));
  const parallaxQuery = window.matchMedia("(min-width: 768px)");
  let parallaxFrame = 0;

  const updateParallax = () => {
    parallaxFrame = 0;
    const enabled = !reducedMotion && parallaxQuery.matches;

    parallaxItems.forEach((item) => {
      if (!enabled) {
        item.style.setProperty("--parallax-y", "0px");
        return;
      }

      const rect = item.getBoundingClientRect();
      const strength = Number.parseFloat(item.dataset.parallax || "0.03");
      const maximum = Number.parseFloat(item.dataset.parallaxMax || "24");
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const offset = Math.max(
        -maximum,
        Math.min(maximum, (viewportCenter - elementCenter) * strength),
      );
      item.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
    });
  };

  const requestParallaxUpdate = () => {
    if (parallaxFrame) return;
    parallaxFrame = window.requestAnimationFrame(updateParallax);
  };

  if (parallaxItems.length) {
    updateParallax();
    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", requestParallaxUpdate, { passive: true });
    parallaxQuery.addEventListener?.("change", requestParallaxUpdate);
  }
})();
