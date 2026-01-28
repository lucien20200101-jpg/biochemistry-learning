<script setup>
import { ref, onMounted } from 'vue'
import {
  RotateCcw,
  Maximize,
  Play,
  Sparkles,
  FlaskConical,
  Atom,
  Dna,
  ChevronRight,
} from 'lucide-vue-next'

const isVisible = ref(false)
const cardHover = ref(false)
const buttonHover = ref(false)

onMounted(() => {
  // Staggered entrance animation
  requestAnimationFrame(() => {
    isVisible.value = true
  })
})
</script>

<template>
  <div class="hero-root font-clay min-h-screen bg-clay-bg flex flex-col items-center relative overflow-hidden">
    <!-- Ambient floating shapes (decorative clay blobs) -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="clay-blob blob-1"></div>
      <div class="clay-blob blob-2"></div>
      <div class="clay-blob blob-3"></div>
      <div class="clay-blob blob-4"></div>
    </div>

    <!-- ========== NAVBAR ========== -->
    <nav
      class="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 flex items-center justify-between relative z-10 transition-all duration-700 ease-out"
      :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'"
    >
      <!-- Left: Back button -->
      <button
        class="clay-icon-btn group flex items-center gap-2 px-3 py-2 rounded-2xl bg-clay-card/60 border border-clay-warm/30 hover:bg-clay-card transition-all duration-300 hover:shadow-lg hover:shadow-clay-dark/30"
      >
        <RotateCcw :size="18" class="text-clay-gold group-hover:rotate-[-45deg] transition-transform duration-300" />
        <span class="text-clay-sand text-sm font-semibold hidden sm:inline">返回</span>
      </button>

      <!-- Center: Progress bar -->
      <div class="flex-1 max-w-xs mx-4 sm:mx-8">
        <div class="flex items-center gap-3">
          <div class="flex-1 h-2.5 bg-clay-dark rounded-full overflow-hidden border border-clay-warm/20 shadow-inner">
            <div
              class="h-full bg-gradient-to-r from-clay-gold to-clay-highlight rounded-full transition-all duration-1000 ease-out shadow-sm"
              :style="{ width: isVisible ? '35%' : '0%' }"
            ></div>
          </div>
          <span class="text-clay-sand text-xs font-bold whitespace-nowrap">3 / 8</span>
        </div>
      </div>

      <!-- Right: Fullscreen -->
      <button
        class="clay-icon-btn group flex items-center gap-2 px-3 py-2 rounded-2xl bg-clay-card/60 border border-clay-warm/30 hover:bg-clay-card transition-all duration-300 hover:shadow-lg hover:shadow-clay-dark/30"
      >
        <Maximize :size="18" class="text-clay-gold group-hover:scale-110 transition-transform duration-300" />
        <span class="text-clay-sand text-sm font-semibold hidden sm:inline">全屏</span>
      </button>
    </nav>

    <!-- ========== MAIN HERO CARD ========== -->
    <main
      class="flex-1 flex items-center justify-center w-full px-4 sm:px-6 py-6 sm:py-10 relative z-10"
    >
      <div
        class="hero-card w-full max-w-4xl transition-all duration-700 ease-out"
        :class="isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'"
        :style="{ transitionDelay: '150ms' }"
        @mouseenter="cardHover = true"
        @mouseleave="cardHover = false"
      >
        <!-- Outer card shell -->
        <div
          class="bg-clay-card rounded-3xl border-2 border-clay-warm/40 shadow-2xl overflow-hidden transition-all duration-500"
          :class="cardHover ? 'shadow-clay-gold/10 border-clay-gold/30' : 'shadow-clay-dark/50'"
        >
          <!-- Inner glow ring -->
          <div class="p-1 sm:p-1.5">
            <div class="bg-clay-deep/60 rounded-2xl overflow-hidden">

              <!-- ===== IMAGE / ANIMATION PLACEHOLDER ===== -->
              <div class="relative group cursor-pointer">
                <div class="aspect-video sm:aspect-[16/8] w-full bg-gradient-to-br from-orange-400 via-red-400 to-purple-500 relative overflow-hidden">
                  <!-- Claymation texture overlay -->
                  <div class="absolute inset-0 clay-texture-overlay"></div>

                  <!-- Animated molecule SVGs -->
                  <svg class="molecule-svg mol-1" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="40" cy="30" r="12" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
                    <circle cx="25" cy="55" r="9" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                    <circle cx="55" cy="55" r="9" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
                    <line x1="35" y1="40" x2="28" y2="48" stroke="rgba(255,255,255,0.3)" stroke-width="2.5" stroke-linecap="round"/>
                    <line x1="45" y1="40" x2="52" y2="48" stroke="rgba(255,255,255,0.3)" stroke-width="2.5" stroke-linecap="round"/>
                  </svg>

                  <svg class="molecule-svg mol-2" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="8" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
                    <circle cx="12" cy="30" r="6" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
                    <circle cx="48" cy="30" r="6" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
                    <line x1="22" y1="30" x2="18" y2="30" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-linecap="round"/>
                    <line x1="38" y1="30" x2="42" y2="30" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-linecap="round"/>
                  </svg>

                  <svg class="molecule-svg mol-3" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 20 L75 40 L65 70 L35 70 L25 40 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linejoin="round"/>
                    <circle cx="50" cy="20" r="5" fill="rgba(255,255,255,0.2)"/>
                    <circle cx="75" cy="40" r="5" fill="rgba(255,255,255,0.15)"/>
                    <circle cx="65" cy="70" r="5" fill="rgba(255,255,255,0.15)"/>
                    <circle cx="35" cy="70" r="5" fill="rgba(255,255,255,0.15)"/>
                    <circle cx="25" cy="40" r="5" fill="rgba(255,255,255,0.15)"/>
                  </svg>

                  <!-- Central Play button overlay -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      class="play-btn w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-white/10"
                    >
                      <Play :size="28" class="text-white ml-1 drop-shadow-md" fill="currentColor" />
                    </div>
                  </div>

                  <!-- Bottom label strip -->
                  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-4 sm:px-6 pb-3 pt-10">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
                      <span class="text-white/90 text-xs sm:text-sm font-semibold">交互式动画就绪</span>
                    </div>
                  </div>

                  <!-- Top-right badge -->
                  <div class="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <div class="bg-clay-dark/70 backdrop-blur-sm rounded-xl px-3 py-1.5 border border-clay-gold/30 flex items-center gap-1.5">
                      <FlaskConical :size="14" class="text-clay-gold" />
                      <span class="text-clay-gold text-xs font-bold">黏土动画</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ===== TEXT & CTA SECTION ===== -->
              <div class="px-5 sm:px-8 py-6 sm:py-8 text-center">
                <!-- Topic pills -->
                <div
                  class="flex flex-wrap justify-center gap-2 mb-5 transition-all duration-700 ease-out"
                  :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
                  :style="{ transitionDelay: '400ms' }"
                >
                  <span
                    v-for="tag in ['糖酵解', 'TCA循环', 'DNA复制']"
                    :key="tag"
                    class="inline-flex items-center gap-1.5 px-3 py-1 bg-clay-card rounded-full border border-clay-warm/30 text-clay-sand text-xs font-semibold"
                  >
                    <Atom :size="12" class="text-clay-gold" />
                    {{ tag }}
                  </span>
                </div>

                <!-- Headline -->
                <h1
                  class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-clay-gold leading-tight mb-3 tracking-tight transition-all duration-700 ease-out"
                  :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
                  :style="{ transitionDelay: '500ms' }"
                >
                  生化学习中心
                </h1>

                <!-- Subtitle -->
                <p
                  class="text-clay-sand text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-7 transition-all duration-700 ease-out"
                  :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
                  :style="{ transitionDelay: '600ms' }"
                >
                  将任意主题转化为生动的黏土动画信息图。<br class="hidden sm:block" />
                  通过交互式3D可视化，轻松掌握代谢路径。
                </p>

                <!-- CTA Buttons -->
                <div
                  class="flex flex-col sm:flex-row items-center justify-center gap-3 transition-all duration-700 ease-out"
                  :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
                  :style="{ transitionDelay: '700ms' }"
                >
                  <!-- Primary Start Button -->
                  <router-link
                    to="/pathways"
                    class="start-btn group relative inline-flex items-center gap-2.5 px-8 py-3.5 bg-clay-cream text-clay-bg font-extrabold text-sm sm:text-base rounded-full border-2 border-clay-highlight/50 shadow-lg hover:shadow-xl hover:shadow-clay-gold/20 transition-all duration-300 hover:scale-105 active:scale-95"
                    @mouseenter="buttonHover = true"
                    @mouseleave="buttonHover = false"
                  >
                    <Sparkles
                      :size="18"
                      class="transition-transform duration-300"
                      :class="buttonHover ? 'rotate-12 scale-110' : ''"
                    />
                    <span>开始学习</span>
                    <ChevronRight
                      :size="16"
                      class="transition-transform duration-300"
                      :class="buttonHover ? 'translate-x-1' : ''"
                    />
                    <!-- Glow effect -->
                    <div class="absolute inset-0 rounded-full bg-clay-gold/0 group-hover:bg-clay-gold/10 transition-colors duration-300"></div>
                  </router-link>

                  <!-- Secondary Button -->
                  <router-link
                    to="/network"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-clay-gold font-bold text-sm sm:text-base rounded-full border-2 border-clay-gold/40 hover:border-clay-gold/70 hover:bg-clay-gold/10 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <Dna :size="16" />
                    <span>探索网络</span>
                  </router-link>
                </div>

                <!-- Bottom stats strip -->
                <div
                  class="flex items-center justify-center gap-4 sm:gap-8 mt-7 pt-5 border-t border-clay-warm/20 transition-all duration-700 ease-out"
                  :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
                  :style="{ transitionDelay: '800ms' }"
                >
                  <div v-for="stat in [
                    { value: '8', label: '代谢路径' },
                    { value: '60+', label: '关键酶' },
                    { value: '100+', label: '练习题' },
                  ]" :key="stat.label" class="text-center">
                    <div class="text-clay-gold text-lg sm:text-xl font-extrabold">{{ stat.value }}</div>
                    <div class="text-clay-sand/70 text-xs font-semibold">{{ stat.label }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom decorative wave -->
    <div class="w-full relative z-10">
      <svg class="w-full h-8 sm:h-12" viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0 48 Q 360 0, 720 24 Q 1080 48, 1440 12 L1440 48 Z" fill="#2A1E0B" opacity="0.5"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
/* ===== Font Family Override ===== */
.font-clay {
  font-family: "PingFang SC", "Microsoft YaHei", system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans SC", "Helvetica Neue", Arial, sans-serif;
}

/* ===== Clay Texture Overlay ===== */
.clay-texture-overlay {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(255, 200, 100, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(200, 100, 255, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 80%, rgba(255, 150, 50, 0.12) 0%, transparent 50%);
  mix-blend-mode: overlay;
}

/* ===== Floating Clay Blobs ===== */
.clay-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}

.blob-1 {
  width: 300px;
  height: 300px;
  background: #F5C368;
  top: -80px;
  left: -60px;
  animation: blobFloat1 12s ease-in-out infinite;
}

.blob-2 {
  width: 250px;
  height: 250px;
  background: #E67E22;
  bottom: -60px;
  right: -40px;
  animation: blobFloat2 15s ease-in-out infinite;
}

.blob-3 {
  width: 200px;
  height: 200px;
  background: #C0392B;
  top: 40%;
  right: 10%;
  animation: blobFloat3 10s ease-in-out infinite;
}

.blob-4 {
  width: 180px;
  height: 180px;
  background: #8E44AD;
  bottom: 30%;
  left: 5%;
  animation: blobFloat4 13s ease-in-out infinite;
}

@keyframes blobFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, 20px) scale(1.1); }
  66% { transform: translate(-15px, 35px) scale(0.95); }
}

@keyframes blobFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-25px, -15px) scale(1.05); }
  66% { transform: translate(20px, -30px) scale(0.9); }
}

@keyframes blobFloat3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-20px, 25px) scale(1.08); }
}

@keyframes blobFloat4 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(25px, -20px) scale(1.05); }
}

/* ===== Molecule SVGs ===== */
.molecule-svg {
  position: absolute;
  pointer-events: none;
}

.mol-1 {
  width: 80px;
  height: 80px;
  top: 12%;
  left: 8%;
  animation: molFloat1 8s ease-in-out infinite;
}

.mol-2 {
  width: 60px;
  height: 60px;
  bottom: 18%;
  right: 10%;
  animation: molFloat2 10s ease-in-out infinite;
}

.mol-3 {
  width: 100px;
  height: 100px;
  top: 20%;
  right: 15%;
  animation: molFloat3 12s ease-in-out infinite;
  opacity: 0.7;
}

@keyframes molFloat1 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(10px, -12px) rotate(15deg); }
}

@keyframes molFloat2 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(-8px, 10px) rotate(-12deg); }
}

@keyframes molFloat3 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(15px, 8px) rotate(10deg); }
}

/* ===== Play Button Pulse ===== */
.play-btn {
  animation: playPulse 3s ease-in-out infinite;
}

@keyframes playPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3); }
  50% { box-shadow: 0 0 0 12px rgba(255, 255, 255, 0); }
}

/* ===== Start Button Shimmer ===== */
.start-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  border-radius: 9999px;
  transition: left 0.6s ease;
}

.start-btn:hover::before {
  left: 100%;
}

/* ===== Responsive Fine-tuning ===== */
@media (max-width: 480px) {
  .blob-1, .blob-2, .blob-3, .blob-4 {
    filter: blur(60px);
    opacity: 0.1;
  }

  .blob-1 { width: 180px; height: 180px; }
  .blob-2 { width: 150px; height: 150px; }
  .blob-3 { width: 120px; height: 120px; }
  .blob-4 { width: 100px; height: 100px; }

  .mol-1, .mol-2, .mol-3 {
    opacity: 0.5;
  }
}
</style>
