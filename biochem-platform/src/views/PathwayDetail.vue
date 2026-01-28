<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import {
  Flame,
  RefreshCw,
  RotateCw,
  Zap,
  FlaskConical,
  Droplets,
  Layers,
  Recycle,
  ChevronLeft,
  MapPin,
  Bolt,
  Search
} from 'lucide-vue-next'
import pathways from '../data/pathways.json'

const route = useRoute()
const router = useRouter()

const pathway = computed(() => {
  return pathways.find(p => p.id === route.params.id) || null
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

function goBack() {
  router.push('/pathways')
}
</script>

<template>
  <div class="detail-page fade-in">
    <div class="container">
      <!-- Back button -->
      <button class="btn btn-ghost back-btn" @click="goBack">
        <ChevronLeft :size="16" :stroke-width="2" />
        返回路径列表
      </button>

      <!-- Not found -->
      <div v-if="!pathway" class="not-found">
        <div class="empty-icon">
          <Search :size="48" :stroke-width="1" />
        </div>
        <h2>未找到该路径</h2>
        <p>请检查路径 ID，或返回列表页。</p>
        <button class="btn btn-outline" style="margin-top: 20px" @click="goBack">
          返回路径列表
        </button>
      </div>

      <!-- Pathway Detail -->
      <template v-else>
        <!-- Header -->
        <div class="detail-header">
          <span class="detail-icon">
            <component :is="getIcon(pathway.icon)" :size="28" :stroke-width="1.5" />
          </span>
          <div>
            <h1>{{ pathway.name }}</h1>
            <p class="detail-english">{{ pathway.english }}</p>
          </div>
        </div>

        <!-- Meta badges -->
        <div class="detail-meta">
          <span class="badge">
            <MapPin :size="12" :stroke-width="2" style="margin-right: 4px" />
            {{ pathway.location }}
          </span>
          <span class="badge badge-primary">
            <Bolt :size="12" :stroke-width="2" style="margin-right: 4px" />
            {{ pathway.energy }}
          </span>
          <span class="badge">{{ pathway.chapter }}</span>
        </div>

        <!-- Sections -->
        <div class="detail-sections">
          <!-- Overview -->
          <div class="card section-card">
            <div class="card-body">
              <div class="section-header">
                <span class="section-dot"></span>
                <h3>概述</h3>
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
                <span class="section-dot"></span>
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
                <p v-else class="placeholder-text">关键步骤数据正在准备中。</p>
              </div>
            </div>
          </div>

          <!-- Energy -->
          <div class="card section-card">
            <div class="card-body">
              <div class="section-header">
                <span class="section-dot section-dot-accent"></span>
                <h3>能量收支</h3>
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
                <span class="section-dot"></span>
                <h3>调控机制</h3>
              </div>
              <div class="section-content">
                <ul v-if="pathway.regulation && pathway.regulation.length" class="info-list">
                  <li v-for="(item, i) in pathway.regulation" :key="i">{{ item }}</li>
                </ul>
                <p v-else class="placeholder-text">调控机制数据正在准备中。</p>
              </div>
            </div>
          </div>

          <!-- Clinical -->
          <div class="card section-card">
            <div class="card-body">
              <div class="section-header">
                <span class="section-dot section-dot-danger"></span>
                <h3>临床关联</h3>
              </div>
              <div class="section-content">
                <ul v-if="pathway.clinical && pathway.clinical.length" class="info-list clinical-list">
                  <li v-for="(item, i) in pathway.clinical" :key="i">{{ item }}</li>
                </ul>
                <p v-else class="placeholder-text">临床关联数据正在准备中。</p>
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
  margin-bottom: 32px;
  margin-top: 0;
}

/* --- Not Found --- */
.not-found {
  text-align: center;
  padding: 80px 24px;
}

.not-found .empty-icon {
  margin-bottom: 20px;
  color: var(--muted-light);
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
  gap: 20px;
  margin-bottom: 20px;
}

.detail-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  color: var(--text);
  flex-shrink: 0;
}

.detail-header h1 {
  margin-bottom: 4px;
}

.detail-english {
  font-size: 0.9375rem;
  color: var(--muted);
  letter-spacing: 0.01em;
}

/* --- Meta --- */
.detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 40px;
}

/* --- Sections --- */
.detail-sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-card .card-body {
  padding: 28px 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text);
  flex-shrink: 0;
}

.section-dot-accent {
  background: var(--accent);
}

.section-dot-danger {
  background: var(--destructive);
}

.section-header h3 {
  font-size: 1rem;
  font-weight: 500;
}

.section-content p {
  font-size: 0.9375rem;
  line-height: 1.8;
}

.energy-highlight {
  font-weight: 500;
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
  gap: 20px;
}

.step-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.step-order {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-secondary);
  color: var(--text);
  font-weight: 500;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.step-name {
  font-weight: 500;
  font-size: 0.9375rem;
  color: var(--text);
  margin-bottom: 6px;
}

.step-detail {
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.7;
}

/* --- Info List --- */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-list li {
  font-size: 0.9375rem;
  line-height: 1.8;
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
  background: var(--text);
}

.clinical-list li::before {
  background: var(--destructive);
}

/* --- Responsive --- */
@media (max-width: 640px) {
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .section-card .card-body {
    padding: 24px;
  }

  .detail-icon {
    width: 48px;
    height: 48px;
  }
}
</style>
