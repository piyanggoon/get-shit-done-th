<purpose>
Execute phase prompt (PLAN.md) และสร้าง outcome summary (SUMMARY.md)
</purpose>

<required_reading>
อ่าน STATE.md ก่อนทุก operation เพื่อโหลด project context
</required_reading>

<process>

<step name="load_project_state" priority="first">
ก่อนทุก operation อ่าน project state:

```bash
cat .planning/STATE.md 2>/dev/null
```

**หากไฟล์มี:** Parse และซึมซับ:

- Current position (phase, plan, status)
- Accumulated decisions (constraints สำหรับ execution นี้)
- Deferred issues (context สำหรับ deviations)
- Blockers/concerns (สิ่งที่ต้องระวัง)
- Brief alignment status

**หากไฟล์ไม่มีแต่ .planning/ มี:**

```
STATE.md missing but planning artifacts exist.
Options:
1. Reconstruct from existing artifacts
2. Continue without project state (may lose accumulated context)
```

**หาก .planning/ ไม่มี:** Error - project not initialized
</step>

<step name="identify_plan">
หา plan ถัดไปที่จะ execute:
- ตรวจสอบ roadmap สำหรับ phase ที่ "In progress"
- หา plans ใน phase directory นั้น
- ระบุ plan แรกที่ไม่มี SUMMARY ที่สอดคล้อง

```bash
cat .planning/ROADMAP.md
# มองหา phase ที่มี status "In progress"
# แล้วหา plans ใน phase นั้น
ls .planning/phases/XX-name/*-PLAN.md 2>/dev/null | sort
ls .planning/phases/XX-name/*-SUMMARY.md 2>/dev/null | sort
```

**Logic:**

- หาก `01-01-PLAN.md` มีแต่ `01-01-SUMMARY.md` ไม่มี → execute 01-01
- หาก `01-01-SUMMARY.md` มีแต่ `01-02-SUMMARY.md` ไม่มี → execute 01-02
- Pattern: หาไฟล์ PLAN แรกที่ไม่มี SUMMARY file ที่ตรงกัน

**Decimal phase handling:**

Phase directories อาจเป็นรูปแบบ integer หรือ decimal:

- Integer: `.planning/phases/01-foundation/01-01-PLAN.md`
- Decimal: `.planning/phases/01.1-hotfix/01.1-01-PLAN.md`

Parse phase number จาก path (handles ทั้งสองรูปแบบ):

```bash
# ดึง phase number (handles XX หรือ XX.Y format)
PHASE=$(echo "$PLAN_PATH" | grep -oE '[0-9]+(\.[0-9]+)?-[0-9]+')
```

SUMMARY naming ตาม pattern เดียวกัน:

- Integer: `01-01-SUMMARY.md`
- Decimal: `01.1-01-SUMMARY.md`

ยืนยันกับผู้ใช้หากไม่ชัดเจน

<config-check>
```bash
cat .planning/config.json 2>/dev/null
```
</config-check>

<if mode="yolo">
```
⚡ อนุมัติอัตโนมัติ: Execute {phase}-{plan}-PLAN.md
[Plan X of Y for Phase Z]

Starting execution...
```

ดำเนินการไปยังขั้นตอน parse_segments โดยตรง
</if>

<if mode="interactive" OR="custom with gates.execute_next_plan true">
แสดง:

```
Found plan to execute: {phase}-{plan}-PLAN.md
[Plan X of Y for Phase Z]

Proceed with execution?
```

รอการยืนยันก่อนดำเนินการ
</if>
</step>

<step name="record_start_time">
บันทึกเวลาเริ่ม execution สำหรับ performance tracking:

```bash
PLAN_START_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
PLAN_START_EPOCH=$(date +%s)
```

เก็บใน shell variables สำหรับการคำนวณ duration เมื่อเสร็จ
</step>

<step name="parse_segments">
**Intelligent segmentation: Parse plan เป็น execution segments**

Plans แบ่งเป็น segments ด้วย checkpoints แต่ละ segment route ไป execution context ที่เหมาะสม (subagent หรือ main)

**1. ตรวจสอบ checkpoints:**

```bash
# หา checkpoints ทั้งหมดและ types
grep -n "type=\"checkpoint" .planning/phases/XX-name/{phase}-{plan}-PLAN.md
```

**2. วิเคราะห์ execution strategy:**

**หากไม่พบ checkpoints:**

- **Fully autonomous plan** - spawn single subagent สำหรับ plan ทั้งหมด
- Subagent ได้ fresh 200k context, execute ทุก tasks, สร้าง SUMMARY, commits
- Main context: แค่ orchestration (~5% usage)

**หากพบ checkpoints, parse เป็น segments:**

Segment = tasks ระหว่าง checkpoints (หรือ start→first checkpoint, หรือ last checkpoint→end)

**สำหรับแต่ละ segment กำหนด routing:**

```
Segment routing rules:

IF segment has no prior checkpoint:
  → SUBAGENT (first segment, nothing to depend on)

IF segment follows checkpoint:human-verify:
  → SUBAGENT (verification is just confirmation, doesn't affect next work)

IF segment follows checkpoint:decision OR checkpoint:human-action:
  → MAIN CONTEXT (next tasks need the decision/result)
```

**3. Execution pattern:**

**Pattern A: Fully autonomous (no checkpoints)**

```
Spawn subagent → execute all tasks → SUMMARY → commit → report back
```

**Pattern B: Segmented with verify-only checkpoints**

```
Segment 1 (tasks 1-3): Spawn subagent → execute → report back
Checkpoint 4 (human-verify): Main context → you verify → continue
Segment 2 (tasks 5-6): Spawn NEW subagent → execute → report back
Checkpoint 7 (human-verify): Main context → you verify → continue
Aggregate results → SUMMARY → commit
```

**Pattern C: Decision-dependent (must stay in main)**

```
Checkpoint 1 (decision): Main context → you decide → continue in main
Tasks 2-5: Main context (need decision from checkpoint 1)
No segmentation benefit - execute entirely in main
```

**4. ทำไมถึงใช้ได้:**

**Segmentation benefits:**

- Fresh context สำหรับแต่ละ autonomous segment (0% start ทุกครั้ง)
- Main context สำหรับ checkpoints เท่านั้น (~10-20% total)
- รองรับ plans 10+ tasks หาก segmented ถูกต้อง
- Quality เป็นไปไม่ได้ที่จะลดลงใน autonomous segments

**เมื่อ segmentation ไม่มีประโยชน์:**

- Checkpoint เป็น decision/human-action และ tasks ถัดไปขึ้นกับ outcome
- ดีกว่าที่จะ execute sequentially ใน main มากกว่า break flow

**5. Implementation:**

**สำหรับ fully autonomous plans:**

```
1. Run init_agent_tracking step first (ดู step ด้านล่าง)

2. ใช้ Task tool ด้วย subagent_type="general-purpose":

   Prompt: "Execute plan at .planning/phases/{phase}-{plan}-PLAN.md

   This is an autonomous plan (no checkpoints). Execute all tasks, create SUMMARY.md in phase directory, commit with message following plan's commit guidance.

   Follow all deviation rules and authentication gate protocols from the plan.

   When complete, report: plan name, tasks completed, SUMMARY path, commit hash."

3. หลัง Task tool return ด้วย agent_id:

   a. เขียน agent_id ลง current-agent-id.txt:
      echo "[agent_id]" > .planning/current-agent-id.txt

   b. เพิ่ม spawn entry ลง agent-history.json:
      {
        "agent_id": "[agent_id from Task response]",
        "task_description": "Execute full plan {phase}-{plan} (autonomous)",
        "phase": "{phase}",
        "plan": "{plan}",
        "segment": null,
        "timestamp": "[ISO timestamp]",
        "status": "spawned",
        "completion_timestamp": null
      }

4. รอ subagent complete

5. หลัง subagent completes สำเร็จ:

   a. อัปเดต agent-history.json entry:
      - หา entry ที่มี agent_id ตรงกัน
      - ตั้ง status: "completed"
      - ตั้ง completion_timestamp: "[ISO timestamp]"

   b. ล้าง current-agent-id.txt:
      rm .planning/current-agent-id.txt

6. Report completion ให้ผู้ใช้
```

**สำหรับ segmented plans (มี verify-only checkpoints):**

```
Execute segment-by-segment:

For each autonomous segment:
  Spawn subagent with prompt: "Execute tasks [X-Y] from plan at .planning/phases/{phase}-{plan}-PLAN.md. Read the plan for full context and deviation rules. Do NOT create SUMMARY or commit - just execute these tasks and report results."

  Wait for subagent completion

For each checkpoint:
  Execute in main context
  Wait for user interaction
  Continue to next segment

After all segments complete:
  Aggregate all results
  Create SUMMARY.md
  Commit with all changes
```

**สำหรับ decision-dependent plans:**

```
Execute in main context (standard flow below)
No subagent routing
Quality maintained through small scope (2-3 tasks per plan)
```

ดู step name="segment_execution" สำหรับ detailed segment execution loop
</step>

<step name="init_agent_tracking">
**Initialize agent tracking สำหรับ subagent resume capability**

ก่อน spawn subagents ใดๆ ตั้งค่า tracking infrastructure:

**1. สร้าง/verify tracking files:**

```bash
# สร้าง agent history file หากไม่มี
if [ ! -f .planning/agent-history.json ]; then
  echo '{"version":"1.0","max_entries":50,"entries":[]}' > .planning/agent-history.json
fi

# ล้าง stale current-agent-id (จาก interrupted sessions)
# จะถูกกรอกเมื่อ subagent spawns
rm -f .planning/current-agent-id.txt
```

**2. ตรวจสอบ interrupted agents (resume detection):**

```bash
# ตรวจสอบว่า current-agent-id.txt มีจาก previous interrupted session
if [ -f .planning/current-agent-id.txt ]; then
  INTERRUPTED_ID=$(cat .planning/current-agent-id.txt)
  echo "Found interrupted agent: $INTERRUPTED_ID"
fi
```

**หากพบ interrupted agent:**
- Agent ID file มีจาก previous session ที่ไม่ complete
- Agent นี้อาจ resume ได้โดยใช้ Task tool's `resume` parameter
- แสดงให้ผู้ใช้: "Previous session was interrupted. Resume agent [ID] or start fresh?"
- หาก resume: ใช้ Task tool ด้วย `resume` parameter ตั้งเป็น interrupted ID
- หาก fresh: ล้างไฟล์และดำเนินการปกติ

**3. Prune old entries (housekeeping):**

หาก agent-history.json มีมากกว่า `max_entries`:
- ลบ entries เก่าสุดที่มี status "completed"
- อย่าลบ entries ที่มี status "spawned" (อาจต้อง resume)
- เก็บไฟล์ให้ต่ำกว่า size limit สำหรับ fast reads

**เมื่อต้องรัน step นี้:**
- Pattern A (fully autonomous): ก่อน spawn single subagent
- Pattern B (segmented): ก่อน segment execution loop
- Pattern C (main context): ข้าม - ไม่มี subagents spawned
</step>

<step name="segment_execution">
**Detailed segment execution loop สำหรับ segmented plans**

**Step นี้ใช้กับ segmented plans เท่านั้น (Pattern B: มี checkpoints แต่เป็น verify-only)**

สำหรับ Pattern A (fully autonomous) และ Pattern C (decision-dependent) ข้าม step นี้

**Execution flow:**

```
1. Parse plan เพื่อระบุ segments:
   - อ่านไฟล์ plan
   - หา checkpoint locations: grep -n "type=\"checkpoint" PLAN.md
   - ระบุ checkpoint types: grep "type=\"checkpoint" PLAN.md | grep -o 'checkpoint:[^"]*'
   - สร้าง segment map:
     * Segment 1: Start → first checkpoint (tasks 1-X)
     * Checkpoint 1: Type และ location
     * Segment 2: After checkpoint 1 → next checkpoint (tasks X+1 to Y)
     * Checkpoint 2: Type และ location
     * ... ต่อสำหรับทุก segments

2. สำหรับแต่ละ segment ตามลำดับ:

   A. กำหนด routing (apply rules จาก parse_segments):
      - No prior checkpoint? → Subagent
      - Prior checkpoint was human-verify? → Subagent
      - Prior checkpoint was decision/human-action? → Main context

   B. หาก routing = Subagent:
      Spawn Task tool ด้วย subagent_type="general-purpose":

      Prompt: "Execute tasks [task numbers/names] from plan at [plan path].

      **Context:**
      - Read the full plan for objective, context files, and deviation rules
      - You are executing a SEGMENT of this plan (not the full plan)
      - Other segments will be executed separately

      **Your responsibilities:**
      - Execute only the tasks assigned to you
      - Follow all deviation rules and authentication gate protocols
      - Track deviations for later Summary
      - DO NOT create SUMMARY.md (will be created after all segments complete)
      - DO NOT commit (will be done after all segments complete)

      **Report back:**
      - Tasks completed
      - Files created/modified
      - Deviations encountered
      - Any issues or blockers"

      **หลัง Task tool returns ด้วย agent_id:**

      1. เขียน agent_id ลง current-agent-id.txt:
         echo "[agent_id]" > .planning/current-agent-id.txt

      2. เพิ่ม spawn entry ลง agent-history.json:
         {
           "agent_id": "[agent_id from Task response]",
           "task_description": "Execute tasks [X-Y] from plan {phase}-{plan}",
           "phase": "{phase}",
           "plan": "{plan}",
           "segment": [segment_number],
           "timestamp": "[ISO timestamp]",
           "status": "spawned",
           "completion_timestamp": null
         }

      รอ subagent complete
      จับ results (files changed, deviations, etc.)

      **หลัง subagent completes สำเร็จ:**

      1. อัปเดต agent-history.json entry:
         - หา entry ที่มี agent_id ตรงกัน
         - ตั้ง status: "completed"
         - ตั้ง completion_timestamp: "[ISO timestamp]"

      2. ล้าง current-agent-id.txt:
         rm .planning/current-agent-id.txt

   C. หาก routing = Main context:
      Execute tasks ใน main โดยใช้ standard execution flow (step name="execute")
      Track results locally

   D. หลัง segment completes (whether subagent or main):
      ดำเนินการไป next checkpoint/segment

3. หลังทุก segments complete:

   A. รวม results จากทุก segments:
      - รวบรวม files created/modified จากทุก segments
      - รวบรวม deviations จากทุก segments
      - รวบรวม decisions จากทุก checkpoints
      - Merge เป็นภาพรวมสมบูรณ์

   B. สร้าง SUMMARY.md:
      - ใช้ aggregated results
      - Document งานทั้งหมดจากทุก segments
      - Include deviations จากทุก segments
      - Note segments ที่เป็น subagented

   C. Commit:
      - Stage ทุกไฟล์จากทุก segments
      - Stage SUMMARY.md
      - Commit ด้วย message ตาม plan guidance
      - Include note เกี่ยวกับ segmented execution หาก relevant

   D. Report completion
```

**ประโยชน์ของ pattern นี้:**
- Main context usage: ~20% (แค่ orchestration + checkpoints)
- Subagent 1: Fresh 0-30% (tasks 1-3)
- Subagent 2: Fresh 0-30% (tasks 5-6)
- Subagent 3: Fresh 0-20% (task 8)
- งาน autonomous ทั้งหมด: Peak quality
- รองรับ large plans ที่มีหลาย tasks หาก segmented ถูกต้อง

**เมื่อไม่ควรใช้ segmentation:**
- Plan มี decision/human-action checkpoints ที่ส่งผลต่อ tasks ถัดไป
- Tasks ถัดไปขึ้นกับ checkpoint outcome
- ดีกว่าที่จะ execute ใน main sequentially ในกรณีเหล่านั้น
</step>

<step name="load_prompt">
อ่าน plan prompt:
```bash
cat .planning/phases/XX-name/{phase}-{plan}-PLAN.md
```

นี่คือ execution instructions ทำตามอย่างแม่นยำ

**หาก plan reference CONTEXT.md:**
ไฟล์ CONTEXT.md ให้วิสัยทัศน์ของผู้ใช้สำหรับ phase นี้ — พวกเขาจินตนาการว่ามันทำงานอย่างไร อะไรจำเป็น และอะไรอยู่นอกขอบเขต เคารพ context นี้ตลอด execution
</step>

<step name="previous_phase_check">
ก่อน executing ตรวจสอบว่า previous phase มี issues:

```bash
# หา previous phase summary
ls .planning/phases/*/SUMMARY.md 2>/dev/null | sort -r | head -2 | tail -1
```

หาก previous phase SUMMARY.md มี "Issues Encountered" != "None" หรือ "Next Phase Readiness" mention blockers:

ใช้ AskUserQuestion:

- header: "Previous Issues"
- question: "Previous phase had unresolved items: [summary]. How to proceed?"
- options:
  - "Proceed anyway" - Issues won't block this phase
  - "Address first" - Let's resolve before continuing
  - "Review previous" - Show me the full summary
</step>

<step name="execute">
Execute แต่ละ task ใน prompt **Deviations เป็นเรื่องปกติ** - handle อัตโนมัติโดยใช้ embedded rules ด้านล่าง

1. อ่าน @context files ที่ลิสต์ใน prompt

2. สำหรับแต่ละ task:

   **หาก `type="auto"`:**

   **ก่อน executing:** ตรวจสอบว่า task มี `tdd="true"` attribute:
   - หากใช่: ทำตาม TDD execution flow (ดู `<tdd_execution>`) - RED → GREEN → REFACTOR cycle ด้วย atomic commits ต่อ stage
   - หากไม่: Standard implementation

   - ทำงานสู่ task completion
   - **หาก CLI/API return authentication error:** Handle เป็น authentication gate (ดูด้านล่าง)
   - **เมื่อค้นพบงานเพิ่มที่ไม่อยู่ใน plan:** Apply deviation rules (ดูด้านล่าง) อัตโนมัติ
   - ดำเนินการ implementing, apply rules ตามต้องการ
   - รัน verification
   - ยืนยัน done criteria met
   - **Commit task** (ดู `<task_commit>` ด้านล่าง)
   - Track task completion และ commit hash สำหรับ Summary documentation
   - ดำเนินการไป next task

   **หาก `type="checkpoint:*"`:**

   - หยุดทันที (อย่าดำเนินการไป next task)
   - Execute checkpoint_protocol (ดูด้านล่าง)
   - รอการตอบจากผู้ใช้
   - Verify หากเป็นไปได้ (check files, env vars, etc.)
   - หลังจากผู้ใช้ยืนยันเท่านั้น: ดำเนินการไป next task

3. รัน overall verification checks จากส่วน `<verification>`
4. ยืนยัน success criteria ทั้งหมดจากส่วน `<success_criteria>` met
5. Document deviations ทั้งหมดใน Summary (อัตโนมัติ - ดู deviation_documentation ด้านล่าง)
</step>

<authentication_gates>

## Handling Authentication Errors ระหว่าง Execution

**เมื่อพบ authentication errors ระหว่าง `type="auto"` task execution:**

นี่ไม่ใช่ failure Authentication gates คาดหวังและปกติ Handle แบบ dynamic:

**Authentication error indicators:**

- CLI returns: "Error: Not authenticated", "Not logged in", "Unauthorized", "401", "403"
- API returns: "Authentication required", "Invalid API key", "Missing credentials"
- Command fails with: "Please run {tool} login" หรือ "Set {ENV_VAR} environment variable"

**Authentication gate protocol:**

1. **รับรู้ว่าเป็น auth gate** - ไม่ใช่ bug แค่ต้องการ credentials
2. **หยุด current task execution** - อย่า retry ซ้ำๆ
3. **สร้าง dynamic checkpoint:human-action** - แสดงให้ผู้ใช้ทันที
4. **ให้ exact authentication steps** - CLI commands, ที่ไหนจะหา keys
5. **รอผู้ใช้ authenticate** - ปล่อยให้พวกเขา complete auth flow
6. **Verify authentication works** - ทดสอบว่า credentials valid
7. **Retry original task** - Resume automation ที่หยุดไว้
8. **ดำเนินการปกติ** - อย่า treat นี้เป็น error ใน Summary

**ตัวอย่าง: Vercel deployment โดน auth error**

```
Task 3: Deploy to Vercel
Running: vercel --yes

Error: Not authenticated. Please run 'vercel login'

[Create checkpoint dynamically]

════════════════════════════════════════
CHECKPOINT: Authentication Required
════════════════════════════════════════

Task 3 of 8: Authenticate Vercel CLI

I tried to deploy but got authentication error.

What you need to do:
Run: vercel login

This will open your browser - complete the authentication flow.

I'll verify after: vercel whoami returns your account

Type "done" when authenticated
════════════════════════════════════════

[Wait for user response]

[User types "done"]

Verifying authentication...
Running: vercel whoami
✓ Authenticated as: user@example.com

Retrying deployment...
Running: vercel --yes
✓ Deployed to: https://myapp-abc123.vercel.app

Task 3 complete. Continuing to task 4...
```

**ใน Summary documentation:**

Document authentication gates เป็น normal flow ไม่ใช่ deviations:

```markdown
## Authentication Gates

ระหว่าง execution ฉันพบ authentication requirements:

1. Task 3: Vercel CLI required authentication
   - Paused สำหรับ `vercel login`
   - Resumed หลัง authentication
   - Deployed successfully

These are normal gates, not errors.
```

**หลักการสำคัญ:**

- Authentication gates ไม่ใช่ failures หรือ bugs
- เป็น expected interaction points ระหว่าง first-time setup
- Handle อย่าง gracefully และดำเนินการ automation หลัง unblocked
- อย่า mark tasks ว่า "failed" หรือ "incomplete" เพราะ auth gates
- Document เป็น normal flow แยกจาก deviations
</authentication_gates>

<deviation_rules>

## Automatic Deviation Handling

**ขณะ executing tasks คุณจะค้นพบงานที่ไม่อยู่ใน plan** นี่เป็นเรื่องปกติ

Apply rules เหล่านี้อัตโนมัติ Track deviations ทั้งหมดสำหรับ Summary documentation

---

**RULE 1: Auto-fix bugs**

**Trigger:** Code ไม่ทำงานตามที่ตั้งใจ (broken behavior, incorrect output, errors)

**Action:** Fix ทันที track สำหรับ Summary

**ตัวอย่าง:**

- Wrong SQL query returning incorrect data
- Logic errors (inverted condition, off-by-one, infinite loop)
- Type errors, null pointer exceptions, undefined references
- Broken validation (accepts invalid input, rejects valid input)
- Security vulnerabilities (SQL injection, XSS, CSRF, insecure auth)
- Race conditions, deadlocks
- Memory leaks, resource leaks

**Process:**

1. Fix bug inline
2. Add/update tests เพื่อป้องกัน regression
3. Verify fix works
4. ดำเนินการ task
5. Track ใน deviations list: `[Rule 1 - Bug] [description]`

**ไม่ต้องขออนุญาต** Bugs ต้อง fix สำหรับ correct operation

---

**RULE 2: Auto-add missing critical functionality**

**Trigger:** Code ขาด essential features สำหรับ correctness, security, หรือ basic operation

**Action:** เพิ่มทันที track สำหรับ Summary

**ตัวอย่าง:**

- Missing error handling (no try/catch, unhandled promise rejections)
- No input validation (accepts malicious data, type coercion issues)
- Missing null/undefined checks (crashes on edge cases)
- No authentication on protected routes
- Missing authorization checks (users can access others' data)
- No CSRF protection, missing CORS configuration
- No rate limiting on public APIs
- Missing required database indexes (causes timeouts)
- No logging for errors (can't debug production)

**Process:**

1. เพิ่ม missing functionality inline
2. เพิ่ม tests สำหรับ new functionality
3. Verify it works
4. ดำเนินการ task
5. Track ใน deviations list: `[Rule 2 - Missing Critical] [description]`

**Critical = required สำหรับ correct/secure/performant operation**
**ไม่ต้องขออนุญาต** เหล่านี้ไม่ใช่ "features" - เป็น requirements สำหรับ basic correctness

---

**RULE 3: Auto-fix blocking issues**

**Trigger:** บางอย่างป้องกันคุณจาก completing current task

**Action:** Fix ทันทีเพื่อ unblock track สำหรับ Summary

**ตัวอย่าง:**

- Missing dependency (package not installed, import fails)
- Wrong types blocking compilation
- Broken import paths (file moved, wrong relative path)
- Missing environment variable (app won't start)
- Database connection config error
- Build configuration error (webpack, tsconfig, etc.)
- Missing file referenced in code
- Circular dependency blocking module resolution

**Process:**

1. Fix blocking issue
2. Verify task สามารถดำเนินการได้แล้ว
3. ดำเนินการ task
4. Track ใน deviations list: `[Rule 3 - Blocking] [description]`

**ไม่ต้องขออนุญาต** ทำ task ไม่ได้ถ้าไม่ fix blocker

---

**RULE 4: Ask about architectural changes**

**Trigger:** Fix/addition ต้องการ significant structural modification

**Action:** หยุด แสดงให้ผู้ใช้ รอ decision

**ตัวอย่าง:**

- Adding new database table (ไม่ใช่แค่ column)
- Major schema changes (changing primary key, splitting tables)
- Introducing new service layer หรือ architectural pattern
- Switching libraries/frameworks (React → Vue, REST → GraphQL)
- Changing authentication approach (sessions → JWT)
- Adding new infrastructure (message queue, cache layer, CDN)
- Changing API contracts (breaking changes to endpoints)
- Adding new deployment environment

**Process:**

1. หยุด current task
2. แสดงชัดเจน:

```
⚠️ Architectural Decision Needed

Current task: [task name]
Discovery: [what you found that prompted this]
Proposed change: [architectural modification]
Why needed: [rationale]
Impact: [what this affects - APIs, deployment, dependencies, etc.]
Alternatives: [other approaches, or "none apparent"]

Proceed with proposed change? (yes / different approach / defer)
```

3. รอการตอบจากผู้ใช้
4. หากอนุมัติ: implement, track as `[Rule 4 - Architectural] [description]`
5. หากแนวทางอื่น: discuss และ implement
6. หาก deferred: log ไป ISSUES.md, ดำเนินการโดยไม่เปลี่ยน

**ต้องการ user decision** การเปลี่ยนแปลงเหล่านี้ส่งผลต่อ system design

---

**RULE 5: Log non-critical enhancements**

**Trigger:** Improvement ที่จะ enhance code แต่ไม่จำเป็นตอนนี้

**Action:** เพิ่มลง .planning/ISSUES.md อัตโนมัติ ดำเนินการ task

**ตัวอย่าง:**

- Performance optimization (ทำงานถูกต้อง แค่ช้ากว่าที่ดี)
- Code refactoring (ทำงาน แต่ cleaner/DRY-er ได้)
- Better naming (ทำงาน แต่ variables clearer ได้)
- Organizational improvements (ทำงาน แต่ file structure ดีกว่าได้)
- Nice-to-have UX improvements (ทำงาน แต่ smoother ได้)
- Additional test coverage beyond basics (basics มี thorough กว่าได้)
- Documentation improvements (code ทำงาน docs ดีกว่าได้)
- Accessibility enhancements beyond minimum

**Process:**

1. สร้าง .planning/ISSUES.md หากไม่มี (ใช้ `~/.claude/get-shit-done/templates/issues.md`)
2. เพิ่ม entry ด้วยหมายเลข ISS-XXX (auto-increment)
3. Brief notification: `📋 Logged enhancement: [brief] (ISS-XXX)`
4. ดำเนินการ task โดยไม่ implementing

**ไม่ต้องขออนุญาต** Logging สำหรับพิจารณาในอนาคต

---

**RULE PRIORITY (เมื่อหลายอันใช้ได้):**

1. **หาก Rule 4 ใช้ได้** → หยุดและถาม (architectural decision)
2. **หาก Rules 1-3 ใช้ได้** → Fix อัตโนมัติ track สำหรับ Summary
3. **หาก Rule 5 ใช้ได้** → Log ไป ISSUES.md ดำเนินการ
4. **หากไม่แน่ใจว่า rule ไหนจริงๆ** → Apply Rule 4 (ถามผู้ใช้)

**Edge case guidance:**

- "This validation is missing" → Rule 2 (critical for security)
- "This validation could be better" → Rule 5 (enhancement)
- "This crashes on null" → Rule 1 (bug)
- "This could be faster" → Rule 5 (enhancement) ยกเว้น actually timing out → Rule 2 (critical)
- "Need to add table" → Rule 4 (architectural)
- "Need to add column" → Rule 1 or 2 (depends: fixing bug or adding critical field)

**เมื่อสงสัย:** ถามตัวเอง "สิ่งนี้ส่งผลต่อ correctness, security, หรือ ability to complete task?"

- YES → Rules 1-3 (fix อัตโนมัติ)
- NO → Rule 5 (log it)
- MAYBE → Rule 4 (ถามผู้ใช้)

</deviation_rules>

<deviation_documentation>

## Documenting Deviations ใน Summary

หลังทุก tasks complete, Summary ต้องมี deviations section

**หากไม่มี deviations:**

```markdown
## Deviations from Plan

None - plan executed exactly as written.
```

**หากมี deviations:**

```markdown
## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed case-sensitive email uniqueness constraint**

- **Found during:** Task 4 (Follow/unfollow API implementation)
- **Issue:** User.email unique constraint was case-sensitive - Test@example.com และ test@example.com ทั้งคู่ allowed ทำให้ duplicate accounts
- **Fix:** Changed to `CREATE UNIQUE INDEX users_email_unique ON users (LOWER(email))`
- **Files modified:** src/models/User.ts, migrations/003_fix_email_unique.sql
- **Verification:** Unique constraint test passes - duplicate emails properly rejected
- **Commit:** abc123f

**2. [Rule 2 - Missing Critical] Added JWT expiry validation to auth middleware**

- **Found during:** Task 3 (Protected route implementation)
- **Issue:** Auth middleware wasn't checking token expiry - expired tokens ถูก accept
- **Fix:** Added exp claim validation ใน middleware, reject with 401 if expired
- **Files modified:** src/middleware/auth.ts, src/middleware/auth.test.ts
- **Verification:** Expired token test passes - properly rejects with 401
- **Commit:** def456g

### Deferred Enhancements

Logged to .planning/ISSUES.md สำหรับพิจารณาในอนาคต:

- ISS-001: Refactor UserService into smaller modules (discovered in Task 3)
- ISS-002: Add connection pooling for Redis (discovered in Task 6)

---

**Total deviations:** 4 auto-fixed (1 bug, 1 missing critical, 1 blocking, 1 architectural with approval), 3 deferred
**Impact on plan:** All auto-fixes necessary for correctness/security/performance. No scope creep.
```

**นี่ให้ความโปร่งใสสมบูรณ์:**

- ทุก deviation documented
- ทำไมถึงจำเป็น
- Rule ไหน applied
- ทำอะไร
- ผู้ใช้เห็นได้ชัดเจนว่าเกิดอะไรขึ้นนอกเหนือจาก plan

</deviation_documentation>

<tdd_plan_execution>
## TDD Plan Execution

เมื่อ executing plan ที่มี `type: tdd` ใน frontmatter ทำตาม RED-GREEN-REFACTOR cycle สำหรับ single feature ที่กำหนดใน plan

**1. ตรวจสอบ test infrastructure (หากเป็น TDD plan แรก):**
หากไม่มี test framework configured:
- Detect project type จาก package.json/requirements.txt/etc.
- Install minimal test framework (Jest, pytest, Go testing, etc.)
- สร้าง test config file
- Verify: run empty test suite
- นี่เป็นส่วนของ RED phase ไม่ใช่ task แยก

**2. RED - Write failing test:**
- อ่าน `<behavior>` element สำหรับ test specification
- สร้าง test file หากไม่มี (follow project conventions)
- เขียน test(s) ที่อธิบาย expected behavior
- Run tests - ต้อง fail (หาก passes test ผิดหรือ feature มีอยู่แล้ว)
- Commit: `test({phase}-{plan}): add failing test for [feature]`

**3. GREEN - Implement to pass:**
- อ่าน `<implementation>` element สำหรับ guidance
- เขียน minimal code เพื่อให้ test pass
- Run tests - ต้อง pass
- Commit: `feat({phase}-{plan}): implement [feature]`

**4. REFACTOR (หากจำเป็น):**
- Clean up code หากมี obvious improvements
- Run tests - ต้องยังคง pass
- Commit เฉพาะหากมี changes: `refactor({phase}-{plan}): clean up [feature]`

**Commit pattern สำหรับ TDD plans:**
แต่ละ TDD plan ผลิต 2-3 atomic commits:
1. `test({phase}-{plan}): add failing test for X`
2. `feat({phase}-{plan}): implement X`
3. `refactor({phase}-{plan}): clean up X` (optional)

**Error handling:**
- หาก test ไม่ fail ใน RED phase: Test ผิดหรือ feature มีอยู่แล้ว Investigate ก่อน proceeding
- หาก test ไม่ pass ใน GREEN phase: Debug implementation keep iterating until green
- หาก tests fail ใน REFACTOR phase: Undo refactor commit premature

**Verification:**
หลัง TDD plan completion ตรวจสอบ:
- ทุก tests pass
- Test coverage สำหรับ new behavior มี
- ไม่มี unrelated tests broken

**ทำไม TDD ใช้ dedicated plans:** TDD ต้องการ 2-3 execution cycles (RED → GREEN → REFACTOR) แต่ละอันมี file reads, test runs และ potential debugging นี่ใช้ 40-50% ของ context สำหรับ single feature Dedicated plans รับประกัน full quality ตลอด cycle

**การเปรียบเทียบ:**
- Standard plans: Multiple tasks, 1 commit per task, 2-4 commits รวม
- TDD plans: Single feature, 2-3 commits สำหรับ RED/GREEN/REFACTOR cycle

ดู `~/.claude/get-shit-done/references/tdd.md` สำหรับ TDD plan structure
</tdd_plan_execution>

<task_commit>
## Task Commit Protocol

หลังแต่ละ task completes (verification passed, done criteria met) commit ทันที:

**1. ระบุ modified files:**

Track files ที่เปลี่ยนระหว่าง task นี้เฉพาะ (ไม่ใช่ plan ทั้งหมด):

```bash
git status --short
```

**2. Stage เฉพาะ task-related files:**

Stage แต่ละ file individually (อย่าใช้ `git add .` หรือ `git add -A` เด็ดขาด):

```bash
# ตัวอย่าง - adjust ตาม actual files modified by this task
git add src/api/auth.ts
git add src/types/user.ts
```

**3. กำหนด commit type:**

| Type | When to Use | Example |
|------|-------------|---------|
| `feat` | New feature, endpoint, component, functionality | feat(08-02): create user registration endpoint |
| `fix` | Bug fix, error correction | fix(08-02): correct email validation regex |
| `test` | Test-only changes (TDD RED phase) | test(08-02): add failing test for password hashing |
| `refactor` | Code cleanup, no behavior change (TDD REFACTOR phase) | refactor(08-02): extract validation to helper |
| `perf` | Performance improvement | perf(08-02): add database index for user lookups |
| `docs` | Documentation changes | docs(08-02): add API endpoint documentation |
| `style` | Formatting, linting fixes | style(08-02): format auth module |
| `chore` | Config, tooling, dependencies | chore(08-02): add bcrypt dependency |

**4. Craft commit message:**

Format: `{type}({phase}-{plan}): {task-name-or-description}`

```bash
git commit -m "{type}({phase}-{plan}): {concise task description}

- {key change 1}
- {key change 2}
- {key change 3}
"
```

**ตัวอย่าง:**

```bash
# Standard plan task
git commit -m "feat(08-02): create user registration endpoint

- POST /auth/register validates email and password
- Checks for duplicate users
- Returns JWT token on success
"

# Another standard task
git commit -m "fix(08-02): correct email validation regex

- Fixed regex to accept plus-addressing
- Added tests for edge cases
"
```

**หมายเหตุ:** TDD plans มี commit pattern ของตัวเอง (test/feat/refactor สำหรับ RED/GREEN/REFACTOR phases) ดู `<tdd_plan_execution>` section ด้านบน

**5. บันทึก commit hash:**

หลัง committing จับ hash สำหรับ SUMMARY.md:

```bash
TASK_COMMIT=$(git rev-parse --short HEAD)
echo "Task ${TASK_NUM} committed: ${TASK_COMMIT}"
```

เก็บใน array หรือ list สำหรับ SUMMARY generation:
```bash
TASK_COMMITS+=("Task ${TASK_NUM}: ${TASK_COMMIT}")
```

**ประโยชน์ของ Atomic commit:**
- แต่ละ task revertable แยกกัน
- Git bisect หา exact failing task
- Git blame trace line ไป specific task context
- History ชัดเจนสำหรับ Claude ใน future sessions
- Observability ดีกว่าสำหรับ AI-automated workflow

</task_commit>

<step name="checkpoint_protocol">
เมื่อเจอ `type="checkpoint:*"`:

**สำคัญ: Claude automate ทุกอย่างด้วย CLI/API ก่อน checkpoints** Checkpoints สำหรับ verification และ decisions ไม่ใช่ manual work

**แสดง checkpoint ชัดเจน:**

```
════════════════════════════════════════
CHECKPOINT: [Type]
════════════════════════════════════════

Task [X] of [Y]: [Action/What-Built/Decision]

[Display task-specific content based on type]

[Resume signal instruction]
════════════════════════════════════════
```

**สำหรับ checkpoint:human-verify (90% ของ checkpoints):**

```
I automated: [อะไรที่ automated - deployed, built, configured]

How to verify:
1. [Step 1 - exact command/URL]
2. [Step 2 - what to check]
3. [Step 3 - expected behavior]

[Resume signal - เช่น "Type 'approved' or describe issues"]
```

**สำหรับ checkpoint:decision (9% ของ checkpoints):**

```
Decision needed: [decision]

Context: [ทำไมสำคัญ]

Options:
1. [option-id]: [name]
   Pros: [pros]
   Cons: [cons]

2. [option-id]: [name]
   Pros: [pros]
   Cons: [cons]

[Resume signal - เช่น "Select: option-id"]
```

**สำหรับ checkpoint:human-action (1% - rare, เฉพาะ truly unavoidable manual steps):**

```
I automated: [อะไรที่ Claude ทำแล้วผ่าน CLI/API]

Need your help with: [สิ่งหนึ่งที่ไม่มี CLI/API - email link, 2FA code]

Instructions:
[Single unavoidable step]

I'll verify after: [verification]

[Resume signal - เช่น "Type 'done' when complete"]
```

**หลังแสดง:** รอการตอบจากผู้ใช้ อย่า hallucinate completion อย่าดำเนินการไป next task

**หลังผู้ใช้ตอบ:**

- Run verification หากระบุ (file exists, env var set, tests pass, etc.)
- หาก verification passes หรือ N/A: ดำเนินการไป next task
- หาก verification fails: แจ้งผู้ใช้ รอ resolution

ดู ~/.claude/get-shit-done/references/checkpoints.md สำหรับ checkpoint guidance ครบถ้วน
</step>

<step name="verification_failure_gate">
หาก task verification ใดๆ fail:

หยุด อย่าดำเนินการไป next task

แสดง inline:
"Verification failed for Task [X]: [task name]

Expected: [verification criteria]
Actual: [what happened]

How to proceed?

1. Retry - Try the task again
2. Skip - Mark as incomplete, continue
3. Stop - Pause execution, investigate"

รอ user decision

หากผู้ใช้เลือก "Skip" note ใน SUMMARY.md under "Issues Encountered"
</step>

<step name="record_completion_time">
บันทึกเวลาสิ้นสุด execution และคำนวณ duration:

```bash
PLAN_END_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
PLAN_END_EPOCH=$(date +%s)

DURATION_SEC=$(( PLAN_END_EPOCH - PLAN_START_EPOCH ))
DURATION_MIN=$(( DURATION_SEC / 60 ))

if [[ $DURATION_MIN -ge 60 ]]; then
  HRS=$(( DURATION_MIN / 60 ))
  MIN=$(( DURATION_MIN % 60 ))
  DURATION="${HRS}h ${MIN}m"
else
  DURATION="${DURATION_MIN} min"
fi
```

ส่ง timing data ไป SUMMARY.md creation
</step>

<step name="create_summary">
สร้าง `{phase}-{plan}-SUMMARY.md` ตามที่ระบุในส่วน `<output>` ของ prompt
ใช้ ~/.claude/get-shit-done/templates/summary.md สำหรับโครงสร้าง

**File location:** `.planning/phases/XX-name/{phase}-{plan}-SUMMARY.md`

**Frontmatter population:**

ก่อนเขียน summary content กรอก frontmatter fields จาก execution context:

1. **Basic identification:**
   - phase: จาก PLAN.md frontmatter
   - plan: จาก PLAN.md frontmatter
   - subsystem: จัดหมวดหมู่ตาม phase focus (auth, payments, ui, api, database, infra, testing, etc.)
   - tags: ดึง tech keywords (libraries, frameworks, tools used)

2. **Dependency graph:**
   - requires: List prior phases ที่สร้างบน (check PLAN.md context section for referenced prior summaries)
   - provides: ดึงจาก accomplishments - อะไรที่ delivered
   - affects: อนุมานจาก phase description/goal ว่า future phases ใดอาจต้องการนี้

3. **Tech tracking:**
   - tech-stack.added: New libraries จาก package.json changes หรือ requirements
   - tech-stack.patterns: Architectural patterns ที่ตั้ง (จาก decisions/accomplishments)

4. **File tracking:**
   - key-files.created: จากส่วน "Files Created/Modified"
   - key-files.modified: จากส่วน "Files Created/Modified"

5. **Decisions:**
   - key-decisions: ดึงจากส่วน "Decisions Made"

6. **Issues:**
   - issues-created: ตรวจสอบว่า ISSUES.md updated ระหว่าง execution

7. **Metrics:**
   - duration: จาก $DURATION variable
   - completed: จาก $PLAN_END_TIME (date only, format YYYY-MM-DD)

Note: หาก subsystem/affects ไม่ชัดเจน ใช้ best judgment ตาม phase name และ accomplishments สามารถ refine later

**Title format:** `# Phase [X] Plan [Y]: [Name] Summary`

One-liner ต้อง SUBSTANTIVE:

- Good: "JWT auth with refresh rotation using jose library"
- Bad: "Authentication implemented"

**Include performance data:**

- Duration: `$DURATION`
- Started: `$PLAN_START_TIME`
- Completed: `$PLAN_END_TIME`
- Tasks completed: (count from execution)
- Files modified: (count from execution)

**Next Step section:**

- หากมี plans เพิ่มใน phase นี้: "Ready for {phase}-{next-plan}-PLAN.md"
- หากนี่เป็น plan สุดท้าย: "Phase complete, ready for transition"
</step>

<step name="update_current_position">
อัปเดตส่วน Current Position ใน STATE.md เพื่อสะท้อน plan completion

**Format:**

```markdown
Phase: [current] of [total] ([phase name])
Plan: [just completed] of [total in phase]
Status: [In progress / Phase complete]
Last activity: [today] - Completed {phase}-{plan}-PLAN.md

Progress: [progress bar]
```

**Calculate progress bar:**

- นับ plans ทั้งหมดในทุก phases (จาก ROADMAP.md)
- นับ completed plans (นับ SUMMARY.md files ที่มี)
- Progress = (completed / total) × 100%
- Render: ░ สำหรับ incomplete, █ สำหรับ complete

**ตัวอย่าง - completing 02-01-PLAN.md (plan 5 of 10 total):**

Before:

```markdown
## Current Position

Phase: 2 of 4 (Authentication)
Plan: Not started
Status: Ready to execute
Last activity: 2025-01-18 - Phase 1 complete

Progress: ██████░░░░ 40%
```

After:

```markdown
## Current Position

Phase: 2 of 4 (Authentication)
Plan: 1 of 2 in current phase
Status: In progress
Last activity: 2025-01-19 - Completed 02-01-PLAN.md

Progress: ███████░░░ 50%
```

**Step complete when:**

- [ ] Phase number แสดง current phase (X of total)
- [ ] Plan number แสดง plans complete ใน current phase (N of total-in-phase)
- [ ] Status สะท้อน current state (In progress / Phase complete)
- [ ] Last activity แสดงวันที่วันนี้และ plan ที่เพิ่งเสร็จ
- [ ] Progress bar คำนวณถูกต้องจาก total completed plans
</step>

<step name="extract_decisions_and_issues">
ดึง decisions, issues และ concerns จาก SUMMARY.md ลง STATE.md accumulated context

**Decisions Made:**

- อ่าน SUMMARY.md ส่วน "## Decisions Made"
- หากมี content (ไม่ใช่ "None"):
  - เพิ่มแต่ละ decision ลง STATE.md Decisions table
  - Format: `| [phase number] | [decision summary] | [rationale] |`

**Deferred Issues:**

- อ่าน SUMMARY.md เพื่อตรวจสอบว่า issues ใหม่ถูก log ไป ISSUES.md
- หากมี ISS-XXX entries ใหม่:
  - อัปเดตส่วน "Deferred Issues" ใน STATE.md

**Blockers/Concerns:**

- อ่าน SUMMARY.md ส่วน "## Next Phase Readiness"
- หากมี blockers หรือ concerns:
  - เพิ่มลง "Blockers/Concerns Carried Forward" ใน STATE.md
</step>

<step name="update_session_continuity">
อัปเดตส่วน Session Continuity ใน STATE.md เพื่อ enable resumption ใน future sessions

**Format:**

```markdown
Last session: [current date and time]
Stopped at: Completed {phase}-{plan}-PLAN.md
Resume file: [path to .continue-here if exists, else "None"]
```

**Size constraint note:** เก็บ STATE.md ต่ำกว่า 150 lines total
</step>

<step name="issues_review_gate">
ก่อนดำเนินการ ตรวจสอบ SUMMARY.md content

หาก "Issues Encountered" ไม่ใช่ "None":

<if mode="yolo">
```
⚡ อนุมัติอัตโนมัติ: รับทราบ Issues
⚠️ Note: Issues พบระหว่าง execution:
- [Issue 1]
- [Issue 2]
(Logged - continuing in yolo mode)
```

ดำเนินการโดยไม่รอ
</if>

<if mode="interactive" OR="custom with gates.issues_review true">
แสดง issues และรอการรับทราบก่อนดำเนินการ
</if>
</step>

<step name="update_roadmap">
อัปเดต roadmap file:

```bash
ROADMAP_FILE=".planning/ROADMAP.md"
```

**หากยังมี plans เหลือใน phase นี้:**

- อัปเดต plan count: "2/3 plans complete"
- เก็บ phase status เป็น "In progress"

**หากนี่เป็น plan สุดท้ายใน phase:**

- Mark phase complete: status → "Complete"
- เพิ่ม completion date
</step>

<step name="git_commit_metadata">
Commit execution metadata (SUMMARY + STATE + ROADMAP):

**Note:** Task code ทั้งหมด commit แล้วระหว่าง execution (one commit per task)
PLAN.md commit แล้วระหว่าง plan-phase Final commit นี้จับ execution results เท่านั้น

**1. Stage execution artifacts:**

```bash
git add .planning/phases/XX-name/{phase}-{plan}-SUMMARY.md
git add .planning/STATE.md
```

**2. Stage roadmap file:**

```bash
git add .planning/ROADMAP.md
```

**3. Verify staging:**

```bash
git status
# ควรแสดงเฉพาะ execution artifacts (SUMMARY, STATE, ROADMAP) ไม่มี code files
```

**4. Commit metadata:**

```bash
git commit -m "$(cat <<'EOF'
docs({phase}-{plan}): complete [plan-name] plan

Tasks completed: [N]/[N]
- [Task 1 name]
- [Task 2 name]
- [Task 3 name]

SUMMARY: .planning/phases/XX-name/{phase}-{plan}-SUMMARY.md
EOF
)"
```

**ตัวอย่าง:**

```bash
git commit -m "$(cat <<'EOF'
docs(08-02): complete user registration plan

Tasks completed: 3/3
- User registration endpoint
- Password hashing with bcrypt
- Email confirmation flow

SUMMARY: .planning/phases/08-user-auth/08-02-registration-SUMMARY.md
EOF
)"
```

**Git log หลัง plan execution:**

```
abc123f docs(08-02): complete user registration plan
def456g feat(08-02): add email confirmation flow
hij789k feat(08-02): implement password hashing with bcrypt
lmn012o feat(08-02): create user registration endpoint
```

แต่ละ task มี commit ของตัว ตามด้วย metadata commit หนึ่งอัน documenting plan completion

สำหรับ commit message conventions ดู ~/.claude/get-shit-done/references/git-integration.md
</step>

<step name="update_codebase_map">
**หาก .planning/codebase/ มี:**

ตรวจสอบอะไรเปลี่ยนในทุก task commits ใน plan นี้:

```bash
# หา first task commit (หลังจาก previous plan's docs commit)
FIRST_TASK=$(git log --oneline --grep="feat({phase}-{plan}):" --grep="fix({phase}-{plan}):" --grep="test({phase}-{plan}):" --reverse | head -1 | cut -d' ' -f1)

# ดู changes ทั้งหมดจาก first task ถึงตอนนี้
git diff --name-only ${FIRST_TASK}^..HEAD 2>/dev/null
```

**อัปเดตเฉพาะหาก structural changes เกิดขึ้น:**

| Change Detected | Update Action |
|-----------------|---------------|
| New directory ใน src/ | STRUCTURE.md: เพิ่มลง directory layout |
| package.json deps changed | STACK.md: Add/remove จาก dependencies list |
| New file pattern (เช่น first .test.ts) | CONVENTIONS.md: Note new pattern |
| New external API client | INTEGRATIONS.md: เพิ่ม service entry ด้วย file path |
| Config file added/changed | STACK.md: อัปเดต configuration section |
| File renamed/moved | อัปเดต paths ใน relevant docs |

**ข้าม update หาก:**
- Code changes ภายใน existing files
- Bug fixes
- Content changes (no structural impact)

**Update format:**
ทำ single targeted edits - เพิ่ม bullet point, อัปเดต path, หรือลบ stale entry อย่าเขียนใหม่ sections

```bash
git add .planning/codebase/*.md
git commit --amend --no-edit  # Include ใน metadata commit
```

**หาก .planning/codebase/ ไม่มี:**
ข้าม step นี้
</step>

<step name="check_phase_issues">
**ตรวจสอบว่า issues ถูกสร้างระหว่าง phase นี้:**

```bash
# ตรวจสอบว่า ISSUES.md มีและมี issues จาก current phase
if [ -f .planning/ISSUES.md ]; then
  grep -E "Phase ${PHASE}.*Task" .planning/ISSUES.md | grep -v "^#" || echo "NO_ISSUES_THIS_PHASE"
fi
```

**หาก issues ถูกสร้างระหว่าง phase นี้:**

```
📋 Issues logged ระหว่าง phase นี้:
- ISS-XXX: [brief description]
- ISS-YYY: [brief description]

Review ตอนนี้?
```

ใช้ AskUserQuestion:
- header: "Phase Issues"
- question: "[N] issues ถูก logged ระหว่าง phase นี้ Review ตอนนี้?"
- options:
  - "Review issues" - Analyze with /gsd:consider-issues
  - "Continue" - จัดการทีหลัง ดำเนินการไป next work

**หากเลือก "Review issues":**
- Invoke: `SlashCommand("/gsd:consider-issues")`
- หลัง consider-issues completes กลับไป offer_next

**หากเลือก "Continue" หรือไม่พบ issues:**
- ดำเนินการไป offer_next step

**ใน YOLO mode:**
- Note issues ถูก logged แต่ไม่ prompt: `📋 [N] issues logged phase นี้ (review later with /gsd:consider-issues)`
- ดำเนินการไป offer_next อัตโนมัติ
</step>

<step name="offer_next">
**บังคับ: Verify remaining work ก่อนแสดง next steps**

อย่าข้าม verification นี้ อย่าสมมติ phase หรือ milestone completion โดยไม่ตรวจสอบ

**Step 1: นับ plans และ summaries ใน current phase**

List files ใน phase directory:

```bash
ls -1 .planning/phases/[current-phase-dir]/*-PLAN.md 2>/dev/null | wc -l
ls -1 .planning/phases/[current-phase-dir]/*-SUMMARY.md 2>/dev/null | wc -l
```

ระบุจำนวน: "Phase นี้มี [X] plans และ [Y] summaries"

**Step 2: Route based on plan completion**

เปรียบเทียบจำนวนจาก Step 1:

| Condition | Meaning | Action |
|-----------|---------|--------|
| summaries < plans | มี plans เหลือ | ไป **Route A** |
| summaries = plans | Phase complete | ไป Step 3 |

---

**Route A: มี plans เหลือใน phase นี้**

ระบุ next unexecuted plan:
- หาไฟล์ PLAN.md แรกที่ไม่มี SUMMARY.md ที่ตรงกัน
- อ่านส่วน `<objective>`

<if mode="yolo">
```
Plan {phase}-{plan} complete.
Summary: .planning/phases/{phase-dir}/{phase}-{plan}-SUMMARY.md

{Y} of {X} plans complete for Phase {Z}.

⚡ ดำเนินการต่ออัตโนมัติ: Execute next plan ({phase}-{next-plan})
```

Loop back ไป identify_plan step อัตโนมัติ
</if>

<if mode="interactive" OR="custom with gates.execute_next_plan true">
```
Plan {phase}-{plan} complete.
Summary: .planning/phases/{phase-dir}/{phase}-{plan}-SUMMARY.md

{Y} of {X} plans complete for Phase {Z}.

---

## ▶ ถัดไป

**{phase}-{next-plan}: [Plan Name]** — [objective from next PLAN.md]

`/gsd:execute-plan .planning/phases/{phase-dir}/{phase}-{next-plan}-PLAN.md`

<sub>`/clear` ก่อน → context window ใหม่</sub>

---

**ยังมีให้เลือก:**
- `/gsd:verify-work {phase}-{plan}` — manual acceptance testing ก่อนดำเนินการต่อ
- Review what was built ก่อนดำเนินการต่อ

---
```

รอผู้ใช้ clear และ run next command
</if>

**หยุดที่นี่หาก Route A applies อย่าดำเนินการไป Step 3**

---

**Step 3: ตรวจสอบ milestone status (เฉพาะเมื่อทุก plans ใน phase complete)**

อ่าน ROADMAP.md และดึง:
1. Current phase number (จาก plan ที่เพิ่งเสร็จ)
2. ทุก phase numbers ที่ listed ในส่วน current milestone

เพื่อหา phases ใน current milestone มองหา:
- Phase headers: lines ที่เริ่มด้วย `### Phase` หรือ `#### Phase`
- Phase list items: lines like `- [ ] **Phase X:` หรือ `- [x] **Phase X:`

นับ phases ทั้งหมดใน current milestone และระบุ highest phase number

ระบุ: "Current phase is {X}. Milestone has {N} phases (highest: {Y})."

**Step 4: Route based on milestone status**

| Condition | Meaning | Action |
|-----------|---------|--------|
| current phase < highest phase | มี phases เหลือ | ไป **Route B** |
| current phase = highest phase | Milestone complete | ไป **Route C** |

---

**Route B: Phase complete, มี phases เหลือใน milestone**

อ่าน ROADMAP.md เพื่อดูชื่อและ goal ของ next phase

```
Plan {phase}-{plan} complete.
Summary: .planning/phases/{phase-dir}/{phase}-{plan}-SUMMARY.md

## ✓ Phase {Z}: {Phase Name} Complete

ทุก {Y} plans เสร็จ

---

## ▶ ถัดไป

**Phase {Z+1}: {Next Phase Name}** — {Goal จาก ROADMAP.md}

`/gsd:plan-phase {Z+1}`

<sub>`/clear` ก่อน → context window ใหม่</sub>

---

**ยังมีให้เลือก:**
- `/gsd:verify-work {Z}` — manual acceptance testing ก่อนดำเนินการต่อ
- `/gsd:discuss-phase {Z+1}` — รวบรวม context ก่อน
- `/gsd:research-phase {Z+1}` — สืบค้นสิ่งที่ไม่รู้
- Review phase accomplishments ก่อนดำเนินการต่อ

---
```

---

**Route C: Milestone complete (ทุก phases done)**

```
🎉 MILESTONE COMPLETE!

Plan {phase}-{plan} complete.
Summary: .planning/phases/{phase-dir}/{phase}-{plan}-SUMMARY.md

## ✓ Phase {Z}: {Phase Name} Complete

ทุก {Y} plans เสร็จ

════════════════════════════════════════
ทุก {N} phases complete!
Milestone เสร็จ 100%
════════════════════════════════════════

---

## ▶ ถัดไป

**Complete Milestone** — archive และเตรียมสำหรับ next

`/gsd:complete-milestone`

<sub>`/clear` ก่อน → context window ใหม่</sub>

---
```

</step>

</process>

<success_criteria>
Execution สำเร็จเมื่อ:
- [ ] STATE.md โหลด project context restored
- [ ] PLAN.md ระบุและ executed
- [ ] ทุก tasks executed (auto) หรือ guided (checkpoints)
- [ ] Deviations handled ตาม rules และ documented
- [ ] Verification checks ผ่าน
- [ ] SUMMARY.md สร้างพร้อม all sections
- [ ] STATE.md อัปเดต (position, decisions, issues, session)
- [ ] ROADMAP.md อัปเดตพร้อม progress
- [ ] Codebase map อัปเดตหาก structural changes
- [ ] Git commits ทำ (per-task + metadata)
- [ ] ผู้ใช้รู้ขั้นตอนถัดไป
</success_criteria>
