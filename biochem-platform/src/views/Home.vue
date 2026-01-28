<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import {
  BookOpen,
  Network,
  PenTool,
  RotateCcw,
  ArrowRight,
  Atom
} from 'lucide-vue-next'

const router = useRouter()
const loaded = ref(false)

onMounted(() => {
  loaded.value = true
})

const features = [
  {
    icon: BookOpen,
    title: 'Metabolic Pathways',
    description: 'Study the eight core metabolic pathways with detailed explanations of key enzymes, reaction steps, and regulation mechanisms.',
    action: 'Start learning',
    actionType: 'primary',
    to: '/pathways',
  },
  {
    icon: Network,
    title: 'Network Overview',
    description: 'Visualize how metabolic pathways interconnect through key hub molecules like Acetyl-CoA, NADH, and ATP.',
    action: 'Explore network',
    actionType: 'outline',
    to: '/network',
  },
  {
    icon: PenTool,
    title: 'Practice Questions',
    description: 'Test your understanding with curated questions covering concepts, energy calculations, and clinical correlations.',
    action: 'Start practice',
    actionType: 'outline',
    to: '/quiz',
  },
  {
    icon: RotateCcw,
    title: 'Review & Revise',
    description: 'Track incorrect answers automatically and revisit them for targeted review to strengthen weak areas.',
    action: 'View notebook',
    actionType: 'outline',
    to: '/quiz',
  },
]

const stats = [
  { value: '8', label: 'Core Pathways' },
  { value: '60+', label: 'Key Enzymes' },
  { value: '100+', label: 'Questions' },
]
</script>

<template>
  <div class="home fade-in">
    <div class="container">
      <!-- Hero: Clean minimal header -->
      <div class="hero-section">
        <div class="hero-content">
          <p class="hero-eyebrow">Biochemistry Learning Platform</p>
          <h1 class="hero-title">Master metabolism,<br />one pathway at a time</h1>
          <p class="hero-desc">
            A comprehensive study companion for biochemistry students. Learn the eight core metabolic pathways, understand their interconnections, and test your knowledge with practice questions.
          </p>
          <div class="hero-actions">
            <router-link to="/pathways" class="btn btn-primary btn-lg">
              Start Learning
              <ArrowRight :size="16" :stroke-width="2" />
            </router-link>
            <router-link to="/quiz" class="btn btn-outline btn-lg">
              Practice Quiz
            </router-link>
          </div>
        </div>

        <!-- Minimal decorative element -->
        <div class="hero-visual" aria-hidden="true">
          <div class="visual-circle">
            <Atom :size="48" :stroke-width="1" />
          </div>
        </div>
      </div>

      <!-- Stats Strip -->
      <section class="stats-section">
        <div class="stats-grid">
          <div class="stat-item" v-for="stat in stats" :key="stat.label">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </section>

      <!-- Feature Entry Cards -->
      <section class="features-section">
        <div class="section-head">
          <h2>Core Features</h2>
          <p class="section-desc">Everything you need to master biochemistry metabolism.</p>
        </div>
        <div class="grid grid-2 features-grid">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="card card-hover feature-card"
            @click="router.push(feature.to)"
          >
            <div class="card-body feature-body">
              <div class="feature-icon-wrap">
                <component :is="feature.icon" :size="22" :stroke-width="1.5" />
              </div>
              <div class="feature-content">
                <h3 class="feature-title">{{ feature.title }}</h3>
                <p class="feature-desc">{{ feature.description }}</p>
              </div>
              <router-link
                :to="feature.to"
                :class="['btn btn-sm', feature.actionType === 'primary' ? 'btn-primary' : 'btn-outline']"
                @click.stop
              >
                {{ feature.action }}
                <ArrowRight :size="14" :stroke-width="2" />
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* --- Hero Section --- */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 64px;
  padding-bottom: 64px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 64px;
}

.hero-content {
  flex: 1;
  max-width: 580px;
}

.hero-eyebrow {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--muted);
  letter-spacing: 0.02em;
  margin-bottom: 16px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1.1;
  margin-bottom: 24px;
  color: var(--text);
}

.hero-desc {
  font-size: 1.0625rem;
  color: var(--muted);
  line-height: 1.8;
  margin-bottom: 40px;
}

.hero-actions {
  display: flex;
  gap: 12px;
}

.hero-visual {
  flex-shrink: 0;
}

.visual-circle {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
}

/* --- Stats --- */
.stats-section {
  padding: 48px 0;
  margin-bottom: 64px;
  border-bottom: 1px solid var(--border);
}

.stats-grid {
  display: flex;
  justify-content: flex-start;
  gap: 64px;
}

.stat-item {
  text-align: left;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 500;
  color: var(--text);
  letter-spacing: -0.03em;
  line-height: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--muted);
  margin-top: 8px;
}

/* --- Features --- */
.features-section {
  margin-bottom: 32px;
}

.section-head {
  margin-bottom: 40px;
}

.section-head h2 {
  margin-bottom: 8px;
}

.section-desc {
  font-size: 1rem;
  color: var(--muted);
}

.features-grid {
  gap: 16px;
}

.feature-card {
  cursor: pointer;
}

.feature-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 32px;
}

.feature-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius);
  background: var(--bg-secondary);
  color: var(--text);
  flex-shrink: 0;
}

.feature-content {
  flex: 1;
}

.feature-title {
  font-size: 1.0625rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 8px;
}

.feature-desc {
  font-size: 0.9375rem;
  color: var(--muted);
  line-height: 1.7;
}

.feature-body .btn {
  align-self: flex-start;
  margin-top: 4px;
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    gap: 40px;
    padding-bottom: 48px;
    margin-bottom: 48px;
  }

  .hero-visual {
    order: -1;
  }

  .visual-circle {
    width: 120px;
    height: 120px;
  }

  .hero-title {
    font-size: 2.25rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .stats-grid {
    gap: 40px;
  }

  .features-section,
  .stats-section {
    margin-bottom: 48px;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-content {
    text-align: center;
  }

  .hero-actions {
    align-items: center;
  }

  .stats-grid {
    flex-wrap: wrap;
    justify-content: center;
    gap: 32px;
  }

  .stat-item {
    text-align: center;
    min-width: 100px;
  }

  .features-grid {
    grid-template-columns: 1fr !important;
  }

  .feature-body {
    padding: 24px;
  }
}
</style>
