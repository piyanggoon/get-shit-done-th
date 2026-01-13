---
name: gsd:resume-work
description: Resume work จาก session ก่อนหน้าพร้อม full context restoration
allowed-tools:
  - Read
  - Bash
  - Write
  - AskUserQuestion
  - SlashCommand
---

<objective>
Restore project context ทั้งหมดและ resume work อย่างราบรื่นจาก session ก่อนหน้า

Routes ไปยัง resume-project workflow ซึ่งจัดการ:

- โหลด STATE.md (หรือ reconstruct ถ้าไม่มี)
- ตรวจจับ checkpoints (ไฟล์ .continue-here)
- ตรวจจับงานที่ไม่เสร็จ (PLAN ที่ไม่มี SUMMARY)
- แสดง status
- เสนอ next action ตาม context (ตรวจ CONTEXT.md ก่อนแนะนำ plan vs discuss)
- Routing ไปยัง command ถัดไปที่เหมาะสม
- อัพเดท session continuity
  </objective>

<execution_context>
@~/.claude/get-shit-done/workflows/resume-project.md
</execution_context>

<process>
**ทำตาม resume-project workflow** จาก `@~/.claude/get-shit-done/workflows/resume-project.md`

Workflow จัดการ resumption logic ทั้งหมดรวมถึง:

1. ตรวจสอบว่ามีโปรเจค
2. โหลดหรือ reconstruct STATE.md
3. ตรวจจับ checkpoints และงานที่ไม่เสร็จ
4. แสดง visual status
5. เสนอ options ตาม context (ตรวจ CONTEXT.md ก่อนแนะนำ plan vs discuss)
6. Routing ไปยัง command ถัดไปที่เหมาะสม
7. อัพเดท session continuity
   </process>
