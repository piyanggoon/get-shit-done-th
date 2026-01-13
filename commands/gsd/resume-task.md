---
name: gsd:resume-task
description: Resume subagent execution ที่ถูกขัดจังหวะ
argument-hint: "[agent-id]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Task
  - AskUserQuestion
---

<objective>
Resume subagent execution ที่ถูกขัดจังหวะโดยใช้ Task tool's resume parameter

เมื่อ session จบกลาง execution subagents อาจถูกทิ้งในสถานะไม่เสร็จ คำสั่งนี้ให้ผู้ใช้ทำงานต่อได้โดยไม่ต้องเริ่มใหม่

ใช้ agent ID tracking infrastructure จาก execute-phase เพื่อระบุและ resume agents
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/resume-task.md
</execution_context>

<context>
Agent ID: $ARGUMENTS (optional - defaults to most recent)

**โหลด project state:**
@.planning/STATE.md

**โหลด agent tracking:**
@.planning/current-agent-id.txt
@.planning/agent-history.json
</context>

<process>
1. ตรวจสอบว่ามีโฟลเดอร์ .planning/ (error ถ้าไม่มี)
2. Parse agent ID จาก arguments หรือ current-agent-id.txt
3. ตรวจสอบว่า agent มีอยู่ใน history และ resumable
4. ตรวจสอบ file conflicts ตั้งแต่ spawn
5. ทำตาม resume-task.md workflow:
   - อัพเดท agent status เป็น "interrupted"
   - Resume ผ่าน Task tool resume parameter
   - อัพเดท history เมื่อเสร็จ
   - Clear current-agent-id.txt
</process>

<usage>
**Resume agent ที่ถูกขัดจังหวะล่าสุด:**
```
/gsd:resume-task
```

**Resume agent เฉพาะตาม ID:**
```
/gsd:resume-task agent_01HXYZ123
```

**หา agents ที่ resume ได้:**
ตรวจสอบ `.planning/agent-history.json` สำหรับ entries ที่มี status "spawned" หรือ "interrupted"
</usage>

<error_handling>
**ไม่มี agent ให้ resume:**
- current-agent-id.txt ว่างหรือไม่มี
- วิธีแก้: รัน /gsd:progress เพื่อตรวจสอบ project status

**Agent เสร็จแล้ว:**
- Agent เสร็จสำเร็จ ไม่มีอะไรให้ resume
- วิธีแก้: ทำ plan ถัดไปต่อ

**Agent ไม่พบ:**
- ID ที่ให้ไม่อยู่ใน history
- วิธีแก้: ตรวจสอบ agent-history.json สำหรับ IDs ที่ถูกต้อง

**Resume ล้มเหลว:**
- Agent context expired หรือ invalidated
- วิธีแก้: เริ่มใหม่ด้วย /gsd:execute-plan
</error_handling>

<success_criteria>
- [ ] Resume agent ผ่าน Task tool resume parameter
- [ ] อัพเดท agent-history.json ด้วย completion
- [ ] Clear current-agent-id.txt
- [ ] แจ้งผู้ใช้เรื่องผลลัพธ์
</success_criteria>
