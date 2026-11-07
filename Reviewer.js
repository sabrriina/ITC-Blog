const $ = id => document.getElementById(id);
const modal = $("modal"), reason = $("reason"), toast = $("toast");
let current = null, lastBtn = null, timer;

function say(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(timer);
  timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function sync() {
  const jobs = [...document.querySelectorAll(".job")];
  const urgent = jobs.filter(j => j.dataset.priority === "high").length;
  $("kPending").textContent = jobs.length;
  $("kUrgent").textContent = urgent;
  $("kUrgentTxt").textContent = urgent;
  $("entries").textContent = String(jobs.length).padStart(2, "0") + "_ENTRIES";
  $("empty").hidden = jobs.length > 0;
}

// Open Outside My Expertise
$("queue").addEventListener("click", e => {
  const btn = e.target.closest(".btn.out");
  if (!btn) return;
  current = btn.closest(".job");
  lastBtn = btn;
  $("mArticle").textContent = current.dataset.title;
  reason.value = ""; $("topic").value = ""; reason.classList.remove("err");
  modal.showModal();
  reason.focus();
});

const close = () => { modal.close(); lastBtn && lastBtn.focus(); };
$("mClose").addEventListener("click", close);
$("mCancel").addEventListener("click", close);
modal.addEventListener("click", e => { if (e.target === modal) close(); });   
reason.addEventListener("input", () => reason.classList.remove("err"));

// Submit
$("mForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!reason.value.trim()) {
    reason.classList.remove("err"); void reason.offsetWidth; reason.classList.add("err"); reason.focus();
    return say("Please give a reason for returning this assignment.");
  }
  const job = current, title = job.dataset.title;
  modal.close();
  job.classList.add("out");
  setTimeout(() => { job.remove(); sync(); }, 350);
  say("Returned to the admin queue: " + title);
});

// Mobile menu
const burger = $("burger"), links = $("links");
burger.addEventListener("click", () => burger.setAttribute("aria-expanded", links.classList.toggle("open")));
$("year").textContent = new Date().getFullYear();
sync();