<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import pathways from '../data/pathways.json'

const route = useRoute()
const router = useRouter()

const pathway = computed(() => {
  return pathways.find(p => p.id === route.params.id) || null
})

function goBack() {
  router.push('/pathways')
}
</script>

<template>
  <div class="detail-page">
    <div class="container">
      <!-- Back button -->
      <button class="btn btn-ghost back-btn" @click="goBack">
        &larr; 返回代谢路径列表
      </button>

      <!-- Not found -->
      <div v-if="!pathway" class="not-found">
        <div class="empty-icon">🔍</div>
        <h2>未找到该代谢路径</h2>
        <p>请检查路径 ID 是否正确，或返回列表重新选择。</p>
        <button class="btn btn-outline" style="margin-top: 16px" @click="goBack">
          返回路径列表
        </button>
      </div>

      <!-- Pathway Detail -->
      <template v-else>
        <!-- Header -->
        <div class="detail-header">
          <span class="detail-icon">{{ pathway.icon }}</span>
          <div>
            <h1>{{ pathway.name }}</h1>
            <p class="detail-english">{{ pathway.english }}</p>
          </div>
        </div>

        <!-- Meta badges -->
        <div class="detail-meta">
          <span class="badge">📍 {{ pathway.location }}</span>
          <span class="badge badge-primary">⚡ {{ pathway.energy }}</span>
          <span class="badge">📂 {{ pathway.chapter }}</span>
        </div>

        <!-- Sections -->
        <div class="detail-sections">
          <!-- Overview -->
          <div class="card section-card">
            <div class="card-body">
              <div class="section-header">
                <span class="section-icon">📋</span>
                <h3>概览</h3>
              </div>
              <div class="section-content">
                <p>{{ pathway.overview }}</p>
              </div>
            </div>
          </div>

          <!-- Key Steps -->
          <div class="card section-card">
            <div class="card-body">
              <div class="section-header">
                <span class="section-icon">🔢</span>
                <h3>关键步骤</h3>
              </div>
              <div class="section-content">
                <div v-if="pathway.steps && pathway.steps.length" class="steps-list">
                  <div v-for="step in pathway.steps" :key="step.order" class="step-item">
                    <div class="step-order">{{ step.order }}</div>
                    <div class="step-body">
                      <div class="step-name">{{ step.name }}</div>
                      <p class="step-detail">{{ step.detail }}</p>
                    </div>
                  </div>
                </div>
                <p v-else class="placeholder-text">关键步骤数据正在整理中。</p>
              </div>
            </div>
          </div>

          <!-- Energy -->
          <div class="card section-card">
            <div class="card-body">
              <div class="section-header">
                <span class="section-icon">⚡</span>
                <h3>能量计算</h3>
              </div>
              <div class="section-content">
                <p class="energy-highlight">{{ pathway.energy }}</p>
              </div>
            </div>
          </div>

          <!-- Regulation -->
          <div class="card section-card">
            <div class="card-body">
              <div class="section-header">
                <span class="section-icon">🎛️</span>
                <h3>调控机制</h3>
              </div>
              <div class="section-content">
                <ul v-if="pathway.regulation && pathway.regulation.length" class="info-list">
                  <li v-for="(item, i) in pathway.regulation" :key="i">{{ item }}</li>
                </ul>
                <p v-else class="placeholder-text">调控机制数据正在整理中。</p>
              </div>
            </div>
          </div>

          <!-- Clinical -->
          <div class="card section-card">
            <div class="card-body">
              <div class="section-header">
                <span class="section-icon">🏥</span>
                <h3>临床关联</h3>
              </div>
              <div class="section-content">
                <ul v-if="pathway.clinical && pathway.clinical.length" class="info-list clinical-list">
                  <li v-for="(item, i) in pathway.clinical" :key="i">{{ item }}</li>
                </ul>
                <p v-else class="placeholder-text">临床关联数据正在整理中。</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.back-btn {
  margin-bottom: 24px;
  margin-top: 8px;
}

/* --- Not Found (Empty State) --- */
.not-found {
  text-align: center;
  padding: 80px 24px;
}

.not-found .empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.7;
}

.not-found h2 {
  margin-bottom: 8px;
}

.not-found p {
  color: var(--muted);
}

/* --- Detail Header --- */
.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.detail-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.detail-header h1 {
  margin-bottom: 2px;
}

.detail-english {
  font-size: 0.9375rem;
  color: var(--muted);
}

/* --- Meta --- */
.detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
}

/* --- Sections --- */
.detail-sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-card .card-body {
  padding: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.section-icon {
  font-size: 1.25rem;
}

.section-header h3 {
  font-size: 1.0625rem;
  font-weight: 600;
}

.section-content p {
  font-size: 0.9375rem;
  line-height: 1.75;
}

.energy-highlight {
  font-weight: 600;
  color: var(--text);
}

.placeholder-text {
  color: var(--muted);
  font-style: italic;
}

/* --- Steps --- */
.steps-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.step-order {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 700;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.step-name {
  font-weight: 600;
  font-size: 0.9375rem;
  color: var(--text);
  margin-bottom: 4px;
}

.step-detail {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* --- Info List --- */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-list li {
  font-size: 0.9375rem;
  line-height: 1.75;
  color: var(--text-secondary);
  padding-left: 20px;
  position: relative;
}

.info-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary);
}

.clinical-list li::before {
  background: var(--destructive);
}

/* --- Responsive --- */
@media (max-width: 640px) {
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
