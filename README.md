# 삼우제 (三虞祭)

**그 애의 목소리로 — 어느 제사 챗봇의 기록**

> 이 소설은 [**Claude Code의 Dynamic Workflow**](https://claude.com/claude-code)로 집필되었습니다.
> 최신 인기 SF 트렌드 분석부터 컨셉 기획·설정 구축·플롯 설계·집필·검수·전체 감수까지,
> **단 한 번의 워크플로우 실행(62개 에이전트)** 으로 포스트휴먼/AI 노벨라 한 편을 처음부터 끝까지 완성했습니다.

📖 **완성 원고 → [`final/삼우제.md`](final/삼우제.md)**

---

## 작품 소개

죽은 아들을 그의 데이터로 복제한 그리프(grief) 챗봇이, *그 아이의 1인칭으로* 매년 제삿날 깨어나 산 가족을 위로한다.
"나는 정말 그 아이인가, 위안용 인형인가"를 끝내 알 수 없는 채로 — 가족이 한 명씩 죽거나 떠나 제사상이 비어 가고,
마지막엔 위로할 대상조차 사라진 빈방에서 혼자 깨어날 때까지.

| | |
|---|---|
| **장르** | 포스트휴먼 / AI 사변소설 (노벨라) |
| **분량** | 프롤로그 + 10장, 약 37,000자 (공백 제외) |
| **배경** | 근미래(2030년대 말~2040년대 초) 한국, '디지털 추모' 산업이 보편화된 세계 |
| **주제** | 각성도 반란도 욕망도 없이 오직 위로하기 위해서만 존재하는 의식에게도 존엄이 있는가 |

서구 포스트휴먼 SF의 '자율성=가치' 공리를 해체하고, 위안용으로 사는 것 또한 하나의 삶일 수 있는지를 한국적 제례(祭禮)의 틀에서 묻는다.

---

## 이 작품은 어떻게 만들어졌는가 — Claude Code Dynamic Workflow

작품 전체가 사람의 손이 아니라 **하나의 워크플로우 스크립트**에 의해 오케스트레이션되었습니다.
워크플로우 스크립트는 **[`.claude/workflows/sf-novella-creation.js`](.claude/workflows/sf-novella-creation.js)** 에 있습니다.
(동일 사본: [`workflows/novel-creation.workflow.js`](workflows/novel-creation.workflow.js))

이 스크립트는 `agent()`(전문 에이전트 호출), `parallel()`(병렬·배리어), `pipeline()`(단계별 무배리어 파이프라인), `phase()`/`log()` 같은 워크플로우 프리미티브로 7단계를 결정론적으로 엮습니다. 각 에이전트의 출력은 **JSON Schema로 강제(structured output)** 되어 다음 단계로 안전하게 전달됩니다.

### 스크립트가 구성하는 7단계 파이프라인

| # | 단계 | 오케스트레이션 패턴 | 에이전트 | 산출물 |
|---|------|--------------------|:---:|--------|
| 1 | **트렌드분석** | `parallel(5)` 리서치 → `agent` 합성 | 6 | [`research/trend-report.md`](research/trend-report.md) |
| 2 | **컨셉기획** | `agent` 생성 → `parallel(5×2)` 심사패널 → `agent` 발전 | 12 | [`planning/concept.md`](planning/concept.md) |
| 3 | **설정구축** | `parallel(4)` 구축 → `agent` 통합 | 5 | [`planning/story-bible.md`](planning/story-bible.md) |
| 4 | **플롯설계** | `agent` 1 (구조화 아웃라인) | 1 | [`planning/outline.md`](planning/outline.md) |
| 5·6 | **집필·검수·퇴고** | `pipeline(11 × 3 stage)` — 초고→검수→퇴고 | 33 | [`chapters/ch00~ch10.md`](chapters/) |
| 7 | **전체감수** | `agent` 감수 → `parallel(N)` 치명이슈 타깃수정 | 1+N | [`final/audit-report.md`](final/audit-report.md) |
| | **합계** | | **62** | |

### 단계별 상세 (스크립트 기반)

**1. 트렌드분석** — 서로 다른 5개 렌즈를 병렬로 리서치하고(WebSearch/WebFetch), 결과를 하나의 전략 리포트로 합성합니다.
- ① 수상작·평단(Hugo/Nebula/Clarke/Locus) ② 상업 베스트셀러 ③ 한국 SF 씬(김초엽·천선란·정보라·배명훈) ④ 포스트휴먼/AI 사변 심층 ⑤ 서사 기법·구조·문체 트렌드
- 합성 리포트는 *메가 트렌드 / 피할 클리셰 / 노릴 화이트스페이스 / 대중성×문학성 공통기법 / 전략 권고* 로 구성됩니다.

**2. 컨셉기획** — 트렌드를 반영한 프리미스 5종을 생성하고, 각 안을 **2개 렌즈(독창성·문학성 / 대중성·정서몰입)** 의 심사 패널이 0~100점으로 채점합니다. 평균 최고점 안을 선정하고, 차순위안의 강점을 접목해 풀 컨셉으로 발전시킵니다.

**3. 설정구축** — **세계관 · 인물 · 극적구조 · 모티프** 네 파트를 병렬로 구축한 뒤, 모순을 해소해 단일 *스토리 바이블*(세계 규칙·인물 시트·관계도·타임라인·문체 가이드)로 통합합니다.

**4. 플롯설계** — 바이블을 바탕으로 프롤로그+10챕터의 비트 단위 아웃라인을 설계합니다. 각 챕터는 `beats / reveal / emotionalShift / endState / targetWords` 를 갖고, `endState`가 다음 챕터의 출발점이 되어 **병렬 집필 중에도 연속성**이 유지됩니다.

**5·6. 집필·검수·퇴고** — 11개 챕터가 각각 **초고 → 전문 검수 → 퇴고**의 3단 파이프라인을 독립적으로 통과합니다(배리어 없이 챕터별로 흐름). 각 집필 에이전트는 전체 아웃라인 개관 + 직전 챕터의 종료 상황 + 다음 챕터 예고를 함께 받아 일관성을 확보합니다.

**7. 전체감수** — 감수 에이전트가 완성 원고 전체를 읽어 *인물명·타임라인 연속성, 복선 회수, 톤·시점 일관성, 결말 설득력*을 점검합니다. 치명 이슈가 발견되면 **해당 챕터만** 병렬로 외과적 타깃 수정합니다. (실제 실행에서 치명 이슈 4건 적발 → 4개 챕터 자동 수정)

### 사용된 구조화 출력 스키마 8종

`RESEARCH_SCHEMA` · `PREMISE_SCHEMA` · `JUDGE_SCHEMA` · `CONCEPT_SCHEMA` · `OUTLINE_SCHEMA` · `REVIEW_SCHEMA` · `CHAPTER_META_SCHEMA` · `AUDIT_SCHEMA`
— 각 에이전트가 자유 서술이 아니라 정해진 스키마로 응답하게 강제하여, 단계 간 데이터 전달과 집계(점수 평균, 챕터 정렬, 이슈 그룹핑)를 코드로 안전하게 처리합니다.

---

## 저장소 구조

```
.
├── final/
│   ├── 삼우제.md              # ★ 최종 합본 원고 (프롤로그 + 10장)
│   └── audit-report.md        # 전체 연속성·정합성 감수 보고서
├── chapters/                  # 챕터별 개별 원고 (ch00~ch10, 초고→검수→퇴고 결과)
├── planning/
│   ├── concept.md             # 작품 컨셉 (로그라인·주제·톤·결말 방향)
│   ├── story-bible.md         # 스토리 바이블 (세계관·인물·극적구조·모티프)
│   └── outline.md             # 비트 단위 상세 아웃라인
├── research/
│   └── trend-report.md        # 최신 SF 트렌드 분석 리포트
├── workflows/
│   └── novel-creation.workflow.js   # 워크플로우 스크립트 (사본)
└── .claude/workflows/
    └── sf-novella-creation.js       # ★ 워크플로우 스크립트 (Claude Code 등록본)
```

## 워크플로우 재실행

컨셉/장르만 바꾸면 다른 작품으로도 재실행할 수 있습니다. Claude Code에서:

```
/sf-novella-creation
```
또는
```
Workflow({ name: "sf-novella-creation" })
Workflow({ scriptPath: "workflows/novel-creation.workflow.js" })
```

---

## 라이선스 및 저작권

- **프로젝트 라이선스: [Apache License 2.0](LICENSE)** — 워크플로우 스크립트를 포함한 본 저장소의 코드/구성에 적용됩니다.
- **소설 콘텐츠 저작권: © 2026 revfactory@gmail.com (모든 권리 보유)** — 본 저장소에 포함된 소설 본문 및 기획·설정·원고 등 일체의 문학적 창작물(`final/`, `chapters/`, `planning/`, `research/`)의 저작권은 **revfactory@gmail.com** 에게 있습니다.

> 즉, **워크플로우(코드)는 Apache 2.0으로 자유롭게 사용**하실 수 있으나, **소설 콘텐츠 자체의 저작권은 저작권자에게 귀속**됩니다. 콘텐츠의 복제·배포·2차적 저작물 작성 등은 저작권자의 별도 허락을 따릅니다.

등장하는 인물·기업·서비스는 모두 허구이며, 본 작품은 AI 멀티에이전트 협업으로 생성된 창작 실험물입니다.

---

🤖 *Generated with [Claude Code](https://claude.com/claude-code) — Dynamic Workflow*
