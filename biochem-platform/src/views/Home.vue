<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const loaded = ref(false)

onMounted(() => {
  loaded.value = true
})

const features = [
  {
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    title: '八大代谢路径',
    description: '系统学习糖酵解、TCA 循环、氧化磷酸化等核心代谢路径，搭配图文详解与关键步骤分析。',
    action: '开始学习',
    actionType: 'primary',
    to: '/pathways',
  },
  {
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
    title: '代谢网络总览',
    description: '以全局视角审视代谢网络，理解 Acetyl-CoA、NADH、ATP 等枢纽分子之间的连接与调控。',
    action: '查看网络',
    actionType: 'outline',
    to: '/network',
  },
  {
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
    title: '练习题库',
    description: '通过精选练习题巩固代谢知识，涵盖概念辨析、能量计算、调控机制与临床关联。',
    action: '进入题库',
    actionType: 'outline',
    to: '/quiz',
  },
  {
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
    title: '错题本与复习',
    description: '自动记录答错的题目，支持针对性复习回顾，确保薄弱环节被反复强化。',
    action: '查看错题',
    actionType: 'outline',
    to: '/quiz',
  },
]

const stats = [
  { value: '8', label: '核心代谢路径' },
  { value: '60+', label: '关键酶与反应' },
  { value: '100+', label: '练习题目' },
  { value: '∞', label: '学习可能' },
]

const recentStudy = [
  { pathway: '糖酵解', chapter: '糖代谢', progress: 75 },
  { pathway: 'TCA 循环', chapter: '糖代谢', progress: 40 },
  { pathway: '氧化磷酸化', chapter: '生物氧化', progress: 20 },
]
</script>

<template>
  <div class="home fade-in">
    <div class="container">
      <!-- Hero: Clean SaaS header -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge badge-primary">生物化学 · 学习平台</span>
          </div>
          <h1 class="hero-title">生物化学学习辅助平台</h1>
          <p class="hero-desc">
            系统学习八大核心代谢路径，掌握关键酶、反应步骤与调控机制。通过练习题库巩固知识，以全局视角理解代谢网络。
          </p>
          <div class="hero-actions">
            <router-link to="/pathways" class="btn btn-primary btn-lg">
              开始学习
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </router-link>
            <router-link to="/quiz" class="btn btn-outline btn-lg">
              进入题库
            </router-link>
          </div>
        </div>

        <!-- Decorative SVG element -->
        <div class="hero-visual" aria-hidden="true">
          <svg viewBox="0 0 280 280" fill="none" class="hero-molecule">
            <circle cx="140" cy="140" r="120" stroke="var(--border)" stroke-width="1" stroke-dasharray="4 6"/>
            <circle cx="140" cy="140" r="80" stroke="var(--border-hover)" stroke-width="1" stroke-dasharray="4 6"/>
            <circle cx="140" cy="140" r="40" stroke="var(--border)" stroke-width="1"/>
            <!-- Nodes -->
            <circle cx="140" cy="20" r="6" fill="var(--primary)"/>
            <circle cx="260" cy="140" r="5" fill="var(--primary-muted)" stroke="var(--primary)" stroke-width="1.5"/>
            <circle cx="140" cy="260" r="5" fill="var(--primary-muted)" stroke="var(--primary)" stroke-width="1.5"/>
            <circle cx="20" cy="140" r="6" fill="var(--primary)"/>
            <circle cx="197" cy="60" r="4" fill="var(--border-hover)"/>
            <circle cx="197" cy="220" r="4" fill="var(--border-hover)"/>
            <circle cx="83" cy="60" r="4" fill="var(--border-hover)"/>
            <circle cx="83" cy="220" r="4" fill="var(--border-hover)"/>
            <!-- Center -->
            <circle cx="140" cy="140" r="8" fill="var(--primary)" opacity="0.15"/>
            <circle cx="140" cy="140" r="4" fill="var(--primary)"/>
            <!-- Labels -->
            <text x="140" y="15" text-anchor="middle" font-size="9" fill="var(--muted)" font-family="var(--font-mono)">ATP</text>
            <text x="275" y="144" text-anchor="end" font-size="9" fill="var(--muted)" font-family="var(--font-mono)">NADH</text>
            <text x="140" y="278" text-anchor="middle" font-size="9" fill="var(--muted)" font-family="var(--font-mono)">CoA</text>
            <text x="12" y="128" text-anchor="start" font-size="9" fill="var(--muted)" font-family="var(--font-mono)">G6P</text>
          </svg>
        </div>
      </div>

      <!-- Feature Entry Cards -->
      <section class="features-section">
        <div class="section-head">
          <h2>核心功能</h2>
          <p class="page-subtitle">一站式代谢生化学习工具，助你高效掌握考点。</p>
        </div>
        <div class="grid grid-2 features-grid">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="card card-hover feature-card"
            @click="router.push(feature.to)"
          >
            <div class="card-body feature-body">
              <div class="feature-icon-wrap" v-html="feature.icon"></div>
              <div class="feature-content">
                <h3 class="feature-title">{{ feature.title }}</h3>
                <p class="feature-desc">{{ feature.description }}</p>
              </div>
              <router-link
                :to="feature.to"
                :class="['btn btn-sm', feature.actionType === 'primary' ? 'btn-primary' : 'btn-outline']"
                @click.stop
              >
                {{ feature.action }}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Strip -->
      <section class="stats-section">
        <div class="stats-grid grid grid-4">
          <div class="stat-item" v-for="stat in stats" :key="stat.label">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </section>

      <!-- Recent Study / Activity -->
      <section class="activity-section">
        <div class="section-head">
          <h2>最近学习</h2>
          <router-link to="/pathways" class="btn btn-ghost btn-sm">
            查看全部
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </router-link>
        </div>
        <div class="grid grid-3 activity-grid">
          <div v-for="item in recentStudy" :key="item.pathway" class="card activity-card">
            <div class="card-body">
              <div class="activity-top">
                <span class="badge">{{ item.chapter }}</span>
              </div>
              <h4 class="activity-name">{{ item.pathway }}</h4>
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: item.progress + '%' }"></div>
              </div>
              <span class="activity-pct">{{ item.progress }}% 已学习</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* --- Hero Section --- */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  padding-bottom: 64px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 64px;
}

.hero-content {
  flex: 1;
  max-width: 560px;
}

.hero-badge {
  margin-bottom: 20px;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 16px;
  color: var(--text);
}

.hero-desc {
  font-size: 1.0625rem;
  color: var(--muted);
  line-height: 1.75;
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 12px;
}

.hero-visual {
  flex-shrink: 0;
  width: 280px;
  height: 280px;
  opacity: 0.55;
}

.hero-molecule {
  width: 100%;
  height: 100%;
}

/* --- Features --- */
.features-section {
  margin-bottom: 64px;
}

.section-head {
  margin-bottom: 32px;
}

.section-head h2 {
  margin-bottom: 8px;
}

.feature-card {
  cursor: pointer;
}

.feature-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px;
}

.feature-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius);
  background: var(--bg-secondary);
  color: var(--text);
  flex-shrink: 0;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
}

.feature-desc {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.7;
}

.feature-body .btn {
  align-self: flex-start;
  margin-top: 4px;
}

/* --- Stats --- */
.stats-section {
  padding: 48px 0;
  margin-bottom: 64px;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.stat-item {
  text-align: center;
  padding: 8px 16px;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.03em;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--muted);
  margin-top: 8px;
}

/* --- Activity --- */
.activity-section {
  margin-bottom: 32px;
}

.activity-section .section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.activity-card .card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-top {
  display: flex;
  align-items: center;
}

.activity-name {
  font-weight: 600;
  color: var(--text);
}

.progress-track {
  width: 100%;
  height: 4px;
  background: var(--bg-secondary);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 2px;
  transition: width 0.4s ease;
}

.activity-pct {
  font-size: 0.8125rem;
  color: var(--muted);
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    gap: 32px;
    padding-bottom: 48px;
    margin-bottom: 48px;
  }

  .hero-visual {
    width: 180px;
    height: 180px;
    order: -1;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .features-section,
  .stats-section {
    margin-bottom: 48px;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 1.75rem;
  }

  .features-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
