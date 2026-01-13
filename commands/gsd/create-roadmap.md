---
name: gsd:create-roadmap
description: สร้าง roadmap พร้อม phases สำหรับโปรเจค
allowed-tools:
  - Read
  - Write
  - Bash
  - AskUserQuestion
  - Glob
---

<objective>
สร้าง project roadmap พร้อมการแบ่ง phases

Roadmaps กำหนดว่างานอะไรเกิดขึ้นในลำดับไหน รันหลัง /gsd:new-project
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/create-roadmap.md
@~/.claude/get-shit-done/templates/roadmap.md
@~/.claude/get-shit-done/templates/state.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/config.json
</context>

<process>

<step name="validate">
```bash
# ตรวจสอบว่ามีโปรเจค
[ -f .planning/PROJECT.md ] || { echo "ERROR: ไม่พบ PROJECT.md รัน /gsd:new-project ก่อน"; exit 1; }
```
</step>

<step name="check_existing">
ตรวจสอบว่ามี roadmap อยู่แล้วหรือไม่:

```bash
[ -f .planning/ROADMAP.md ] && echo "ROADMAP_EXISTS" || echo "NO_ROADMAP"
```

**ถ้า ROADMAP_EXISTS:**
ใช้ AskUserQuestion:
- header: "มี Roadmap แล้ว"
- question: "มี roadmap อยู่แล้ว จะทำอย่างไร?"
- options:
  - "ดู roadmap เดิม" - แสดง roadmap ปัจจุบัน
  - "แทนที่" - สร้าง roadmap ใหม่ (จะเขียนทับ)
  - "ยกเลิก" - เก็บ roadmap เดิมไว้

ถ้า "ดู roadmap เดิม": `cat .planning/ROADMAP.md` และออก
ถ้า "ยกเลิก": ออก
ถ้า "แทนที่": ดำเนินการ workflow ต่อ
</step>

<step name="create_roadmap">
ทำตาม create-roadmap.md workflow เริ่มจาก detect_domain step

Workflow จัดการ:
- การตรวจจับ domain expertise
- การระบุ phases
- Research flags สำหรับแต่ละ phase
- Confirmation gates (ตาม config mode)
- สร้าง ROADMAP.md
- Initialize STATE.md
- สร้างโฟลเดอร์ phase
- Git commit
</step>

<step name="done">
```
สร้าง Roadmap แล้ว:
- Roadmap: .planning/ROADMAP.md
- State: .planning/STATE.md
- [N] phases กำหนดแล้ว

---

## ▶ ถัดไป

**Phase 1: [Name]** — [Goal จาก ROADMAP.md]

`/gsd:plan-phase 1`

<sub>`/clear` ก่อน → เริ่ม context window ใหม่</sub>

---

**ตัวเลือกอื่น:**
- `/gsd:discuss-phase 1` — รวบรวม context ก่อน
- `/gsd:research-phase 1` — ค้นคว้าสิ่งที่ไม่รู้
- ดู roadmap

---
```
</step>

</process>

<output>
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/phases/XX-name/` directories
</output>

<success_criteria>
- [ ] ตรวจสอบ PROJECT.md แล้ว
- [ ] สร้าง ROADMAP.md พร้อม phases แล้ว
- [ ] Initialize STATE.md แล้ว
- [ ] สร้างโฟลเดอร์ phase แล้ว
- [ ] Commit changes แล้ว
</success_criteria>
