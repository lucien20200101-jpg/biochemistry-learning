<script setup>
import { computed } from 'vue'
import { useQuizStore } from '../stores/quiz'

const store = useQuizStore()

const allFinished = computed(() => {
  return store.totalQuestions > 0 && store.answeredCount === store.totalQuestions
})

function handleStart(count) {
  store.startQuiz(count)
}

function handleStartWrong() {
  store.startWrongQuiz()
}

function getOptionLabel(index) {
  return String.fromCharCode(65 + index)
}

function optionClass(question, index) {
  const isSelected = store.userAnswers[question.id] === index
  const isSubmitted = store.submitted[question.id]
  if (!isSubmitted) {
    return isSelected ? 'option-selected' : ''
  }
  if (index === question.answer) return 'option-correct'
  if (isSelected && index !== question.answer) return 'option-wrong'
  return 'option-disabled'
}
</script>

<template>
  <div class="quiz-page fade-in">
    <div class="container">

      <!-- ========== Landing: chapter select + start ========== -->
      <template v-if="!store.isQuizActive">
        <div class="page-header">
          <div class="page-header-row">
            <div>
              <h1>练习题库</h1>
              <p class="page-subtitle">
                通过精选练习题巩固代谢知识，涵盖概念辨析、能量计算、调控机制与临床关联。
              </p>
            </div>
          </div>
        </div>

        <!-- Chapter Filter -->
        <div class="filter-bar card">
          <div class="card-body filter-body">
            <span class="filter-label">选择章节</span>
            <div class="filter-chips">
              <button
                v-for="ch in store.chapters"
                :key="ch"
                class="chip"
                :class="{ 'chip-active': store.selectedChapter === ch }"
                @click="store.setChapter(ch)"
              >
                {{ ch || '全部' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Quiz Start Actions -->
        <div class="start-actions">
          <div class="card card-hover start-card" @click="handleStart(5)">
            <div class="card-body start-body">
              <div class="start-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3>随机 5 题</h3>
              <p>{{ store.filteredQuestions.length }} 题可用</p>
              <span class="btn btn-primary btn-sm">开始练习</span>
            </div>
          </div>

          <div class="card card-hover start-card" @click="handleStart(store.filteredQuestions.length)">
            <div class="card-body start-body">
              <div class="start-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
              </div>
              <h3>全部练习</h3>
              <p>{{ store.filteredQuestions.length }} 题</p>
              <span class="btn btn-outline btn-sm">开始练习</span>
            </div>
          </div>

          <div
            class="card start-card"
            :class="{ 'card-hover': store.wrongQuestions.length > 0, 'start-card-disabled': store.wrongQuestions.length === 0 }"
            @click="store.wrongQuestions.length > 0 && handleStartWrong()"
          >
            <div class="card-body start-body">
              <div class="start-icon-wrap start-icon-danger">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
              </div>
              <h3>错题回顾</h3>
              <p v-if="store.wrongQuestions.length > 0">{{ store.wrongQuestions.length }} 道错题</p>
              <p v-else class="text-muted">暂无错题记录</p>
              <span
                class="btn btn-sm"
                :class="store.wrongQuestions.length > 0 ? 'btn-outline' : 'btn-ghost'"
                :style="store.wrongQuestions.length === 0 ? 'opacity:0.4;pointer-events:none' : ''"
              >
                开始回顾
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State for no questions -->
        <div v-if="store.filteredQuestions.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted-light)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
          <h3>该章节暂无题目</h3>
          <p>请选择其他章节或等待题库更新。</p>
        </div>
      </template>

      <!-- ========== Quiz Active ========== -->
      <template v-else>
        <!-- Quiz Header -->
        <div class="quiz-header">
          <button class="btn btn-ghost btn-sm" @click="store.resetQuiz()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            返回题库
          </button>
          <div class="quiz-progress-info">
            <span class="progress-text">
              {{ store.currentIndex + 1 }} / {{ store.totalQuestions }}
            </span>
            <span v-if="allFinished" class="score-text">
              得分：{{ store.correctCount }} / {{ store.totalQuestions }}
            </span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress-bar-track">
          <div
            class="progress-bar-fill"
            :style="{ width: ((store.answeredCount / store.totalQuestions) * 100) + '%' }"
          ></div>
        </div>

        <!-- Question Card -->
        <div v-if="store.currentQuestion" class="question-area">
          <div class="card question-card">
            <div class="card-body">
              <!-- Question meta -->
              <div class="q-meta">
                <span class="badge">{{ store.currentQuestion.chapter }}</span>
                <span class="badge">{{ store.currentQuestion.topic }}</span>
                <span class="badge" :class="{
                  'badge-primary': store.currentQuestion.difficulty === '进阶'
                }">
                  {{ store.currentQuestion.difficulty }}
                </span>
              </div>

              <!-- Question text -->
              <h3 class="q-text">{{ store.currentQuestion.question }}</h3>

              <!-- Options -->
              <div class="options-list">
                <button
                  v-for="(opt, idx) in store.currentQuestion.options"
                  :key="idx"
                  class="option-btn"
                  :class="optionClass(store.currentQuestion, idx)"
                  :disabled="!!store.submitted[store.currentQuestion.id]"
                  @click="store.selectAnswer(store.currentQuestion.id, idx)"
                >
                  <span class="option-label">{{ getOptionLabel(idx) }}</span>
                  <span class="option-text">{{ opt }}</span>
                </button>
              </div>

              <!-- Submit / Explanation -->
              <div class="q-actions">
                <button
                  v-if="!store.submitted[store.currentQuestion.id]"
                  class="btn btn-primary"
                  :disabled="store.userAnswers[store.currentQuestion.id] === undefined"
                  @click="store.submitAnswer(store.currentQuestion.id)"
                >
                  提交答案
                </button>

                <!-- Explanation after submit -->
                <div
                  v-if="store.submitted[store.currentQuestion.id]"
                  class="explanation-box"
                  :class="store.userAnswers[store.currentQuestion.id] === store.currentQuestion.answer ? 'explanation-correct' : 'explanation-wrong'"
                >
                  <div class="explanation-header">
                    <span v-if="store.userAnswers[store.currentQuestion.id] === store.currentQuestion.answer" class="explanation-badge correct">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>
                      回答正确
                    </span>
                    <span v-else class="explanation-badge wrong">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      回答错误 — 正确答案：{{ getOptionLabel(store.currentQuestion.answer) }}
                    </span>
                  </div>
                  <p class="explanation-text">{{ store.currentQuestion.explanation }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="q-nav">
            <button
              class="btn btn-outline btn-sm"
              :disabled="store.currentIndex === 0"
              @click="store.prevQuestion()"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              上一题
            </button>

            <!-- Question dots -->
            <div class="q-dots">
              <button
                v-for="(q, i) in store.quizQuestions"
                :key="q.id"
                class="q-dot"
                :class="{
                  'dot-current': i === store.currentIndex,
                  'dot-correct': store.submitted[q.id] && store.userAnswers[q.id] === q.answer,
                  'dot-wrong': store.submitted[q.id] && store.userAnswers[q.id] !== q.answer,
                  'dot-answered': !store.submitted[q.id] && store.userAnswers[q.id] !== undefined,
                }"
                @click="store.goToQuestion(i)"
              >
                {{ i + 1 }}
              </button>
            </div>

            <button
              class="btn btn-outline btn-sm"
              :disabled="store.currentIndex === store.totalQuestions - 1"
              @click="store.nextQuestion()"
            >
              下一题
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          <!-- Summary when all done -->
          <div v-if="allFinished" class="summary-card card">
            <div class="card-body summary-body">
              <h3>练习完成</h3>
              <div class="summary-stats">
                <div class="summary-stat">
                  <div class="stat-num">{{ store.totalQuestions }}</div>
                  <div class="stat-lbl">总题数</div>
                </div>
                <div class="summary-stat">
                  <div class="stat-num correct-num">{{ store.correctCount }}</div>
                  <div class="stat-lbl">正确</div>
                </div>
                <div class="summary-stat">
                  <div class="stat-num wrong-num">{{ store.totalQuestions - store.correctCount }}</div>
                  <div class="stat-lbl">错误</div>
                </div>
              </div>
              <div class="summary-actions">
                <button class="btn btn-primary" @click="store.resetQuiz()">返回题库</button>
                <button
                  v-if="store.wrongQuestions.length > 0"
                  class="btn btn-outline"
                  @click="handleStartWrong()"
                >
                  回顾错题（{{ store.wrongQuestions.length }}）
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<style scoped>
/* --- Page Header --- */
.page-header {
  padding-top: 8px;
  padding-bottom: 40px;
}

.page-header h1 {
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--muted);
  max-width: 560px;
}

/* --- Filter Bar --- */
.filter-bar {
  margin-bottom: 24px;
}

.filter-body {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 6px 16px;
  font-size: 0.8125rem;
  font-weight: 500;
  border-radius: var(--radius-full);
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--muted);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: var(--font-sans);
}

.chip:hover {
  border-color: var(--border-hover);
  color: var(--text);
}

.chip-active {
  background: var(--primary);
  color: var(--primary-foreground);
  border-color: var(--primary);
}

.chip-active:hover {
  background: var(--primary-hover);
  color: var(--primary-foreground);
}

/* --- Start Actions --- */
.start-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.start-card {
  cursor: pointer;
}

.start-card-disabled {
  opacity: 0.55;
  cursor: default;
}

.start-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
  padding: 32px 24px;
}

.start-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius);
  background: var(--bg-secondary);
  color: var(--text);
}

.start-icon-danger {
  background: var(--destructive-light);
  color: var(--destructive);
}

.start-body h3 {
  font-size: 1.0625rem;
  font-weight: 600;
}

.start-body p {
  font-size: 0.8125rem;
  color: var(--muted);
}

.start-body .btn {
  margin-top: 4px;
}

/* --- Empty State --- */
.empty-state {
  text-align: center;
  padding: 60px 24px;
}

.empty-state svg {
  margin-bottom: 16px;
}

.empty-state h3 {
  margin-bottom: 8px;
  color: var(--text);
}

.empty-state p {
  color: var(--muted);
  font-size: 0.9375rem;
}

/* --- Quiz Header --- */
.quiz-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-top: 0;
}

.quiz-progress-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--muted);
}

.score-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary);
}

/* --- Progress Bar --- */
.progress-bar-track {
  width: 100%;
  height: 4px;
  background: var(--bg-secondary);
  border-radius: 2px;
  margin-bottom: 24px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 2px;
  transition: width var(--transition-slow);
}

/* --- Question Card --- */
.question-card .card-body {
  padding: 32px;
}

.q-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.q-text {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.65;
  margin-bottom: 24px;
  color: var(--text);
}

/* --- Options --- */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.option-btn {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--card);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text);
}

.option-btn:hover:not(:disabled) {
  border-color: var(--primary);
  background: var(--primary-light);
}

.option-label {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8125rem;
  color: var(--muted);
  margin-top: 1px;
}

.option-text {
  padding-top: 3px;
}

/* Option States */
.option-selected {
  border-color: var(--primary);
  background: var(--primary-light);
}

.option-selected .option-label {
  background: var(--primary);
  color: var(--primary-foreground);
}

.option-correct {
  border-color: var(--success);
  background: #f0fdf4;
}

.option-correct .option-label {
  background: var(--success);
  color: #fff;
}

.option-wrong {
  border-color: var(--destructive);
  background: #fef2f2;
}

.option-wrong .option-label {
  background: var(--destructive);
  color: #fff;
}

.option-disabled {
  opacity: 0.5;
  cursor: default;
}

/* --- Q Actions --- */
.q-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* --- Explanation --- */
.explanation-box {
  border-radius: var(--radius);
  padding: 20px;
}

.explanation-correct {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.explanation-wrong {
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.explanation-header {
  margin-bottom: 10px;
}

.explanation-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: var(--radius-full);
}

.explanation-badge.correct {
  background: #dcfce7;
  color: #166534;
}

.explanation-badge.wrong {
  background: #fee2e2;
  color: #991b1b;
}

.explanation-text {
  font-size: 0.9375rem;
  line-height: 1.75;
  color: var(--text-secondary);
}

/* --- Q Navigation --- */
.q-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  gap: 12px;
}

.q-dots {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.q-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--card);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
}

.q-dot:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.dot-current {
  border-color: var(--primary);
  background: var(--primary-light);
  color: var(--primary);
}

.dot-correct {
  border-color: var(--success);
  background: #dcfce7;
  color: #166534;
}

.dot-wrong {
  border-color: var(--destructive);
  background: #fee2e2;
  color: #991b1b;
}

.dot-answered {
  border-color: var(--primary);
  background: var(--primary-light);
  color: var(--primary);
  opacity: 0.6;
}

/* --- Summary Card --- */
.summary-card {
  margin-top: 24px;
}

.summary-body {
  text-align: center;
  padding: 40px 32px;
}

.summary-body h3 {
  font-size: 1.25rem;
  margin-bottom: 24px;
}

.summary-stats {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-bottom: 28px;
}

.stat-num {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.02em;
}

.correct-num {
  color: var(--success);
}

.wrong-num {
  color: var(--destructive);
}

.stat-lbl {
  font-size: 0.8125rem;
  color: var(--muted);
  margin-top: 4px;
}

.summary-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* --- Responsive --- */
@media (max-width: 640px) {
  .page-header-row {
    flex-direction: column;
  }

  .start-actions {
    grid-template-columns: 1fr;
  }

  .filter-body {
    flex-direction: column;
    align-items: flex-start;
  }

  .question-card .card-body {
    padding: 20px;
  }

  .q-nav {
    flex-direction: column;
  }

  .summary-stats {
    gap: 24px;
  }
}
</style>
