---
name: gsd:progress
description: ตรวจสอบ project progress, แสดง context, และ route ไปยัง next action (execute หรือ plan)
allowed-tools:
  - Read
  - Bash
  - Grep
  - Glob
  - SlashCommand
---

<objective>
ตรวจสอบ project progress, สรุปงานล่าสุดและสิ่งที่อยู่ข้างหน้า จากนั้น route ไปยัง next action อย่างชาญฉลาด - ไม่ว่าจะ execute plan ที่มีอยู่หรือสร้าง plan ถัดไป

ให้ situational awareness ก่อนทำงานต่อ
</objective>


<process>

<step name="verify">
**ตรวจสอบว่ามี planning structure:**

ถ้าไม่มีโฟลเดอร์ `.planning/`:

```
ไม่พบ planning structure

รัน /gsd:new-project เพื่อเริ่มโปรเจคใหม่
```

ออกจากคำสั่ง

ถ้าไม่มี STATE.md หรือ ROADMAP.md: แจ้งว่าอะไรขาด แนะนำให้รัน `/gsd:new-project`
</step>

<step name="load">
**โหลด full project context:**

- อ่าน `.planning/STATE.md` สำหรับ living memory (position, decisions, issues)
- อ่าน `.planning/ROADMAP.md` สำหรับ phase structure และ objectives
- อ่าน `.planning/PROJECT.md` สำหรับ current state (What This Is, Core Value, Requirements)
  </step>

<step name="recent">
**รวบรวม recent work context:**

- หาไฟล์ SUMMARY.md 2-3 ไฟล์ล่าสุด
- ดึงจากแต่ละไฟล์: ทำอะไรเสร็จ, key decisions, issues ที่ logged
- นี่แสดง "เรากำลังทำอะไรอยู่"
  </step>

<step name="position">
**Parse current position:**

- จาก STATE.md: current phase, plan number, status
- คำนวณ: total plans, completed plans, remaining plans
- จด blockers, concerns, หรือ deferred issues
- ตรวจสอบ CONTEXT.md: สำหรับ phases ที่ไม่มีไฟล์ PLAN.md ตรวจว่ามี `{phase}-CONTEXT.md` ในโฟลเดอร์ phase
- นับ pending todos: `ls .planning/todos/pending/*.md 2>/dev/null | wc -l`
  </step>

<step name="report">
**แสดง rich status report:**

```
# [Project Name]

**Progress:** [████████░░] 8/10 plans complete

## งานล่าสุด
- [Phase X, Plan Y]: [ทำอะไรเสร็จ - 1 บรรทัด]
- [Phase X, Plan Z]: [ทำอะไรเสร็จ - 1 บรรทัด]

## ตำแหน่งปัจจุบัน
Phase [N] จาก [total]: [phase-name]
Plan [M] จาก [phase-total]: [status]
CONTEXT: [✓ ถ้ามี CONTEXT.md | - ถ้าไม่มี]

## Key Decisions ที่ตัดสินใจแล้ว
- [decision 1 จาก STATE.md]
- [decision 2]

## Open Issues
- [deferred issues หรือ blockers]

## Pending Todos
- [count] pending — /gsd:check-todos เพื่อ review

## ถัดไป
[Next phase/plan objective จาก ROADMAP]
```

</step>

<step name="route">
**กำหนด next action ตาม verified counts**

**Step 1: นับ plans, summaries, และ issues ใน current phase**

List files ในโฟลเดอร์ current phase:

```bash
ls -1 .planning/phases/[current-phase-dir]/*-PLAN.md 2>/dev/null | wc -l
ls -1 .planning/phases/[current-phase-dir]/*-SUMMARY.md 2>/dev/null | wc -l
ls -1 .planning/phases/[current-phase-dir]/*-ISSUES.md 2>/dev/null | wc -l
ls -1 .planning/phases/[current-phase-dir]/*-FIX.md 2>/dev/null | wc -l
ls -1 .planning/phases/[current-phase-dir]/*-FIX-SUMMARY.md 2>/dev/null | wc -l
```

ระบุ: "Phase นี้มี {X} plans, {Y} summaries, {Z} issues files, {W} fix plans"

**Step 1.5: ตรวจสอบ unaddressed UAT issues**

สำหรับแต่ละ *-ISSUES.md file ตรวจว่ามี matching *-FIX.md หรือไม่
สำหรับแต่ละ *-FIX.md file ตรวจว่ามี matching *-FIX-SUMMARY.md หรือไม่

Track:
- `issues_without_fix`: ISSUES.md files ที่ไม่มี FIX.md
- `fixes_without_summary`: FIX.md files ที่ไม่มี FIX-SUMMARY.md

**Step 2: Route ตาม counts**

| เงื่อนไข | ความหมาย | Action |
|-----------|---------|--------|
| fixes_without_summary > 0 | มี unexecuted fix plans | ไป **Route A** (ด้วย FIX.md) |
| issues_without_fix > 0 | UAT issues ต้องการ fix plans | ไป **Route E** |
| summaries < plans | มี unexecuted plans | ไป **Route A** |
| summaries = plans AND plans > 0 | Phase เสร็จ | ไป Step 3 |
| plans = 0 | Phase ยังไม่ได้ plan | ไป **Route B** |

---

**Route A: มี unexecuted plan**

หา PLAN.md แรกที่ไม่มี matching SUMMARY.md
อ่าน `<objective>` section ของมัน

```
---

## ▶ ถัดไป

**{phase}-{plan}: [Plan Name]** — [objective summary จาก PLAN.md]

`/gsd:execute-plan [full-path-to-PLAN.md]`

<sub>`/clear` ก่อน → เริ่ม context window ใหม่</sub>

---
```

---

**Route B: Phase ต้องการ planning**

ตรวจว่ามี `{phase}-CONTEXT.md` ในโฟลเดอร์ phase หรือไม่

**ถ้ามี CONTEXT.md:**

```
---

## ▶ ถัดไป

**Phase {N}: {Name}** — {Goal จาก ROADMAP.md}
<sub>✓ รวบรวม Context แล้ว พร้อม plan</sub>

`/gsd:plan-phase {phase-number}`

<sub>`/clear` ก่อน → เริ่ม context window ใหม่</sub>

---
```

**ถ้าไม่มี CONTEXT.md:**

```
---

## ▶ ถัดไป

**Phase {N}: {Name}** — {Goal จาก ROADMAP.md}

`/gsd:plan-phase {phase}`

<sub>`/clear` ก่อน → เริ่ม context window ใหม่</sub>

---

**ตัวเลือกอื่น:**
- `/gsd:discuss-phase {phase}` — รวบรวม context ก่อน
- `/gsd:research-phase {phase}` — ค้นคว้าสิ่งที่ไม่รู้
- `/gsd:list-phase-assumptions {phase}` — ดู assumptions ของ Claude

---
```

---

**Route E: UAT issues ต้องการ fix plans**

ISSUES.md มีอยู่แต่ไม่มี matching FIX.md ผู้ใช้ต้องวางแผนแก้ไข

```
---

## ⚠ พบ UAT Issues

**{plan}-ISSUES.md** มี {N} issues ที่ไม่มี fix plan

`/gsd:plan-fix {plan}`

<sub>`/clear` ก่อน → เริ่ม context window ใหม่</sub>

---

**ตัวเลือกอื่น:**
- `/gsd:execute-plan [path]` — ทำงานอื่นต่อก่อน
- `/gsd:verify-work {phase}` — รัน UAT testing เพิ่ม

---
```

---

**Step 3: ตรวจสอบ milestone status (เฉพาะเมื่อ phase เสร็จ)**

อ่าน ROADMAP.md และระบุ:
1. Current phase number
2. Phase numbers ทั้งหมดใน current milestone section

นับ total phases และระบุ highest phase number

ระบุ: "Current phase คือ {X} Milestone มี {N} phases (highest: {Y})"

**Route ตาม milestone status:**

| เงื่อนไข | ความหมาย | Action |
|-----------|---------|--------|
| current phase < highest phase | ยังมี phases เหลือ | ไป **Route C** |
| current phase = highest phase | Milestone เสร็จ | ไป **Route D** |

---

**Route C: Phase เสร็จ ยังมี phases เหลือ**

อ่าน ROADMAP.md เพื่อดูชื่อและ goal ของ phase ถัดไป

```
---

## ✓ Phase {Z} เสร็จแล้ว

## ▶ ถัดไป

**Phase {Z+1}: {Name}** — {Goal จาก ROADMAP.md}

`/gsd:plan-phase {Z+1}`

<sub>`/clear` ก่อน → เริ่ม context window ใหม่</sub>

---

**ตัวเลือกอื่น:**
- `/gsd:verify-work {Z}` — user acceptance test ก่อนทำต่อ
- `/gsd:discuss-phase {Z+1}` — รวบรวม context ก่อน
- `/gsd:research-phase {Z+1}` — ค้นคว้าสิ่งที่ไม่รู้

---
```

---

**Route D: Milestone เสร็จ**

```
---

## 🎉 Milestone เสร็จแล้ว

{N} phases ทั้งหมดเสร็จแล้ว!

## ▶ ถัดไป

**Complete Milestone** — archive และเตรียมสำหรับถัดไป

`/gsd:complete-milestone`

<sub>`/clear` ก่อน → เริ่ม context window ใหม่</sub>

---

**ตัวเลือกอื่น:**
- `/gsd:verify-work` — user acceptance test ก่อน complete milestone

---
```

</step>

<step name="edge_cases">
**จัดการ edge cases:**

- Phase เสร็จแต่ next phase ยังไม่ได้ plan → เสนอ `/gsd:plan-phase [next]`
- งานทั้งหมดเสร็จ → เสนอ milestone completion
- มี blockers → highlight ก่อนเสนอให้ทำต่อ
- มี handoff file → พูดถึงมัน เสนอ `/gsd:resume-work`
  </step>

</process>

<success_criteria>

- [ ] ให้ rich context (recent work, decisions, issues)
- [ ] Current position ชัดเจนพร้อม visual progress
- [ ] อธิบายสิ่งที่ต้องทำถัดไปชัดเจน
- [ ] Smart routing: /gsd:execute-plan ถ้ามี plan, /gsd:plan-phase ถ้าไม่มี
- [ ] ผู้ใช้ยืนยันก่อน action ใดๆ
- [ ] Seamless handoff ไปยัง gsd command ที่เหมาะสม
      </success_criteria>
