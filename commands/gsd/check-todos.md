---
name: gsd:check-todos
description: แสดงรายการ todos ที่รอดำเนินการและเลือกงานที่จะทำ
argument-hint: [area filter]
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - AskUserQuestion
---

<objective>
แสดงรายการ todos ที่รอดำเนินการทั้งหมด ให้เลือก โหลด context เต็มสำหรับ todo ที่เลือก และนำไปสู่ action ที่เหมาะสม

เปิดใช้การ review ไอเดียที่บันทึกไว้และตัดสินใจว่าจะทำงานอะไรต่อ
</objective>

<context>
@.planning/STATE.md
@.planning/ROADMAP.md
</context>

<process>

<step name="check_exist">
```bash
TODO_COUNT=$(ls .planning/todos/pending/*.md 2>/dev/null | wc -l | tr -d ' ')
echo "Pending todos: $TODO_COUNT"
```

ถ้า count เป็น 0:
```
ไม่มี todos ที่รอดำเนินการ

Todos ถูกบันทึกระหว่างทำงานด้วย /gsd:add-todo

---

ต้องการ:

1. ทำ phase ปัจจุบันต่อ (/gsd:progress)
2. เพิ่ม todo ตอนนี้ (/gsd:add-todo)
```

ออกจากคำสั่ง
</step>

<step name="parse_filter">
ตรวจสอบ area filter ใน arguments:
- `/gsd:check-todos` → แสดงทั้งหมด
- `/gsd:check-todos api` → กรองเฉพาะ area:api
</step>

<step name="list_todos">
```bash
for file in .planning/todos/pending/*.md; do
  created=$(grep "^created:" "$file" | cut -d' ' -f2)
  title=$(grep "^title:" "$file" | cut -d':' -f2- | xargs)
  area=$(grep "^area:" "$file" | cut -d' ' -f2)
  echo "$created|$title|$area|$file"
done | sort
```

ใช้ area filter ถ้าระบุ แสดงเป็นรายการมีหมายเลข:

```
Todos ที่รอดำเนินการ:

1. Add auth token refresh (api, 2 วันก่อน)
2. Fix modal z-index issue (ui, 1 วันก่อน)
3. Refactor database connection pool (database, 5 ชม.ก่อน)

---

ตอบด้วยหมายเลขเพื่อดูรายละเอียด หรือ:
- `/gsd:check-todos [area]` เพื่อกรองตาม area
- `q` เพื่อออก
```

แสดงเวลาเป็น relative time
</step>

<step name="handle_selection">
รอผู้ใช้ตอบด้วยหมายเลข

ถ้าถูกต้อง: โหลด todo ที่เลือก ดำเนินการต่อ
ถ้าไม่ถูกต้อง: "เลือกไม่ถูกต้อง ตอบด้วยหมายเลข (1-[N]) หรือ `q` เพื่อออก"
</step>

<step name="load_context">
อ่านไฟล์ todo ทั้งหมด แสดง:

```
## [title]

**Area:** [area]
**Created:** [date] ([relative time] ก่อน)
**Files:** [list หรือ "ไม่มี"]

### Problem
[เนื้อหา problem section]

### Solution
[เนื้อหา solution section]
```

ถ้า `files` field มีรายการ ให้อ่านและสรุปแต่ละไฟล์
</step>

<step name="check_roadmap">
```bash
ls .planning/ROADMAP.md 2>/dev/null && echo "Roadmap exists"
```

ถ้ามี roadmap:
1. ตรวจสอบว่า area ของ todo ตรงกับ phase ที่จะทำ
2. ตรวจสอบว่า files ของ todo ซ้อนทับกับ scope ของ phase
3. จดบันทึกถ้าตรงกัน สำหรับ action options
</step>

<step name="offer_actions">
**ถ้า todo ตรงกับ roadmap phase:**

ใช้ AskUserQuestion:
- header: "Action"
- question: "Todo นี้เกี่ยวข้องกับ Phase [N]: [name] จะทำอย่างไร?"
- options:
  - "ทำตอนนี้" — ย้ายไป done, เริ่มทำงาน
  - "เพิ่มใน phase plan" — รวมไว้ตอนวางแผน Phase [N]
  - "ระดมความคิด" — คิดก่อนตัดสินใจ
  - "เก็บไว้ก่อน" — กลับไปที่รายการ

**ถ้าไม่ตรงกับ roadmap:**

ใช้ AskUserQuestion:
- header: "Action"
- question: "จะทำอย่างไรกับ todo นี้?"
- options:
  - "ทำตอนนี้" — ย้ายไป done, เริ่มทำงาน
  - "สร้าง phase" — /gsd:add-phase ด้วย scope นี้
  - "ระดมความคิด" — คิดก่อนตัดสินใจ
  - "เก็บไว้ก่อน" — กลับไปที่รายการ
</step>

<step name="execute_action">
**ทำตอนนี้:**
```bash
mv ".planning/todos/pending/[filename]" ".planning/todos/done/"
```
อัพเดท STATE.md todo count แสดง problem/solution context เริ่มทำงานหรือถามว่าจะดำเนินการอย่างไร

**เพิ่มใน phase plan:**
จดบันทึก todo reference ใน phase planning notes เก็บไว้ใน pending กลับไปที่รายการหรือออก

**สร้าง phase:**
แสดง: `/gsd:add-phase [description from todo]`
เก็บไว้ใน pending ผู้ใช้รันคำสั่งใน fresh context

**ระดมความคิด:**
เก็บไว้ใน pending เริ่มพูดคุยเกี่ยวกับปัญหาและแนวทาง

**เก็บไว้ก่อน:**
กลับไปที่ list_todos step
</step>

<step name="update_state">
หลังจาก action ที่เปลี่ยน todo count:

```bash
ls .planning/todos/pending/*.md 2>/dev/null | wc -l
```

อัพเดท STATE.md "### Pending Todos" section ถ้ามี
</step>

<step name="git_commit">
ถ้า todo ถูกย้ายไป done/ ให้ commit การเปลี่ยนแปลง:

```bash
git add .planning/todos/done/[filename]
git rm --cached .planning/todos/pending/[filename] 2>/dev/null || true
[ -f .planning/STATE.md ] && git add .planning/STATE.md
git commit -m "$(cat <<'EOF'
docs: start work on todo - [title]

Moved to done/, beginning implementation.
EOF
)"
```

ยืนยัน: "Committed: docs: start work on todo - [title]"
</step>

</process>

<output>
- ย้าย todo ไปยัง `.planning/todos/done/` (ถ้า "ทำตอนนี้")
- อัพเดท `.planning/STATE.md` (ถ้า todo count เปลี่ยน)
</output>

<anti_patterns>
- อย่าลบ todos — ย้ายไป done/ เมื่อเริ่มทำงาน
- อย่าเริ่มทำงานโดยไม่ย้ายไป done/ ก่อน
- อย่าสร้าง plans จากคำสั่งนี้ — route ไป /gsd:plan-phase หรือ /gsd:add-phase
</anti_patterns>

<success_criteria>
- [ ] แสดงรายการ todos ที่รอดำเนินการทั้งหมดพร้อม title, area, age
- [ ] ใช้ area filter ถ้าระบุ
- [ ] โหลด full context ของ todo ที่เลือก
- [ ] ตรวจสอบ roadmap context สำหรับ phase match
- [ ] เสนอ actions ที่เหมาะสม
- [ ] ดำเนินการ action ที่เลือก
- [ ] อัพเดท STATE.md ถ้า todo count เปลี่ยน
- [ ] Commit changes ไปยัง git (ถ้า todo ย้ายไป done/)
</success_criteria>
