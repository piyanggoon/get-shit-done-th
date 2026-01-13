---
name: gsd:new-milestone
description: สร้าง milestone ใหม่พร้อม phases สำหรับโปรเจคที่มีอยู่
argument-hint: "[milestone name, เช่น 'v2.0 Features']"
---

<objective>
สร้าง milestone ใหม่สำหรับโปรเจคที่มีอยู่พร้อม phases ที่กำหนด

วัตถุประสงค์: หลังจาก milestone เสร็จ (หรือเมื่อพร้อมกำหนดงาน chunk ถัดไป) สร้าง milestone structure ใน ROADMAP.md พร้อม phases, อัพเดท STATE.md, และสร้างโฟลเดอร์ phase
Output: Milestone ใหม่ใน ROADMAP.md, อัพเดท STATE.md, สร้างโฟลเดอร์ phase แล้ว
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/create-milestone.md
@~/.claude/get-shit-done/templates/roadmap.md
</execution_context>

<context>
Milestone name: $ARGUMENTS (optional - จะ prompt ถ้าไม่ระบุ)

**โหลด project state ก่อน:**
@.planning/STATE.md

**โหลด roadmap:**
@.planning/ROADMAP.md

**โหลด milestones (ถ้ามี):**
@.planning/MILESTONES.md
</context>

<process>
1. โหลด project context (STATE.md, ROADMAP.md, MILESTONES.md)
2. คำนวณ milestone version ถัดไปและ starting phase number
3. ถ้าระบุ milestone name ใน arguments ใช้เลย ไม่งั้น prompt
4. รวบรวม phases (ตาม depth setting: quick 3-5, standard 5-8, comprehensive 8-12):
   - ถ้าเรียกจาก /gsd:discuss-milestone ใช้ context ที่ให้มา
   - ไม่งั้น prompt สำหรับ phase breakdown
5. ตรวจจับ research needs สำหรับแต่ละ phase
6. ยืนยัน phases (ตาม config.json gate settings)
7. ทำตาม create-milestone.md workflow:
   - อัพเดท ROADMAP.md ด้วย milestone section ใหม่
   - สร้างโฟลเดอร์ phase
   - อัพเดท STATE.md สำหรับ milestone ใหม่
   - Git commit milestone creation
8. เสนอขั้นตอนถัดไป (discuss first phase, plan first phase, review)
</process>

<success_criteria>

- คำนวณ next phase number ถูกต้อง (ต่อจาก milestone ก่อนหน้า)
- กำหนด phases ตาม depth setting (quick: 3-5, standard: 5-8, comprehensive: 8-12)
- กำหนด research flags สำหรับแต่ละ phase
- อัพเดท ROADMAP.md ด้วย milestone section ใหม่
- สร้างโฟลเดอร์ phase แล้ว
- Reset STATE.md สำหรับ milestone ใหม่
- Git commit แล้ว
- ผู้ใช้รู้ขั้นตอนถัดไป
  </success_criteria>
