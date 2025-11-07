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
  document.querySelectorAll(".btn-sm").forEach((btn) => {
    btn.addEventListener("click", () => {
      const direction = btn.dataset.direction;

      const pdfLinks = {
        "Roblox Studio": "pdf/roblox.pdf",
        "Web-разработка": "pdf/web.pdf",
        "Этичный хакинг": "pdf/hacking.pdf",
        "Python (PyGame)": "pdf/python.pdf",
        "No-code (n8n)": "pdf/nocode.pdf",
      };

      const pdf = pdfLinks[direction];
      if (pdf) {
        window.open(pdf, "_blank");
      } else {
        alert("План курса пока недоступен");
      }
    });
  });

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
        childSurname: fields.parentName.value.trim(), // фамилия = имя родителя
        grade: Number(fields.age.value) || 0,
        phoneNumber: fields.phone.value.trim(),
        email: "",
        comment: `${fields.direction.value} | ${fields.comment.value.trim()}`,
        tenantId: 154,
        isOnline: false,
        requestSource: "site",
        requestMedium: "web",
        requestCampagn: "jascode site",
        adGroupName: "landing form",
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
