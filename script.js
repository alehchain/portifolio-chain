const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = [...document.querySelectorAll(".nav-links a[href^='#']")];
const sections = [...document.querySelectorAll("main section[id]")];

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.classList.remove("active");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const open = !navLinks.classList.contains("open");
  navLinks.classList.toggle("open", open);
  menuToggle.classList.toggle("active", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
});

navItems.forEach(item => item.addEventListener("click", closeMenu));

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);

  const current = sections
    .filter(section => window.scrollY >= section.offsetTop - 180)
    .at(-1);

  navItems.forEach(item => {
    item.classList.toggle(
      "active",
      current && item.getAttribute("href") === "#" + current.id
    );
  });
});

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach(element => observer.observe(element));

window.dispatchEvent(new Event("scroll"));
