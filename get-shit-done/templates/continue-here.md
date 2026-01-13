# Continue-Here Template

Copy และกรอกโครงสร้างนี้สำหรับ `.planning/phases/XX-name/.continue-here.md`:

```yaml
---
phase: XX-name
task: 3
total_tasks: 7
status: in_progress
last_updated: 2025-01-15T14:30:00Z
---
```

```markdown
<current_state>
[อยู่ตรงไหนแน่ๆ? Immediate context คืออะไร?]
</current_state>

<completed_work>
[ทำอะไรเสร็จ session นี้ - ระบุให้ชัด]

- Task 1: [name] - เสร็จ
- Task 2: [name] - เสร็จ
- Task 3: [name] - กำลังทำ, [ทำอะไรไปแล้ว]
</completed_work>

<remaining_work>
[เหลืออะไรใน phase นี้]

- Task 3: [name] - [เหลือทำอะไร]
- Task 4: [name] - ยังไม่เริ่ม
- Task 5: [name] - ยังไม่เริ่ม
</remaining_work>

<decisions_made>
[Key decisions และทำไม - เพื่อไม่ให้ session ถัดไปต้อง debate ใหม่]

- ตัดสินใจใช้ [X] เพราะ [reason]
- เลือก [approach] แทน [alternative] เพราะ [reason]
</decisions_made>

<blockers>
[อะไรติดขัดหรือรอ external factors]

- [Blocker 1]: [status/workaround]
</blockers>

<context>
[Mental state, "vibe", อะไรก็ตามที่ช่วยให้ resume ได้ราบรื่น]

[กำลังคิดอะไรอยู่? แผนคืออะไร?
นี่คือ context "หยิบมาทำต่อตรงที่หยุดไว้เลย"]
</context>

<next_action>
[สิ่งแรกที่ต้องทำเมื่อ resume]

เริ่มด้วย: [specific action]
</next_action>
```

<yaml_fields>
YAML frontmatter ที่ต้องมี:

- `phase`: ชื่อโฟลเดอร์ (เช่น `02-authentication`)
- `task`: หมายเลข task ปัจจุบัน
- `total_tasks`: จำนวน tasks ใน phase
- `status`: `in_progress`, `blocked`, `almost_done`
- `last_updated`: ISO timestamp
</yaml_fields>

<guidelines>
- ระบุให้ชัดพอที่ Claude instance ใหม่จะเข้าใจได้ทันที
- รวม WHY ที่ตัดสินใจ ไม่ใช่แค่ what
- `<next_action>` ควร actionable ได้โดยไม่ต้องอ่านอะไรอื่น
- ไฟล์นี้จะถูกลบหลัง resume - ไม่ใช่ permanent storage
</guidelines>
