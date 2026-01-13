---
name: gsd:execute-plan
description: Execute ไฟล์ PLAN.md
argument-hint: "[path-to-PLAN.md]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
  - AskUserQuestion
  - SlashCommand
---

<objective>
Execute ไฟล์ PLAN.md พร้อม atomic commits ต่อ task สร้าง SUMMARY.md อัพเดท project state

Commit strategy:
- แต่ละ task → 1 commit ทันทีหลังเสร็จ (feat/fix/test/refactor)
- Plan completion → 1 metadata commit (docs: SUMMARY + STATE + ROADMAP)

ใช้ intelligent segmentation:
- Plans ไม่มี checkpoints → spawn subagent สำหรับ full autonomous execution
- Plans มี verify checkpoints → segment execution, หยุดที่ checkpoints
- Plans มี decision checkpoints → execute ใน main context
  </objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-phase.md
@~/.claude/get-shit-done/templates/summary.md
@~/.claude/get-shit-done/references/checkpoints.md
@~/.claude/get-shit-done/references/tdd.md
</execution_context>

<context>
Plan path: $ARGUMENTS

**โหลด project state ก่อน:**
@.planning/STATE.md

**โหลด workflow config:**
@.planning/config.json
</context>

<process>
1. ตรวจสอบว่ามีโฟลเดอร์ .planning/ (error ถ้าไม่มี - ผู้ใช้ควรรัน /gsd:new-project)
2. ตรวจสอบว่า plan ที่ $ARGUMENTS มีอยู่
3. ตรวจสอบว่า SUMMARY.md มีอยู่แล้วหรือไม่ (plan executed แล้ว?)
4. โหลด workflow config สำหรับ mode (interactive/yolo)
5. ทำตาม execute-phase.md workflow:
   - Parse plan และกำหนด execution strategy (A/B/C)
   - Execute tasks (ผ่าน subagent หรือ main context ตามความเหมาะสม)
   - จัดการ checkpoints และ deviations
   - สร้าง SUMMARY.md
   - อัพเดท STATE.md
   - Commit changes
</process>

<execution_strategies>
**Strategy A: Fully Autonomous** (ไม่มี checkpoints)

- Spawn subagent เพื่อ execute plan ทั้งหมด
- Subagent สร้าง SUMMARY.md และ commits
- Main context: orchestration เท่านั้น (~5% usage)

**Strategy B: Segmented** (มีแค่ verify checkpoints)

- Execute เป็น segments ระหว่าง checkpoints
- Subagent สำหรับ autonomous segments
- Main context สำหรับ checkpoints
- รวมผลลัพธ์ → SUMMARY → commit

**Strategy C: Decision-Dependent** (มี decision checkpoints)

- Execute ใน main context
- Decision outcomes ส่งผลต่อ tasks ถัดไป
- คุณภาพรักษาไว้ด้วย scope เล็ก (2-3 tasks ต่อ plan)
  </execution_strategies>

<deviation_rules>
ระหว่าง execution จัดการ discoveries โดยอัตโนมัติ:

1. **Auto-fix bugs** - แก้ทันที บันทึกใน Summary
2. **Auto-add critical** - Security/correctness gaps เพิ่มและบันทึก
3. **Auto-fix blockers** - ดำเนินการต่อไม่ได้โดยไม่แก้ ทำแล้วบันทึก
4. **Ask about architectural** - Major structural changes หยุดและถามผู้ใช้
5. **Log enhancements** - Nice-to-haves log ไปยัง ISSUES.md ทำต่อ

เฉพาะ rule 4 ต้องการ user intervention
</deviation_rules>

<commit_rules>
**Per-Task Commits:**

หลังจากแต่ละ task เสร็จ:
1. Stage เฉพาะไฟล์ที่แก้ไขโดย task นั้น
2. Commit ด้วย format: `{type}({phase}-{plan}): {task-name}`
3. Types: feat, fix, test, refactor, perf, chore
4. บันทึก commit hash สำหรับ SUMMARY.md

**Plan Metadata Commit:**

หลังจากทุก tasks เสร็จ:
1. Stage planning artifacts เท่านั้น: PLAN.md, SUMMARY.md, STATE.md, ROADMAP.md
2. Commit ด้วย format: `docs({phase}-{plan}): complete [plan-name] plan`
3. ไม่มี code files (committed per-task แล้ว)

**ห้ามใช้:**
- `git add .`
- `git add -A`
- `git add src/` หรือ directory กว้างๆ

**Stage files ทีละไฟล์เสมอ**

ดู ~/.claude/get-shit-done/references/git-integration.md สำหรับ commit strategy ทั้งหมด
</commit_rules>

<success_criteria>

- [ ] Execute tasks ทั้งหมดแล้ว
- [ ] Commit แต่ละ task แยกกัน (feat/fix/test/refactor)
- [ ] สร้าง SUMMARY.md ด้วยเนื้อหาสาระสำคัญและ commit hashes
- [ ] อัพเดท STATE.md (position, decisions, issues, session)
- [ ] อัพเดท ROADMAP (plan count, phase status)
- [ ] Commit metadata ด้วย docs({phase}-{plan}): complete [plan-name] plan
- [ ] แจ้งผู้ใช้เรื่องขั้นตอนถัดไป
      </success_criteria>
