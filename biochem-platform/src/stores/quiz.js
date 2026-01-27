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

export const useQuizStore = defineStore('quiz', () => {
  // --- state ---
  const wrongIds = ref(loadWrongIds())
  const selectedChapter = ref('')
  const quizQuestions = ref([])
  const currentIndex = ref(0)
  const userAnswers = ref({})  // { questionId: selectedOptionIndex }
  const submitted = ref({})    // { questionId: true }

  // --- getters ---
  const chapters = computed(() => {
    const set = new Set(allQuestions.map(q => q.chapter))
    return ['', ...Array.from(set)]
  })

  const filteredQuestions = computed(() => {
    if (!selectedChapter.value) return allQuestions
    return allQuestions.filter(q => q.chapter === selectedChapter.value)
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

  const wrongQuestions = computed(() => {
    return allQuestions.filter(q => wrongIds.value.includes(q.id))
  })

  const isQuizActive = computed(() => quizQuestions.value.length > 0)

  // --- actions ---
  function setChapter(chapter) {
    selectedChapter.value = chapter
  }

  function startQuiz(count = 5) {
    const pool = [...filteredQuestions.value]
    // Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    quizQuestions.value = pool.slice(0, Math.min(count, pool.length))
    currentIndex.value = 0
    userAnswers.value = {}
    submitted.value = {}
  }

  function startWrongQuiz() {
    if (wrongQuestions.value.length === 0) return
    const pool = [...wrongQuestions.value]
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    quizQuestions.value = pool
    currentIndex.value = 0
    userAnswers.value = {}
    submitted.value = {}
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

  function resetQuiz() {
    quizQuestions.value = []
    currentIndex.value = 0
    userAnswers.value = {}
    submitted.value = {}
  }

  function clearWrongList() {
    wrongIds.value = []
    saveWrongIds([])
  }

  return {
    // state
    wrongIds,
    selectedChapter,
    quizQuestions,
    currentIndex,
    userAnswers,
    submitted,
    // getters
    chapters,
    filteredQuestions,
    currentQuestion,
    totalQuestions,
    answeredCount,
    correctCount,
    wrongQuestions,
    isQuizActive,
    // actions
    setChapter,
    startQuiz,
    startWrongQuiz,
    selectAnswer,
    submitAnswer,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    resetQuiz,
    clearWrongList,
  }
})
