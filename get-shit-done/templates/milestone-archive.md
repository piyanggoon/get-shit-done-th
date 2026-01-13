# เทมเพลต Milestone Archive

เทมเพลตนี้ใช้โดย workflow complete-milestone เพื่อสร้างไฟล์ archive ใน `.planning/milestones/`

---

## เทมเพลตไฟล์

# Milestone v{{VERSION}}: {{MILESTONE_NAME}}

**สถานะ:** ✅ SHIPPED {{DATE}}
**เฟส:** {{PHASE_START}}-{{PHASE_END}}
**แผนทั้งหมด:** {{TOTAL_PLANS}}

## ภาพรวม

{{MILESTONE_DESCRIPTION}}

## เฟส

{{PHASES_SECTION}}

[สำหรับแต่ละเฟสใน milestone นี้ ให้รวม:]

### เฟส {{PHASE_NUM}}: {{PHASE_NAME}}

**เป้าหมาย**: {{PHASE_GOAL}}
**ขึ้นอยู่กับ**: {{DEPENDS_ON}}
**แผน**: {{PLAN_COUNT}} แผน

แผนงาน:

- [x] {{PHASE}}-01: {{PLAN_DESCRIPTION}}
- [x] {{PHASE}}-02: {{PLAN_DESCRIPTION}}
      [... แผนทั้งหมด ...]

**รายละเอียด:**
{{PHASE_DETAILS_FROM_ROADMAP}}

**สำหรับเฟสทศนิยม ให้รวม (INSERTED) marker:**

### เฟส 2.1: Critical Security Patch (INSERTED)

**เป้าหมาย**: แก้ไขช่องโหว่ authentication bypass
**ขึ้นอยู่กับ**: เฟส 2
**แผน**: 1 แผน

แผนงาน:

- [x] 02.1-01: Patch auth vulnerability

**รายละเอียด:**
{{PHASE_DETAILS_FROM_ROADMAP}}

---

## สรุป Milestone

**เฟสทศนิยม:**

- เฟส 2.1: Critical Security Patch (แทรกหลังจากเฟส 2 สำหรับการแก้ไขเร่งด่วน)
- เฟส 5.1: Performance Hotfix (แทรกหลังจากเฟส 5 สำหรับปัญหา production)

**การตัดสินใจสำคัญ:**
{{DECISIONS_FROM_PROJECT_STATE}}
[ตัวอย่าง:]

- การตัดสินใจ: ใช้ ROADMAP.md split (เหตุผล: Constant context cost)
- การตัดสินใจ: Decimal phase numbering (เหตุผล: Clear insertion semantics)

**ปัญหาที่แก้ไขแล้ว:**
{{ISSUES_RESOLVED_DURING_MILESTONE}}
[ตัวอย่าง:]

- แก้ไข context overflow ที่ 100+ เฟส
- แก้ไขความสับสนในการแทรกเฟส

**ปัญหาที่เลื่อนออกไป:**
{{ISSUES_DEFERRED_TO_LATER}}
[ตัวอย่าง:]

- PROJECT-STATE.md tiering (เลื่อนจนกว่าการตัดสินใจ > 300)

**Technical Debt ที่เกิดขึ้น:**
{{SHORTCUTS_NEEDING_FUTURE_WORK}}
[ตัวอย่าง:]

- บาง workflows ยังมี hardcoded paths (แก้ไขในเฟส 5)

---

_สำหรับสถานะโปรเจกต์ปัจจุบัน ดู .planning/ROADMAP.md_

---

## แนวทางการใช้งาน

<guidelines>
**เมื่อไหร่ควรสร้าง milestone archives:**
- หลังจากเสร็จสิ้นทุกเฟสใน milestone (v1.0, v1.1, v2.0, เป็นต้น)
- ทริกเกอร์โดย complete-milestone workflow
- ก่อนวางแผนงาน milestone ถัดไป

**วิธีกรอกเทมเพลต:**

- แทนที่ {{PLACEHOLDERS}} ด้วยค่าจริง
- ดึงรายละเอียดเฟสจาก ROADMAP.md
- บันทึกเฟสทศนิยมด้วย (INSERTED) marker
- รวมการตัดสินใจสำคัญจาก PROJECT-STATE.md หรือไฟล์ SUMMARY
- ลิสต์ปัญหาที่แก้ไขแล้ว vs ที่เลื่อนออกไป
- บันทึก technical debt สำหรับอ้างอิงในอนาคต

**ตำแหน่ง archive:**

- บันทึกไปที่ `.planning/milestones/v{VERSION}-{NAME}.md`
- ตัวอย่าง: `.planning/milestones/v1.0-mvp.md`

**หลังจาก archiving:**

- อัปเดต ROADMAP.md เพื่อยุบ milestone ที่เสร็จแล้วใน `<details>` tag
- อัปเดต PROJECT.md เป็นรูปแบบ brownfield พร้อมส่วน Current State
- ดำเนินการนับเลขเฟสต่อใน milestone ถัดไป (ไม่เริ่มใหม่ที่ 01)
  </guidelines>
