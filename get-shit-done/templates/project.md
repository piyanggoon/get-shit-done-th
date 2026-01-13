# เทมเพลต PROJECT.md

เทมเพลตสำหรับ `.planning/PROJECT.md` — เอกสาร project context ที่ยังมีชีวิต

<template>

```markdown
# [ชื่อโปรเจกต์]

## นี่คืออะไร

[คำอธิบายปัจจุบันที่ถูกต้อง — 2-3 ประโยค ผลิตภัณฑ์นี้ทำอะไรและสำหรับใคร?
ใช้ภาษาและกรอบของผู้ใช้ อัปเดตเมื่อความเป็นจริงเบี่ยงเบนจากคำอธิบายนี้]

## คุณค่าหลัก

[สิ่งหนึ่งที่สำคัญที่สุด ถ้าทุกอย่างล้มเหลว สิ่งนี้ต้องทำงาน
หนึ่งประโยคที่ขับเคลื่อนการจัดลำดับความสำคัญเมื่อเกิด tradeoffs]

## Requirements

### Validated

<!-- Shipped และยืนยันว่ามีคุณค่า -->

(ยังไม่มี — ship เพื่อ validate)

### Active

<!-- Scope ปัจจุบัน กำลังสร้างไปสู่สิ่งเหล่านี้ -->

- [ ] [Requirement 1]
- [ ] [Requirement 2]
- [ ] [Requirement 3]

### Out of Scope

<!-- ขอบเขตที่ชัดเจน รวมเหตุผลเพื่อป้องกันการเพิ่มกลับ -->

- [Exclusion 1] — [ทำไม]
- [Exclusion 2] — [ทำไม]

## Context

[ข้อมูลพื้นฐานที่แจ้ง implementation:
- Technical environment หรือ ecosystem
- งานก่อนหน้าหรือประสบการณ์ที่เกี่ยวข้อง
- User research หรือ feedback themes
- ปัญหาที่รู้จักที่ต้องแก้ไข]

## ข้อจำกัด

- **[ประเภท]**: [อะไร] — [ทำไม]
- **[ประเภท]**: [อะไร] — [ทำไม]

ประเภททั่วไป: Tech stack, Timeline, Budget, Dependencies, Compatibility, Performance, Security

## การตัดสินใจสำคัญ

<!-- การตัดสินใจที่จำกัดงานในอนาคต เพิ่มตลอดวงจรชีวิตโปรเจกต์ -->

| การตัดสินใจ | เหตุผล | ผลลัพธ์ |
|----------|-----------|---------|
| [ตัวเลือก] | [ทำไม] | [✓ ดี / ⚠️ ทบทวน / — รอดำเนินการ] |

---
*อัปเดตล่าสุด: [วันที่] หลังจาก [trigger]*
```

</template>

<guidelines>

**นี่คืออะไร:**
- คำอธิบายปัจจุบันที่ถูกต้องของผลิตภัณฑ์
- 2-3 ประโยคที่จับใจความว่าทำอะไรและสำหรับใคร
- ใช้คำพูดและกรอบของผู้ใช้
- อัปเดตเมื่อผลิตภัณฑ์พัฒนาเกินกว่าคำอธิบายนี้

**คุณค่าหลัก:**
- สิ่งหนึ่งที่สำคัญที่สุด
- ทุกอย่างอื่นล้มเหลวได้ แต่สิ่งนี้ไม่ได้
- ขับเคลื่อนการจัดลำดับความสำคัญเมื่อเกิด tradeoffs
- ไม่ค่อยเปลี่ยน ถ้าเปลี่ยนแสดงว่า pivot สำคัญ

**Requirements — Validated:**
- Requirements ที่ shipped และพิสูจน์แล้วว่ามีคุณค่า
- รูปแบบ: `- ✓ [Requirement] — [version/phase]`
- สิ่งเหล่านี้ถูก lock — การเปลี่ยนต้องมีการสนทนาชัดเจน

**Requirements — Active:**
- Scope ปัจจุบันที่กำลังสร้างไปสู่
- สิ่งเหล่านี้เป็นสมมติฐานจนกว่าจะ shipped และ validated
- ย้ายไป Validated เมื่อ shipped, Out of Scope ถ้า invalidated

**Requirements — Out of Scope:**
- ขอบเขตชัดเจนของสิ่งที่เราไม่สร้าง
- รวมเหตุผลเสมอ (ป้องกันการเพิ่มกลับทีหลัง)
- รวม: พิจารณาและปฏิเสธ เลื่อนไปอนาคต excluded อย่างชัดเจน

**Context:**
- พื้นฐานที่แจ้ง implementation decisions
- Technical environment งานก่อนหน้า user feedback
- ปัญหาที่รู้จักหรือ technical debt ที่ต้องแก้ไข
- อัปเดตเมื่อ context ใหม่เกิดขึ้น

**ข้อจำกัด:**
- ขีดจำกัดที่แข็งแกร่งต่อ implementation choices
- Tech stack, timeline, budget, compatibility, dependencies
- รวม "ทำไม" — ข้อจำกัดที่ไม่มีเหตุผลจะถูกตั้งคำถาม

**การตัดสินใจสำคัญ:**
- ตัวเลือกสำคัญที่ส่งผลต่องานในอนาคต
- เพิ่มการตัดสินใจตามที่ทำตลอดโปรเจกต์
- ติดตามผลลัพธ์เมื่อรู้:
  - ✓ ดี — การตัดสินใจพิสูจน์ว่าถูกต้อง
  - ⚠️ ทบทวน — การตัดสินใจอาจต้องพิจารณาใหม่
  - — รอดำเนินการ — เร็วเกินไปที่จะประเมิน

**อัปเดตล่าสุด:**
- บันทึกเสมอว่าเมื่อไหร่และทำไมเอกสารถูกอัปเดต
- รูปแบบ: `หลังจากเฟส 2` หรือ `หลังจาก v1.0 milestone`
- Triggers การทบทวนว่าเนื้อหายังถูกต้องหรือไม่

</guidelines>

<evolution>

PROJECT.md พัฒนาตลอดวงจรชีวิตโปรเจกต์

**หลังจากแต่ละ phase transition:**
1. Requirements invalidated? → ย้ายไป Out of Scope พร้อมเหตุผล
2. Requirements validated? → ย้ายไป Validated พร้อม phase reference
3. Requirements ใหม่เกิดขึ้น? → เพิ่มใน Active
4. การตัดสินใจที่ต้อง log? → เพิ่มใน Key Decisions
5. "นี่คืออะไร" ยังถูกต้อง? → อัปเดตถ้าเบี่ยงเบน

**หลังจากแต่ละ milestone:**
1. ทบทวนทุก sections อย่างเต็มที่
2. ตรวจสอบคุณค่าหลัก — ยังเป็น priority ที่ถูกต้อง?
3. Audit Out of Scope — เหตุผลยังใช้ได้?
4. อัปเดต Context ด้วยสถานะปัจจุบัน (users, feedback, metrics)

</evolution>

<brownfield>

สำหรับ codebases ที่มีอยู่:

1. **Map codebase ก่อน** ผ่าน `/gsd:map-codebase`

2. **Infer Validated requirements** จาก code ที่มีอยู่:
   - Codebase ทำอะไรจริงๆ?
   - Patterns อะไร established แล้ว?
   - อะไรทำงานชัดเจนและถูกพึ่งพา?

3. **รวบรวม Active requirements** จากผู้ใช้:
   - นำเสนอ inferred current state
   - ถามว่าต้องการสร้างอะไรต่อไป

4. **Initialize:**
   - Validated = inferred จาก code ที่มีอยู่
   - Active = เป้าหมายของผู้ใช้สำหรับงานนี้
   - Out of Scope = ขอบเขตที่ผู้ใช้ระบุ
   - Context = รวมสถานะ codebase ปัจจุบัน

</brownfield>

<state_reference>

STATE.md references PROJECT.md:

```markdown
## Project Reference

ดู: .planning/PROJECT.md (อัปเดต [วันที่])

**คุณค่าหลัก:** [One-liner จาก Core Value section]
**จุดเน้นปัจจุบัน:** [ชื่อเฟสปัจจุบัน]
```

สิ่งนี้รับประกันว่า Claude อ่าน PROJECT.md context ปัจจุบัน

</state_reference>
