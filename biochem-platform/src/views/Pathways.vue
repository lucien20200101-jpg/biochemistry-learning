<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  Flame,
  RefreshCw,
  RotateCw,
  Zap,
  FlaskConical,
  Droplets,
  Layers,
  Recycle,
  ArrowRight,
  BookOpen
} from 'lucide-vue-next'
import pathways from '../data/pathways.json'

const loading = ref(true)

onMounted(() => {
  setTimeout(() => { loading.value = false }, 300)
})

const iconMap = {
  'flame': Flame,
  'refresh-cw': RefreshCw,
  'rotate-cw': RotateCw,
  'zap': Zap,
  'flask-conical': FlaskConical,
  'droplets': Droplets,
  'layers': Layers,
  'recycle': Recycle,
}

function getIcon(iconName) {
  return iconMap[iconName] || FlaskConical
}
</script>

<template>
  <div class="pathways-page fade-in">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="page-header-row">
          <div>
            <h1>代谢路径</h1>
            <p class="page-subtitle">
              掌握八大核心代谢路径，理解关键反应、酶、调控机制及临床关联。
            </p>
          </div>
          <router-link to="/quiz" class="btn btn-primary btn-sm header-cta">
            练习题库
            <ArrowRight :size="14" :stroke-width="2" />
          </router-link>
        </div>
      </div>

      <!-- Skeleton Loading -->
      <div v-if="loading" class="grid grid-2 pathway-grid">
        <div v-for="n in 8" :key="n" class="card">
          <div class="card-body">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text-sm"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="pathways.length === 0" class="empty-state">
        <div class="empty-icon">
          <BookOpen :size="48" :stroke-width="1" />
        </div>
        <h3>暂无路径数据</h3>
        <p>路径数据正在准备中，请稍后再来查看。</p>
      </div>

      <!-- Pathway Grid -->
      <div v-else class="grid grid-2 pathway-grid">
        <router-link
          v-for="pw in pathways"
          :key="pw.id"
          :to="`/pathways/${pw.id}`"
          class="card card-hover pathway-card"
        >
          <div class="card-body">
            <div class="pw-top">
              <span class="pw-icon">
                <component :is="getIcon(pw.icon)" :size="20" :stroke-width="1.5" />
              </span>
              <span class="badge">{{ pw.location }}</span>
            </div>
            <h3 class="pw-name">{{ pw.name }}</h3>
            <p class="pw-english">{{ pw.english }}</p>
            <p class="pw-summary">{{ pw.summary }}</p>
            <span class="pw-link">
              查看详情
              <ArrowRight :size="14" :stroke-width="2" class="arrow" />
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-cta {
  flex-shrink: 0;
  margin-top: 4px;
}

/* --- Empty State --- */
.empty-state {
  text-align: center;
  padding: 80px 24px;
}

.empty-icon {
  margin-bottom: 20px;
  color: var(--muted-light);
}

.empty-state h3 {
  margin-bottom: 8px;
  color: var(--text);
}

.empty-state p {
  color: var(--muted);
  font-size: 0.9375rem;
}

/* --- Pathway Grid --- */
.pathway-grid {
  gap: 16px;
}

.pathway-card {
  text-decoration: none;
  color: inherit;
  display: block;
}

.pathway-card .card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 28px 32px;
}

.pw-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pw-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  background: var(--bg-secondary);
  color: var(--text);
}

.pw-name {
  font-size: 1.0625rem;
  font-weight: 500;
  color: var(--text);
  margin-top: 4px;
}

.pw-english {
  font-size: 0.8125rem;
  color: var(--muted-light);
  margin-top: -8px;
  letter-spacing: 0.01em;
}

.pw-summary {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.7;
}

.pw-link {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text);
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.pw-link .arrow {
  transition: transform var(--transition-fast);
}

.pathway-card:hover .pw-link .arrow {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .page-header-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .pathway-card .card-body {
    padding: 24px;
  }
}
</style>
