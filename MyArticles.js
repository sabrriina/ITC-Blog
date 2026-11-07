const $ = id => document.getElementById(id);

// Icons
const I = {
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
  pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 9l3 3 5-5M8 21h8"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>',
  ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>'
};

// Data 
let items = [
  { id: 1, status: "published", cat: "DevOps", updated: "Updated Nov 18, 2024", title: "Zero-Downtime Migration to Kubernetes Cilium eBPF CNI",
    excerpt: "Field guide and live metrics from shifting 24 bare-metal clusters from Calico iptables routing to Cilium kernel-space eBPF…", url: "#" },
  { id: 2, status: "changes", cat: "Software Engineering", updated: "Updated Nov 20, 2024", notes: 1, title: "Memory Management in High-Throughput Go Workers",
    excerpt: "Profiling escape analysis, sync.Pool patterns, and GC ballast techniques processing 100k events/sec.", url: "#",
    note: "Please add a benchmark comparing sync.Pool against plain allocation, and state the Go version used." },
  { id: 3, status: "approved", cat: "Software Engineering", updated: "Updated Yesterday", title: "Implementing Distributed Consensus with Raft in Rust",
    excerpt: "", url: "#" },
  { id: 4, status: "pending", cat: "Cybersecurity", updated: "Updated 3 hours ago", title: "Hardware-Accelerated Cryptography with AVX-512",
    excerpt: "Benchmarking vector instruction set throughput for ChaCha20-Poly1305 and AES-GCM primitives.", url: "#" },
  { id: 5, status: "draft", cat: "AI", updated: "Updated 1 hour ago", title: "Exploring WebGPU Compute Shaders for Graph Neural Nets",
    excerpt: "Writing custom WGSL shaders to execute message-passing passes directly on client GPUs with zero overhead.", url: "#" },
  { id: 6, status: "draft", cat: "Cloud & Systems", updated: "Updated Nov 12, 2024", title: "Linux Cgroups v2 & Systemd Slice Orchestration",
    excerpt: "Dissecting memory.high vs memory.max triggers under extreme container contention.", url: "#" }
];

const LABEL = { published: "Published", changes: "Changes Requested", approved: "Approved", pending: "Pending Review", draft: "Draft" };
const TABS = [["all", "All"], ["draft", "Draft"], ["pending", "Pending Review"], ["changes", "Changes Requested"], ["approved", "Approved"], ["published", "Published"]];
let filter = "all", query = "";

const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const count = k => k === "all" ? items.length : items.filter(i => i.status === k).length;

function actions(i) {
  switch (i.status) {
    case "published": return `<a class="link cyan" href="${i.url}">View Public Article ${I.ext}</a>`;
    case "approved":  return `<a class="link green" href="${i.url}">${I.eye} Preview Article</a>`;
    case "pending":   return `<a class="link blue" href="${i.url}">${I.info} View Submission Details</a>`;
    case "changes":   return `<button class="abtn fb" data-act="feedback" data-id="${i.id}">${I.chat} View Feedback (${i.notes})</button>
                              <a class="abtn" href="${i.url}">${I.pen} Edit Article</a>`;
    case "draft":     return `<a class="abtn" href="${i.url}">${I.pen} Edit Draft</a>
                              <button class="abtn del" data-act="delete" data-id="${i.id}">${I.trash} Delete Draft</button>`;
  }
}

//  Render
function renderTabs() {
  $("tabs").innerHTML = TABS.map(([k, label]) =>
    `<button class="tab ${filter === k ? "on" : ""}" data-k="${k}">${label} <span class="n ${k}">${count(k)}</span></button>`).join("");
}
function render() {
  const q = query.trim().toLowerCase();
  const list = items.filter(i => (filter === "all" || i.status === filter) &&
    (!q || [i.title, i.cat, i.excerpt, LABEL[i.status]].join(" ").toLowerCase().includes(q)));
  $("items").innerHTML = list.length ? list.map(i => `
    <article class="item" data-id="${i.id}">
      <div class="i-main">
        <div class="i-meta">
          <span class="status st-${i.status}">${LABEL[i.status]}</span>
          <span>${esc(i.cat)}</span>
          <span class="upd">${I.clock}${i.updated}</span>
          ${i.notes ? `<span class="note-tag">${i.notes} Reviewer Note</span>` : ""}
        </div>
        <h2>${esc(i.title)}</h2>
        ${i.status === "approved"
          ? `<div class="ok-line">${I.ok}<span>Approved by Reviewer. Ready for automated or manual publishing.</span></div>`
          : `<p class="ex">${esc(i.excerpt)}</p>`}
      </div>
      <div class="i-act">${actions(i)}</div>
    </article>`).join("")
    : '<div class="empty"><b>No manuscripts found</b>Try a different status or keyword.</div>';
  renderTabs();
}

// Toast 
let timer;
function say(msg) {
  const t = $("toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(timer); timer = setTimeout(() => t.classList.remove("show"), 2600);
}

// Events 
$("tabs").addEventListener("click", e => { const b = e.target.closest(".tab"); if (b) { filter = b.dataset.k; render(); } });
$("search").addEventListener("input", e => { query = e.target.value; render(); });

// Mobile menu
const burger = $("burger"), links = $("links");
burger.addEventListener("click", () => burger.setAttribute("aria-expanded", links.classList.toggle("open")));

render();