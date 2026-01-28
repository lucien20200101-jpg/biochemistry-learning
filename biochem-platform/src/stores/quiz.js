import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import allQuestions from '../data/questions.json'

const STORAGE_KEY = 'biochem-quiz-wrong'

function loadWrongIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveWrongIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
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
  const wrongIds = ref(loadWrongIds())
  const selectedChapter = ref('')
  const selectedTopic = ref('')
  const quizQuestions = ref([])
  const currentIndex = ref(0)
  const userAnswers = ref({})  // { questionId: selectedOptionIndex }
  const submitted = ref({})    // { questionId: true }
  const startTime = ref(null)  // Date.now() when quiz starts
  const endTime = ref(null)    // Date.now() when quiz finishes
  const showResults = ref(false)

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

  const wrongQuestions = computed(() => {
    return allQuestions.filter(q => wrongIds.value.includes(q.id))
  })

  const isQuizActive = computed(() => quizQuestions.value.length > 0 && !showResults.value)

  const allFinished = computed(() => {
    return totalQuestions.value > 0 && answeredCount.value === totalQuestions.value
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
    quizQuestions.value = shuffle(wrongQuestions.value)
    currentIndex.value = 0
    userAnswers.value = {}
    submitted.value = {}
    startTime.value = Date.now()
    endTime.value = null
    showResults.value = false
  }

  function selectAnswer(questionId, optionIndex) {
    if (submitted.value[questionId]) return
    userAnswers.value[questionId] = optionIndex
  }

  function submitAnswer(questionId) {
    if (userAnswers.value[questionId] === undefined) return
    submitted.value[questionId] = true

    const q = quizQuestions.value.find(q => q.id === questionId)
    if (q && userAnswers.value[questionId] !== q.answer) {
      // Add to wrong list
      if (!wrongIds.value.includes(questionId)) {
        wrongIds.value.push(questionId)
        saveWrongIds(wrongIds.value)
      }
    } else if (q && userAnswers.value[questionId] === q.answer) {
      // Remove from wrong list if answered correctly
      const idx = wrongIds.value.indexOf(questionId)
      if (idx !== -1) {
        wrongIds.value.splice(idx, 1)
        saveWrongIds(wrongIds.value)
      }
    }
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
  }

  function resetQuiz() {
    quizQuestions.value = []
    currentIndex.value = 0
    userAnswers.value = {}
    submitted.value = {}
    startTime.value = null
    endTime.value = null
    showResults.value = false
  }

  function removeWrongQuestion(id) {
    const idx = wrongIds.value.indexOf(id)
    if (idx !== -1) {
      wrongIds.value.splice(idx, 1)
      saveWrongIds(wrongIds.value)
    }
  }

  function clearWrongList() {
    wrongIds.value = []
    saveWrongIds([])
  }

  return {
    // state
    wrongIds,
    selectedChapter,
    selectedTopic,
    quizQuestions,
    currentIndex,
    userAnswers,
    submitted,
    startTime,
    endTime,
    showResults,
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
    isQuizActive,
    allFinished,
    elapsedSeconds,
    // actions
    setChapter,
    setTopic,
    startQuiz,
    startTopicQuiz,
    startWrongQuiz,
    selectAnswer,
    submitAnswer,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    finishQuiz,
    resetQuiz,
    removeWrongQuestion,
    clearWrongList,
  }
})
