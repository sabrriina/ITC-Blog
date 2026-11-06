const $ = id => document.getElementById(id);

// Copy code button
$("copy").addEventListener("click", async e => {
  const label = e.currentTarget.querySelector("span");
  const text = [...$("code").querySelectorAll(".l")].map(l => l.textContent).join("\n");
  try {
    await navigator.clipboard.writeText(text);
    label.textContent = "Copied!";
  } catch {
    label.textContent = "Press Ctrl+C";
  }
  setTimeout(() => label.textContent = "Copy", 1800);
});

// Mobile menu
const burger = $("burger"), links = $("links");
burger.addEventListener("click", () => burger.setAttribute("aria-expanded", links.classList.toggle("open")));