---
name: gsd:plan-fix
description: วางแผนแก้ไข UAT issues จาก verify-work
argument-hint: "[plan, เช่น '04-02']"
allowed-tools:
  - Read
  - Bash
  - Write
  - Glob
  - Grep
  - AskUserQuestion
---

<objective>
สร้าง FIX.md plan จาก UAT issues ที่พบระหว่าง verify-work

วัตถุประสงค์: วางแผนแก้ไข issues ที่ log ไว้ในไฟล์ ISSUES.md ที่ scope ตาม phase
Output: {plan}-FIX.md ในโฟลเดอร์ phase พร้อมสำหรับ execution
</objective>

<execution_context>
@~/.claude/get-shit-done/references/plan-format.md
@~/.claude/get-shit-done/references/checkpoints.md
</execution_context>

<context>
Plan number: $ARGUMENTS (required - เช่น "04-02" หรือ "09-01")

**โหลด project state:**
@.planning/STATE.md
@.planning/ROADMAP.md
</context>

<process>

<step name="parse">
**Parse plan argument:**

$ARGUMENTS ควรเป็น plan number เช่น "04-02" หรือ "09-01"
ดึง phase number (XX) และ plan number (NN)

ถ้าไม่มี argument:
```
Error: ต้องระบุ plan number

การใช้งาน: /gsd:plan-fix 04-02

นี่จะสร้าง fix plan จาก .planning/phases/XX-name/04-02-ISSUES.md
```
ออกจากคำสั่ง
</step>

<step name="find">
**หาไฟล์ ISSUES.md:**

ค้นหา ISSUES.md ที่ตรงกัน:
```bash
ls .planning/phases/*/{plan}-ISSUES.md 2>/dev/null
```

ถ้าไม่พบ:
```
ไม่พบ ISSUES.md สำหรับ plan {plan}

ไฟล์ ISSUES.md ถูกสร้างโดย /gsd:verify-work เมื่อ UAT พบ issues
ถ้าไม่พบ issues ระหว่างทดสอบ ไม่ต้องมี fix plan
```
ออกจากคำสั่ง
</step>

<step name="read">
**อ่าน issues:**

อ่านไฟล์ ISSUES.md
Parse แต่ละ issue:
- ID (UAT-XXX)
- Title
- Severity (critical/major/minor)
- Description/steps to reproduce
- Acceptance criteria

นับ issues รวมตาม severity
</step>

<step name="plan">
**สร้าง fix tasks:**

สำหรับแต่ละ issue (หรือกลุ่มที่เกี่ยวข้อง):
- สร้าง task หนึ่งต่อ issue หรือ
- รวม minor issues ที่เกี่ยวข้องเป็น task เดียว

Task structure:
```xml
<task type="auto">
  <name>Fix UAT-001: [issue title]</name>
  <files>[affected files จาก issue]</files>
  <action>
[จะแก้อะไรตาม issue description]
[อ้างอิง original acceptance criteria]
  </action>
  <verify>[ทดสอบว่า issue แก้แล้ว]</verify>
  <done>[Issue acceptance criteria met]</done>
</task>
```

จัดลำดับความสำคัญ: critical → major → minor
</step>

<step name="write">
**เขียน FIX.md:**

สร้าง `.planning/phases/XX-name/{plan}-FIX.md`:

```markdown
---
phase: XX-name
plan: {plan}-FIX
type: fix
---

<objective>
แก้ {N} UAT issues จาก plan {plan}

Source: {plan}-ISSUES.md
Priority: {critical count} critical, {major count} major, {minor count} minor
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/ROADMAP.md

**Issues ที่กำลังแก้:**
@.planning/phases/XX-name/{plan}-ISSUES.md

**Original plan สำหรับอ้างอิง:**
@.planning/phases/XX-name/{plan}-PLAN.md
</context>

<tasks>
[Generated fix tasks]
</tasks>

<verification>
ก่อนประกาศว่า plan เสร็จ:
- [ ] แก้ critical issues ทั้งหมดแล้ว
- [ ] แก้ major issues ทั้งหมดแล้ว
- [ ] แก้ minor issues แล้วหรือ document ว่าเลื่อน
- [ ] Original acceptance criteria จาก issues ผ่าน
</verification>

<success_criteria>
- UAT issues ทั้งหมดจาก {plan}-ISSUES.md ถูก address
- Tests ผ่าน
- พร้อมสำหรับ re-verification
</success_criteria>

<output>
หลังเสร็จ สร้าง `.planning/phases/XX-name/{plan}-FIX-SUMMARY.md`
</output>
```
</step>

<step name="offer">
**เสนอให้ execute:**

```
---

## ✓ สร้าง Fix Plan แล้ว

**{plan}-FIX.md** — {N} issues ที่ต้องแก้

| Severity | Count |
|----------|-------|
| Critical | {n}   |
| Major    | {n}   |
| Minor    | {n}   |

---

ต้องการ:
1. Execute fix plan ตอนนี้
2. Review plan ก่อน
3. แก้ไข plan ก่อน execute

---
```

ใช้ AskUserQuestion เพื่อรับคำตอบ
ถ้า execute: `/gsd:execute-plan .planning/phases/XX-name/{plan}-FIX.md`
</step>

</process>

<success_criteria>
- [ ] พบและ parse ISSUES.md
- [ ] สร้าง fix tasks สำหรับแต่ละ issue
- [ ] เขียน FIX.md ด้วย structure ที่ถูกต้อง
- [ ] เสนอให้ผู้ใช้ execute หรือ review
</success_criteria>
