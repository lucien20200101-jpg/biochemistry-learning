/**
 * 统一题目数据结构规范  ─  questionSchema.js
 *
 * 设计目标
 * ────────
 * 1. 最小字段集：id, type, prompt, answer, explanation, knowledge（6 必选）
 * 2. 四种题型：choice / fill-blank / definition / short-answer
 * 3. 向后兼容：旧 questions.json（single / truefalse / multi）可无损映射
 * 4. knowledge 是"内容段落"，不是标签
 *
 * ── answer 约定 ──────────────────────────────────────────────
 *  choice        → number（单选）| number[]（多选）  — 选项 0-based 下标
 *  fill-blank    → string[]                         — 每空一个元素
 *  definition    → string                           — 参考答案文本
 *  short-answer  → string                           — 参考答案文本
 * ──────────────────────────────────────────────────────────────
 */

// ───────── 题型常量 ─────────

export const TYPES = Object.freeze({
  CHOICE:       'choice',
  FILL_BLANK:   'fill-blank',
  DEFINITION:   'definition',
  SHORT_ANSWER: 'short-answer',
})

// 所有合法 type 值的 Set，用于快速校验
export const VALID_TYPES = new Set(Object.values(TYPES))

// 题型中文 & 是否可自动判分
export const TYPE_META = Object.freeze({
  [TYPES.CHOICE]:       { label: '选择题',   autoGrade: true  },
  [TYPES.FILL_BLANK]:   { label: '填空题',   autoGrade: true  },
  [TYPES.DEFINITION]:   { label: '名词解释', autoGrade: false },
  [TYPES.SHORT_ANSWER]: { label: '简答题',   autoGrade: false },
})


// ───────── 默认值工厂 ─────────

/**
 * 返回一道指定题型的"空题"，所有必选字段均已填充默认值。
 * 调用方可以展开覆盖:
 *   const q = { ...createDefault(TYPES.CHOICE), id: 101, prompt: '...' }
 */
export function createDefault(type = TYPES.CHOICE) {
  const base = {
    id:          0,
    type,
    prompt:      '',        // 题干
    answer:      null,      // 见上方约定
    explanation: '',        // 答案解析
    knowledge:   '',        // 关联知识内容（段落，不是标签）
    // ── 可选元数据 ──
    chapter:     '',
    topic:       '',
    difficulty:  '基础',    // '基础' | '进阶'
  }

  switch (type) {
    case TYPES.CHOICE:
      return { ...base, options: [], multi: false, answer: 0 }

    case TYPES.FILL_BLANK:
      // blanks: 提示空格数量，answer 长度应与之一致
      return { ...base, blanks: 1, answer: [''] }

    case TYPES.DEFINITION:
      return { ...base, answer: '' }

    case TYPES.SHORT_ANSWER:
      // keywords: 可选，用于辅助自动 / 半自动判分
      return { ...base, answer: '', keywords: [] }

    default:
      return base
  }
}


// ───────── 旧题映射 ─────────

/** 旧 type → 新 type */
const LEGACY_TYPE_MAP = {
  single:    TYPES.CHOICE,
  truefalse: TYPES.CHOICE,
  multi:     TYPES.CHOICE,
}

/**
 * 把一道旧格式题目（questions.json 中的对象）转为新统一格式。
 *
 * 映射关系
 * ────────
 *  旧字段          → 新字段
 *  question        → prompt
 *  answer (number) → answer（保持下标不变）
 *  options         → options
 *  type=multi      → multi: true
 *  explanation     → explanation（原样保留）
 *  (自动生成)      → knowledge（从 explanation 提取内容段落）
 *  chapter/topic/difficulty → 保留
 *  type 原始值     → _legacyType（调试 / UI 区分判断题用）
 */
export function normalizeLegacy(raw) {
  const newType = LEGACY_TYPE_MAP[raw.type] || TYPES.CHOICE

  return {
    id:          raw.id,
    type:        newType,
    prompt:      raw.question || '',
    options:     raw.options  || [],
    multi:       raw.type === 'multi',
    answer:      raw.type === 'multi' && !Array.isArray(raw.answer)
                   ? [raw.answer]    // 强制包装为数组，兼容旧数据只存了单值的情况
                   : raw.answer,
    explanation: raw.explanation || '',
    knowledge:   buildKnowledge(raw),

    // 元数据
    chapter:     raw.chapter    || '',
    topic:       raw.topic      || '',
    difficulty:  raw.difficulty || '基础',

    // 保留原始 type，方便 UI 层区分判断题
    _legacyType: raw.type,
  }
}

/**
 * 批量转换旧题库。
 * @param {Array} rawList  旧 questions.json 的数组
 * @returns {Array}        新格式数组
 */
export function normalizeLegacyBatch(rawList) {
  return rawList.map(normalizeLegacy)
}


// ───────── knowledge 内容构建 ─────────

/**
 * 从旧题的 explanation 中提取"知识内容段落"。
 *
 * 策略（最小可行）
 * ────────────────
 * 1. 以「章节 · 主题」开头，给出学科定位
 * 2. 取 explanation 前两个完整句子作为核心知识摘要
 *    ─ 这两句通常是"直接回答 + 原理解释"，已经是有效内容
 * 3. 不做 NLP，不依赖外部库
 */
function buildKnowledge(raw) {
  const parts = []

  // 学科定位
  if (raw.chapter || raw.topic) {
    const loc = [raw.chapter, raw.topic].filter(Boolean).join(' · ')
    parts.push(`【${loc}】`)
  }

  // 从解析中提取前两句核心内容
  if (raw.explanation) {
    const sentences = raw.explanation
      .split(/(?<=[。！？])/)     // 按中文句末标点拆句
      .map(s => s.trim())
      .filter(Boolean)

    parts.push(sentences.slice(0, 2).join(''))
  }

  return parts.join(' ') || ''
}


// ───────── 校验 ─────────

/**
 * 校验一道题是否符合规范，返回 { valid, errors }。
 * 只检查"能不能跑"，不检查内容质量。
 */
export function validate(q) {
  const errors = []

  if (q.id === undefined || q.id === null)      errors.push('缺少 id')
  if (!VALID_TYPES.has(q.type))                  errors.push(`无效题型: "${q.type}"`)
  if (!q.prompt)                                 errors.push('缺少 prompt（题干）')
  if (q.answer === undefined || q.answer === null) errors.push('缺少 answer')
  if (!q.explanation)                            errors.push('缺少 explanation')
  if (!q.knowledge)                              errors.push('缺少 knowledge')

  // 题型专属校验
  if (q.type === TYPES.CHOICE) {
    if (!Array.isArray(q.options) || q.options.length < 2) {
      errors.push('选择题需要 options 数组且至少 2 项')
    }
    if (q.multi && !Array.isArray(q.answer)) {
      errors.push('多选题 answer 应为数组')
    }
  }

  if (q.type === TYPES.FILL_BLANK) {
    if (!Array.isArray(q.answer)) {
      errors.push('填空题 answer 应为 string[]')
    }
  }

  if (q.type === TYPES.DEFINITION || q.type === TYPES.SHORT_ANSWER) {
    if (typeof q.answer !== 'string') {
      errors.push(`${TYPE_META[q.type]?.label || q.type} answer 应为 string`)
    }
  }

  return { valid: errors.length === 0, errors }
}


// ───────── 工具函数 ─────────

/**
 * 判断一道题是否可自动判分。
 * choice / fill-blank → true
 * definition / short-answer → false（需人工或 AI 评分）
 */
export function isAutoGradable(q) {
  return TYPE_META[q.type]?.autoGrade ?? false
}

/**
 * 自动判分（仅限 choice / fill-blank）。
 * @param {object}            q          题目（新格式）
 * @param {number|number[]|string[]} userAnswer  用户作答
 * @returns {{ correct: boolean, detail: string }}
 */
export function grade(q, userAnswer) {
  if (!isAutoGradable(q)) {
    return { correct: false, detail: '该题型需人工评阅' }
  }

  if (q.type === TYPES.CHOICE) {
    if (q.multi) {
      // 多选：排序后逐项比较
      const sorted = (arr) => [...arr].sort((a, b) => a - b)
      const expect = sorted(Array.isArray(q.answer) ? q.answer : [q.answer])
      const actual = sorted(Array.isArray(userAnswer) ? userAnswer : [userAnswer])
      const correct = expect.length === actual.length &&
                      expect.every((v, i) => v === actual[i])
      return { correct, detail: correct ? '回答正确' : '选项不完全匹配' }
    }
    // 单选
    const correct = userAnswer === q.answer
    return { correct, detail: correct ? '回答正确' : '答案错误' }
  }

  if (q.type === TYPES.FILL_BLANK) {
    const expect = q.answer.map(a => a.trim().toLowerCase())
    const actual = (Array.isArray(userAnswer) ? userAnswer : [userAnswer])
                     .map(a => String(a).trim().toLowerCase())
    const correct = expect.length === actual.length &&
                    expect.every((v, i) => v === actual[i])
    return { correct, detail: correct ? '回答正确' : '填写内容不匹配' }
  }

  return { correct: false, detail: '未知题型' }
}
