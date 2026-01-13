# เทมเพลต Discovery

เทมเพลตสำหรับ `.planning/phases/XX-name/DISCOVERY.md` - การวิจัยระดับตื้นสำหรับการตัดสินใจ library/option

**วัตถุประสงค์:** ตอบคำถาม "library/option ไหนที่เราควรใช้" ระหว่าง mandatory discovery ใน plan-phase

สำหรับการวิจัย ecosystem ระดับลึก ("ผู้เชี่ยวชาญสร้างสิ่งนี้อย่างไร") ใช้ `/gsd:research-phase` ซึ่งสร้าง RESEARCH.md

---

## เทมเพลตไฟล์

```markdown
---
phase: XX-name
type: discovery
topic: [discovery-topic]
---

<session_initialization>
ก่อนเริ่ม discovery ตรวจสอบวันที่วันนี้:
!`date +%Y-%m-%d`

ใช้วันที่นี้เมื่อค้นหาข้อมูล "ปัจจุบัน" หรือ "ล่าสุด"
ตัวอย่าง: ถ้าวันนี้คือ 2025-11-22 ค้นหา "2025" ไม่ใช่ "2024"
</session_initialization>

<discovery_objective>
ค้นหา [หัวข้อ] เพื่อแจ้ง implementation ของ [ชื่อเฟส]

วัตถุประสงค์: [การตัดสินใจ/implementation ที่สิ่งนี้เปิดใช้]
ขอบเขต: [ขอบเขต]
Output: DISCOVERY.md พร้อมคำแนะนำ
</discovery_objective>

<discovery_scope>
<include>
- [คำถามที่ต้องตอบ]
- [พื้นที่ที่ต้องสำรวจ]
- [การเปรียบเทียบเฉพาะถ้าต้องการ]
</include>

<exclude>
- [นอกขอบเขตสำหรับ discovery นี้]
- [เลื่อนไปเฟส implementation]
</exclude>
</discovery_scope>

<discovery_protocol>

**ลำดับความสำคัญแหล่งข้อมูล:**
1. **Context7 MCP** - สำหรับ library/framework documentation (ปัจจุบัน น่าเชื่อถือ)
2. **Official Docs** - สำหรับ libraries เฉพาะ platform หรือที่ไม่ถูก index
3. **WebSearch** - สำหรับการเปรียบเทียบ trends community patterns (verify findings ทั้งหมด)

**Quality Checklist:**
ก่อนเสร็จสิ้น discovery ตรวจสอบ:
- [ ] Claims ทั้งหมดมี authoritative sources (Context7 หรือ official docs)
- [ ] Negative claims ("X เป็นไปไม่ได้") verified ด้วย official documentation
- [ ] API syntax/configuration จาก Context7 หรือ official docs (ไม่ใช่ WebSearch เท่านั้น)
- [ ] WebSearch findings cross-checked กับ authoritative sources
- [ ] Recent updates/changelogs ถูกตรวจสอบสำหรับ breaking changes
- [ ] Alternative approaches ถูกพิจารณา (ไม่ใช่แค่ solution แรกที่เจอ)

**Confidence Levels:**
- HIGH: Context7 หรือ official docs ยืนยัน
- MEDIUM: WebSearch + Context7/official docs ยืนยัน
- LOW: WebSearch เท่านั้นหรือ training knowledge เท่านั้น (mark สำหรับ validation)

</discovery_protocol>


<output_structure>
สร้าง `.planning/phases/XX-name/DISCOVERY.md`:

```markdown
# [หัวข้อ] Discovery

## สรุป
[สรุปผู้บริหาร 2-3 ย่อหน้า - สิ่งที่วิจัย สิ่งที่พบ สิ่งที่แนะนำ]

## คำแนะนำหลัก
[ควรทำอะไรและทำไม - เจาะจงและ actionable]

## Alternatives ที่พิจารณา
[อะไรอื่นถูกประเมินและทำไมไม่เลือก]

## Key Findings

### [หมวด 1]
- [Finding พร้อม source URL และความเกี่ยวข้องกับ case ของเรา]

### [หมวด 2]
- [Finding พร้อม source URL และความเกี่ยวข้อง]

## ตัวอย่างโค้ด
[Relevant implementation patterns ถ้าใช้ได้]

## Metadata

<metadata>
<confidence level="high|medium|low">
[ทำไม confidence level นี้ - based on source quality และ verification]
</confidence>

<sources>
- [Primary authoritative sources ที่ใช้]
</sources>

<open_questions>
[สิ่งที่ไม่สามารถตัดสินได้หรือต้อง validation ระหว่าง implementation]
</open_questions>

<validation_checkpoints>
[ถ้า confidence เป็น LOW หรือ MEDIUM ลิสต์สิ่งเฉพาะที่ต้อง verify ระหว่าง implementation]
</validation_checkpoints>
</metadata>
```
</output_structure>

<success_criteria>
- คำถาม scope ทั้งหมดตอบด้วย authoritative sources
- Quality checklist items เสร็จสมบูรณ์
- คำแนะนำหลักชัดเจน
- Low-confidence findings marked ด้วย validation checkpoints
- พร้อมที่จะแจ้งการสร้าง PLAN.md
</success_criteria>

<guidelines>
**เมื่อไหร่ใช้ discovery:**
- Technology choice ไม่ชัด (library A vs B)
- Best practices ต้องการสำหรับ integration ที่ไม่คุ้นเคย
- ต้องการ API/library investigation
- Single decision pending

**เมื่อไหร่ไม่ควรใช้:**
- Established patterns (CRUD, auth กับ library ที่รู้จัก)
- Implementation details (เลื่อนไป execution)
- คำถามที่ตอบได้จาก existing project context

**เมื่อไหร่ใช้ RESEARCH.md แทน:**
- Niche/complex domains (3D, games, audio, shaders)
- ต้องการ ecosystem knowledge ไม่ใช่แค่ library choice
- คำถาม "ผู้เชี่ยวชาญสร้างสิ่งนี้อย่างไร"
- ใช้ `/gsd:research-phase` สำหรับสิ่งเหล่านี้
</guidelines>
