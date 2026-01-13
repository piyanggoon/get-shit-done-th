---
type: prompt
name: gsd:complete-milestone
description: Archive milestone ที่เสร็จแล้วและเตรียมสำหรับเวอร์ชันถัดไป
argument-hint: <version>
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
ทำเครื่องหมาย milestone {{version}} ว่าเสร็จแล้ว archive ไปยัง milestones/ และอัพเดท ROADMAP.md

วัตถุประสงค์: สร้างบันทึกประวัติของเวอร์ชันที่ ship แล้ว ยุบงานที่เสร็จแล้วใน roadmap และเตรียมสำหรับ milestone ถัดไป
Output: Milestone archived, roadmap reorganized, git tagged
</objective>

<execution_context>
**โหลดไฟล์เหล่านี้ก่อน (ก่อนดำเนินการ):**

- @~/.claude/get-shit-done/workflows/complete-milestone.md (main workflow)
- @~/.claude/get-shit-done/templates/milestone-archive.md (archive template)
  </execution_context>

<context>
**Project files:**
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/PROJECT.md`

**User input:**

- Version: {{version}} (เช่น "1.0", "1.1", "2.0")
  </context>

<process>

**ทำตาม complete-milestone.md workflow:**

1. **ตรวจสอบความพร้อม:**

   - ตรวจสอบว่า phases ทั้งหมดใน milestone มี plans ที่เสร็จแล้ว (มี SUMMARY.md)
   - แสดง scope และสถิติของ milestone
   - รอการยืนยัน

2. **รวบรวมสถิติ:**

   - นับ phases, plans, tasks
   - คำนวณ git range, file changes, LOC
   - ดึง timeline จาก git log
   - แสดงสรุป, ยืนยัน

3. **ดึง accomplishments:**

   - อ่านไฟล์ SUMMARY.md ทั้งหมดใน phase range ของ milestone
   - ดึง 4-6 accomplishments หลัก
   - แสดงเพื่อขออนุมัติ

4. **Archive milestone:**

   - สร้าง `.planning/milestones/v{{version}}-ROADMAP.md`
   - ดึงรายละเอียด phase เต็มจาก ROADMAP.md
   - กรอก milestone-archive.md template
   - อัพเดท ROADMAP.md เป็นสรุปบรรทัดเดียวพร้อม link
   - เสนอให้สร้าง milestone ถัดไป

5. **อัพเดท PROJECT.md:**

   - เพิ่ม section "Current State" พร้อมเวอร์ชันที่ ship
   - เพิ่ม section "Next Milestone Goals"
   - Archive เนื้อหาเดิมใน `<details>` (ถ้า v1.1+)

6. **Commit และ tag:**

   - Stage: MILESTONES.md, PROJECT.md, ROADMAP.md, STATE.md, archive file
   - Commit: `chore: archive v{{version}} milestone`
   - Tag: `git tag -a v{{version}} -m "[milestone summary]"`
   - ถามเรื่อง push tag

7. **เสนอขั้นตอนถัดไป:**
   - วางแผน milestone ถัดไป
   - Archive planning
   - เสร็จสิ้นสำหรับตอนนี้

</process>

<success_criteria>

- Milestone archived ไปยัง `.planning/milestones/v{{version}}-ROADMAP.md`
- ROADMAP.md ยุบเป็นรายการบรรทัดเดียว
- PROJECT.md อัพเดทด้วยสถานะปัจจุบัน
- Git tag v{{version}} สร้างแล้ว
- Commit สำเร็จ
- ผู้ใช้รู้ขั้นตอนถัดไป
  </success_criteria>

<critical_rules>

- **โหลด workflow ก่อน:** อ่าน complete-milestone.md ก่อนดำเนินการ
- **ตรวจสอบความเสร็จสมบูรณ์:** Phases ทั้งหมดต้องมีไฟล์ SUMMARY.md
- **ยืนยันจากผู้ใช้:** รอการอนุมัติที่ verification gates
- **Archive ก่อนยุบ:** สร้างไฟล์ archive ก่อนอัพเดท ROADMAP.md เสมอ
- **สรุปบรรทัดเดียว:** Milestone ที่ยุบใน ROADMAP.md ควรเป็นบรรทัดเดียวพร้อม link
- **ประสิทธิภาพ context:** Archive ทำให้ ROADMAP.md มีขนาดคงที่
  </critical_rules>
