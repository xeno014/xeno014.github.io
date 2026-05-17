/**
 * Portfolio — shared JavaScript
 * Handles: mobile nav, smooth scroll, scroll reveal,
 * sticky nav state, active links, back-to-top button, footer year
 */

(function () {
  "use strict";

  var SCROLL_TOP_THRESHOLD = 300;
  var NAVBAR = document.getElementById("navbar");
  var NAV_TOGGLE = document.getElementById("nav-toggle");
  var NAV_MENU = document.getElementById("nav-menu");
  var TOP_BTN = document.getElementById("top-btn");
  var YEAR_EL = document.getElementById("year");
  var IS_HOME = document.body.getAttribute("data-page") === "home";

  /* ========== Footer year ========== */
  if (YEAR_EL) {
    YEAR_EL.textContent = String(new Date().getFullYear());
  }

  /* ========== Mobile hamburger menu ========== */
  if (NAV_TOGGLE && NAV_MENU) {
    NAV_TOGGLE.addEventListener("click", function () {
      var isOpen = NAV_MENU.classList.toggle("is-open");
      NAV_TOGGLE.setAttribute("aria-expanded", String(isOpen));
      NAV_TOGGLE.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    /* Close menu when a link is clicked */
    NAV_MENU.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        NAV_MENU.classList.remove("is-open");
        NAV_TOGGLE.setAttribute("aria-expanded", "false");
        NAV_TOGGLE.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* ========== Smooth scroll for same-page anchor links ========== */
  function getCurrentPage() {
    var parts = window.location.pathname.split("/").filter(Boolean);
    var last = parts[parts.length - 1];
    if (!last || !/\.html$/i.test(last)) return "index.html";
    return last;
  }

  function normalizePage(path) {
    if (!path || path === "./") return "index.html";
    return path.replace(/^\.\//, "");
  }

  document.querySelectorAll('a[href*="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var href = link.getAttribute("href");
      if (!href || href === "#") return;

      var hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      var linkPage = normalizePage(href.slice(0, hashIndex));
      var hash = href.slice(hashIndex);
      var currentPage = getCurrentPage();

      /* Only smooth-scroll when the hash target is on this page */
      if (linkPage !== currentPage) return;

      var target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      if (history.replaceState) {
        history.replaceState(null, "", hash);
      }
    });
  });

  /* ========== Scroll reveal (Intersection Observer) ========== */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ========== Sticky navbar shadow + back-to-top visibility ========== */
  function onScroll() {
    var scrollY = window.scrollY || window.pageYOffset;

    if (NAVBAR) {
      NAVBAR.classList.toggle("navbar--scrolled", scrollY > 20);
    }

    if (TOP_BTN) {
      if (scrollY > SCROLL_TOP_THRESHOLD) {
        TOP_BTN.removeAttribute("hidden");
        TOP_BTN.classList.add("is-visible");
      } else {
        TOP_BTN.classList.remove("is-visible");
        /* Delay hiding attribute until fade-out completes */
        window.setTimeout(function () {
          if (!TOP_BTN.classList.contains("is-visible")) {
            TOP_BTN.setAttribute("hidden", "");
          }
        }, 350);
      }
    }

    if (IS_HOME) {
      updateActiveNavLink();
    }
  }

  /* ========== Active nav link on homepage (scroll spy) ========== */
  function updateActiveNavLink() {
    var sections = ["home", "projects", "skills", "contact"];
    var scrollPos = (window.scrollY || window.pageYOffset) + 120;
    var current = "home";

    sections.forEach(function (id) {
      var section = document.getElementById(id);
      if (section && section.offsetTop <= scrollPos) {
        current = id;
      }
    });

    document.querySelectorAll(".nav-link[data-section]").forEach(function (link) {
      var section = link.getAttribute("data-section");
      link.classList.toggle("nav-link--active", section === current);
      if (section === current) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  /* ========== Back to top — smooth scroll ========== */
  if (TOP_BTN) {
    TOP_BTN.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ========== Animate skill bars when skills section is visible ========== */
  var skillsSection = document.getElementById("skills");
  if (skillsSection && "IntersectionObserver" in window) {
    var skillObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            skillsSection.classList.add("skills--animated");
            observer.unobserve(skillsSection);
          }
        });
      },
      { threshold: 0.2 }
    );
    skillObserver.observe(skillsSection);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
