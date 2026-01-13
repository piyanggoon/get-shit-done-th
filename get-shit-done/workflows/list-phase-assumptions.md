<purpose>
แสดงสมมติฐานของ Claude เกี่ยวกับ phase ก่อนวางแผน ช่วยให้ผู้ใช้แก้ไขความเข้าใจผิดได้เร็ว

ความแตกต่างหลักจาก discuss-phase: นี่คือการวิเคราะห์สิ่งที่ Claude คิด ไม่ใช่การรับข้อมูลสิ่งที่ผู้ใช้รู้ ไม่มี file output - เป็นการสนทนาเพื่อกระตุ้น discussion
</purpose>

<process>

<step name="validate_phase" priority="first">
Phase number: $ARGUMENTS (ต้องการ)

**หากไม่มี argument:**

```
Error: Phase number required.

Usage: /gsd:list-phase-assumptions [phase-number]
Example: /gsd:list-phase-assumptions 3
```

ออกจาก workflow

**หากมี argument:**
ตรวจสอบ phase มีอยู่ใน roadmap:

```bash
cat .planning/ROADMAP.md | grep -i "Phase ${PHASE}"
```

**หากไม่พบ phase:**

```
Error: Phase ${PHASE} not found in roadmap.

Available phases:
[list phases from roadmap]
```

ออกจาก workflow

**หากพบ phase:**
Parse รายละเอียด phase จาก roadmap:

- Phase number
- Phase name
- Phase description/goal
- Scope details ใดๆ ที่กล่าวถึง

ดำเนินการไป analyze_phase
</step>

<step name="analyze_phase">
ตามคำอธิบาย roadmap และ project context ระบุสมมติฐานในห้าด้าน:

**1. Technical Approach:**
Claude จะใช้ libraries, frameworks, patterns หรือ tools อะไร?
- "ฉันจะใช้ X library เพราะ..."
- "ฉันจะทำตาม Y pattern เพราะ..."
- "ฉันจะโครงสร้างนี้เป็น Z เพราะ..."

**2. Implementation Order:**
Claude จะสร้างอะไรก่อน สอง สาม?
- "ฉันจะเริ่มด้วย X เพราะมันเป็น foundational"
- "แล้ว Y เพราะมันขึ้นกับ X"
- "สุดท้าย Z เพราะ..."

**3. Scope Boundaries:**
อะไรรวม vs ไม่รวม ในการตีความของ Claude?
- "Phase นี้รวม: A, B, C"
- "Phase นี้ไม่รวม: D, E, F"
- "ขอบเขตที่กำกวม: G อาจไปทางใดก็ได้"

**4. Risk Areas:**
Claude คาดว่าความซับซ้อนหรือความท้าทายอยู่ที่ไหน?
- "ส่วนที่ยากคือ X เพราะ..."
- "ปัญหาที่อาจเกิด: Y, Z"
- "ฉันจะระวัง..."

**5. Dependencies:**
Claude สมมติว่าอะไรมีอยู่หรือต้องพร้อม?
- "นี่สมมติว่า X จาก phases ก่อนหน้า"
- "External dependencies: Y, Z"
- "นี่จะถูกใช้โดย..."

ซื่อสัตย์เกี่ยวกับความไม่แน่นอน ทำเครื่องหมายสมมติฐานด้วย confidence levels:
- "Fairly confident: ..." (ชัดเจนจาก roadmap)
- "Assuming: ..." (การอนุมานที่สมเหตุสมผล)
- "Unclear: ..." (อาจไปได้หลายทาง)
</step>

<step name="present_assumptions">
แสดงสมมติฐานในรูปแบบที่ชัดเจนและสแกนได้:

```
## My Assumptions for Phase ${PHASE}: ${PHASE_NAME}

### Technical Approach
[List assumptions about how to implement]

### Implementation Order
[List assumptions about sequencing]

### Scope Boundaries
**In scope:** [what's included]
**Out of scope:** [what's excluded]
**Ambiguous:** [what could go either way]

### Risk Areas
[List anticipated challenges]

### Dependencies
**From prior phases:** [what's needed]
**External:** [third-party needs]
**Feeds into:** [what future phases need from this]

---

**What do you think?**

Are these assumptions accurate? Let me know:
- What I got right
- What I got wrong
- What I'm missing
```

รอการตอบจากผู้ใช้
</step>

<step name="gather_feedback">
**หากผู้ใช้ให้การแก้ไข:**

รับทราบการแก้ไข:

```
Got it. Key corrections:
- [correction 1]
- [correction 2]

This changes my understanding significantly. [Summarize new understanding]
```

**หากผู้ใช้ยืนยันสมมติฐาน:**

```
Great, assumptions validated.
```

ดำเนินการไป offer_next
</step>

<step name="offer_next">
แสดงขั้นตอนถัดไป:

```
What's next?
1. Discuss context (/gsd:discuss-phase ${PHASE}) - ให้ฉันถามคำถามเพื่อสร้าง context ครอบคลุม
2. Plan this phase (/gsd:plan-phase ${PHASE}) - สร้าง execution plans ละเอียด
3. Re-examine assumptions - ฉันจะวิเคราะห์อีกครั้งด้วยการแก้ไขของคุณ
4. Done for now
```

รอการเลือกของผู้ใช้

หาก "Discuss context": Note ว่า CONTEXT.md จะรวมการแก้ไขใดๆ ที่ discuss ที่นี่
หาก "Plan this phase": ดำเนินการโดยรู้ว่า assumptions เข้าใจแล้ว
หาก "Re-examine": กลับไป analyze_phase ด้วยความเข้าใจที่อัปเดต
</step>

</process>

<success_criteria>
- Phase number validated กับ roadmap
- Assumptions แสดงในห้าด้าน: technical approach, implementation order, scope, risks, dependencies
- Confidence levels ทำเครื่องหมายตามความเหมาะสม
- "What do you think?" prompt แสดง
- User feedback รับทราบ
- ขั้นตอนถัดไปชัดเจนเสนอ
</success_criteria>
