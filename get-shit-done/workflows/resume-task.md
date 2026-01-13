<trigger>
ใช้ workflow นี้เมื่อ:
- ผู้ใช้รัน /gsd:resume-task
- ต้องการดำเนินการ interrupted subagent execution ต่อ
- Resume งานหลัง session จบกลาง plan
</trigger>

<purpose>
Resume interrupted subagent execution โดยใช้ Task tool's resume parameter

เปิดใช้ seamless continuation ของ autonomous work ที่ถูก interrupt โดย session timeout, user exit หรือ crash
</purpose>

<process>

<step name="parse_arguments">
Parse optional agent_id argument:

```bash
# ตรวจสอบว่า argument ให้มาหรือไม่
if [ -n "$ARGUMENTS" ]; then
  AGENT_ID="$ARGUMENTS"
  echo "Using provided agent ID: $AGENT_ID"
else
  # อ่านจาก current-agent-id.txt
  if [ -f .planning/current-agent-id.txt ] && [ -s .planning/current-agent-id.txt ]; then
    AGENT_ID=$(cat .planning/current-agent-id.txt | tr -d '\n')
    echo "Using current agent ID: $AGENT_ID"
  else
    echo "ERROR: No agent to resume"
    exit 1
  fi
fi
```

**หากไม่พบ agent ID:**
แสดง error:
```
No active agent to resume.

There's no interrupted agent recorded. This could mean:
- No subagent was spawned in the current plan
- The last agent completed successfully
- .planning/current-agent-id.txt was cleared

Use /gsd:progress to check project status.
```

**หากพบ agent ID:** ดำเนินการไป validate_agent step
</step>

<step name="validate_agent">
Validate ว่า agent มีอยู่และ resumable:

```bash
# ตรวจสอบว่า agent-history.json มีหรือไม่
if [ ! -f .planning/agent-history.json ]; then
  echo "ERROR: No agent history found"
  exit 1
fi

# อ่าน history และหา agent
cat .planning/agent-history.json
```

**Parse agent-history.json และหา entry ที่ตรงกับ AGENT_ID:**

ตรวจสอบ entry status:
- **หาก status = "completed":** Error - agent เสร็จแล้ว
- **หาก status = "spawned" หรือ "interrupted":** Valid สำหรับ resume
- **หากไม่พบ:** Error - agent ID ไม่อยู่ใน history

**หาก agent เสร็จแล้ว:**
```
Agent already completed.

Agent ID: [id]
Completed: [completion_timestamp]
Task: [task_description]

This agent finished successfully. No resume needed.
```

**หากไม่พบ agent:**
```
Agent ID not found in history.

ID: [provided_id]

Available agents:
- [list most recent 5 agents with status]

Did you mean one of these?
```

**หาก valid สำหรับ resume:** ดำเนินการไป check_conflicts step
</step>

<step name="check_conflicts">
ตรวจสอบ file modifications ตั้งแต่ agent ถูก spawn

**อ่าน agent entry เพื่อดู context:**
- phase, plan, segment information
- timestamp ของ spawn

**ตรวจสอบ git changes ตั้งแต่ spawn:**

```bash
# ดู files ที่ modified ตั้งแต่ agent spawn
# Note: นี่เป็น best-effort check - rely on git status
git status --short
```

**หากตรวจพบ modifications:**

ใช้ AskUserQuestion เพื่อเตือนผู้ใช้:

```
Files modified since agent was interrupted:
- [list files]

These changes may conflict with the agent's work.

Options:
1. Continue anyway - Agent will resume with current files
2. Abort - Review changes first

Select option:
```

รอการตอบจากผู้ใช้

**หากผู้ใช้เลือก "Abort":**
```
Resume aborted. Review your changes and run /gsd:resume-task when ready.
```
จบ workflow

**หากผู้ใช้เลือก "Continue anyway" หรือไม่พบ conflicts:**
ดำเนินการไป update_status step
</step>

<step name="update_status">
อัปเดต agent status เป็น "interrupted" หากเป็น "spawned" (marking the interruption point):

```bash
# อ่าน current history
HISTORY=$(cat .planning/agent-history.json)
```

อัปเดต entry ใน agent-history.json:
- หาก status เป็น "spawned" เปลี่ยนเป็น "interrupted"
- เพิ่ม note เกี่ยวกับ resume attempt

นี้ให้ audit trail ของ interruption ก่อน resume
</step>

<step name="resume_agent">
Resume agent โดยใช้ Task tool's resume parameter:

```
Resuming agent: [agent_id]
Task: [task_description from history]
Phase: [phase]-[plan]

The agent will continue from where it left off...
```

**ใช้ Task tool ด้วย resume parameter:**

```
Task(
  description: "Resume interrupted agent",
  prompt: "Continue your previous work. You were executing [task_description].",
  subagent_type: "general-purpose",
  resume: "[AGENT_ID]"
)
```

รอ agent completion

**เมื่อ agent completes:**
- จับ results ใดๆ ที่ returned
- ดำเนินการไป completion_update step
</step>

<step name="completion_update">
อัปเดต tracking files เมื่อ completion สำเร็จ:

**1. อัปเดต agent-history.json:**

เพิ่ม entry ใหม่ marking resume completion:
```json
{
  "agent_id": "[AGENT_ID]",
  "task_description": "[original task] (resumed)",
  "phase": "[phase]",
  "plan": "[plan]",
  "segment": [segment or null],
  "timestamp": "[now]",
  "status": "completed",
  "completion_timestamp": "[now]"
}
```

**2. ล้าง current-agent-id.txt:**

```bash
# ล้าง current agent file
> .planning/current-agent-id.txt
```

**3. แสดง completion message:**

```
Agent resumed and completed successfully.

Agent ID: [id]
Task: [task_description]
Original spawn: [original_timestamp]
Completed: [now]

The agent's work has been incorporated. Check git status for changes.
```
</step>

<step name="handle_errors">
Error handling สำหรับ resume failures:

**หาก Task tool return error เมื่อ resume:**
```
Failed to resume agent.

Agent ID: [id]
Error: [error message]

Possible causes:
- Agent context may have expired
- Agent may have been invalidated

Options:
1. Start fresh - Execute plan from beginning
2. Check status - Review what was completed

Run /gsd:execute-plan to start fresh if needed.
```

อย่าล้าง current-agent-id.txt เมื่อ error - ให้ retry ได้
</step>

</process>

<success_criteria>
Resume complete เมื่อ:
- [ ] Agent resumed สำเร็จผ่าน Task tool resume parameter
- [ ] Agent-history.json อัปเดตด้วย completion status
- [ ] Current-agent-id.txt ล้าง
- [ ] ผู้ใช้แจ้ง completion
</success_criteria>
