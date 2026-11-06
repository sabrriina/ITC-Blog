const $ = id => document.getElementById(id);
const notes = $("notes"), toast = $("toast");
const boxes = [...document.querySelectorAll("#checks input")];
const status = $("status"), statusText = $("statusText");
let timer;

function say(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(timer);
  timer = setTimeout(() => toast.classList.remove("show"), 2800);
}
function setStatus(label, cls) {
  statusText.textContent = label;
  status.className = "badge pending " + cls;
}
function lock() { ["approve", "changes", "reassign"].forEach(id => $(id).disabled = true); notes.disabled = true; boxes.forEach(b => b.disabled = true); }

// Live character count
const count = () => $("count").textContent = notes.value.length + " chars";
notes.addEventListener("input", () => { notes.classList.remove("err"); count(); });
count();

// Approve 
$("approve").addEventListener("click", () => {
  if (!boxes.every(b => b.checked)) return say("Tick all four publishing standards before approving.");
  setStatus("APPROVED", "ok"); lock(); say("Article approved. It stays unpublished until authorized.");
});

// Request changes 
$("changes").addEventListener("click", () => {
  if (!notes.value.trim()) {
    notes.classList.remove("err"); void notes.offsetWidth; notes.classList.add("err"); notes.focus();
    return say("Feedback notes are mandatory for change requests.");
  }
  setStatus("CHANGES REQUESTED", "chg"); lock(); say("Change request sent to the author.");
});

$("reassign").addEventListener("click", () => { setStatus("REASSIGNED", "chg"); lock(); say("Article returned to the review queue."); });

// Animate chart bars when scrolled into view
const chart = document.querySelector(".chart");
new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { chart.classList.add("in"); o.disconnect(); } }, { threshold: .3 }).observe(chart);

// Mobile menu
const burger = $("burger"), links = $("links");
burger.addEventListener("click", () => burger.setAttribute("aria-expanded", links.classList.toggle("open")));