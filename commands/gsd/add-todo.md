---
name: gsd:add-todo
description: บันทึกไอเดียหรืองานเป็น todo จาก context การสนทนาปัจจุบัน
argument-hint: [optional description]
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
---

<objective>
บันทึกไอเดีย งาน หรือปัญหาที่เกิดขึ้นระหว่าง session GSD เป็น structured todo สำหรับทำงานทีหลัง

เปิดใช้ flow "คิด → บันทึก → ทำต่อ" โดยไม่เสีย context หรือหลุดจากงานปัจจุบัน
</objective>

<context>
@.planning/STATE.md
</context>

<process>

<step name="ensure_directory">
```bash
mkdir -p .planning/todos/pending .planning/todos/done
```
</step>

<step name="check_existing_areas">
```bash
ls .planning/todos/pending/*.md 2>/dev/null | xargs -I {} grep "^area:" {} 2>/dev/null | cut -d' ' -f2 | sort -u
```

จด areas ที่มีอยู่ไว้เพื่อใช้อ้างอิงใน infer_area step
</step>

<step name="extract_content">
**มี arguments:** ใช้เป็น title/focus
- `/gsd:add-todo Add auth token refresh` → title = "Add auth token refresh"

**ไม่มี arguments:** วิเคราะห์การสนทนาล่าสุดเพื่อดึงข้อมูล:
- ปัญหา ไอเดีย หรืองานที่กำลังพูดถึง
- file paths ที่เกี่ยวข้อง
- รายละเอียดทางเทคนิค (error messages, line numbers, constraints)

สร้าง:
- `title`: หัวข้อ 3-10 คำ (ควรเริ่มด้วย action verb)
- `problem`: มีปัญหาอะไร หรือทำไมถึงต้องทำ
- `solution`: แนวทางแก้ไข หรือ "TBD" ถ้าเป็นแค่ไอเดีย
- `files`: paths ที่เกี่ยวข้องพร้อม line numbers จากการสนทนา
</step>

<step name="infer_area">
อนุมาน area จาก file paths:

| Path pattern | Area |
|--------------|------|
| `src/api/*`, `api/*` | `api` |
| `src/components/*`, `src/ui/*` | `ui` |
| `src/auth/*`, `auth/*` | `auth` |
| `src/db/*`, `database/*` | `database` |
| `tests/*`, `__tests__/*` | `testing` |
| `docs/*` | `docs` |
| `.planning/*` | `planning` |
| `scripts/*`, `bin/*` | `tooling` |
| ไม่มีไฟล์หรือไม่ชัดเจน | `general` |

ใช้ area ที่มีอยู่จาก step 2 ถ้าตรงกัน
</step>

<step name="check_duplicates">
```bash
grep -l -i "[key words from title]" .planning/todos/pending/*.md 2>/dev/null
```

ถ้าพบ todo ที่อาจซ้ำ:
1. อ่าน todo ที่มีอยู่
2. เปรียบเทียบ scope

ถ้าซ้อนทับกัน ใช้ AskUserQuestion:
- header: "ซ้ำกัน?"
- question: "มี todo คล้ายกัน: [title] จะทำอย่างไร?"
- options:
  - "ข้าม" — เก็บ todo เดิมไว้
  - "แทนที่" — อัพเดท todo เดิมด้วย context ใหม่
  - "เพิ่มอยู่ดี" — สร้างเป็น todo แยก
</step>

<step name="create_file">
```bash
timestamp=$(date "+%Y-%m-%dT%H:%M")
date_prefix=$(date "+%Y-%m-%d")
```

สร้าง slug จาก title (lowercase, hyphens, ไม่มีอักขระพิเศษ)

เขียนไปที่ `.planning/todos/pending/${date_prefix}-${slug}.md`:

```markdown
---
created: [timestamp]
title: [title]
area: [area]
files:
  - [file:lines]
---

## Problem

[คำอธิบายปัญหา - ให้ context พอที่ Claude ในอนาคตจะเข้าใจได้หลังจากผ่านไปหลายสัปดาห์]

## Solution

[แนวทางแก้ไข หรือ "TBD"]
```
</step>

<step name="update_state">
ถ้ามี `.planning/STATE.md`:

1. นับ todos: `ls .planning/todos/pending/*.md 2>/dev/null | wc -l`
2. อัพเดท "### Pending Todos" ใน "## Accumulated Context"
</step>

<step name="git_commit">
Commit todo และ state ที่อัพเดท:

```bash
git add .planning/todos/pending/[filename]
[ -f .planning/STATE.md ] && git add .planning/STATE.md
git commit -m "$(cat <<'EOF'
docs: capture todo - [title]

Area: [area]
EOF
)"
```

ยืนยัน: "Committed: docs: capture todo - [title]"
</step>

<step name="confirm">
```
Todo บันทึกแล้ว: .planning/todos/pending/[filename]

  [title]
  Area: [area]
  Files: [count] referenced

---

ต้องการ:

1. ทำงานปัจจุบันต่อ
2. เพิ่ม todo อีก
3. ดู todos ทั้งหมด (/gsd:check-todos)
```
</step>

</process>

<output>
- `.planning/todos/pending/[date]-[slug].md`
- อัพเดท `.planning/STATE.md` (ถ้ามี)
</output>

<anti_patterns>
- อย่าสร้าง todos สำหรับงานใน plan ปัจจุบัน (นั่นคือ deviation rule territory)
- อย่าสร้าง solution sections ที่ซับซ้อน — บันทึกไอเดีย ไม่ใช่ plans
- อย่าติดขัดเรื่องข้อมูลที่ขาด — "TBD" ก็พอ
</anti_patterns>

<success_criteria>
- [ ] โครงสร้างโฟลเดอร์มีอยู่
- [ ] สร้างไฟล์ todo ด้วย frontmatter ที่ถูกต้อง
- [ ] Problem section มี context พอสำหรับ Claude ในอนาคต
- [ ] ไม่ซ้ำ (ตรวจสอบและแก้ไขแล้ว)
- [ ] Area สอดคล้องกับ todos ที่มีอยู่
- [ ] อัพเดท STATE.md แล้ว ถ้ามี
- [ ] Commit todo และ state ไปยัง git แล้ว
</success_criteria>
