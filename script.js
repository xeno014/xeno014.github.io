/**
 * Portfolio scripts
 * - Smooth scroll for in-page links
 * - Dynamic footer year
 */

console.log("Portfolio loaded!");

/* ========== Smooth scrolling for anchor links ========== */
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener("click", function (event) {
    var targetId = link.getAttribute("href");

    // Ignore empty hash
    if (!targetId || targetId === "#") {
      return;
    }

    var target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* ========== Footer year ========== */
var yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}
