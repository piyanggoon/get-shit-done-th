---
name: gsd:new-project
description: Initialize โปรเจคใหม่ด้วย deep context gathering และ PROJECT.md
allowed-tools:
  - Read
  - Bash
  - Write
  - AskUserQuestion
---

<objective>

Initialize โปรเจคใหม่ผ่าน comprehensive context gathering

นี่คือช่วงเวลาที่มี leverage มากที่สุดในโปรเจคไหนๆ การถามคำถามลึกตรงนี้หมายถึง plans ที่ดีกว่า, execution ที่ดีกว่า, outcomes ที่ดีกว่า

สร้าง `.planning/` พร้อม PROJECT.md และ config.json

</objective>

<execution_context>

@~/.claude/get-shit-done/references/principles.md
@~/.claude/get-shit-done/references/questioning.md
@~/.claude/get-shit-done/templates/project.md
@~/.claude/get-shit-done/templates/config.json

</execution_context>

<process>

<step name="setup">

**ขั้นตอนแรกบังคับ — Execute checks เหล่านี้ก่อนการโต้ตอบกับผู้ใช้:**

1. **ยกเลิกถ้าโปรเจคมีอยู่แล้ว:**
   ```bash
   [ -f .planning/PROJECT.md ] && echo "ERROR: โปรเจค initialized แล้ว ใช้ /gsd:progress" && exit 1
   ```

2. **Initialize git repo ในโฟลเดอร์นี้** (required แม้จะอยู่ใน parent repo):
   ```bash
   # ตรวจสอบว่าโฟลเดอร์นี้เป็น git repo root แล้วหรือยัง (รวม .git file สำหรับ worktrees)
   if [ -d .git ] || [ -f .git ]; then
       echo "Git repo มีอยู่ในโฟลเดอร์ปัจจุบัน"
   else
       git init
       echo "Initialized git repo ใหม่"
   fi
   ```

3. **ตรวจจับ existing code (brownfield detection):**
   ```bash
   # ตรวจสอบ existing code files
   CODE_FILES=$(find . -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.go" -o -name "*.rs" -o -name "*.swift" -o -name "*.java" 2>/dev/null | grep -v node_modules | grep -v .git | head -20)
   HAS_PACKAGE=$([ -f package.json ] || [ -f requirements.txt ] || [ -f Cargo.toml ] || [ -f go.mod ] || [ -f Package.swift ] && echo "yes")
   HAS_CODEBASE_MAP=$([ -d .planning/codebase ] && echo "yes")
   ```

   **คุณต้องรัน bash commands ทั้งหมดข้างบนโดยใช้ Bash tool ก่อนดำเนินการต่อ**

</step>

<step name="brownfield_offer">

**ถ้าตรวจพบ existing code และไม่มี .planning/codebase/:**

ตรวจสอบผลลัพธ์จาก setup step:
- ถ้า `CODE_FILES` ไม่ว่าง หรือ `HAS_PACKAGE` เป็น "yes"
- และ `HAS_CODEBASE_MAP` ไม่ใช่ "yes"

ใช้ AskUserQuestion:
- header: "Existing Code"
- question: "ผมตรวจพบ existing code ในโฟลเดอร์นี้ ต้องการ map codebase ก่อนไหม?"
- options:
  - "Map codebase ก่อน" — รัน /gsd:map-codebase เพื่อเข้าใจ architecture ที่มีอยู่ (แนะนำ)
  - "ข้าม mapping" — ดำเนินการ project initialization ต่อ

**ถ้า "Map codebase ก่อน":**
```
รัน `/gsd:map-codebase` ก่อน แล้วกลับมา `/gsd:new-project`
```
ออกจากคำสั่ง

**ถ้า "ข้าม mapping":** ไปขั้นตอน question ต่อ

**ถ้าไม่ตรวจพบ existing code หรือ codebase mapped แล้ว:** ไปขั้นตอน question ต่อ

</step>

<step name="question">

**1. Open (FREEFORM — อย่าใช้ AskUserQuestion):**

ถาม inline: "คุณต้องการสร้างอะไร?"

รอคำตอบ freeform ของเขา นี่ให้ context ที่คุณต้องการเพื่อถามคำถาม follow-up ที่ฉลาด

**2. Follow the thread (ตอนนี้ใช้ AskUserQuestion):**

ตามคำตอบของเขา ใช้ AskUserQuestion พร้อม options ที่ probe สิ่งที่เขาพูดถึง:
- header: "[Topic ที่เขาพูดถึง]"
- question: "คุณพูดถึง [X] — มันจะดูเป็นอย่างไร?"
- options: 2-3 interpretations + "อย่างอื่น"

**3. Sharpen the core:**

ใช้ AskUserQuestion:
- header: "Core"
- question: "ถ้าทำได้แค่อย่างเดียวให้ดี จะเป็นอะไร?"
- options: Key aspects ที่เขาพูดถึง + "สำคัญเท่ากันหมด" + "อย่างอื่น"

**4. Find boundaries:**

ใช้ AskUserQuestion:
- header: "Scope"
- question: "อะไรที่ไม่อยู่ใน v1 อย่างชัดเจน?"
- options: สิ่งที่อาจจะ tempting + "ไม่มีเฉพาะ" + "ขอบอก"

**5. Ground in reality:**

ใช้ AskUserQuestion:
- header: "Constraints"
- question: "มี hard constraints อะไรไหม?"
- options: Constraint types ที่เกี่ยวข้อง + "ไม่มี" + "มี ขออธิบาย"

**6. Decision gate:**

ใช้ AskUserQuestion:
- header: "พร้อม?"
- question: "พร้อมสร้าง PROJECT.md หรือสำรวจเพิ่ม?"
- options (ต้องมีทั้ง 3):
  - "สร้าง PROJECT.md" — Finalize และดำเนินการต่อ
  - "ถามเพิ่ม" — ผมจะขุดลึกกว่านี้
  - "ขอเพิ่ม context" — คุณมีเรื่องจะเล่าอีก

ถ้า "ถามเพิ่ม" → ตรวจสอบ coverage gaps จาก `questioning.md` → กลับไป step 2
ถ้า "ขอเพิ่ม context" → รับ input จากคำตอบของเขา → กลับไป step 2
Loop จนกว่าจะเลือก "สร้าง PROJECT.md"

</step>

<step name="project">

สังเคราะห์ context ทั้งหมดเป็น `.planning/PROJECT.md` โดยใช้ template จาก `templates/project.md`

**สำหรับ greenfield projects:**

Initialize requirements เป็น hypotheses:

```markdown
## Requirements

### Validated

(ยังไม่มี — ship เพื่อ validate)

### Active

- [ ] [Requirement 1]
- [ ] [Requirement 2]
- [ ] [Requirement 3]

### Out of Scope

- [Exclusion 1] — [ทำไม]
- [Exclusion 2] — [ทำไม]
```

Active requirements ทั้งหมดเป็น hypotheses จนกว่าจะ shipped และ validated

**สำหรับ brownfield projects (มี codebase map):**

Infer Validated requirements จาก existing code:

1. อ่าน `.planning/codebase/ARCHITECTURE.md` และ `STACK.md`
2. ระบุว่า codebase ทำอะไรได้แล้ว
3. เหล่านี้กลายเป็น initial Validated set

```markdown
## Requirements

### Validated

- ✓ [Existing capability 1] — existing
- ✓ [Existing capability 2] — existing
- ✓ [Existing capability 3] — existing

### Active

- [ ] [New requirement 1]
- [ ] [New requirement 2]

### Out of Scope

- [Exclusion 1] — [ทำไม]
```

**Key Decisions:**

Initialize ด้วย decisions ที่ทำระหว่าง questioning:

```markdown
## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| [Choice จากการถาม] | [ทำไม] | — Pending |
```

**Last updated footer:**

```markdown
---
*Last updated: [date] after initialization*
```

อย่า compress บันทึกทุกอย่างที่รวบรวม

</step>

<step name="mode">

ถาม workflow mode preference:

ใช้ AskUserQuestion:

- header: "Mode"
- question: "คุณต้องการทำงานอย่างไร?"
- options:
  - "Interactive" — ยืนยันทุกขั้นตอน
  - "YOLO" — Auto-approve, execute เลย

</step>

<step name="depth">

ถาม planning depth preference:

ใช้ AskUserQuestion:

- header: "Depth"
- question: "การวางแผนควรละเอียดแค่ไหน?"
- options:
  - "Quick" — Ship เร็ว, minimal phases/plans (3-5 phases, 1-3 plans แต่ละ)
  - "Standard" — Balance scope กับ speed (5-8 phases, 3-5 plans แต่ละ)
  - "Comprehensive" — ครอบคลุมทั่วถึง, phases/plans มากกว่า (8-12 phases, 5-10 plans แต่ละ)

**Depth ควบคุม compression tolerance ไม่ใช่ artificial inflation** ทุก depths ใช้ 2-3 tasks ต่อ plan Comprehensive หมายถึง "อย่า compress complex work" — ไม่ได้หมายถึง "pad simple work ให้ถึงตัวเลข"

สร้าง `.planning/config.json` ด้วย mode และ depth ที่เลือกโดยใช้ `templates/config.json` structure

</step>

<step name="commit">

```bash
git add .planning/PROJECT.md .planning/config.json
git commit -m "$(cat <<'EOF'
docs: initialize [project-name]

[One-liner จาก PROJECT.md]

Creates PROJECT.md with requirements and constraints.
EOF
)"
```

</step>

<step name="done">

แสดงสรุปพร้อมขั้นตอนถัดไป (ดู ~/.claude/get-shit-done/references/continuation-format.md):

```
โปรเจค initialized แล้ว:

- Project: .planning/PROJECT.md
- Config: .planning/config.json (mode: [chosen mode])
[ถ้ามี .planning/codebase/:] - Codebase: .planning/codebase/ (7 documents)

---

## ▶ ถัดไป

**[Project Name]** — สร้าง roadmap

`/gsd:create-roadmap`

<sub>`/clear` ก่อน → เริ่ม context window ใหม่</sub>

---
```

</step>

</process>

<output>

- `.planning/PROJECT.md`
- `.planning/config.json`

</output>

<success_criteria>

- [ ] Deep questioning เสร็จสมบูรณ์ (ไม่รีบ)
- [ ] PROJECT.md บันทึก full context พร้อม evolutionary structure
- [ ] Requirements initialized เป็น hypotheses (greenfield) หรือ inferred Validated (brownfield)
- [ ] Key Decisions table initialized
- [ ] config.json มี workflow mode
- [ ] Commit ทั้งหมดไปยัง git

</success_criteria>
