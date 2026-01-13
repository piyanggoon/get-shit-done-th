<decimal_phase_numbering>
Decimal phases เปิดให้แทรกงานเร่งด่วนโดยไม่ต้อง renumber:

- Integer phases (1, 2, 3) = งาน milestone ที่วางแผน
- Decimal phases (2.1, 2.2) = การแทรกเร่งด่วนระหว่าง integers

**กฎ:**
- Decimals ระหว่าง consecutive integers (2.1 ระหว่าง 2 และ 3)
- Filesystem sorting ทำงานอัตโนมัติ (2 < 2.1 < 2.2 < 3)
- Directory format: `02.1-description/`, Plan format: `02.1-01-PLAN.md`

**Validation:** Integer X ต้องมีและ complete, X+1 ต้องมีใน roadmap, decimal X.Y ต้องไม่มี, Y >= 1
</decimal_phase_numbering>

<required_reading>
**อ่านไฟล์เหล่านี้ตอนนี้:**

1. ~/.claude/get-shit-done/templates/phase-prompt.md
2. ~/.claude/get-shit-done/references/plan-format.md
3. ~/.claude/get-shit-done/references/scope-estimation.md
4. ~/.claude/get-shit-done/references/checkpoints.md
5. ~/.claude/get-shit-done/references/tdd.md
6. .planning/ROADMAP.md
7. .planning/PROJECT.md

**โหลด domain expertise จาก ROADMAP:**
- Parse ส่วน `## Domain Expertise` ของ ROADMAP.md สำหรับ paths
- อ่านแต่ละ domain SKILL.md (เหล่านี้ทำหน้าที่เป็น indexes)
- กำหนด phase type และโหลดเฉพาะ references ที่เกี่ยวข้องกับ phase type นี้จาก `<references_index>` ของแต่ละ SKILL.md
</required_reading>

<purpose>
สร้าง executable phase prompt (PLAN.md) PLAN.md คือ prompt ที่ Claude execute - ไม่ใช่เอกสารที่ถูก transform
</purpose>

<planning_principles>
**Secure by design:** สมมติ hostile input ที่ทุก boundary Validate, parameterize, authenticate, fail closed

**Performance by design:** สมมติ production load ไม่ใช่ demo conditions Plan สำหรับ efficient data access, appropriate caching, minimal round trips

**Observable by design:** Plan เพื่อ debug งานของตัวเอง Include meaningful error messages, appropriate logging และ clear failure states
</planning_principles>

<process>

<step name="load_project_state" priority="first">
อ่าน `.planning/STATE.md` และ parse:
- Current position (phase ไหนที่กำลัง plan)
- Accumulated decisions (constraints สำหรับ phase นี้)
- Deferred issues (candidates สำหรับ inclusion)
- Blockers/concerns (สิ่งที่ phase นี้อาจจัดการ)
- Brief alignment status

หาก STATE.md ไม่มีแต่ .planning/ มี เสนอให้ reconstruct หรือดำเนินการโดยไม่มี
</step>

<step name="load_codebase_context">
ตรวจสอบ codebase map:

```bash
ls .planning/codebase/*.md 2>/dev/null
```

**หาก .planning/codebase/ มี:** โหลด documents ที่เกี่ยวข้องตาม phase type:

| Phase Keywords | Load These |
|----------------|------------|
| UI, frontend, components | CONVENTIONS.md, STRUCTURE.md |
| API, backend, endpoints | ARCHITECTURE.md, CONVENTIONS.md |
| database, schema, models | ARCHITECTURE.md, STACK.md |
| testing, tests | TESTING.md, CONVENTIONS.md |
| integration, external API | INTEGRATIONS.md, STACK.md |
| refactor, cleanup | CONCERNS.md, ARCHITECTURE.md |
| setup, config | STACK.md, STRUCTURE.md |
| (default) | STACK.md, ARCHITECTURE.md |

Track extracted constraints สำหรับ PLAN.md context section
</step>

<step name="identify_phase">
ตรวจสอบ roadmap และ existing phases:

```bash
cat .planning/ROADMAP.md
ls .planning/phases/
```

หากมีหลาย phases ให้เลือก ถามว่าจะ plan อันไหน หากชัดเจน (first incomplete phase) ดำเนินการ

**Phase number parsing:** Regex `^(\d+)(?:\.(\d+))?$` - Group 1: integer, Group 2: decimal (optional)

**หากเป็น decimal phase:** Validate ว่า integer X มีและ complete, X+1 มีใน roadmap, decimal X.Y ไม่มี, Y >= 1

อ่าน PLAN.md หรือ DISCOVERY.md ใดๆ ที่มีอยู่ใน phase directory
</step>

<step name="mandatory_discovery">
**Discovery เป็น MANDATORY เว้นแต่คุณพิสูจน์ได้ว่ามี current context**

<discovery_decision>
**Level 0 - Skip** (pure internal work, existing patterns only)
- งานทั้งหมดทำตาม established codebase patterns (grep confirms)
- ไม่มี new external dependencies
- Pure internal refactoring หรือ feature extension
- ตัวอย่าง: Add delete button, add field to model, create CRUD endpoint

**Level 1 - Quick Verification** (2-5 min)
- Single known library, ยืนยัน syntax/version
- Low-risk decision (เปลี่ยนได้ง่ายทีหลัง)
- Action: Context7 resolve-library-id + query-docs, ไม่ต้องสร้าง DISCOVERY.md

**Level 2 - Standard Research** (15-30 min)
- เลือกระหว่าง 2-3 options
- New external integration (API, service)
- Medium-risk decision
- Action: Route ไป workflows/discovery-phase.md depth=standard, สร้าง DISCOVERY.md

**Level 3 - Deep Dive** (1+ hour)
- Architectural decision ที่มี long-term impact
- Novel problem ที่ไม่มี clear patterns
- High-risk, ยากที่จะเปลี่ยนทีหลัง
- Action: Route ไป workflows/discovery-phase.md depth=deep, DISCOVERY.md เต็มรูปแบบ

**Depth indicators:**
- Level 2+: New library ไม่อยู่ใน package.json, external API, "choose/select/evaluate" ในคำอธิบาย, roadmap marked Research: Yes
- Level 3: "architecture/design/system", multiple external services, data modeling, auth design, real-time/distributed
</discovery_decision>

หาก roadmap flagged `Research: Likely`, Level 0 (skip) ไม่มีให้เลือก

สำหรับ niche domains (3D, games, audio, shaders, ML) แนะนำ `/gsd:research-phase` ก่อน plan-phase
</step>

<step name="read_project_history">
**Intelligent context assembly จาก frontmatter dependency graph:**

**1. Scan summary frontmatter ทั้งหมด (cheap - 25 บรรทัดแรก):**

```bash
for f in .planning/phases/*/*-SUMMARY.md; do
  # ดึง frontmatter เท่านั้น (ระหว่าง --- markers สองอันแรก)
  sed -n '1,/^---$/p; /^---$/q' "$f" | head -30
done
```

Parse YAML เพื่อดึง: phase, subsystem, requires, provides, affects, tags, key-decisions, key-files

**2. สร้าง dependency graph สำหรับ current phase:**

- **Check affects field:** Prior phases ไหนมี current phase ใน `affects` list? → Direct dependencies
- **Check subsystem:** Prior phases ไหน share same subsystem? → Related work
- **Check requires chains:** หาก phase X requires phase Y และเราต้องการ X เราก็ต้องการ Y → Transitive dependencies
- **Check roadmap:** Phases ใดๆ ที่ marked เป็น dependencies ใน ROADMAP.md phase description?

**3. Select relevant summaries:**

Auto-select phases ที่ match ข้อใดข้อหนึ่ง:
- Current phase name/number ปรากฏใน prior phase's `affects` field
- Same `subsystem` value
- ใน `requires` chain (transitive closure)
- Explicitly mentioned ใน STATE.md decisions ว่าส่งผลต่อ current phase

Typical selection: 2-4 prior phases (immediately prior + related subsystem work)

**4. Extract context จาก frontmatter (ไม่ต้องเปิด full summaries ยัง):**

จาก selected phases' frontmatter ดึง:
- **Tech available:** Union ของทุก tech-stack.added lists
- **Patterns established:** Union ของทุก tech-stack.patterns และ patterns-established
- **Key files:** Union ของทุก key-files (สำหรับ @context references)
- **Decisions:** ดึง key-decisions จาก frontmatter

**5. ตอนนี้อ่าน FULL summaries สำหรับ selected phases:**

ตอนนี้เท่านั้นที่เปิดและอ่าน complete SUMMARY.md files สำหรับ selected relevant phases ดึง:
- ส่วน "Accomplishments" ละเอียด
- "Next Phase Readiness" warnings/blockers
- "Issues Encountered" ที่อาจส่งผลต่อ current phase
- "Deviations from Plan" สำหรับ patterns

**จาก STATE.md:** Decisions → constrain approach Deferred issues → candidates Blockers → may need to address

**จาก ISSUES.md:**

```bash
cat .planning/ISSUES.md 2>/dev/null
```

ประเมินแต่ละ open issue - เกี่ยวข้องกับ phase นี้? รอนานพอ? เป็นธรรมชาติที่จะจัดการตอนนี้? Blocking something?

**ตอบก่อนดำเนินการ:**
- Q1: Decisions ใดจาก previous phases constrain phase นี้?
- Q2: มี deferred issues ที่ควรกลายเป็น tasks หรือไม่?
- Q3: มี concerns จาก "Next Phase Readiness" ที่ใช้ได้หรือไม่?
- Q4: เมื่อพิจารณา context ทั้งหมด คำอธิบายของ roadmap ยังสมเหตุสมผลหรือไม่?

**Track สำหรับ PLAN.md context section:**
- Summaries ไหนถูก select (สำหรับ @context references)
- Tech stack available (จาก frontmatter)
- Established patterns (จาก frontmatter)
- Key files to reference (จาก frontmatter)
- Applicable decisions (จาก frontmatter + full summary)
- Issues being addressed (จาก ISSUES.md)
- Concerns being verified (จาก "Next Phase Readiness")
</step>

<step name="gather_phase_context">
เข้าใจ:
- Phase goal (จาก roadmap)
- อะไรมีอยู่แล้ว (scan codebase หากเป็น mid-project)
- Dependencies met (previous phases complete?)
- {phase}-RESEARCH.md ใดๆ (จาก /gsd:research-phase)
- DISCOVERY.md ใดๆ (จาก mandatory discovery)
- {phase}-CONTEXT.md ใดๆ (จาก /gsd:discuss-phase)

```bash
# หากเป็น mid-project เข้าใจ current state
ls -la src/ 2>/dev/null
cat package.json 2>/dev/null | head -20

# ตรวจสอบ ecosystem research (จาก /gsd:research-phase)
cat .planning/phases/XX-name/${PHASE}-RESEARCH.md 2>/dev/null

# ตรวจสอบ phase context (จาก /gsd:discuss-phase)
cat .planning/phases/XX-name/${PHASE}-CONTEXT.md 2>/dev/null
```

**หาก RESEARCH.md มี:** ใช้ standard_stack (libraries เหล่านี้), architecture_patterns (ทำตามใน task structure), dont_hand_roll (อย่าสร้าง custom solutions สำหรับปัญหาที่ลิสต์เด็ดขาด), common_pitfalls (แจ้ง verification), code_examples (reference ใน actions)

**หาก CONTEXT.md มี:** เคารพ vision, ให้ความสำคัญ essential, เคารพ boundaries, incorporate specifics

**หากไม่มีทั้งสอง:** แนะนำ /gsd:research-phase สำหรับ niche domains, /gsd:discuss-phase สำหรับ simpler domains, หรือดำเนินการด้วย roadmap เท่านั้น
</step>

<step name="break_into_tasks">
แยก phase เป็น tasks และระบุ TDD candidates

**Standard tasks ต้องการ:**
- **Type**: auto, checkpoint:human-verify, checkpoint:decision (human-action rarely needed)
- **Task name**: ชัดเจน action-oriented
- **Files**: ไฟล์ใดสร้าง/แก้ไข (สำหรับ auto tasks)
- **Action**: Implementation เฉพาะ (รวมถึงอะไรที่ต้องหลีกเลี่ยงและทำไม)
- **Verify**: วิธีพิสูจน์ว่าทำงาน
- **Done**: Acceptance criteria

**TDD detection:** สำหรับแต่ละ potential task ประเมิน TDD fit:

TDD candidates (สร้าง dedicated TDD plans):
- Business logic ที่มี defined inputs/outputs
- API endpoints ที่มี request/response contracts
- Data transformations, parsing, formatting
- Validation rules และ constraints
- Algorithms ที่มี testable behavior
- State machines และ workflows

Standard tasks (ยังอยู่ใน standard plans):
- UI layout, styling, visual components
- Configuration changes
- Glue code connecting existing components
- One-off scripts และ migrations
- Simple CRUD ที่ไม่มี business logic

**Heuristic:** สามารถเขียน `expect(fn(input)).toBe(output)` ก่อนเขียน `fn` ได้หรือไม่?
→ Yes: สร้าง dedicated TDD plan สำหรับ feature นี้ (one feature per TDD plan)
→ No: Standard task ใน standard plan

**ทำไม TDD ได้ plan ของตัวเอง:** TDD ต้องการ 2-3 execution cycles (RED → GREEN → REFACTOR) แต่ละอันมี file reads, test runs และ potential debugging Embedded ใน multi-task plan, TDD work ใช้ 50-60% ของ context คนเดียว ทำให้ quality ลดลงสำหรับ tasks ที่เหลือ

**Test framework:** หากโปรเจกต์ไม่มี test setup และต้องการ TDD plans, TDD plan แรกจะ handle framework setup เป็นส่วนของการเขียน test แรกใน RED phase

ดู `~/.claude/get-shit-done/references/tdd.md` สำหรับ TDD plan structure

**Checkpoints:** Visual/functional verification → checkpoint:human-verify Implementation choices → checkpoint:decision Manual action (email, 2FA) → checkpoint:human-action (rare)

**สำคัญ:** หาก external resource มี CLI/API (Vercel, Stripe, etc.) ใช้ type="auto" เพื่อ automate Checkpoint สำหรับ verification หลัง automation เท่านั้น

ดู ~/.claude/get-shit-done/references/checkpoints.md สำหรับ checkpoint structure
</step>

<step name="estimate_scope">
หลัง tasks ประเมินกับ quality degradation curve

**Check depth setting:**
```bash
cat .planning/config.json 2>/dev/null | grep depth
```

<depth_aware_splitting>
**Depth ควบคุมความยืดหยุ่นในการบีบอัด ไม่ใช่การขยายเทียม**

| Depth | Typical Plans/Phase | Tasks/Plan |
|-------|---------------------|------------|
| Quick | 1-3 | 2-3 |
| Standard | 3-5 | 2-3 |
| Comprehensive | 5-10 | 2-3 |

**หลักการสำคัญ:** ได้ plans จากงานจริง Depth กำหนดว่ารวมสิ่งต่างๆ อย่างเข้มข้นแค่ไหน ไม่ใช่เป้าหมายที่ต้องถึง

- Comprehensive auth phase = 8 plans (เพราะ auth มี 8 concerns จริงๆ)
- Comprehensive "add config file" phase = 1 plan (เพราะมีแค่นั้น)

สำหรับ comprehensive depth:
- สร้าง MORE plans เมื่องาน warrants it ไม่ใช่ plans ที่ใหญ่ขึ้น
- หาก phase มี 15 tasks นั่นคือ 5-8 plans (ไม่ใช่ 3 plans ที่มี 5 tasks แต่ละอัน)
- อย่าบีบอัดเพื่อให้ดู efficient—thoroughness คือเป้าหมาย
- ให้ phases เล็กๆ ยังคงเล็ก—อย่าเพิ่มเพื่อให้ถึงจำนวน
- แต่ละ plan โฟกัส: 2-3 tasks, single concern

สำหรับ quick depth:
- รวมอย่างเข้มข้นเป็น fewer plans
- 1-3 plans per phase ก็ดี
- โฟกัสที่ critical path
</depth_aware_splitting>

**แยกเสมอหาก:** >3 tasks, multiple subsystems, >5 files ใน task ใดๆ, complex domains (auth, payments)

**หาก scope เหมาะสม (2-3 tasks, single subsystem, <5 files/task):** ดำเนินการไป confirm_breakdown

**หากใหญ่ (>3 tasks):** แยกตาม subsystem, dependency, complexity หรือ autonomous vs interactive

**แต่ละ plan ต้อง:** 2-3 tasks max, ~50% context target, independently committable

**Autonomous optimization:** No checkpoints → subagent (fresh context) Has checkpoints → main context Group autonomous work together

ดู ~/.claude/get-shit-done/references/scope-estimation.md สำหรับ guidance ครบถ้วน
</step>

<step name="confirm_breakdown">
<if mode="yolo">
Auto-approve และดำเนินการไป write_phase_prompt
</if>

<if mode="interactive">
แสดง breakdown inline:

```
Phase [X] breakdown:

### Tasks ({phase}-01-PLAN.md)
1. [Task] - [brief] [type]
2. [Task] - [brief] [type]

Autonomous: [yes/no]

ดูถูกต้องไหม? (yes / adjust / start over)
```

สำหรับ multiple plans แสดงแต่ละ plan พร้อม tasks

รอการยืนยัน หาก "adjust": แก้ไข หาก "start over": กลับไป gather_phase_context
</if>
</step>

<step name="write_phase_prompt">
ใช้ template จาก `~/.claude/get-shit-done/templates/phase-prompt.md`

**Single plan:** เขียนไป `.planning/phases/XX-name/{phase}-01-PLAN.md`

**Multiple plans:** เขียนไฟล์แยก ({phase}-01-PLAN.md, {phase}-02-PLAN.md, etc.)

แต่ละ plan ทำตามโครงสร้าง template ด้วย:
- Frontmatter (phase, plan, type, domain)
- Objective (plan-specific goal, purpose, output)
- Execution context (execute-phase.md, summary template, checkpoints.md หากจำเป็น)
- Context (@references ไป PROJECT, ROADMAP, STATE, codebase docs, RESEARCH/DISCOVERY/CONTEXT หากมี, prior summaries, source files, prior decisions, deferred issues, concerns)
- Tasks (XML format with types)
- Verification, Success criteria, Output specification

**Context section population จาก frontmatter analysis:**

Inject automatically-assembled context package จาก read_project_history step:

```markdown
<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md

# Auto-selected based on dependency graph (จาก frontmatter):
@.planning/phases/XX-name/YY-ZZ-SUMMARY.md
@.planning/phases/AA-name/BB-CC-SUMMARY.md

# Key files จาก frontmatter (เกี่ยวข้องกับ phase นี้):
@path/to/important/file.ts
@path/to/another/file.ts

**Tech stack available:** [extracted from frontmatter tech-stack.added]
**Established patterns:** [extracted from frontmatter patterns-established]
**Constraining decisions:**
- [Phase X]: [decision from frontmatter]
- [Phase Y]: [decision from frontmatter]

**Issues being addressed:** [หากมีจาก ISSUES.md]
</context>
```

นี่รับประกันว่าทุก PLAN.md ได้ optimal context ที่ assembled อัตโนมัติผ่าน dependency graph ทำให้ execution informed มากที่สุด

สำหรับ multi-plan phases: แต่ละ plan มี focused scope, references previous plan summaries (ผ่าน frontmatter selection), success criteria ของ plan สุดท้ายรวม "Phase X complete"
</step>

<step name="git_commit">
Commit phase plan(s):

```bash
# Stage ทุก PLAN.md files สำหรับ phase นี้
git add .planning/phases/${PHASE}-*/${PHASE}-*-PLAN.md

# รวม stage DISCOVERY.md หากสร้างระหว่าง mandatory_discovery
git add .planning/phases/${PHASE}-*/DISCOVERY.md 2>/dev/null

git commit -m "$(cat <<'EOF'
docs(${PHASE}): create phase plan

Phase ${PHASE}: ${PHASE_NAME}
- [N] plan(s) created
- [X] total tasks defined
- Ready for execution
EOF
)"
```

ยืนยัน: "Committed: docs(${PHASE}): create phase plan"
</step>

<step name="offer_next">
```
Phase plan created: .planning/phases/XX-name/{phase}-01-PLAN.md
[X] tasks defined.

---

## ถัดไป

**{phase}-01: [Plan Name]** - [objective summary]

`/gsd:execute-plan .planning/phases/XX-name/{phase}-01-PLAN.md`

<sub>`/clear` ก่อน - context window ใหม่</sub>

---

**ยังมีให้เลือก:**
- Review/adjust tasks ก่อน executing
[หากมี multiple plans: - View all plans: `ls .planning/phases/XX-name/*-PLAN.md`]

---
```
</step>

</process>

<task_quality>
**Good tasks:** Specific files, actions, verification
- "Add User model to Prisma schema with email, passwordHash, createdAt"
- "Create POST /api/auth/login endpoint with bcrypt validation"

**Bad tasks:** คลุมเครือ ไม่ actionable
- "Set up authentication" / "Make it secure" / "Handle edge cases"

หากระบุ Files + Action + Verify + Done ไม่ได้ task คลุมเครือเกินไป

**TDD candidates ได้ dedicated plans** หาก "Create price calculator with discount rules" warrants TDD สร้าง TDD plan สำหรับมัน ดู `~/.claude/get-shit-done/references/tdd.md` สำหรับ TDD plan structure
</task_quality>

<anti_patterns>
- ไม่มี story points หรือ hour estimates
- ไม่มี team assignments
- ไม่มี acceptance criteria committees
- ไม่มี sub-sub-sub tasks
Tasks คือ instructions สำหรับ Claude ไม่ใช่ Jira tickets
</anti_patterns>

<success_criteria>
Phase planning complete เมื่อ:
- [ ] STATE.md อ่าน project history absorbed
- [ ] Mandatory discovery completed (Level 0-3)
- [ ] Prior decisions, issues, concerns synthesized
- [ ] PLAN file(s) มีพร้อม XML structure
- [ ] แต่ละ plan: Objective, context, tasks, verification, success criteria, output
- [ ] @context references included (STATE, RESEARCH/DISCOVERY หากมี, relevant summaries)
- [ ] แต่ละ plan: 2-3 tasks (~50% context)
- [ ] แต่ละ task: Type, Files (หาก auto), Action, Verify, Done
- [ ] Checkpoints structured ถูกต้อง
- [ ] หาก RESEARCH.md มี: "don't hand-roll" items ไม่ถูก custom-built
- [ ] PLAN file(s) committed ไป git
- [ ] ผู้ใช้รู้ขั้นตอนถัดไป
</success_criteria>
