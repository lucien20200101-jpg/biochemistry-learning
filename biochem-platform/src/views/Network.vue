<script setup>
import { ArrowRight, Network as NetworkIcon } from 'lucide-vue-next'

const hubs = [
  { name: 'Acetyl-CoA', desc: 'Junction point for fatty acid oxidation/synthesis and TCA cycle', primary: true },
  { name: 'NADH', desc: 'Key electron carrier in redox reactions', primary: false },
  { name: 'FADH₂', desc: 'Electron donor to Complex II', primary: false },
  { name: 'NADPH', desc: 'Reductive biosynthesis and antioxidant defense', primary: false },
  { name: 'ATP', desc: 'Universal energy currency of cells', primary: true },
  { name: 'Pyruvate', desc: 'End product of glycolysis, connects multiple pathways', primary: false },
  { name: 'Citrate', desc: 'First TCA cycle intermediate, regulatory signal', primary: false },
  { name: 'Oxaloacetate', desc: 'Links TCA cycle and gluconeogenesis', primary: false },
  { name: 'Glucose-6-P', desc: 'Branch point for glycolysis and PPP', primary: false },
  { name: 'Glutamate', desc: 'Hub for amino acid metabolism and urea cycle', primary: false },
  { name: 'Fumarate', desc: 'Shared metabolite of TCA and urea cycles', primary: false },
  { name: 'Malonyl-CoA', desc: 'Direct precursor for fatty acid synthesis', primary: false },
]

const connections = [
  'Glycolysis → Pyruvate → Acetyl-CoA → TCA Cycle',
  'TCA Cycle → NADH / FADH₂ → Oxidative Phosphorylation → ATP',
  'Pentose Phosphate Pathway ← Glucose-6-P → Glycolysis',
  'Fatty Acid Oxidation → Acetyl-CoA → TCA Cycle',
  'Amino Acid Catabolism → TCA Intermediates / Urea Cycle',
  'Urea Cycle ↔ TCA Cycle (via Fumarate)',
]
</script>

<template>
  <div class="network-page fade-in">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="page-header-row">
          <div>
            <h1>Metabolic Network</h1>
            <p class="page-subtitle">
              Understand how metabolic pathways interconnect. Each hub molecule serves as a bridge between multiple metabolic routes.
            </p>
          </div>
          <router-link to="/pathways" class="btn btn-outline btn-sm header-cta">
            View Pathways
            <ArrowRight :size="14" :stroke-width="2" />
          </router-link>
        </div>
      </div>

      <!-- Network Visualization Placeholder -->
      <div class="card network-canvas">
        <div class="canvas-placeholder">
          <NetworkIcon :size="48" :stroke-width="1" />
          <h3>Interactive Network Visualization</h3>
          <p>An interactive metabolic network diagram will be integrated in a future update.</p>
        </div>
      </div>

      <!-- Key Pathway Connections -->
      <div class="connections-section">
        <h2>Core Pathway Connections</h2>
        <div class="connections-list">
          <div v-for="(conn, i) in connections" :key="i" class="card connection-item">
            <span class="conn-number">{{ i + 1 }}</span>
            <span class="conn-text">{{ conn }}</span>
          </div>
        </div>
      </div>

      <!-- Hub Molecules -->
      <div class="hubs-section">
        <h2>Key Hub Molecules</h2>
        <p class="section-desc">These molecules serve as critical junctions in the metabolic network.</p>
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
