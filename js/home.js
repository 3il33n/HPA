/* ==========================================================================
   home.js — 首页交互：校规折叠 / 抽选 / 机密档案 / 绝望影片 / 接管终幕
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     校规第 15 条折叠
     --------------------------------------------------------------------- */
  const ruleTrigger = document.querySelector("[data-rule-trigger]");
  const rulePanel = document.getElementById("rule15-content");

  if (ruleTrigger && rulePanel) {
    ruleTrigger.addEventListener("click", () => {
      const open = ruleTrigger.getAttribute("aria-expanded") === "true";
      ruleTrigger.setAttribute("aria-expanded", String(!open));
      rulePanel.dataset.open = String(!open);
    });
  }

  /* ---------------------------------------------------------------------
     命运抽选
     --------------------------------------------------------------------- */
  const drawButton = document.querySelector("[data-draw]");
  const drawOutput = document.getElementById("drawResult");

  const drawEntries = [
    { text: "超高校级的幸运", hint: "才能审查委员会：留校察看", tone: "normal" },
    { text: "超高校级的侦探", hint: "与第 16 号密室事件存在关联", tone: "normal" },
    { text: "超高校级的黑客", hint: "校园网络访问权限已临时冻结", tone: "normal" },
    { text: "超高校级的绝望？", hint: "该分类不在学园正式名录中", tone: "danger" },
    { text: "超高校级的游戏玩家", hint: "与某位在校生档案高度重合", tone: "normal" },
    { text: "超高校级的侦探", hint: "档案编号重复，正在人工复核", tone: "normal" },
    { text: "超高校级的偶像", hint: "媒体曝光度超出学园管理阈值", tone: "normal" },
    { text: "超高校级的骗子", hint: "申报材料可信度：无法验证", tone: "danger" },
    { text: "超高校级的护士", hint: "医务室使用记录异常", tone: "normal" },
    { text: "超高校级的？？？", hint: "数据被学园长加密", tone: "glitch" },
    { text: "危险度 A 级", hint: "详情请至监视室核实", tone: "danger" },
    { text: "超高校级的？？？", hint: "才能分类无法识别", tone: "glitch" },
    { text: "审核中……", hint: "系统发生错误", tone: "glitch" },
    { text: "超高校级的幸存者", hint: "此条目不应出现在名单中", tone: "danger" },
    { text: "相似度 92%", hint: "与『江之岛盾子』档案比对结果", tone: "danger" },
    { text: "你的数据正在被解析", hint: "来源：新世界程序", tone: "glitch" },
    { text: "才能：无", hint: "系统混乱，结果不予采信", tone: "glitch" },
  ];

  if (drawButton && drawOutput) {
    let drawTimer = 0;

    drawButton.addEventListener("click", () => {
      window.clearTimeout(drawTimer);

      drawOutput.hidden = false;
      drawOutput.dataset.tone = "progress";
      drawOutput.innerHTML =
        "审查中<span class=\"draw-result__hint\">正在比对称号数据库…</span>";

      const entry = drawEntries[Math.floor(Math.random() * drawEntries.length)];

      drawTimer = window.setTimeout(() => {
        drawOutput.dataset.tone = entry.tone;
        drawOutput.innerHTML =
          "抽选结果：<strong>" +
          entry.text +
          "</strong>" +
          '<span class="draw-result__hint">' +
          entry.hint +
          "</span>";
        drawOutput.animate(
          [
            { opacity: 0, transform: "translateY(6px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 260, easing: "cubic-bezier(0.22,0.68,0.18,1)" }
        );
      }, 620);
    });

    drawOutput.hidden = true;
  }

  /* ---------------------------------------------------------------------
     机密档案：密码门 + 故障接管
     --------------------------------------------------------------------- */
  const SECRET_PASSWORD = "11037";
  const secretModal = document.getElementById("secretModal");
  const secretGate = document.getElementById("secretGate");
  const secretDoc = document.getElementById("secretDoc");
  const passwordInput = document.getElementById("secretPassword");
  const passwordError = document.getElementById("secretError");
  const secretForm = document.getElementById("secretForm");

  const SECRET_DOCUMENT = [
    "神座出流计划：学园从创立之初就以培养出拥有人类一切才能的代表全世界人类「真正的希望」的「超高校级的希望」为目标，以学园创立者神座出流的名字命名的该计划从学院建立之初即开始实施。",
    "学校在培养各个领域的栋梁时，也在秘密地研究这些过人才能的秘密。由于研究资金的缺乏而开设了预备学科——表面上看是通过普通考试进入学园的学霸中的学霸、可能将来会觉醒超高校级才能的预备役，实际上是只要交够足够的学费即可进入学园。",
    "相当一大部分学生因为憧憬希望之峰学园而选择了预备学科，这也为研究提供了大量的资金。",
    "在研究告一段落后，希望之峰学园决定从预备学科中找一个毫无才能、牺牲了也不可惜的学生日向创进行人体试验。在他自信受挫后同意配合的前提下，我们对这个学生的大脑直接进行了改造，剔除了所有影响获取才能的感情与人格。这名学生也从此成为拥有各种超高校级才能，被称为「超高校级的希望」的神座出流。希望之峰学园一直对此秘而不宣，就连在校学生也仅仅知道神座出流这个名字。",
  ];

  function resetSecretModal() {
    if (!secretModal) return;
    secretGate.hidden = false;
    secretDoc.hidden = true;
    secretModal.classList.remove("modal--wide");
    if (secretForm) secretForm.reset();
    if (passwordError) passwordError.classList.remove("is-shown");
  }

  function unlockSecret() {
    secretGate.hidden = true;
    secretDoc.hidden = false;
    secretModal.classList.add("modal--wide");
    if (passwordError) passwordError.classList.remove("is-shown");

    const target = secretDoc.querySelector("[data-secret-body]");
    target.replaceChildren(
      ...SECRET_DOCUMENT.map((paragraph) => {
        const p = document.createElement("p");
        p.textContent = paragraph;
        return p;
      })
    );

    window.setTimeout(() => {
      const closeButton = secretModal.querySelector(".modal__close");
      closeButton?.focus({ preventScroll: true });
    }, 80);
  }

  if (secretModal) {
    secretModal.addEventListener("modal:open", resetSecretModal);
  }

  if (secretForm) {
    secretForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = (passwordInput?.value || "").trim();

      if (value === SECRET_PASSWORD) {
        unlockSecret();
        return;
      }

      passwordError?.classList.add("is-shown");
      passwordInput?.select();
    });
  }

  /* ---------------------------------------------------------------------
     从机密档案跳转到绝望影片
     --------------------------------------------------------------------- */
  document.querySelectorAll("[data-open-despair]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const dialog = trigger.closest(".modal");
      window.HPA.closeModal(dialog);
      window.setTimeout(() => {
        window.HPA.openModal(document.getElementById("despairModal"));
      }, 180);
    });
  });

  /* ---------------------------------------------------------------------
     绝望影片：观看累计满 CUTOFF_SECONDS 秒后强行切断访问
     无论从确认按钮还是播放器原生控件开始播放，都同样计入观看时长
     --------------------------------------------------------------------- */
  const despairButton = document.querySelector("[data-despair-play]");
  const despairVideo = document.getElementById("zvVideo");
  const despairModal = document.getElementById("despairModal");
  const videoStatus = document.getElementById("videoStatus");
  const CUTOFF_SECONDS = 12;
  const TICK_MS = 200;

  if (despairButton && despairVideo) {
    let watched = 0;        // 已观看的影片秒数
    let lastTime = 0;       // 上一次采样到的播放位置
    let seeking = false;    // 是否正在拖动进度条
    let cutOff = false;
    let acknowledged = false; // 是否点过「我理解风险并播放」
    let unauthorized = false; // 是否绕过风险确认直接播放
    let ticker = 0;

    const setStatus = (state, label) => {
      if (!videoStatus) return;
      videoStatus.dataset.state = state;
      const text = videoStatus.querySelector(".video-status__label");
      if (text) text.textContent = label;
    };

    const markPlaying = () => {
      document.body.classList.add("is-despair");
      despairButton.disabled = true;
      despairButton.textContent = "播放中 · 无法暂停或跳过";
      setStatus("playing", "REC · 正在播放 · 无法暂停");
    };

    const markStopped = (label) => {
      if (cutOff) return;
      document.body.classList.remove("is-despair");
      despairButton.disabled = false;
      despairButton.textContent = label;
      setStatus("idle", "待播放 · 需确认后开始");
    };

    // 按播放位置采样，不依赖 timeupdate 的触发频率
    const tick = () => {
      if (cutOff) return;

      const now = despairVideo.currentTime;
      if (!despairVideo.paused && !despairVideo.ended && !seeking) {
        const delta = now - lastTime;
        if (delta > 0) {
          // 播放倍速不影响"观看的影片秒数"的换算
          watched += delta / (despairVideo.playbackRate || 1);
        }
      }
      lastTime = now;

      if (watched >= CUTOFF_SECONDS) {
        cutOff = true;
        despairVideo.pause();
        window.clearInterval(ticker);
        ticker = 0;
        // 保留弹窗，让故障层直接撕裂正在播放的画面
        startTakeover(
          unauthorized ? "检测到未经风险确认的播放行为。" : null
        );
      }
    };

    const startClock = () => {
      if (!ticker) ticker = window.setInterval(tick, TICK_MS);
    };

    const stopClock = () => {
      window.clearInterval(ticker);
      ticker = 0;
    };

    // 任何来源的播放都进入绝望状态（含播放器原生控件）
    despairVideo.addEventListener("play", () => {
      if (cutOff) return;
      if (!acknowledged) unauthorized = true;
      markPlaying();
      lastTime = despairVideo.currentTime;
      startClock();
    });

    despairVideo.addEventListener("pause", () => {
      if (cutOff) return;
      stopClock();
      markStopped("继续播放");
    });

    despairVideo.addEventListener("ended", () => {
      stopClock();
      markStopped("再次观看");
    });

    despairVideo.addEventListener("seeking", () => {
      seeking = true;
    });

    despairVideo.addEventListener("seeked", () => {
      seeking = false;
      // 跳转后的位置作为新的基准，跳过的片段不计入观看时长
      lastTime = despairVideo.currentTime;
    });

    // 播放期间彻底剥夺用户对播放器的操作
    despairVideo.addEventListener("contextmenu", (event) => event.preventDefault());
    despairVideo.addEventListener("click", (event) => event.preventDefault());
    despairVideo.addEventListener("dblclick", (event) => event.preventDefault());
    despairVideo.addEventListener("keydown", (event) => {
      const keys = [" ", "k", "j", "l", "Home", "End", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
      if (keys.includes(event.key)) event.preventDefault();
    });

    // 确认按钮：先给出风险警告，再交给统一的播放逻辑
    despairButton.addEventListener("click", () => {
      if (!despairVideo.paused) {
        acknowledged = true;
        return;
      }

      const confirmed = window.confirm(
        "警告：此影片包含强烈的绝望暗示内容。\n\n继续播放可能导致不可逆的心理影响。\n\n确定要继续吗？"
      );
      if (!confirmed) return;

      acknowledged = true;
      const attempt = despairVideo.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(() => {
          acknowledged = false;
          markStopped("手动开始播放");
        });
      }
    });

    // 每次打开影片弹窗都重新计时
    despairModal?.addEventListener("modal:open", () => {
      stopClock();
      watched = 0;
      lastTime = despairVideo.currentTime;
      seeking = false;
      cutOff = false;
      acknowledged = false;
      unauthorized = false;
      document.body.classList.remove("is-despair");
      despairButton.disabled = false;
      despairButton.textContent = "我理解风险并确认播放";
      setStatus("idle", "待播放 · 需确认后开始");
    });

    despairModal?.addEventListener("modal:close", stopClock);
  }

  /* ---------------------------------------------------------------------
     故障接管终幕
     --------------------------------------------------------------------- */
  const takeover = document.getElementById("takeover");
  const takeoverText = document.getElementById("takeoverText");
  const kumaLaugh = document.getElementById("kumaLaugh");
  const BASE_LINES = [
    "【连接中断】",
    "你未经授权看到了不该看的东西。",
    "希望之峰学园不会允许泄露任何真相。",
    "你的位置已被学园长定位。",
    "——终止访问。",
  ];

  let takeoverStarted = false;
  let takeoverNote = null;

  function startTakeover(note) {
    if (!takeover || !takeoverText) return;
    if (takeoverStarted) return;
    takeoverStarted = true;
    takeoverNote = note || null;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const glitchMs = reduceMotion ? 0 : 5200;

    document.body.classList.add("is-glitching");
    document.documentElement.style.overflow = "hidden";

    // 关掉弹窗与遮罩，让被扭曲的是真正的页面而不是黑底
    document.querySelectorAll(".modal.is-open").forEach((modal) => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      const video = modal.querySelector("video");
      if (video && !video.paused) video.pause();
    });
    document.body.style.overflow = "";

    const overlay = document.createElement("div");
    overlay.className = "glitch-overlay";
    overlay.setAttribute("aria-hidden", "true");
    document.body.appendChild(overlay);

    // 参与扭曲的整页区块
    const blocks = Array.from(
      document.querySelectorAll(
        ".site-nav, .site-header, .marquee, .section, .site-footer"
      )
    );

    let raf = 0;
    let safety = 0;
    const began = performance.now();

    const drawGlitch = (now) => {
      const elapsed = now - began;
      const progress = Math.min(elapsed / Math.max(glitchMs, 1), 1);
      // 越接近切断，扭曲越剧烈
      const intensity = Math.pow(progress, 1.7);
      const frame = [];

      // ---- 整页区块的 3D 扭曲：每块各自位移、旋转、缩放、撕裂 ----
      blocks.forEach((block) => {
        const dir = Math.random() > 0.5 ? 1 : -1;
        const shiftX = (Math.random() - 0.5) * intensity * 320;
        const shiftY = (Math.random() - 0.5) * intensity * 110;
        const rot = (Math.random() - 0.5) * intensity * 16;
        const skew = (Math.random() - 0.5) * intensity * 26;
        const scaleX = 1 + (Math.random() - 0.5) * intensity * 0.4;
        const scaleY = 1 + (Math.random() - 0.5) * intensity * 0.26;
        const clipTop = Math.random() * intensity * 22;
        const clipRight = Math.random() * intensity * 20;
        const clipBottom = Math.random() * intensity * 22;
        const clipLeft = Math.random() * intensity * 20;

        block.style.transform =
          `perspective(700px) translate3d(${shiftX}px, ${shiftY}px, 0) ` +
          `rotate(${rot}deg) skewX(${skew}deg) scale(${scaleX}, ${scaleY})`;
        // 大块缺口，让页面看起来被啃掉几块
        block.style.clipPath =
          intensity > 0.12
            ? `polygon(0 0, 100% 0, 100% ${100 - clipBottom}%, ${
                Math.random() > 0.5 ? `${100 - clipRight}% 100%,` : "100% 100%,"
              } 0 100%, 0 ${clipTop}%)`
            : "none";
        block.style.opacity = String(1 - Math.random() * intensity * 0.45);
        block.style.filter =
          `contrast(${1.2 + intensity * 2.1}) brightness(${1 + intensity * 0.65}) ` +
          `saturate(${1.4 + Math.random() * intensity * 3.2}) ` +
          `hue-rotate(${dir * intensity * 42}deg)`;
      });

      // ---- 扫描线 ----
      const lineCount = Math.round(8 + intensity * 28);
      for (let i = 0; i < lineCount; i += 1) {
        frame.push(
          `<div style="position:absolute;top:${Math.random() * 100}%;left:0;width:100%;height:${
            Math.random() * (2 + intensity * 8) + 1
          }px;background:rgba(255,255,255,${Math.random() * 0.12 * intensity})"></div>`
        );
      }

      // ---- 红/青错位色块 ----
      const tearCount = Math.round(3 + intensity * 18);
      for (let i = 0; i < tearCount; i += 1) {
        const hue = Math.random() > 0.5 ? "255,0,48" : "0,190,255";
        frame.push(
          `<div style="position:absolute;top:${Math.random() * 100}%;left:${Math.random() * 45}%;width:${
            Math.random() * 45 + 8
          }%;height:${Math.random() * (18 + intensity * 52) + 4}px;background:rgba(${hue},${
            0.08 + intensity * 0.55
          });transform:translateX(${(Math.random() - 0.5) * intensity * 180}px)"></div>`
        );
      }

      // ---- 明亮横贯撕裂线 ----
      if (Math.random() > 0.35) {
        const bars = 1 + Math.round(intensity * 3);
        for (let i = 0; i < bars; i += 1) {
          frame.push(
            `<div style="position:absolute;top:${Math.random() * 100}%;left:0;width:100%;height:${
              Math.random() * 4 + 1
            }px;background:rgba(255,255,255,${0.25 + intensity * 0.6});box-shadow:0 0 ${
              8 + intensity * 24
            }px rgba(255,255,255,0.85)"></div>`
          );
        }
      }

      // ---- 后段：血色浸染（不再用纯黑/纯白闪屏） ----
      if (progress > 0.5) {
        const bleed = (progress - 0.5) / 0.5;
        frame.push(
          `<div style="position:absolute;inset:0;background:radial-gradient(circle at ${
            Math.random() * 100
          }% ${Math.random() * 100}%, rgba(165,0,14,${0.26 * bleed}), transparent 66%)"></div>`
        );
      }

      overlay.innerHTML = frame.join("");

      if (elapsed < glitchMs) {
        raf = requestAnimationFrame(drawGlitch);
      } else {
        finish();
      }
    };

    // 后台标签页会暂停 rAF，用定时器兜底，保证终幕一定出现
    safety = window.setTimeout(finish, glitchMs + 1200);

    let finished = false;

    const resetBlocks = () => {
      blocks.forEach((block) => {
        block.style.transform = "";
        block.style.clipPath = "";
        block.style.opacity = "";
        block.style.filter = "";
      });
    };

    function finish() {
      if (finished) return;
      finished = true;

      window.clearTimeout(safety);
      cancelAnimationFrame(raf);
      resetBlocks();
      overlay.remove();
      document.body.classList.remove("is-glitching", "is-despair");
      document.body.classList.add("is-takeover");
      document.body.style.filter = "";

      // 收掉残留弹窗，避免与终幕叠层
      document.querySelectorAll(".modal.is-open").forEach((modal) => {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        const video = modal.querySelector("video");
        if (video && !video.paused) video.pause();
      });
      document.body.style.overflow = "";

      takeover.hidden = false;
      takeover.focus?.({ preventScroll: true });
      playKumaLaugh();
      typeFinal();

      // 终幕铺满后再撤掉故障层，避免中间闪出空白
      window.setTimeout(() => overlay.remove(), 120);
    }

    // 黑白熊笑声：随终幕文案一起响起
    function playKumaLaugh() {
      if (!kumaLaugh) return;
      try {
        kumaLaugh.currentTime = 0;
        kumaLaugh.volume = 0.85;
        const attempt = kumaLaugh.play();
        if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
      } catch (error) {
        /* 浏览器禁止自动播放时静默跳过 */
      }
    }

    function typeFinal() {
      takeoverText.textContent = "";
      takeoverText.classList.add("is-jittering");
      const caret = document.createElement("span");
      caret.className = "takeover__caret";
      takeoverText.appendChild(caret);

      const lines = takeoverNote
        ? BASE_LINES.slice(0, 1).concat(BASE_LINES[1], takeoverNote, ...BASE_LINES.slice(2))
        : BASE_LINES;
      const finalText = lines.join("\n");

      let index = 0;
      const speed = reduceMotion ? 0 : 52;

      const step = () => {
        if (index >= finalText.length) {
          window.setTimeout(() => {
            caret.remove();
          }, 2600);
          return;
        }
        caret.insertAdjacentText("beforebegin", finalText[index]);
        index += 1;
        window.setTimeout(step, speed);
      };

      step();
      document.title = "访问已终止";
    }

    if (glitchMs === 0) {
      finish();
    } else {
      raf = requestAnimationFrame(drawGlitch);
    }
  }
})();
