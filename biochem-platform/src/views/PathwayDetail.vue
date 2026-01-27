<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const pathwayData = {
  'glycolysis': {
    icon: '🔥', name: '糖酵解', english: 'Glycolysis',
    overview: '糖酵解是将一分子葡萄糖（6C）分解为两分子丙酮酸（3C）的过程，发生在细胞质中。该过程净产生 2 ATP 和 2 NADH，是几乎所有生物体共有的最古老的代谢途径之一。',
    location: '细胞质',
    energy: '净产出 2 ATP + 2 NADH / 葡萄糖',
  },
  'gluconeogenesis': {
    icon: '🔄', name: '糖异生', english: 'Gluconeogenesis',
    overview: '糖异生是糖酵解的逆向过程，以非糖前体（如乳酸、甘油、氨基酸）合成葡萄糖。该过程在肝脏（及少量在肾脏）中进行，是饥饿状态维持血糖稳态的关键途径。',
    location: '细胞质 / 线粒体',
    energy: '消耗 4 ATP + 2 GTP / 葡萄糖',
  },
  'tca-cycle': {
    icon: '🔁', name: 'TCA 循环', english: 'Tricarboxylic Acid Cycle',
    overview: 'TCA 循环（也称柠檬酸循环或 Krebs 循环）将乙酰-CoA 氧化为 CO₂，同时产生还原性辅酶（NADH、FADH₂）和少量 GTP。它是三大营养物质代谢的最终共同通路。',
    location: '线粒体基质',
    energy: '每轮产出 3 NADH + 1 FADH₂ + 1 GTP',
  },
  'oxidative-phosphorylation': {
    icon: '⚡', name: '氧化磷酸化', english: 'Oxidative Phosphorylation',
    overview: '氧化磷酸化通过电子传递链（复合物 I-IV）将 NADH/FADH₂ 的电子逐步传递给 O₂，建立质子梯度并驱动 ATP 合酶合成 ATP。这是细胞产生 ATP 的最主要方式。',
    location: '线粒体内膜',
    energy: '约 30-32 ATP / 葡萄糖（联合 TCA 循环）',
  },
  'pentose-phosphate': {
    icon: '🧪', name: '磷酸戊糖途径', english: 'Pentose Phosphate Pathway',
    overview: '磷酸戊糖途径分为氧化阶段和非氧化阶段。氧化阶段产生 NADPH（用于还原性生物合成与抗氧化），非氧化阶段产生核糖-5-磷酸（用于核苷酸合成）。',
    location: '细胞质',
    energy: '产生 2 NADPH + 核糖-5-磷酸',
  },
  'fatty-acid-oxidation': {
    icon: '🫧', name: '脂肪酸β-氧化', english: 'Fatty Acid β-Oxidation',
    overview: 'β-氧化将长链脂肪酰-CoA 每次切割 2 个碳，生成乙酰-CoA、NADH 和 FADH₂。脂肪酸是人体最高效的能量储存形式，每克脂肪可产生约 9 kcal 能量。',
    location: '线粒体基质',
    energy: '棕榈酸（C16）完全氧化约产生 106 ATP',
  },
  'fatty-acid-synthesis': {
    icon: '🏗️', name: '脂肪酸合成', english: 'Fatty Acid Synthesis',
    overview: '脂肪酸合成以乙酰-CoA 为起始底物，通过脂肪酸合酶复合体（FAS）每次延伸 2 个碳。该过程消耗 NADPH，主要发生在营养充足（高胰岛素）状态下。',
    location: '细胞质',
    energy: '合成棕榈酸消耗 8 乙酰-CoA + 14 NADPH + 7 ATP',
  },
  'urea-cycle': {
    icon: '♻️', name: '尿素循环', english: 'Urea Cycle',
    overview: '尿素循环将氨基酸脱氨产生的有毒 NH₃ 转化为无毒的尿素，经肾脏排出。该循环跨越线粒体与细胞质，并与 TCA 循环通过延胡索酸相互连接。',
    location: '线粒体 / 细胞质',
    energy: '每分子尿素消耗 3 ATP（4 高能磷酸键）',
  },
}

const sections = [
  { key: 'overview', title: '概览', icon: '📋' },
  { key: 'steps', title: '关键步骤', icon: '🔢' },
  { key: 'energy', title: '能量计算', icon: '⚡' },
  { key: 'regulation', title: '调控机制', icon: '🎛️' },
  { key: 'clinical', title: '临床关联', icon: '🏥' },
]

const pathway = computed(() => {
  return pathwayData[route.params.id] || null
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
        ← 返回代谢路径列表
      </button>

      <!-- Not found -->
      <div v-if="!pathway" class="not-found">
        <h2>未找到该代谢路径</h2>
        <p>请检查路径 ID 是否正确。</p>
      </div>

      <!-- Pathway Detail -->
      <template v-else>
        <div class="page-header">
          <div>
            <h1 class="page-header-title">{{ pathway.name }}</h1>
            <p class="page-header-subtitle">
              聚焦核心反应、能量收支与调控机制，建立完整的路径理解框架。
            </p>
          </div>
          <div class="page-header-actions">
            <button class="btn btn-primary">开始章节练习</button>
            <button class="btn btn-outline">加入学习计划</button>
          </div>
        </div>

        <!-- Header -->
        <div class="detail-header">
          <span class="detail-icon">{{ pathway.icon }}</span>
          <div>
            <h2>{{ pathway.name }}</h2>
            <p class="detail-english">{{ pathway.english }}</p>
          </div>
        </div>

        <!-- Meta badges -->
        <div class="detail-meta">
          <span class="badge">📍 {{ pathway.location }}</span>
          <span class="badge badge-primary">⚡ {{ pathway.energy }}</span>
        </div>

        <!-- Sections -->
        <div class="detail-sections">
          <div v-for="sec in sections" :key="sec.key" class="card section-card">
            <div class="card-body">
              <div class="section-header">
                <span class="section-icon">{{ sec.icon }}</span>
                <h3>{{ sec.title }}</h3>
              </div>
              <div class="section-content">
                <template v-if="sec.key === 'overview'">
                  <p>{{ pathway.overview }}</p>
                </template>
                <template v-else-if="sec.key === 'energy'">
                  <p class="energy-highlight">{{ pathway.energy }}</p>
                  <p class="placeholder-text">详细能量计算将在后续版本中添加。</p>
                </template>
                <template v-else>
                  <p class="placeholder-text">该部分内容正在开发中，敬请期待。</p>
                </template>
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

.not-found {
  text-align: center;
  padding: 80px 0;
}

.not-found h2 {
  margin-bottom: 8px;
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

.detail-header h2 {
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
  margin-bottom: 8px;
}

.placeholder-text {
  color: var(--muted);
  font-style: italic;
}
</style>
