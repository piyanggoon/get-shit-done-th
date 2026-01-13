# Phase Context Template

Template สำหรับ `.planning/phases/XX-name/{phase}-CONTEXT.md` - บันทึก vision ของผู้ใช้สำหรับ phase

**วัตถุประสงค์:** Document ว่าผู้ใช้จินตนาการว่า phase ทำงานอย่างไร นี่คือ vision context ไม่ใช่ technical analysis รายละเอียดทางเทคนิคมาจาก research

---

## File Template

```markdown
# Phase [X]: [Name] - Context

**รวบรวม:** [date]
**Status:** [พร้อมสำหรับ research / พร้อมสำหรับ planning]

<vision>
## มันควรทำงานอย่างไร

[คำอธิบายของผู้ใช้ว่าจินตนาการว่า phase นี้ทำงานอย่างไร เมื่อคนใช้มันจะเกิดอะไรขึ้น? มันดู/รู้สึกเป็นอย่างไร? นี่คือ "pitch" version ไม่ใช่ technical spec]

</vision>

<essential>
## สิ่งที่ต้องทำให้ดี

[Core ของ phase นี้ ถ้าทำได้แค่อย่างเดียวให้ถูก จะเป็นอะไร? อะไรคือ non-negotiable ที่ทำให้ phase นี้ประสบความสำเร็จ?]

- [Essential thing 1]
- [Essential thing 2]
- [Essential thing 3 ถ้ามี]

</essential>

<boundaries>
## สิ่งที่อยู่นอก Scope

[Exclusions ที่ชัดเจนสำหรับ phase นี้ เราไม่สร้างอะไร? Phase นี้จบตรงไหนและ phase ถัดไปเริ่มตรงไหน?]

- [ไม่ทำ X - นั่นคือ Phase Y]
- [ไม่รวม Z - เลื่อนไว้]
- [Exclude W อย่างชัดเจน]

</boundaries>

<specifics>
## ไอเดียเฉพาะ

[สิ่งที่ผู้ใช้มีในใจ อ้างอิงถึง products/features ที่มีอยู่ที่ชอบ Behaviors หรือ interactions เฉพาะ "ผมอยากให้มันทำงานเหมือน X" หรือ "เมื่อคลิก Y มันควรทำ Z"]

[ถ้าไม่มี: "ไม่มี requirements เฉพาะ - เปิดรับ standard approaches"]

</specifics>

<notes>
## Context เพิ่มเติม

[อะไรก็ตามที่บันทึกระหว่างการพูดคุยที่ไม่เข้าหมวดข้างบน Priorities ของผู้ใช้, concerns ที่พูดถึง, background ที่เกี่ยวข้อง]

[ถ้าไม่มี: "ไม่มี notes เพิ่มเติม"]

</notes>

---

*Phase: XX-name*
*รวบรวม context: [date]*
```

<good_examples>
```markdown
# Phase 3: User Dashboard - Context

**รวบรวม:** 2025-01-20
**Status:** พร้อมสำหรับ research

<vision>
## มันควรทำงานอย่างไร

เมื่อผู้ใช้ login พวกเขาจะมาถึง dashboard ที่แสดงทุกอย่างสำคัญในมุมมองเดียว ผมจินตนาการว่ามันให้ความรู้สึกสงบและเป็นระเบียบ - ไม่ overwhelming เหมือน Jira หรือรกเหมือน Notion

สิ่งสำคัญคือเห็น active projects และอะไรที่ต้องการความสนใจ คิดว่าเหมือนมุมมอง "วันนี้ควรทำอะไร" มันควรรู้สึกเป็นส่วนตัว ไม่ใช่เหมือน enterprise software

</vision>

<essential>
## สิ่งที่ต้องทำให้ดี

- **ความชัดเจนในมุมมองเดียว** - ภายใน 2 วินาทีหลังมาถึง ผู้ใช้รู้ว่าอะไรต้องการความสนใจ
- **ความรู้สึกเป็นส่วนตัว** - นี่คือ dashboard ของคุณ ไม่ใช่ team dashboard มันควรรู้สึกเหมือนเปิดสมุดบันทึกส่วนตัว

</essential>

<boundaries>
## สิ่งที่อยู่นอก Scope

- Team features (shared dashboards, permissions) - นั่นคือ milestone ในอนาคต
- Analytics/reporting - แค่แสดงอะไรที่ต้องการความสนใจ ไม่ใช่ graphs
- Customizable layouts - ทำให้ simple, layout ดีๆ อันเดียว
- Mobile optimization - desktop ก่อนสำหรับตอนนี้

</boundaries>

<specifics>
## ไอเดียเฉพาะ

- ผมชอบวิธีที่ Linear's home screen highlight สิ่งที่ assign ให้คุณโดยไม่มี noise
- ควรแสดง projects ในรูปแบบ card ไม่ใช่ list
- อาจจะมี section "Today" ที่ด้านบนพร้อมของเร่งด่วน
- Dark mode จำเป็น (มีอยู่แล้วจาก Phase 2)

</specifics>

<notes>
## Context เพิ่มเติม

ผู้ใช้บอกว่าเคยเลิกใช้ dashboards หลายอันมาแล้วเพราะรู้สึก "corporate" เกินไป ตัวแยกคือทำให้รู้สึกเป็นส่วนตัวและสงบ

Priority คือความชัดเจนมากกว่า features แสดงน้อยกว่าและทำให้ชัดเจนดีกว่าแสดงทุกอย่าง

</notes>

---

*Phase: 03-user-dashboard*
*รวบรวม context: 2025-01-20*
```
</good_examples>

<guidelines>
**Template นี้บันทึก VISION ไม่ใช่ technical specs**

ผู้ใช้คือ visionary พวกเขารู้:
- จินตนาการว่ามันทำงานอย่างไร
- มันควรให้ความรู้สึกอย่างไร
- อะไรจำเป็น vs nice-to-have
- อ้างอิงถึงสิ่งที่พวกเขาชอบ

ผู้ใช้ไม่รู้ (และไม่ควรถูกถาม):
- Codebase patterns (Claude อ่าน code เอง)
- Technical risks (Claude ระบุระหว่าง research)
- Implementation constraints (Claude หาเอง)
- Success metrics (Claude อนุมานจากงาน)

**เนื้อหาควรอ่านเหมือน:**
- Founder อธิบาย product vision ของพวกเขา
- "เมื่อคุณใช้สิ่งนี้ มันควรรู้สึก..."
- "สิ่งสำคัญที่สุดคือ..."
- "ผมไม่อยากให้มันเป็นเหมือน X ผมอยากให้รู้สึกเหมือน Y"

**เนื้อหาไม่ควรอ่านเหมือน:**
- Technical specification
- Risk assessment matrix
- Success criteria checklist
- Codebase analysis

**หลังสร้าง:**
- ไฟล์อยู่ในโฟลเดอร์ phase: `.planning/phases/XX-name/{phase}-CONTEXT.md`
- Research phase เพิ่ม technical context (patterns, risks, constraints)
- Planning phase สร้าง executable tasks โดยได้รับ inform จากทั้ง vision และ research
</guidelines>
