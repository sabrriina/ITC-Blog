// Data 

const articles = [
  { topic: "Cybersecurity", tag: "Cybersecurity", date: "2024-10-18", read: 6,
    title: "Zero-Knowledge Proofs in Smart Contract Verification",
    excerpt: "Synthesizing Groth16 and PLONK systems into runtime execution layers to guarantee zero-disclosure transactional verification across untrusted L1 rollups.",
    author: "Karim Z.", role: "Security Lead // Core Kernel Team", avatar: "Pics/karim.jpg" },
  { topic: "DevOps", tag: "DevOps", date: "2024-10-15", read: 9,
    title: "Building Real-Time Telemetry with eBPF in Linux",
    excerpt: "Bypassing userland overhead via safe in-kernel bytecode insertion to track TCP socket mutations and distributed packet latency at sub-microsecond intervals.",
    author: "Amina B.", role: "Infrastructure Architect // DevOps Guild", avatar: "pics/amina.jpg" },
  { topic: "AI", tag: "AI", date: "2024-10-11", read: 11,
    title: "Quantization Horizons: AWQ vs FP8 Inference on Edge GPUs",
    excerpt: "Evaluating throughput thresholds, activation anomalies, and memory bandwidth bounds across dense transformer weights on restricted consumer silicon.",
    author: "Yacine M.", role: "Machine Intelligence Fellow // ITC Labs", avatar: "Pics/yacine.jpg" },
  { topic: "Databases", tag: "Databases", date: "2024-09-28", read: 7,
    title: "Lock-Free B-Trees and Concurrent LSM-Tree Pruning",
    excerpt: "Minimizing tail-write latency during heavy SSD write-amplification compaction phases through hardware CAS instructions and epoch garbage collection.",
    author: "Sofiane K.", role: "Storage Engines Lead // Algorithmic Systems", avatar: "Pics/sofian.jpg" },
  { topic: "Web Development", tag: "Web Development", date: "2024-09-14", read: 5,
    title: "Off-Thread Canvas Pipelines: Web Workers & OffscreenCanvas in WebGL2",
    excerpt: "Decoupling rendering loop execution from main UI thread jank by delegating frame generation to dedicated dedicated worker instances over SharedArrayBuffer.",
    author: "Sarah L.", role: "Frontend Graphics Researcher // ITC Web Lab", avatar: "Pics/sarah.jpg" },
  { topic: "Cloud", tag: "Cloud", date: "2024-08-30", read: 10,
    title: "Deterministic Serverless Failover across Autonomous Multi-Region Clusters",
    excerpt: "Architecting Raft-backed global health arbiters that coordinate cross-cloud egress migration within 450ms SLA without split-brain partition drift.",
    author: "Tariq H.", role: "Cloud Distributed Systems // Core Member", avatar: "Pics/tariq.jpg"},
    { topic: "DevOps", tag: "DevOps", date: "2024-10-14", read: 9,
    title: "Architecting Low-Latency Real-Time Telemetry with eBPF and Go in Kubernetes",
    excerpt: "How we bypassed traditional user-space socket overhead to achieve sub-millisecond network tracing across 14 university lab nodes.",
    author: "Amine D.", role: "Systems & Kernel Lead", avatar: "Pics/DanaAmine.jpg",url: "DanaArticle.html" },

];

const PAGE = 6;
let topic = "all", query = "", sortBy = "new", shown = PAGE;

const $ = id => document.getElementById(id);
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const initials = n => n.replace(/\./g, "").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
const fmt = d => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
const clock = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
const arrow = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function avatar(a) {
  const ini = initials(a.author);
  return `<span class="avatar" data-ini="${ini}">${a.avatar ? `<img src="${a.avatar}" alt="${esc(a.author)}" loading="lazy">` : ini}</span>`;
}

function visible() {
  const q = query.trim().toLowerCase();
  const list = articles.filter(a =>
    (topic === "all" || a.topic === topic) &&
    (!q || [a.title, a.excerpt, a.author, a.role, a.tag].join(" ").toLowerCase().includes(q)));
  const sorters = {
    new: (a, b) => b.date.localeCompare(a.date),
    old: (a, b) => a.date.localeCompare(b.date),
    short: (a, b) => a.read - b.read,
    long: (a, b) => b.read - a.read
  };
  return list.sort(sorters[sortBy]);
}

function render() {
  const all = visible();
  const slice = all.slice(0, shown);
  $("list").innerHTML = slice.length ? slice.map(a => `
    <article class="a-card">
      <div class="a-main">
        <div class="a-meta">
          <span class="chip">${esc(a.tag)}</span><i class="dot"></i>
          <span>${fmt(a.date)}</span><i class="dot"></i>
          <span class="rt">${clock} ${a.read} min read</span>
        </div>
        <h2>${esc(a.title)}</h2>
        <p>${esc(a.excerpt)}</p>
        <div class="author">${avatar(a)}<span><b>${esc(a.author)}</b><small>${esc(a.role)}</small></span></div>
      </div>
      <a href="${a.url || '#'}" class="btn btn-red">Read Article ${arrow}</a>
    </article>`).join("")
    : '<div class="empty"><b>No articles found</b>Try a different keyword or topic.</div>';
  $("more").parentElement.hidden = all.length <= shown;

  // fall back to initials if an author photo is missing
  $("list").querySelectorAll(".avatar img").forEach(img =>
    img.addEventListener("error", () => { img.parentElement.textContent = img.parentElement.dataset.ini; }, { once: true }));
}

// Events
$("search").addEventListener("input", e => { query = e.target.value; shown = PAGE; render(); });
$("sort").addEventListener("change", e => { sortBy = e.target.value; shown = PAGE; render(); });
$("filters").addEventListener("click", e => {
  const b = e.target.closest(".pill");
  if (!b) return;
  document.querySelectorAll(".pill").forEach(p => p.classList.toggle("on", p === b));
  topic = b.dataset.topic; shown = PAGE; render();
});
$("more").addEventListener("click", () => { shown += PAGE; render(); });

// Mobile menu + year 
const burger = $("burger"), links = $("links");
burger.addEventListener("click", () => burger.setAttribute("aria-expanded", links.classList.toggle("open")));
$("year").textContent = new Date().getFullYear();

render();