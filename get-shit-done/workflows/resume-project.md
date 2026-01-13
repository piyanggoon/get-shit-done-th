<trigger>
ใช้ workflow นี้เมื่อ:
- เริ่ม session ใหม่บนโปรเจกต์ที่มีอยู่
- ผู้ใช้พูดว่า "continue", "what's next", "where were we", "resume"
- Planning operation ใดๆ เมื่อ .planning/ มีอยู่แล้ว
- ผู้ใช้กลับมาหลังห่างจากโปรเจกต์
</trigger>

<purpose>
Restore full project context ทันทีและแสดง status ชัดเจน
เปิดใช้ seamless session continuity สำหรับ fully autonomous workflows

"Where were we?" ควรมีคำตอบทันทีและสมบูรณ์
</purpose>

<process>

<step name="detect_existing_project">
ตรวจสอบว่านี่เป็นโปรเจกต์ที่มีอยู่หรือไม่:

```bash
ls .planning/STATE.md 2>/dev/null && echo "Project exists"
ls .planning/ROADMAP.md 2>/dev/null && echo "Roadmap exists"
ls .planning/PROJECT.md 2>/dev/null && echo "Project file exists"
```

**หาก STATE.md มี:** ดำเนินการไป load_state
**หากมีเฉพาะ ROADMAP.md/PROJECT.md:** เสนอให้ reconstruct STATE.md
**หาก .planning/ ไม่มี:** นี่เป็นโปรเจกต์ใหม่ - route ไป /gsd:new-project
</step>

<step name="load_state">

อ่านและ parse STATE.md แล้ว PROJECT.md:

```bash
cat .planning/STATE.md
cat .planning/PROJECT.md
```

**จาก STATE.md ดึง:**

- **Project Reference**: Core value และ current focus
- **Current Position**: Phase X of Y, Plan A of B, Status
- **Progress**: Visual progress bar
- **Recent Decisions**: Key decisions ส่งผลต่องานปัจจุบัน
- **Deferred Issues**: Open items รอความสนใจ
- **Blockers/Concerns**: Issues carried forward
- **Session Continuity**: หยุดที่ไหน resume files ใดๆ

**จาก PROJECT.md ดึง:**

- **What This Is**: คำอธิบายที่ถูกต้องปัจจุบัน
- **Requirements**: Validated, Active, Out of Scope
- **Key Decisions**: Full decision log พร้อม outcomes
- **Constraints**: Hard limits บน implementation

</step>

<step name="check_incomplete_work">
มองหา incomplete work ที่ต้องการความสนใจ:

```bash
# ตรวจสอบ continue-here files (mid-plan resumption)
ls .planning/phases/*/.continue-here*.md 2>/dev/null

# ตรวจสอบ plans ที่ไม่มี summaries (incomplete execution)
for plan in .planning/phases/*/*-PLAN.md; do
  summary="${plan/PLAN/SUMMARY}"
  [ ! -f "$summary" ] && echo "Incomplete: $plan"
done 2>/dev/null

# ตรวจสอบ interrupted agents
if [ -f .planning/current-agent-id.txt ] && [ -s .planning/current-agent-id.txt ]; then
  AGENT_ID=$(cat .planning/current-agent-id.txt | tr -d '\n')
  echo "Interrupted agent: $AGENT_ID"
fi
```

**หาก .continue-here file มี:**

- นี่คือ mid-plan resumption point
- อ่านไฟล์สำหรับ specific resumption context
- Flag: "Found mid-plan checkpoint"

**หาก PLAN ไม่มี SUMMARY:**

- Execution เริ่มแต่ไม่เสร็จ
- Flag: "Found incomplete plan execution"

**หากพบ interrupted agent:**

- Subagent ถูก spawn แต่ session จบก่อน completion
- อ่าน agent-history.json สำหรับ task details
- Flag: "Found interrupted agent"
</step>

<step name="present_status">
แสดง complete project status ให้ผู้ใช้:

```
╔══════════════════════════════════════════════════════════════╗
║  PROJECT STATUS                                               ║
╠══════════════════════════════════════════════════════════════╣
║  Building: [one-liner จาก PROJECT.md "What This Is"]          ║
║                                                               ║
║  Phase: [X] of [Y] - [Phase name]                            ║
║  Plan:  [A] of [B] - [Status]                                ║
║  Progress: [██████░░░░] XX%                                  ║
║                                                               ║
║  Last activity: [date] - [what happened]                     ║
╚══════════════════════════════════════════════════════════════╝

[หากพบ incomplete work:]
⚠️  Incomplete work detected:
    - [.continue-here file หรือ incomplete plan]

[หากพบ interrupted agent:]
⚠️  Interrupted agent detected:
    Agent ID: [id]
    Task: [task description จาก agent-history.json]
    Interrupted: [timestamp]

    Resume with: /gsd:resume-task

[หากมี deferred issues:]
📋 [N] deferred issues รอความสนใจ

[หากมี blockers:]
⚠️  Carried concerns:
    - [blocker 1]
    - [blocker 2]

[หาก alignment ไม่ใช่ ✓:]
⚠️  Brief alignment: [status] - [assessment]
```

</step>

<step name="determine_next_action">
ตาม project state กำหนด next action ที่ logical ที่สุด:

**หาก interrupted agent มี:**
→ Primary: Resume interrupted agent (/gsd:resume-task)
→ Option: Start fresh (abandon agent work)

**หาก .continue-here file มี:**
→ Primary: Resume from checkpoint
→ Option: Start fresh on current plan

**หาก incomplete plan (PLAN ไม่มี SUMMARY):**
→ Primary: Complete the incomplete plan
→ Option: Abandon and move on

**หาก phase in progress ทุก plans complete:**
→ Primary: Transition to next phase
→ Option: Review completed work

**หาก phase ready to plan:**
→ ตรวจสอบว่า CONTEXT.md มีสำหรับ phase นี้:

- หาก CONTEXT.md ไม่มี:
  → Primary: Discuss phase vision (ผู้ใช้จินตนาการว่าทำงานอย่างไร)
  → Secondary: Plan directly (ข้าม context gathering)
- หาก CONTEXT.md มี:
  → Primary: Plan the phase
  → Option: Review roadmap

**หาก phase ready to execute:**
→ Primary: Execute next plan
→ Option: Review the plan first
</step>

<step name="offer_options">
แสดง contextual options ตาม project state:

```
What would you like to do?

[Primary action ตาม state - เช่น:]
1. Resume interrupted agent (/gsd:resume-task) [หากพบ interrupted agent]
   OR
1. Resume from checkpoint (/gsd:execute-plan .planning/phases/XX-name/.continue-here-02-01.md)
   OR
1. Execute next plan (/gsd:execute-plan .planning/phases/XX-name/02-02-PLAN.md)
   OR
1. Discuss Phase 3 context (/gsd:discuss-phase 3) [หาก CONTEXT.md ไม่มี]
   OR
1. Plan Phase 3 (/gsd:plan-phase 3) [หาก CONTEXT.md มีหรือปฏิเสธ discuss option]

[Secondary options:]
2. Review current phase status
3. Check deferred issues ([N] open)
4. Review brief alignment
5. Something else
```

**Note:** เมื่อเสนอ phase planning ตรวจสอบว่า CONTEXT.md มีก่อน:

```bash
ls .planning/phases/XX-name/CONTEXT.md 2>/dev/null
```

หากไม่มี แนะนำ discuss-phase ก่อน plan หากมี เสนอ plan โดยตรง

รอการเลือกของผู้ใช้
</step>

<step name="route_to_workflow">
ตามการเลือกของผู้ใช้ route ไป workflow ที่เหมาะสม:

- **Execute plan** → แสดง command สำหรับผู้ใช้ run หลัง clearing:
  ```
  ---

  ## ▶ ถัดไป

  **{phase}-{plan}: [Plan Name]** — [objective จาก PLAN.md]

  `/gsd:execute-plan [path]`

  <sub>`/clear` ก่อน → context window ใหม่</sub>

  ---
  ```
- **Plan phase** → แสดง command สำหรับผู้ใช้ run หลัง clearing:
  ```
  ---

  ## ▶ ถัดไป

  **Phase [N]: [Name]** — [Goal จาก ROADMAP.md]

  `/gsd:plan-phase [phase-number]`

  <sub>`/clear` ก่อน → context window ใหม่</sub>

  ---

  **ยังมีให้เลือก:**
  - `/gsd:discuss-phase [N]` — รวบรวม context ก่อน
  - `/gsd:research-phase [N]` — สืบค้นสิ่งที่ไม่รู้

  ---
  ```
- **Transition** → ./transition.md
- **Review issues** → อ่าน ISSUES.md แสดงสรุป
- **Review alignment** → อ่าน PROJECT.md เปรียบเทียบกับ current state
- **Something else** → ถามว่าต้องการอะไร
</step>

<step name="update_session">
ก่อนดำเนินการไป routed workflow อัปเดต session continuity:

อัปเดต STATE.md:

```markdown
## Session Continuity

Last session: [now]
Stopped at: Session resumed, proceeding to [action]
Resume file: [updated if applicable]
```

นี่รับประกันว่าหาก session จบโดยไม่คาดคิด next resume รู้ state
</step>

</process>

<reconstruction>
หาก STATE.md ไม่มีแต่ artifacts อื่นมี:

"STATE.md missing. Reconstructing from artifacts..."

1. อ่าน PROJECT.md → ดึง "What This Is" และ Core Value
2. อ่าน ROADMAP.md → กำหนด phases หา current position
3. Scan \*-SUMMARY.md files → ดึง decisions, issues, concerns
4. อ่าน ISSUES.md → นับ deferred issues
5. ตรวจสอบ .continue-here files → Session continuity

Reconstruct และเขียน STATE.md แล้วดำเนินการปกติ

นี่ handle กรณี:

- โปรเจกต์มีก่อน STATE.md introduction
- ไฟล์ถูกลบโดยบังเอิญ
- Cloning repo โดยไม่มี full .planning/ state
</reconstruction>

<quick_resume>
สำหรับผู้ใช้ที่ต้องการ friction น้อยที่สุด:

หากผู้ใช้พูดแค่ "continue" หรือ "go":

- โหลด state เงียบๆ
- กำหนด primary action
- Execute ทันทีโดยไม่แสดง options

"Continuing from [state]... [action]"

นี้เปิดใช้ fully autonomous "just keep going" workflow
</quick_resume>

<success_criteria>
Resume complete เมื่อ:

- [ ] STATE.md โหลด (หรือ reconstructed)
- [ ] Incomplete work ตรวจพบและ flagged
- [ ] Status ชัดเจนแสดงให้ผู้ใช้
- [ ] Contextual next actions เสนอ
- [ ] ผู้ใช้รู้ exactly ว่าโปรเจกต์อยู่ที่ไหน
- [ ] Session continuity อัปเดต
</success_criteria>
