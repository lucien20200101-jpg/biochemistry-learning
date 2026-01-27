<script setup>
const hubs = [
  { name: 'Acetyl-CoA', desc: '脂肪酸氧化/合成、TCA循环的交汇点', color: 'primary' },
  { name: 'NADH', desc: '氧化还原反应的关键电子载体', color: 'default' },
  { name: 'FADH₂', desc: '复合物II的电子供体', color: 'default' },
  { name: 'NADPH', desc: '还原性生物合成与抗氧化', color: 'default' },
  { name: 'ATP', desc: '细胞的通用能量货币', color: 'primary' },
  { name: 'Pyruvate', desc: '糖酵解终产物，连接多条代谢途径', color: 'default' },
  { name: 'Citrate', desc: 'TCA循环首个中间产物，调控信号', color: 'default' },
  { name: 'Oxaloacetate', desc: 'TCA循环与糖异生的连接点', color: 'default' },
  { name: 'Glucose-6-P', desc: '糖酵解与磷酸戊糖途径的分支点', color: 'default' },
  { name: 'Glutamate', desc: '氨基酸代谢与尿素循环的枢纽', color: 'default' },
  { name: 'Fumarate', desc: 'TCA循环与尿素循环的交汇代谢物', color: 'default' },
  { name: 'Malonyl-CoA', desc: '脂肪酸合成的直接前体', color: 'default' },
]

const connections = [
  '糖酵解 → 丙酮酸 → 乙酰-CoA → TCA 循环',
  'TCA 循环 → NADH / FADH₂ → 氧化磷酸化 → ATP',
  '磷酸戊糖途径 ← 葡萄糖-6-磷酸 → 糖酵解',
  '脂肪酸氧化 → 乙酰-CoA → TCA 循环',
  '氨基酸分解 → TCA 中间产物 / 尿素循环',
  '尿素循环 ↔ TCA 循环 (延胡索酸)',
]
</script>

<template>
  <div class="network-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1>代谢网络总览</h1>
        <p class="page-subtitle">
          以全局视角理解代谢路径之间的连接关系。每个枢纽分子都在多条代谢途径之间起到桥梁作用。
        </p>
      </div>

      <!-- Network Visualization Placeholder -->
      <div class="card network-canvas">
        <div class="card-body">
          <div class="canvas-placeholder">
            <span class="canvas-icon">🕸️</span>
            <h3>交互式代谢网络图</h3>
            <p>此区域将在后续版本中集成可交互的代谢网络可视化。</p>
          </div>
        </div>
      </div>

      <!-- Key Pathway Connections -->
      <div class="connections-section">
        <h2>核心连接路径</h2>
        <div class="connections-list">
          <div v-for="(conn, i) in connections" :key="i" class="connection-item">
            <span class="conn-number">{{ i + 1 }}</span>
            <span class="conn-text font-mono">{{ conn }}</span>
          </div>
        </div>
      </div>

      <!-- Hub Molecules -->
      <div class="hubs-section">
        <h2>关键枢纽分子</h2>
        <p class="section-desc">点击标签查看该分子在代谢网络中的角色（功能开发中）。</p>
        <div class="hubs-grid">
          <button
            v-for="hub in hubs"
            :key="hub.name"
            :class="['badge', hub.color === 'primary' ? 'badge-primary' : '']"
            :title="hub.desc"
          >
            {{ hub.name }}
          </button>
        </div>
        <div class="hubs-details">
          <div v-for="hub in hubs" :key="hub.name" class="hub-detail-item">
            <span class="hub-name">{{ hub.name }}</span>
            <span class="hub-desc">{{ hub.desc }}</span>
          </div>
        </div>
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

/* --- Network Canvas --- */
.network-canvas {
  margin-bottom: 40px;
}

.network-canvas .card-body {
  padding: 0;
}

.canvas-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 24px;
  min-height: 320px;
  background: var(--bg-secondary);
  border-radius: var(--radius);
}

.canvas-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.canvas-placeholder h3 {
  margin-bottom: 8px;
  color: var(--text);
}

.canvas-placeholder p {
  color: var(--muted);
  font-size: 0.9375rem;
}

/* --- Connections --- */
.connections-section {
  margin-bottom: 40px;
}

.connections-section h2 {
  margin-bottom: 16px;
}

.connections-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.connection-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.conn-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 0.8125rem;
  font-weight: 600;
  flex-shrink: 0;
}

.conn-text {
  font-size: 0.875rem;
  color: var(--text);
}

/* --- Hubs --- */
.hubs-section h2 {
  margin-bottom: 8px;
}

.section-desc {
  font-size: 0.875rem;
  color: var(--muted);
  margin-bottom: 20px;
}

.hubs-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
}

.hubs-grid .badge {
  cursor: pointer;
  font-size: 0.875rem;
  padding: 6px 16px;
}

.hubs-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.hub-detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px 16px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.hub-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text);
  font-family: var(--font-mono);
}

.hub-desc {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}
</style>
