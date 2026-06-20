document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("background-music");
  const yt = document.getElementById("youtube-video");

  const musicToggle = document.getElementById("musicToggle");
  const uiToggle = document.getElementById("uiToggle");
  const revealTap = document.getElementById("revealTap");

  const progressEl = document.getElementById("progress");
  const pctEl = document.getElementById("progressPct");
  const subEl = document.getElementById("progressSub");

  let isPlaying = true;

  function ytCmd(func) {
    try {
      yt?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: "" }), "*");
    } catch (e) {}
  }

  function setMusicUI() {
    if (!musicToggle) return;
    if (isPlaying) {
      musicToggle.classList.remove("muted");
      musicToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i><span>MUSIC</span>';
    } else {
      musicToggle.classList.add("muted");
      musicToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i><span>MUTED</span>';
    }
  }

  function setPlaying(next) {
    isPlaying = next;
    if (isPlaying) {
      music?.play?.();
      ytCmd("playVideo");
    } else {
      music?.pause?.();
      ytCmd("pauseVideo");
    }
    setMusicUI();
  }

  // MUSIC toggle
  musicToggle?.addEventListener("click", () => setPlaying(!isPlaying));
  setMusicUI();

  // UI hide/show
  function setUiCollapsed(collapsed) {
    document.body.classList.toggle("ui-collapsed", collapsed);

    if (uiToggle) {
      if (collapsed) {
        uiToggle.innerHTML = '<i class="fa-solid fa-eye"></i><span>SHOW UI</span>';
      } else {
        uiToggle.innerHTML = '<i class="fa-solid fa-eye-slash"></i><span>HIDE UI</span>';
      }
    }
  }

  uiToggle?.addEventListener("click", () => {
    setUiCollapsed(!document.body.classList.contains("ui-collapsed"));
  });

  revealTap?.addEventListener("click", () => setUiCollapsed(false));

  document.addEventListener("keydown", (e) => {
    if (e.code === "KeyH") setUiCollapsed(!document.body.classList.contains("ui-collapsed"));
  });

  // FiveM progress (works with your existing postMessage)
  window.addEventListener("message", (e) => {
    if (e.data?.eventName === "loadProgress") {
      const frac = Math.max(0, Math.min(1, Number(e.data.loadFraction) || 0));
      const pct = Math.round(frac * 100);

      if (progressEl) progressEl.style.width = pct + "%";
      if (pctEl) pctEl.textContent = pct + "%";

      if (subEl) {
        if (pct < 20) subEl.textContent = "Initializing…";
        else if (pct < 45) subEl.textContent = "Loading assets…";
        else if (pct < 70) subEl.textContent = "Streaming map…";
        else if (pct < 95) subEl.textContent = "Syncing player data…";
        else subEl.textContent = "Joining server…";
      }
    }
  });
});
