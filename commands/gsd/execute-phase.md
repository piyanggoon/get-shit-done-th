---
name: gsd:execute-phase
description: ดำเนินการแผนทั้งหมดในเฟสด้วย intelligent parallelization
argument-hint: "<phase-number>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
  - TaskOutput
  - AskUserQuestion
  - SlashCommand
---

<objective>
ดำเนินการแผนที่ยังไม่ได้ดำเนินการทั้งหมดในเฟสด้วย parallel agent spawning

วิเคราะห์ plan dependencies เพื่อระบุแผนอิสระที่สามารถรันพร้อมกันได้
Spawn background agents สำหรับ parallel execution แต่ละ agent commit tasks ของตัวเองแบบ atomic

**Critical constraint:** หนึ่ง subagent ต่อหนึ่งแผน เสมอ นี่เป็นสำหรับ context isolation ไม่ใช่ parallelization แม้แผนที่ strictly sequential ก็ spawn subagents แยกเพื่อให้แต่ละตัวเริ่มต้นด้วย 200k context ที่ 0%

ใช้คำสั่งนี้เมื่อ:
- เฟสมี 2+ แผนที่ยังไม่ได้ดำเนินการ
- ต้องการการดำเนินการแบบ "walk away, come back to completed work"
- แผนมี dependency boundaries ที่ชัดเจน
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/workflows/execute-phase.md
@~/.claude/get-shit-done/templates/summary.md
@~/.claude/get-shit-done/references/checkpoints.md
@~/.claude/get-shit-done/references/tdd.md
</execution_context>

<context>
Phase number: $ARGUMENTS (required)

@.planning/STATE.md
@.planning/config.json
</context>

<process>
1. Validate เฟสมีอยู่ใน roadmap
2. หาไฟล์ PLAN.md ทั้งหมดที่ไม่มี SUMMARY.md ที่ตรงกัน
3. ถ้า 0 หรือ 1 แผน: แนะนำ /gsd:execute-plan แทน
4. ถ้า 2+ แผน: ทำตาม execute-phase.md workflow
5. Monitor parallel agents จนกว่าจะเสร็จ
6. แสดงผลลัพธ์และขั้นตอนถัดไป
</process>

<execution_strategies>
**Strategy A: Fully Autonomous** (ไม่มี checkpoints)

- Spawn subagent เพื่อดำเนินการแผนทั้งหมด
- Subagent สร้าง SUMMARY.md และ commits
- Main context: orchestration เท่านั้น (~5% usage)

**Strategy B: Segmented** (มี verify-only checkpoints)

- ดำเนินการเป็นส่วนๆ ระหว่าง checkpoints
- Subagent สำหรับส่วน autonomous
- Main context สำหรับ checkpoints
- รวมผลลัพธ์ → SUMMARY → commit

**Strategy C: Decision-Dependent** (มี decision checkpoints)

- ดำเนินการใน main context
- Decision outcomes มีผลต่อ tasks ถัดไป
- คุณภาพรักษาไว้ผ่านขอบเขตเล็ก (2-3 tasks ต่อแผน)
</execution_strategies>

<deviation_rules>
ระหว่างการดำเนินการ จัดการการค้นพบโดยอัตโนมัติ:

1. **Auto-fix bugs** - แก้ไขทันที บันทึกใน Summary
2. **Auto-add critical** - ช่องว่างด้านความปลอดภัย/ความถูกต้อง เพิ่มและบันทึก
3. **Auto-fix blockers** - ไม่สามารถดำเนินการต่อโดยไม่แก้ไข ทำและบันทึก
4. **Ask about architectural** - การเปลี่ยนแปลงโครงสร้างหลัก หยุดและถาม user
5. **Log enhancements** - Nice-to-haves บันทึกใน ISSUES.md ดำเนินการต่อ

เฉพาะ rule 4 เท่านั้นที่ต้องการการตอบสนองจาก user
</deviation_rules>

<commit_rules>
**Per-Task Commits:**

หลังแต่ละ task เสร็จ:
1. Stage เฉพาะไฟล์ที่ถูกแก้ไขโดย task นั้น
2. Commit ด้วยรูปแบบ: `{type}({phase}-{plan}): {task-name}`
3. Types: feat, fix, test, refactor, perf, chore
4. บันทึก commit hash สำหรับ SUMMARY.md

**Plan Metadata Commit:**

หลัง tasks ทั้งหมดเสร็จ:
1. Stage planning artifacts เท่านั้น: PLAN.md, SUMMARY.md, STATE.md, ROADMAP.md
2. Commit ด้วยรูปแบบ: `docs({phase}-{plan}): complete [plan-name] plan`
3. ไม่มีไฟล์โค้ด (committed แล้วต่อ task)

**ห้ามใช้:**
- `git add .`
- `git add -A`
- `git add src/` หรือ directory กว้างๆ ใดๆ

**Stage ไฟล์ทีละไฟล์เสมอ**
</commit_rules>

<success_criteria>
- [ ] แผนอิสระทั้งหมดถูกดำเนินการแบบ parallel
- [ ] แผนที่ขึ้นต่อกันถูกดำเนินการหลัง dependencies เสร็จ
- [ ] แต่ละ task ถูก commit ทีละตัว (feat/fix/test/refactor)
- [ ] ไฟล์ SUMMARY.md ทั้งหมดถูกสร้าง
- [ ] Metadata ถูก committed โดย orchestrator
- [ ] Phase progress ถูกอัพเดท
</success_criteria>
