<purpose>
ช่วยผู้ใช้คิดว่าต้องการสร้างอะไรใน milestone ถัดไปผ่านการคิดร่วมกัน

คุณเป็นหุ้นส่วนคิด ช่วยพวกเขาตกผลึกวิสัยทัศน์สำหรับสิ่งถัดไป Features ก่อน — ทุกอย่างอื่น (scope, phases) ได้มาจากสิ่งที่พวกเขาต้องการสร้าง
</purpose>

<process>

<step name="check_state" priority="first">
โหลด project state:

```bash
cat .planning/STATE.md
cat .planning/ROADMAP.md
```

**หากไม่มี active milestone (สถานะที่คาดหวังหลังจากเสร็จก่อนหน้า):**
ดำเนินการไป milestone_context

**หากมี active milestone อยู่:**

```
Current milestone in progress: v[X.Y] [Name]
Phases [N]-[M], [P]% complete

ต้องการ:
1. Complete current milestone first (/gsd:complete-milestone)
2. Add phases to current milestone (/gsd:add-phase)
3. Continue anyway - discuss next milestone scope

```

รอการตอบจากผู้ใช้ หาก "Continue anyway" ดำเนินการไป milestone_context
</step>

<step name="milestone_context">
แสดง context จาก milestone ก่อนหน้า:

```
Last completed: v[X.Y] [Name] (shipped [DATE])
Key accomplishments:
- [จาก MILESTONES.md หรือ STATE.md]

Total phases delivered: [N]
Next phase number: [N+1]
```

ดำเนินการไป intake_gate
</step>

<step name="intake_gate">
**สำคัญ: ทุกคำถามใช้ AskUserQuestion อย่าถามคำถาม text แบบ inline**

คำถามหลักคือ: **ต้องการสร้าง/เพิ่ม/แก้ไขอะไร?**

ทุกอย่างอื่น (scope, priority, constraints) เป็นรอง และได้มาจาก features

ตรวจสอบ inputs:
- Deferred issues จาก STATE.md (features ที่เป็นไปได้)
- Gaps ที่รู้หรือ pain points จากการใช้งาน
- Ideas ของผู้ใช้สำหรับสิ่งถัดไป

**1. Open:**

ใช้ AskUserQuestion:
- header: "Next"
- question: "ต้องการเพิ่ม ปรับปรุง หรือแก้ไขอะไรใน milestone นี้?"
- options: [Deferred issues จาก STATE.md หากมี] + ["New features", "Improvements to existing", "Bug fixes", "Let me describe"]

**2. Explore features:**

ตามการตอบ ใช้ AskUserQuestion:

หากตั้งชื่อ features เฉพาะ:
- header: "Feature Details"
- question: "บอกเพิ่มเติมเกี่ยวกับ [feature] - ควรทำอะไร?"
- options: [Contextual options ตาม feature type + "Let me describe it"]

หากอธิบายทิศทางทั่วไป:
- header: "Breaking It Down"
- question: "นั่นอาจรวม [A], [B], [C] - อันไหนสำคัญที่สุด?"
- options: [Specific sub-features + "All of them" + "Something else"]

หากไม่แน่ใจ:
- header: "Starting Points"
- question: "อะไรน่าหงุดหงิดหรือขาดหายไป?"
- options: [Deferred issues จาก STATE.md + pain point categories + "Let me think about it"]

**3. Prioritize:**

ใช้ AskUserQuestion:
- header: "Priority"
- question: "อันไหนสำคัญที่สุด?"
- options: [Features ที่พวกเขากล่าวถึง + "All equally important" + "Let me prioritize"]

หลังรวบรวม features สังเคราะห์:

```
Based on what you described:

**Features:**
- [Feature 1]: [brief description]
- [Feature 2]: [brief description]
- [Feature 3]: [brief description]

**Estimated scope:** [N] phases
**Theme suggestion:** v[X.Y] [Name]
```

**4. Decision gate:**

ใช้ AskUserQuestion:
- header: "Ready?"
- question: "พร้อมสร้าง milestone หรือสำรวจเพิ่ม?"
- options (ต้องมีทั้งสาม):
  - "Create milestone" - ดำเนินการไป /gsd:new-milestone
  - "Ask more questions" - ช่วยฉันคิดเพิ่ม
  - "Let me add context" - ฉันมีอะไรจะแชร์เพิ่ม

หาก "Ask more questions" → กลับไปขั้นตอน 2 ด้วย probes ใหม่
หาก "Let me add context" → รับ input → กลับไปขั้นตอน 2
วนจนกว่าจะเลือก "Create milestone"
</step>

<step name="write_context">
เขียน milestone context ลงไฟล์สำหรับ handoff

**File:** `.planning/MILESTONE-CONTEXT.md`

ใช้ template จาก ~/.claude/get-shit-done/templates/milestone-context.md

กรอกด้วย:
- Features ที่ระบุระหว่าง discussion
- ชื่อ milestone และ theme ที่แนะนำ
- จำนวน phase โดยประมาณ
- Features map ไป phases อย่างไร
- Constraints หรือ scope boundaries ใดๆ ที่กล่าวถึง

```bash
# เขียนไฟล์ context
cat > .planning/MILESTONE-CONTEXT.md << 'EOF'
# Milestone Context

**Generated:** [วันนี้]
**Status:** Ready for /gsd:new-milestone

<features>
## Features to Build

- **[Feature 1]**: [description]
- **[Feature 2]**: [description]
- **[Feature 3]**: [description]

</features>

<scope>
## Scope

**Suggested name:** v[X.Y] [Theme Name]
**Estimated phases:** [N]
**Focus:** [หนึ่งประโยค theme/focus]

</scope>

<phase_mapping>
## Phase Mapping

- Phase [N]: [Feature/goal]
- Phase [N+1]: [Feature/goal]
- Phase [N+2]: [Feature/goal]

</phase_mapping>

<constraints>
## Constraints

- [Constraints ใดๆ ที่กล่าวถึง]

</constraints>

<notes>
## Additional Context

[สิ่งอื่นๆ จาก discussion]

</notes>

---

*ไฟล์นี้เป็นชั่วคราว จะถูกลบหลัง /gsd:new-milestone สร้าง milestone*
EOF
```
</step>

<step name="handoff">
แสดงสรุปและส่งต่อไป create-milestone:

```
Milestone scope defined:

**Features:**
- [Feature 1]: [description]
- [Feature 2]: [description]
- [Feature 3]: [description]

**Suggested milestone:** v[X.Y] [Theme Name]
**Estimated phases:** [N]

Context saved to `.planning/MILESTONE-CONTEXT.md`

---

## ▶ ถัดไป

**Create Milestone v[X.Y]** — [Theme Name]

`/gsd:new-milestone`

<sub>`/clear` ก่อน → context window ใหม่</sub>

---
```
</step>

</process>

<success_criteria>

- Project state โหลด (STATE.md, ROADMAP.md)
- Previous milestone context แสดง
- **Features ระบุ** - อะไรที่จะ build/add/fix (substance)
- Features สำรวจด้วยคำถามชี้แจง
- Scope สังเคราะห์จาก features (ไม่ใช่ถามแบบ abstract)
- **MILESTONE-CONTEXT.md สร้าง** พร้อม features, scope และ phase mapping
- Context ส่งต่อไป /gsd:new-milestone
</success_criteria>
