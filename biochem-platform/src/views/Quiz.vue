<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useQuizStore } from '../stores/quiz'
import {
  FileText,
  Briefcase,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  RefreshCw,
  Trash2,
  CircleCheck,
  Frown,
  Meh,
  Flag
} from 'lucide-vue-next'

const store = useQuizStore()

// --- local UI state ---
const activeTab = ref('practice') // 'practice' | 'wrong'
const timer = ref(0)
let timerInterval = null

function startTimer() {
  stopTimer()
  timerInterval = setInterval(() => {
    if (store.startTime && !store.endTime) {
      timer.value = Math.floor((Date.now() - store.startTime) / 1000)
    }
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

onUnmounted(() => stopTimer())

// --- computed ---
const phase = computed(() => {
  if (store.showResults) return 'results'
  if (store.isQuizActive) return 'active'
  return 'landing'
})

const formattedTime = computed(() => {
  const s = store.showResults ? store.elapsedSeconds : timer.value
  const min = Math.floor(s / 60)
  const sec = s % 60
  return `${min}:${sec.toString().padStart(2, '0')}`
})

const topicsByChapter = computed(() => {
  const map = {}
  store.topics.forEach(t => {
    if (!map[t.chapter]) map[t.chapter] = []
    map[t.chapter].push(t)
  })
  return map
})

// --- handlers ---
function handleStartQuiz(count) {
  store.startQuiz(count)
  startTimer()
}

function handleStartTopicQuiz(topic) {
  const topicInfo = store.topics.find(t => t.name === topic)
  const count = topicInfo ? Math.min(topicInfo.count, 10) : 5
  store.startTopicQuiz(topic, count)
  startTimer()
}

function handleStartWrongQuiz() {
  store.startWrongQuiz()
  startTimer()
}

function handleFinishQuiz() {
  stopTimer()
  store.finishQuiz()
}

function handleBackToLanding() {
  stopTimer()
  store.resetQuiz()
}

function handleRetry() {
  store.resetQuiz()
  activeTab.value = 'practice'
}

function handleGoToWrong() {
  store.resetQuiz()
  activeTab.value = 'wrong'
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

      <!-- ==================== LANDING ==================== -->
      <template v-if="phase === 'landing'">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-header-row">
            <div>
              <h1>练习题库</h1>
              <p class="page-subtitle">
                精选练习题涵盖代谢路径的核心概念、能量计算与临床关联，检验你的学习成果。
              </p>
            </div>
            <div class="header-stats">
              <div class="header-stat">
                <span class="header-stat-num">{{ store.filteredQuestions.length }}</span>
                <span class="header-stat-label">题目</span>
              </div>
              <div class="header-stat">
                <span class="header-stat-num wrong-color">{{ store.wrongQuestions.length }}</span>
                <span class="header-stat-label">错题</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab Bar -->
        <div class="tab-bar">
          <button
            class="tab-btn"
            :class="{ 'tab-active': activeTab === 'practice' }"
            @click="activeTab = 'practice'"
          >
            <FileText :size="16" :stroke-width="2" />
            练习
          </button>
          <button
            class="tab-btn"
            :class="{ 'tab-active': activeTab === 'wrong' }"
            @click="activeTab = 'wrong'"
          >
            <Briefcase :size="16" :stroke-width="2" />
            错题本
            <span v-if="store.wrongQuestions.length > 0" class="tab-badge">
              {{ store.wrongQuestions.length }}
            </span>
          </button>
        </div>

        <!-- ===== Practice Tab ===== -->
        <template v-if="activeTab === 'practice'">
          <!-- Quick Actions -->
          <div class="quick-actions">
            <button class="btn btn-primary btn-lg" @click="handleStartQuiz(10)">
              <CircleCheck :size="18" :stroke-width="2" />
              随机10题
            </button>
            <button class="btn btn-outline btn-lg" @click="handleStartQuiz(store.filteredQuestions.length)">
              <FileText :size="18" :stroke-width="2" />
              全部 {{ store.filteredQuestions.length }} 题
            </button>
          </div>

          <!-- Topic Selection -->
          <div class="section-heading">
            <h2>按主题选择</h2>
            <p class="text-muted">选择特定主题进行针对性练习</p>
          </div>

          <div v-for="(chapterTopics, chapter) in topicsByChapter" :key="chapter" class="chapter-group">
            <div class="chapter-label">
              {{ chapter }}
            </div>
            <div class="topic-grid">
              <div
                v-for="topic in chapterTopics"
                :key="topic.name"
                class="card card-hover topic-card"
                @click="handleStartTopicQuiz(topic.name)"
              >
                <div class="card-body topic-body">
                  <div class="topic-info">
                    <h3 class="topic-name">{{ topic.name }}</h3>
                    <span class="badge">{{ topic.count }} Q</span>
                  </div>
                  <span class="btn btn-primary btn-sm">开始</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="store.filteredQuestions.length === 0" class="empty-state">
            <Flag :size="48" :stroke-width="1" />
            <h3>暂无题目</h3>
            <p>请稍后再来查看更新。</p>
          </div>
        </template>

        <!-- ===== Wrong Tab ===== -->
        <template v-if="activeTab === 'wrong'">
          <!-- Wrong Questions Exist -->
          <template v-if="store.wrongQuestions.length > 0">
            <div class="wrong-actions">
              <button class="btn btn-primary" @click="handleStartWrongQuiz()">
                <RefreshCw :size="16" :stroke-width="2" />
                复习全部 ({{ store.wrongQuestions.length }})
              </button>
              <button class="btn btn-outline" @click="store.clearWrongList()">
                <Trash2 :size="16" :stroke-width="2" />
                清空全部
              </button>
            </div>

            <div class="wrong-list">
              <div v-for="q in store.wrongQuestions" :key="q.id" class="card wrong-item">
                <div class="card-body wrong-body">
                  <div class="wrong-content">
                    <div class="wrong-meta">
                      <span class="badge">{{ q.chapter }}</span>
                      <span class="badge">{{ q.topic }}</span>
                    </div>
                    <p class="wrong-question">{{ q.question }}</p>
                  </div>
                  <button
                    class="btn btn-ghost btn-sm wrong-remove"
                    @click="store.removeWrongQuestion(q.id)"
                    title="移除"
                  >
                    <X :size="16" :stroke-width="2" />
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- Wrong Empty State -->
          <div v-else class="empty-state">
            <CircleCheck :size="48" :stroke-width="1" />
            <h3>暂无错题</h3>
            <p>答错的题目会出现在这里供你复习。答对后会自动移除。</p>
            <button class="btn btn-primary" style="margin-top: 20px" @click="activeTab = 'practice'">
              开始练习
            </button>
          </div>
        </template>
      </template>

      <!-- ==================== QUIZ ACTIVE ==================== -->
      <template v-if="phase === 'active'">
        <!-- Quiz Header -->
        <div class="quiz-header">
          <button class="btn btn-ghost btn-sm" @click="handleBackToLanding()">
            <ChevronLeft :size="14" :stroke-width="2" />
            返回
          </button>
          <div class="quiz-progress-info">
            <span class="timer-text">
              <Clock :size="14" :stroke-width="2" />
              {{ formattedTime }}
            </span>
            <span class="progress-text">
              {{ store.currentIndex + 1 }} / {{ store.totalQuestions }}
            </span>
            <span v-if="store.allFinished" class="score-text">
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
                <span class="badge">{{ store.currentQuestion.difficulty }}</span>
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
                  <span class="option-label">
                    {{ store.currentQuestion.type === 'truefalse' ? (idx === 0 ? 'T' : 'F') : getOptionLabel(idx) }}
                  </span>
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
                      <Check :size="14" :stroke-width="2.5" />
                      正确
                    </span>
                    <span v-else class="explanation-badge wrong">
                      <X :size="14" :stroke-width="2.5" />
                      错误 — 正确答案：{{ store.currentQuestion.type === 'truefalse' ? (store.currentQuestion.answer === 0 ? '正确' : '错误') : getOptionLabel(store.currentQuestion.answer) }}
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
              <ChevronLeft :size="14" :stroke-width="2" />
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
              v-if="store.currentIndex < store.totalQuestions - 1"
              class="btn btn-outline btn-sm"
              @click="store.nextQuestion()"
            >
              下一题
              <ChevronRight :size="14" :stroke-width="2" />
            </button>
            <button
              v-else
              class="btn btn-primary btn-sm"
              @click="handleFinishQuiz()"
            >
              完成
              <Check :size="14" :stroke-width="2" />
            </button>
          </div>

          <!-- Finish quiz early -->
          <div v-if="store.answeredCount > 0 && store.currentIndex < store.totalQuestions - 1" class="finish-early">
            <button class="btn btn-ghost btn-sm" @click="handleFinishQuiz()">
              提前结束
            </button>
          </div>
        </div>
      </template>

      <!-- ==================== RESULTS ==================== -->
      <template v-if="phase === 'results'">
        <div class="results-page">
          <div class="card results-card">
            <div class="card-body results-body">
              <!-- Result Icon -->
              <div class="results-icon" :class="store.accuracy >= 80 ? 'results-icon-good' : store.accuracy >= 50 ? 'results-icon-mid' : 'results-icon-bad'">
                <CircleCheck v-if="store.accuracy >= 80" :size="40" :stroke-width="1.5" />
                <Meh v-else-if="store.accuracy >= 50" :size="40" :stroke-width="1.5" />
                <Frown v-else :size="40" :stroke-width="1.5" />
              </div>

              <h2>练习完成</h2>
              <p class="results-subtitle">
                {{ store.accuracy >= 80 ? '表现优秀，继续保持！' : store.accuracy >= 50 ? '不错的成绩，继续努力！' : '继续学习，你会进步的！' }}
              </p>

              <!-- Stats -->
              <div class="results-stats">
                <div class="results-stat">
                  <div class="stat-num">{{ store.answeredCount }}</div>
                  <div class="stat-lbl">总题数</div>
                </div>
                <div class="results-stat">
                  <div class="stat-num correct-num">{{ store.correctCount }}</div>
                  <div class="stat-lbl">正确</div>
                </div>
                <div class="results-stat">
                  <div class="stat-num wrong-num">{{ store.wrongCount }}</div>
                  <div class="stat-lbl">错误</div>
                </div>
                <div class="results-stat">
                  <div class="stat-num accuracy-num">{{ store.accuracy }}%</div>
                  <div class="stat-lbl">正确率</div>
                </div>
              </div>

              <!-- Time -->
              <div class="results-time">
                <Clock :size="16" :stroke-width="2" />
                用时：{{ formattedTime }}
              </div>

              <!-- CTAs -->
              <div class="results-actions">
                <button class="btn btn-primary btn-lg" @click="handleRetry()">
                  <RefreshCw :size="18" :stroke-width="2" />
                  再来一次
                </button>
                <button
                  v-if="store.wrongQuestions.length > 0"
                  class="btn btn-outline btn-lg"
                  @click="handleGoToWrong()"
                >
                  <Briefcase :size="18" :stroke-width="2" />
                  查看错题 ({{ store.wrongQuestions.length }})
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
  padding-top: 16px;
  padding-bottom: 40px;
}

.page-header h1 {
  margin-bottom: 12px;
}

.page-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--muted);
  max-width: 560px;
}

.header-stats {
  display: flex;
  gap: 32px;
  flex-shrink: 0;
}

.header-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.header-stat-num {
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--text);
  letter-spacing: -0.02em;
}

.header-stat-label {
  font-size: 0.75rem;
  color: var(--muted);
}

.wrong-color {
  color: var(--destructive);
}

/* --- Tab Bar --- */
.tab-bar {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 32px;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: var(--font-sans);
  margin-bottom: -1px;
}

.tab-btn:hover {
  color: var(--text);
}

.tab-active {
  color: var(--text);
  border-bottom-color: var(--text);
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-size: 0.6875rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  background: var(--destructive);
  color: white;
}

/* --- Quick Actions --- */
.quick-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 48px;
}

/* --- Section Heading --- */
.section-heading {
  margin-bottom: 28px;
}

.section-heading h2 {
  margin-bottom: 8px;
}

/* --- Chapter Groups --- */
.chapter-group {
  margin-bottom: 32px;
}

.chapter-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--muted);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.topic-card {
  cursor: pointer;
}

.topic-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  gap: 16px;
}

.topic-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.topic-name {
  font-size: 0.9375rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* --- Wrong Tab --- */
.wrong-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
}

.wrong-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.wrong-body {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
}

.wrong-content {
  flex: 1;
  min-width: 0;
}

.wrong-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.wrong-question {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.wrong-remove {
  flex-shrink: 0;
  color: var(--muted-light);
}

.wrong-remove:hover {
  color: var(--destructive);
}

/* --- Empty State --- */
.empty-state {
  text-align: center;
  padding: 80px 24px;
}

.empty-state svg {
  margin: 0 auto 20px;
  color: var(--muted-light);
}

.empty-state h3 {
  margin-bottom: 8px;
  color: var(--text);
}

.empty-state p {
  color: var(--muted);
  font-size: 0.9375rem;
  max-width: 400px;
  margin: 0 auto;
}

/* --- Quiz Header --- */
.quiz-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-top: 0;
}

.quiz-progress-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--muted);
}

.timer-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.score-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
}

/* --- Progress Bar --- */
.progress-bar-track {
  width: 100%;
  height: 4px;
  background: var(--bg-secondary);
  border-radius: 2px;
  margin-bottom: 28px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--text);
  border-radius: 2px;
  transition: width var(--transition-slow);
}

/* --- Question Card --- */
.question-card .card-body {
  padding: 36px;
}

.q-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.q-text {
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.65;
  margin-bottom: 28px;
  color: var(--text);
}

/* --- Options --- */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
}

.option-btn {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
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
  border-color: var(--text);
  background: var(--bg-secondary);
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
  font-weight: 600;
  font-size: 0.8125rem;
  color: var(--muted);
  margin-top: 1px;
}

.option-text {
  padding-top: 3px;
}

/* Option States */
.option-selected {
  border-color: var(--text);
  background: var(--bg-secondary);
}

.option-selected .option-label {
  background: var(--text);
  color: var(--card);
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
  gap: 20px;
}

/* --- Explanation --- */
.explanation-box {
  border-radius: var(--radius);
  padding: 24px;
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
  margin-bottom: 12px;
}

.explanation-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: var(--radius-sm);
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
  line-height: 1.8;
  color: var(--text-secondary);
}

/* --- Q Navigation --- */
.q-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
  gap: 16px;
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
  border-color: var(--text);
  color: var(--text);
}

.dot-current {
  border-color: var(--text);
  background: var(--bg-secondary);
  color: var(--text);
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
  border-color: var(--text);
  background: var(--bg-secondary);
  color: var(--text);
  opacity: 0.6;
}

/* --- Finish Early --- */
.finish-early {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* --- Results Page --- */
.results-page {
  padding-top: 48px;
  display: flex;
  justify-content: center;
}

.results-card {
  max-width: 520px;
  width: 100%;
}

.results-body {
  text-align: center;
  padding: 56px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.results-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 24px;
}

.results-icon-good {
  background: #dcfce7;
  color: #166534;
}

.results-icon-mid {
  background: #fef9c3;
  color: #854d0e;
}

.results-icon-bad {
  background: #fee2e2;
  color: #991b1b;
}

.results-body h2 {
  margin-bottom: 8px;
}

.results-subtitle {
  font-size: 0.9375rem;
  color: var(--muted);
  margin-bottom: 36px;
}

.results-stats {
  display: flex;
  justify-content: center;
  gap: 36px;
  margin-bottom: 24px;
  width: 100%;
}

.results-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-num {
  font-size: 2rem;
  font-weight: 500;
  color: var(--text);
  letter-spacing: -0.02em;
}

.correct-num {
  color: var(--success);
}

.wrong-num {
  color: var(--destructive);
}

.accuracy-num {
  color: var(--text);
}

.stat-lbl {
  font-size: 0.8125rem;
  color: var(--muted);
}

.results-time {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: var(--muted);
  margin-bottom: 32px;
  padding: 10px 20px;
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
}

.results-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .topic-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .results-stats {
    gap: 24px;
  }

  .stat-num {
    font-size: 1.5rem;
  }
}

@media (max-width: 640px) {
  .page-header-row {
    flex-direction: column;
  }

  .header-stats {
    flex-direction: row;
    gap: 40px;
  }

  .topic-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    flex-direction: column;
  }

  .wrong-actions {
    flex-direction: column;
  }

  .question-card .card-body {
    padding: 24px;
  }

  .q-nav {
    flex-direction: column;
  }

  .results-body {
    padding: 40px 24px;
  }

  .results-stats {
    gap: 20px;
  }

  .results-actions {
    flex-direction: column;
    width: 100%;
  }

  .results-actions .btn {
    width: 100%;
  }

  .tab-btn {
    padding: 12px 16px;
    font-size: 0.8125rem;
  }
}
</style>
