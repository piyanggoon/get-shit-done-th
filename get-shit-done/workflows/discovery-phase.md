<purpose>
ดำเนินการ discovery ที่ระดับความลึกที่เหมาะสม
สร้าง DISCOVERY.md (สำหรับ Level 2-3) ที่ให้ข้อมูลการสร้าง PLAN.md

เรียกจากขั้นตอน mandatory_discovery ของ plan-phase.md พร้อมพารามิเตอร์ depth

หมายเหตุ: สำหรับการวิจัย ecosystem อย่างครอบคลุม ("ผู้เชี่ยวชาญสร้างสิ่งนี้อย่างไร") ใช้ /gsd:research-phase แทน ซึ่งสร้าง RESEARCH.md
</purpose>

<depth_levels>
**Workflow นี้รองรับสามระดับความลึก:**

| Level | ชื่อ         | เวลา      | Output                                       | เมื่อไหร่                                 |
| ----- | ------------ | --------- | -------------------------------------------- | ----------------------------------------- |
| 1     | Quick Verify | 2-5 นาที  | ไม่มีไฟล์ ดำเนินการด้วยความรู้ที่ยืนยันแล้ว  | Single library, ยืนยัน syntax ปัจจุบัน    |
| 2     | Standard     | 15-30 นาที| DISCOVERY.md                                 | เลือกระหว่างตัวเลือก, integration ใหม่   |
| 3     | Deep Dive    | 1+ ชั่วโมง| DISCOVERY.md ละเอียดพร้อม validation gates   | การตัดสินใจ architectural, ปัญหาใหม่      |

**Depth กำหนดโดย plan-phase.md ก่อน route มาที่นี่**
</depth_levels>

<source_hierarchy>
**บังคับ: Context7 ก่อน WebSearch**

ข้อมูล training ของ Claude เก่า 6-18 เดือน ตรวจสอบเสมอ

1. **Context7 MCP ก่อน** - Docs ปัจจุบัน ไม่มี hallucination
2. **Official docs** - เมื่อ Context7 ไม่ครอบคลุม
3. **WebSearch สุดท้าย** - สำหรับการเปรียบเทียบและ trends เท่านั้น

ดู ~/.claude/get-shit-done/templates/discovery.md `<discovery_protocol>` สำหรับ protocol เต็ม
</source_hierarchy>

<process>

<step name="determine_depth">
ตรวจสอบพารามิเตอร์ depth ที่ส่งมาจาก plan-phase.md:
- `depth=verify` → Level 1 (Quick Verification)
- `depth=standard` → Level 2 (Standard Discovery)
- `depth=deep` → Level 3 (Deep Dive)

Route ไป workflow ระดับที่เหมาะสมด้านล่าง
</step>

<step name="level_1_quick_verify">
**Level 1: Quick Verification (2-5 นาที)**

สำหรับ: Single library ที่รู้จัก ยืนยัน syntax/version ยังถูกต้อง

**กระบวนการ:**

1. Resolve library ใน Context7:

   ```
   mcp__context7__resolve-library-id with libraryName: "[library]"
   ```

2. Fetch docs ที่เกี่ยวข้อง:

   ```
   mcp__context7__get-library-docs with:
   - context7CompatibleLibraryID: [จากขั้นตอน 1]
   - topic: [concern เฉพาะ]
   ```

3. ตรวจสอบ:

   - Version ปัจจุบันตรงกับที่คาดหวัง
   - API syntax ไม่เปลี่ยน
   - ไม่มี breaking changes ใน versions ล่าสุด

4. **หากตรวจสอบแล้ว:** กลับไป plan-phase.md พร้อมการยืนยัน ไม่ต้องสร้าง DISCOVERY.md

5. **หากพบข้อกังวล:** ยกระดับไป Level 2

**Output:** การยืนยันด้วยวาจาเพื่อดำเนินการต่อ หรือยกระดับไป Level 2
</step>

<step name="level_2_standard">
**Level 2: Standard Discovery (15-30 นาที)**

สำหรับ: เลือกระหว่างตัวเลือก, external integration ใหม่

**กระบวนการ:**

1. **ระบุสิ่งที่ต้อง discover:**

   - มีตัวเลือกอะไรบ้าง?
   - เกณฑ์เปรียบเทียบหลักคืออะไร?
   - use case เฉพาะของเราคืออะไร?

2. **Context7 สำหรับแต่ละตัวเลือก:**

   ```
   สำหรับแต่ละ library/framework:
   - mcp__context7__resolve-library-id
   - mcp__context7__get-library-docs (mode: "code" สำหรับ API, "info" สำหรับ concepts)
   ```

3. **Official docs** สำหรับสิ่งที่ Context7 ไม่มี

4. **WebSearch** สำหรับการเปรียบเทียบ:

   - "[option A] vs [option B] {current_year}"
   - "[option] known issues"
   - "[option] with [our stack]"

5. **Cross-verify:** ทุก WebSearch finding → ยืนยันกับ Context7/official docs

6. **Quality check:** ก่อน finalize findings ปรึกษา ~/.claude/get-shit-done/references/research-pitfalls.md เพื่อหลีกเลี่ยง research gaps ทั่วไป

7. **สร้าง DISCOVERY.md** ใช้โครงสร้าง ~/.claude/get-shit-done/templates/discovery.md:

   - Summary พร้อม recommendation
   - Key findings ต่อตัวเลือก
   - Code examples จาก Context7
   - Confidence level (ควรเป็น MEDIUM-HIGH สำหรับ Level 2)

8. กลับไป plan-phase.md

**Output:** `.planning/phases/XX-name/DISCOVERY.md`
</step>

<step name="level_3_deep_dive">
**Level 3: Deep Dive (1+ ชั่วโมง)**

สำหรับ: การตัดสินใจ architectural, ปัญหาใหม่, ตัวเลือกความเสี่ยงสูง

**กระบวนการ:**

1. **กำหนดขอบเขต discovery** ใช้ ~/.claude/get-shit-done/templates/discovery.md:

   - กำหนด scope ชัดเจน
   - กำหนดขอบเขต include/exclude
   - ลิสต์คำถามเฉพาะที่ต้องตอบ

2. **Context7 research อย่างละเอียด:**

   - Libraries ที่เกี่ยวข้องทั้งหมด
   - Patterns และ concepts ที่เกี่ยวข้อง
   - หลาย topics ต่อ library หากจำเป็น

3. **อ่าน Official documentation ลึก:**

   - Architecture guides
   - Best practices sections
   - Migration/upgrade guides
   - Known limitations

4. **WebSearch สำหรับ ecosystem context:**

   - คนอื่นแก้ปัญหาที่คล้ายกันอย่างไร
   - ประสบการณ์ production
   - Gotchas และ anti-patterns
   - การเปลี่ยนแปลง/ประกาศล่าสุด

5. **Cross-verify ทุก findings:**

   - ทุก WebSearch claim → ตรวจสอบกับแหล่งที่มีอำนาจ
   - ทำเครื่องหมายสิ่งที่ verified vs assumed
   - Flag ความขัดแย้ง

6. **Quality check:** ก่อน finalize findings ปรึกษา ~/.claude/get-shit-done/references/research-pitfalls.md เพื่อให้ครอบคลุมและหลีกเลี่ยง research gaps ทั่วไป

7. **สร้าง DISCOVERY.md ครอบคลุม:**

   - โครงสร้างเต็มจาก ~/.claude/get-shit-done/templates/discovery.md
   - Quality report พร้อม source attribution
   - Confidence ต่อ finding
   - หาก LOW confidence ใน critical finding ใดๆ → เพิ่ม validation checkpoints

8. **Confidence gate:** หาก overall confidence เป็น LOW นำเสนอตัวเลือกก่อนดำเนินการ

9. กลับไป plan-phase.md

**Output:** `.planning/phases/XX-name/DISCOVERY.md` (ครอบคลุม)
</step>

<step name="identify_unknowns">
**สำหรับ Level 2-3:** กำหนดสิ่งที่ต้องเรียนรู้

ถาม: เราต้องเรียนรู้อะไรก่อนจะวางแผน phase นี้ได้?

- ตัวเลือก Technology?
- Best practices?
- API patterns?
- Architecture approach?
  </step>

<step name="create_discovery_scope">
ใช้ ~/.claude/get-shit-done/templates/discovery.md

รวม:

- Discovery objective ที่ชัดเจน
- รายการ include/exclude ที่กำหนดขอบเขต
- Source preferences (official docs, Context7, ปีปัจจุบัน)
- โครงสร้าง output สำหรับ DISCOVERY.md
  </step>

<step name="execute_discovery">
รัน discovery:
- ใช้ web search สำหรับข้อมูลปัจจุบัน
- ใช้ Context7 MCP สำหรับ library docs
- ชอบ sources ปีปัจจุบัน
- จัดโครงสร้าง findings ตาม template
</step>

<step name="create_discovery_output">
เขียน `.planning/phases/XX-name/DISCOVERY.md`:
- Summary พร้อม recommendation
- Key findings พร้อม sources
- Code examples หากใช้ได้
- Metadata (confidence, dependencies, open questions, assumptions)
</step>

<step name="confidence_gate">
หลังสร้าง DISCOVERY.md ตรวจสอบ confidence level

หาก confidence เป็น LOW:
ใช้ AskUserQuestion:

- header: "Low Confidence"
- question: "Discovery confidence เป็น LOW: [เหตุผล] ต้องการดำเนินการอย่างไร?"
- options:
  - "Dig deeper" - ทำ research เพิ่มก่อนวางแผน
  - "Proceed anyway" - ยอมรับความไม่แน่นอน วางแผนพร้อม caveats
  - "Pause" - ฉันต้องคิดเรื่องนี้

หาก confidence เป็น MEDIUM:
Inline: "Discovery เสร็จ (medium confidence) [เหตุผลสั้นๆ] ดำเนินการวางแผน?"

หาก confidence เป็น HIGH:
ดำเนินการโดยตรง เพียงแจ้ง: "Discovery เสร็จ (high confidence)"
</step>

<step name="open_questions_gate">
หาก DISCOVERY.md มี open_questions:

แสดง inline:
"Open questions จาก discovery:

- [Question 1]
- [Question 2]

สิ่งเหล่านี้อาจส่งผลต่อ implementation รับทราบและดำเนินการ? (yes / address first)"

หาก "address first": รวบรวม input จากผู้ใช้เกี่ยวกับคำถาม อัปเดต discovery
</step>

<step name="offer_next">
```
Discovery เสร็จ: .planning/phases/XX-name/DISCOVERY.md
Recommendation: [one-liner]
Confidence: [level]

ถัดไปคืออะไร?

1. Discuss phase context (/gsd:discuss-phase [current-phase])
2. Create phase plan (/gsd:plan-phase [current-phase])
3. Refine discovery (dig deeper)
4. Review discovery

```

หมายเหตุ: DISCOVERY.md ไม่ได้ commit แยก จะ commit พร้อม phase completion
</step>

</process>

<success_criteria>
**Level 1 (Quick Verify):**
- Context7 ปรึกษาสำหรับ library/topic
- ยืนยันสถานะปัจจุบันหรือยกระดับข้อกังวล
- การยืนยันด้วยวาจาเพื่อดำเนินการ (ไม่มีไฟล์)

**Level 2 (Standard):**
- Context7 ปรึกษาสำหรับทุกตัวเลือก
- WebSearch findings cross-verified
- DISCOVERY.md สร้างพร้อม recommendation
- Confidence level MEDIUM หรือสูงกว่า
- พร้อมให้ข้อมูลการสร้าง PLAN.md

**Level 3 (Deep Dive):**
- Discovery scope กำหนด
- Context7 ปรึกษาอย่างละเอียด
- ทุก WebSearch findings verified กับ authoritative sources
- DISCOVERY.md สร้างพร้อมการวิเคราะห์ครอบคลุม
- Quality report พร้อม source attribution
- หาก LOW confidence findings → validation checkpoints กำหนด
- Confidence gate ผ่าน
- พร้อมให้ข้อมูลการสร้าง PLAN.md
</success_criteria>
