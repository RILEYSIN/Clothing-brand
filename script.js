const header = document.querySelector(".site-header");
const bagLink = document.querySelector(".bag-link");
const addButtons = document.querySelectorAll(".add-to-bag");
const navLinks = document.querySelectorAll(".nav-links a, .hero-btn");

let bagCount = 0;

addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    bagCount += 1;
    bagLink.textContent = `BAG [${bagCount}]`;
    button.textContent = "ADDED";

    window.setTimeout(() => {
      button.textContent = "ADD TO BAG";
    }, 700);
  });
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || !targetId.startsWith("#")) {
      return;
    }

    event.preventDefault();
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
});

// Coming-soon track: pause animation on user interaction and allow manual scroll,
// then resume auto-scroll after a short idle period.
const comingTrack = document.querySelector(".coming-soon-track");
if (comingTrack) {
  let resumeTimer = null;
  const RESUME_DELAY = 2500; // ms after last interaction to resume

  function pauseAuto() {
    comingTrack.classList.add("user-interacting");
    comingTrack.style.animationPlayState = "paused";
    if (resumeTimer) {
      clearTimeout(resumeTimer);
      resumeTimer = null;
    }
  }

  function scheduleResume() {
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      comingTrack.classList.remove("user-interacting");
      comingTrack.style.animationPlayState = "";
      resumeTimer = null;
    }, RESUME_DELAY);
  }

  ["pointerdown", "touchstart", "wheel", "mouseenter"].forEach((ev) => {
    comingTrack.addEventListener(
      ev,
      (e) => {
        pauseAuto();
      },
      { passive: true },
    );
  });

  ["pointerup", "touchend", "mouseleave"].forEach((ev) => {
    comingTrack.addEventListener(ev, () => {
      scheduleResume();
    });
  });

  // For scroll interactions (touch/mouse), pause while scrolling, then resume
  let isScrolling;
  comingTrack.addEventListener(
    "scroll",
    () => {
      pauseAuto();
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        scheduleResume();
      }, 250);
    },
    { passive: true },
  );
}
