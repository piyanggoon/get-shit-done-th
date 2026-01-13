---
name: gsd:discuss-phase
description: รวบรวม context ของ phase ผ่านการถามคำถามแบบปรับตัวก่อนวางแผน
argument-hint: "[phase]"
---

<objective>
ช่วยผู้ใช้อธิบาย vision สำหรับ phase ผ่านการคิดร่วมกัน

วัตถุประสงค์: เข้าใจว่าผู้ใช้จินตนาการว่า phase นี้ทำงานอย่างไร — มันดูเป็นอย่างไร อะไรจำเป็น อะไรอยู่นอก scope คุณเป็น thinking partner ที่ช่วยให้เขา crystallize vision ของตัวเอง ไม่ใช่ผู้สัมภาษณ์ที่เก็บ technical requirements

Output: {phase}-CONTEXT.md ที่บันทึก vision ของผู้ใช้สำหรับ phase
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/discuss-phase.md
@~/.claude/get-shit-done/templates/context.md
</execution_context>

<context>
Phase number: $ARGUMENTS (required)

**โหลด project state ก่อน:**
@.planning/STATE.md

**โหลด roadmap:**
@.planning/ROADMAP.md
</context>

<process>
1. ตรวจสอบ phase number argument (error ถ้าไม่มีหรือไม่ถูกต้อง)
2. ตรวจสอบว่า phase มีอยู่ใน roadmap
3. ตรวจสอบว่า CONTEXT.md มีอยู่แล้วหรือไม่ (เสนอให้ update ถ้ามี)
4. ทำตาม discuss-phase.md workflow โดย**ทุกคำถามใช้ AskUserQuestion**:
   - แสดง phase จาก roadmap
   - ใช้ AskUserQuestion: "คุณจินตนาการว่ามันทำงานอย่างไร?" พร้อม interpretation options
   - ใช้ AskUserQuestion เพื่อตาม thread ของเขา — probe สิ่งที่เขาตื่นเต้น
   - ใช้ AskUserQuestion เพื่อ sharpen core — อะไรจำเป็นสำหรับ phase นี้
   - ใช้ AskUserQuestion เพื่อหา boundaries — อะไรอยู่นอก scope อย่างชัดเจน
   - ใช้ AskUserQuestion สำหรับ decision gate (พร้อม / ถามเพิ่ม / ขอเพิ่ม context)
   - สร้าง CONTEXT.md ที่บันทึก vision ของเขา
5. เสนอขั้นตอนถัดไป (research หรือ plan phase)

**สำคัญมาก: ทุกคำถามใช้ AskUserQuestion อย่าถามคำถาม inline text**

ผู้ใช้คือ visionary คุณคือ builder:
- ถามเรื่อง vision, feel, essential outcomes
- อย่าถามเรื่อง technical risks (คุณหาเอง)
- อย่าถามเรื่อง codebase patterns (คุณอ่าน code เอง)
- อย่าถามเรื่อง success metrics (formal เกินไป)
- อย่าซักถามเรื่อง constraints ที่เขาไม่ได้พูดถึง
</process>

<success_criteria>

- ตรวจสอบ phase กับ roadmap แล้ว
- รวบรวม vision ผ่านการคิดร่วมกัน (ไม่ใช่การซักถาม)
- CONTEXT.md บันทึก: มันทำงานอย่างไร, อะไรจำเป็น, อะไรอยู่นอก scope
- ผู้ใช้รู้ขั้นตอนถัดไป (research หรือ plan phase)
</success_criteria>
