<script setup>
import pathways from '../data/pathways.json'
</script>

<template>
  <div class="pathways-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1>八大核心代谢路径</h1>
        <p class="page-subtitle">
          系统学习生物化学中八大核心代谢路径，掌握关键反应步骤、酶、调控机制与临床关联。
        </p>
      </div>

      <!-- Empty State -->
      <div v-if="pathways.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
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
              查看详情 <span class="arrow">&rarr;</span>
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  padding-top: 16px;
  padding-bottom: 32px;
}

.page-header h1 {
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  max-width: 600px;
}

/* --- Empty State --- */
.empty-state {
  text-align: center;
  padding: 80px 24px;
}

.empty-icon {
  font-size: 3rem;
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
  color: var(--muted);
  margin-top: -6px;
}

.pw-summary {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.65;
}

.pw-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary);
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.pw-link .arrow {
  transition: transform 0.15s ease;
}

.pathway-card:hover .pw-link .arrow {
  transform: translateX(3px);
}
</style>
