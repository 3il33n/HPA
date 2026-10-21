/* ==========================================================================
   apply.js — 入学申请：实时校验 / 完成度 / 提交回执
   ========================================================================== */
(function () {
  "use strict";

  const form = document.getElementById("admissionForm");
  if (!form) return;

  const ring = document.getElementById("progressRing");
  const ringValue = document.getElementById("progressValue");
  const submitButton = document.getElementById("submitButton");
  const receiptModal = document.getElementById("receiptModal");

  const MIN_TEXT = 20;

  /* 校验规则：字段名 -> 返回错误信息或 null */
  const RULES = {
    fullName: (value) => (value.trim().length >= 2 ? null : "请填写你的全名。"),
    birthDate: (value) => {
      if (!value) return "请填写有效的出生日期。";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "请填写有效的出生日期。";
      const age = (Date.now() - date.getTime()) / (365.25 * 24 * 3600 * 1000);
      if (age < 5 || age > 100) return "该出生日期不在受理范围内。";
      return null;
    },
    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
        ? null
        : "请填写有效的电子邮箱地址。",
    phone: (value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15
        ? null
        : "请填写有效的联系电话。";
    },
    address: (value) => (value.trim().length >= 5 ? null : "请填写你的居住地址。"),
    talent: (value) => (value.trim().length >= 2 ? null : "请填写你的才能称号。"),
    talentProof: (value) =>
      value.trim().length >= MIN_TEXT
        ? null
        : `请提供至少 ${MIN_TEXT} 字的才能证明。`,
    motivation: (value) =>
      value.trim().length >= MIN_TEXT
        ? null
        : `请填写至少 ${MIN_TEXT} 字的申请理由。`,
    agreeTerms: (value, field) =>
      field.checked ? null : "请勾选此项以继续。",
  };

  const requiredFields = Object.keys(RULES).map((name) => form.elements[name]).filter(Boolean);

  /* ---------------------------------------------------------------------
     校验呈现
     --------------------------------------------------------------------- */
  function fieldWrapper(name) {
    return form.querySelector(`[data-error-for="${name}"]`);
  }

  function showError(name, message) {
    const error = fieldWrapper(name);
    if (!error) return;
    error.textContent = message;
    error.classList.add("is-shown");
    error.closest(".field")?.classList.add("has-error");
  }

  function clearError(name) {
    const error = fieldWrapper(name);
    if (!error) return;
    error.classList.remove("is-shown");
    error.closest(".field")?.classList.remove("has-error");
  }

  function validateField(name, { silent = false } = {}) {
    const field = form.elements[name];
    if (!field) return true;

    const rule = RULES[name];
    const message = typeof rule === "function" ? rule(field.value, field) : null;

    if (message) {
      if (!silent) showError(name, message);
      return false;
    }

    clearError(name);
    return true;
  }

  function validateAll() {
    let firstInvalid = null;

    requiredFields.forEach((field) => {
      const ok = validateField(field.name);
      if (!ok && !firstInvalid) firstInvalid = field;
    });

    return firstInvalid;
  }

  /* ---------------------------------------------------------------------
     完成度
     --------------------------------------------------------------------- */
  function updateProgress() {
    const total = requiredFields.length;
    const done = requiredFields.filter((field) => {
      const rule = RULES[field.name];
      return typeof rule === "function" && rule(field.value, field) === null;
    }).length;

    const percent = total ? Math.round((done / total) * 100) : 0;

    if (ring) ring.style.setProperty("--p", String(percent));
    if (ringValue) ringValue.textContent = `${percent}%`;

    if (ring) {
      ring.setAttribute("aria-label", `必填项完成度 ${percent}%`);
      ring.setAttribute("role", "img");
    }
  }

  /* ---------------------------------------------------------------------
     事件绑定
     --------------------------------------------------------------------- */
  requiredFields.forEach((field) => {
    const name = field.name;

    field.addEventListener("blur", () => {
      if (field.value || field.type === "checkbox") validateField(name);
    });

    field.addEventListener("input", () => {
      clearError(name);
      updateProgress();
    });

    field.addEventListener("change", () => {
      clearError(name);
      updateProgress();
    });

    field.addEventListener("invalid", (event) => {
      event.preventDefault();
      validateField(name);
    });
  });

  updateProgress();

  /* ---------------------------------------------------------------------
     提交
     --------------------------------------------------------------------- */
  let submitted = false;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const firstInvalid = validateAll();

    if (firstInvalid) {
      firstInvalid.focus({ preventScroll: true });
      firstInvalid.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    if (submitted) return;
    submitted = true;
    submitButton.disabled = true;
    submitButton.textContent = "正在封存材料…";

    const name = form.elements.fullName.value.trim();
    const talent = form.elements.talent.value.trim();

    const serial = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");

    window.setTimeout(() => {
      document.getElementById("receiptId").textContent = `HP-078-${serial}`;
      document.getElementById("receiptName").textContent = name;
      document.getElementById("receiptTalent").textContent = talent;
      document.getElementById("receiptDate").textContent = new Date().toLocaleDateString(
        "zh-CN",
        { year: "numeric", month: "2-digit", day: "2-digit" }
      );

      window.HPA.openModal(receiptModal);

      submitButton.disabled = false;
      submitButton.innerHTML =
        '提交申请 <span class="btn__arrow" aria-hidden="true">→</span>';
      submitted = false;
    }, 900);
  });

  /* 回执关闭后重置 */
  receiptModal?.addEventListener("modal:close", () => {
    form.reset();
    submitted = false;
    submitButton.disabled = false;
    submitButton.innerHTML =
      '提交申请 <span class="btn__arrow" aria-hidden="true">→</span>';
    requiredFields.forEach((field) => clearError(field.name));
    updateProgress();
  });

  document.getElementById("receiptReturn")?.addEventListener("click", () => {
    window.location.href = "index.html";
  });
})();
