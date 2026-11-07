// Data
const featured = [
  {
    tag: "Software Engineering", meta: ["RFC #042", "Published Oct 24, 2024"], read: 11,
    title: "Distributed Raft Consensus in Go: Lessons from Building ITC Portal V4",
    excerpt: "A deep post-mortem detailing state machine replication, split-brain mitigation, and network partition simulations under high concurrency during our annual hackathon infrastructure.",
    author: "Yacine Khemis", role: "Principal Systems Lead @ ITC", initials: "YK", primary: true, img: "pics/DistributedRaftConsensusinGo.jpg", avatar: "pics/yacineKhemis.jpg"
  },
  {
    tag: "AI & NLP", meta: ["Research Paper", "Nov 02, 2024"], read: 8,
    title: "Fine-Tuning Llama 3 for Algerian Darija NLP",
    excerpt: "Methodology, low-rank adaptation (LoRA) hyperparameters, and synthetic corpus tokenization challenges when fine-tuning multilingual open models…",
    author: "Amina Benali", role: "ML Research Division", initials: "AB", primary: false, img: "pics/Fine-TuningLlama3.jpg", avatar: "pics/aminabenali.jpg"
  }
];

const latest = [
  { cat: "DevOps", read: 6, title: "Zero-Downtime Migration to Kubernetes Cilium eBPF CNI",
    excerpt: "Replacing standard iptables networking with eBPF-powered routing across our bare-metal cluster with zero dropped ingress…", author: "Mehdi Kadri", date: "Nov 18, 2024" },
  { cat: "Cyber Security", read: 9, title: "Hardening Linux Kernel Memory with Landlock & Seccomp-BPF",
    excerpt: "Sandboxing student code execution containers inside the ITC online judge platform without the overhead of hardware…", author: "Sofiane Larbi", date: "Nov 15, 2024" },
  { cat: "Databases", read: 12, title: "Postgres B-Tree Bloat: Autovacuum Tuning under Extreme Load",
    excerpt: "Diagnosing query degradation during member registration spikes, and re-architecting vacuum worker intervals and…", author: "Fatima Zahra", date: "Nov 10, 2024" },
  { cat: "Web Development", read: 5, title: "Streaming React Server Components via HTTP/3 Push in Edge Nodes",
    excerpt: "Measuring sub-millisecond Time-to-First-Byte for Algerian client connections using locally terminated QUIC tunnels and edge…", author: "Riad Benaissa", date: "Nov 06, 2024" },
  { cat: "Cloud", read: 7, title: "Building a Hybrid On-Prem Object Store with MinIO and Ceph",
    excerpt: "How we established S3-compliant distributed media caching across two campus data rooms while adhering to…", author: "Othman Toumi", date: "Oct 30, 2024" },
  { cat: "Software Engineering", read: 10, title: "Deterministic Concurrency Testing with Rust Model Checking",
    excerpt: "Hunting subtle race conditions in event-driven club services before deploying code onto our student portal clusters.", author: "Yacine Khemis", date: "Oct 20, 2024" }
];

// Helpers
const arrowUR = '<svg viewBox="0 0 24 24"><path d="M7 17L17 7M8 7h9v9"/></svg>';
const arrowR  = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const initials = n => n.split(" ").map(w => w[0]).join("");
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Render featured 
document.getElementById("featuredGrid").innerHTML = featured.map(a => `
  <article class="f-card">
    <div class="f-body">
      <div class="f-img">
        ${a.img ? `<img src="${a.img}" alt="${esc(a.title)}" loading="lazy">` : '<div class="ph"></div>'}
        <span class="tag">${esc(a.tag)}</span>
      </div>
      <div class="f-meta">
        <span>${esc(a.meta[0])}</span><span>•</span><span>${esc(a.meta[1])}</span><span>•</span>
        <span class="rt">${a.read} min read</span>
      </div>
      <h3>${esc(a.title)}</h3>
      <p>${esc(a.excerpt)}</p>
    </div>
    <div class="f-foot">
      <div class="author">
        <span class="avatar">${a.avatar ? `<img src="${a.avatar}" alt="${esc(a.author)}">` : a.initials}</span>
        <span><b>${esc(a.author)}</b><small>${esc(a.role)}</small></span>
      </div>
      <a href="#" class="btn ${a.primary ? "btn-red" : "btn-ghost"} sm">${a.primary ? "Read Article" : "Read"} ${arrowR}</a>
    </div>
  </article>`).join("");

// Render latest 
document.getElementById("latestGrid").innerHTML = latest.map(a => `
  <a href="#" class="card">
    <div class="card-top"><span class="chip">${esc(a.cat)}</span><span>${a.read} min read</span></div>
    <h3>${esc(a.title)}</h3>
    <p>${esc(a.excerpt)}</p>
    <div class="card-foot">
      <div class="author">
        <span class="avatar red">${initials(a.author)}</span>
        <span><b>${esc(a.author)}</b><small>${a.date}</small></span>
      </div>
      ${arrowUR}
    </div>
  </a>`).join("");

// Mobile menu
const burger = document.getElementById("burger");
const links = document.getElementById("links");
burger.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
links.addEventListener("click", e => {
  if (e.target.closest("a")) { links.classList.remove("open"); burger.setAttribute("aria-expanded", false); }
});

// Active nav link on scroll
const navLinks = [...links.querySelectorAll("a:not(.btn)")];
const sections = { "#home": document.getElementById("home"), "#latest": document.getElementById("latest"), "#footer": document.getElementById("footer") };
const setActive = () => {
  let current = "#home";
  const y = window.scrollY + 120;
  for (const [id, el] of Object.entries(sections)) if (el.offsetTop <= y) current = id;
  navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === current));
};
window.addEventListener("scroll", setActive, { passive: true });
setActive();

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();