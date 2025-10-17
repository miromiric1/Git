/* ---------- THEME TOGGLE ---------- */
const toggleBtn = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

toggleBtn.addEventListener('click', () => {
  if(htmlEl.classList.contains('dark')){
    htmlEl.classList.replace('dark','light');
    localStorage.setItem('theme','light');
  } else {
    htmlEl.classList.replace('light','dark');
    localStorage.setItem('theme','dark');
  }
});

/* ---------- BACK TO TOP ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const backToTop = document.getElementById("back-to-top");
  if (!backToTop) return;

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });
});


/* ---------- MASONRY ANIMATION ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".masonry a");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  links.forEach((link, i) => {
    link.style.setProperty("--i", i);
    observer.observe(link);
  });
});

/* ---------- LIGHTBOX ----------  */
function initLightbox(selector) {
  const containers = document.querySelectorAll(selector);
  if (!containers.length) return;

  let overlay = document.querySelector(".lightbox-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";

    const img = document.createElement("img");
    overlay.appendChild(img);

    const caption = document.createElement("div");
    caption.className = "lightbox-caption";
    overlay.appendChild(caption);

    const nav = document.createElement("div");
    nav.className = "lightbox-nav";

    const prev = document.createElement("button");
    prev.textContent = "‹";
    const next = document.createElement("button");
    next.textContent = "›";
    nav.appendChild(prev);
    nav.appendChild(next);

    const closeBtn = document.createElement("button");
    closeBtn.className = "lightbox-close";
    closeBtn.textContent = "×";
    overlay.appendChild(closeBtn);
    overlay.appendChild(nav);

    document.body.appendChild(overlay);

    closeBtn.addEventListener("click", e => {
      e.stopPropagation();
      overlay.classList.remove("active");
    });

    overlay.addEventListener("click", e => {
      if (e.target === overlay) overlay.classList.remove("active");
    });

    // tipkovnica
    document.addEventListener("keydown", e => {
      if (!overlay.classList.contains("active")) return;
      if (e.key === "Escape") overlay.classList.remove("active");
      if (e.key === "ArrowLeft") prev.click();
      if (e.key === "ArrowRight") next.click();
    });
  }

  const img = overlay.querySelector("img");
  const caption = overlay.querySelector(".lightbox-caption");
  const prev = overlay.querySelector(".lightbox-nav button:first-child");
  const next = overlay.querySelector(".lightbox-nav button:last-child");

  containers.forEach(container => {
    const links = Array.from(container.querySelectorAll(
      "a[href='#'], a[href$='.jpg'], a[href$='.jpeg'], a[href$='.png'], a[href$='.webp'], a[href$='.gif']"
    ));
    if (!links.length) return;

    let currentIndex = 0;

    const showImage = index => {
      currentIndex = index;
      const link = links[currentIndex];
      const href = link.getAttribute("href");
      const imgEl = link.querySelector("img");

      const fullSrc = (href && href !== "#") ? href : (imgEl ? imgEl.src : "");

      if (!fullSrc) return;
      img.src = fullSrc;
      caption.textContent = imgEl ? imgEl.alt || "" : "";
      overlay.classList.add("active");
    };

    links.forEach((link, i) => {
      link.addEventListener("click", e => {
        e.preventDefault();
        showImage(i);
      });
    });

    prev.addEventListener("click", e => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + links.length) % links.length;
      showImage(currentIndex);
    });

    next.addEventListener("click", e => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % links.length;
      showImage(currentIndex);
    });
  });
}

// Inicijalizacija lightboxa
document.addEventListener("DOMContentLoaded", () => {
  initLightbox(".masonry, .project-images, [data-lightbox]");
});


/* ---------- ZAŠTITA SLIKA-- */
document.addEventListener("contextmenu", function(e) {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
  }
});

/* ---------- COOKIE BANNER DYNAMIC ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // Provjeri postoji li već cookie consent
  const choice = localStorage.getItem("cookie-consent");
  if (choice) return;

  // fetch cookie.html relativno od base href
  fetch("cookie.html")
    .then(res => {
      if (!res.ok) throw new Error("❌ cookie.html nije pronađen");
      return res.text();
    })
    .then(html => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);

      const banner = document.getElementById("cookieBanner");
      if (!banner) return;
      banner.style.display = "flex";

      const acceptBtn = document.getElementById("acceptAll");
      const necessaryBtn = document.getElementById("essentialOnly");
      const declineBtn = document.getElementById("rejectAll");

      function setConsent(value) {
        localStorage.setItem("cookie-consent", value);
        banner.style.display = "none";
        if (value === "all") enableOptionalCookies();
        else disableOptionalCookies();
      }

      acceptBtn?.addEventListener("click", () => setConsent("all"));
      necessaryBtn?.addEventListener("click", () => setConsent("necessary"));
      declineBtn?.addEventListener("click", () => setConsent("none"));
    })
    .catch(err => console.error(err));
});

// Placeholder funkcije
function enableOptionalCookies() { console.log("✅ Optional cookies enabled"); }
function disableOptionalCookies() { console.log("🚫 Optional cookies disabled"); }
