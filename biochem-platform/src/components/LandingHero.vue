<script setup>
import { ref, onMounted } from 'vue'

const isVisible = ref(false)
const cardHover = ref(false)
const btnHover = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    isVisible.value = true
  })
})
</script>

<template>
  <section class="landing-hero">
    <!-- Ambient decorative blobs -->
    <div class="hero-blobs" aria-hidden="true">
      <div class="blob blob--1"></div>
      <div class="blob blob--2"></div>
      <div class="blob blob--3"></div>
    </div>

    <!-- ===== TOP NAVBAR ===== -->
    <nav
      class="hero-nav"
      :class="{ 'is-visible': isVisible }"
    >
      <!-- Left: Back / Reset -->
      <button class="nav-icon-btn" aria-label="Back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5C368" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      </button>

      <!-- Center: Progress bar -->
      <div class="nav-progress">
        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{ width: isVisible ? '35%' : '0%' }"
          ></div>
        </div>
        <span class="progress-label">3 / 8</span>
      </div>

      <!-- Right: Fullscreen -->
      <button class="nav-icon-btn" aria-label="Fullscreen">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5C368" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      </button>
    </nav>

    <!-- ===== MAIN HERO CARD ===== -->
    <div
      class="hero-card-wrapper"
      :class="{ 'is-visible': isVisible }"
    >
      <div
        class="hero-card"
        :class="{ 'is-hovered': cardHover }"
        @mouseenter="cardHover = true"
        @mouseleave="cardHover = false"
      >
        <!-- LEFT / TOP: Animation placeholder -->
        <div class="hero-media">
          <div class="media-gradient">
            <!-- Texture overlay -->
            <div class="media-texture" aria-hidden="true"></div>

            <!-- Decorative inline SVG molecules -->
            <svg class="media-mol media-mol--1" viewBox="0 0 80 80" fill="none" aria-hidden="true">
              <circle cx="40" cy="28" r="11" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.35)" stroke-width="2"/>
              <circle cx="22" cy="56" r="8" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.28)" stroke-width="2"/>
              <circle cx="58" cy="56" r="8" fill="rgba(255,255,255,.12)" stroke="rgba(255,255,255,.28)" stroke-width="2"/>
              <line x1="34" y1="38" x2="26" y2="49" stroke="rgba(255,255,255,.28)" stroke-width="2.5" stroke-linecap="round"/>
              <line x1="46" y1="38" x2="54" y2="49" stroke="rgba(255,255,255,.28)" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
            <svg class="media-mol media-mol--2" viewBox="0 0 60 60" fill="none" aria-hidden="true">
              <circle cx="30" cy="30" r="8" fill="rgba(255,255,255,.16)" stroke="rgba(255,255,255,.3)" stroke-width="2"/>
              <circle cx="10" cy="30" r="5" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.22)" stroke-width="2"/>
              <circle cx="50" cy="30" r="5" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.22)" stroke-width="2"/>
              <line x1="20" y1="30" x2="15" y2="30" stroke="rgba(255,255,255,.22)" stroke-width="2" stroke-linecap="round"/>
              <line x1="40" y1="30" x2="45" y2="30" stroke="rgba(255,255,255,.22)" stroke-width="2" stroke-linecap="round"/>
            </svg>

            <!-- Central Play button -->
            <button class="play-btn" aria-label="Play animation">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="none">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            </button>
          </div>
        </div>

        <!-- RIGHT / BOTTOM: Text content -->
        <div class="hero-content">
          <h1 class="hero-title">生化学习中心</h1>
          <p class="hero-subtitle">
            将任意主题转化为生动的黏土动画信息图。
          </p>

          <!-- CTA Button -->
          <router-link
            to="/pathways"
            class="hero-cta"
            @mouseenter="btnHover = true"
            @mouseleave="btnHover = false"
          >
            <!-- Sparkle inline SVG -->
            <svg
              class="cta-sparkle"
              :class="{ 'is-hovered': btnHover }"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3F2E12"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 2l1.09 3.26L16 6l-2.91.74L12 10l-1.09-3.26L8 6l2.91-.74L12 2z" />
              <path d="M5 15l.55 1.63L7 17.18l-1.45.37L5 19.18l-.55-1.63L3 17.18l1.45-.37L5 15z" />
              <path d="M19 11l.55 1.63L21 13.18l-1.45.37L19 15.18l-.55-1.63L17 13.18l1.45-.37L19 11z" />
            </svg>
            <span>开始</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Bottom decorative wave -->
    <div class="hero-wave" aria-hidden="true">
      <svg viewBox="0 0 1440 48" fill="none" preserveAspectRatio="none">
        <path d="M0 48 Q360 0,720 24 Q1080 48,1440 12 L1440 48Z" fill="#2A1E0B" opacity=".5"/>
      </svg>
    </div>
  </section>
</template>

<style scoped>
/* ===== ROOT ===== */
.landing-hero {
  font-family: "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  background: #3F2E12;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  line-height: 1.5;
}

/* ===== AMBIENT BLOBS ===== */
.hero-blobs {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.14;
}

.blob--1 {
  width: 280px;
  height: 280px;
  background: #F5C368;
  top: -70px;
  left: -50px;
  animation: blobDrift1 12s ease-in-out infinite;
}

.blob--2 {
  width: 220px;
  height: 220px;
  background: #D48B2E;
  bottom: -50px;
  right: -30px;
  animation: blobDrift2 15s ease-in-out infinite;
}

.blob--3 {
  width: 180px;
  height: 180px;
  background: #A0713C;
  top: 45%;
  right: 8%;
  animation: blobDrift3 10s ease-in-out infinite;
}

@keyframes blobDrift1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(25px, 18px) scale(1.08); }
  66% { transform: translate(-12px, 30px) scale(0.95); }
}

@keyframes blobDrift2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-20px, -12px) scale(1.05); }
  66% { transform: translate(18px, -25px) scale(0.92); }
}

@keyframes blobDrift3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-18px, 22px) scale(1.06); }
}

/* ===== NAV BAR ===== */
.hero-nav {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 16px 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 10;
  opacity: 0;
  transform: translateY(-12px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.hero-nav.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.nav-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid rgba(122, 94, 58, 0.35);
  border-radius: 16px;
  background: rgba(92, 70, 43, 0.5);
  cursor: pointer;
  transition: background 0.25s, box-shadow 0.25s, transform 0.25s;
}

.nav-icon-btn:hover {
  background: #5C462B;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  transform: translateY(-1px);
}

.nav-icon-btn:active {
  transform: translateY(1px);
}

.nav-progress {
  flex: 1;
  max-width: 260px;
  margin: 0 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-track {
  flex: 1;
  height: 10px;
  background: #2A1E0B;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(122, 94, 58, 0.2);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #F5C368, #F9D98A);
  border-radius: 999px;
  transition: width 1s ease-out;
  box-shadow: 0 0 6px rgba(245, 195, 104, 0.3);
}

.progress-label {
  color: #C4B598;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

/* ===== HERO CARD WRAPPER ===== */
.hero-card-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 24px 16px;
  position: relative;
  z-index: 10;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s ease-out 0.15s, transform 0.7s ease-out 0.15s;
}

.hero-card-wrapper.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ===== HERO CARD ===== */
.hero-card {
  width: 100%;
  max-width: 1100px;
  background: #5C462B;
  border-radius: 24px;
  border: 2px solid rgba(122, 94, 58, 0.4);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.4s, border-color 0.4s, transform 0.4s;
}

.hero-card.is-hovered {
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(245, 195, 104, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-color: rgba(245, 195, 104, 0.3);
  transform: translateY(-3px);
}

/* ===== MEDIA AREA ===== */
.hero-media {
  width: 100%;
  flex-shrink: 0;
}

.media-gradient {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background:
    radial-gradient(ellipse at 30% 40%, rgba(245, 195, 104, 0.3) 0%, transparent 55%),
    radial-gradient(ellipse at 75% 25%, rgba(196, 181, 152, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(163, 117, 60, 0.25) 0%, transparent 55%),
    linear-gradient(135deg, #7A5E3A 0%, #5C462B 40%, #4A3620 70%, #3F2E12 100%);
  border-radius: 18px 18px 0 0;
  overflow: hidden;
}

.media-texture {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(255, 200, 100, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(196, 181, 152, 0.08) 0%, transparent 50%);
  mix-blend-mode: overlay;
}

/* Molecule SVGs */
.media-mol {
  position: absolute;
  pointer-events: none;
}

.media-mol--1 {
  width: 70px;
  height: 70px;
  top: 14%;
  left: 10%;
  animation: molBob1 8s ease-in-out infinite;
}

.media-mol--2 {
  width: 55px;
  height: 55px;
  bottom: 20%;
  right: 12%;
  animation: molBob2 10s ease-in-out infinite;
}

@keyframes molBob1 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(8px, -10px) rotate(12deg); }
}

@keyframes molBob2 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-6px, 8px) rotate(-10deg); }
}

/* ===== PLAY BUTTON ===== */
.play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  border: 2px solid rgba(255, 255, 255, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  animation: breathe 3s ease-in-out infinite;
  transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.play-btn svg {
  margin-left: 3px; /* visual center for play triangle */
}

.play-btn:hover {
  background: rgba(255, 255, 255, 0.28);
  transform: translate(-50%, -50%) scale(1.12);
  box-shadow: 0 0 24px rgba(255, 255, 255, 0.15);
}

.play-btn:active {
  transform: translate(-50%, -50%) scale(0.95);
}

@keyframes breathe {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.25); }
  50% { box-shadow: 0 0 0 14px rgba(255, 255, 255, 0); }
}

/* ===== TEXT CONTENT ===== */
.hero-content {
  padding: 28px 24px 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}

.hero-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #F5C368;
  line-height: 1.25;
  letter-spacing: -0.01em;
  margin: 0;
}

.hero-subtitle {
  font-size: 0.95rem;
  color: #C4B598;
  line-height: 1.6;
  margin: 0;
}

/* ===== CTA BUTTON ===== */
.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: #E6D6B9;
  color: #3F2E12;
  font-weight: 800;
  font-size: 0.95rem;
  border-radius: 999px;
  border: 2px solid rgba(249, 217, 138, 0.45);
  text-decoration: none;
  cursor: pointer;
  box-shadow:
    0 6px 18px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: transform 0.25s, box-shadow 0.25s, background 0.25s;
  position: relative;
  overflow: hidden;
  margin-top: 4px;
}

.hero-cta:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 28px rgba(0, 0, 0, 0.32),
    0 0 0 2px rgba(245, 195, 104, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  background: #efe0c6;
}

.hero-cta:active {
  transform: translateY(1px);
  box-shadow:
    0 3px 10px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(0, 0, 0, 0.08);
}

/* Shimmer effect on hover */
.hero-cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
  border-radius: 999px;
  transition: left 0.5s ease;
}

.hero-cta:hover::before {
  left: 100%;
}

.cta-sparkle {
  transition: transform 0.3s;
}

.cta-sparkle.is-hovered {
  transform: rotate(15deg) scale(1.15);
}

/* ===== WAVE ===== */
.hero-wave {
  width: 100%;
  position: relative;
  z-index: 10;
  line-height: 0;
}

.hero-wave svg {
  width: 100%;
  height: 10px;
}

/* ===== DESKTOP: left-right layout ===== */
@media (min-width: 768px) {
  .hero-nav {
    padding: 24px 24px 0;
  }

  .hero-card {
    flex-direction: row;
  }

  .hero-media {
    width: 50%;
  }

  .media-gradient {
    aspect-ratio: auto;
    height: 100%;
    min-height: 340px;
    border-radius: 18px 0 0 18px;
  }

  .hero-content {
    width: 50%;
    padding: 40px 36px;
    justify-content: center;
  }

  .hero-title {
    font-size: 2.25rem;
  }

  .hero-subtitle {
    font-size: 1.05rem;
    line-height: 1.7;
  }

  .hero-card-wrapper {
    padding: 32px 24px;
  }

  .play-btn {
    width: 72px;
    height: 72px;
  }

  .hero-wave svg {
    height: 12px;
  }
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-content {
    padding: 48px 44px;
    gap: 16px;
  }
}

/* ===== Small screen tuning ===== */
@media (max-width: 480px) {
  .blob {
    filter: blur(60px);
    opacity: 0.1;
  }

  .blob--1 { width: 160px; height: 160px; }
  .blob--2 { width: 140px; height: 140px; }
  .blob--3 { width: 110px; height: 110px; }

  .media-mol {
    opacity: 0.5;
  }

  .play-btn {
    width: 52px;
    height: 52px;
  }

  .play-btn svg {
    width: 22px;
    height: 22px;
  }

  .hero-title {
    font-size: 1.45rem;
  }
}
</style>
