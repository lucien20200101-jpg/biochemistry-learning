<script setup>
import { useRouter } from 'vue-router'
import HeroSection from '../components/HeroSection.vue'

const router = useRouter()

const features = [
  {
    icon: '📖',
    title: '代谢图文学习',
    description: '系统学习八大核心代谢路径，包含糖酵解、TCA 循环、氧化磷酸化等，搭配图文详解与关键步骤分析。',
    action: '开始学习',
    actionType: 'primary',
    to: '/pathways',
  },
  {
    icon: '🔗',
    title: '代谢网络总览',
    description: '以全局视角审视代谢网络，理解关键枢纽分子如 Acetyl-CoA、NADH、ATP 之间的连接与调控关系。',
    action: '查看网络',
    actionType: 'outline',
    to: '/network',
  },
  {
    icon: '✏️',
    title: '题库练习',
    description: '通过精选练习题巩固代谢知识，涵盖概念辨析、能量计算、调控机制与临床关联等多个维度。',
    action: '进入题库',
    actionType: 'outline',
    to: '/quiz',
  },
]
</script>

<template>
  <div class="home">
    <!-- Claymation Hero Section -->
    <HeroSection />

    <!-- Features Section -->
    <section class="features section">
      <div class="container">
        <div class="features-grid grid grid-3">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="card card-hover feature-card"
            @click="router.push(feature.to)"
          >
            <div class="card-body">
              <span class="feature-icon">{{ feature.icon }}</span>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-desc">{{ feature.description }}</p>
              <router-link
                :to="feature.to"
                :class="['btn', feature.actionType === 'primary' ? 'btn-primary' : 'btn-outline']"
                @click.stop
              >
                {{ feature.action }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats section">
      <div class="container">
        <div class="stats-grid grid grid-4">
          <div class="stat-item" v-for="stat in [
            { value: '8', label: '核心代谢路径' },
            { value: '60+', label: '关键酶与反应' },
            { value: '100+', label: '练习题目' },
            { value: '∞', label: '学习可能' },
          ]" :key="stat.label">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* --- Feature Cards --- */
.feature-card {
  cursor: pointer;
}

.feature-card .card-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px;
}

.feature-icon {
  font-size: 2rem;
  line-height: 1;
}

.feature-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text);
}

.feature-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.7;
  flex: 1;
}

.feature-card .btn {
  align-self: flex-start;
  margin-top: 4px;
}

/* --- Stats --- */
.stats {
  border-top: 1px solid var(--border);
}

.stat-item {
  text-align: center;
  padding: 16px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--muted);
  margin-top: 4px;
}

</style>
