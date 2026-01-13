<purpose>
แนะนำการทดสอบ user acceptance testing แบบ manual สำหรับฟีเจอร์ที่เพิ่งสร้าง ดึง deliverables จาก SUMMARY.md, สร้าง test checklist, แนะนำผู้ใช้ผ่านการทดสอบแต่ละรายการ, บันทึก issues ไปยังไฟล์ที่จำกัดขอบเขตตามเฟส

ผู้ใช้ทำการทดสอบทั้งหมด — Claude สร้าง checklist, แนะนำกระบวนการ, และบันทึก issues
</purpose>

<process>

<step name="identify">
**ระบุสิ่งที่จะทดสอบ:**

ถ้ามี $ARGUMENTS:
- แยกวิเคราะห์เป็นหมายเลขเฟส (เช่น "4") หรือหมายเลขแผน (เช่น "04-02")
- ค้นหาไฟล์ SUMMARY.md ที่ตรงกัน

ถ้าไม่มี arguments:
- ค้นหา SUMMARY.md ที่แก้ไขล่าสุด

```bash
find .planning/phases -name "*SUMMARY.md" -type f -exec ls -lt {} + | head -5
```

อ่าน SUMMARY.md เพื่อเข้าใจสิ่งที่ถูกสร้าง
</step>

<step name="extract">
**ดึง deliverables ที่ทดสอบได้จาก SUMMARY.md:**

แยกวิเคราะห์หา:
1. **Accomplishments** - ฟีเจอร์/ฟังก์ชันที่เพิ่ม
2. **Files Created/Modified** - อะไรเปลี่ยน
3. **User-facing changes** - UI, เวิร์กโฟลว์, การโต้ตอบ

เน้นผลลัพธ์ที่ผู้ใช้สังเกตได้ ไม่ใช่รายละเอียดการ implementation

ตัวอย่าง:
- "Check-in menu item added to navigation" → ผู้ใช้สามารถเห็น/คลิก Check-in ใน nav
- "HomePage refreshes after check-in" → หลัง check-in หน้าแรกแสดงสถานะที่อัปเดต
</step>

<step name="generate">
**สร้าง manual test checklist:**

สร้างแผนการทดสอบที่มีโครงสร้าง:

```
# User Acceptance Test: [ชื่อแผน/เฟส]

**Scope:** [สิ่งที่ถูกสร้าง - จาก SUMMARY.md]
**Testing:** การตรวจสอบแบบ manual โดยผู้ใช้

## Pre-flight
- [ ] แอปพลิเคชัน build และรันได้โดยไม่มี errors
- [ ] แอปพลิเคชันเปิดไปยังสถานะที่คาดหวัง

## Feature Tests

### [ฟีเจอร์ 1 จาก deliverables]
**สิ่งที่ต้องทดสอบ:** [พฤติกรรมที่ผู้ใช้สังเกตได้]
**ขั้นตอน:**
1. [การกระทำเฉพาะที่ต้องทำ]
2. [สิ่งที่ต้องดู]
3. [ผลลัพธ์ที่คาดหวัง]

### [ฟีเจอร์ 2 จาก deliverables]
...

## Edge Cases
- [ ] [Edge case ที่เกี่ยวข้องตามฟีเจอร์]
- [ ] [Edge case อื่น]

## Visual/UX Check
- [ ] UI ตรงกับดีไซน์ที่คาดหวัง
- [ ] ไม่มี visual glitches หรือปัญหา layout
- [ ] ตอบสนองต่อการโต้ตอบ
```

นำเสนอ checklist นี้ให้ผู้ใช้
</step>

<step name="guide">
**แนะนำผู้ใช้ผ่านการทดสอบแต่ละรายการ:**

สำหรับแต่ละ test item ใช้ AskUserQuestion:
- header: "[ชื่อฟีเจอร์]"
- question: "[คำอธิบายการทดสอบ] - สิ่งนี้ทำงานตามที่คาดหวังหรือไม่?"
- options:
  - "Pass" — ทำงานถูกต้อง
  - "Fail" — ไม่ทำงานตามที่คาดหวัง
  - "Partial" — ทำงานแต่มีปัญหา
  - "Skip" — ทดสอบไม่ได้ตอนนี้

**ถ้า Pass:** ไปการทดสอบถัดไป

**ถ้า Fail หรือ Partial:**
ติดตามด้วย AskUserQuestion:
- header: "รายละเอียด Issue"
- question: "เกิดปัญหาอะไร?"
- options:
  - "Crashes/errors" — แอปพลิเคชัน error หรือ exception
  - "Wrong behavior" — ทำสิ่งที่ไม่คาดหวัง
  - "Missing feature" — ฟังก์ชันที่คาดหวังไม่มี
  - "UI/visual issue" — ดูผิดปกติแต่ยังทำงานได้
  - "Let me describe" — ต้องการอธิบายเอง
</step>

<step name="collect">
**รวบรวมและจัดหมวดหมู่ issues:**

สำหรับแต่ละการทดสอบที่ failed/partial รวบรวม:
- ฟีเจอร์ที่ได้รับผลกระทบ
- เกิดปัญหาอะไร (จาก input ของผู้ใช้)
- ความรุนแรง:
  - **Blocker** — ใช้ฟีเจอร์ไม่ได้เลย
  - **Major** — ฟีเจอร์ทำงานแต่มีปัญหาสำคัญ
  - **Minor** — ปัญหาเล็กน้อย ฟีเจอร์ยังใช้ได้
  - **Cosmetic** — เฉพาะ visual ไม่มีผลกระทบต่อฟังก์ชัน
</step>

<step name="log">
**บันทึก issues ไปยังไฟล์ที่จำกัดขอบเขตตามเฟส:**

ถ้าพบ issues:

1. สร้าง `.planning/phases/XX-name/{phase}-{plan}-ISSUES.md` ถ้ายังไม่มี
2. ใช้ template จาก `@~/.claude/get-shit-done/templates/uat-issues.md`
3. เพิ่มแต่ละ issue:

```markdown
### UAT-[NNN]: [คำอธิบายสั้น]

**Discovered:** [วันที่] ระหว่าง user acceptance testing
**Phase/Plan:** [phase]-[plan] ที่ถูกทดสอบ
**Severity:** [Blocker/Major/Minor/Cosmetic]
**Description:** [คำอธิบายปัญหาของผู้ใช้]
**Expected:** [สิ่งที่ควรเกิดขึ้น]
**Actual:** [สิ่งที่เกิดขึ้นจริง]
```

**หมายเหตุ:** Issues ไปยังไฟล์ที่จำกัดขอบเขตตามเฟส ไม่ใช่ `.planning/ISSUES.md` ทั่วไป เพื่อเก็บผลการค้นพบ UAT ให้ผูกกับงานเฉพาะที่กำลังทดสอบ และทำให้ `/gsd:plan-fix` สามารถแก้ไขได้
</step>

<step name="summarize">
**นำเสนอสรุปการทดสอบ:**

```
# ผลการทดสอบ: [ชื่อแผน/เฟส]

**ทดสอบ:** [N] รายการ
**Passed:** [N]
**Failed:** [N]
**Partial:** [N]
**Skipped:** [N]

## Issues ที่พบ
[แสดงรายการ issues พร้อมความรุนแรง]

## ข้อสรุป
[ตามผลลัพธ์:]
- ALL PASS: "การทดสอบทั้งหมดผ่าน ฟีเจอร์ได้รับการตรวจสอบแล้ว"
- MINOR ISSUES: "ฟีเจอร์ทำงานพร้อมปัญหาเล็กน้อยที่บันทึกไว้"
- MAJOR ISSUES: "พบปัญหาสำคัญ — ตรวจสอบก่อนดำเนินการต่อ"
- BLOCKERS: "พบปัญหาที่บล็อก — ต้องแก้ไขก่อนดำเนินการต่อ"

## ขั้นตอนถัดไป
[ตามข้อสรุป:]
- ถ้าสะอาด: แนะนำดำเนินการไปเฟสถัดไป
- ถ้ามี issues: แนะนำ /gsd:plan-fix เพื่อแก้ไข
```
</step>

<step name="offer">
**เสนอการดำเนินการถัดไปตามผลลัพธ์:**

ใช้ AskUserQuestion:
- header: "ถัดไป"
- question: "คุณต้องการทำอะไร?"
- options (ตามผลลัพธ์):

ถ้าผ่านทั้งหมด:
- "ดำเนินการไปเฟสถัดไป" — ดำเนินการต่อด้วยความมั่นใจ
- "ทดสอบเพิ่มเติม" — รันการทดสอบ manual เพิ่มเติม
- "เสร็จสิ้น" — จบ session การทดสอบ

ถ้าพบ issues:
- "วางแผนแก้ไข" — สร้างแผนเพื่อแก้ไข issues (/gsd:plan-fix)
- "บันทึกและดำเนินการต่อ" — บันทึก issues แล้ว ดำเนินการต่ออยู่ดี
- "ตรวจสอบ issues" — ดูรายละเอียด issues ที่บันทึก
- "เสร็จสิ้น" — จบ session การทดสอบ
</step>

</process>

<success_criteria>
- [ ] ระบุขอบเขตการทดสอบจาก SUMMARY.md
- [ ] สร้าง checklist ตาม deliverables
- [ ] แนะนำผู้ใช้ผ่านการทดสอบแต่ละรายการผ่าน AskUserQuestion
- [ ] บันทึกผลการทดสอบทั้งหมด (pass/fail/partial/skip)
- [ ] บันทึก issues ไปยัง ISSUES.md ที่จำกัดขอบเขตตามเฟส
- [ ] นำเสนอสรุปพร้อมข้อสรุป
- [ ] ผู้ใช้รู้ขั้นตอนถัดไปตามผลลัพธ์
</success_criteria>
