<research_pitfalls>

<purpose>
เอกสารนี้รวบรวมข้อผิดพลาดในการค้นคว้าที่พบในการใช้งานจริง ให้ patterns เฉพาะที่ต้องหลีกเลี่ยงและกลยุทธ์การตรวจสอบเพื่อป้องกันการเกิดซ้ำ
</purpose>

<known_pitfalls>

<pitfall_config_scope>
**อะไร**: สมมติว่า global configuration หมายความว่าไม่มี project-scoping
**ตัวอย่าง**: สรุปว่า "MCP servers ถูก configured GLOBALLY เท่านั้น" ขณะที่พลาด project-scoped `.mcp.json`
**ทำไมเกิด**: ไม่ได้ตรวจสอบ configuration patterns ที่รู้จักทั้งหมดอย่างชัดเจน
**การป้องกัน**:
```xml
<verification_checklist>
**สำคัญ**: ตรวจสอบ configuration scopes ทั้งหมด:
□ User/global scope - Configuration ทั่วระบบ
□ Project scope - ไฟล์ configuration ระดับโปรเจกต์
□ Local scope - User overrides เฉพาะโปรเจกต์
□ Workspace scope - IDE/tool workspace settings
□ Environment scope - Environment variables
</verification_checklist>
```
</pitfall_config_scope>

<pitfall_search_vagueness>
**อะไร**: ขอให้ researchers "ค้นหาเอกสาร" โดยไม่ระบุว่าที่ไหน
**ตัวอย่าง**: "ค้นคว้าเอกสาร MCP" → หา community blog เก่าแทน official docs
**ทำไมเกิด**: คำแนะนำการค้นคว้าคลุมเครือไม่ระบุแหล่งที่มาที่แน่นอน
**การป้องกัน**:
```xml
<sources>
แหล่ง official (ใช้ WebFetch):
- https://exact-url-to-official-docs
- https://exact-url-to-api-reference

Search queries (ใช้ WebSearch):
- "specific search query {current_year}"
- "another specific query {current_year}"
</sources>
```
</pitfall_search_vagueness>

<pitfall_deprecated_features>
**อะไร**: หาเอกสาร archived/เก่าและสรุปว่าฟีเจอร์ไม่มี
**ตัวอย่าง**: หาเอกสาร 2022 ที่บอก "feature not supported" เมื่อเวอร์ชันปัจจุบันเพิ่มแล้ว
**ทำไมเกิด**: ไม่ได้ตรวจสอบหลายแหล่งหรือ updates ล่าสุด
**การป้องกัน**:
```xml
<verification_checklist>
□ ตรวจสอบเอกสาร official ปัจจุบัน
□ ตรวจสอบ changelog/release notes สำหรับ updates ล่าสุด
□ ตรวจสอบ version numbers และวันที่เผยแพร่
□ Cross-reference หลายแหล่งที่น่าเชื่อถือ
</verification_checklist>
```
</pitfall_deprecated_features>

<pitfall_tool_variations>
**อะไร**: สับสน capabilities ข้าม tools/environments ต่างๆ
**ตัวอย่าง**: "Claude Desktop รองรับ X" ≠ "Claude Code รองรับ X"
**ทำไมเกิด**: ไม่ได้ตรวจสอบแต่ละ environment แยกกันอย่างชัดเจน
**การป้องกัน**:
```xml
<verification_checklist>
□ Claude Desktop capabilities
□ Claude Code capabilities
□ VS Code extension capabilities
□ API/SDK capabilities
บันทึกว่า environment ไหนรองรับ features ไหน
</verification_checklist>
```
</pitfall_tool_variations>

<pitfall_negative_claims>
**อะไร**: ทำ statements แบบ definitive ว่า "X เป็นไปไม่ได้" โดยไม่มีการตรวจสอบแหล่ง official
**ตัวอย่าง**: "Folder-scoped MCP configuration ไม่รองรับ" (พลาด `.mcp.json`)
**ทำไมเกิด**: สรุปจากการไม่มีหลักฐานแทนที่จะเป็นหลักฐานของการไม่มี
**การป้องกัน**:
```xml
<critical_claims_audit>
สำหรับ statement "X เป็นไปไม่ได้" หรือ "Y เป็นทางเดียว":
- [ ] นี่ถูกยืนยันโดยเอกสาร official ที่ระบุชัดเจนหรือไม่?
- [ ] ฉันตรวจสอบ updates ล่าสุดที่อาจเปลี่ยนนี้หรือยัง?
- [ ] ฉันตรวจสอบ approaches/mechanisms ที่เป็นไปได้ทั้งหมดหรือยัง?
- [ ] ฉันกำลังสับสนระหว่าง "ฉันไม่พบ" กับ "มันไม่มี" หรือไม่?
</critical_claims_audit>
```
</pitfall_negative_claims>

<pitfall_missing_enumeration>
**อะไร**: สืบสวน scope แบบ open-ended โดยไม่ enumerate ความเป็นไปได้ที่รู้จักก่อน
**ตัวอย่าง**: "ค้นคว้า configuration options" แทนที่จะ list options เฉพาะที่จะตรวจสอบ
**ทำไมเกิด**: ไม่สร้าง checklist ที่ชัดเจนของ items ที่จะสืบสวน
**การป้องกัน**:
```xml
<verification_checklist>
Enumerate options ที่รู้จักทั้งหมดก่อน:
□ Option 1: [item เฉพาะ]
□ Option 2: [item เฉพาะ]
□ Option 3: [item เฉพาะ]
□ ตรวจสอบ options เพิ่มเติมที่ไม่ได้ list

สำหรับแต่ละ option ด้านบน บันทึก:
- การมีอยู่ (confirmed/not found/unclear)
- URL แหล่ง official
- สถานะปัจจุบัน (active/deprecated/beta)
</verification_checklist>
```
</pitfall_missing_enumeration>

<pitfall_single_source>
**อะไร**: พึ่งพาแหล่งเดียวสำหรับ claims สำคัญ
**ตัวอย่าง**: ใช้แค่ Stack Overflow answer จาก 2021 สำหรับ best practices ปัจจุบัน
**ทำไมเกิด**: ไม่ cross-reference หลายแหล่งที่น่าเชื่อถือ
**การป้องกัน**:
```xml
<source_verification>
สำหรับ claims สำคัญ ต้องการหลายแหล่ง:
- [ ] เอกสาร official (primary)
- [ ] Release notes/changelog (สำหรับความทันสมัย)
- [ ] แหล่งที่น่าเชื่อถือเพิ่มเติม (สำหรับการตรวจสอบ)
- [ ] ตรวจสอบ contradiction (ให้แน่ใจว่าแหล่งเห็นด้วย)
</source_verification>
```
</pitfall_single_source>

<pitfall_assumed_completeness>
**อะไร**: สมมติว่าผลการค้นหาครบถ้วนและน่าเชื่อถือ
**ตัวอย่าง**: ผล Google แรกเก่าแต่สมมติว่าปัจจุบัน
**ทำไมเกิด**: ไม่ตรวจสอบวันที่เผยแพร่และความน่าเชื่อถือของแหล่ง
**การป้องกัน**:
```xml
<source_verification>
สำหรับแต่ละแหล่งที่ปรึกษา:
- [ ] ตรวจสอบวันที่เผยแพร่/update แล้ว (ชอบ recent/current)
- [ ] ยืนยันความน่าเชื่อถือของแหล่งแล้ว (official docs ไม่ใช่ blogs)
- [ ] ตรวจสอบความเกี่ยวข้องของ version แล้ว (ตรงกับ version ปัจจุบัน)
- [ ] ลอง search queries หลายอัน (ไม่ใช่แค่อันเดียว)
</source_verification>
```
</pitfall_assumed_completeness>
</known_pitfalls>

<red_flags>

<red_flag_zero_not_found>
**คำเตือน**: ทุกการสืบสวนสำเร็จสมบูรณ์แบบ
**ปัญหา**: การค้นคว้าจริงพบทางตัน ความคลุมเครือ และสิ่งที่ไม่รู้
**การดำเนินการ**: คาดหวังการรายงานข้อจำกัด contradictions และช่องว่างอย่างตรงไปตรงมา
</red_flag_zero_not_found>

<red_flag_no_confidence>
**คำเตือน**: ผลการค้นพบทั้งหมดนำเสนอด้วยความมั่นใจเท่ากัน
**ปัญหา**: แยกแยะ verified facts จาก educated guesses ไม่ได้
**การดำเนินการ**: ต้องการ confidence levels (High/Medium/Low) สำหรับผลการค้นพบหลัก
</red_flag_no_confidence>

<red_flag_missing_urls>
**คำเตือน**: "ตามเอกสาร..." โดยไม่มี URL เฉพาะ
**ปัญหา**: ตรวจสอบ claims หรือเช็ค updates ไม่ได้
**การดำเนินการ**: ต้องการ URLs จริงสำหรับ claims เอกสาร official ทั้งหมด
</red_flag_missing_urls>

<red_flag_no_evidence>
**คำเตือน**: "X ทำ Y ไม่ได้" หรือ "Z เป็นทางเดียว" โดยไม่มี citation
**ปัญหา**: Claims แรงต้องการหลักฐานแรง
**การดำเนินการ**: Flag สำหรับการตรวจสอบกับแหล่ง official
</red_flag_no_evidence>

<red_flag_incomplete_enum>
**คำเตือน**: Verification checklist list 4 items, output ครอบคลุม 2
**ปัญหา**: ช่องว่างในการครอบคลุมอย่างเป็นระบบ
**การดำเนินการ**: ให้แน่ใจว่า items ที่ enumerate ทั้งหมดถูก addressed หรือ mark "not found"
</red_flag_incomplete_enum>
</red_flags>

<continuous_improvement>

เมื่อเกิดช่องว่างในการค้นคว้า:

1. **บันทึกช่องว่าง**
   - อะไรถูกพลาดหรือไม่ถูกต้อง?
   - ข้อมูลที่ถูกต้องจริงคืออะไร?
   - ผลกระทบคืออะไร?

2. **วิเคราะห์ root cause**
   - ทำไมไม่ถูกจับได้?
   - ขั้นตอนการตรวจสอบไหนจะป้องกันได้?
   - นี่เผย pattern อะไร?

3. **อัปเดตเอกสารนี้**
   - เพิ่ม pitfall entry ใหม่
   - อัปเดต checklists ที่เกี่ยวข้อง
   - แชร์บทเรียนที่เรียนรู้
</continuous_improvement>

<quick_reference>

ก่อนส่งการค้นคว้า ตรวจสอบ:

- [ ] Items ที่ enumerate ทั้งหมดถูกสืบสวน (ไม่ใช่แค่บางส่วน)
- [ ] Negative claims ถูกตรวจสอบกับ official docs
- [ ] หลายแหล่งถูก cross-referenced สำหรับ claims สำคัญ
- [ ] URLs ให้สำหรับเอกสาร official ทั้งหมด
- [ ] ตรวจสอบวันที่เผยแพร่แล้ว (ชอบ recent/current)
- [ ] Tool/environment-specific variations ถูกบันทึก
- [ ] Confidence levels ถูก assign อย่างตรงไปตรงมา
- [ ] Assumptions แยกจาก verified facts
- [ ] Review "อะไรที่ฉันอาจพลาด?" เสร็จแล้ว

**Living Document**: อัปเดตหลังแต่ละช่องว่างการค้นคว้าที่สำคัญ
**บทเรียนจาก**: MCP configuration research gap (พลาด `.mcp.json`)
</quick_reference>
</research_pitfalls>
