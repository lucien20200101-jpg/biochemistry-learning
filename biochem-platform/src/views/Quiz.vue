<script setup>
import { computed, ref, watch } from 'vue'
import { questionBank, questionTypeLabel } from '../data/questionBank'
import { useQuizStore } from '../stores/quizStore'

const store = useQuizStore()
store.hydrate()

const questions = questionBank
const totalCount = questions.length

const currentQuestion = computed(() => questions[store.currentIndex] ?? questions[0])
const response = ref(getInitialResponse(currentQuestion.value))
const selectedWrongId = ref(null)

const isObjectiveType = (type) =>
  ['single', 'multiple', 'true_false', 'fill_blank'].includes(type)

const isSubjectiveType = (type) => ['term_definition', 'short_answer'].includes(type)

function getInitialResponse(question) {
  const saved = store.answers?.[question.id]?.response
  if (saved !== undefined) {
    return JSON.parse(JSON.stringify(saved))
  }
  if (question.type === 'multiple') return []
  if (question.type === 'fill_blank') return question.blanks?.map(() => '') ?? []
  if (question.type === 'term_definition' || question.type === 'short_answer') return ''
  return null
}

watch(
  () => currentQuestion.value?.id,
  () => {
    response.value = getInitialResponse(currentQuestion.value)
  }
)

const submission = computed(() => store.submissions[currentQuestion.value?.id])
const hasSubmitted = computed(() => Boolean(submission.value))
const answeredCount = computed(() => store.answeredCount)
const wrongCount = computed(() => store.wrongCount)
const progressPercent = computed(() =>
  totalCount === 0 ? 0 : Math.round((answeredCount.value / totalCount) * 100)
)

const keywordResult = computed(() => {
  const detail = submission.value?.detail
  if (!detail || !detail.keywords) {
    return { matched: [], total: 0, percent: 0 }
  }
  const total = detail.keywords.length
  const matched = detail.matched ?? []
  const percent = total === 0 ? 0 : Math.round((matched.length / total) * 100)
  return { matched, total, percent }
})

const wrongQuestions = computed(() =>
  store.wrongIds
    .map((id) => questions.find((question) => question.id === id))
    .filter(Boolean)
)

const selectedWrongQuestion = computed(() => {
  if (!wrongQuestions.value.length) return null
  const active =
    wrongQuestions.value.find((question) => question.id === selectedWrongId.value) ??
    wrongQuestions.value[0]
  selectedWrongId.value = active.id
  return active
})

const currentMark = computed(
  () => store.subjectiveMarks[currentQuestion.value?.id] ?? 'unmarked'
)

const submitLabel = computed(() =>
  hasSubmitted.value ? '已提交' : '提交答案并查看解析'
)

const objectiveLabel = computed(() => {
  if (!hasSubmitted.value) return ''
  if (submission.value?.correct === true) return '回答正确'
  if (submission.value?.correct === false) return '回答错误'
  return ''
})

const objectiveStatusClass = computed(() => {
  if (!hasSubmitted.value) return ''
  return submission.value?.correct ? 'status-success' : 'status-error'
})

const formatOption = (optionId) => {
  const option = currentQuestion.value.options?.find((item) => item.id === optionId)
  return option ? `${option.id}. ${option.text}` : optionId
}

const submitCurrent = () => {
  const question = currentQuestion.value
  if (!question) return
  const detail = store.evaluateQuestion(question, response.value)
  if (isObjectiveType(question.type)) {
    store.submitObjective(question, response.value, detail)
  } else {
    store.submitSubjective(question, response.value, detail)
  }
}

const goPrev = () => {
  if (store.currentIndex > 0) {
    store.setCurrentIndex(store.currentIndex - 1)
  }
}

const goNext = () => {
  if (store.currentIndex < totalCount - 1) {
    store.setCurrentIndex(store.currentIndex + 1)
  }
}

const jumpTo = (index) => {
  store.setCurrentIndex(index)
}

const randomQuestion = () => {
  const index = Math.floor(Math.random() * totalCount)
  store.setCurrentIndex(index)
}

const resetAnswer = () => {
  response.value = getInitialResponse(currentQuestion.value)
}

const markSubjective = (status) => {
  if (!currentQuestion.value) return
  store.markSubjective(currentQuestion.value.id, status)
}
</script>

<template>
  <div class="quiz-page">
    <div class="container">
      <div class="page-header">
        <div>
          <h1 class="page-header-title">练习题库</h1>
          <p class="page-header-subtitle">
            多题型训练覆盖概念辨析、能量计算、调控机制与临床关联，支持错题本与进度追踪。
          </p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-primary" type="button" @click="randomQuestion">
            随机抽题
          </button>
          <button class="btn btn-outline" type="button" @click="resetAnswer">
            重置作答
          </button>
        </div>
      </div>

      <div class="quiz-layout">
        <section class="card quiz-main">
          <div class="card-body">
            <div class="quiz-meta">
              <span class="badge badge-primary">
                {{ questionTypeLabel[currentQuestion.type] }}
              </span>
              <span class="text-muted">第 {{ store.currentIndex + 1 }} / {{ totalCount }} 题</span>
            </div>
            <h2 class="quiz-stem">{{ currentQuestion.stem }}</h2>

            <div class="quiz-input">
              <div v-if="currentQuestion.type === 'single'" class="option-list">
                <label
                  v-for="option in currentQuestion.options"
                  :key="option.id"
                  class="option-item"
                >
                  <input
                    v-model="response"
                    type="radio"
                    class="option-input"
                    :value="option.id"
                  />
                  <span>{{ option.id }}. {{ option.text }}</span>
                </label>
              </div>

              <div v-else-if="currentQuestion.type === 'multiple'" class="option-list">
                <label
                  v-for="option in currentQuestion.options"
                  :key="option.id"
                  class="option-item"
                >
                  <input
                    v-model="response"
                    type="checkbox"
                    class="option-input"
                    :value="option.id"
                  />
                  <span>{{ option.id }}. {{ option.text }}</span>
                </label>
              </div>

              <div v-else-if="currentQuestion.type === 'true_false'" class="option-list">
                <label
                  v-for="option in currentQuestion.options"
                  :key="option.id"
                  class="option-item"
                >
                  <input
                    v-model="response"
                    type="radio"
                    class="option-input"
                    :value="option.id"
                  />
                  <span>{{ option.text }}</span>
                </label>
              </div>

              <div v-else-if="currentQuestion.type === 'fill_blank'" class="blank-list">
                <div v-for="(blank, index) in currentQuestion.blanks" :key="blank.id">
                  <label class="blank-label">
                    {{ blank.label }}
                    <input
                      v-model="response[index]"
                      type="text"
                      class="input"
                      placeholder="请输入答案"
                    />
                  </label>
                </div>
              </div>

              <div
                v-else-if="
                  currentQuestion.type === 'term_definition' ||
                  currentQuestion.type === 'short_answer'
                "
                class="subjective-box"
              >
                <textarea
                  v-model="response"
                  class="input textarea"
                  rows="5"
                  placeholder="请输入你的作答要点，建议分点书写"
                ></textarea>
              </div>
            </div>

            <div class="quiz-actions">
              <button class="btn btn-outline" type="button" @click="goPrev" :disabled="store.currentIndex === 0">
                上一题
              </button>
              <button
                class="btn btn-primary"
                type="button"
                @click="submitCurrent"
                :disabled="hasSubmitted"
              >
                {{ submitLabel }}
              </button>
              <button
                class="btn btn-outline"
                type="button"
                @click="goNext"
                :disabled="store.currentIndex >= totalCount - 1"
              >
                下一题
              </button>
            </div>

            <div v-if="hasSubmitted" class="quiz-feedback">
              <div v-if="isObjectiveType(currentQuestion.type)" class="result-panel">
                <span class="result-status" :class="objectiveStatusClass">
                  {{ objectiveLabel }}
                </span>
                <div class="result-detail">
                  <div>
                    <span class="text-muted">你的答案：</span>
                    <span class="result-answer">
                      <template v-if="currentQuestion.type === 'multiple'">
                        {{ submission.detail.selected.map(formatOption).join('，') || '未作答' }}
                      </template>
                      <template v-else-if="currentQuestion.type === 'fill_blank'">
                        {{ submission.detail.blanks.map((item) => item.userValue || '未作答').join('；') }}
                      </template>
                      <template v-else>
                        {{ formatOption(submission.detail.selected) || '未作答' }}
                      </template>
                    </span>
                  </div>
                  <div>
                    <span class="text-muted">标准答案：</span>
                    <span class="result-answer">{{ currentQuestion.answer.standard }}</span>
                  </div>
                </div>
              </div>

              <div v-if="isSubjectiveType(currentQuestion.type)" class="subjective-result">
                <div class="coverage-header">
                  <span class="badge">关键词覆盖</span>
                  <span class="coverage-text">{{ keywordResult.matched.length }} / {{ keywordResult.total }}</span>
                </div>
                <div class="coverage-bar">
                  <div class="coverage-fill" :style="{ width: `${keywordResult.percent}%` }"></div>
                </div>
                <div class="coverage-tags">
                  <span
                    v-for="keyword in keywordResult.matched"
                    :key="keyword"
                    class="badge badge-primary"
                  >
                    {{ keyword }}
                  </span>
                  <span v-if="!keywordResult.matched.length" class="text-muted">暂无命中关键词</span>
                </div>
                <div class="manual-check">
                  <span class="text-muted">主观题需要手动标记掌握情况：</span>
                  <div class="manual-actions">
                    <button
                      class="btn btn-outline"
                      type="button"
                      @click="markSubjective('wrong')"
                    >
                      我答错了
                    </button>
                    <button
                      class="btn btn-primary"
                      type="button"
                      @click="markSubjective('mastered')"
                    >
                      我已掌握
                    </button>
                  </div>
                  <div class="manual-status" v-if="currentMark !== 'unmarked'">
                    当前标记：{{ currentMark === 'mastered' ? '已掌握' : '答错' }}
                  </div>
                </div>
                <div class="result-detail">
                  <div>
                    <span class="text-muted">标准答案：</span>
                    <span class="result-answer">{{ currentQuestion.answer.standard }}</span>
                  </div>
                </div>
              </div>

              <div class="analysis-panel">
                <h3>解析说明</h3>
                <p>{{ currentQuestion.explanation }}</p>
              </div>
              <div class="knowledge-panel">
                <h3>知识点梳理</h3>
                <div class="knowledge-list">
                  <div v-for="item in currentQuestion.knowledge" :key="item.title" class="knowledge-card">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside class="quiz-side">
          <div class="card">
            <div class="card-body">
              <h3 class="side-title">学习进度</h3>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
              </div>
              <div class="progress-stats">
                <span>已完成 {{ answeredCount }} / {{ totalCount }} 题</span>
                <span>错题 {{ wrongCount }} 题</span>
              </div>
              <div class="question-nav">
                <button
                  v-for="(question, index) in questions"
                  :key="question.id"
                  type="button"
                  class="nav-pill"
                  :class="{ active: index === store.currentIndex }"
                  @click="jumpTo(index)"
                >
                  {{ index + 1 }}
                </button>
              </div>
            </div>
          </div>

          <div class="card wrong-card">
            <div class="card-body">
              <h3 class="side-title">错题本</h3>
              <p class="text-muted">点击题目查看标准答案与解析</p>
              <div v-if="wrongQuestions.length" class="wrong-list">
                <button
                  v-for="question in wrongQuestions"
                  :key="question.id"
                  type="button"
                  class="wrong-item"
                  :class="{ active: question.id === selectedWrongId }"
                  @click="selectedWrongId = question.id"
                >
                  <span class="wrong-type">{{ questionTypeLabel[question.type] }}</span>
                  <span class="wrong-stem">{{ question.stem }}</span>
                </button>
              </div>
              <div v-else class="empty-state">
                <p>暂时没有错题记录</p>
              </div>
            </div>
          </div>

          <div v-if="selectedWrongQuestion" class="card wrong-detail">
            <div class="card-body">
              <h3 class="side-title">错题详情</h3>
              <p class="wrong-stem-detail">{{ selectedWrongQuestion.stem }}</p>
              <div class="result-detail">
                <span class="text-muted">标准答案：</span>
                <span class="result-answer">{{ selectedWrongQuestion.answer.standard }}</span>
              </div>
              <div class="analysis-panel">
                <h4>解析说明</h4>
                <p>{{ selectedWrongQuestion.explanation }}</p>
              </div>
              <div class="knowledge-panel">
                <h4>知识点梳理</h4>
                <div class="knowledge-list">
                  <div
                    v-for="item in selectedWrongQuestion.knowledge"
                    :key="item.title"
                    class="knowledge-card"
                  >
                    <h5>{{ item.title }}</h5>
                    <p>{{ item.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-layout {
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.quiz-main {
  position: relative;
}

.quiz-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.quiz-stem {
  font-size: 1.375rem;
  margin-bottom: 20px;
  line-height: 1.5;
}

.option-list {
  display: grid;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  cursor: pointer;
}

.option-item:hover {
  border-color: var(--border-hover);
}

.option-input {
  accent-color: var(--primary);
}

.blank-list {
  display: grid;
  gap: 16px;
}

.blank-label {
  display: grid;
  gap: 8px;
  font-weight: 500;
  color: var(--text);
}

.subjective-box .textarea {
  min-height: 140px;
  resize: vertical;
}

.quiz-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.quiz-feedback {
  margin-top: 28px;
  border-top: 1px solid var(--border);
  padding-top: 24px;
  display: grid;
  gap: 20px;
}

.result-panel,
.subjective-result {
  background: var(--bg-secondary);
  border-radius: var(--radius);
  padding: 16px;
  display: grid;
  gap: 12px;
}

.result-status {
  font-weight: 600;
}

.status-success {
  color: var(--success);
}

.status-error {
  color: var(--destructive);
}

.result-detail {
  display: grid;
  gap: 8px;
  font-size: 0.9rem;
}

.result-answer {
  color: var(--text);
  font-weight: 600;
}

.coverage-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.coverage-bar {
  width: 100%;
  height: 8px;
  background: var(--border);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.coverage-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), #60a5fa);
}

.coverage-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.manual-check {
  display: grid;
  gap: 12px;
}

.manual-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.manual-status {
  font-weight: 600;
}

.analysis-panel,
.knowledge-panel {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
}

.analysis-panel h3,
.knowledge-panel h3 {
  margin-bottom: 8px;
  font-size: 1rem;
}

.knowledge-list {
  display: grid;
  gap: 12px;
}

.knowledge-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
}

.knowledge-card h4,
.knowledge-card h5 {
  font-size: 0.95rem;
  margin-bottom: 6px;
}

.quiz-side {
  display: grid;
  gap: 20px;
}

.side-title {
  margin-bottom: 12px;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: var(--border);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #22c55e);
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 14px;
}

.question-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.nav-pill {
  width: 36px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--card);
  cursor: pointer;
  font-weight: 600;
}

.nav-pill.active {
  border-color: var(--primary);
  background: var(--primary-light);
  color: var(--primary);
}

.wrong-card .card-body {
  display: grid;
  gap: 10px;
}

.wrong-list {
  display: grid;
  gap: 10px;
}

.wrong-item {
  text-align: left;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--card);
  cursor: pointer;
  display: grid;
  gap: 6px;
}

.wrong-item.active {
  border-color: var(--primary);
  background: var(--primary-light);
}

.wrong-type {
  font-size: 0.75rem;
  color: var(--primary);
  font-weight: 600;
}

.wrong-stem {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 12px 0;
  color: var(--muted);
  font-size: 0.85rem;
}

.wrong-detail .analysis-panel,
.wrong-detail .knowledge-panel {
  margin-top: 12px;
}

.wrong-stem-detail {
  font-weight: 600;
  margin-bottom: 10px;
}

@media (max-width: 1024px) {
  .quiz-layout {
    grid-template-columns: 1fr;
  }
}
</style>
