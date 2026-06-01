export const meta = {
  name: 'sf-novella-creation',
  description: '최신 인기 SF를 분석해 포스트휴먼/AI 노벨라를 기획·집필·검수까지 완성하는 멀티에이전트 워크플로우',
  whenToUse: '트렌드 분석 기반으로 새 SF 노벨라 한 편을 처음부터 끝까지 완성할 때',
  phases: [
    { title: '트렌드분석', detail: '최신 인기 SF를 5개 렌즈로 병렬 리서치 후 트렌드 리포트 합성' },
    { title: '컨셉기획', detail: '프리미스 5종 생성 → 다관점 심사 → 최우수안 풀 컨셉 발전' },
    { title: '설정구축', detail: '세계관·인물·극적구조·모티프를 병렬 구축 후 스토리 바이블 통합' },
    { title: '플롯설계', detail: '프롤로그+10챕터 비트 단위 상세 아웃라인 설계' },
    { title: '집필', detail: '챕터별 초고 집필 (파이프라인)' },
    { title: '검수퇴고', detail: '챕터별 검수 후 퇴고·파일 기록 (파이프라인)' },
    { title: '전체감수', detail: '원고 전체 연속성·정합성 감수 후 치명 이슈 타깃 수정' },
  ],
}

const ROOT = '/Users/robin/Documents/workflow/novel'

// ───────────────────────── 스키마 정의 ─────────────────────────
const RESEARCH_SCHEMA = {
  type: 'object',
  required: ['lens', 'keyFindings', 'notableWorks', 'craftPatterns', 'opportunities'],
  properties: {
    lens: { type: 'string' },
    keyFindings: { type: 'array', items: { type: 'string' }, description: '이 렌즈에서 발견한 핵심 트렌드 5~8개' },
    notableWorks: {
      type: 'array',
      items: {
        type: 'object',
        required: ['title', 'author', 'year', 'whyPopular'],
        properties: {
          title: { type: 'string' }, author: { type: 'string' },
          year: { type: 'string' }, whyPopular: { type: 'string' },
        },
      },
    },
    craftPatterns: { type: 'array', items: { type: 'string' }, description: '서사 기법/구조/문체 패턴' },
    opportunities: { type: 'array', items: { type: 'string' }, description: '아직 덜 탐구된 빈틈/기회' },
  },
}

const PREMISE_SCHEMA = {
  type: 'object',
  required: ['premises'],
  properties: {
    premises: {
      type: 'array',
      minItems: 5, maxItems: 5,
      items: {
        type: 'object',
        required: ['id', 'title', 'logline', 'hook', 'themeQuestion', 'posthumanAngle', 'freshness'],
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          logline: { type: 'string', description: '한 문장 로그라인' },
          hook: { type: 'string', description: '독자를 사로잡는 핵심 후크' },
          themeQuestion: { type: 'string', description: '작품이 던지는 핵심 질문' },
          posthumanAngle: { type: 'string', description: '포스트휴먼/AI 사변의 구체적 각도' },
          freshness: { type: 'string', description: '기존 인기작과 차별화되는 지점' },
        },
      },
    },
  },
}

const JUDGE_SCHEMA = {
  type: 'object',
  required: ['premiseId', 'lens', 'score', 'critique', 'improvement'],
  properties: {
    premiseId: { type: 'string' },
    lens: { type: 'string' },
    score: { type: 'number', description: '0~100 점수' },
    critique: { type: 'string' },
    improvement: { type: 'string', description: '이 안을 더 강하게 만들 한 가지 제안' },
  },
}

const CONCEPT_SCHEMA = {
  type: 'object',
  required: ['title', 'subtitle', 'logline', 'theme', 'centralQuestion', 'tone', 'setting', 'protagonist', 'opposingForce', 'emotionalArc', 'endingDirection'],
  properties: {
    title: { type: 'string' }, subtitle: { type: 'string' },
    logline: { type: 'string' }, theme: { type: 'string' },
    centralQuestion: { type: 'string' }, tone: { type: 'string' },
    setting: { type: 'string', description: '시공간·세계 한 단락' },
    protagonist: { type: 'string', description: '주인공의 정체성·결핍·욕망' },
    opposingForce: { type: 'string', description: '대립항(인물/체제/내면/존재론적 힘)' },
    emotionalArc: { type: 'string', description: '독자가 통과할 감정의 곡선' },
    endingDirection: { type: 'string', description: '결말이 향할 정조(스포일러 가능)' },
  },
}

const OUTLINE_SCHEMA = {
  type: 'object',
  required: ['chapters'],
  properties: {
    chapters: {
      type: 'array',
      minItems: 11, maxItems: 11,
      items: {
        type: 'object',
        required: ['number', 'title', 'pov', 'setting', 'beats', 'reveal', 'emotionalShift', 'endState', 'targetWords'],
        properties: {
          number: { type: 'number', description: '0=프롤로그, 1~10=본편' },
          title: { type: 'string' },
          pov: { type: 'string', description: '시점/화자' },
          setting: { type: 'string', description: '이 챕터의 시공간' },
          beats: { type: 'array', items: { type: 'string' }, description: '장면 비트 4~7개' },
          reveal: { type: 'string', description: '이 챕터에서 새로 드러나는 정보/전환' },
          emotionalShift: { type: 'string', description: '감정의 출발점→도착점' },
          endState: { type: 'string', description: '챕터 종료 시점의 상황(다음 챕터로의 연결고리)' },
          targetWords: { type: 'number', description: '목표 분량(한글 글자 수 기준)' },
        },
      },
    },
  },
}

const REVIEW_SCHEMA = {
  type: 'object',
  required: ['continuityFlags', 'proseNotes', 'pacingNotes', 'strengthsToKeep', 'verdict'],
  properties: {
    continuityFlags: { type: 'array', items: { type: 'string' }, description: '설정/연속성 위반 의심' },
    proseNotes: { type: 'array', items: { type: 'string' }, description: '문장·묘사·시점 개선점' },
    pacingNotes: { type: 'array', items: { type: 'string' }, description: '긴장·리듬·정보배분 개선점' },
    strengthsToKeep: { type: 'array', items: { type: 'string' }, description: '반드시 유지할 강점' },
    verdict: { type: 'string', description: '한 줄 총평' },
  },
}

const CHAPTER_META_SCHEMA = {
  type: 'object',
  required: ['number', 'title', 'file', 'wordCount', 'synopsis'],
  properties: {
    number: { type: 'number' }, title: { type: 'string' },
    file: { type: 'string' }, wordCount: { type: 'number' },
    synopsis: { type: 'string', description: '퇴고 완료본 1~2문장 요약' },
  },
}

const AUDIT_SCHEMA = {
  type: 'object',
  required: ['verdict', 'criticalIssues', 'minorNotes', 'overallAssessment'],
  properties: {
    verdict: { type: 'string', enum: ['publishable', 'needs_fixes'] },
    criticalIssues: {
      type: 'array',
      items: {
        type: 'object',
        required: ['chapterNumber', 'issue', 'fix'],
        properties: {
          chapterNumber: { type: 'number' },
          issue: { type: 'string' },
          fix: { type: 'string', description: '구체적 수정 지시' },
        },
      },
    },
    minorNotes: { type: 'array', items: { type: 'string' } },
    overallAssessment: { type: 'string', description: '원고 전체에 대한 한 단락 비평' },
  },
}

const pad2 = (n) => (n < 10 ? '0' + n : '' + n)

// ───────────────────────── 1. 트렌드 분석 ─────────────────────────
phase('트렌드분석')
log('최신 인기 SF를 5개 렌즈로 병렬 리서치합니다.')

const RESEARCH_LENSES = [
  {
    lens: '수상작·평단 (Hugo/Nebula/Clarke/Locus, 2021~2026)',
    focus: '최근 5년 주요 SF 문학상 수상·후보작에서 반복되는 주제, 형식 실험, 평단이 주목한 포스트휴먼/AI 서사. 구체적 작품명과 작가를 들 것.',
  },
  {
    lens: '상업적 베스트셀러·화제작',
    focus: 'Project Hemisphere/Murderbot/Klara and the Sun류 등 대중적으로 크게 팔리고 회자된 최신 SF의 공통 후크와 정서. 무엇이 대중을 끌어당겼는가.',
  },
  {
    lens: '한국 SF 씬 (김초엽·천선란·정보라·배명훈 등)',
    focus: '2020년대 한국 SF의 정서·문체·소재 경향, 특히 AI/포스트휴먼/돌봄/관계를 다루는 방식. 한국 독자가 반응한 지점.',
  },
  {
    lens: '포스트휴먼/AI 사변 심층',
    focus: 'AI 의식, 인간-기계 경계, 업로딩, 정체성, 돌봄·노동·감정 노동으로서의 AI 등 포스트휴먼 사변의 최신 담론과 대표 텍스트. 철학적 깊이의 최전선.',
  },
  {
    lens: '서사 기법·구조·문체 트렌드',
    focus: '최근 인기 SF가 채택하는 구조(다중시점, 비선형, 서간/기록물 형식, 1인칭 비인간 화자), 문체, 분량 감각(노벨라의 부상), 결말 처리 방식.',
  },
]

const researchResults = (await parallel(
  RESEARCH_LENSES.map((L, i) => () =>
    agent(
      `당신은 SF 출판·비평 전문 리서처입니다. WebSearch와 WebFetch를 적극 사용해 실재하는 최신 정보를 수집하세요.\n\n` +
      `[리서치 렌즈] ${L.lens}\n[집중 사항] ${L.focus}\n\n` +
      `2020~2026년에 인기 있거나 평단의 주목을 받은 SF를 조사하되, 포스트휴먼/AI 주제와의 연결을 항상 의식하세요. ` +
      `추측이 아니라 검색으로 확인된 작품·작가·연도를 제시하고, 새 소설이 파고들 빈틈(opportunities)을 날카롭게 도출하세요.`,
      { label: `리서치:${i + 1}`, phase: '트렌드분석', schema: RESEARCH_SCHEMA }
    )
  )
)).filter(Boolean)

const trendReport = await agent(
  `당신은 SF 출판 트렌드 분석가입니다. 아래 5개 렌즈의 리서치 결과를 종합해, 새 포스트휴먼/AI 노벨라 기획에 직접 쓰일 '트렌드 리포트'를 작성하세요.\n\n` +
  `[리서치 데이터]\n${JSON.stringify(researchResults, null, 2)}\n\n` +
  `리포트 구성: (1) 지금 SF 시장을 관통하는 메가 트렌드, (2) 포스트휴먼/AI 분야에서 반복되는 클리셰(피해야 할 것), (3) 아직 덜 탐구된 화이트스페이스(노릴 것), (4) 대중성과 문학성을 동시에 잡은 작품들의 공통 기법, (5) 우리 노벨라를 위한 전략적 권고(소재 각도, 톤, 구조, 분량).\n\n` +
  `한국어 마크다운으로 작성하고, 마지막에 반드시 Write 도구로 '${ROOT}/research/trend-report.md'에 저장하세요. 당신의 최종 응답은 리포트 본문 전체입니다.`,
  { label: '트렌드합성', phase: '트렌드분석' }
)

// ───────────────────────── 2. 컨셉 기획 ─────────────────────────
phase('컨셉기획')
log('트렌드를 반영한 프리미스 5종을 생성하고 다관점 심사합니다.')

const ideation = await agent(
  `당신은 야심 찬 SF 작가입니다. 아래 트렌드 리포트를 깊이 흡수해, 서로 확연히 다른 포스트휴먼/AI 노벨라 프리미스 5종을 제안하세요.\n\n` +
  `[트렌드 리포트]\n${trendReport}\n\n` +
  `각 프리미스는 (a) 트렌드의 화이트스페이스를 공략하고, (b) 클리셰(자아를 깨달은 AI의 반란, 단순한 디스토피아 등)를 피하며, (c) 노벨라 한 편 분량으로 완결 가능한 밀도여야 합니다. ` +
  `다섯 안은 소재·톤·구조가 서로 겹치지 않게 하세요. 정서적으로 사람을 흔드는 후크를 우선하세요.`,
  { label: '프리미스생성', phase: '컨셉기획', schema: PREMISE_SCHEMA }
)

const premises = ideation.premises
const JUDGE_LENSES = [
  { lens: '독창성·문학성', brief: '아이디어의 신선함, 주제의 깊이, 문학적 잠재력을 평가. 진부하면 가차없이 감점.' },
  { lens: '대중성·정서몰입', brief: '독자를 끝까지 끌고 갈 후크, 감정 이입 가능성, 시장 반응 잠재력을 평가.' },
]

// 프리미스마다 2개 렌즈로 병렬 심사 → 평균 점수 산출
const judged = await parallel(
  premises.map((p) => () =>
    parallel(
      JUDGE_LENSES.map((J) => () =>
        agent(
          `당신은 까다로운 SF 편집장입니다. '${J.lens}' 관점에서 아래 프리미스를 0~100점으로 냉정히 평가하세요.\n[평가 기준] ${J.brief}\n\n[프리미스]\n${JSON.stringify(p, null, 2)}`,
          { label: `심사:${p.id}:${J.lens}`, phase: '컨셉기획', schema: JUDGE_SCHEMA }
        )
      )
    ).then((votes) => {
      const v = votes.filter(Boolean)
      const avg = v.reduce((s, x) => s + x.score, 0) / (v.length || 1)
      return { premise: p, avg, votes: v }
    })
  )
)

const ranked = judged.filter(Boolean).sort((a, b) => b.avg - a.avg)
const winner = ranked[0]
const runnerUp = ranked[1]
log(`선정: "${winner.premise.title}" (평균 ${winner.avg.toFixed(1)}점)`)

const concept = await agent(
  `당신은 노벨라의 총괄 기획자입니다. 심사를 통과한 최우수 프리미스를 본격적인 '작품 컨셉'으로 발전시키세요.\n\n` +
  `[선정작]\n${JSON.stringify(winner.premise, null, 2)}\n[심사 피드백]\n${JSON.stringify(winner.votes.map((v) => ({ lens: v.lens, critique: v.critique, improvement: v.improvement })), null, 2)}\n\n` +
  `[차순위안에서 흡수할 강점]\n${JSON.stringify(runnerUp.premise, null, 2)}\n\n` +
  `[트렌드 리포트 요지]\n${trendReport.slice(0, 2500)}\n\n` +
  `심사 피드백의 개선 제안을 반영하고, 차순위안의 좋은 요소를 한두 가지 접목해 더 강한 컨셉으로 완성하세요. ` +
  `제목은 한국어로, 시적이되 장르 정체성이 드러나게. 결말 방향은 구체적으로(스포일러 허용). ` +
  `완성 후 반드시 Write 도구로 '${ROOT}/planning/concept.md'에 한국어 마크다운으로 저장하세요.`,
  { label: '컨셉확정', phase: '컨셉기획', schema: CONCEPT_SCHEMA }
)

// ───────────────────────── 3. 설정·인물 구축 ─────────────────────────
phase('설정구축')
log('세계관·인물·극적구조·모티프를 병렬 구축합니다.')

const conceptStr = JSON.stringify(concept, null, 2)
const BIBLE_PARTS = [
  {
    key: '세계관',
    brief: `이 작품의 세계를 구축하세요. 시대·기술 수준(특히 AI/포스트휴먼 기술의 작동 원리와 한계, 사회적 위치), 정치·경제·계급, 일상의 질감, 핵심 규칙(이 세계에서 가능한 것/불가능한 것). 과학적 개연성과 정서적 분위기를 함께. 클리셰를 피하고 구체적 디테일로 살아 있게.`,
  },
  {
    key: '인물',
    brief: `주요 인물 3~5명의 바이블을 작성하세요. 각 인물의 정체성·결핍·욕망·비밀·말투·신체성, 그리고 포스트휴먼/AI 테마와 어떻게 얽히는지. 인물 간 관계도와 갈등의 축. 비인간 화자가 있다면 그 인지·언어의 결을 설계.`,
  },
  {
    key: '극적구조',
    brief: `극적 구조를 설계하세요. 중심 갈등, 판돈(stakes)의 상승 경로, 전환점(중간점·위기·절정), 서브플롯, 그리고 결말이 주제를 어떻게 봉인하는지. 노벨라 한 편의 긴장 곡선을 비트 수준 직전까지.`,
  },
  {
    key: '모티프',
    brief: `주제와 상징 체계를 설계하세요. 핵심 주제 질문을 떠받치는 반복 모티프·이미지·라이트모티프, 제목과의 호응, 도입부에 심고 결말에 회수할 복선 후보, 작품 전체를 관통할 문체·톤 가이드(인칭, 시제, 리듬, 한국어 산문의 결).`,
  },
]

const bibleParts = (await parallel(
  BIBLE_PARTS.map((B, i) => () =>
    agent(
      `당신은 SF 노벨라의 ${B.key} 설계 전문가입니다. 아래 작품 컨셉을 기반으로 '${B.key}' 바이블을 한국어 마크다운으로 깊이 있게 작성하세요.\n\n[작품 컨셉]\n${conceptStr}\n\n[과업] ${B.brief}\n\n추상적 선언이 아니라 집필에 바로 쓸 구체적 자료로. 당신의 최종 응답이 곧 ${B.key} 바이블입니다.`,
      { label: `바이블:${B.key}`, phase: '설정구축' }
    )
  )
)).filter(Boolean)

const storyBible = await agent(
  `당신은 스토리 바이블 편집자입니다. 아래 네 파트(세계관·인물·극적구조·모티프)를 모순 없이 하나의 일관된 '스토리 바이블'로 통합하세요.\n\n` +
  `[작품 컨셉]\n${conceptStr}\n\n[파트별 원자료]\n${bibleParts.map((p, i) => `\n### ${BIBLE_PARTS[i].key}\n${p}`).join('\n')}\n\n` +
  `중복을 정리하고 충돌을 해소하며, 집필 에이전트가 단일 참조처로 쓸 수 있게 구조화하세요(세계 규칙, 인물 시트, 관계도, 타임라인, 주제·모티프, 문체 가이드 섹션). ` +
  `한국어 마크다운으로 작성하고, 반드시 Write 도구로 '${ROOT}/planning/story-bible.md'에 저장하세요. 최종 응답은 바이블 본문 전체입니다.`,
  { label: '바이블통합', phase: '설정구축' }
)

// ───────────────────────── 4. 플롯 설계 ─────────────────────────
phase('플롯설계')
log('프롤로그+10챕터 상세 아웃라인을 설계합니다.')

const outline = await agent(
  `당신은 노벨라 구조 설계자입니다. 아래 스토리 바이블과 컨셉을 바탕으로 프롤로그(number=0)와 10개 본편 챕터(number=1~10), 총 11개의 비트 단위 아웃라인을 설계하세요.\n\n` +
  `[작품 컨셉]\n${conceptStr}\n\n[스토리 바이블]\n${storyBible}\n\n` +
  `요구사항:\n` +
  `- 전체가 하나의 완결된 노벨라가 되도록 긴장 곡선을 설계(도입→상승→중간점 전환→위기→절정→해소).\n` +
  `- 각 챕터의 beats는 실제 장면 단위로 4~7개. reveal/emotionalShift/endState를 명확히 해 챕터 간 연결이 매끄럽게.\n` +
  `- 도입부에 심은 복선이 결말에 회수되도록 배치. 모티프를 분산 배치.\n` +
  `- targetWords: 프롤로그 1500~2000, 본편 챕터 3000~4200 사이로 변주.\n` +
  `- endState는 반드시 '다음 챕터 도입 화자가 이어받을 수 있는 상황'으로 구체적으로.\n\n` +
  `구조화된 데이터로 반환하세요. 또한 사람이 읽을 수 있는 아웃라인 마크다운을 Write 도구로 '${ROOT}/planning/outline.md'에 저장하세요.`,
  { label: '아웃라인설계', phase: '플롯설계', schema: OUTLINE_SCHEMA }
)

const chapters = outline.chapters.slice().sort((a, b) => a.number - b.number)
const bibleForWriting = storyBible.length > 6000 ? storyBible.slice(0, 6000) + '\n...(이하 생략)' : storyBible

const chapterContext = (idx) => {
  const c = chapters[idx]
  const prev = idx > 0 ? chapters[idx - 1] : null
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null
  return (
    (prev ? `[직전 챕터 ${prev.number} "${prev.title}"의 종료 상황]\n${prev.endState}\n\n` : '[이 챕터가 작품의 시작입니다]\n\n') +
    `[이번 챕터 사양]\n${JSON.stringify(c, null, 2)}\n\n` +
    (next ? `[다음 챕터 ${next.number} "${next.title}" 도입 예고]\nbeats: ${JSON.stringify(next.beats)}\n` : '[이 챕터가 작품의 마지막입니다 — 결말을 봉인할 것]\n')
  )
}

// ───────────────── 5+6. 집필 → 검수 → 퇴고 (파이프라인) ─────────────────
phase('집필')
log(`${chapters.length}개 챕터를 초고→검수→퇴고 파이프라인으로 집필합니다.`)

const chapterMetas = await pipeline(
  chapters,
  // Stage 1: 초고 집필
  (item, chapter, index) =>
    agent(
      `당신은 포스트휴먼/AI SF를 쓰는 뛰어난 한국 소설가입니다. 아래 자료로 ${chapter.number === 0 ? '프롤로그' : chapter.number + '장'} "${chapter.title}"의 초고를 한국어로 집필하세요.\n\n` +
      `[작품 컨셉]\n${conceptStr}\n\n[스토리 바이블 발췌]\n${bibleForWriting}\n\n[전체 아웃라인 개관]\n${chapters.map((c) => `${c.number}. ${c.title} — ${c.reveal}`).join('\n')}\n\n${chapterContext(index)}\n\n` +
      `집필 원칙:\n- 설명(telling)이 아니라 장면·감각·행동으로 보여주기(showing). 추상적 요약 금지.\n- 시점/시제/문체는 바이블의 문체 가이드를 엄격히 따를 것.\n- 포스트휴먼/AI 주제를 설교하지 말고 구체적 사건과 인물의 선택으로 체화.\n- 살아 있는 대화, 절제된 묘사, 한국어 산문의 리듬. 클리셰 표현 회피.\n- 목표 분량 약 ${chapter.targetWords}자. beats를 모두 소화하되 기계적으로 나열하지 말고 유기적으로 직조.\n- endState 상황으로 자연스럽게 도착해 다음 챕터로 연결.\n\n` +
      `메타 설명·머리말 없이 오직 소설 본문만 출력하세요. 최종 응답이 곧 초고 본문입니다.`,
      { label: `초고:${pad2(chapter.number)} ${chapter.title}`, phase: '집필' }
    ).then((draft) => ({ chapter, draft })),

  // Stage 2: 검수
  (prev, chapter) =>
    agent(
      `당신은 SF 노벨라 전문 에디터입니다. 아래 챕터 초고를 검수하세요.\n\n[작품 컨셉]\n${conceptStr}\n\n[이번 챕터 사양]\n${JSON.stringify(chapter, null, 2)}\n\n[스토리 바이블 발췌]\n${bibleForWriting}\n\n[초고]\n${prev.draft}\n\n` +
      `연속성(설정/인물/타임라인 위반), 문장·묘사·시점, 페이싱·정보배분을 점검하고, 반드시 살릴 강점도 짚으세요. 구체적이고 실행 가능한 지적만.`,
      { label: `검수:${pad2(chapter.number)} ${chapter.title}`, phase: '검수퇴고', schema: REVIEW_SCHEMA }
    ).then((review) => ({ chapter, draft: prev.draft, review })),

  // Stage 3: 퇴고 + 파일 기록
  (prev, chapter) => {
    const file = `${ROOT}/chapters/ch${pad2(chapter.number)}.md`
    const heading = chapter.number === 0 ? `## 프롤로그 — ${chapter.title}` : `## ${chapter.number}장 — ${chapter.title}`
    return agent(
      `당신은 출간 직전 원고를 다듬는 한국 소설가입니다. 아래 초고를 검수 의견에 따라 퇴고해 완성도를 끌어올리세요.\n\n` +
      `[초고]\n${prev.draft}\n\n[검수 의견]\n${JSON.stringify(prev.review, null, 2)}\n\n[이번 챕터 사양]\n${JSON.stringify(chapter, null, 2)}\n\n` +
      `퇴고 지침:\n- 검수의 연속성·문장·페이싱 지적을 반영하되, strengthsToKeep로 지목된 강점은 보존.\n- 문장을 더 정확하고 리듬감 있게, 묘사는 더 감각적으로, 군더더기는 제거.\n- 포스트휴먼/AI 주제의 정서적 울림을 강화. 목표 분량 약 ${chapter.targetWords}자 유지.\n- 시점·시제 일관성 엄수.\n\n` +
      `완성된 퇴고본을 반드시 Write 도구로 '${file}'에 저장하세요. 파일 맨 위 첫 줄은 정확히 "${heading}" 이고, 그 아래 빈 줄 후 본문만. 메타 설명 금지.\n` +
      `그런 다음 챕터 번호 ${chapter.number}, 제목 "${chapter.title}", 파일 경로 "${file}", 글자 수(공백 제외 대략), 1~2문장 시놉시스를 구조화해 반환하세요.`,
      { label: `퇴고:${pad2(chapter.number)} ${chapter.title}`, phase: '검수퇴고', schema: CHAPTER_META_SCHEMA }
    )
  }
)

const finishedChapters = chapterMetas.filter(Boolean).sort((a, b) => a.number - b.number)

// ───────────────────────── 7. 전체 감수 ─────────────────────────
phase('전체감수')
log('원고 전체의 연속성·정합성을 감수합니다.')

const audit = await agent(
  `당신은 노벨라 전체를 책임지는 총괄 감수자입니다. 아래 챕터 파일들을 Read 도구로 순서대로 모두 읽고, 작품 전체의 정합성을 감수하세요.\n\n` +
  `[작품 컨셉]\n${conceptStr}\n\n[챕터 파일 목록]\n${finishedChapters.map((c) => `${c.number}. ${c.title} → ${c.file}`).join('\n')}\n\n[아웃라인 reveal 흐름]\n${chapters.map((c) => `${c.number}. ${c.reveal}`).join('\n')}\n\n` +
  `점검 항목: 인물명·설정·타임라인 연속성, 복선의 회수, 챕터 간 톤·시점 일관성, 주제의 완결, 결말의 설득력, 분량 균형. ` +
  `치명적 문제(criticalIssues)는 챕터 번호와 함께 구체적 수정 지시까지. 사소한 것은 minorNotes로. ` +
  `감수 보고서를 Write 도구로 '${ROOT}/final/audit-report.md'에 한국어 마크다운으로도 저장하세요.`,
  { label: '전체감수', phase: '전체감수', schema: AUDIT_SCHEMA }
)

// 치명 이슈가 있으면 해당 챕터만 타깃 수정
let fixedChapters = []
if (audit.criticalIssues && audit.criticalIssues.length) {
  log(`치명 이슈 ${audit.criticalIssues.length}건 → 해당 챕터 타깃 수정`)
  const byChapter = {}
  for (const ci of audit.criticalIssues) {
    (byChapter[ci.chapterNumber] = byChapter[ci.chapterNumber] || []).push(ci)
  }
  fixedChapters = (await parallel(
    Object.keys(byChapter).map((numStr) => () => {
      const num = Number(numStr)
      const c = chapters.find((x) => x.number === num)
      const file = `${ROOT}/chapters/ch${pad2(num)}.md`
      const issues = byChapter[numStr]
      return agent(
        `당신은 정밀 수정 담당 작가입니다. '${file}' 챕터를 Read로 읽고, 아래 감수 지적을 정확히 반영해 수정한 뒤 같은 경로에 Write로 덮어쓰세요.\n\n` +
        `[챕터 사양]\n${JSON.stringify(c, null, 2)}\n\n[수정 지시]\n${JSON.stringify(issues, null, 2)}\n\n` +
        `지적된 문제만 외과적으로 수정하고 나머지 좋은 부분은 건드리지 마세요. 파일 첫 줄 챕터 헤딩 형식은 유지. 수정 요약을 반환하세요.`,
        { label: `수정:${pad2(num)} ${c ? c.title : ''}`, phase: '전체감수' }
      ).then((summary) => ({ chapterNumber: num, summary }))
    })
  )).filter(Boolean)
}

// ───────────────────────── 반환 ─────────────────────────
return {
  concept,
  trendReportSaved: `${ROOT}/research/trend-report.md`,
  bibleSaved: `${ROOT}/planning/story-bible.md`,
  outlineSaved: `${ROOT}/planning/outline.md`,
  premisesConsidered: premises.map((p) => ({ title: p.title, score: (ranked.find((r) => r.premise.id === p.id) || {}).avg })),
  chapters: finishedChapters,
  audit,
  fixedChapters,
}
