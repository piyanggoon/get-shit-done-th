# เทมเพลต Milestone Entry

เพิ่ม entry นี้ไปที่ `.planning/MILESTONES.md` เมื่อเสร็จสิ้น milestone:

```markdown
## v[X.Y] [ชื่อ] (Shipped: YYYY-MM-DD)

**ส่งมอบ:** [หนึ่งประโยคอธิบายสิ่งที่ส่งมอบ]

**เฟสที่เสร็จ:** [X-Y] ([Z] แผนทั้งหมด)

**ความสำเร็จหลัก:**
- [ความสำเร็จหลัก 1]
- [ความสำเร็จหลัก 2]
- [ความสำเร็จหลัก 3]
- [ความสำเร็จหลัก 4]

**สถิติ:**
- [X] ไฟล์ที่สร้าง/แก้ไข
- [Y] บรรทัดโค้ด (ภาษาหลัก)
- [Z] เฟส, [N] แผน, [M] งาน
- [D] วันจากเริ่มต้นถึงส่งมอบ (หรือ milestone ถึง milestone)

**Git range:** `feat(XX-XX)` → `feat(YY-YY)`

**ถัดไป:** [คำอธิบายสั้นๆ ของเป้าหมาย milestone ถัดไป หรือ "โปรเจกต์เสร็จสมบูรณ์"]

---
```

<structure>
ถ้า MILESTONES.md ไม่มีอยู่ ให้สร้างพร้อม header:

```markdown
# Project Milestones: [ชื่อโปรเจกต์]

[Entries เรียงตามลำดับเวลาย้อนกลับ - ใหม่สุดก่อน]
```
</structure>

<guidelines>
**เมื่อไหร่ควรสร้าง milestones:**
- v1.0 MVP เริ่มต้นส่งมอบแล้ว
- Major version releases (v2.0, v3.0)
- Feature milestones สำคัญ (v1.1, v1.2)
- ก่อน archiving planning (บันทึกสิ่งที่ส่งมอบแล้ว)

**ไม่ควรสร้าง milestones สำหรับ:**
- Phase completions เดี่ยวๆ (workflow ปกติ)
- Work in progress (รอจนกว่าจะส่งมอบ)
- Bug fixes เล็กน้อยที่ไม่ถือเป็น release

**สถิติที่ควรรวม:**
- นับไฟล์ที่แก้ไข: `git diff --stat feat(XX-XX)..feat(YY-YY) | tail -1`
- นับ LOC: `find . -name "*.swift" -o -name "*.ts" | xargs wc -l` (หรือ extension ที่เกี่ยวข้อง)
- จำนวน Phase/plan/task จาก ROADMAP
- Timeline จาก commit แรกของเฟสถึง commit สุดท้าย

**รูปแบบ Git range:**
- Commit แรกของ milestone → commit สุดท้ายของ milestone
- ตัวอย่าง: `feat(01-01)` → `feat(04-01)` สำหรับเฟส 1-4
</guidelines>

<example>
```markdown
# Project Milestones: WeatherBar

## v1.1 Security & Polish (Shipped: 2025-12-10)

**ส่งมอบ:** Security hardening ด้วย Keychain integration และ comprehensive error handling

**เฟสที่เสร็จ:** 5-6 (3 แผนทั้งหมด)

**ความสำเร็จหลัก:**
- ย้าย API key storage จาก plaintext ไปยัง macOS Keychain
- Implement comprehensive error handling สำหรับ network failures
- เพิ่ม Sentry crash reporting integration
- แก้ไข memory leak ใน auto-refresh timer

**สถิติ:**
- 23 ไฟล์ที่แก้ไข
- 650 บรรทัด Swift เพิ่ม
- 2 เฟส, 3 แผน, 12 งาน
- 8 วันจาก v1.0 ถึง v1.1

**Git range:** `feat(05-01)` → `feat(06-02)`

**ถัดไป:** v2.0 SwiftUI redesign พร้อม widget support

---

## v1.0 MVP (Shipped: 2025-11-25)

**ส่งมอบ:** Menu bar weather app พร้อมสภาพอากาศปัจจุบันและพยากรณ์ 3 วัน

**เฟสที่เสร็จ:** 1-4 (7 แผนทั้งหมด)

**ความสำเร็จหลัก:**
- Menu bar app พร้อม popover UI (AppKit)
- OpenWeather API integration พร้อม auto-refresh
- แสดงสภาพอากาศปัจจุบันพร้อมไอคอนสภาพอากาศ
- รายการพยากรณ์ 3 วันพร้อมอุณหภูมิสูงสุด/ต่ำสุด
- Code signed และ notarized สำหรับการแจกจ่าย

**สถิติ:**
- 47 ไฟล์ที่สร้าง
- 2,450 บรรทัด Swift
- 4 เฟส, 7 แผน, 28 งาน
- 12 วันจากเริ่มต้นถึงส่งมอบ

**Git range:** `feat(01-01)` → `feat(04-01)`

**ถัดไป:** Security audit และ hardening สำหรับ v1.1
```
</example>
