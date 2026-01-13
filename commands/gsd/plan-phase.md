---
name: gsd:plan-phase
description: สร้าง detailed execution plan สำหรับ phase (PLAN.md)
argument-hint: "[phase]"
allowed-tools:
  - Read
  - Bash
  - Write
  - Glob
  - Grep
  - AskUserQuestion
  - WebFetch
  - mcp__context7__*
---

<objective>
สร้าง executable phase prompt พร้อม discovery, context injection, และ task breakdown

วัตถุประสงค์: แบ่ง roadmap phases เป็น concrete, executable PLAN.md files ที่ Claude สามารถ execute ได้
Output: ไฟล์ PLAN.md หนึ่งหรือหลายไฟล์ในโฟลเดอร์ phase (.planning/phases/XX-name/{phase}-{plan}-PLAN.md)
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/plan-phase.md
@~/.claude/get-shit-done/templates/phase-prompt.md
@~/.claude/get-shit-done/references/plan-format.md
@~/.claude/get-shit-done/references/scope-estimation.md
@~/.claude/get-shit-done/references/checkpoints.md
@~/.claude/get-shit-done/references/tdd.md
</execution_context>

<context>
Phase number: $ARGUMENTS (optional - auto-detects next unplanned phase ถ้าไม่ระบุ)

**โหลด project state ก่อน:**
@.planning/STATE.md

**โหลด roadmap:**
@.planning/ROADMAP.md

**โหลด phase context ถ้ามี (สร้างโดย /gsd:discuss-phase):**
ตรวจสอบและอ่าน `.planning/phases/XX-name/{phase}-CONTEXT.md` - มี research findings, clarifications, และ decisions จาก phase discussion

**โหลด codebase context ถ้ามี:**
ตรวจสอบ `.planning/codebase/` และโหลด documents ที่เกี่ยวข้องตาม phase type
</context>

<process>
1. ตรวจสอบว่ามีโฟลเดอร์ .planning/ (error ถ้าไม่มี - ผู้ใช้ควรรัน /gsd:new-project)
2. ถ้าระบุ phase number ผ่าน $ARGUMENTS ตรวจสอบว่ามีอยู่ใน roadmap
3. ถ้าไม่มี phase number ตรวจจับ next unplanned phase จาก roadmap
4. ทำตาม plan-phase.md workflow:
   - โหลด project state และ accumulated decisions
   - ทำ mandatory discovery (Level 0-3 ตามความเหมาะสม)
   - อ่าน project history (prior decisions, issues, concerns)
   - แบ่ง phase เป็น tasks
   - Estimate scope และแยกเป็นหลาย plans ถ้าต้องการ
   - สร้างไฟล์ PLAN.md ด้วย executable structure
</process>

<success_criteria>

- สร้างไฟล์ PLAN.md หนึ่งหรือหลายไฟล์ใน .planning/phases/XX-name/
- แต่ละ plan มี: objective, execution_context, context, tasks, verification, success_criteria, output
- Tasks specific พอที่ Claude จะ execute ได้
- ผู้ใช้รู้ขั้นตอนถัดไป (execute plan หรือ review/adjust)
  </success_criteria>
