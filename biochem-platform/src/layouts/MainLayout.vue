<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/pathways', label: '八大代谢路径' },
  { to: '/network', label: '代谢网络' },
  { to: '/quiz', label: '练习题库' },
]
</script>

<template>
  <div class="layout">
    <!-- Top Navigation -->
    <header class="nav-header">
      <div class="nav-inner container">
        <router-link to="/" class="nav-brand">
          <span class="brand-icon">🧬</span>
          <span class="brand-text">生物化学学习辅助平台</span>
        </router-link>

        <nav class="nav-links">
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="nav-link"
            :class="{ active: route.path === link.to || (link.to !== '/' && route.path.startsWith(link.to)) }"
          >
            {{ link.label }}
          </router-link>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="container">
        <p class="footer-text">生物化学学习辅助平台 · 让代谢学习更高效</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* --- Navigation Header --- */
.nav-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--nav-height);
  background: var(--card);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.85);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 1rem;
  color: var(--text);
  text-decoration: none;
  letter-spacing: -0.01em;
}

.brand-icon {
  font-size: 1.25rem;
}

.brand-text {
  white-space: nowrap;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  padding: 6px 14px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: color 0.15s ease, background-color 0.15s ease;
}

.nav-link:hover {
  color: var(--text);
  background-color: var(--bg-secondary);
}

.nav-link.active {
  color: var(--text);
  background-color: var(--bg-secondary);
}

/* --- Main Content --- */
.main-content {
  flex: 1;
  padding-top: 32px;
  padding-bottom: 64px;
}

/* --- Footer --- */
.site-footer {
  border-top: 1px solid var(--border);
  padding: 24px 0;
}

.footer-text {
  font-size: 0.8125rem;
  color: var(--muted);
  text-align: center;
}

/* --- Mobile --- */
@media (max-width: 640px) {
  .nav-links {
    gap: 0;
  }
  .nav-link {
    padding: 6px 10px;
    font-size: 0.8125rem;
  }
  .brand-text {
    font-size: 0.875rem;
  }
}
</style>
