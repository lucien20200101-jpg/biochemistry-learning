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
          <span class="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="2"/>
              <path d="M12 2v4"/>
              <path d="M12 18v4"/>
              <path d="M4.93 4.93l2.83 2.83"/>
              <path d="M16.24 16.24l2.83 2.83"/>
              <path d="M2 12h4"/>
              <path d="M18 12h4"/>
              <path d="M4.93 19.07l2.83-2.83"/>
              <path d="M16.24 7.76l2.83-2.83"/>
            </svg>
          </span>
          <span class="brand-text">BioChem</span>
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
        <p class="footer-text">生物化学学习辅助平台</p>
        <p class="footer-sub">让代谢学习更高效</p>
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
  background: rgba(255, 255, 255, 0.82);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
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
  gap: 10px;
  font-weight: 700;
  font-size: 1rem;
  color: var(--text);
  text-decoration: none;
  letter-spacing: -0.02em;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: var(--text);
  color: white;
}

.brand-icon svg {
  display: block;
  width: 18px;
  height: 18px;
}

.brand-text {
  white-space: nowrap;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2px;
}

.nav-link {
  padding: 7px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--muted);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.nav-link:hover {
  color: var(--text);
  background-color: var(--bg-secondary);
}

.nav-link.active {
  color: var(--text);
  background-color: var(--bg-secondary);
  font-weight: 600;
}

/* --- Main Content --- */
.main-content {
  flex: 1;
  padding-top: 40px;
  padding-bottom: 80px;
}

/* --- Footer --- */
.site-footer {
  border-top: 1px solid var(--border);
  padding: 32px 0;
  background: var(--card);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text);
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
    padding: 6px 10px;
    font-size: 0.8125rem;
  }
  .brand-text {
    font-size: 0.875rem;
  }
  .footer-inner {
    flex-direction: column;
    gap: 4px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .nav-link {
    padding: 6px 8px;
    font-size: 0.75rem;
  }
}
</style>
