---
name: gsd:new-project
description: เริ่มต้นโปรเจกต์ใหม่ด้วยการรวบรวม context อย่างลึกและ PROJECT.md
allowed-tools:
  - Read
  - Bash
  - Write
  - AskUserQuestion
---

<objective>

เริ่มต้นโปรเจกต์ใหม่ผ่านการรวบรวม context อย่างครอบคลุม

นี่คือช่วงเวลาที่มี leverage มากที่สุดในโปรเจกต์ใดๆ การถามคำถามลึกตรงนี้หมายถึงแผนที่ดีกว่า การดำเนินการที่ดีกว่า ผลลัพธ์ที่ดีกว่า

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

**ขั้นตอนแรกที่บังคับ — รันการตรวจสอบเหล่านี้ก่อนการโต้ตอบกับ user:**

1. **ยกเลิกถ้าโปรเจกต์มีอยู่แล้ว:**
   ```bash
   [ -f .planning/PROJECT.md ] && echo "ERROR: Project already initialized. Use /gsd:progress" && exit 1
   ```

2. **Initialize git repo ใน directory นี้** (required แม้จะอยู่ใน parent repo):
   ```bash
   # ตรวจสอบว่า directory นี้เป็น git repo root แล้วหรือไม่ (รองรับ .git file สำหรับ worktrees ด้วย)
   if [ -d .git ] || [ -f .git ]; then
       echo "Git repo exists in current directory"
   else
       git init
       echo "Initialized new git repo"
   fi
   ```

3. **ตรวจจับโค้ดที่มีอยู่ (brownfield detection):**
   ```bash
   # ตรวจสอบไฟล์โค้ดที่มีอยู่
   CODE_FILES=$(find . -name "*.ts" -o -name "*.js" -o -name "*.py" -o -name "*.go" -o -name "*.rs" -o -name "*.swift" -o -name "*.java" 2>/dev/null | grep -v node_modules | grep -v .git | head -20)
   HAS_PACKAGE=$([ -f package.json ] || [ -f requirements.txt ] || [ -f Cargo.toml ] || [ -f go.mod ] || [ -f Package.swift ] && echo "yes")
   HAS_CODEBASE_MAP=$([ -d .planning/codebase ] && echo "yes")
   ```

   **คุณต้องรัน bash commands ทั้งหมดด้านบนโดยใช้ Bash tool ก่อนดำเนินการต่อ**

</step>

<step name="brownfield_offer">

**ถ้าตรวจพบโค้ดที่มีอยู่และ .planning/codebase/ ไม่มี:**

ตรวจสอบผลลัพธ์จาก setup step:
- ถ้า `CODE_FILES` ไม่ว่างเปล่า หรือ `HAS_PACKAGE` เป็น "yes"
- และ `HAS_CODEBASE_MAP` ไม่ใช่ "yes"

ใช้ AskUserQuestion:
- header: "Existing Code"
- question: "ตรวจพบโค้ดที่มีอยู่ใน directory นี้ คุณต้องการ map codebase ก่อนไหม?"
- options:
  - "Map codebase first" — รัน /gsd:map-codebase เพื่อเข้าใจ architecture ที่มีอยู่ (แนะนำ)
  - "Skip mapping" — ดำเนินการ project initialization ต่อ

**ถ้า "Map codebase first":**
```
รัน `/gsd:map-codebase` ก่อน จากนั้นกลับมาที่ `/gsd:new-project`
```
ออกจากคำสั่ง

**ถ้า "Skip mapping":** ดำเนินการต่อไปที่ question step

**ถ้าไม่ตรวจพบโค้ดที่มีอยู่ หรือ codebase ถูก map แล้ว:** ดำเนินการต่อไปที่ question step

</step>

<step name="question">

**1. Open (FREEFORM — ห้ามใช้ AskUserQuestion):**

ถามแบบ inline: "คุณต้องการสร้างอะไร?"

รอการตอบแบบ freeform ของพวกเขา สิ่งนี้ให้ context ที่ต้องการเพื่อถามคำถาม follow-up อย่างชาญฉลาด

**2. Follow the thread (ตอนนี้ใช้ AskUserQuestion):**

ตาม response ของพวกเขา ใช้ AskUserQuestion พร้อม options ที่สอบถามสิ่งที่พวกเขาพูดถึง:
- header: "[Topic ที่พวกเขาพูดถึง]"
- question: "คุณพูดถึง [X] — จะมีหน้าตาอย่างไร?"
- options: 2-3 interpretations + "Something else"

**3. Sharpen the core:**

ใช้ AskUserQuestion:
- header: "Core"
- question: "ถ้าคุณทำได้แค่อย่างเดียวให้สมบูรณ์ จะเป็นอะไร?"
- options: Key aspects ที่พวกเขาพูดถึง + "All equally important" + "Something else"

**4. Find boundaries:**

ใช้ AskUserQuestion:
- header: "Scope"
- question: "อะไรที่ไม่อยู่ใน v1 อย่างชัดเจน?"
- options: สิ่งที่อาจน่าดึงดูด + "Nothing specific" + "Let me list them"

**5. Ground in reality:**

ใช้ AskUserQuestion:
- header: "Constraints"
- question: "มีข้อจำกัดที่ตายตัวไหม?"
- options: ประเภทข้อจำกัดที่เกี่ยวข้อง + "None" + "Yes, let me explain"

**6. Decision gate:**

ใช้ AskUserQuestion:
- header: "Ready?"
- question: "พร้อมสร้าง PROJECT.md หรือสำรวจเพิ่มเติม?"
- options (ต้องมีครบทั้ง 3):
  - "Create PROJECT.md" — สรุปและดำเนินการต่อ
  - "Ask more questions" — ฉันจะถามลึกขึ้น
  - "Let me add context" — คุณมีเพิ่มเติมจะแชร์

ถ้า "Ask more questions" → ตรวจสอบ coverage gaps จาก `questioning.md` → กลับไป step 2
ถ้า "Let me add context" → รับ input ผ่าน response ของพวกเขา → กลับไป step 2
วนซ้ำจนกว่า "Create PROJECT.md" ถูกเลือก

</step>

<step name="project">

สังเคราะห์ context ทั้งหมดลงใน `.planning/PROJECT.md` โดยใช้ template จาก `templates/project.md`

**สำหรับโปรเจกต์ greenfield:**

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

- [Exclusion 1] — [why]
- [Exclusion 2] — [why]
```

Active requirements ทั้งหมดเป็น hypotheses จนกว่าจะ shipped และ validated

**สำหรับโปรเจกต์ brownfield (codebase map มีอยู่):**

อนุมาน Validated requirements จากโค้ดที่มีอยู่:

1. อ่าน `.planning/codebase/ARCHITECTURE.md` และ `STACK.md`
2. ระบุสิ่งที่ codebase ทำอยู่แล้ว
3. สิ่งเหล่านี้กลายเป็น Validated set เริ่มต้น

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

- [Exclusion 1] — [why]
```

**Key Decisions:**

Initialize ด้วย decisions ที่ทำระหว่างการถามคำถาม:

```markdown
## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| [Choice from questioning] | [Why] | — Pending |
```

**Last updated footer:**

```markdown
---
*Last updated: [date] after initialization*
```

อย่าบีบอัด จับทุกอย่างที่รวบรวมได้

</step>

<step name="mode">

ถาม workflow mode preference:

ใช้ AskUserQuestion:

- header: "Mode"
- question: "คุณต้องการทำงานอย่างไร?"
- options:
  - "Interactive" — ยืนยันในแต่ละขั้นตอน
  - "YOLO" — Auto-approve, แค่ดำเนินการ

</step>

<step name="depth">

ถาม planning depth preference:

ใช้ AskUserQuestion:

- header: "Depth"
- question: "การวางแผนควรละเอียดแค่ไหน?"
- options:
  - "Quick" — Ship เร็ว, minimal phases/plans (3-5 phases, 1-3 plans each)
  - "Standard" — Balanced scope และ speed (5-8 phases, 3-5 plans each)
  - "Comprehensive" — Thorough coverage, more phases/plans (8-12 phases, 5-10 plans each)

**Depth ควบคุม compression tolerance ไม่ใช่ artificial inflation** ทุก depths ใช้ 2-3 tasks ต่อแผน Comprehensive หมายถึง "อย่าบีบอัดงานที่ซับซ้อน"—ไม่ได้หมายถึง "pad งานง่ายเพื่อให้ได้ตัวเลข"

</step>

<step name="parallelization">

ถาม parallel execution preference:

ใช้ AskUserQuestion:

- header: "Parallelization"
- question: "เปิดใช้ parallel phase execution?"
- options:
  - "Enabled" — รันแผนอิสระแบบขนาน (แนะนำ)
  - "Disabled" — ดำเนินการแผนตามลำดับ

**Parallelization ให้ `/gsd:execute-phase` spawn agents หลายตัวสำหรับแผนอิสระ** มีประโยชน์สำหรับการดำเนินการแบบ "walk away, come back to completed work" สามารถเปลี่ยนได้ภายหลังใน config.json

</step>

<step name="config">

สร้าง `.planning/config.json` ด้วย mode, depth และ parallelization ที่เลือกโดยใช้โครงสร้าง `templates/config.json`

</step>

<step name="commit">

```bash
git add .planning/PROJECT.md .planning/config.json
git commit -m "$(cat <<'EOF'
docs: initialize [project-name]

[One-liner from PROJECT.md]

Creates PROJECT.md with requirements and constraints.
EOF
)"
```

</step>

<step name="done">

แสดงความสมบูรณ์พร้อมขั้นตอนถัดไป (ดู ~/.claude/get-shit-done/references/continuation-format.md):

```
Project initialized:

- Project: .planning/PROJECT.md
- Config: .planning/config.json (mode: [chosen mode])
[If .planning/codebase/ exists:] - Codebase: .planning/codebase/ (7 documents)

---

## ▶ Next Up

**[Project Name]** — create roadmap

`/gsd:create-roadmap`

<sub>`/clear` first → fresh context window</sub>

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
- [ ] PROJECT.md จับ full context พร้อมโครงสร้าง evolutionary
- [ ] Requirements initialized เป็น hypotheses (greenfield) หรือมี inferred Validated (brownfield)
- [ ] Key Decisions table initialized
- [ ] config.json มี workflow mode, depth และ parallelization
- [ ] ทั้งหมด committed ไปยัง git

</success_criteria>
