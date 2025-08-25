File: script.js
Purpose: JavaScript for dynamic behavior (posting, browsing skills).


// ===== Constants =====
const LOGIN_KEY = "skillsharehub_loggedin";
const USER_KEY  = "skillsharehub_user";
const SCORE_KEY = "skillsharehub_week_score";

// ===== Categories & Skills (with benefits) =====
const CATEGORIES = [
  { name:"Programming", skills:[
    { name:"JavaScript", benefit:"Great for web development and interactive apps." },
    { name:"Python", benefit:"Popular for AI, data science, and automation." },
    { name:"Java", benefit:"Widely used in enterprise and Android development." }
  ]},
  { name:"Design", skills:[
    { name:"Graphic Design", benefit:"Enhances creativity and branding." },
    { name:"UI/UX", benefit:"Improves user experience and usability." }
  ]},
  { name:"Business", skills:[
    { name:"Marketing", benefit:"Boosts product visibility and sales." },
    { name:"Entrepreneurship", benefit:"Build and manage startups." }
  ]},
  { name:"Music", skills:[
    { name:"Guitar", benefit:"Improves coordination and musicality." },
    { name:"Piano", benefit:"Develops rhythm and harmony skills." },
    { name:"Singing", benefit:"Strengthens voice and confidence." },
    { name:"Music Production", benefit:"Compose, record, and mix songs." }
  ]},
  { name:"Health & Fitness", skills:[
    { name:"Yoga", benefit:"Flexibility, posture, stress relief." },
    { name:"Strength Training", benefit:"Muscle growth and endurance." }
  ]},
  { name:"Languages", skills:[
    { name:"Spanish", benefit:"Travel ease and more job opportunities." },
    { name:"French", benefit:"Culture, travel, and global communication." }
  ]},
  { name:"Art", skills:[
    { name:"Drawing", benefit:"Observation & creativity." },
    { name:"Painting", benefit:"Express emotions through color." },
    { name:"Digital Art", benefit:"Create modern illustrations using software." }
  ]}
];

// ===== Utility =====
function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return root.querySelectorAll(sel); }
function getUser(){ return localStorage.getItem(USER_KEY) || "Guest"; }

function requireLogin(){
  if (document.body.dataset.page === "login") return; // skip on login page
  if (localStorage.getItem(LOGIN_KEY) !== "true"){
    location.href = "login.html";
    return false;
  }
  return true;
}

function setActiveNav(){
  const page = document.body.dataset.page;
  const map = {home:"home", browse:"browse", about:"about", post:"post"};
  const target = map[page];
  if (!target) return;
  $all('.nav a').forEach(a=>{
    if (a.dataset.nav === target) a.classList.add('active');
  });
}

function attachHeaderUser(){
  if (document.body.dataset.page === "login") return;
  const user = getUser();
  const welcome = $("#welcomeUser");
  if (welcome) welcome.textContent = "Welcome, " + user;
  const logoutBtn = $("#logoutBtn");
  if (logoutBtn){
    logoutBtn.addEventListener("click", ()=>{
      localStorage.removeItem(LOGIN_KEY);
      localStorage.removeItem(USER_KEY);
      location.href = "login.html";
    });
  }
}

// ===== Home Page =====
function initHome(){
  const nameEl = $("#profileName");
  if (nameEl) nameEl.textContent = getUser();

  const weeklyScore = parseInt(localStorage.getItem(SCORE_KEY) || "0", 10);
  const scoreEl = $("#weeklyScore");
  if (scoreEl) scoreEl.textContent = weeklyScore;

  const add10 = $("#addScore10");
  const reset = $("#resetScore");
  if (add10){
    add10.addEventListener("click", ()=>{
      const cur = parseInt(localStorage.getItem(SCORE_KEY) || "0", 10) + 10;
      localStorage.setItem(SCORE_KEY, String(cur));
      $("#weeklyScore").textContent = cur;
    });
  }
  if (reset){
    reset.addEventListener("click", ()=>{
      localStorage.setItem(SCORE_KEY, "0");
      $("#weeklyScore").textContent = 0;
    });
  }

  const sotw = $("#sotwList");
  if (sotw){
    const picks = ["Python", "UI/UX", "Guitar", "Spanish", "Digital Art"];
    sotw.innerHTML = picks.map(p=>`<li>${p}</li>`).join("");
  }
}

// ===== Browse Page =====
function renderCategories(){
  const host = $("#categoriesList");
  if (!host) return;
  host.innerHTML = "";
  CATEGORIES.forEach(cat=>{
    const det = document.createElement("details");
    det.className = "category-item";

    const sum = document.createElement("summary");
    sum.textContent = cat.name;
    det.appendChild(sum);

    const ul = document.createElement("ul");
    cat.skills.forEach(s=>{
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.className = "skill";
      a.textContent = s.name;
      a.dataset.benefit = s.benefit;
      a.addEventListener("click", (e)=>{
        e.preventDefault();
        showSkillDetail(s.name, s.benefit);
      });
      li.appendChild(a);
      ul.appendChild(li);
    });
    det.appendChild(ul);
    host.appendChild(det);
  });
}

function showSkillDetail(name, benefit){
  const box = $("#skillDetail");
  if (!box) return;
  box.innerHTML = `<h3>${name}</h3><p>${benefit}</p><button id="closeDetail" class="btn small">Back to Categories</button>`;
  box.hidden = false;
  $("#closeDetail").addEventListener("click", ()=>{ box.hidden = true; });
}

function setupSearch(){
  const input = $("#skillSearch");
  if (!input) return;
  input.addEventListener("input", ()=>{
    const term = input.value.toLowerCase();
    const details = $all(".category-item");
    details.forEach(d=>{
      let any = false;
      $all("li", d).forEach(li=>{
        const t = li.textContent.toLowerCase();
        const match = t.includes(term);
        li.style.display = match ? "" : "none";
        if (match) any = true;
      });
      d.style.display = (any || term==="") ? "" : "none";
      if (term && any) d.open = true;
    });
  });
}

// ===== Post Page =====
function initPost(){
  const form = $("#postForm");
  const list = $("#postList");
  if(!form || !list) return;
  const POSTS_KEY = "skillsharehub_posts";
  const posts = JSON.parse(localStorage.getItem(POSTS_KEY) || "[]");
  function render(){
    list.innerHTML = posts.slice().reverse().map(p=>`<li><strong>${p.title}</strong><div>${p.body}</div></li>`).join("");
  }
  render();
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const title = $("#postTitle").value.trim();
    const body = $("#postBody").value.trim();
    if(!title || !body) return;
    posts.push({title, body, ts: Date.now()});
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    form.reset();
    render();
  });
}

// ===== Login Page =====
function initLogin(){
  // If already logged in, go to home
  if (localStorage.getItem(LOGIN_KEY) === "true"){
    location.href = "index.html";
    return;
  }
  const form = document.getElementById("loginForm");
  if (!form) return;
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();
    if (pass === "azip" && user){
      localStorage.setItem(LOGIN_KEY, "true");
      localStorage.setItem(USER_KEY, user);
      location.href = "index.html";
    } else {
      alert("Invalid login. Use any username + password: azip");
    }
  });
}

// ===== Boot =====
document.addEventListener("DOMContentLoaded", () => { initChatbot();
  const page = document.body.dataset.page;
  setActiveNav();
  if (page !== "login"){
    if(!requireLogin()) return;
    attachHeaderUser();
  }
  if (page === "home")   initHome();
  if (page === "browse"){ renderCategories(); setupSearch(); }
  if (page === "post")   initPost();
  if (page === "login")  initLogin();
});


// ===== Chatbot =====
function initChatbot(){
  if (document.body.dataset.page === "login") return;
  if (document.getElementById("chatToggle")) return; // prevent duplicates

  // Create toggle button
  const btn = document.createElement("button");
  btn.id = "chatToggle";
  btn.className = "chat-toggle";
  btn.innerHTML = '<i class="fa-solid fa-message"></i>';
  document.body.appendChild(btn);

  // Create chat window
  const win = document.createElement("div");
  win.id = "chatWindow";
  win.className = "chat-window";
  win.innerHTML = `
    <div class="chat-header">
      <div class="chat-title"><i class="fa-solid fa-robot"></i> SkillShare Assistant</div>
      <button class="chat-close" aria-label="Close">&times;</button>
    </div>
    <div class="chat-body" id="chatBody" aria-live="polite"></div>
    <div class="chat-quick" id="chatQuick"></div>
    <form class="chat-input" id="chatForm">
      <input type="text" id="chatText" placeholder="Ask about skills, videos, or the site..." autocomplete="off" />
      <button class="btn primary" type="submit">Send</button>
    </form>
  `;
  document.body.appendChild(win);

  // Load Font Awesome if not loaded
  if (!document.querySelector('link[href*=\"font-awesome\"]')){
    const fa = document.createElement("link");
    fa.rel = "stylesheet";
    fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    document.head.appendChild(fa);
  }

  const chatBody = document.getElementById("chatBody");
  const chatForm = document.getElementById("chatForm");
  const chatText = document.getElementById("chatText");
  const chatQuick = document.getElementById("chatQuick");
  const closeBtn = win.querySelector(".chat-close");

  const USER = localStorage.getItem(USER_KEY) || "Guest";
  const HISTORY_KEY = "skillsharehub_chat_" + USER;

  function time() { return new Date().toLocaleTimeString(); }

  function push(role, text){
    const bubble = document.createElement("div");
    bubble.className = role === "user" ? "bubble user" : "bubble bot";
    bubble.innerHTML = `<div class="bubble-inner">${text}</div><span class="ts">${time()}</span>`;
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
    persist();
  }

  function suggestButtons(labels){
    chatQuick.innerHTML = "";
    labels.forEach(l=>{
      const b = document.createElement("button");
      b.type = "button";
      b.className = "pill";
      b.textContent = l;
      b.addEventListener("click", ()=>{
        chatText.value = l;
        chatForm.dispatchEvent(new Event("submit", {cancelable:true}));
      });
      chatQuick.appendChild(b);
    });
  }

  function persist(){
    const msgs = Array.from(chatBody.querySelectorAll(".bubble")).map(b=>({
      role: b.classList.contains("user") ? "user" : "bot",
      html: b.querySelector(".bubble-inner").innerHTML
    }));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(msgs));
  }

  function restore(){
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return greet();
    try{
      const msgs = JSON.parse(raw);
      msgs.forEach(m=>{
        const bubble = document.createElement("div");
        bubble.className = m.role === "user" ? "bubble user" : "bubble bot";
        bubble.innerHTML = `<div class="bubble-inner">${m.html}</div><span class="ts">${time()}</span>`;
        chatBody.appendChild(bubble);
      });
      chatBody.scrollTop = chatBody.scrollHeight;
      suggestButtons(["Show Python video","Browse skills","How to post a tip?"]);
    }catch(e){ greet(); }
  }

  function greet(){
    push("bot", `Hi <strong>${USER}</strong> 👋<br>Ask me about <em>Python, Java, Music, Drawing</em> videos, benefits of a skill, or how to use the site.`);
    suggestButtons(["Show Python video","Open Java details","Benefits of UI/UX","Browse skills"]);
  }

  function route(query){
    const q = query.toLowerCase();

    // Navigation intents
    if (q.includes("browse")) { location.href = "browse.html"; return "Opening Browse…"; }
    if (q.includes("home")) { location.href = "index.html"; return "Going Home…"; }
    if (q.includes("about")) { location.href = "about.html"; return "Opening About…"; }
    if (q.includes("post")) { location.href = "post.html"; return "Opening Post…"; }

    // Video intents
    if (q.includes("python") && q.includes("video")){
      location.href = "skill.html?name=Python";
      return "Taking you to the Python tutorial 🎥";
    }
    if (q.includes("java") && q.includes("video")){
      location.href = "skill.html?name=Java";
      return "Opening the Java tutorial 🎥";
    }
    if (q.includes("music") && q.includes("video")){
      location.href = "skill.html?name=Music";
      return "Opening the Music tutorial 🎵";
    }
    if (q.includes("drawing") && q.includes("video")){
      location.href = "skill.html?name=Drawing";
      return "Opening the Drawing tutorial ✏️";
    }

    // Open skill details
    const skills = ["python","java","music","drawing","javascript","ui/ux","graphic design","digital art","spanish","french","yoga"];
    for (const s of skills){
      if (q.includes("open " + s) || q === s || q.includes("show " + s) || q.includes("details " + s)){
        const name = s.split(" ").map(w=>w[0].toUpperCase()+w.slice(1)).join(" ");
        location.href = `skill.html?name=${encodeURIComponent(name)}`;
        return `Opening ${name} details…`;
      }
    }

    // Benefits intent
    const BENEFITS = {
      "python":"High demand, beginner-friendly, used in AI/ML & data.",
      "java":"Stable, cross-platform, great for large-scale apps.",
      "music":"Boosts creativity, focus, and expression.",
      "drawing":"Improves observation, relaxes mind, builds creativity.",
      "ui/ux":"Better user experiences and product success."
    };
    for (const key in BENEFITS){
      if (q.includes("benefits") && q.includes(key)){
        return `Benefits of ${key.toUpperCase()}: ${BENEFITS[key]}`;
      }
    }

    // Help
    if (q.includes("help") || q.includes("how")){
      return "You can ask me to open pages (Home/Browse/About/Post), show a skill’s video (e.g., “Show Python video”), or explain benefits of a skill.";
    }

    // Default
    return "I didn’t catch that. Try “Browse skills”, “Show Python video”, or “Benefits of Java”.";
  }

  // Toggle & close
  btn.addEventListener("click", ()=>{
    win.classList.toggle("open");
    if (win.classList.contains("open") && chatBody.children.length === 0){
      restore();
    }
  });
  closeBtn.addEventListener("click", ()=> win.classList.remove("open"));

  // Submit
  chatForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const text = chatText.value.trim();
    if (!text) return;
    push("user", text);
    const reply = route(text);
    if (reply) push("bot", reply);
    chatText.value = "";
    suggestButtons(["Browse skills","Show Java video","Open Music details","Benefits of Python"]);
  });

  // Auto boot on first open
  // (Don't open immediately to avoid distracting the user)
}
