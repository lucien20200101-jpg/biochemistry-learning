export const questionTypeLabel = {
  single: '单选题',
  multiple: '多选题',
  true_false: '判断题',
  fill_blank: '填空题',
  term_definition: '名词解释',
  short_answer: '简答题',
}

export const questionBank = [
  {
    id: 'single-1',
    type: 'single',
    stem: '在大多数组织中，葡萄糖进入糖酵解的第一步由哪种酶催化磷酸化？',
    options: [
      { id: 'A', text: '己糖激酶' },
      { id: 'B', text: '葡萄糖激酶' },
      { id: 'C', text: '磷酸果糖激酶-1' },
      { id: 'D', text: '丙酮酸激酶' },
    ],
    answer: {
      correctOptionIds: ['A'],
      standard: '大多数组织中由己糖激酶将葡萄糖磷酸化为葡萄糖-6-磷酸。',
    },
    explanation:
      '己糖激酶亲和力高，适合多数组织在低血糖条件下仍能摄取葡萄糖；肝脏以葡萄糖激酶为主。',
    knowledge: [
      {
        title: '关键定义',
        content: '己糖激酶是糖酵解起始酶，催化葡萄糖生成葡萄糖-6-磷酸。',
      },
      {
        title: '机制要点',
        content:
          '反应消耗1个ATP，使葡萄糖在细胞内被“捕获”，为后续代谢提供底物。',
      },
      {
        title: '常见误区',
        content: '葡萄糖激酶主要位于肝脏和胰岛β细胞，不能代表所有组织。',
      },
    ],
  },
  {
    id: 'single-2',
    type: 'single',
    stem: 'TCA循环中直接生成GTP/ATP的步骤由哪种酶催化？',
    options: [
      { id: 'A', text: '柠檬酸合酶' },
      { id: 'B', text: '异柠檬酸脱氢酶' },
      { id: 'C', text: '琥珀酰辅酶A合成酶' },
      { id: 'D', text: '苹果酸脱氢酶' },
    ],
    answer: {
      correctOptionIds: ['C'],
      standard: '琥珀酰辅酶A合成酶催化底物水平磷酸化生成GTP/ATP。',
    },
    explanation:
      '该步骤把琥珀酰辅酶A高能硫酯键能量转移到GDP/ADP上，是TCA循环中唯一的底物水平磷酸化。',
    knowledge: [
      {
        title: '关键定义',
        content: '底物水平磷酸化是直接从底物转移磷酸基生成ATP或GTP的过程。',
      },
      {
        title: '相关术语',
        content: '琥珀酰辅酶A合成酶又称琥珀酸硫激酶。',
      },
      {
        title: '临床提示',
        content: 'TCA循环异常会影响能量供应，常与线粒体疾病相关。',
      },
    ],
  },
  {
    id: 'single-3',
    type: 'single',
    stem: '长链脂肪酸的β氧化主要发生在细胞的哪个区室？',
    options: [
      { id: 'A', text: '细胞核' },
      { id: 'B', text: '线粒体基质' },
      { id: 'C', text: '内质网腔' },
      { id: 'D', text: '溶酶体' },
    ],
    answer: {
      correctOptionIds: ['B'],
      standard: '长链脂肪酸β氧化主要在线粒体基质进行。',
    },
    explanation:
      '脂肪酸需通过肉碱穿梭进入线粒体基质，随后进行β氧化产生乙酰辅酶A、NADH和FADH2。',
    knowledge: [
      {
        title: '机制要点',
        content: '肉碱穿梭系统负责长链脂肪酸进入线粒体。',
      },
      {
        title: '关键产物',
        content: '每轮β氧化产生1个乙酰辅酶A、1个NADH和1个FADH2。',
      },
      {
        title: '相关术语',
        content: '线粒体基质是β氧化、TCA循环等代谢反应的重要场所。',
      },
    ],
  },
  {
    id: 'multiple-1',
    type: 'multiple',
    stem: '下列哪些属于氧化磷酸化的关键组成？（多选）',
    options: [
      { id: 'A', text: '电子传递链' },
      { id: 'B', text: 'ATP合酶' },
      { id: 'C', text: '线粒体内膜质子梯度' },
      { id: 'D', text: '核糖体' },
    ],
    answer: {
      correctOptionIds: ['A', 'B', 'C'],
      standard: '氧化磷酸化依赖电子传递链、ATP合酶以及内膜质子梯度。',
    },
    explanation:
      '电子传递链将电子传递并泵出质子，建立电化学梯度，ATP合酶利用该梯度合成ATP。',
    knowledge: [
      {
        title: '关键定义',
        content: '氧化磷酸化是NADH/FADH2的电子流驱动ATP合成的过程。',
      },
      {
        title: '机制要点',
        content: '化学渗透学说强调质子梯度是能量转换的核心。',
      },
      {
        title: '常见误区',
        content: '核糖体负责蛋白质合成，与氧化磷酸化无直接关系。',
      },
    ],
  },
  {
    id: 'multiple-2',
    type: 'multiple',
    stem: '以下哪些属于必需氨基酸？（多选）',
    options: [
      { id: 'A', text: '赖氨酸' },
      { id: 'B', text: '色氨酸' },
      { id: 'C', text: '丝氨酸' },
      { id: 'D', text: '亮氨酸' },
    ],
    answer: {
      correctOptionIds: ['A', 'B', 'D'],
      standard: '赖氨酸、色氨酸和亮氨酸属于必需氨基酸。',
    },
    explanation:
      '必需氨基酸不能在人体内合成或合成不足，需从食物中获取。',
    knowledge: [
      {
        title: '关键定义',
        content: '必需氨基酸指机体无法自身合成、必须由膳食提供的氨基酸。',
      },
      {
        title: '相关术语',
        content: '丝氨酸为非必需氨基酸，可由3-磷酸甘油酸合成。',
      },
      {
        title: '学习要点',
        content: '常用口诀帮助记忆必需氨基酸，但更应理解来源。',
      },
    ],
  },
  {
    id: 'multiple-3',
    type: 'multiple',
    stem: '糖异生的主要底物包括哪些？（多选）',
    options: [
      { id: 'A', text: '乳酸' },
      { id: 'B', text: '甘油' },
      { id: 'C', text: '丙酮酸' },
      { id: 'D', text: '乙酰辅酶A' },
    ],
    answer: {
      correctOptionIds: ['A', 'B', 'C'],
      standard: '乳酸、甘油和丙酮酸是糖异生的重要底物。',
    },
    explanation:
      '乳酸通过Cori循环进入糖异生，甘油转化为磷酸二羟基丙酮，丙酮酸可逆转糖酵解方向。',
    knowledge: [
      {
        title: '机制要点',
        content: '糖异生主要在肝脏进行，维持空腹血糖稳定。',
      },
      {
        title: '关键限制',
        content: '乙酰辅酶A不能净转化为葡萄糖。',
      },
      {
        title: '相关术语',
        content: 'Cori循环连接肌肉与肝脏的乳酸-葡萄糖转换。',
      },
    ],
  },
  {
    id: 'true-false-1',
    type: 'true_false',
    stem: '丙酮酸脱氢酶复合体位于线粒体基质并将丙酮酸转变为乙酰辅酶A。',
    options: [
      { id: 'true', text: '正确' },
      { id: 'false', text: '错误' },
    ],
    answer: {
      correctOptionIds: ['true'],
      standard: '该表述正确：丙酮酸脱氢酶复合体在线粒体基质催化生成乙酰辅酶A。',
    },
    explanation:
      '丙酮酸脱氢酶复合体连接糖酵解与TCA循环，是代谢调控的重要节点。',
    knowledge: [
      {
        title: '关键定义',
        content: '丙酮酸脱氢酶复合体由多个酶亚基组成，需要多种辅酶。',
      },
      {
        title: '机制要点',
        content: '反应产生NADH并释放CO₂，为TCA循环提供乙酰辅酶A。',
      },
      {
        title: '临床关联',
        content: '复合体缺陷可导致乳酸酸中毒和神经系统症状。',
      },
    ],
  },
  {
    id: 'true-false-2',
    type: 'true_false',
    stem: 'β氧化每循环一次会直接生成2个ATP。',
    options: [
      { id: 'true', text: '正确' },
      { id: 'false', text: '错误' },
    ],
    answer: {
      correctOptionIds: ['false'],
      standard: '该表述错误：β氧化每循环产生NADH和FADH2，并非直接生成2个ATP。',
    },
    explanation:
      'β氧化的能量以还原当量形式储存，需进入氧化磷酸化后才转化为ATP。',
    knowledge: [
      {
        title: '机制要点',
        content: '每轮β氧化产生1个NADH和1个FADH2。',
      },
      {
        title: '常见误区',
        content: '直接ATP生成发生在底物水平磷酸化，而β氧化属于脱氢反应。',
      },
      {
        title: '相关术语',
        content: 'β氧化与TCA循环共同为脂肪酸提供能量输出。',
      },
    ],
  },
  {
    id: 'true-false-3',
    type: 'true_false',
    stem: '磷酸戊糖途径的主要功能是生成NADPH和核糖-5-磷酸。',
    options: [
      { id: 'true', text: '正确' },
      { id: 'false', text: '错误' },
    ],
    answer: {
      correctOptionIds: ['true'],
      standard: '该表述正确：磷酸戊糖途径产生NADPH和核糖-5-磷酸。',
    },
    explanation:
      'NADPH用于还原合成和抗氧化，核糖-5-磷酸用于核苷酸合成。',
    knowledge: [
      {
        title: '关键定义',
        content: '磷酸戊糖途径又称己糖磷酸旁路，是葡萄糖代谢的重要分支。',
      },
      {
        title: '机制要点',
        content: '氧化阶段生成NADPH，非氧化阶段生成糖类骨架。',
      },
      {
        title: '临床关联',
        content: 'G6PD缺陷会影响NADPH生成，导致红细胞易溶血。',
      },
    ],
  },
  {
    id: 'fill-blank-1',
    type: 'fill_blank',
    stem: '尿素循环的限速酶是____。',
    blanks: [{ id: 'b1', label: '填写限速酶名称' }],
    answer: {
      blanks: [{ id: 'b1', acceptable: ['氨甲酰磷酸合成酶I', '氨甲酰磷酸合成酶Ⅰ'] }],
      standard: '尿素循环的限速酶是线粒体内的氨甲酰磷酸合成酶I。',
    },
    explanation:
      '氨甲酰磷酸合成酶I受N-乙酰谷氨酸激活，是尿素循环调控关键。',
    knowledge: [
      {
        title: '关键定义',
        content: '尿素循环将氨转化为尿素以便排出体外。',
      },
      {
        title: '机制要点',
        content: 'CPS I位于线粒体基质，催化碳酸氢根与氨生成氨甲酰磷酸。',
      },
      {
        title: '常见误区',
        content: 'CPS I与CPS II不同，后者在嘧啶合成中使用谷氨酰胺氮源。',
      },
    ],
  },
  {
    id: 'fill-blank-2',
    type: 'fill_blank',
    stem: '糖原合成中，直接延长糖原链的酶是____。',
    blanks: [{ id: 'b1', label: '填写酶名称' }],
    answer: {
      blanks: [{ id: 'b1', acceptable: ['糖原合酶'] }],
      standard: '糖原合成的关键延长酶是糖原合酶。',
    },
    explanation:
      '糖原合酶将UDP-葡萄糖的葡萄糖残基添加到糖原链上，是调控核心。',
    knowledge: [
      {
        title: '关键定义',
        content: '糖原合酶是糖原合成的限速酶。',
      },
      {
        title: '机制要点',
        content: '酶活性受磷酸化状态与变构调节影响。',
      },
      {
        title: '相关术语',
        content: '糖原分支酶负责引入α-1,6-糖苷键。',
      },
    ],
  },
  {
    id: 'fill-blank-3',
    type: 'fill_blank',
    stem: '乳酸脱氢酶反应中，丙酮酸被还原为____。',
    blanks: [{ id: 'b1', label: '填写产物名称' }],
    answer: {
      blanks: [{ id: 'b1', acceptable: ['乳酸'] }],
      standard: '丙酮酸在乳酸脱氢酶作用下被还原为乳酸。',
    },
    explanation:
      '该反应再生NAD+，保证无氧条件下糖酵解持续进行。',
    knowledge: [
      {
        title: '关键定义',
        content: '乳酸脱氢酶在细胞质中催化丙酮酸与乳酸之间的可逆反应。',
      },
      {
        title: '机制要点',
        content: '反应伴随NADH氧化为NAD+，维持糖酵解氧化还原平衡。',
      },
      {
        title: '临床提示',
        content: '乳酸升高常提示缺氧或线粒体功能障碍。',
      },
    ],
  },
  {
    id: 'term-definition-1',
    type: 'term_definition',
    stem: '名词解释：别构调节。',
    answer: {
      standard:
        '别构调节是调节分子在非活性位点结合，引起酶构象改变，从而增强或抑制酶活性的机制。',
    },
    rubric: {
      keywords: ['非活性位点', '构象改变', '增强', '抑制', '酶活性'],
    },
    explanation:
      '别构调节常用于代谢通路的快速反馈，如终产物对上游限速酶的抑制。',
    knowledge: [
      {
        title: '机制要点',
        content: '别构效应物可为激活剂或抑制剂，调节反应速率。',
      },
      {
        title: '关键例子',
        content: 'ATP对磷酸果糖激酶-1的抑制属于别构负调节。',
      },
      {
        title: '常见误区',
        content: '别构调节不同于共价修饰，后者通过磷酸化改变活性。',
      },
    ],
  },
  {
    id: 'term-definition-2',
    type: 'term_definition',
    stem: '名词解释：Km。',
    answer: {
      standard:
        'Km是米氏常数，表示酶反应速率达到最大速率一半时的底物浓度，反映酶与底物亲和力。',
    },
    rubric: {
      keywords: ['最大速率一半', '底物浓度', '亲和力', '米氏常数'],
    },
    explanation:
      'Km越小表示亲和力越高，但需结合Vmax与生理背景综合判断。',
    knowledge: [
      {
        title: '关键定义',
        content: 'Km是酶动力学的重要参数，用于比较酶对底物的亲和力。',
      },
      {
        title: '机制要点',
        content: '当[S]=Km时，v=Vmax/2。',
      },
      {
        title: '常见误区',
        content: 'Km不是酶的反应速率，也不是催化效率的全部。',
      },
    ],
  },
  {
    id: 'term-definition-3',
    type: 'term_definition',
    stem: '名词解释：呼吸控制。',
    answer: {
      standard:
        '呼吸控制指氧化磷酸化速率受ADP浓度与能量需求调节，当ADP增加时呼吸速率加快。',
    },
    rubric: {
      keywords: ['ADP', '氧化磷酸化', '能量需求', '速率调节'],
    },
    explanation:
      '细胞能量需求升高时，ADP增加促进电子传递链和ATP合成同步增强。',
    knowledge: [
      {
        title: '机制要点',
        content: 'ADP是氧化磷酸化的速率限制因素之一。',
      },
      {
        title: '相关术语',
        content: '呼吸控制与偶联状态相关，解偶联会削弱这一调节。',
      },
      {
        title: '临床提示',
        content: '解偶联剂可使呼吸加快但ATP合成下降。',
      },
    ],
  },
  {
    id: 'short-answer-1',
    type: 'short_answer',
    stem: '简述葡萄糖经糖酵解生成丙酮酸的ATP收支与还原当量变化。',
    answer: {
      standard:
        '糖酵解前半程消耗2个ATP，后半程生成4个ATP，净生成2个ATP，并产生2个NADH。',
    },
    rubric: {
      keywords: ['消耗2个ATP', '生成4个ATP', '净2个ATP', '2个NADH'],
    },
    explanation:
      '能量投资阶段消耗ATP，随后在底物水平磷酸化阶段回收ATP并产生NADH。',
    knowledge: [
      {
        title: '关键定义',
        content: '糖酵解是葡萄糖在细胞质中分解为丙酮酸的途径。',
      },
      {
        title: '机制要点',
        content: '底物水平磷酸化发生在1,3-二磷酸甘油酸和磷酸烯醇式丙酮酸步骤。',
      },
      {
        title: '常见误区',
        content: '无氧条件下NADH需通过乳酸生成再生NAD+。',
      },
    ],
  },
  {
    id: 'short-answer-2',
    type: 'short_answer',
    stem: '简述红细胞依赖无氧糖酵解供能的原因。',
    answer: {
      standard:
        '红细胞缺乏线粒体，无法进行TCA循环和氧化磷酸化，因此只能依赖无氧糖酵解生成ATP。',
    },
    rubric: {
      keywords: ['缺乏线粒体', '无法氧化磷酸化', '无氧糖酵解', 'ATP'],
    },
    explanation:
      '红细胞通过糖酵解供能，同时生成NADH维持谷胱甘肽还原态以抵抗氧化应激。',
    knowledge: [
      {
        title: '关键定义',
        content: '红细胞主要功能是运输氧气，不含线粒体以避免消耗氧。',
      },
      {
        title: '机制要点',
        content: '无氧糖酵解产生的ATP满足膜离子泵等基本能量需求。',
      },
      {
        title: '临床关联',
        content: '糖酵解障碍可导致溶血性贫血。',
      },
    ],
  },
  {
    id: 'short-answer-3',
    type: 'short_answer',
    stem: '简述胆固醇在体内的主要生理作用（至少列出3点）。',
    answer: {
      standard:
        '胆固醇是细胞膜的重要成分，可调节膜流动性；它是胆汁酸、甾体激素和维生素D的前体。',
    },
    rubric: {
      keywords: ['细胞膜', '膜流动性', '胆汁酸', '甾体激素', '维生素D'],
    },
    explanation:
      '胆固醇既是结构成分又是多种生物活性分子的前体，代谢异常与动脉粥样硬化相关。',
    knowledge: [
      {
        title: '关键定义',
        content: '胆固醇属于甾醇类脂质，是细胞膜双层的重要组成。',
      },
      {
        title: '机制要点',
        content: '胆固醇代谢与肝脏合成、胆汁排泄和逆向转运相关。',
      },
      {
        title: '常见误区',
        content: '胆固醇并非完全有害，适量对生理功能必不可少。',
      },
    ],
  },
]
