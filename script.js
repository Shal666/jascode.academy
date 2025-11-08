document.addEventListener("DOMContentLoaded", function () {
  // --- Год в футере ---
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Плавный скролл ---
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId.length > 1) {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target)
          target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // --- Кнопки "Подробнее" открывают PDF ---
  // --- Кнопки "Подробнее" с выбором уровня ---
  document.querySelectorAll(".btn-sm").forEach((btn) => {
    btn.addEventListener("click", () => {
      const direction = btn.dataset.direction;

      const pdfLinks = {
        "Roblox Studio": {
          "С нуля": "pdf/roblox_basic.pdf",
          "Продвинутый": "pdf/roblox_advanced.pdf",
        },
        "Web-разработка": {
          Junior: "pdf/web_junior.pdf",
          Middle: "pdf/web_middle.pdf",
          Senior: "pdf/web_senior.pdf",
        },
        "Этичный хакинг": "pdf/hacking.pdf",
        "Python (PyGame)": "pdf/python.pdf",
        "No-code (n8n)": "pdf/nocode.pdf",
      };

      const course = pdfLinks[direction];
      if (!course) {
        alert("План курса пока недоступен");
        return;
      }

      if (typeof course === "object") {
        showLevelModal(direction, course);
      } else {
        window.open(course, "_blank");
      }
    });
  });

  // --- Функция модалки выбора уровня ---
  function showLevelModal(courseName, levels) {
    let modal = document.getElementById("levelModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "levelModal";
      modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-box">
          <h3 id="modalTitle"></h3>
          <div class="modal-buttons"></div>
          <button class="modal-close">Закрыть</button>
        </div>
      `;
      document.body.appendChild(modal);

      const style = document.createElement("style");
      style.textContent = `
        #levelModal {
          position: fixed; inset: 0; display: flex; justify-content: center;
          align-items: center; z-index: 1000; animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from {opacity: 0; transform: scale(0.9);} to {opacity: 1; transform: scale(1);} }
        .modal-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.5);
        }
        .modal-box {
          position: relative; background: #fff; padding: 25px 30px; border-radius: 16px;
          text-align: center; box-shadow: 0 8px 25px rgba(0,0,0,0.25); max-width: 340px;
          animation: scaleUp 0.25s ease;
        }
        @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .modal-box h3 { margin-bottom: 15px; font-size: 20px; color: #111; }
        .modal-buttons button {
          margin: 8px; padding: 10px 20px; border: none; border-radius: 8px;
          cursor: pointer; background: #0077ff; color: #fff; font-weight: 500; transition: 0.25s;
        }
        .modal-buttons button:hover { background: #005ecc; transform: scale(1.05); }
        .modal-close {
          margin-top: 15px; background: transparent; border: none; color: #555;
          cursor: pointer; font-size: 14px;
        }
      `;
      document.head.appendChild(style);

      modal.querySelector(".modal-overlay").addEventListener("click", () => modal.remove());
      modal.querySelector(".modal-close").addEventListener("click", () => modal.remove());
    }

    modal.querySelector("#modalTitle").textContent = courseName;
    const btnBox = modal.querySelector(".modal-buttons");
    btnBox.innerHTML = "";

    Object.entries(levels).forEach(([level, link]) => {
      const btn = document.createElement("button");
      btn.textContent = level;
      btn.addEventListener("click", () => {
        window.open(link, "_blank");
        modal.remove();
      });
      btnBox.appendChild(btn);
    });
  }


  // --- Swiper (карусель курсов) ---
  if (typeof Swiper !== "undefined") {
    const swiper = new Swiper(".mySwiper", {
      slidesPerView: 3,
      spaceBetween: 30,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        1200: { slidesPerView: 3 },
        992: { slidesPerView: 2 },
        0: { slidesPerView: 1 },
      },
    });

    const currencySwiper = new Swiper(".currencySwiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".currencySwiper .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".currencySwiper .swiper-button-next",
        prevEl: ".currencySwiper .swiper-button-prev",
      },
    });

    const teachersSwiper = new Swiper(".teachersSwiper", {
      slidesPerView: 3,
      slidesPerGroup: 1,
      spaceBetween: 30,
      loop: true,
      grabCursor: true,
      pagination: {
        el: ".teachersSwiper .swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".teachersSwiper .swiper-button-next",
        prevEl: ".teachersSwiper .swiper-button-prev",
      },
      breakpoints: {
        1024: { slidesPerView: 3 },
        992: { slidesPerView: 2 },
        0: { slidesPerView: 1 },
      },
    });
  } else {
    console.warn("⚠️ Swiper.js не подключён. Проверь подключение.");
  }

  // --- Валидация формы ---
  const form = document.getElementById("signupForm");
  if (form) {
    const fields = {
      parentName: form.parentName,
      childName: form.childName,
      age: form.age,
      direction: form.direction,
      phone: form.phone,
      comment: form.comment,
    };

    function validate() {
      let ok = true;
      document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));

      if (!fields.parentName.value.trim()) {
        document.getElementById("err-parentName").textContent =
          "Введите имя родителя";
        ok = false;
      }
      if (!fields.childName.value.trim()) {
        document.getElementById("err-childName").textContent =
          "Введите имя ребёнка";
        ok = false;
      }
      const ageVal = Number(fields.age.value);
      if (!ageVal || ageVal < 6 || ageVal > 18) {
        document.getElementById("err-age").textContent =
          "Возраст должен быть 6–18";
        ok = false;
      }
      if (!fields.direction.value.trim()) {
        document.getElementById("err-direction").textContent =
          "Выберите направление";
        ok = false;
      }
      const phone = fields.phone.value.trim();
      if (!phone || phone.length < 7) {
        document.getElementById("err-phone").textContent =
          "Введите корректный номер";
        ok = false;
      }

      return ok;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const msgEl = document.getElementById("formMessage");

      if (!validate()) {
        if (msgEl) {
          msgEl.hidden = false;
          msgEl.textContent = "Пожалуйста, исправьте ошибки в форме.";
          msgEl.style.background = "linear-gradient(90deg,#fff4f2,#fff)";
          msgEl.style.color = "#7f1d1d";
        }
        return;
      }

      const payload = {
        parentName: fields.parentName.value.trim(),
        childName: fields.childName.value.trim(),
        age: fields.age.value,
        direction: fields.direction.value,
        phone: fields.phone.value.trim(),
        comment: fields.comment.value.trim(),
        submittedAt: new Date().toISOString(),
      };

      console.log("Signup payload:", payload);

      // --- Отправка данных в CRM ---
      const crmData = {
        childName: fields.childName.value.trim(),
        childSurname: fields.parentName.value.trim(),
        grade: Number(fields.age.value) || 0,
        phoneNumber: fields.phone.value.trim(),
        email: "",
        comment: `${fields.direction.value} | ${fields.comment.value.trim()}`,
        tenantId: 154,
        isOnline: true,
        requestSource: "jascode.kz",
        requestMedium: "website",
        requestCampagn: "landing_form",
        adGroupName: "site_form",
        adName: "signupForm",
        requestTerm: "JasCode Academy",
      };

      fetch("/api/crm-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(crmData),
      })
        .then((res) => {
          if (res.ok) {
            console.log(
              "✅ Заявка успешно прошла через прокси и отправлена в CRM"
            );
          } else {
            res.text().then(console.warn);
            console.error("⚠️ Ошибка при обращении к прокси:", res.statusText);
          }
        })
        .catch((err) => console.error("❌ Ошибка при работе прокси:", err));

      if (msgEl) {
        msgEl.hidden = false;
        msgEl.style.background = "linear-gradient(90deg,#ecfeff,#f0f9ff)";
        msgEl.style.color = "#064e3b";
        msgEl.textContent =
          "✅ Спасибо! Ваша заявка принята. Мы свяжемся с вами в течение дня.";
      }

      form.reset();
      msgEl.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // --- Мобильное меню ---
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("nav-open");

      // Меняем иконку бургера
      if (nav.classList.contains("nav-open")) {
        navToggle.innerHTML = "✕";
        navToggle.setAttribute("aria-label", "Закрыть меню");
      } else {
        navToggle.innerHTML = "☰";
        navToggle.setAttribute("aria-label", "Открыть меню");
      }
    });

    // Закрываем меню при клике на ссылку
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 900) {
          nav.classList.remove("nav-open");
          navToggle.innerHTML = "☰";
          navToggle.setAttribute("aria-label", "Открыть меню");
        }
      });
    });
  }
});
