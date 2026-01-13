---
name: gsd:pause-work
description: สร้าง context handoff เมื่อหยุดงานกลาง phase
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
สร้างไฟล์ handoff `.continue-here.md` เพื่อเก็บสถานะงานทั้งหมดข้าม sessions

เปิดใช้การ resume ได้อย่างราบรื่นใน session ใหม่ด้วย full context restoration
</objective>

<context>
@.planning/STATE.md
</context>

<process>

<step name="detect">
หาโฟลเดอร์ phase ปัจจุบันจากไฟล์ที่แก้ไขล่าสุด
</step>

<step name="gather">
**รวบรวมสถานะทั้งหมดสำหรับ handoff:**

1. **Current position**: อยู่ phase ไหน, plan ไหน, task ไหน
2. **Work completed**: ทำอะไรเสร็จ session นี้
3. **Work remaining**: เหลืออะไรใน plan/phase ปัจจุบัน
4. **Decisions made**: Key decisions และเหตุผล
5. **Blockers/issues**: อะไรติดขัด
6. **Mental context**: Approach, next steps, "vibe"
7. **Files modified**: อะไรเปลี่ยนแต่ยังไม่ commit

ถามผู้ใช้เพื่อ clarify ถ้าต้องการ
</step>

<step name="write">
**เขียน handoff ไปยัง `.planning/phases/XX-name/.continue-here.md`:**

```markdown
---
phase: XX-name
task: 3
total_tasks: 7
status: in_progress
last_updated: [timestamp]
---

<current_state>
[อยู่ตรงไหนแน่ๆ? Immediate context]
</current_state>

<completed_work>

- Task 1: [name] - เสร็จ
- Task 2: [name] - เสร็จ
- Task 3: [name] - กำลังทำ, [ทำอะไรไปแล้ว]
  </completed_work>

<remaining_work>

- Task 3: [เหลืออะไร]
- Task 4: ยังไม่เริ่ม
- Task 5: ยังไม่เริ่ม
  </remaining_work>

<decisions_made>

- ตัดสินใจใช้ [X] เพราะ [reason]
- เลือก [approach] แทน [alternative] เพราะ [reason]
  </decisions_made>

<blockers>
- [Blocker 1]: [status/workaround]
</blockers>

<context>
[Mental state, คิดอะไรอยู่, แผนคืออะไร]
</context>

<next_action>
เริ่มด้วย: [specific first action เมื่อ resume]
</next_action>
```

เขียนให้ specific พอที่ Claude ใหม่จะเข้าใจได้ทันที
</step>

<step name="commit">
```bash
git add .planning/phases/*/.continue-here.md
git commit -m "wip: [phase-name] paused at task [X]/[Y]"
```
</step>

<step name="confirm">
```
✓ Handoff สร้างแล้ว: .planning/phases/[XX-name]/.continue-here.md

สถานะปัจจุบัน:

- Phase: [XX-name]
- Task: [X] จาก [Y]
- Status: [in_progress/blocked]
- Committed เป็น WIP

เพื่อ resume: /gsd:resume-work

```
</step>

</process>

<success_criteria>
- [ ] สร้าง .continue-here.md ในโฟลเดอร์ phase ที่ถูกต้อง
- [ ] กรอกทุก sections ด้วยเนื้อหาเฉพาะ
- [ ] Committed เป็น WIP
- [ ] ผู้ใช้รู้ตำแหน่งและวิธี resume
</success_criteria>
