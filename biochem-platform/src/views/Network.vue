<script setup>
import { ArrowRight, Network as NetworkIcon } from 'lucide-vue-next'

const hubs = [
  { name: '乙酰CoA', desc: '脂肪酸氧化/合成与TCA循环的交汇点', primary: true },
  { name: 'NADH', desc: '氧化还原反应中的关键电子载体', primary: false },
  { name: 'FADH₂', desc: '向复合物II传递电子', primary: false },
  { name: 'NADPH', desc: '还原性生物合成与抗氧化防御', primary: false },
  { name: 'ATP', desc: '细胞的通用能量货币', primary: true },
  { name: '丙酮酸', desc: '糖酵解的终产物，连接多条路径', primary: false },
  { name: '柠檬酸', desc: 'TCA循环第一个中间产物，调节信号', primary: false },
  { name: '草酰乙酸', desc: '连接TCA循环与糖异生', primary: false },
  { name: '葡萄糖-6-磷酸', desc: '糖酵解与磷酸戊糖途径的分支点', primary: false },
  { name: '谷氨酸', desc: '氨基酸代谢与尿素循环的枢纽', primary: false },
  { name: '延胡索酸', desc: 'TCA循环与尿素循环的共有代谢物', primary: false },
  { name: '丙二酰CoA', desc: '脂肪酸合成的直接前体', primary: false },
]

const connections = [
  '糖酵解 → 丙酮酸 → 乙酰CoA → TCA循环',
  'TCA循环 → NADH / FADH₂ → 氧化磷酸化 → ATP',
  '磷酸戊糖途径 ← 葡萄糖-6-磷酸 → 糖酵解',
  'β氧化 → 乙酰CoA → TCA循环',
  '氨基酸分解代谢 → TCA循环中间产物 / 尿素循环',
  '尿素循环 ↔ TCA循环（通过延胡索酸）',
]
</script>

<template>
  <div class="network-page fade-in">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="page-header-row">
          <div>
            <h1>代谢网络</h1>
            <p class="page-subtitle">
              理解各代谢路径之间的相互联系。每个枢纽分子都是连接多条代谢通路的桥梁。
            </p>
          </div>
          <router-link to="/pathways" class="btn btn-outline btn-sm header-cta">
            查看路径
            <ArrowRight :size="14" :stroke-width="2" />
          </router-link>
        </div>
      </div>

      <!-- Network Visualization Placeholder -->
      <div class="card network-canvas">
        <div class="canvas-placeholder">
          <NetworkIcon :size="48" :stroke-width="1" />
          <h3>交互式网络可视化</h3>
          <p>交互式代谢网络图将在后续版本中集成。</p>
        </div>
      </div>

      <!-- Key Pathway Connections -->
      <div class="connections-section">
        <h2>核心路径连接</h2>
        <div class="connections-list">
          <div v-for="(conn, i) in connections" :key="i" class="card connection-item">
            <span class="conn-number">{{ i + 1 }}</span>
            <span class="conn-text">{{ conn }}</span>
          </div>
        </div>
      </div>

      <!-- Hub Molecules -->
      <div class="hubs-section">
        <h2>关键枢纽分子</h2>
        <p class="section-desc">这些分子是代谢网络中的关键交汇点。</p>
        <div class="hubs-details">
          <div v-for="hub in hubs" :key="hub.name" class="card hub-detail-item">
            <div class="card-body hub-body">
              <span class="hub-name" :class="{ 'hub-primary': hub.primary }">{{ hub.name }}</span>
              <span class="hub-desc">{{ hub.desc }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-cta {
  flex-shrink: 0;
  margin-top: 4px;
}

/* --- Network Canvas --- */
.network-canvas {
  margin-bottom: 64px;
}

.canvas-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 32px;
  min-height: 320px;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
}

.canvas-placeholder svg {
  margin-bottom: 20px;
  color: var(--muted-light);
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
  margin-bottom: 64px;
}

.connections-section h2 {
  margin-bottom: 24px;
}

.connections-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.connection-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 24px;
}

.conn-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--bg-secondary);
  color: var(--muted);
  font-size: 0.8125rem;
  font-weight: 600;
  flex-shrink: 0;
}

.conn-text {
  font-size: 0.9375rem;
  color: var(--text);
  font-family: var(--font-mono);
  letter-spacing: -0.01em;
}

/* --- Hubs --- */
.hubs-section h2 {
  margin-bottom: 8px;
}

.section-desc {
  font-size: 0.9375rem;
  color: var(--muted);
  margin-bottom: 28px;
}

.hubs-details {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}

.hub-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px 24px;
}

.hub-name {
  font-weight: 500;
  font-size: 0.9375rem;
  color: var(--text);
  font-family: var(--font-mono);
}

.hub-primary {
  color: var(--text);
}

.hub-desc {
  font-size: 0.8125rem;
  color: var(--muted);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .page-header-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .hubs-details {
    grid-template-columns: 1fr;
  }
}
</style>
