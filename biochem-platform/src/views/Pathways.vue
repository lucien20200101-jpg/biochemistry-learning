<script setup>
import { ref, onMounted } from 'vue'
import pathways from '../data/pathways.json'

const loading = ref(true)

onMounted(() => {
  setTimeout(() => { loading.value = false }, 300)
})
</script>

<template>
  <div class="pathways-page fade-in">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="page-header-row">
          <div>
            <h1>八大核心代谢路径</h1>
            <p class="page-subtitle">
              系统学习生物化学中八大核心代谢路径，掌握关键反应步骤、酶、调控机制与临床关联。
            </p>
          </div>
          <router-link to="/quiz" class="btn btn-primary btn-sm header-cta">
            进入题库
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
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
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted-light)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8l6 6"/><path d="M4 14l6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="M22 22l-5-10-5 10"/><path d="M14 18h6"/></svg>
        </div>
        <h3>暂无代谢路径数据</h3>
        <p>路径数据正在整理中，请稍后再来查看。</p>
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
              <span class="pw-icon">{{ pw.icon }}</span>
              <span class="badge">{{ pw.location }}</span>
            </div>
            <h3 class="pw-name">{{ pw.name }}</h3>
            <p class="pw-english">{{ pw.english }}</p>
            <p class="pw-summary">{{ pw.summary }}</p>
            <span class="pw-link">
              查看详情
              <svg class="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
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
  margin-bottom: 16px;
  opacity: 0.7;
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
  gap: 20px;
}

.pathway-card {
  text-decoration: none;
  color: inherit;
  display: block;
}

.pathway-card .card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 28px;
}

.pw-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pw-icon {
  font-size: 1.75rem;
}

.pw-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text);
}

.pw-english {
  font-size: 0.8125rem;
  color: var(--muted-light);
  margin-top: -6px;
}

.pw-summary {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.65;
}

.pw-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary);
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.pw-link .arrow {
  transition: transform var(--transition-fast);
}

.pathway-card:hover .pw-link .arrow {
  transform: translateX(3px);
}

@media (max-width: 768px) {
  .page-header-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
