<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const features = [
  {
    icon: '🧬',
    title: '八大代谢路径',
    description: '结构化学习糖酵解、TCA 循环、氧化磷酸化等八大路径，快速掌握关键反应与酶。',
    action: '进入路径',
    actionType: 'primary',
    to: '/pathways',
  },
  {
    icon: '🕸️',
    title: '代谢网络',
    description: '通过全局视角理解代谢通路的连接与调控，识别关键枢纽与能量流向。',
    action: '查看网络',
    actionType: 'secondary',
    to: '/network',
  },
  {
    icon: '📘',
    title: '练习题库',
    description: '覆盖概念辨析、能量计算、调控机制与临床关联的题库练习，随时巩固。',
    action: '进入题库',
    actionType: 'secondary',
    to: '/quiz',
  },
  {
    icon: '🗂️',
    title: '学习进度',
    description: '追踪近期学习记录与错题回顾，规划下一阶段的学习路径。',
    action: '查看进度',
    actionType: 'secondary',
    to: '/pathways',
  },
]
</script>

<template>
  <div class="home">
    <!-- Header Section -->
    <section class="section">
      <div class="container">
        <div class="page-header">
          <div>
            <h1 class="page-header-title">生物化学学习辅助平台</h1>
            <p class="page-header-subtitle">
              专注代谢路径学习的现代化平台，以清晰结构与高效练习帮助你构建完整知识体系。
            </p>
          </div>
          <div class="page-header-actions">
            <router-link to="/pathways" class="btn btn-primary btn-lg">
              开始学习
            </router-link>
            <router-link to="/quiz" class="btn btn-outline btn-lg">
              进入题库
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features section">
      <div class="container">
        <div class="features-grid grid grid-2">
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
                :class="['btn', feature.actionType === 'primary' ? 'btn-primary' : 'btn-secondary']"
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
        <div class="stats-grid">
          <div class="card stat-card">
            <div class="card-body">
              <div class="stat-label">今日学习</div>
              <div class="stat-value">2 条路径</div>
              <p class="stat-desc">糖酵解 · TCA 循环</p>
            </div>
          </div>
          <div class="card stat-card">
            <div class="card-body">
              <div class="stat-label">近期练习</div>
              <div class="stat-value">18 / 25 题</div>
              <p class="stat-desc">正确率 78%，继续保持</p>
            </div>
          </div>
          <div class="card stat-card">
            <div class="card-body">
              <div class="stat-label">推荐下一步</div>
              <div class="stat-value">氧化磷酸化</div>
              <p class="stat-desc">预计学习时长 25 分钟</p>
            </div>
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
.stats-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.stat-card .card-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--muted);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
}

.stat-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* --- Responsive --- */
@media (max-width: 640px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
