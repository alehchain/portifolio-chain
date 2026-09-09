const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const loader = document.getElementById("loader");
const loaderText = document.getElementById("loaderText");
const menuButton = document.getElementById("menuButton");
const menuOverlay = document.getElementById("menuOverlay");
const cursor = document.getElementById("cursor");
const header = document.getElementById("header");

const loaderWords = ["Olá", "Hello", "Bienvenido", "Bem-vindo"];

function openMenu(open) {
  menuButton.classList.toggle("open", open);
  menuOverlay.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
}

menuButton.addEventListener("click", () => openMenu(!menuOverlay.classList.contains("open")));
menuOverlay.querySelectorAll("a").forEach(link => link.addEventListener("click", () => openMenu(false)));

if (!prefersReduced && window.gsap) {
  gsap.registerPlugin(ScrollTrigger);

  let i = 0;
  const loaderInterval = setInterval(() => {
    i += 1;
    loaderText.textContent = loaderWords[i % loaderWords.length];
  }, 240);

  const runIntro = () => {
    clearInterval(loaderInterval);
    gsap.timeline()
      .to(".loader-inner", { y: -20, opacity: 0, duration: .45, ease: "power2.in" })
      .to(loader, { yPercent: -100, duration: .9, ease: "power4.inOut" })
      .set(loader, { display: "none" })
      .from(".hero-title", { yPercent: 120, duration: 1.2, ease: "power4.out" }, "-=.35")
      .from(".portrait-wrap", { y: 120, opacity: 0, duration: 1, ease: "power3.out" }, "-=.9")
      .from(".hero-meta, .hero-bottom", { opacity: 0, y: 20, duration: .7, stagger: .08 }, "-=.6");
  };

  if (document.readyState === "complete") runIntro();
  else window.addEventListener("load", runIntro, { once: true });

  const lenis = window.Lenis ? new Lenis({ duration: 1.15, smoothWheel: true }) : null;
  if (lenis) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  gsap.to(".hero-line", {
    xPercent: -18,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1
    }
  });

  gsap.to(".portrait-wrap", {
    yPercent: 8,
    scale: .95,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1
    }
  });

  document.querySelectorAll(".split-text").forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(word => '<span class="reveal-word"><span>' + word + '&nbsp;</span></span>').join("");
    gsap.from(el.querySelectorAll(".reveal-word > span"), {
      yPercent: 110,
      duration: .9,
      stagger: .025,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 83%" }
    });
  });

  gsap.utils.toArray(".expertise article").forEach((item, index) => {
    gsap.from(item, {
      y: 50,
      opacity: 0,
      duration: .75,
      delay: index * .05,
      scrollTrigger: { trigger: item, start: "top 88%" }
    });
  });

  gsap.utils.toArray(".project-row").forEach(row => {
    gsap.from(row, {
      y: 45,
      opacity: 0,
      duration: .7,
      scrollTrigger: { trigger: row, start: "top 92%" }
    });
  });

  gsap.utils.toArray(".timeline-list article").forEach(row => {
    gsap.from(row, {
      y: 35,
      opacity: 0,
      duration: .7,
      scrollTrigger: { trigger: row, start: "top 90%" }
    });
  });

  document.querySelectorAll(".magnetic").forEach(el => {
    el.addEventListener("mousemove", e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * .18, y: y * .18, duration: .35, ease: "power2.out" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: .6, ease: "elastic.out(1,.35)" });
    });
  });
} else {
  loader.style.display = "none";
}

let mouseX = 0;
let mouseY = 0;
document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (window.gsap) {
    gsap.to(cursor, { x: mouseX, y: mouseY, duration: .18, ease: "power2.out" });
  } else {
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  }
});

document.querySelectorAll(".cursor-view").forEach(el => {
  el.addEventListener("mouseenter", () => cursor.classList.add("active"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
});

window.addEventListener("scroll", () => {
  const show = window.scrollY > window.innerHeight * .55;
  if (window.innerWidth > 980) {
    menuButton.style.display = show ? "flex" : "none";
  }
});

window.dispatchEvent(new Event("scroll"));
