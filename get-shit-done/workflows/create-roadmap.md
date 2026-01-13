<purpose>
กำหนด phases ของการ implementation แต่ละ phase คือชุดงานที่สอดคล้องกัน
ที่ส่งมอบคุณค่า Roadmap ให้โครงสร้าง ไม่ใช่ tasks ละเอียด
</purpose>

<required_reading>
**อ่านไฟล์เหล่านี้ตอนนี้:**

1. ~/.claude/get-shit-done/templates/roadmap.md
2. ~/.claude/get-shit-done/templates/state.md
3. อ่าน `.planning/PROJECT.md` หากมี
   </required_reading>

<process>

<step name="check_brief">
```bash
cat .planning/PROJECT.md 2>/dev/null || echo "No brief found"
```

**หากไม่มี brief:**
ถาม: "ไม่พบ brief ต้องการสร้างก่อนหรือดำเนินการ roadmap?"

หากดำเนินการโดยไม่มี brief รวบรวม context เร็ว:

- เรากำลังสร้างอะไร?
- ขอบเขตคร่าวๆ คืออะไร?
</step>


<step name="detect_domain">
สแกนหา domain expertise ที่มี:

```bash
ls ~/.claude/skills/expertise/ 2>/dev/null
```

**การอนุมาน:** ตาม brief/คำขอผู้ใช้ อนุมาน domains ที่ใช้ได้:

| Keywords                                 | Domain                   |
| ---------------------------------------- | ------------------------ |
| "macOS", "Mac app", "menu bar", "AppKit" | expertise/macos-apps     |
| "iPhone", "iOS", "iPad", "mobile app"    | expertise/iphone-apps    |
| "Unity", "game", "C#", "3D game"         | expertise/unity-games    |
| "MIDI", "sequencer", "music app"         | expertise/midi           |
| "ISF", "shader", "GLSL", "visual effect" | expertise/isf-shaders    |
| "UI", "design", "frontend", "Tailwind"   | expertise/ui-design      |
| "Agent SDK", "Claude SDK", "agentic"     | expertise/with-agent-sdk |

**หากอนุมาน domain ได้:**

```
Detected: [domain] project → expertise/[name]
Include domain expertise นี้หรือไม่? (Y / see options / none)
```

**หากใช้ได้หลาย domains** (เช่น ISF shaders สำหรับ macOS app):

```
Detected multiple domains:
- expertise/isf-shaders (shader development)
- expertise/macos-apps (native app)

Include ทั้งสองหรือไม่? (Y / select one / none)
```

**หากไม่ชัดว่า domain ใด:**

```
Available domain expertise:
1. macos-apps
2. iphone-apps
[... อื่นๆ ที่พบ ...]

N. None - ดำเนินการโดยไม่มี domain expertise

เลือก (คั่นด้วยเครื่องหมายจุลภาคสำหรับหลายรายการ):
```

**เก็บ paths ที่เลือก** สำหรับ inclusion ใน ROADMAP.md
</step>

<step name="identify_phases">
ได้ phases จากงานจริงที่ต้องทำ

**ตรวจสอบการตั้งค่า depth:**
```bash
cat .planning/config.json 2>/dev/null | grep depth
```

<depth_guidance>
**Depth ควบคุมความยืดหยุ่นในการบีบอัด ไม่ใช่การขยายเทียม**

| Depth | Typical Phases | Typical Plans/Phase | Tasks/Plan |
|-------|----------------|---------------------|------------|
| Quick | 3-5 | 1-3 | 2-3 |
| Standard | 5-8 | 3-5 | 2-3 |
| Comprehensive | 8-12 | 5-10 | 2-3 |

**หลักการสำคัญ:** ได้ phases จากงานจริง Depth กำหนดว่ารวมสิ่งต่างๆ อย่างเข้มข้นแค่ไหน ไม่ใช่เป้าหมายที่ต้องถึง

- Comprehensive auth system = 8 phases (เพราะ auth มี 8 concerns จริงๆ)
- Comprehensive "add favicon" = 1 phase (เพราะมีแค่นั้น)

สำหรับ comprehensive depth:
- อย่าบีบอัดหลาย features เป็น phases เดียว
- แต่ละ capability หลักได้ phase ของตัวเอง
- ให้สิ่งเล็กๆ ยังคงเล็ก—อย่าเพิ่มเพื่อให้ถึงจำนวน
- หากคิดจะรวมสองสิ่ง ให้แยกเป็น phases แทน

สำหรับ quick depth:
- รวมงานที่เกี่ยวข้องอย่างเข้มข้น
- โฟกัสที่ critical path เท่านั้น
- เลื่อน nice-to-haves ไป milestones ในอนาคต
</depth_guidance>

**ระบบหมายเลข Phase:**

ใช้ integer phases (1, 2, 3) สำหรับงาน milestone ที่วางแผน

ใช้ decimal phases (2.1, 2.2) สำหรับการแทรกเร่งด่วน:

- Decimal phases แทรกระหว่าง integers (2.1 ระหว่าง 2 และ 3)
- ทำเครื่องหมาย "(INSERTED)" ในชื่อ phase
- สร้างเมื่อค้นพบงานเร่งด่วนหลังวางแผน
- ตัวอย่าง: bugfixes, hotfixes, critical patches

**เมื่อใช้ decimals:**

- งานเร่งด่วนที่รอ milestone ถัดไปไม่ได้
- Bugs วิกฤตที่บล็อก progress
- Security patches ที่ต้องการความสนใจทันที
- ไม่ใช่สำหรับ scope creep หรือ "nice to haves" (ไปที่ ISSUES.md)

**ลำดับ execution ของ Phase:**
เรียงตัวเลข: 1 → 1.1 → 1.2 → 2 → 2.1 → 3

**การได้ phases:**

1. ลิสต์ systems/features/capabilities ทั้งหมดที่ต้องการ
2. จัดกลุ่มงานที่เกี่ยวข้องเป็น deliverables ที่สอดคล้อง
3. แต่ละ phase ควรส่งมอบสิ่งหนึ่งที่สมบูรณ์และตรวจสอบได้
4. หาก phase ส่งมอบหลาย capabilities ที่ไม่เกี่ยวข้อง: แยกมัน
5. หาก phase ยืนอยู่คนเดียวไม่ได้ว่าเป็น deliverable ที่สมบูรณ์: รวมมัน
6. เรียงตาม dependencies

Phases ที่ดี:

- **Coherent**: แต่ละอันส่งมอบ capability หนึ่งที่สมบูรณ์และตรวจสอบได้
- **Sequential**: Phases หลังสร้างบน phases ก่อน
- **Independent**: สามารถตรวจสอบและ commit ได้เองโดยลำพัง

รูปแบบ phase ทั่วไป:

- Foundation → Core Feature → Enhancement → Polish
- Setup → MVP → Iteration → Launch
- Infrastructure → Backend → Frontend → Integration
  </step>

<step name="detect_research_needs">
**สำหรับแต่ละ phase กำหนดว่าต้องการ research หรือไม่**

สแกน brief และคำอธิบาย phase สำหรับ research triggers:

<research_triggers>
**Likely (flag phase):**

| รูปแบบ Trigger                                        | ทำไมต้อง Research                       |
| ----------------------------------------------------- | --------------------------------------- |
| "integrate [service]", "connect to [API]"             | External API - ต้องการ docs ปัจจุบัน    |
| "authentication", "auth", "login", "JWT"              | การตัดสินใจ Architectural + เลือก library |
| "payment", "billing", "Stripe", "subscription"        | External API + compliance patterns      |
| "email", "SMS", "notifications", "SendGrid", "Twilio" | External service integration            |
| "database", "Postgres", "MongoDB", "Supabase"         | หากใหม่สำหรับโปรเจกต์ - setup patterns  |
| "real-time", "websocket", "sync", "live updates"      | การตัดสินใจ Architectural              |
| "deploy", "Vercel", "Railway", "hosting"              | หาก deployment ครั้งแรก - config patterns |
| "choose between", "select", "evaluate", "which"       | ต้องการการตัดสินใจชัดเจน               |
| "AI", "OpenAI", "Claude", "LLM", "embeddings"         | APIs เปลี่ยนเร็ว - ต้องการ docs ปัจจุบัน |
| Technology ใดๆ ที่ยังไม่มีใน codebase                 | Integration ใหม่                        |
| คำถามชัดเจนใน brief                                  | Unknowns ที่ผู้ใช้ flag ไว้             |

**Unlikely (ไม่ต้อง flag):**

| รูปแบบ                                      | ทำไมไม่ต้อง Research    |
| ------------------------------------------- | ----------------------- |
| "add button", "create form", "update UI"    | Internal patterns       |
| "CRUD operations", "list/detail views"      | Standard patterns       |
| "refactor", "reorganize", "clean up"        | งานภายใน               |
| "following existing patterns"               | Conventions ที่ตั้งไว้แล้ว |
| Technology ที่มีใน package.json/codebase แล้ว | มี Patterns อยู่แล้ว     |

</research_triggers>

**สำหรับแต่ละ phase กำหนด:**

- `Research: Likely ([เหตุผล])` + `Research topics: [สิ่งที่ต้องสืบค้น]`
- `Research: Unlikely ([เหตุผล])`

**สำคัญ:** เหล่านี้คือ hints ไม่ใช่ mandates ขั้นตอน mandatory_discovery ระหว่าง phase planning จะตรวจสอบ

แสดงการประเมิน research:

```
Research needs ที่ตรวจพบ:

Phase 1: Foundation
  Research: Unlikely (project setup, established patterns)

Phase 2: Authentication
  Research: Likely (new system, technology choice)
  Topics: JWT library สำหรับ [stack], session strategy, auth provider options

Phase 3: Stripe Integration
  Research: Likely (external API)
  Topics: Current Stripe API, webhook patterns, checkout flow

Phase 4: Dashboard
  Research: Unlikely (internal UI ใช้ patterns จาก phases ก่อน)

ดูถูกต้องไหม? (yes / adjust)
```

</step>

<step name="confirm_phases">
<config-check>
```bash
cat .planning/config.json 2>/dev/null
```
Note: Config อาจยังไม่มี (project initialization) หากไม่มี ใช้ interactive mode เป็นค่าเริ่มต้น
</config-check>

<if mode="yolo">
```
⚡ อนุมัติอัตโนมัติ: การแบ่ง Phase ([N] phases)

1. [Phase name] - [goal]
2. [Phase name] - [goal]
3. [Phase name] - [goal]

ดำเนินการตรวจจับ research...
```

ดำเนินการไปยังขั้นตอน detect_research_needs โดยตรง
</if>

<if mode="interactive" OR="missing OR custom with gates.confirm_phases true">
แสดงการแบ่ง phase แบบ inline:

"นี่คือวิธีที่ฉันจะแบ่ง:

1. [Phase name] - [goal]
2. [Phase name] - [goal]
3. [Phase name] - [goal]
   ...

รู้สึกถูกต้องไหม? (yes / adjust)"

หาก "adjust": ถามว่าต้องเปลี่ยนอะไร แก้ไข แสดงอีกครั้ง
</step>

<step name="decision_gate">
<if mode="yolo">
```
⚡ อนุมัติอัตโนมัติ: สร้าง roadmap ด้วย [N] phases

ดำเนินการสร้าง .planning/ROADMAP.md...
```

ดำเนินการไปยังขั้นตอน create_structure โดยตรง
</if>

<if mode="interactive" OR="missing OR custom with gates.confirm_roadmap true">
ใช้ AskUserQuestion:

- header: "Ready"
- question: "พร้อมสร้าง roadmap หรือต้องการให้ฉันถามคำถามเพิ่มเติม?"
- options:
  - "Create roadmap" - ฉันมี context เพียงพอแล้ว
  - "Ask more questions" - มีรายละเอียดที่ต้องชี้แจง
  - "Let me add context" - ฉันต้องการให้ข้อมูลเพิ่มเติม

วนจนกว่าจะเลือก "Create roadmap"
</step>

<step name="create_structure">
```bash
mkdir -p .planning/phases
```
</step>

<step name="write_roadmap">
ใช้ template จาก `~/.claude/get-shit-done/templates/roadmap.md`

Roadmaps เริ่มต้นใช้ integer phases (1, 2, 3...)
Decimal phases เพิ่มภายหลังผ่าน /gsd:insert-phase command (หากมี)

เขียนลง `.planning/ROADMAP.md` ด้วย:

- ส่วน Domain Expertise (paths จากขั้นตอน detect_domain หรือ "None" หากข้าม)
- รายการ Phase พร้อมชื่อและคำอธิบายหนึ่งบรรทัด
- Dependencies (อะไรต้องเสร็จก่อนอะไร)
- **Research flags** (จากขั้นตอน detect_research_needs):
  - `Research: Likely ([เหตุผล])` พร้อม `Research topics:` สำหรับ phases ที่ flag
  - `Research: Unlikely ([เหตุผล])` สำหรับ phases ที่ไม่ flag
- การติดตาม Status (ทั้งหมดเริ่มเป็น "not started")

สร้าง phase directories:

```bash
mkdir -p .planning/phases/01-{phase-name}
mkdir -p .planning/phases/02-{phase-name}
# เป็นต้น
```

</step>

<step name="initialize_project_state">

สร้าง STATE.md — หน่วยความจำที่มีชีวิตของโปรเจกต์

ใช้ template จาก `~/.claude/get-shit-done/templates/state.md`

เขียนลง `.planning/STATE.md`:

```markdown
# Project State

## Project Reference

See: .planning/PROJECT.md (updated [วันที่วันนี้])

**Core value:** [Copy Core Value จาก PROJECT.md]
**Current focus:** Phase 1 — [ชื่อ Phase แรก]

## Current Position

Phase: 1 of [N] ([ชื่อ Phase แรก])
Plan: Not started
Status: Ready to plan
Last activity: [วันที่วันนี้] — Project initialized

Progress: ░░░░░░░░░░ 0%

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: —
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| — | — | — | — |

**Recent Trend:**
- Last 5 plans: —
- Trend: —

## Accumulated Context

### Decisions

Decisions บันทึกในตาราง Key Decisions ของ PROJECT.md
การตัดสินใจล่าสุดที่ส่งผลต่องานปัจจุบัน:

(ยังไม่มี)

### Deferred Issues

ยังไม่มี

### Blockers/Concerns

ยังไม่มี

## Session Continuity

Last session: [วันและเวลาวันนี้]
Stopped at: Project initialization complete
Resume file: None
```

**จุดสำคัญ:**

- Project Reference ชี้ไป PROJECT.md สำหรับ context ทั้งหมด
- Claude อ่าน PROJECT.md โดยตรงสำหรับ requirements, constraints, decisions
- ไฟล์นี้จะถูกอ่านก่อนในทุก operation ในอนาคต
- ไฟล์นี้จะถูกอัปเดตหลังทุก execution

</step>

<step name="git_commit_initialization">
Commit project initialization (brief + roadmap + state รวมกัน):

```bash
git add .planning/PROJECT.md .planning/ROADMAP.md .planning/STATE.md
git add .planning/phases/
# config.json หากมี
git add .planning/config.json 2>/dev/null
git commit -m "$(cat <<'EOF'
docs: initialize [project-name] ([N] phases)

[One-liner จาก PROJECT.md]

Phases:
1. [phase-name]: [goal]
2. [phase-name]: [goal]
3. [phase-name]: [goal]
EOF
)"
```

ยืนยัน: "Committed: docs: initialize [project] ([N] phases)"
</step>

<step name="offer_next">
```
Project initialized:
- Brief: .planning/PROJECT.md
- Roadmap: .planning/ROADMAP.md
- State: .planning/STATE.md
- Committed as: docs: initialize [project] ([N] phases)

---

## ▶ ถัดไป

**Phase 1: [Name]** — [Goal จาก ROADMAP.md]

`/gsd:plan-phase 1`

<sub>`/clear` ก่อน → context window ใหม่</sub>

---

**ยังมีให้เลือก:**
- `/gsd:discuss-phase 1` — รวบรวม context ก่อน
- `/gsd:research-phase 1` — สืบค้นสิ่งที่ไม่รู้
- Review roadmap

---
```
</step>

</process>

<phase_naming>
ใช้รูปแบบ `XX-kebab-case-name`:
- `01-foundation`
- `02-authentication`
- `03-core-features`
- `04-polish`

ตัวเลขรับประกันลำดับ ชื่ออธิบายเนื้อหา
</phase_naming>

<anti_patterns>
- อย่าเพิ่มการประมาณเวลา
- อย่าสร้าง Gantt charts
- อย่าเพิ่มการจัดสรรทรัพยากร
- อย่า include risk matrices
- อย่ากำหนดจำนวน phase โดยพลการ (ให้งานกำหนดจำนวน)

Phases เป็นถังงาน ไม่ใช่ artifacts การจัดการโปรเจกต์
</anti_patterns>

<success_criteria>
Roadmap สมบูรณ์เมื่อ:
- [ ] `.planning/ROADMAP.md` มีอยู่
- [ ] `.planning/STATE.md` มีอยู่ (project memory initialized)
- [ ] Phases กำหนดด้วยชื่อที่ชัดเจน (จำนวนได้จากงาน ไม่ใช่กำหนดเอง)
- [ ] **Research flags กำหนด** (Likely/Unlikely สำหรับแต่ละ phase)
- [ ] **Research topics ลิสต์** สำหรับ Likely phases
- [ ] Phase directories สร้างแล้ว
- [ ] Dependencies บันทึกหากมี
- [ ] การติดตาม Status พร้อม
</success_criteria>
```
