/* ==========================================================================
   1. THEME TOGGLE (light / dark, saved for the session)
   ========================================================================== */
const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  sessionStorage.setItem("theme", theme);
}

const savedTheme = sessionStorage.getItem("theme") || "light";
setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(current);
});

/* ==========================================================================
   2. ACTIVE NAV LINK ON SCROLL
   ========================================================================== */
const sections = document.querySelectorAll("section, header[id]");
const navLinks = document.querySelectorAll(".nav-link");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove("active"));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add("active");
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px" }
);

sections.forEach((section) => observer.observe(section));

/* ==========================================================================
   3. EXPANDABLE PROJECT CARDS
   ========================================================================== */
document.querySelectorAll(".expand-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const details = btn.nextElementSibling;
    const isOpen = details.classList.toggle("open");
    btn.setAttribute("aria-expanded", isOpen);
    btn.textContent = isOpen ? "Hide details ▴" : "Show details ▾";
  });
});

/* ==========================================================================
   4. VISITOR COUNTER
   ========================================================================== */
const API_ENDPOINT = "https://h9e1jxvjdb.execute-api.eu-north-1.amazonaws.com/visitors";

async function updateVisitorCount() {
  const el = document.getElementById("visitor-count");
  try {
    const res = await fetch(API_ENDPOINT, { method: "POST" });
    const data = await res.json();
    animateCount(el, data.count);
  } catch (err) {
    el.textContent = "visitors: pending backend";
  }
}

function animateCount(el, target) {
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const tick = () => {
    current = Math.min(current + step, target);
    el.textContent = `visitors: ${String(current).padStart(6, "0")}`;
    if (current < target) requestAnimationFrame(tick);
  };
  tick();
}

updateVisitorCount();