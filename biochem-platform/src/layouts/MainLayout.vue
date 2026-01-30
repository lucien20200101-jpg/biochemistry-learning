<script setup>
import { useRoute } from 'vue-router'
import { Atom } from 'lucide-vue-next'

const route = useRoute()

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/pathways', label: '代谢路径' },
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
          <span class="brand-icon">
            <Atom :size="18" :stroke-width="1.5" />
          </span>
          <span class="brand-text">生化学习</span>
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
      <div class="container footer-inner">
        <p class="footer-text">生化学习平台</p>
        <p class="footer-sub">一步一步，掌握代谢全貌</p>
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
  background: rgba(250, 250, 249, 0.92);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
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
  gap: 12px;
  font-weight: 500;
  font-size: 0.9375rem;
  color: var(--text);
  text-decoration: none;
  letter-spacing: -0.02em;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius);
  background: var(--text);
  color: var(--card);
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
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--muted);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.nav-link:hover {
  color: var(--text);
}

.nav-link.active {
  color: var(--text);
  font-weight: 500;
}

/* --- Main Content --- */
.main-content {
  flex: 1;
  padding-top: 48px;
  padding-bottom: 96px;
}

/* --- Footer --- */
.site-footer {
  border-top: 1px solid var(--border);
  padding: 40px 0;
  background: var(--card);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
  letter-spacing: -0.01em;
}

.footer-sub {
  font-size: 0.8125rem;
  color: var(--muted);
}

/* --- Mobile --- */
@media (max-width: 768px) {
  .nav-links {
    gap: 0;
  }
  .nav-link {
    padding: 8px 12px;
    font-size: 0.8125rem;
  }
  .brand-text {
    font-size: 0.875rem;
  }
  .footer-inner {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  .main-content {
    padding-top: 32px;
    padding-bottom: 64px;
  }
}

@media (max-width: 480px) {
  .nav-link {
    padding: 8px 10px;
    font-size: 0.75rem;
  }
  .brand-icon {
    width: 32px;
    height: 32px;
  }
}
</style>
