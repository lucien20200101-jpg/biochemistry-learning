import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import allQuestions from '../data/questions.json'

const STORAGE_KEY = 'biochem-quiz-wrong-v2'

// 从题目生成知识点（基于 chapter 和 topic）
function generateKnowledgePoints(question) {
  const points = []
  if (question.chapter) points.push(question.chapter)
  if (question.topic) points.push(question.topic)
  // 从解析中提取关键术语作为额外知识点
  if (question.explanation) {
    const keywords = extractKeywords(question.explanation)
    points.push(...keywords.slice(0, 2))
  }
  return [...new Set(points)] // 去重
}

// 从解析文本中提取关键术语
function extractKeywords(text) {
  const patterns = [
    /([A-Z]{2,}[\-]?\d*)/g,  // 如 ATP, NADH, PFK-1
    /([\u4e00-\u9fa5]{2,6}酶)/g,  // 如 限速酶、脱氢酶
    /([\u4e00-\u9fa5]{2,4}循环)/g,  // 如 TCA循环
    /([\u4e00-\u9fa5]{2,6}作用)/g,  // 如 磷酸化作用
  ]
  const found = []
  patterns.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) found.push(...matches)
  })
  return [...new Set(found)].slice(0, 3)
}

// 将题目转换为错题记录格式
function questionToWrongRecord(question, existingRecord = null) {
  const now = Date.now()
  return {
    id: question.id,
    type: question.type || 'single',
    stem: question.question,
    options: question.options || [],
    correctAnswer: question.answer,
    explanation: question.explanation || '暂无解析，请参考教材相关章节。',
    knowledgePoints: generateKnowledgePoints(question),
    source: 'quiz',
    chapter: question.chapter || '',
    topic: question.topic || '',
    difficulty: question.difficulty || '基础',
    wrongCount: existingRecord ? existingRecord.wrongCount + 1 : 1,
    lastWrongAt: now,
    firstWrongAt: existingRecord ? existingRecord.firstWrongAt : now,
    status: 'active', // 'active' | 'mastered'
  }
}

// 加载错题记录
function loadWrongRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      // 尝试迁移旧版数据
      const oldData = localStorage.getItem('biochem-quiz-wrong')
      if (oldData) {
        const oldIds = JSON.parse(oldData)
        const records = oldIds.map(id => {
          const q = allQuestions.find(q => q.id === id)
          return q ? questionToWrongRecord(q) : null
        }).filter(Boolean)
        saveWrongRecords(records)
        return records
      }
      return []
    }
    return JSON.parse(raw)
  } catch {
    return []
  }
}

// 保存错题记录
function saveWrongRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

function shuffle(arr) {
  const pool = [...arr]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}

export const useQuizStore = defineStore('quiz', () => {
  // --- state ---
  const wrongRecords = ref(loadWrongRecords())
  const selectedChapter = ref('')
  const selectedTopic = ref('')
  const quizQuestions = ref([])
  const currentIndex = ref(0)
  const userAnswers = ref({})  // { questionId: selectedOptionIndex }
  const submitted = ref({})    // { questionId: true }
  const startTime = ref(null)  // Date.now() when quiz starts
  const endTime = ref(null)    // Date.now() when quiz finishes
  const showResults = ref(false)

  // 错题本额外状态
  const isWrongQuizMode = ref(false)  // 是否为错题训练模式
  const wrongQuizStats = ref(null)    // 错题训练结束统计

  // --- getters ---
  const chapters = computed(() => {
    const set = new Set(allQuestions.map(q => q.chapter))
    return ['', ...Array.from(set)]
  })

  const topics = computed(() => {
    const map = {}
    allQuestions.forEach(q => {
      if (!map[q.topic]) {
        map[q.topic] = { name: q.topic, chapter: q.chapter, count: 0 }
      }
      map[q.topic].count++
    })
    return Object.values(map)
  })

  const filteredQuestions = computed(() => {
    let pool = allQuestions
    if (selectedChapter.value) {
      pool = pool.filter(q => q.chapter === selectedChapter.value)
    }
    if (selectedTopic.value) {
      pool = pool.filter(q => q.topic === selectedTopic.value)
    }
    return pool
  })

  const currentQuestion = computed(() => {
    return quizQuestions.value[currentIndex.value] || null
  })

  const totalQuestions = computed(() => quizQuestions.value.length)

  const answeredCount = computed(() => Object.keys(submitted.value).length)

  const correctCount = computed(() => {
    let count = 0
    for (const [id, answer] of Object.entries(userAnswers.value)) {
      if (submitted.value[id]) {
        const q = quizQuestions.value.find(q => q.id === Number(id))
        if (q && q.answer === answer) count++
      }
    }
    return count
  })

  const wrongCount = computed(() => answeredCount.value - correctCount.value)

  const accuracy = computed(() => {
    if (answeredCount.value === 0) return 0
    return Math.round((correctCount.value / answeredCount.value) * 100)
  })

  // 获取所有活跃错题（未标记为已掌握的）
  const wrongQuestions = computed(() => {
    return wrongRecords.value.filter(r => r.status === 'active')
  })

  // 获取所有错题记录（包括已掌握的）
  const allWrongRecords = computed(() => {
    return wrongRecords.value
  })

  // 获取已掌握的题目
  const masteredQuestions = computed(() => {
    return wrongRecords.value.filter(r => r.status === 'mastered')
  })

  // 错题 ID 列表（兼容旧逻辑）
  const wrongIds = computed(() => {
    return wrongRecords.value.filter(r => r.status === 'active').map(r => r.id)
  })

  // 错题统计
  const wrongStats = computed(() => {
    const active = wrongRecords.value.filter(r => r.status === 'active')
    const chapters = {}
    const topics = {}
    active.forEach(r => {
      if (r.chapter) chapters[r.chapter] = (chapters[r.chapter] || 0) + 1
      if (r.topic) topics[r.topic] = (topics[r.topic] || 0) + 1
    })
    return {
      total: active.length,
      mastered: wrongRecords.value.filter(r => r.status === 'mastered').length,
      byChapter: chapters,
      byTopic: topics
    }
  })

  const isQuizActive = computed(() => quizQuestions.value.length > 0 && !showResults.value)

  const allFinished = computed(() => {
    return totalQuestions.value > 0 && answeredCount.value === totalQuestions.value
  })

  const progressCount = computed(() => {
    let count = 0
    for (const q of quizQuestions.value) {
      if (submitted.value[q.id]) {
        count++
        continue
      }
      const answer = userAnswers.value[q.id]
      if (answer === undefined || answer === null) continue
      if (typeof answer === 'number') count++
      else if (typeof answer === 'string' && answer.trim()) count++
      else if (Array.isArray(answer) && answer.some(a => typeof a === 'string' && a.trim())) count++
    }
    return count
  })

  const elapsedSeconds = computed(() => {
    if (!startTime.value) return 0
    const end = endTime.value || Date.now()
    return Math.floor((end - startTime.value) / 1000)
  })

  // --- actions ---
  function setChapter(chapter) {
    selectedChapter.value = chapter
    selectedTopic.value = ''
  }

  function setTopic(topic) {
    selectedTopic.value = topic
    // Set chapter to match
    if (topic) {
      const q = allQuestions.find(q => q.topic === topic)
      if (q) selectedChapter.value = q.chapter
    }
  }

  function startQuiz(count = 5) {
    const pool = shuffle(filteredQuestions.value)
    quizQuestions.value = pool.slice(0, Math.min(count, pool.length))
    currentIndex.value = 0
    userAnswers.value = {}
    submitted.value = {}
    startTime.value = Date.now()
    endTime.value = null
    showResults.value = false
  }

  function startTopicQuiz(topic, count = 5) {
    selectedTopic.value = topic
    const topicQs = allQuestions.filter(q => q.topic === topic)
    const pool = shuffle(topicQs)
    quizQuestions.value = pool.slice(0, Math.min(count, pool.length))
    currentIndex.value = 0
    userAnswers.value = {}
    submitted.value = {}
    startTime.value = Date.now()
    endTime.value = null
    showResults.value = false
  }

  function startWrongQuiz() {
    if (wrongQuestions.value.length === 0) return
    // 将错题记录转换为题目格式（兼容现有的做题逻辑）
    const questionsToQuiz = wrongQuestions.value.map(record => ({
      id: record.id,
      chapter: record.chapter,
      topic: record.topic,
      type: record.type,
      difficulty: record.difficulty,
      question: record.stem,
      options: record.options,
      answer: record.correctAnswer,
      explanation: record.explanation
    }))
    quizQuestions.value = shuffle(questionsToQuiz)
    currentIndex.value = 0
    userAnswers.value = {}
    submitted.value = {}
    startTime.value = Date.now()
    endTime.value = null
    showResults.value = false
    isWrongQuizMode.value = true
    wrongQuizStats.value = null
  }

  // 开始单题训练
  function startSingleWrongQuiz(questionId) {
    const record = wrongRecords.value.find(r => r.id === questionId)
    if (!record) return

    quizQuestions.value = [{
      id: record.id,
      chapter: record.chapter,
      topic: record.topic,
      type: record.type,
      difficulty: record.difficulty,
      question: record.stem,
      options: record.options,
      answer: record.correctAnswer,
      explanation: record.explanation
    }]
    currentIndex.value = 0
    userAnswers.value = {}
    submitted.value = {}
    startTime.value = Date.now()
    endTime.value = null
    showResults.value = false
    isWrongQuizMode.value = true
    wrongQuizStats.value = null
  }

  function selectAnswer(questionId, optionIndex) {
    if (submitted.value[questionId]) return
    userAnswers.value[questionId] = optionIndex
  }

  function setTextAnswer(questionId, text) {
    userAnswers.value[questionId] = text
  }

  function setBlankAnswer(questionId, index, text) {
    if (!Array.isArray(userAnswers.value[questionId])) {
      const q = quizQuestions.value.find(q => q.id === questionId)
      const blanks = q?.blanks || 1
      userAnswers.value[questionId] = new Array(blanks).fill('')
    }
    const arr = [...userAnswers.value[questionId]]
    arr[index] = text
    userAnswers.value[questionId] = arr
  }

  function submitAnswer(questionId) {
    if (userAnswers.value[questionId] === undefined) return
    submitted.value[questionId] = true

    const q = quizQuestions.value.find(q => q.id === questionId)
    if (!q) return

    const isCorrect = userAnswers.value[questionId] === q.answer
    const existingIdx = wrongRecords.value.findIndex(r => r.id === questionId)
    const existingRecord = existingIdx !== -1 ? wrongRecords.value[existingIdx] : null

    if (!isCorrect) {
      // 答错：添加或更新错题记录
      // 需要从 allQuestions 获取完整题目信息
      const fullQuestion = allQuestions.find(fq => fq.id === questionId) || q
      const newRecord = questionToWrongRecord(fullQuestion, existingRecord)

      if (existingIdx !== -1) {
        wrongRecords.value[existingIdx] = newRecord
      } else {
        wrongRecords.value.push(newRecord)
      }
      saveWrongRecords(wrongRecords.value)
    }
    // 注意：答对时不自动移除，由用户决定是否标记为已掌握
  }

  function goToQuestion(index) {
    if (index >= 0 && index < quizQuestions.value.length) {
      currentIndex.value = index
    }
  }

  function nextQuestion() {
    if (currentIndex.value < quizQuestions.value.length - 1) {
      currentIndex.value++
    }
  }

  function prevQuestion() {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }

  function finishQuiz() {
    endTime.value = Date.now()
    showResults.value = true

    // 如果是错题训练模式，计算统计信息
    if (isWrongQuizMode.value) {
      const correctIds = []
      const wrongStillIds = []

      for (const q of quizQuestions.value) {
        if (submitted.value[q.id]) {
          if (userAnswers.value[q.id] === q.answer) {
            correctIds.push(q.id)
          } else {
            wrongStillIds.push(q.id)
          }
        }
      }

      wrongQuizStats.value = {
        total: quizQuestions.value.length,
        answered: Object.keys(submitted.value).length,
        correct: correctIds.length,
        stillWrong: wrongStillIds.length,
        correctIds: correctIds,
        wrongStillIds: wrongStillIds,
        accuracy: Object.keys(submitted.value).length > 0
          ? Math.round((correctIds.length / Object.keys(submitted.value).length) * 100)
          : 0
      }
    }
  }

  function resetQuiz() {
    quizQuestions.value = []
    currentIndex.value = 0
    userAnswers.value = {}
    submitted.value = {}
    startTime.value = null
    endTime.value = null
    showResults.value = false
    isWrongQuizMode.value = false
    wrongQuizStats.value = null
  }

  // 标记题目为已掌握
  function markAsMastered(id) {
    const idx = wrongRecords.value.findIndex(r => r.id === id)
    if (idx !== -1) {
      wrongRecords.value[idx].status = 'mastered'
      wrongRecords.value[idx].masteredAt = Date.now()
      saveWrongRecords(wrongRecords.value)
    }
  }

  // 批量标记为已掌握
  function markMultipleAsMastered(ids) {
    ids.forEach(id => {
      const idx = wrongRecords.value.findIndex(r => r.id === id)
      if (idx !== -1) {
        wrongRecords.value[idx].status = 'mastered'
        wrongRecords.value[idx].masteredAt = Date.now()
      }
    })
    saveWrongRecords(wrongRecords.value)
  }

  // 取消已掌握标记（恢复为活跃错题）
  function unmarkMastered(id) {
    const idx = wrongRecords.value.findIndex(r => r.id === id)
    if (idx !== -1) {
      wrongRecords.value[idx].status = 'active'
      delete wrongRecords.value[idx].masteredAt
      saveWrongRecords(wrongRecords.value)
    }
  }

  // 移除错题（从错题本中彻底删除）
  function removeWrongQuestion(id) {
    const idx = wrongRecords.value.findIndex(r => r.id === id)
    if (idx !== -1) {
      wrongRecords.value.splice(idx, 1)
      saveWrongRecords(wrongRecords.value)
    }
  }

  // 清空所有活跃错题
  function clearWrongList() {
    wrongRecords.value = wrongRecords.value.filter(r => r.status === 'mastered')
    saveWrongRecords(wrongRecords.value)
  }

  // 清空所有记录（包括已掌握的）
  function clearAllRecords() {
    wrongRecords.value = []
    saveWrongRecords([])
  }

  // 获取错题详情
  function getWrongRecord(id) {
    return wrongRecords.value.find(r => r.id === id)
  }

  return {
    // state
    wrongIds,
    wrongRecords,
    selectedChapter,
    selectedTopic,
    quizQuestions,
    currentIndex,
    userAnswers,
    submitted,
    startTime,
    endTime,
    showResults,
    isWrongQuizMode,
    wrongQuizStats,
    // getters
    chapters,
    topics,
    filteredQuestions,
    currentQuestion,
    totalQuestions,
    answeredCount,
    correctCount,
    wrongCount,
    accuracy,
    wrongQuestions,
    allWrongRecords,
    masteredQuestions,
    wrongStats,
    isQuizActive,
    allFinished,
    progressCount,
    elapsedSeconds,
    // actions
    setChapter,
    setTopic,
    startQuiz,
    startTopicQuiz,
    startWrongQuiz,
    startSingleWrongQuiz,
    selectAnswer,
    setTextAnswer,
    setBlankAnswer,
    submitAnswer,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    finishQuiz,
    resetQuiz,
    markAsMastered,
    markMultipleAsMastered,
    unmarkMastered,
    removeWrongQuestion,
    clearWrongList,
    clearAllRecords,
    getWrongRecord,
  }
})
