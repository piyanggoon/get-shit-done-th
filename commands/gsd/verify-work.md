---
name: gsd:verify-work
description: นำผู้ใช้ผ่าน manual user acceptance testing ของ features ที่สร้างเสร็จ
argument-hint: "[optional: phase หรือ plan number, เช่น '4' หรือ '04-02']"
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - Edit
  - Write
  - AskUserQuestion
---

<objective>
นำผู้ใช้ผ่าน manual acceptance testing ของ features ที่สร้างเสร็จ

วัตถุประสงค์: Validate ว่าสิ่งที่ Claude คิดว่าสร้างเสร็จจริงๆ ใช้งานได้จากมุมมองผู้ใช้ ผู้ใช้ทำ testing ทั้งหมด — Claude สร้าง test checklist, นำผ่านกระบวนการ, และบันทึก issues

Output: Validation ของ features, issues ใดๆ log ไปยัง phase-scoped ISSUES.md
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/verify-work.md
@~/.claude/get-shit-done/templates/uat-issues.md
</execution_context>

<context>
Scope: $ARGUMENTS (optional)
- ถ้าระบุ: Test phase หรือ plan เฉพาะ (เช่น "4" หรือ "04-02")
- ถ้าไม่ระบุ: Test plan ที่เสร็จล่าสุด

**โหลด project state:**
@.planning/STATE.md

**โหลด roadmap:**
@.planning/ROADMAP.md
</context>

<process>
1. ตรวจสอบ arguments (ถ้าระบุ parse เป็น phase หรือ plan number)
2. หา SUMMARY.md ที่เกี่ยวข้อง (ที่ระบุหรือล่าสุด)
3. ทำตาม verify-work.md workflow:
   - ดึง testable deliverables
   - สร้าง test checklist
   - นำผ่านแต่ละ test ผ่าน AskUserQuestion
   - รวบรวมและจัดหมวด issues
   - Log issues ไปยัง `.planning/phases/XX-name/{phase}-{plan}-ISSUES.md`
   - แสดงสรุปพร้อม verdict
4. เสนอขั้นตอนถัดไปตามผลลัพธ์:
   - ถ้าผ่านทั้งหมด: ทำ phase ถัดไปต่อ
   - ถ้าพบ issues: `/gsd:plan-fix {phase} {plan}` เพื่อสร้าง fix plan
</process>

<anti_patterns>
- อย่ารัน automated tests (นั่นสำหรับ CI/test suites)
- อย่าคาดเดาผลการทดสอบ — ผู้ใช้รายงานผลลัพธ์
- อย่าข้าม guidance — walk through แต่ละ test
- อย่า dismiss minor issues — log ทุกอย่างที่ผู้ใช้รายงาน
- อย่าแก้ issues ระหว่างทดสอบ — บันทึกไว้ทำทีหลัง
</anti_patterns>

<success_criteria>
- [ ] ระบุ test scope จาก SUMMARY.md
- [ ] สร้าง checklist ตาม deliverables
- [ ] นำผู้ใช้ผ่านแต่ละ test
- [ ] บันทึก test results ทั้งหมด (pass/fail/partial/skip)
- [ ] Log issues ใดๆ ไปยัง phase-scoped ISSUES.md (ไม่ใช่ global)
- [ ] แสดงสรุปพร้อม verdict
- [ ] ผู้ใช้รู้ขั้นตอนถัดไปตามผลลัพธ์
</success_criteria>
