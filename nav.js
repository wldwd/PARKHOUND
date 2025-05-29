/*
 Responsive navigation toggle functionality
 Handles mobile menu open/close state
 */

// Toggle between normal and responsive navigation states
export function toggleNav() {
  const nav = document.getElementById("myTopnav");
  nav.className = nav.className === "topnav" ? "topnav responsive" : "topnav";
}
// Attach click handler to hamburger menu
document.getElementById("navToggle").addEventListener("click", toggleNav);
