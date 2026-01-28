<script setup>
import { ref, computed, onUnmounted, watch } from 'vue'
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
  Flag,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  BookOpen,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Tag,
  Calendar,
  Hash,
  Eye,
  Sparkles
} from 'lucide-vue-next'

const store = useQuizStore()

// --- local UI state ---
const activeTab = ref('practice') // 'practice' | 'wrong'
const timer = ref(0)
let timerInterval = null

// 错题本增强状态
const searchQuery = ref('')
const filterType = ref('all') // 'all' | 'single' | 'truefalse'
const filterChapter = ref('all')
const sortBy = ref('lastWrong') // 'lastWrong' | 'wrongCount' | 'firstWrong'
const showMastered = ref(false)

// Drawer 状态
const drawerOpen = ref(false)
const selectedWrongId = ref(null)

// 获取选中的错题详情
const selectedWrongRecord = computed(() => {
  if (!selectedWrongId.value) return null
  return store.getWrongRecord(selectedWrongId.value)
})

// 筛选和排序后的错题列表
const filteredWrongQuestions = computed(() => {
  let list = showMastered.value
    ? store.allWrongRecords
    : store.wrongQuestions

  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(q =>
      q.stem.toLowerCase().includes(query) ||
      q.chapter.toLowerCase().includes(query) ||
      q.topic.toLowerCase().includes(query) ||
      q.knowledgePoints.some(kp => kp.toLowerCase().includes(query))
    )
  }

  // 题型过滤
  if (filterType.value !== 'all') {
    list = list.filter(q => q.type === filterType.value)
  }

  // 章节过滤
  if (filterChapter.value !== 'all') {
    list = list.filter(q => q.chapter === filterChapter.value)
  }

  // 排序
  list = [...list].sort((a, b) => {
    switch (sortBy.value) {
      case 'lastWrong':
        return b.lastWrongAt - a.lastWrongAt
      case 'wrongCount':
        return b.wrongCount - a.wrongCount
      case 'firstWrong':
        return a.firstWrongAt - b.firstWrongAt
      default:
        return 0
    }
  })

  return list
})

// 获取所有章节（用于筛选）
const availableChapters = computed(() => {
  const chapters = new Set()
  store.allWrongRecords.forEach(q => {
    if (q.chapter) chapters.add(q.chapter)
  })
  return Array.from(chapters)
})

// 格式化时间
function formatTime(timestamp) {
  if (!timestamp) return '未知'
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`

  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 获取掌握度标签
function getMasteryLevel(record) {
  if (record.status === 'mastered') return { label: '已掌握', class: 'mastery-mastered' }
  if (record.wrongCount >= 5) return { label: '需加强', class: 'mastery-weak' }
  if (record.wrongCount >= 3) return { label: '待巩固', class: 'mastery-medium' }
  return { label: '初次错误', class: 'mastery-new' }
}

// 打开错题详情
function openWrongDetail(id) {
  selectedWrongId.value = id
  drawerOpen.value = true
}

// 关闭抽屉
function closeDrawer() {
  drawerOpen.value = false
  selectedWrongId.value = null
}

// 从详情中开始单题训练
function startPracticeFromDetail() {
  if (!selectedWrongId.value) return
  closeDrawer()
  store.startSingleWrongQuiz(selectedWrongId.value)
  startTimer()
}

// 从详情中标记为已掌握
function markMasteredFromDetail() {
  if (!selectedWrongId.value) return
  store.markAsMastered(selectedWrongId.value)
  closeDrawer()
}

// 从详情中移除错题
function removeFromDetail() {
  if (!selectedWrongId.value) return
  store.removeWrongQuestion(selectedWrongId.value)
  closeDrawer()
}

// 获取题型显示文本
function getTypeLabel(type) {
  switch (type) {
    case 'single': return '单选题'
    case 'truefalse': return '判断题'
    case 'multi': return '多选题'
    default: return '题目'
  }
}

// 获取正确答案显示文本
function getAnswerText(record) {
  if (!record) return ''
  if (record.type === 'truefalse') {
    return record.correctAnswer === 0 ? '正确' : '错误'
  }
  const label = String.fromCharCode(65 + record.correctAnswer)
  const text = record.options[record.correctAnswer] || ''
  return `${label}. ${text}`
}

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
          <!-- 错题本头部统计 -->
          <div class="wrong-header-stats">
            <div class="wrong-stat-item">
              <span class="wrong-stat-num">{{ store.wrongStats.total }}</span>
              <span class="wrong-stat-label">待复习</span>
            </div>
            <div class="wrong-stat-item">
              <span class="wrong-stat-num mastered-num">{{ store.wrongStats.mastered }}</span>
              <span class="wrong-stat-label">已掌握</span>
            </div>
          </div>

          <!-- Wrong Questions Exist -->
          <template v-if="store.allWrongRecords.length > 0">
            <!-- 操作按钮 -->
            <div class="wrong-actions">
              <button
                class="btn btn-primary"
                @click="handleStartWrongQuiz()"
                :disabled="store.wrongQuestions.length === 0"
              >
                <RefreshCw :size="16" :stroke-width="2" />
                复习全部 ({{ store.wrongQuestions.length }})
              </button>
              <button class="btn btn-outline" @click="store.clearWrongList()">
                <Trash2 :size="16" :stroke-width="2" />
                清空待复习
              </button>
            </div>

            <!-- 搜索和筛选 -->
            <div class="wrong-filters">
              <div class="search-box">
                <Search :size="16" :stroke-width="2" class="search-icon" />
                <input
                  type="text"
                  class="input search-input"
                  placeholder="搜索题干、知识点..."
                  v-model="searchQuery"
                />
              </div>

              <div class="filter-group">
                <select class="filter-select" v-model="filterType">
                  <option value="all">全部题型</option>
                  <option value="single">单选题</option>
                  <option value="truefalse">判断题</option>
                </select>

                <select class="filter-select" v-model="filterChapter">
                  <option value="all">全部章节</option>
                  <option v-for="ch in availableChapters" :key="ch" :value="ch">{{ ch }}</option>
                </select>

                <select class="filter-select" v-model="sortBy">
                  <option value="lastWrong">最近错误</option>
                  <option value="wrongCount">错误次数</option>
                  <option value="firstWrong">最早错误</option>
                </select>

                <label class="show-mastered-toggle">
                  <input type="checkbox" v-model="showMastered" />
                  <span>显示已掌握</span>
                </label>
              </div>
            </div>

            <!-- 错题列表 -->
            <div class="wrong-list-enhanced">
              <div
                v-for="record in filteredWrongQuestions"
                :key="record.id"
                class="card card-hover wrong-item-enhanced"
                @click="openWrongDetail(record.id)"
              >
                <div class="card-body wrong-body-enhanced">
                  <div class="wrong-main">
                    <div class="wrong-meta-enhanced">
                      <span class="badge type-badge">{{ getTypeLabel(record.type) }}</span>
                      <span class="badge">{{ record.chapter }}</span>
                      <span class="badge">{{ record.topic }}</span>
                      <span class="mastery-badge" :class="getMasteryLevel(record).class">
                        {{ getMasteryLevel(record).label }}
                      </span>
                    </div>
                    <p class="wrong-stem">{{ record.stem }}</p>
                    <div class="wrong-info-row">
                      <span class="wrong-info-item">
                        <Hash :size="12" :stroke-width="2" />
                        错误 {{ record.wrongCount }} 次
                      </span>
                      <span class="wrong-info-item">
                        <Calendar :size="12" :stroke-width="2" />
                        {{ formatTime(record.lastWrongAt) }}
                      </span>
                      <span class="wrong-info-item kp-preview" v-if="record.knowledgePoints.length > 0">
                        <Tag :size="12" :stroke-width="2" />
                        {{ record.knowledgePoints.slice(0, 2).join('、') }}
                        <span v-if="record.knowledgePoints.length > 2">...</span>
                      </span>
                    </div>
                  </div>
                  <div class="wrong-actions-col">
                    <button
                      class="btn btn-ghost btn-sm"
                      @click.stop="store.removeWrongQuestion(record.id)"
                      title="移除"
                    >
                      <X :size="16" :stroke-width="2" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- 筛选无结果 -->
              <div v-if="filteredWrongQuestions.length === 0" class="filter-empty">
                <Search :size="32" :stroke-width="1.5" />
                <p>没有找到匹配的错题</p>
                <button class="btn btn-ghost btn-sm" @click="searchQuery = ''; filterType = 'all'; filterChapter = 'all'">
                  清除筛选条件
                </button>
              </div>
            </div>
          </template>

          <!-- Wrong Empty State -->
          <div v-else class="empty-state">
            <CircleCheck :size="48" :stroke-width="1" />
            <h3>暂无错题</h3>
            <p>答错的题目会出现在这里供你复习。现在去练习吧！</p>
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

              <h2>{{ store.isWrongQuizMode ? '错题复习完成' : '练习完成' }}</h2>
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

              <!-- 错题训练增强统计 -->
              <template v-if="store.isWrongQuizMode && store.wrongQuizStats">
                <div class="wrong-quiz-stats">
                  <div class="wrong-quiz-stat-row">
                    <div class="wrong-quiz-stat">
                      <CheckCircle2 :size="16" :stroke-width="2" class="stat-icon-correct" />
                      <span>{{ store.wrongQuizStats.correct }} 题答对</span>
                    </div>
                    <div class="wrong-quiz-stat">
                      <XCircle :size="16" :stroke-width="2" class="stat-icon-wrong" />
                      <span>{{ store.wrongQuizStats.stillWrong }} 题仍需练习</span>
                    </div>
                  </div>

                  <!-- 批量标记已掌握 -->
                  <div v-if="store.wrongQuizStats.correctIds.length > 0" class="mastery-action-box">
                    <div class="mastery-action-info">
                      <Sparkles :size="16" :stroke-width="2" />
                      <span>你答对了 {{ store.wrongQuizStats.correctIds.length }} 道错题，是否标记为已掌握？</span>
                    </div>
                    <button
                      class="btn btn-outline btn-sm"
                      @click="store.markMultipleAsMastered(store.wrongQuizStats.correctIds)"
                    >
                      <CheckCircle2 :size="14" :stroke-width="2" />
                      全部标记为已掌握
                    </button>
                  </div>
                </div>
              </template>

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

    <!-- ==================== DRAWER 错题详情 ==================== -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="drawerOpen" class="drawer-overlay" @click="closeDrawer">
          <div class="drawer-container" @click.stop>
            <!-- Drawer Header -->
            <div class="drawer-header">
              <div class="drawer-title-row">
                <span class="badge type-badge">{{ getTypeLabel(selectedWrongRecord?.type) }}</span>
                <span class="badge">{{ selectedWrongRecord?.chapter }}</span>
                <span class="badge">{{ selectedWrongRecord?.topic }}</span>
              </div>
              <button class="drawer-close" @click="closeDrawer">
                <X :size="20" :stroke-width="2" />
              </button>
            </div>

            <!-- Drawer Body -->
            <div class="drawer-body" v-if="selectedWrongRecord">
              <!-- 题目内容 -->
              <div class="drawer-section">
                <h4 class="drawer-section-title">
                  <FileText :size="16" :stroke-width="2" />
                  题目
                </h4>
                <p class="drawer-question-text">{{ selectedWrongRecord.stem }}</p>

                <!-- 选项 -->
                <div class="drawer-options">
                  <div
                    v-for="(opt, idx) in selectedWrongRecord.options"
                    :key="idx"
                    class="drawer-option"
                    :class="{ 'drawer-option-correct': idx === selectedWrongRecord.correctAnswer }"
                  >
                    <span class="drawer-option-label">
                      {{ selectedWrongRecord.type === 'truefalse' ? (idx === 0 ? 'T' : 'F') : String.fromCharCode(65 + idx) }}
                    </span>
                    <span class="drawer-option-text">{{ opt }}</span>
                    <CheckCircle2
                      v-if="idx === selectedWrongRecord.correctAnswer"
                      :size="16"
                      :stroke-width="2"
                      class="correct-icon"
                    />
                  </div>
                </div>
              </div>

              <!-- 正确答案 -->
              <div class="drawer-section answer-section">
                <h4 class="drawer-section-title">
                  <Check :size="16" :stroke-width="2" />
                  正确答案
                </h4>
                <div class="drawer-answer">
                  {{ getAnswerText(selectedWrongRecord) }}
                </div>
              </div>

              <!-- 解析 -->
              <div class="drawer-section">
                <h4 class="drawer-section-title">
                  <BookOpen :size="16" :stroke-width="2" />
                  解析
                </h4>
                <p class="drawer-explanation">{{ selectedWrongRecord.explanation }}</p>
              </div>

              <!-- 知识点 -->
              <div class="drawer-section">
                <h4 class="drawer-section-title">
                  <Tag :size="16" :stroke-width="2" />
                  相关知识点
                </h4>
                <div class="drawer-knowledge-points">
                  <span
                    v-for="kp in selectedWrongRecord.knowledgePoints"
                    :key="kp"
                    class="kp-badge"
                  >
                    {{ kp }}
                  </span>
                </div>
              </div>

              <!-- 错题信息 -->
              <div class="drawer-section drawer-meta-section">
                <div class="drawer-meta-row">
                  <span class="drawer-meta-item">
                    <Hash :size="14" :stroke-width="2" />
                    累计错误 {{ selectedWrongRecord.wrongCount }} 次
                  </span>
                  <span class="drawer-meta-item">
                    <Calendar :size="14" :stroke-width="2" />
                    最近错误：{{ formatTime(selectedWrongRecord.lastWrongAt) }}
                  </span>
                </div>
                <div class="mastery-status">
                  <span class="mastery-badge" :class="getMasteryLevel(selectedWrongRecord).class">
                    {{ getMasteryLevel(selectedWrongRecord).label }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Drawer Footer -->
            <div class="drawer-footer">
              <button class="btn btn-primary" @click="startPracticeFromDetail">
                <Play :size="16" :stroke-width="2" />
                再练一次
              </button>
              <button
                v-if="selectedWrongRecord?.status !== 'mastered'"
                class="btn btn-outline"
                @click="markMasteredFromDetail"
              >
                <CheckCircle2 :size="16" :stroke-width="2" />
                标记已掌握
              </button>
              <button
                v-else
                class="btn btn-outline"
                @click="store.unmarkMastered(selectedWrongId); closeDrawer()"
              >
                <RefreshCw :size="16" :stroke-width="2" />
                取消已掌握
              </button>
              <button class="btn btn-ghost" @click="removeFromDetail">
                <Trash2 :size="16" :stroke-width="2" />
                移除
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
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

  .wrong-filters {
    flex-direction: column;
    gap: 12px;
  }

  .filter-group {
    flex-wrap: wrap;
  }

  .drawer-container {
    width: 100%;
    max-width: 100%;
    border-radius: 0;
  }

  .drawer-footer {
    flex-wrap: wrap;
  }
}

/* ==================== 错题本增强样式 ==================== */

/* 错题本头部统计 */
.wrong-header-stats {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
}

.wrong-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.wrong-stat-num {
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--text);
  letter-spacing: -0.02em;
}

.wrong-stat-num.mastered-num {
  color: var(--success);
}

.wrong-stat-label {
  font-size: 0.75rem;
  color: var(--muted);
}

/* 搜索和筛选 */
.wrong-filters {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.search-box {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-light);
  pointer-events: none;
}

.search-input {
  padding-left: 40px;
}

.filter-group {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select {
  padding: 8px 12px;
  font-size: 0.8125rem;
  font-family: var(--font-sans);
  color: var(--text);
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.filter-select:focus {
  outline: none;
  border-color: var(--text);
}

.show-mastered-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: var(--muted);
  cursor: pointer;
  user-select: none;
}

.show-mastered-toggle input {
  accent-color: var(--primary);
}

/* 增强版错题列表 */
.wrong-list-enhanced {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.wrong-item-enhanced {
  cursor: pointer;
  transition: all var(--transition-fast);
}

.wrong-item-enhanced:hover {
  transform: translateY(-1px);
}

.wrong-body-enhanced {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
}

.wrong-main {
  flex: 1;
  min-width: 0;
}

.wrong-meta-enhanced {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
  align-items: center;
}

.type-badge {
  background-color: var(--primary-muted);
  color: var(--text-secondary);
}

.mastery-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-size: 0.6875rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.mastery-new {
  background-color: #dbeafe;
  color: #1e40af;
}

.mastery-medium {
  background-color: #fef3c7;
  color: #92400e;
}

.mastery-weak {
  background-color: #fee2e2;
  color: #991b1b;
}

.mastery-mastered {
  background-color: #dcfce7;
  color: #166534;
}

.wrong-stem {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

.wrong-info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.wrong-info-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: var(--muted);
}

.kp-preview {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wrong-actions-col {
  flex-shrink: 0;
}

.filter-empty {
  text-align: center;
  padding: 48px 24px;
  color: var(--muted);
}

.filter-empty svg {
  margin: 0 auto 12px;
  opacity: 0.5;
}

.filter-empty p {
  margin-bottom: 16px;
}

/* ==================== Drawer 样式 ==================== */

.drawer-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.drawer-container {
  width: 100%;
  max-width: 520px;
  height: 100%;
  background-color: var(--card);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.drawer-title-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.drawer-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  color: var(--muted);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.drawer-close:hover {
  background-color: var(--bg-secondary);
  color: var(--text);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.drawer-section {
  margin-bottom: 28px;
}

.drawer-section:last-child {
  margin-bottom: 0;
}

.drawer-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--muted);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.drawer-question-text {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text);
  margin-bottom: 16px;
}

.drawer-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.drawer-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.drawer-option-correct {
  background-color: #f0fdf4;
  border: 1px solid #86efac;
}

.drawer-option-label {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted);
}

.drawer-option-correct .drawer-option-label {
  background-color: #dcfce7;
  color: #166534;
}

.drawer-option-text {
  flex: 1;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.drawer-option-correct .drawer-option-text {
  color: var(--text);
}

.correct-icon {
  flex-shrink: 0;
  color: var(--success);
}

.answer-section {
  background-color: #f0fdf4;
  padding: 16px;
  border-radius: var(--radius);
  border: 1px solid #bbf7d0;
}

.answer-section .drawer-section-title {
  color: #166534;
}

.drawer-answer {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #166534;
  line-height: 1.6;
}

.drawer-explanation {
  font-size: 0.9375rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.drawer-knowledge-points {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.kp-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
}

.drawer-meta-section {
  background-color: var(--bg-secondary);
  padding: 16px;
  border-radius: var(--radius);
}

.drawer-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
}

.drawer-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: var(--muted);
}

.mastery-status {
  display: flex;
  align-items: center;
}

.drawer-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

/* Drawer 过渡动画 */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity var(--transition-base);
}

.drawer-enter-active .drawer-container,
.drawer-leave-active .drawer-container {
  transition: transform var(--transition-base);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .drawer-container,
.drawer-leave-to .drawer-container {
  transform: translateX(100%);
}

/* ==================== 错题训练结果增强 ==================== */

.wrong-quiz-stats {
  width: 100%;
  margin-bottom: 20px;
}

.wrong-quiz-stat-row {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 16px;
}

.wrong-quiz-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.stat-icon-correct {
  color: var(--success);
}

.stat-icon-wrong {
  color: var(--destructive);
}

.mastery-action-box {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.mastery-action-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.mastery-action-info svg {
  color: var(--warning);
}
</style>
