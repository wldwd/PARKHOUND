export function toggleNav() {
  const nav = document.getElementById("myTopnav");
  nav.className = nav.className === "topnav" ? "topnav responsive" : "topnav";
}
