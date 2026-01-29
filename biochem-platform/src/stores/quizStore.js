import { defineStore } from 'pinia'
import { questionBank } from '../data/questionBank'

const STORAGE_KEY = 'biochem-quiz-state'
const STATE_VERSION = 1

const normalizeText = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')

const getDefaultState = () => ({
  version: STATE_VERSION,
  currentIndex: 0,
  answers: {},
  submissions: {},
  subjectiveMarks: {},
  wrongIds: [],
})

const sanitizeArray = (value) => (Array.isArray(value) ? value : [])

const clampIndex = (index) => {
  if (Number.isNaN(index)) return 0
  return Math.min(Math.max(index, 0), questionBank.length - 1)
}

const migrateState = (rawState) => {
  if (!rawState) return getDefaultState()
  if (Array.isArray(rawState)) {
    return {
      ...getDefaultState(),
      wrongIds: rawState.filter((id) => typeof id === 'string'),
    }
  }

  const base = getDefaultState()
  const version = rawState.version ?? base.version
  if (version !== STATE_VERSION) {
    return {
      ...base,
      wrongIds: sanitizeArray(rawState.wrongIds).filter((id) => typeof id === 'string'),
    }
  }

  return {
    ...base,
    version,
    currentIndex: clampIndex(Number(rawState.currentIndex ?? 0)),
    answers: rawState.answers && typeof rawState.answers === 'object' ? rawState.answers : {},
    submissions:
      rawState.submissions && typeof rawState.submissions === 'object' ? rawState.submissions : {},
    subjectiveMarks:
      rawState.subjectiveMarks && typeof rawState.subjectiveMarks === 'object'
        ? rawState.subjectiveMarks
        : {},
    wrongIds: sanitizeArray(rawState.wrongIds).filter((id) => typeof id === 'string'),
  }
}

export const useQuizStore = defineStore('quiz', {
  state: () => getDefaultState(),
  getters: {
    answeredCount: (state) => Object.keys(state.submissions).length,
    wrongCount: (state) => state.wrongIds.length,
  },
  actions: {
    hydrate() {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      let parsed
      try {
        parsed = JSON.parse(raw)
      } catch (error) {
        parsed = null
      }
      const next = migrateState(parsed)
      Object.assign(this, next)
    },
    persist() {
      const payload = {
        version: STATE_VERSION,
        currentIndex: this.currentIndex,
        answers: this.answers,
        submissions: this.submissions,
        subjectiveMarks: this.subjectiveMarks,
        wrongIds: this.wrongIds,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    },
    setCurrentIndex(index) {
      this.currentIndex = clampIndex(index)
      this.persist()
    },
    recordAnswer(id, response) {
      this.answers = {
        ...this.answers,
        [id]: {
          response,
          updatedAt: new Date().toISOString(),
        },
      }
    },
    updateWrongStatus(id, isWrong) {
      const has = this.wrongIds.includes(id)
      if (isWrong && !has) {
        this.wrongIds = [...this.wrongIds, id]
      }
      if (!isWrong && has) {
        this.wrongIds = this.wrongIds.filter((item) => item !== id)
      }
    },
    submitObjective(question, response, matchedDetail) {
      const isCorrect = matchedDetail.isCorrect
      this.recordAnswer(question.id, response)
      this.submissions = {
        ...this.submissions,
        [question.id]: {
          type: question.type,
          submittedAt: new Date().toISOString(),
          correct: isCorrect,
          detail: matchedDetail,
        },
      }
      this.updateWrongStatus(question.id, !isCorrect)
      this.persist()
    },
    submitSubjective(question, response, matchedDetail) {
      this.recordAnswer(question.id, response)
      this.submissions = {
        ...this.submissions,
        [question.id]: {
          type: question.type,
          submittedAt: new Date().toISOString(),
          correct: null,
          detail: matchedDetail,
        },
      }
      this.persist()
    },
    markSubjective(id, status) {
      this.subjectiveMarks = { ...this.subjectiveMarks, [id]: status }
      this.updateWrongStatus(id, status === 'wrong')
      this.persist()
    },
    evaluateQuestion(question, response) {
      if (question.type === 'multiple') {
        const selected = sanitizeArray(response).map(String).sort()
        const correct = sanitizeArray(question.answer.correctOptionIds).map(String).sort()
        const isCorrect =
          selected.length === correct.length &&
          selected.every((item, index) => item === correct[index])
        return {
          isCorrect,
          selected,
          correct,
        }
      }

      if (question.type === 'single' || question.type === 'true_false') {
        const isCorrect = response === question.answer.correctOptionIds?.[0]
        return {
          isCorrect,
          selected: response,
          correct: question.answer.correctOptionIds?.[0],
        }
      }

      if (question.type === 'fill_blank') {
        const blanks = question.answer.blanks ?? []
        const details = blanks.map((blank, index) => {
          const userValue = response?.[index] ?? ''
          const normalized = normalizeText(userValue)
          const acceptable = blank.acceptable.map((item) => normalizeText(item))
          return {
            id: blank.id,
            isCorrect: acceptable.includes(normalized),
            userValue,
            acceptable: blank.acceptable,
          }
        })
        const isCorrect = details.every((item) => item.isCorrect)
        return {
          isCorrect,
          blanks: details,
        }
      }

      const keywords = question.rubric?.keywords ?? []
      const normalizedResponse = normalizeText(response ?? '')
      const matched = keywords.filter((word) => normalizedResponse.includes(normalizeText(word)))
      return {
        isCorrect: null,
        keywords,
        matched,
      }
    },
  },
})
