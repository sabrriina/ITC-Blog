const $ = id => document.getElementById(id);
const editor = $("editor");
const exec = (c, v = null) => document.execCommand(c, false, v);

// Toolbar
$("toolbar").addEventListener("mousedown", e => { if (e.target.closest("button")) e.preventDefault(); });

const commands = {
  h1: () => exec("formatBlock", "h1"),
  h2: () => exec("formatBlock", "h2"),
  h3: () => exec("formatBlock", "h3"),
  bold: () => exec("bold"),
  italic: () => exec("italic"),
  strike: () => exec("strikeThrough"),
  ul: () => exec("insertUnorderedList"),
  ol: () => exec("insertOrderedList"),
  quote: () => exec("formatBlock", "blockquote"),
  code: () => {
    const t = getSelection().toString();
    if (t) exec("insertHTML", `<code>${t.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]))}</code>`);
  },
  block: () => {
    const tpl = document.querySelector(".cb").cloneNode(true);
    tpl.querySelector(".fn").textContent = "snippet.go";
    tpl.querySelector(".cb-code").textContent = "// your code here";
    exec("insertHTML", tpl.outerHTML + "<p><br></p>");
  },
  image: () => $("file").click()
};

$("toolbar").addEventListener("click", e => {
  const b = e.target.closest("[data-cmd]");
  if (!b) return;
  editor.focus();
  commands[b.dataset.cmd]();
  updateCount();
});

$("file").addEventListener("change", e => {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => { editor.focus(); exec("insertImage", r.result); };
  r.readAsDataURL(f);
  e.target.value = "";
});

// Copy button
editor.addEventListener("click", async e => {
  const b = e.target.closest(".copy");
  if (!b) return;
  try { await navigator.clipboard.writeText(b.closest(".cb").querySelector(".cb-code").innerText); } catch {}
});

// Live word count 
function updateCount() {
  const words = (editor.innerText.trim().match(/\S+/g) || []).length;
  $("calc").textContent = `Calculated: ~${Math.max(1, Math.round(words / 230))} min read (${words.toLocaleString("en-US")} words)`;
}
editor.addEventListener("input", updateCount);

// Mobile menu
const burger = $("burger"), links = $("links");
burger.addEventListener("click", () => burger.setAttribute("aria-expanded", links.classList.toggle("open")));

