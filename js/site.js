/* ==========================================================================
   site.js — 两页共享：导航、滚动入场、弹窗、黑白熊、页脚年份
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------------------------------------------------------------------
     移动端导航
     --------------------------------------------------------------------- */
  const nav = document.querySelector(".site-nav");
  const navToggle = document.querySelector(".nav-toggle");

  if (nav && navToggle) {
    const setNav = (open) => {
      nav.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    };

    navToggle.addEventListener("click", () => {
      setNav(navToggle.getAttribute("aria-expanded") !== "true");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setNav(false));
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setNav(false);
        navToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) setNav(false);
    });
  }

  /* ---------------------------------------------------------------------
     导航高亮当前章节
     --------------------------------------------------------------------- */
  const navLinks = Array.from(document.querySelectorAll("[data-nav-section]"));
  const sections = navLinks
    .map((link) => document.getElementById(link.dataset.navSection))
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            const isMatch = link.dataset.navSection === entry.target.id;
            link.classList.toggle("is-active", isMatch);
            if (isMatch) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => activeObserver.observe(section));
  }

  /* ---------------------------------------------------------------------
     滚动入场
     --------------------------------------------------------------------- */
  const revealItems = document.querySelectorAll("[data-reveal]");

  if (revealItems.length) {
    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
      );
      revealItems.forEach((item) => revealObserver.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }
  }

  /* ---------------------------------------------------------------------
     弹窗：打开 / 关闭 / 焦点管理
     --------------------------------------------------------------------- */
  const FOCUSABLE = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "video[controls]",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  let lastFocused = null;

  function focusables(root) {
    return Array.from(root.querySelectorAll(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement
    );
  }

  function openModal(modal) {
    if (!modal || modal.classList.contains("is-open")) return;
    lastFocused = document.activeElement;
    modal.classList.add("is-open");
    modal.removeAttribute("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const dialog = modal.querySelector(".modal__dialog");
    const target = modal.querySelector("[data-autofocus]") || focusables(dialog)[0] || dialog;
    window.setTimeout(() => target.focus?.({ preventScroll: true }), 60);

    modal.dispatchEvent(new CustomEvent("modal:open"));
  }

  function closeModal(modal) {
    if (!modal || !modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    const video = modal.querySelector("video");
    if (video && !video.paused) video.pause();

    modal.dispatchEvent(new CustomEvent("modal:close"));
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
    lastFocused = null;
  }

  document.querySelectorAll("[data-modal-open]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openModal(document.getElementById(trigger.dataset.modalOpen));
    });
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.querySelectorAll("[data-modal-close]").forEach((closer) => {
      closer.addEventListener("click", () => closeModal(modal));
    });

    modal.addEventListener("mousedown", (event) => {
      if (event.target === modal) closeModal(modal);
    });

    modal.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        closeModal(modal);
        return;
      }

      if (event.key !== "Tab") return;

      const items = focusables(modal.querySelector(".modal__dialog"));
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  });

  window.HPA = { openModal, closeModal };

  /* ---------------------------------------------------------------------
     黑白熊语录
     --------------------------------------------------------------------- */
  const quotes = [
    "噗噗噗～发现违规行为可是要处刑的哦！",
    "绝望才是人生的真谛啊！",
    "你们这些预备学科的家伙，连当实验材料的价值都没有呢～",
    "希望？那是什么，能吃吗？",
    "想要通过毕业考试？先杀掉两个同学再说吧！",
    "学级裁判要开始咯～不找出凶手的话，大家都要死哦！",
    "我的熊猫玩偶服下面可是藏着狼牙棒的！",
    "看到那边的处刑装置了吗？是专门为你准备的哦～",
    "预备学科的学生啊，就像垃圾场的老鼠一样呢！",
    "希望之峰学园的秘密……你想知道吗？不过知道的话……会死哦！",
  ];

  const monokuma = document.querySelector("[data-monokuma]");

  if (monokuma) {
    let bubble = null;
    let hideTimer = 0;

    const removeBubble = () => {
      window.clearTimeout(hideTimer);
      if (!bubble) return;
      bubble.classList.add("is-leaving");
      const node = bubble;
      bubble = null;
      window.setTimeout(() => node.remove(), 220);
    };

    monokuma.addEventListener("click", () => {
      removeBubble();

      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      bubble = document.createElement("div");
      bubble.className = "monokuma-bubble";
      bubble.setAttribute("role", "status");
      bubble.innerHTML =
        '<span class="monokuma-bubble__name">黑白熊 / MONOKUMA</span>' +
        quote.replace(/</g, "&lt;");
      document.body.appendChild(bubble);

      hideTimer = window.setTimeout(removeBubble, 6000);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") removeBubble();
    });

    document.addEventListener("click", (event) => {
      if (bubble && !bubble.contains(event.target) && !monokuma.contains(event.target)) {
        removeBubble();
      }
    });
  }

  /* ---------------------------------------------------------------------
     页脚年份
     --------------------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
})();
