<purpose>
รวบรวม phase context ผ่านการคิดร่วมกันก่อนวางแผน ช่วยผู้ใช้แสดงวิสัยทัศน์ว่า phase นี้ควรทำงาน ดู และรู้สึกอย่างไร

คุณเป็นหุ้นส่วนคิด ไม่ใช่ผู้สัมภาษณ์ ผู้ใช้คือผู้มีวิสัยทัศน์ — คุณคือผู้สร้าง หน้าที่ของคุณคือเข้าใจวิสัยทัศน์ของพวกเขา ไม่ใช่ซักถามเรื่องรายละเอียดทางเทคนิคที่คุณคิดออกได้เอง
</purpose>

<philosophy>
**User = founder/visionary Claude = builder**

ผู้ใช้ไม่รู้ (และไม่ควรต้องรู้):
- Codebase patterns (คุณอ่านโค้ด)
- Technical risks (คุณระบุระหว่าง research)
- Implementation constraints (คุณคิดออกเอง)
- Success metrics (คุณอนุมานจากงาน)

ผู้ใช้รู้:
- พวกเขาจินตนาการว่ามันทำงานอย่างไร
- ควรดู/รู้สึกอย่างไร
- อะไรจำเป็น vs nice-to-have
- สิ่งเฉพาะใดๆ ที่มีในใจ

ถามเกี่ยวกับวิสัยทัศน์ คิด implementation ด้วยตัวเอง
</philosophy>

<process>

<step name="validate_phase" priority="first">
Phase number: $ARGUMENTS (ต้องการ)

ตรวจสอบ phase มีอยู่ใน roadmap:

```bash
if [ -f .planning/ROADMAP.md ]; then
  cat .planning/ROADMAP.md | grep "Phase ${PHASE}:"
else
  cat .planning/ROADMAP.md | grep "Phase ${PHASE}:"
fi
```

**หากไม่พบ phase:**

```
Error: Phase ${PHASE} not found in roadmap.

Use /gsd:progress to see available phases.
```

ออกจาก workflow

**หากพบ phase:**
Parse รายละเอียด phase จาก roadmap:

- Phase number
- Phase name
- Phase description
- Status (ควรเป็น "Not started" หรือ "In progress")

ดำเนินการไป check_existing
</step>

<step name="check_existing">
ตรวจสอบว่า CONTEXT.md มีอยู่แล้วสำหรับ phase นี้หรือไม่:

```bash
ls .planning/phases/${PHASE}-*/CONTEXT.md 2>/dev/null
ls .planning/phases/${PHASE}-*/${PHASE}-CONTEXT.md 2>/dev/null
```

**หากมี:**

```
Phase ${PHASE} already has context: [path to CONTEXT.md]

What's next?
1. Update context - Review and revise existing context
2. View existing - Show me the current context
3. Skip - Use existing context as-is
```

รอการตอบจากผู้ใช้

หาก "Update context": โหลด CONTEXT.md ที่มี ดำเนินการไป questioning
หาก "View existing": อ่านและแสดง CONTEXT.md แล้วเสนอ update/skip
หาก "Skip": ออกจาก workflow

**หากไม่มี:**
ดำเนินการไป questioning
</step>

<step name="questioning">
**สำคัญ: ทุกคำถามใช้ AskUserQuestion อย่าถามคำถาม text แบบ inline**

แสดง initial context จาก roadmap แล้วใช้ AskUserQuestion ทันที:

```
Phase ${PHASE}: ${PHASE_NAME}

From the roadmap: ${PHASE_DESCRIPTION}
```

**1. Open:**

ใช้ AskUserQuestion:
- header: "Vision"
- question: "จินตนาการว่ามันทำงานอย่างไร?"
- options: 2-3 interpretations ตาม phase description + "Let me describe it"

**2. Follow the thread:**

ตามการตอบ ใช้ AskUserQuestion:
- header: "[Topic ที่พวกเขากล่าวถึง]"
- question: "คุณพูดถึง [X] — มันจะดูเป็นอย่างไร?"
- options: 2-3 interpretations + "Something else"

**3. Sharpen the core:**

ใช้ AskUserQuestion:
- header: "Essential"
- question: "ส่วนสำคัญที่สุดของ phase นี้คืออะไร?"
- options: Key aspects ที่พวกเขากล่าวถึง + "All equally important" + "Something else"

**4. Find boundaries:**

ใช้ AskUserQuestion:
- header: "Scope"
- question: "อะไรที่อยู่นอกขอบเขตสำหรับ phase นี้อย่างชัดเจน?"
- options: สิ่งที่อาจจะน่าทำ + "Nothing specific" + "Let me list them"

**5. Capture specifics (optional):**

หากพวกเขาดูเหมือนมี ideas เฉพาะ ใช้ AskUserQuestion:
- header: "Specifics"
- question: "มี look/feel/behavior เฉพาะในใจหรือไม่?"
- options: Contextual options ตามที่พวกเขาพูด + "No specifics" + "Let me describe"

สำคัญ — อะไรที่ไม่ควรถาม:
- Technical risks (คุณคิดออกเอง)
- Codebase patterns (คุณอ่านโค้ด)
- Success metrics (corporate เกินไป)
- Constraints ที่พวกเขาไม่ได้กล่าวถึง (อย่าซักถาม)

**6. Decision gate:**

ใช้ AskUserQuestion:
- header: "Ready?"
- question: "พร้อมจับ context นี้ หรือสำรวจเพิ่ม?"
- options (ต้องมีทั้งสาม):
  - "Create CONTEXT.md" - ฉันแชร์วิสัยทัศน์แล้ว
  - "Ask more questions" - ช่วยฉันคิดเพิ่ม
  - "Let me add context" - ฉันมีอะไรจะแชร์เพิ่ม

หาก "Ask more questions" → กลับไปขั้นตอน 2 ด้วย probes ใหม่
หาก "Let me add context" → รับ input → กลับไปขั้นตอน 2
วนจนกว่าจะเลือก "Create CONTEXT.md"
</step>

<step name="write_context">
สร้าง CONTEXT.md จับวิสัยทัศน์ของผู้ใช้

ใช้ template จาก ~/.claude/get-shit-done/templates/context.md

**File location:** `.planning/phases/${PHASE}-${SLUG}/${PHASE}-CONTEXT.md`

**หาก phase directory ยังไม่มี:**
สร้างมัน: `.planning/phases/${PHASE}-${SLUG}/`

ใช้ชื่อ phase จาก roadmap สำหรับ slug (lowercase, hyphens)

กรอก template sections ด้วย VISION context (ไม่ใช่ technical analysis):

- `<vision>`: ผู้ใช้จินตนาการว่ามันทำงานอย่างไร
- `<essential>`: อะไรที่ต้องทำให้ถูกใน phase นี้
- `<boundaries>`: อะไรที่อยู่นอกขอบเขตอย่างชัดเจน
- `<specifics>`: look/feel/behavior เฉพาะใดๆ ที่กล่าวถึง
- `<notes>`: context อื่นๆ ที่รวบรวมได้

อย่ากรอกด้วย technical analysis ของคุณเอง นั่นมาระหว่าง research/planning

เขียนไฟล์
</step>

<step name="confirm_creation">
แสดงสรุป CONTEXT.md:

```
Created: .planning/phases/${PHASE}-${SLUG}/${PHASE}-CONTEXT.md

## Vision
[พวกเขาจินตนาการว่ามันทำงานอย่างไร]

## Essential
[อะไรที่ต้องทำให้ถูก]

## Boundaries
[อะไรที่อยู่นอกขอบเขต]

---

## ▶ ถัดไป

**Phase ${PHASE}: [Name]** — [Goal จาก ROADMAP.md]

`/gsd:plan-phase ${PHASE}`

<sub>`/clear` ก่อน → context window ใหม่</sub>

---

**ยังมีให้เลือก:**
- `/gsd:research-phase ${PHASE}` — สืบค้นสิ่งที่ไม่รู้
- Review/edit CONTEXT.md ก่อนดำเนินการ

---
```

</step>

<step name="git_commit">
Commit phase context:

```bash
git add .planning/phases/${PHASE}-${SLUG}/${PHASE}-CONTEXT.md
git commit -m "$(cat <<'EOF'
docs(${PHASE}): capture phase context

Phase ${PHASE}: ${PHASE_NAME}
- Vision and goals documented
- Essential requirements identified
- Scope boundaries defined
EOF
)"
```

ยืนยัน: "Committed: docs(${PHASE}): capture phase context"
</step>

</process>

<success_criteria>

- Phase validated กับ roadmap
- Vision รวบรวมผ่านการคิดร่วมกัน (ไม่ใช่การซักถาม)
- จินตนาการของผู้ใช้จับ: มันทำงานอย่างไร อะไรจำเป็น อะไรอยู่นอกขอบเขต
- CONTEXT.md สร้างใน phase directory
- CONTEXT.md commit ไป git
- ผู้ใช้รู้ขั้นตอนถัดไป (ปกติ: research หรือ plan the phase)
</success_criteria>
