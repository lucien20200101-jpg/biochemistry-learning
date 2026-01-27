<script setup>
const pathways = [
  {
    id: 'glycolysis',
    icon: '🔥',
    name: '糖酵解',
    english: 'Glycolysis',
    summary: '将葡萄糖分解为丙酮酸，产生少量 ATP 和 NADH。',
    location: '细胞质',
  },
  {
    id: 'gluconeogenesis',
    icon: '🔄',
    name: '糖异生',
    english: 'Gluconeogenesis',
    summary: '由非糖前体（乳酸、氨基酸等）合成葡萄糖的逆向过程。',
    location: '细胞质/线粒体',
  },
  {
    id: 'tca-cycle',
    icon: '🔁',
    name: 'TCA 循环',
    english: 'TCA Cycle',
    summary: '氧化乙酰-CoA，产生 CO₂、NADH、FADH₂ 和 GTP。',
    location: '线粒体基质',
  },
  {
    id: 'oxidative-phosphorylation',
    icon: '⚡',
    name: '氧化磷酸化',
    english: 'Oxidative Phosphorylation',
    summary: '电子传递链偶联 ATP 合酶，产生大量 ATP。',
    location: '线粒体内膜',
  },
  {
    id: 'pentose-phosphate',
    icon: '🧪',
    name: '磷酸戊糖途径',
    english: 'Pentose Phosphate Pathway',
    summary: '生成 NADPH 和核糖-5-磷酸，参与抗氧化与核酸合成。',
    location: '细胞质',
  },
  {
    id: 'fatty-acid-oxidation',
    icon: '🫧',
    name: '脂肪酸β-氧化',
    english: 'Fatty Acid β-Oxidation',
    summary: '将脂肪酸逐步切割为乙酰-CoA，释放大量能量。',
    location: '线粒体基质',
  },
  {
    id: 'fatty-acid-synthesis',
    icon: '🏗️',
    name: '脂肪酸合成',
    english: 'Fatty Acid Synthesis',
    summary: '以乙酰-CoA 为原料在细胞质中合成长链脂肪酸。',
    location: '细胞质',
  },
  {
    id: 'urea-cycle',
    icon: '♻️',
    name: '尿素循环',
    english: 'Urea Cycle',
    summary: '将有毒的氨转化为尿素排出体外，与 TCA 循环交汇。',
    location: '线粒体/细胞质',
  },
]
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

      <!-- Pathway Grid -->
      <div class="grid grid-2 pathway-grid">
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
              查看详情 <span class="arrow">→</span>
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
