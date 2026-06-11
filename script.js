/* ============================================
   VEXEL — site interactions
   ============================================ */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ---------------------------------------
     Footer year
  --------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------
     Custom cursor
  --------------------------------------- */
  if (!isTouch && !reduceMotion) {
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    let mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    });

    function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    }
    loop();

    document.querySelectorAll("a, button, .feature-card, .step, kbd").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
    });
  } else {
    document.querySelector(".cursor-dot")?.remove();
    document.querySelector(".cursor-ring")?.remove();
  }

  /* ---------------------------------------
     Scroll progress bar + nav state
  --------------------------------------- */
  const progressBar = document.getElementById("scrollProgressBar");
  const nav = document.getElementById("nav");

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
    nav.classList.toggle("scrolled", scrollTop > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------
     Mobile nav toggle
  --------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const navMobile = document.getElementById("navMobile");
  navToggle?.addEventListener("click", () => {
    const open = navToggle.classList.toggle("open");
    navMobile.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navMobile?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navToggle.classList.remove("open");
      navMobile.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------------------------------------
     Fade-up reveal on scroll
  --------------------------------------- */
  const fadeEls = document.querySelectorAll(".fade-up");
  fadeEls.forEach((el) => {
    const delay = el.getAttribute("data-delay");
    if (delay) el.style.setProperty("--d", delay);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  fadeEls.forEach((el) => revealObserver.observe(el));

  /* ---------------------------------------
     Particle field background
  --------------------------------------- */
  const canvas = document.getElementById("particles");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let w, h, particles;

    const PARTICLE_COUNT = window.innerWidth < 700 ? 35 : 80;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    function makeParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.6 + 0.4,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          c: Math.random() > 0.5 ? "124,92,255" : "77,239,224",
          a: Math.random() * 0.5 + 0.15,
        });
      }
    }
    makeParticles();

    function tick() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c}, ${p.a})`;
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ---------------------------------------
     Crystal mouse parallax
  --------------------------------------- */
  const crystal = document.getElementById("crystal");
  if (crystal && !isTouch && !reduceMotion) {
    window.addEventListener("mousemove", (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      crystal.style.transform = `rotateY(${dx * 12}deg) rotateX(${-dy * 12}deg)`;
    });
  }

  /* ---------------------------------------
     Transformation sequence (problem section)
  --------------------------------------- */
  const transformWindow = document.querySelector(".transform-window");
  const tBefore = document.getElementById("tBefore");
  const tAfter = document.getElementById("tAfter");
  const scanline = document.getElementById("scanline");
  const hotkeyPill = document.getElementById("hotkeyPill");
  const statusPill = document.getElementById("statusPill");

  const enhancedText =
    "Review this Python function for bugs, suggest fixes with explanations, and optimize it for performance.";

  let transformStarted = false;

  function typeText(el, text, speed) {
    return new Promise((resolve) => {
      let i = 0;
      el.textContent = "";
      const cursor = document.createElement("span");
      cursor.className = "cursor-blink";
      function step() {
        el.textContent = text.slice(0, i);
        el.appendChild(cursor);
        i++;
        if (i <= text.length) {
          setTimeout(step, speed);
        } else {
          resolve();
        }
      }
      step();
    });
  }

  async function runTransformSequence() {
    if (!transformWindow) return;

    // reset
    tBefore.classList.remove("dissolved");
    tAfter.textContent = "";
    scanline.classList.remove("run");
    hotkeyPill.classList.remove("pressed");
    statusPill.textContent = "Waiting for hotkey…";
    statusPill.classList.remove("busy", "done");

    await wait(700);

    // press hotkey
    hotkeyPill.classList.add("pressed");
    statusPill.textContent = "Enhancing…";
    statusPill.classList.add("busy");
    await wait(350);
    hotkeyPill.classList.remove("pressed");

    // dissolve original
    await wait(250);
    tBefore.classList.add("dissolved");

    // scanline sweep
    scanline.classList.add("run");
    await wait(500);

    // type enhanced text
    if (!reduceMotion) {
      await typeText(tAfter, enhancedText, 14);
    } else {
      tAfter.textContent = enhancedText;
    }

    statusPill.textContent = "Prompt enhanced";
    statusPill.classList.remove("busy");
    statusPill.classList.add("done");

    await wait(3200);
    scanline.classList.remove("run");
    runTransformSequence();
  }

  function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  if (transformWindow) {
    const transformObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !transformStarted) {
            transformStarted = true;
            runTransformSequence();
          }
        });
      },
      { threshold: 0.4 }
    );
    transformObserver.observe(transformWindow);
  }

  /* ---------------------------------------
     3D tilt on feature cards
  --------------------------------------- */
  if (!isTouch && !reduceMotion) {
    document.querySelectorAll(".feature-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-2px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------------------------------------
     Copy install command
  --------------------------------------- */
  const copyBtn = document.getElementById("copyBtn");
  const terminalCode = document.getElementById("terminalCode");
  copyBtn?.addEventListener("click", async () => {
    const text = terminalCode.innerText;
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.classList.add("copied");
      const span = copyBtn.querySelector("span");
      const original = span.textContent;
      span.textContent = "Copied!";
      setTimeout(() => {
        span.textContent = original;
        copyBtn.classList.remove("copied");
      }, 1800);
    } catch (err) {
      /* clipboard unavailable — silently ignore */
    }
  });

  /* ---------------------------------------
     GitHub stats (live, with fallback)
  --------------------------------------- */
  const statStars = document.getElementById("statStars");
  const statForks = document.getElementById("statForks");
  const statIssues = document.getElementById("statIssues");

  function countUp(el, target) {
    if (reduceMotion) {
      el.textContent = target.toLocaleString();
      return;
    }
    const duration = 1200;
    const start = performance.now();
    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function setStats(stars, forks, issues) {
    if (!statStars) return;
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            countUp(statStars, stars);
            countUp(statForks, forks);
            countUp(statIssues, issues);
            statsObserver.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    statsObserver.observe(statStars.closest(".stats-row"));
  }

  fetch("https://api.github.com/repos/Karthik-kumar-dev/vexel")
    .then((res) => (res.ok ? res.json() : Promise.reject()))
    .then((data) => {
      setStats(
        data.stargazers_count || 0,
        data.forks_count || 0,
        data.open_issues_count || 0
      );
    })
    .catch(() => {
      // fallback placeholder values if API unreachable / repo not yet public
      setStats(0, 0, 0);
    });
})();
