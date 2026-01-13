---
name: gsd:consider-issues
description: Review issues ที่เลื่อนไว้พร้อม codebase context, ปิด issues ที่แก้แล้ว, ระบุ issues ที่เร่งด่วน
allowed-tools:
  - Read
  - Bash
  - Grep
  - Glob
  - Edit
  - AskUserQuestion
  - SlashCommand
---

<objective>
Review open issues ทั้งหมดจาก ISSUES.md พร้อม codebase context ปัจจุบัน ระบุว่า issues ไหนแก้แล้ว (ปิดได้), ไหนเร่งด่วนแล้ว (ควรจัดการ), และไหนรอต่อได้

ป้องกันการสะสม issues โดยมีกลไก triage พร้อม codebase awareness
</objective>

<context>
@.planning/ISSUES.md
@.planning/STATE.md
@.planning/ROADMAP.md
</context>

<process>

<step name="verify">
**ตรวจสอบว่ามีไฟล์ issues:**

ถ้าไม่มี `.planning/ISSUES.md`:
```
ไม่พบไฟล์ issues

หมายความว่ายังไม่มี enhancements ที่ถูกเลื่อนไว้ (Rule 5 ยังไม่ trigger)

ไม่มีอะไรให้ review
```
ออกจากคำสั่ง

ถ้า ISSUES.md มีอยู่แต่ไม่มี open issues (มีแค่ template หรือ "Open Enhancements" ว่างเปล่า):
```
ไม่มี open issues ให้ review

ว่างหมด - ทำงานปัจจุบันต่อได้
```
ออกจากคำสั่ง
</step>

<step name="parse">
**Parse open issues ทั้งหมด:**

ดึงจาก "## Open Enhancements" section:
- ISS number (ISS-001, ISS-002, etc.)
- คำอธิบายสั้น
- Phase/date ที่ค้นพบ
- Type (Performance/Refactoring/UX/Testing/Documentation/Accessibility)
- รายละเอียดคำอธิบาย
- Effort estimate

สร้างรายการ issues ที่จะวิเคราะห์
</step>

<step name="analyze">
**สำหรับแต่ละ open issue ทำการวิเคราะห์ codebase:**

1. **ตรวจสอบว่ายังเกี่ยวข้อง:**
   - ค้นหา codebase สำหรับ code/files ที่เกี่ยวข้องที่กล่าวถึงใน issue
   - ถ้า code ไม่มีอยู่แล้วหรือถูก refactor อย่างมาก: น่าจะแก้แล้ว

2. **ตรวจสอบว่าแก้โดยบังเอิญ:**
   - ดู commits/changes ที่อาจ address เรื่องนี้แล้ว
   - ตรวจสอบว่า enhancement ถูก implement เป็นส่วนหนึ่งของงานอื่นหรือไม่

3. **ประเมินความเร่งด่วนปัจจุบัน:**
   - กำลัง block phases ที่จะทำหรือไม่?
   - กลายเป็น pain point ที่กล่าวถึงใน summaries ล่าสุดหรือไม่?
   - กำลังส่งผลกระทบต่อ code ที่เรากำลังทำอยู่หรือไม่?

4. **ตรวจสอบ natural fit:**
   - ตรงกับ phase ที่จะทำใน roadmap หรือไม่?
   - การ address ตอนนี้จะแตะไฟล์เดียวกับงานปัจจุบันหรือไม่?

**จัดหมวดแต่ละ issue:**
- **Resolved** - ปิดได้ (code เปลี่ยน, ไม่ applicable แล้ว)
- **Urgent** - ควร address ก่อนทำต่อ (blocking หรือสร้างปัญหา)
- **Natural fit** - ตัวเลือกที่ดีสำหรับ Phase X ที่จะทำ
- **Can wait** - เลื่อนต่อได้ ไม่มีการเปลี่ยนแปลงสถานะ
</step>

<step name="report">
**แสดงรายงานที่จัดหมวดแล้ว:**

```
# Issue Review

**วิเคราะห์แล้ว:** [N] open issues
**Review ล่าสุด:** [วันนี้]

## Resolved (ปิดได้)

### ISS-XXX: [description]
**เหตุผล:** [ทำไมถึงแก้แล้ว - code เปลี่ยน, implement ที่อื่น, ไม่ applicable แล้ว]
**หลักฐาน:** [ที่พบ - file changes, missing code, etc.]

[ทำซ้ำสำหรับแต่ละ resolved issue, หรือ "ไม่มี" ถ้าไม่มี]

---

## Urgent (ควร address ตอนนี้)

### ISS-XXX: [description]
**ทำไมเร่งด่วน:** [อะไรเปลี่ยน - blocking next phase, สร้างปัญหาอยู่, etc.]
**คำแนะนำ:** Insert plan ก่อน Phase [X] / เพิ่มใน phase ปัจจุบัน
**Effort:** [Quick/Medium/Substantial]

[ทำซ้ำสำหรับแต่ละ urgent issue, หรือ "ไม่มี - issues ทั้งหมดรอได้" ถ้าไม่มี]

---

## Natural Fit สำหรับงานที่จะทำ

### ISS-XXX: [description]
**เหมาะกับ:** Phase [X] - [phase name]
**เหตุผล:** [ไฟล์เดียวกัน, subsystem เดียวกัน, รวมได้เป็นธรรมชาติ]

[ทำซ้ำสำหรับแต่ละ, หรือ "ไม่มี" ถ้าไม่มี]

---

## Can Wait (ไม่มีการเปลี่ยนแปลง)

### ISS-XXX: [description]
**สถานะ:** ยังคง valid, ไม่เร่งด่วน, เลื่อนต่อได้

[ทำซ้ำสำหรับแต่ละ, หรือแสดง ISS numbers ถ้ามีเยอะ]
```
</step>

<step name="offer_actions">
**เสนอ batch actions:**

ตาม analysis เสนอ options:

```
## Actions

ต้องการทำอะไร?
```

ใช้ AskUserQuestion พร้อม options ที่เหมาะสมตามผลที่พบ:

**ถ้ามี resolved issues:**
- "ปิด resolved issues" - ย้ายไป Closed Enhancements section
- "ดูรายละเอียดก่อน" - แสดง details ก่อนปิด

**ถ้ามี urgent issues:**
- "Insert urgent phase" - สร้าง phase เพื่อ address urgent issues (/gsd:insert-phase)
- "เพิ่มใน plan ปัจจุบัน" - รวมใน plan ที่กำลังสร้าง
- "เลื่อนอยู่ดี" - เก็บไว้เหมือนเดิมแม้จะเร่งด่วน

**ถ้ามี natural fits:**
- "จดไว้สำหรับ phase planning" - จะถูกหยิบขึ้นมาระหว่าง /gsd:plan-phase
- "เพิ่ม reminder ชัดเจน" - อัพเดท issue ด้วย "Include in Phase X"

**รวมเสมอ:**
- "เสร็จสำหรับตอนนี้" - ออกโดยไม่เปลี่ยนแปลง
</step>

<step name="execute_actions">
**ดำเนินการ actions ที่เลือก:**

**ถ้าปิด resolved issues:**
1. อ่าน ISSUES.md ปัจจุบัน
2. สำหรับแต่ละ resolved issue:
   - ลบจาก "## Open Enhancements"
   - เพิ่มใน "## Closed Enhancements" พร้อม resolution note:
     ```
     ### ISS-XXX: [description]
     **Resolved:** [date] - [reason]
     ```
3. เขียน ISSUES.md ที่อัพเดท
4. อัพเดท STATE.md deferred issues count

**ถ้า insert urgent phase:**
- แสดงคำสั่งให้ผู้ใช้รันหลัง clear: `/gsd:insert-phase [after-phase] Address urgent issues ISS-XXX, ISS-YYY`

**ถ้าจดไว้สำหรับ phase planning:**
- อัพเดท "Suggested phase" field ของ issue ด้วย phase number เฉพาะ
- เหล่านี้จะถูกหยิบโดย /gsd:plan-phase workflow
</step>

</process>

<success_criteria>
- [ ] วิเคราะห์ open issues ทั้งหมดกับ codebase ปัจจุบัน
- [ ] จัดหมวดแต่ละ issue (resolved/urgent/natural-fit/can-wait)
- [ ] ให้เหตุผลชัดเจนสำหรับแต่ละการจัดหมวด
- [ ] เสนอ actions ตามผลที่พบ
- [ ] อัพเดท ISSUES.md ถ้าผู้ใช้ดำเนินการ
- [ ] อัพเดท STATE.md ถ้า issue count เปลี่ยน
</success_criteria>
