---
name: gsd:list-phase-assumptions
description: แสดง assumptions ของ Claude เกี่ยวกับ approach ของ phase ก่อนวางแผน
argument-hint: "[phase]"
allowed-tools:
  - Read
  - Bash
  - Grep
  - Glob
---

<objective>
วิเคราะห์ phase และแสดง assumptions ของ Claude เกี่ยวกับ technical approach, implementation order, scope boundaries, risk areas, และ dependencies

วัตถุประสงค์: ช่วยผู้ใช้เห็นว่า Claude คิดอะไรก่อนเริ่มวางแผน — เปิดให้ course correct ได้แต่เนิ่นๆ เมื่อ assumptions ผิด
Output: Conversational output เท่านั้น (ไม่สร้างไฟล์) - จบด้วย "คุณคิดอย่างไร?" prompt
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/list-phase-assumptions.md
</execution_context>

<context>
Phase number: $ARGUMENTS (required)

**โหลด project state ก่อน:**
@.planning/STATE.md

**โหลด roadmap:**
@.planning/ROADMAP.md
</context>

<process>
1. ตรวจสอบ phase number argument (error ถ้าไม่มีหรือไม่ถูกต้อง)
2. ตรวจสอบว่า phase มีอยู่ใน roadmap
3. ทำตาม list-phase-assumptions.md workflow:
   - วิเคราะห์คำอธิบาย roadmap
   - แสดง assumptions เกี่ยวกับ: technical approach, implementation order, scope, risks, dependencies
   - แสดง assumptions อย่างชัดเจน
   - Prompt "คุณคิดอย่างไร?"
4. รวบรวม feedback และเสนอขั้นตอนถัดไป
</process>

<success_criteria>

- ตรวจสอบ phase กับ roadmap แล้ว
- แสดง assumptions ครบทั้ง 5 areas
- Prompt ผู้ใช้ให้ feedback แล้ว
- ผู้ใช้รู้ขั้นตอนถัดไป (discuss context, plan phase, หรือ correct assumptions)
  </success_criteria>
