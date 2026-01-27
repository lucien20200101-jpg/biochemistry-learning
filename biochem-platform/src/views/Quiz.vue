<script setup>
const quizCategories = [
  {
    icon: '🧬',
    title: '糖代谢',
    count: 25,
    topics: ['糖酵解', '糖异生', '糖原代谢', '磷酸戊糖途径'],
  },
  {
    icon: '🔋',
    title: '能量代谢',
    count: 30,
    topics: ['TCA 循环', '氧化磷酸化', '电子传递链', 'ATP 合成机制'],
  },
  {
    icon: '🧈',
    title: '脂质代谢',
    count: 20,
    topics: ['脂肪酸氧化', '脂肪酸合成', '胆固醇代谢', '酮体生成'],
  },
  {
    icon: '🧱',
    title: '氨基酸与含氮代谢',
    count: 25,
    topics: ['氨基酸分解', '尿素循环', '一碳代谢', '核苷酸合成'],
  },
  {
    icon: '🎛️',
    title: '代谢调控',
    count: 15,
    topics: ['别构调节', '共价修饰', '激素调控', '代谢整合'],
  },
  {
    icon: '🏥',
    title: '临床关联',
    count: 15,
    topics: ['代谢性疾病', '酶缺陷病', '药物靶点', '实验室指标'],
  },
]
</script>

<template>
  <div class="quiz-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-header-title">练习题库</h1>
          <p class="page-header-subtitle">
            通过精选练习题巩固代谢知识，涵盖概念辨析、能量计算、调控机制与临床关联。
          </p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-primary" disabled>
            开始随机练习
          </button>
        </div>
      </div>

      <div class="skeleton-grid" aria-hidden="true">
        <div class="skeleton skeleton-card" v-for="item in 4" :key="item"></div>
      </div>

      <!-- Quiz Category Grid -->
      <div class="grid grid-2 quiz-grid">
        <div
          v-for="cat in quizCategories"
          :key="cat.title"
          class="card card-hover quiz-card"
        >
          <div class="card-body">
            <div class="quiz-top">
              <span class="quiz-icon">{{ cat.icon }}</span>
              <span class="quiz-count">{{ cat.count }} 题</span>
            </div>
            <h3 class="quiz-title">{{ cat.title }}</h3>
            <div class="quiz-topics">
              <span v-for="topic in cat.topics" :key="topic" class="badge">
                {{ topic }}
              </span>
            </div>
            <button class="btn btn-outline btn-sm" disabled>
              开始练习
            </button>
          </div>
        </div>
      </div>

      <!-- Placeholder notice -->
      <div class="placeholder-notice">
        <p>题库数据正在整理中，即将在后续版本中上线。敬请期待。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- Quiz Cards --- */
.quiz-grid {
  gap: 20px;
}

.quiz-card .card-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
}

.quiz-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.quiz-icon {
  font-size: 1.75rem;
}

.quiz-count {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--muted);
}

.quiz-title {
  font-size: 1.0625rem;
  font-weight: 600;
}

.quiz-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.quiz-topics .badge {
  font-size: 0.75rem;
  padding: 3px 10px;
}

.quiz-card .btn {
  align-self: flex-start;
  margin-top: 4px;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.skeleton-card {
  height: 120px;
}

/* --- Placeholder --- */
.placeholder-notice {
  text-align: center;
  padding: 40px 0 16px;
}

.placeholder-notice p {
  font-size: 0.875rem;
  color: var(--muted);
  font-style: italic;
}

/* --- Responsive --- */
@media (max-width: 640px) {
  .skeleton-grid {
    grid-template-columns: 1fr;
  }
}
</style>
