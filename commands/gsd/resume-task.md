---
name: gsd:resume-task
description: กลับมาทำงาน subagent execution ที่ถูกขัดจังหวะ
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
กลับมาทำงาน subagent execution ที่ถูกขัดจังหวะโดยใช้ Task tool's resume parameter

เมื่อ session จบกลางการดำเนินการ subagents อาจถูกทิ้งในสถานะที่ไม่สมบูรณ์ คำสั่งนี้ให้ users ดำเนินการงานนั้นต่อโดยไม่ต้องเริ่มใหม่

ใช้ agent ID tracking infrastructure จาก execute-plan เพื่อระบุและ resume agents
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
1. ตรวจสอบว่า .planning/ directory มีอยู่ (error ถ้าไม่มี)
2. Parse agent ID จาก arguments หรือ current-agent-id.txt
3. ตรวจสอบว่า agent มีอยู่ใน history และ resumable ได้
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
- current-agent-id.txt ว่างเปล่าหรือไม่มี
- วิธีแก้: รัน /gsd:progress เพื่อตรวจสอบสถานะโปรเจกต์

**Agent เสร็จแล้ว:**
- Agent ทำงานเสร็จสำเร็จ ไม่มีอะไรให้ resume
- วิธีแก้: ดำเนินการต่อกับแผนถัดไป

**ไม่พบ Agent:**
- ID ที่ให้มาไม่อยู่ใน history
- วิธีแก้: ตรวจสอบ agent-history.json สำหรับ IDs ที่ valid

**Resume ล้มเหลว:**
- Agent context หมดอายุหรือ invalidated
- วิธีแก้: เริ่มใหม่ด้วย /gsd:execute-plan
</error_handling>

<success_criteria>
- [ ] Agent ถูก resume ผ่าน Task tool resume parameter
- [ ] Agent-history.json ถูกอัพเดทด้วย completion
- [ ] current-agent-id.txt ถูก cleared
- [ ] User ได้รับแจ้งผลลัพธ์
</success_criteria>
