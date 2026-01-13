---
name: gsd:status
description: ตรวจสอบสถานะ background agents จากการดำเนินการแบบขนาน
argument-hint: "[--wait]"
allowed-tools:
  - Read
  - Write
  - Bash
  - TaskOutput
---

<objective>
Monitor สถานะ background agent จาก /gsd:execute-phase parallel execution

แสดง agents ที่กำลังทำงาน/เสร็จแล้วจาก agent-history.json
ใช้ TaskOutput เพื่อตรวจสอบสถานะของ background tasks
ด้วย --wait flag จะ block จนกว่า agents ทั้งหมดจะเสร็จ
</objective>

<context>
Arguments: $ARGUMENTS
</context>

<process>

<step name="load_history">
**โหลด agent history:**

```bash
cat .planning/agent-history.json 2>/dev/null || echo '{"entries":[]}'
```

ถ้าไฟล์ไม่มีหรือไม่มี entries:
```
No background agents tracked.

Run /gsd:execute-phase to spawn parallel agents.
```
Exit
</step>

<step name="filter_agents">
**หา background agents:**

Filter entries ที่:
- `execution_mode` เป็น "parallel" หรือ "background"
- `status` เป็น "spawned" (ยังทำงานอยู่) หรือเพิ่งเสร็จ

จัดกลุ่มตาม `parallel_group` ถ้ามี
</step>

<step name="check_running">
**ตรวจสอบสถานะของ running agents:**

สำหรับแต่ละ agent ที่มี `status === "spawned"`:

ใช้ TaskOutput tool:
```
task_id: [agent_id]
block: false
timeout: 1000
```

**ถ้า TaskOutput return completed result:**
- อัพเดท agent-history.json: status → "completed"
- Set completion_timestamp
- Parse files_modified จาก output ถ้ามี

**ถ้า TaskOutput return "still running":**
- คง spawned ไว้ (running)

**ถ้า TaskOutput return error:**
- อัพเดท agent-history.json: status → "failed"
</step>

<step name="display">
**แสดง status table:**

```
Background Agents
════════════════════════════════════════

| Plan   | Status      | Elapsed  | Agent ID      |
|--------|-------------|----------|---------------|
| 10-01  | ✓ Complete  | 2m 15s   | agent_01H...  |
| 10-02  | ⏳ Running   | 1m 30s   | agent_01H...  |
| 10-04  | ✓ Complete  | 1m 45s   | agent_01H...  |

Progress: 2/3 complete

════════════════════════════════════════
Wait for all: /gsd:status --wait
```

**Status icons:**
- ✓ Complete
- ⏳ Running
- ✗ Failed
- ⏸ Queued (waiting for dependency)
</step>

<step name="wait_mode">
**ถ้า --wait flag provided:**

สำหรับแต่ละ agent ที่มี status "spawned":

ใช้ TaskOutput แบบ blocking:
```
task_id: [agent_id]
block: true
timeout: 600000
```

รายงานเมื่อแต่ละตัวเสร็จ:
```
⏳ Waiting for 3 agents...

✓ [1/3] 10-01 complete (2m 15s)
✓ [2/3] 10-04 complete (1m 45s)
✓ [3/3] 10-02 complete (3m 30s)

════════════════════════════════════════
All agents complete!

Total time: 3m 30s (parallel)
Sequential estimate: 7m 30s
Time saved: ~4m (53%)
════════════════════════════════════════
```

อัพเดท agent-history.json ด้วย completion status สำหรับแต่ละตัว
</step>

<step name="next_steps">
**หลังทั้งหมดเสร็จ (หรือถ้าเสร็จอยู่แล้ว):**

```
---

## ▶ Next Up

All parallel agents finished. Review results:

`/gsd:progress`

<sub>`/clear` first → fresh context window</sub>

---
```
</step>

</process>

<success_criteria>
- [ ] อ่าน agent-history.json สำหรับ background agents
- [ ] ใช้ TaskOutput เพื่อตรวจสอบ running agent status
- [ ] อัพเดท history ด้วย current status
- [ ] แสดง simple status table
- [ ] --wait flag blocks จนกว่าทั้งหมดจะเสร็จ
- [ ] รายงาน time savings vs sequential
</success_criteria>
