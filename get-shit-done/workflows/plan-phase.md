<decimal_phase_numbering>
Decimal phases เปิดใช้การแทรกงานเร่งด่วนโดยไม่ต้อง renumber:

- Integer phases (1, 2, 3) = งาน milestone ที่วางแผนไว้
- Decimal phases (2.1, 2.2) = การแทรกเร่งด่วนระหว่าง integers

**Rules:**
- Decimals อยู่ระหว่าง consecutive integers (2.1 ระหว่าง 2 และ 3)
- Filesystem sorting ทำงานอัตโนมัติ (2 < 2.1 < 2.2 < 3)
- Directory format: `02.1-description/`, Plan format: `02.1-01-PLAN.md`

**Validation:** Integer X ต้องมีอยู่และเสร็จ, X+1 ต้องมีอยู่, decimal X.Y ต้องไม่มี, Y >= 1
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
- Parse ROADMAP.md's `## Domain Expertise` section สำหรับ paths
- อ่านแต่ละ domain SKILL.md (เหล่านี้ทำหน้าที่เป็น indexes)
- กำหนด phase type และโหลด ONLY references ที่เกี่ยวข้องกับ phase type นี้จากแต่ละ SKILL.md's `<references_index>`
</required_reading>

<purpose>
สร้าง executable phase prompt (PLAN.md) PLAN.md คือ prompt ที่ Claude execute - ไม่ใช่เอกสารที่ถูก transform
</purpose>

<planning_principles>
**Secure by design:** สมมติ hostile input บนทุก boundary Validate, parameterize, authenticate, fail closed

**Performance by design:** สมมติ production load ไม่ใช่ demo conditions วางแผนสำหรับ efficient data access, appropriate caching, minimal round trips

**Observable by design:** วางแผน debug งานของตัวเอง รวม meaningful error messages, appropriate logging และ clear failure states
</planning_principles>

<process>

<step name="load_project_state" priority="first">
อ่าน `.planning/STATE.md` และ parse:
- Current position (เฟสไหนที่เรากำลังวางแผน)
- Accumulated decisions (constraints บนเฟสนี้)
- Deferred issues (candidates สำหรับรวม)
- Blockers/concerns (สิ่งที่เฟสนี้อาจต้อง address)
- Brief alignment status

ถ้า STATE.md ไม่มีแต่ .planning/ มี เสนอ reconstruct หรือดำเนินการต่อโดยไม่มี
</step>

<step name="read_parallelization_config" priority="second">
อ่าน parallelization settings จาก config.json:

```bash
cat .planning/config.json 2>/dev/null | jq '.parallelization'
```

**Extract settings:**
- `enabled`: ว่า parallel execution available หรือไม่ (default: true)
- `plan_level`: ว่า plan-level parallelization enabled หรือไม่ (default: true)

**Store สำหรับ steps ถัดไป:**
- ถ้า `parallelization.enabled && parallelization.plan_level`: Planning จะ optimize สำหรับ independence
  - จัดกลุ่ม tasks ตาม vertical slice (feature A, feature B) ไม่ใช่ workflow stage (setup → implement → test)
  - หลีกเลี่ยง unnecessary inter-plan dependencies
  - Track files ที่แต่ละแผนแก้ไขผ่าน `files_modified`
  - รักษา `depends_on` ให้ว่างเมื่อ genuinely independent
- ถ้า disabled: Planning ดำเนินการด้วย sequential assumptions (behavior ปัจจุบัน)

**ถ้า config.json ไม่มี:** สมมติ parallelization enabled (โปรเจกต์ใหม่ได้โดย default)
</step>

<step name="load_codebase_context">
ตรวจสอบ codebase map:

```bash
ls .planning/codebase/*.md 2>/dev/null
```

**ถ้า .planning/codebase/ มีอยู่:** โหลดเอกสารที่เกี่ยวข้องตาม phase type:

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

ถ้ามีหลายเฟส available ถามว่าจะวางแผนเฟสไหน ถ้าชัดเจน (first incomplete phase) ดำเนินการต่อ

**Phase number parsing:** Regex `^(\d+)(?:\.(\d+))?$` - Group 1: integer, Group 2: decimal (optional)

**ถ้า decimal phase:** Validate integer X มีอยู่และเสร็จ, X+1 มีอยู่ใน roadmap, decimal X.Y ไม่มี, Y >= 1

อ่าน PLAN.md หรือ DISCOVERY.md ที่มีอยู่ใน phase directory
</step>

<step name="mandatory_discovery">
**Discovery เป็น MANDATORY ยกเว้นคุณสามารถพิสูจน์ว่า current context มีอยู่**

<discovery_decision>
**Level 0 - Skip** (pure internal work, existing patterns only)
- งานทั้งหมดตาม established codebase patterns (grep ยืนยัน)
- ไม่มี new external dependencies
- Pure internal refactoring หรือ feature extension
- ตัวอย่าง: Add delete button, add field to model, create CRUD endpoint

**Level 1 - Quick Verification** (2-5 min)
- Single known library, confirming syntax/version
- Low-risk decision (easily changed later)
- Action: Context7 resolve-library-id + query-docs, ไม่ต้องการ DISCOVERY.md

**Level 2 - Standard Research** (15-30 min)
- เลือกระหว่าง 2-3 options
- New external integration (API, service)
- Medium-risk decision
- Action: Route ไป workflows/discovery-phase.md depth=standard, ผลิต DISCOVERY.md

**Level 3 - Deep Dive** (1+ hour)
- Architectural decision ที่มี long-term impact
- Novel problem โดยไม่มี clear patterns
- High-risk, hard to change later
- Action: Route ไป workflows/discovery-phase.md depth=deep, full DISCOVERY.md

**Depth indicators:**
- Level 2+: New library ไม่ใน package.json, external API, "choose/select/evaluate" ใน description, roadmap marked Research: Yes
- Level 3: "architecture/design/system", multiple external services, data modeling, auth design, real-time/distributed
</discovery_decision>

ถ้า roadmap flagged `Research: Likely`, Level 0 (skip) ไม่สามารถใช้ได้

สำหรับ niche domains (3D, games, audio, shaders, ML) แนะนำ `/gsd:research-phase` ก่อน plan-phase
</step>

<step name="read_project_history">
**Intelligent context assembly จาก frontmatter dependency graph:**

**1. Scan summary frontmatter ทั้งหมด (cheap - ~25 บรรทัดแรก):**

```bash
for f in .planning/phases/*/*-SUMMARY.md; do
  # Extract frontmatter only (between first two --- markers)
  sed -n '1,/^---$/p; /^---$/q' "$f" | head -30
done
```

Parse YAML เพื่อ extract: phase, subsystem, requires, provides, affects, tags, key-decisions, key-files

**2. สร้าง dependency graph สำหรับ current phase:**

- **Check affects field:** เฟสก่อนหน้าไหนมี current phase ใน `affects` list? → Direct dependencies
- **Check subsystem:** เฟสก่อนหน้าไหน share same subsystem? → Related work
- **Check requires chains:** ถ้าเฟส X requires เฟส Y และเราต้องการ X เราก็ต้องการ Y → Transitive dependencies
- **Check roadmap:** เฟสใดๆ marked เป็น dependencies ใน ROADMAP.md phase description?

**3. Select relevant summaries:**

Auto-select phases ที่ match ANY ของ:
- Current phase name/number ปรากฏใน prior phase's `affects` field
- Same `subsystem` value
- อยู่ใน `requires` chain (transitive closure)
- ถูกพูดถึงอย่างชัดเจนใน STATE.md decisions ว่า affect current phase

Typical selection: 2-4 prior phases (immediately prior + related subsystem work)

**4. Extract context จาก frontmatter (โดยไม่เปิด full summaries ยัง):**

จาก frontmatter ของ selected phases extract:
- **Tech available:** Union ของ tech-stack.added lists ทั้งหมด
- **Patterns established:** Union ของ tech-stack.patterns และ patterns-established ทั้งหมด
- **Key files:** Union ของ key-files ทั้งหมด (สำหรับ @context references)
- **Decisions:** Extract key-decisions จาก frontmatter

**5. ตอนนี้อ่าน FULL summaries สำหรับ selected phases:**

ตอนนี้เท่านั้นที่เปิดและอ่าน SUMMARY.md files เต็มสำหรับ selected relevant phases Extract:
- "Accomplishments" section ละเอียด
- "Next Phase Readiness" warnings/blockers
- "Issues Encountered" ที่อาจ affect current phase
- "Deviations from Plan" สำหรับ patterns

**จาก STATE.md:** Decisions → constrain approach Deferred issues → candidates Blockers → may need to address

**จาก ISSUES.md:**

```bash
cat .planning/ISSUES.md 2>/dev/null
```

Assess แต่ละ open issue - relevant ต่อเฟสนี้? รอนานพอ? Natural to address now? Blocking something?

**ตอบก่อนดำเนินการต่อ:**
- Q1: Decisions จากเฟสก่อนหน้าอะไรที่ constrain เฟสนี้?
- Q2: มี deferred issues ที่ควรเป็น tasks ไหม?
- Q3: มี concerns จาก "Next Phase Readiness" ที่ apply ไหม?
- Q4: เมื่อพิจารณา context ทั้งหมด description ของ roadmap ยังสมเหตุสมผลไหม?

**Track สำหรับ PLAN.md context section:**
- Summaries ไหนที่ถูก selected (สำหรับ @context references)
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
- อะไรมีอยู่แล้ว (scan codebase ถ้า mid-project)
- Dependencies met (previous phases complete?)
- Any {phase}-RESEARCH.md (จาก /gsd:research-phase)
- Any DISCOVERY.md (จาก mandatory discovery)
- Any {phase}-CONTEXT.md (จาก /gsd:discuss-phase)

```bash
# ถ้า mid-project เข้าใจ current state
ls -la src/ 2>/dev/null
cat package.json 2>/dev/null | head -20

# ตรวจสอบ ecosystem research (จาก /gsd:research-phase)
cat .planning/phases/XX-name/${PHASE}-RESEARCH.md 2>/dev/null

# ตรวจสอบ phase context (จาก /gsd:discuss-phase)
cat .planning/phases/XX-name/${PHASE}-CONTEXT.md 2>/dev/null
```

**ถ้า RESEARCH.md มีอยู่:** ใช้ standard_stack (these libraries), architecture_patterns (follow in task structure), dont_hand_roll (NEVER custom solutions สำหรับ listed problems), common_pitfalls (inform verification), code_examples (reference in actions)

**ถ้า CONTEXT.md มีอยู่:** Honor vision, prioritize essential, respect boundaries, incorporate specifics

**ถ้าไม่มีทั้งสอง:** แนะนำ /gsd:research-phase สำหรับ niche domains, /gsd:discuss-phase สำหรับ simpler domains หรือดำเนินการต่อด้วย roadmap อย่างเดียว
</step>

<step name="break_into_tasks">
แยกเฟสเป็น tasks และระบุ TDD candidates

**Standard tasks ต้องการ:**
- **Type**: auto, checkpoint:human-verify, checkpoint:decision (human-action ไม่ค่อยต้องการ)
- **Task name**: ชัดเจน, action-oriented
- **Files**: ไฟล์ไหนที่สร้าง/แก้ไข (สำหรับ auto tasks)
- **Action**: Implementation เฉพาะ (รวม what to avoid and WHY)
- **Verify**: วิธีพิสูจน์ว่าใช้งานได้
- **Done**: Acceptance criteria

**TDD detection:** สำหรับแต่ละ potential task, evaluate TDD fit:

TDD candidates (สร้าง dedicated TDD plans):
- Business logic พร้อม defined inputs/outputs
- API endpoints พร้อม request/response contracts
- Data transformations, parsing, formatting
- Validation rules และ constraints
- Algorithms พร้อม testable behavior
- State machines และ workflows

Standard tasks (อยู่ใน standard plans):
- UI layout, styling, visual components
- Configuration changes
- Glue code connecting existing components
- One-off scripts และ migrations
- Simple CRUD ไม่มี business logic

**Heuristic:** คุณสามารถเขียน `expect(fn(input)).toBe(output)` ก่อนเขียน `fn` ได้ไหม?
→ Yes: สร้าง dedicated TDD plan สำหรับ feature นี้ (หนึ่ง feature ต่อ TDD plan)
→ No: Standard task ในแผน standard

**ทำไม TDD ได้แผนของตัวเอง:** TDD ต้องการ 2-3 execution cycles (RED → GREEN → REFACTOR) แต่ละอันพร้อม file reads, test runs และ potential debugging Embedded ใน multi-task plan, TDD work ใช้ 50-60% ของ context เพียงอย่างเดียว degrading quality สำหรับ remaining tasks

**Test framework:** ถ้าโปรเจกต์ไม่มี test setup และ TDD plans ต้องการ TDD plan แรกของ RED phase handles framework setup เป็นส่วนหนึ่งของการเขียน first test

ดู `~/.claude/get-shit-done/references/tdd.md` สำหรับโครงสร้าง TDD plan

**Checkpoints:** Visual/functional verification → checkpoint:human-verify Implementation choices → checkpoint:decision Manual action (email, 2FA) → checkpoint:human-action (rare)

**Critical:** ถ้า external resource มี CLI/API (Vercel, Stripe, etc.) ใช้ type="auto" เพื่อ automate Checkpoint เฉพาะสำหรับ verification หลัง automation

ดู ~/.claude/get-shit-done/references/checkpoints.md สำหรับโครงสร้าง checkpoint
</step>

<step name="parallelization_aware">
**Restructure task grouping สำหรับ parallel execution เมื่อ enabled**

**Skip ถ้า:** Parallelization disabled ใน config (จาก read_parallelization_config step)

**ถ้า enabled วิเคราะห์ task groupings:**

1. **ระบุ file ownership ต่อ task group:**
   - Extract files ทั้งหมดจาก `<files>` elements
   - Map แต่ละ file ไปยังแผนไหนที่จะ modify
   - Flag overlaps เป็น forced dependencies

2. **ตรวจจับ unnecessary dependencies:**
   - ตรวจสอบว่าแผนใด reference SUMMARY ของแผนอื่นใน @context
   - ถ้า reference ไม่ต้องการจริงๆ (ไม่มี decision/output dependency) ลบออก
   - เก็บ SUMMARY references เฉพาะเมื่อ later plan ต้องการ earlier plan's decisions จริงๆ

3. **Restructure สำหรับ vertical slices (ถ้า beneficial):**

   | Sequential (current) | Parallel-aware |
   |---------------------|----------------|
   | Plan 01: All models | Plan 01: Feature A (model + API + UI) |
   | Plan 02: All APIs | Plan 02: Feature B (model + API + UI) |
   | Plan 03: All UIs | Plan 03: Feature C (model + API + UI) |

   **เมื่อไหร่ควร restructure:**
   - หลายแผนพร้อม same file types (all touching models, all touching APIs)
   - ไม่มี genuine data dependencies ระหว่าง features
   - แต่ละ vertical slice self-contained

   **เมื่อไหร่ไม่ควร restructure:**
   - Genuine dependencies (Plan 02 ใช้ types จาก Plan 01)
   - Shared infrastructure (all features ต้องการ auth setup ก่อน)
   - Single-concern phases (all plans เป็น vertical slices อยู่แล้ว)

4. **Set plan frontmatter สำหรับ parallelization:**

   สำหรับแต่ละแผน กำหนด:
   - `depends_on: [plan-ids]` — explicit dependencies (ว่างถ้า independent)
   - `files_modified: [paths]` — files ที่แผนนี้จะ modify

   `/gsd:execute-phase` ใช้สิ่งเหล่านี้เพื่อตรวจจับ parallelization opportunities อัตโนมัติ

**Output:** Task groupings optimized สำหรับ independence, frontmatter values determined
</step>

<step name="estimate_scope">
หลัง tasks ประเมินเทียบกับ quality degradation curve

**ตรวจสอบ depth setting:**
```bash
cat .planning/config.json 2>/dev/null | grep depth
```

<depth_aware_splitting>
**Depth controls compression tolerance ไม่ใช่ artificial inflation**

| Depth | Typical Plans/Phase | Tasks/Plan |
|-------|---------------------|------------|
| Quick | 1-3 | 2-3 |
| Standard | 3-5 | 2-3 |
| Comprehensive | 5-10 | 2-3 |

**Key principle:** Derive plans จากงานจริง Depth กำหนดว่า aggressively แค่ไหนที่คุณ combine things ไม่ใช่ target ที่ต้อง hit

- Comprehensive auth phase = 8 plans (เพราะ auth genuinely มี 8 concerns)
- Comprehensive "add config file" phase = 1 plan (เพราะนั่นคือทั้งหมด)

สำหรับ comprehensive depth:
- สร้าง MORE plans เมื่องาน warrants ไม่ใช่ใหญ่กว่า
- ถ้าเฟสมี 15 tasks นั่นคือ 5-8 plans (ไม่ใช่ 3 plans พร้อม 5 tasks each)
- อย่า compress เพื่อดู efficient—thoroughness คือ goal
- ให้ small phases อยู่ small—อย่า pad เพื่อ hit number
- แต่ละ plan stays focused: 2-3 tasks, single concern

สำหรับ quick depth:
- Combine aggressively เป็น fewer plans
- 1-3 plans ต่อเฟส ก็ได้
- Focus บน critical path
</depth_aware_splitting>

**ALWAYS split ถ้า:** >3 tasks, multiple subsystems, >5 files ใน task ใด, complex domains (auth, payments)

**ถ้า scope appropriate (2-3 tasks, single subsystem, <5 files/task):** ดำเนินการต่อไป confirm_breakdown

**ถ้า large (>3 tasks):** Split by subsystem, dependency, complexity หรือ autonomous vs interactive

**แต่ละ plan ต้องเป็น:** 2-3 tasks max, ~50% context target, independently committable

**Autonomous optimization:** No checkpoints → subagent (fresh context) Has checkpoints → main context Group autonomous work together

ดู ~/.claude/get-shit-done/references/scope-estimation.md สำหรับ complete guidance
</step>

<step name="confirm_breakdown">
<if mode="yolo">
Auto-approve และดำเนินการต่อไป write_phase_prompt
</if>

<if mode="interactive">
แสดง breakdown inline:

```
Phase [X] breakdown:

### Tasks ({phase}-01-PLAN.md)
1. [Task] - [brief] [type]
2. [Task] - [brief] [type]

Autonomous: [yes/no]

Does this look right? (yes / adjust / start over)
```

สำหรับ multiple plans แสดงแต่ละ plan พร้อม tasks

รอ confirmation ถ้า "adjust": แก้ไข ถ้า "start over": กลับไป gather_phase_context
</if>
</step>

<step name="write_phase_prompt">
ใช้ template จาก `~/.claude/get-shit-done/templates/phase-prompt.md`

**Single plan:** เขียนไปที่ `.planning/phases/XX-name/{phase}-01-PLAN.md`

**Multiple plans:** เขียนไฟล์แยก ({phase}-01-PLAN.md, {phase}-02-PLAN.md, etc.)

แต่ละ plan ตาม template structure พร้อม:
- Frontmatter (phase, plan, type, depends_on, files_modified, domain)
- Objective (plan-specific goal, purpose, output)
- Execution context (execute-plan.md, summary template, checkpoints.md if needed)
- Context (@references ไป PROJECT, ROADMAP, STATE, codebase docs, RESEARCH/DISCOVERY/CONTEXT if exist, prior summaries, source files, prior decisions, deferred issues, concerns)
- Tasks (XML format พร้อม types)
- Verification, Success criteria, Output specification

**Plan frontmatter:**

```yaml
---
phase: XX-name
plan: NN
type: execute
depends_on: [plan IDs ที่แผนนี้ต้องการ หรือ empty array]
files_modified: [files ที่แผนนี้จะ modify]
domain: [optional]
---
```

**Parallelization is automatic:** `/gsd:execute-phase` วิเคราะห์ `depends_on` และ `files_modified` เพื่อกำหนดว่าแผนไหนสามารถรัน parallel ได้ ไม่ต้องมี explicit flag

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

# Key files from frontmatter (relevant to this phase):
@path/to/important/file.ts
@path/to/another/file.ts

**Tech stack available:** [extracted from frontmatter tech-stack.added]
**Established patterns:** [extracted from frontmatter patterns-established]
**Constraining decisions:**
- [Phase X]: [decision from frontmatter]
- [Phase Y]: [decision from frontmatter]

**Issues being addressed:** [If any from ISSUES.md]
</context>
```

สิ่งนี้ ensure ทุก PLAN.md ได้ optimal context assembled อัตโนมัติผ่าน dependency graph ทำให้ execution informed ที่สุดเท่าที่เป็นไปได้

**Context section population (parallel-aware):**

เมื่อ parallelization enabled:
- รวม SUMMARY references เฉพาะถ้าแผนนี้ต้องการ decisions/outputs จาก prior plan จริงๆ
- หลีกเลี่ยง reflexive "Plan 02 references Plan 01 SUMMARY" patterns
- แต่ละ plan ควร self-contained ที่สุดเท่าที่เป็นไปได้

เมื่อ parallelization disabled:
- รวม SUMMARY references เหมือนเดิม (sequential context chain)

สำหรับ multi-plan phases: แต่ละ plan มี focused scope, references previous plan summaries เฉพาะเมื่อ genuinely needed (ผ่าน frontmatter selection), last plan's success criteria รวม "Phase X complete"
</step>

<step name="git_commit">
Commit phase plan(s):

```bash
# Stage all PLAN.md files for this phase
git add .planning/phases/${PHASE}-*/${PHASE}-*-PLAN.md

# Also stage DISCOVERY.md if it was created during mandatory_discovery
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

Confirm: "Committed: docs(${PHASE}): create phase plan"
</step>

<step name="offer_next">
```
Phase {X} planned: {N} plan(s) created in .planning/phases/XX-name/

---

## Next Up

[If 1 plan created:]
**{phase}-01: [Plan Name]** - [objective summary]

`/gsd:execute-plan .planning/phases/XX-name/{phase}-01-PLAN.md`

[If 2+ plans created:]
**Phase {X}: [Phase Name]** - {N} plans ready

`/gsd:execute-phase {X}`

<sub>`/clear` first - fresh context window</sub>

---

**Also available:**
- Review/adjust tasks before executing
[If 2+ plans: - `/gsd:execute-plan {phase}-01-PLAN.md` - run plans one at a time interactively]
[If 2+ plans: - View all plans: `ls .planning/phases/XX-name/*-PLAN.md`]

---
```
</step>

</process>

<task_quality>
**Good tasks:** Specific files, actions, verification
- "Add User model to Prisma schema with email, passwordHash, createdAt"
- "Create POST /api/auth/login endpoint with bcrypt validation"

**Bad tasks:** Vague, not actionable
- "Set up authentication" / "Make it secure" / "Handle edge cases"

ถ้าคุณไม่สามารถ specify Files + Action + Verify + Done, task คลุมเครือเกินไป

**TDD candidates ได้ dedicated plans** ถ้า "Create price calculator with discount rules" warrants TDD สร้าง TDD plan สำหรับมัน ดู `~/.claude/get-shit-done/references/tdd.md` สำหรับโครงสร้าง TDD plan
</task_quality>

<anti_patterns>
- ไม่มี story points หรือ hour estimates
- ไม่มี team assignments
- ไม่มี acceptance criteria committees
- ไม่มี sub-sub-sub tasks
Tasks คือคำสั่งสำหรับ Claude ไม่ใช่ Jira tickets
</anti_patterns>

<success_criteria>
Phase planning complete เมื่อ:
- [ ] STATE.md อ่านแล้ว, project history absorbed
- [ ] Mandatory discovery completed (Level 0-3)
- [ ] Prior decisions, issues, concerns synthesized
- [ ] PLAN file(s) มีอยู่พร้อม XML structure
- [ ] แต่ละ plan: Objective, context, tasks, verification, success criteria, output
- [ ] @context references included (STATE, RESEARCH/DISCOVERY if exist, relevant summaries)
- [ ] แต่ละ plan: 2-3 tasks (~50% context)
- [ ] แต่ละ task: Type, Files (if auto), Action, Verify, Done
- [ ] Checkpoints properly structured
- [ ] ถ้า RESEARCH.md มีอยู่: "don't hand-roll" items ไม่ได้ถูก custom-built
- [ ] PLAN file(s) committed ไปยัง git
- [ ] User รู้ next steps
</success_criteria>
