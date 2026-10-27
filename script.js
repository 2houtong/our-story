/* ==========================================================
   只需要改这一个地方，整站内容都会跟着变
   ========================================================== */

const CONFIG = {
  // 你们在一起的那一天（年月日 时:分:秒），务必改成真实日期
  startDate: "2023-05-20T20:20:00",

  // 故事时间轴：想加几条就加几条，会自动渲染
  story: [
    {
      date: "2023.05.20",
      title: "第一次见面",
      text: "那天我其实很紧张，说话都在打草稿。后来才发现，你比我更紧张，只是藏得比较好。"
    },
    {
      date: "2023.08.14",
      title: "第一次牵手",
      text: "走了很久的路，谁都没提。手心全是汗，我到现在都记得那种不敢用力又舍不得松开的力道。"
    },
    {
      date: "2024.02.11",
      title: "第一次一起出远门",
      text: "车票是提前一个月买的。你在车窗边睡着，我看了很久，觉得这趟车慢一点也没关系。"
    },
    {
      date: "2024.12.31",
      title: "第一次一起跨年",
      text: "倒数的时候你说了句什么，被人群的声音盖住了。我没听清，但我想我大概知道。"
    },
    {
      date: "今天",
      title: "现在",
      text: "还是会为很小的事情高兴，还是会在你笑的时候跟着笑。好像没有变，也好像什么都变好了。",
      now: true
    }
  ],

  // 关于妳的小事：10 条，可自由增删
  little: [
    "喝奶茶永远是三分糖，但会偷偷喝我的全糖。",
    "生气的时候不说话，会先看我的反应。",
    "拍照前一定要整理头发，哪怕只有一秒。",
    "看剧到感人的地方，会假装去拿纸巾。",
    "走路喜欢走外侧，说了很多次也不改。",
    "记不住自己的密码，却记得我所有喜好。",
    "冷不丁会唱一句跑调的歌，然后自己笑。",
    "吃饭永远先夹给我，说自己不饿。",
    "睡着以后会说梦话，内容大多跟吃有关。",
    "每次说「随便」，其实心里已经有答案了。"
  ],

  // 那封信：每一段一个字符串
  letter: [
    "写这封信的时候，我删掉了很多开头。太正式不像我，太随便又怕你以为我不认真。",
    "其实想说的很简单：谢谢你愿意把日子分我一半。那些看起来不值一提的小事——一起吃饭、一起走夜路、一起为一件很小的事情笑很久——拼起来就是我最想要的生活。",
    "我没办法保证以后每一件事都做得对，但我可以保证，任何需要选边站的时刻，我都站在你这边。",
    "如果有一天我们老了，记性都不太好了，希望这个页面还在。它替我们记住今天。"
  ],

  // 照片墙数量（建议 6 张，手机上正好两列三行）
  photoCount: 6
};

/* ==========================================================
   以下为渲染逻辑，一般不需要改动
   ========================================================== */

const $ = (id) => document.getElementById(id);

function pad(n) {
  return String(n).padStart(2, "0");
}

/* ---------- 恋爱天数 ---------- */

const start = new Date(CONFIG.startDate);

function tick() {
  const now = new Date();
  const diff = now - start;
  if (Number.isNaN(diff) || diff < 0) return;

  const totalDays = Math.floor(diff / 86400000);
  const daysNum = $("daysNum");
  const daysInline = $("daysInline");

  if (daysNum) daysNum.textContent = totalDays.toLocaleString("en-US");
  if (daysInline) daysInline.textContent = totalDays.toLocaleString("en-US");

  const rest = diff % 86400000;
  const h = Math.floor(rest / 3600000);
  const m = Math.floor((rest % 3600000) / 60000);
  const s = Math.floor((rest % 60000) / 1000);

  if ($("hh")) $("hh").textContent = pad(h);
  if ($("mm")) $("mm").textContent = pad(m);
  if ($("ss")) $("ss").textContent = pad(s);
}

/* ---------- 时间轴 ---------- */

function renderStory() {
  const ol = $("timeline");
  if (!ol) return;

  ol.innerHTML = CONFIG.story
    .map(
      (item) => `
      <li class="t-item${item.now ? " is-now" : ""}">
        <span class="t-date">${item.date}</span>
        <h3 class="t-title">${item.title}</h3>
        <p class="t-text">${item.text}</p>
      </li>`
    )
    .join("");
}

/* ---------- 照片墙 ---------- */

function renderGallery() {
  const grid = $("gallery-grid");
  if (!grid) return;

  let html = "";
  for (let i = 1; i <= CONFIG.photoCount; i++) {
    html += `
      <figure class="shot" data-index="${pad(i)}">
        <img src="photos/${i}.jpg" alt="我们的照片 ${i}" loading="lazy" decoding="async">
      </figure>`;
  }
  grid.innerHTML = html;

  grid.querySelectorAll(".shot img").forEach((img) => {
    img.addEventListener("load", () => {
      img.classList.add("loaded");
      img.closest(".shot").classList.add("has-img");
    });
    img.addEventListener("error", () => {
      img.remove();
    });
  });
}

/* ---------- 十件小事 ---------- */

function renderLittle() {
  const ul = $("little-list");
  if (!ul) return;

  ul.innerHTML = CONFIG.little
    .map((text) => `<li class="little-item"><span class="little-text">${text}</span></li>`)
    .join("");
}

/* ---------- 信 ---------- */

function renderLetter() {
  const body = $("letter-body");
  if (body) {
    body.innerHTML = CONFIG.letter.map((p) => `<p>${p}</p>`).join("");
  }

  const d = new Date();
  const ld = $("letterDate");
  if (ld) ld.textContent = `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;

  const y = $("year");
  if (y) y.textContent = d.getFullYear();
}

/* ---------- 滚动显现 ---------- */

function observe() {
  const targets = document.querySelectorAll(".reveal, .t-item, .shot, .little-item");

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = Number(el.dataset.delay || 0);
        setTimeout(() => el.classList.add("in"), delay);
        io.unobserve(el);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach((el, i) => {
    if (el.classList.contains("shot") || el.classList.contains("little-item")) {
      el.dataset.delay = String((i % 3) * 90);
    }
    io.observe(el);
  });
}

/* ---------- 心形彩蛋 ---------- */

function burst(x, y, count = 14) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "fly-heart";
    el.textContent = "♥";
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.fontSize = 10 + Math.random() * 18 + "px";
    el.style.setProperty("--dx", (Math.random() - 0.5) * 260 + "px");
    el.style.setProperty("--dy", -(80 + Math.random() * 260) + "px");
    el.style.setProperty("--rot", (Math.random() - 0.5) * 140 + "deg");
    el.style.animationDelay = Math.random() * 0.25 + "s";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2400);
  }
}

function bindHeart() {
  const btn = $("heartBtn");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX || r.left + r.width / 2;
    const y = e.clientY || r.top + r.height / 2;
    burst(x, y);

    if (navigator.vibrate) navigator.vibrate(18);
  });
}

/* ---------- 启动 ---------- */

document.addEventListener("DOMContentLoaded", () => {
  renderStory();
  renderGallery();
  renderLittle();
  renderLetter();
  tick();
  setInterval(tick, 1000);
  observe();
  bindHeart();
});
