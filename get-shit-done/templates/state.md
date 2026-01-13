# เทมเพลต State

เทมเพลตสำหรับ `.planning/STATE.md` — ความทรงจำที่ยังมีชีวิตของโปรเจกต์

---

## เทมเพลตไฟล์

```markdown
# Project State

## Project Reference

ดู: .planning/PROJECT.md (อัปเดต [วันที่])

**คุณค่าหลัก:** [One-liner จาก PROJECT.md Core Value section]
**จุดเน้นปัจจุบัน:** [ชื่อเฟสปัจจุบัน]

## ตำแหน่งปัจจุบัน

เฟส: [X] จาก [Y] ([ชื่อเฟส])
แผน: [A] จาก [B] ในเฟสปัจจุบัน
สถานะ: [พร้อมวางแผน / กำลังวางแผน / พร้อม execute / กำลังดำเนินการ / เฟสเสร็จสมบูรณ์]
กิจกรรมล่าสุด: [YYYY-MM-DD] — [สิ่งที่เกิดขึ้น]

ความคืบหน้า: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**
- แผนที่เสร็จทั้งหมด: [N]
- ระยะเวลาเฉลี่ย: [X] นาที
- เวลา execution รวม: [X.X] ชั่วโมง

**แยกตามเฟส:**

| เฟส | แผน | รวม | เฉลี่ย/แผน |
|-------|-------|-------|----------|
| - | - | - | - |

**Trend ล่าสุด:**
- 5 แผนล่าสุด: [ระยะเวลา]
- Trend: [ดีขึ้น / คงที่ / แย่ลง]

*อัปเดตหลังจากแต่ละแผนเสร็จ*

## Accumulated Context

### การตัดสินใจ

การตัดสินใจถูก log ใน PROJECT.md Key Decisions table
การตัดสินใจล่าสุดที่ส่งผลต่องานปัจจุบัน:

- [เฟส X]: [สรุปการตัดสินใจ]
- [เฟส Y]: [สรุปการตัดสินใจ]

### ปัญหาที่เลื่อนออกไป

[จาก ISSUES.md — ลิสต์ items ที่เปิดอยู่พร้อมเฟสที่ค้นพบ]

ยังไม่มี

### Todos ที่รอดำเนินการ

[จาก .planning/todos/pending/ — ไอเดียที่บันทึกระหว่าง sessions]

ยังไม่มี

### Blockers/Concerns

[ปัญหาที่ส่งผลต่องานในอนาคต]

ยังไม่มี

## Session Continuity

Session ล่าสุด: [YYYY-MM-DD HH:MM]
หยุดที่: [คำอธิบายของ action ที่เสร็จล่าสุด]
Resume file: [Path ไปยัง .continue-here*.md ถ้ามี มิฉะนั้น "ไม่มี"]
```

<purpose>

STATE.md คือความทรงจำระยะสั้นของโปรเจกต์ที่ครอบคลุมทุกเฟสและ sessions

**ปัญหาที่แก้:** ข้อมูลถูกบันทึกใน summaries, issues และ decisions แต่ไม่ถูกใช้อย่างเป็นระบบ Sessions เริ่มโดยไม่มี context

**Solution:** ไฟล์เดียวขนาดเล็กที่:
- อ่านก่อนในทุก workflow
- อัปเดตหลังจากทุก action สำคัญ
- มี digest ของ accumulated context
- เปิดใช้การกู้คืน session ทันที

</purpose>

<lifecycle>

**การสร้าง:** หลังจาก ROADMAP.md ถูกสร้าง (ระหว่าง init)
- Reference PROJECT.md (อ่านสำหรับ context ปัจจุบัน)
- Initialize empty accumulated context sections
- ตั้งตำแหน่งเป็น "เฟส 1 พร้อมวางแผน"

**การอ่าน:** ขั้นตอนแรกของทุก workflow
- progress: นำเสนอสถานะให้ผู้ใช้
- plan: แจ้ง planning decisions
- execute: รู้ตำแหน่งปัจจุบัน
- transition: รู้ว่าอะไรเสร็จแล้ว

**การเขียน:** หลังจากทุก action สำคัญ
- execute: หลังจากสร้าง SUMMARY.md
  - อัปเดตตำแหน่ง (เฟส, แผน, สถานะ)
  - บันทึกการตัดสินใจใหม่ (รายละเอียดใน PROJECT.md)
  - อัปเดตรายการ deferred issues
  - เพิ่ม blockers/concerns
- transition: หลังจากเฟส marked complete
  - อัปเดต progress bar
  - Clear resolved blockers
  - Refresh Project Reference date

</lifecycle>

<sections>

### Project Reference
ชี้ไปยัง PROJECT.md สำหรับ full context รวม:
- คุณค่าหลัก (สิ่งหนึ่งที่สำคัญ)
- จุดเน้นปัจจุบัน (เฟสไหน)
- วันที่อัปเดตล่าสุด (triggers การอ่านใหม่ถ้า stale)

Claude อ่าน PROJECT.md โดยตรงสำหรับ requirements, constraints และ decisions

### ตำแหน่งปัจจุบัน
เราอยู่ที่ไหนตอนนี้:
- เฟส X จาก Y — เฟสไหน
- แผน A จาก B — แผนไหนในเฟส
- สถานะ — state ปัจจุบัน
- กิจกรรมล่าสุด — อะไรเกิดขึ้นล่าสุด
- Progress bar — visual indicator ของความคืบหน้าโดยรวม

การคำนวณความคืบหน้า: (completed plans) / (total plans across all phases) × 100%

### Performance Metrics
ติดตาม velocity เพื่อเข้าใจ execution patterns:
- แผนที่เสร็จทั้งหมด
- ระยะเวลาเฉลี่ยต่อแผน
- breakdown แยกตามเฟส
- trend ล่าสุด (ดีขึ้น/คงที่/แย่ลง)

อัปเดตหลังจากแต่ละแผนเสร็จ

### Accumulated Context

**การตัดสินใจ:** Reference ไปยัง PROJECT.md Key Decisions table บวกสรุปการตัดสินใจล่าสุดสำหรับ quick access Decision log เต็มอยู่ใน PROJECT.md

**ปัญหาที่เลื่อนออกไป:** Open items จาก ISSUES.md
- คำอธิบายสั้นพร้อม ISS-XXX number
- เฟสที่ค้นพบ
- Effort estimate ถ้ารู้
- ช่วย phase planning ระบุว่าจะแก้อะไร

**Todos ที่รอดำเนินการ:** ไอเดียที่บันทึกผ่าน /gsd:add-todo
- จำนวน pending todos
- Reference ไปยัง .planning/todos/pending/
- ลิสต์สั้นถ้าน้อย จำนวนถ้าเยอะ (เช่น "5 pending todos — ดู /gsd:check-todos")

**Blockers/Concerns:** จาก "Next Phase Readiness" sections
- ปัญหาที่ส่งผลต่องานในอนาคต
- Prefix ด้วยเฟสที่มา
- Cleared เมื่อถูกแก้ไข

### Session Continuity
เปิดใช้การกลับมาทำงานต่อทันที:
- session ล่าสุดเมื่อไหร่
- อะไรที่เสร็จล่าสุด
- มี .continue-here file ที่ต้อง resume หรือไม่

</sections>

<size_constraint>

รักษา STATE.md ให้ต่ำกว่า 100 บรรทัด

มันเป็น DIGEST ไม่ใช่ archive ถ้า accumulated context โตเกินไป:
- เก็บแค่ 3-5 การตัดสินใจล่าสุดในสรุป (full log ใน PROJECT.md)
- Reference ISSUES.md แทนการลิสต์ทั้งหมด: "12 open issues — ดู ISSUES.md"
- เก็บแค่ active blockers ลบที่ resolved แล้ว

เป้าหมายคือ "อ่านครั้งเดียว รู้ว่าเราอยู่ที่ไหน" — ถ้ายาวเกินไป มันล้มเหลว

</size_constraint>

<guidelines>

**เมื่อไหร่สร้าง:**
- ระหว่าง project initialization (หลัง ROADMAP.md)
- Reference PROJECT.md (extract core value และ current focus)
- Initialize empty sections

**เมื่อไหร่อ่าน:**
- ทุก workflow เริ่มโดยอ่าน STATE.md
- จากนั้นอ่าน PROJECT.md สำหรับ full context
- ให้ instant context restoration

**เมื่อไหร่อัปเดต:**
- หลังจากแต่ละ plan execution (update position, note decisions, update issues/blockers)
- หลังจาก phase transitions (update progress bar, clear resolved blockers, refresh project reference)

**การจัดการขนาด:**
- รักษาให้ต่ำกว่า 100 บรรทัดทั้งหมด
- แค่ recent decisions ใน STATE.md (full log ใน PROJECT.md)
- Reference ISSUES.md แทนการลิสต์ทุก issues
- เก็บแค่ active blockers

**Sections:**
- Project Reference: Pointer ไปยัง PROJECT.md พร้อม core value
- ตำแหน่งปัจจุบัน: เราอยู่ที่ไหนตอนนี้ (เฟส, แผน, สถานะ)
- Performance Metrics: Velocity tracking
- Accumulated Context: Recent decisions, deferred issues, blockers
- Session Continuity: Resume information

</guidelines>
