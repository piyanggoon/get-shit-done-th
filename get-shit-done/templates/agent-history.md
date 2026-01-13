# Agent History Template

Template สำหรับ `.planning/agent-history.json` - ติดตาม subagent spawns ระหว่าง plan execution เพื่อความสามารถในการ resume

---

## File Template

```json
{
  "version": "1.2",
  "max_entries": 50,
  "entries": []
}
```

## Entry Schema

แต่ละ entry ติดตาม subagent spawn หรือ status change:

```json
{
  "agent_id": "agent_01HXXXX...",
  "task_description": "Execute tasks 1-3 from plan 02-01",
  "phase": "02",
  "plan": "01",
  "segment": 1,
  "timestamp": "2026-01-15T14:22:10Z",
  "status": "spawned",
  "completion_timestamp": null,
  "execution_mode": "sequential",
  "parallel_group": null,
  "granularity": "plan",
  "depends_on": null,
  "files_modified": null,
  "checkpoints_skipped": null,
  "task_results": null
}
```

### Field Definitions

| Field | Type | คำอธิบาย |
|-------|------|-------------|
| agent_id | string | ID เฉพาะที่ Task tool ส่งกลับมา |
| task_description | string | คำอธิบายสั้นๆ ว่า agent กำลังดำเนินการอะไร |
| phase | string | หมายเลขเฟส (เช่น "02", "02.1") |
| plan | string | หมายเลขแผนในเฟส |
| segment | number/null | หมายเลข segment สำหรับแผนแบบ segmented, null สำหรับแผนเต็ม |
| timestamp | string | ISO 8601 timestamp เมื่อ agent ถูก spawned |
| status | string | spawned, completed, interrupted, resumed, queued, failed |
| completion_timestamp | string/null | ISO timestamp เมื่อเสร็จ |
| execution_mode | string | "sequential" หรือ "parallel" |
| parallel_group | string/null | Batch ID ที่เชื่อมโยง agents ใน parallel execution เดียวกัน |
| granularity | string | "plan" หรือ "task_group" |
| depends_on | array/null | Agent IDs หรือ plan refs ที่ตัวนี้ขึ้นอยู่กับ |
| files_modified | array/null | ไฟล์ที่ agent นี้สร้าง/แก้ไข |
| checkpoints_skipped | number/null | จำนวน checkpoints ที่ข้ามใน background |
| task_results | object/null | ผลลัพธ์ต่อ task สำหรับ task-level parallelization |

### Status Lifecycle

```
queued ──> spawned ──────────────────> completed
               │                           ^
               │                           │
               ├──> interrupted ──> resumed┘
               │
               └──> failed
```

- **queued**: รอ dependency (parallel execution เท่านั้น)
- **spawned**: Agent ถูกสร้างผ่าน Task tool, การดำเนินการกำลังทำงาน
- **completed**: Agent ทำงานเสร็จสำเร็จ, ได้รับผลลัพธ์แล้ว
- **interrupted**: Session จบก่อน agent เสร็จ (ตรวจจับเมื่อ resume)
- **resumed**: Agent ที่ถูกขัดจังหวะก่อนหน้าถูก resume ผ่าน resume parameter
- **failed**: การดำเนินการ agent ล้มเหลว (error ระหว่างการดำเนินการ)

## Usage

### เมื่อไหร่ควรสร้างไฟล์

สร้าง `.planning/agent-history.json` จาก template นี้เมื่อ:
- Subagent spawn ครั้งแรกใน execute-plan workflow
- ไฟล์ยังไม่มีอยู่

### เมื่อไหร่ควรเพิ่ม Entry

เพิ่ม entry ใหม่ทันทีหลังจาก Task tool ส่ง agent_id กลับมา:

```
1. Task tool spawns subagent
2. Response มี agent_id
3. เขียน agent_id ลง .planning/current-agent-id.txt
4. เพิ่ม entry ใน agent-history.json ด้วย status "spawned"
```

### เมื่อไหร่ควรอัพเดท Entry

อัพเดท entry ที่มีอยู่เมื่อ:

**เมื่อเสร็จสำเร็จ:**
```json
{
  "status": "completed",
  "completion_timestamp": "2026-01-15T14:45:33Z"
}
```

**เมื่อตรวจจับ resume (พบ agent ที่ถูกขัดจังหวะ):**
```json
{
  "status": "interrupted"
}
```

จากนั้นเพิ่ม entry ใหม่ด้วย status resumed:
```json
{
  "agent_id": "agent_01HXXXX...",
  "status": "resumed",
  "timestamp": "2026-01-15T15:00:00Z"
}
```

### Entry Retention

- เก็บ entries สูงสุด 50 รายการ (configurable ผ่าน max_entries)
- เมื่อเกิน limit ลบ entries ที่ completed เก่าที่สุดก่อน
- ห้ามลบ entries ที่มี status "spawned" (อาจต้อง resume)
- Prune ระหว่าง init_agent_tracking step

## Example Entries

### Sequential Execution (Default)

```json
{
  "agent_id": "agent_01HXY123ABC",
  "task_description": "Execute full plan 02-01 (autonomous)",
  "phase": "02",
  "plan": "01",
  "segment": null,
  "timestamp": "2026-01-15T14:22:10Z",
  "status": "completed",
  "completion_timestamp": "2026-01-15T14:45:33Z",
  "execution_mode": "sequential",
  "parallel_group": null,
  "granularity": "plan",
  "depends_on": null,
  "files_modified": ["src/api/auth.ts", "src/types/user.ts"],
  "checkpoints_skipped": null,
  "task_results": null
}
```

### Parallel Execution (Plan-Level)

แผนอิสระในเฟสที่รันแบบขนาน:

```json
{
  "agent_id": "agent_01HXYZ123",
  "task_description": "Execute plan 05-01 (parallel)",
  "phase": "05",
  "plan": "01",
  "segment": null,
  "timestamp": "2026-01-12T10:00:00Z",
  "status": "completed",
  "completion_timestamp": "2026-01-12T10:15:00Z",
  "execution_mode": "parallel",
  "parallel_group": "phase-05-batch-1736676000",
  "granularity": "plan",
  "depends_on": null,
  "files_modified": ["src/auth/login.ts", "src/auth/types.ts"],
  "checkpoints_skipped": 1,
  "task_results": null
}
```

### Queued with Dependency

Agent ที่รอให้อีกตัวเสร็จ:

```json
{
  "agent_id": "agent_01HXYZ456",
  "task_description": "Execute plan 05-03 (depends on 05-01)",
  "phase": "05",
  "plan": "03",
  "segment": null,
  "timestamp": "2026-01-12T10:15:00Z",
  "status": "spawned",
  "completion_timestamp": null,
  "execution_mode": "parallel",
  "parallel_group": "phase-05-batch-1736676000",
  "granularity": "plan",
  "depends_on": ["agent_01HXYZ123"],
  "files_modified": null,
  "checkpoints_skipped": null,
  "task_results": null
}
```

### Parallel Group Format

- **Plan-level parallel:** `phase-{phase}-batch-{timestamp}`
- **Task-level parallel:** `plan-{phase}-{plan}-tasks-batch-{timestamp}`

ตัวอย่าง: `phase-05-batch-1736676000` รวมกลุ่ม agents ทั้งหมดที่กำลังดำเนินการแผน Phase 5 แบบขนาน

## Parallel Execution Resume

เมื่อ session ถูกขัดจังหวะระหว่าง parallel execution:

### Detection

ตรวจสอบ entries ที่มี `status: "spawned"` และ `parallel_group` ถูกตั้งค่า เหล่านี้คือ agents ที่กำลังทำงานเมื่อ session จบ

```bash
# หา parallel agents ที่ถูกขัดจังหวะ
jq '.entries[] | select(.status == "spawned" and .parallel_group != null)' .planning/agent-history.json
```

### Resume Options

1. **Resume batch:** Resume agents ที่ถูกขัดจังหวะทั้งหมดใน parallel group
2. **Resume single:** Resume agent เฉพาะตาม ID
3. **Start fresh:** ละทิ้ง batch ที่ถูกขัดจังหวะ, เริ่มการดำเนินการใหม่

### Resume Command

`/gsd:resume-task` รับ:
- ไม่มี argument: Resume agent ที่ถูกขัดจังหวะล่าสุด
- Agent ID: Resume agent เฉพาะ
- `--batch`: Resume ทั้ง parallel group

### Conflict Detection

ก่อน resume ตรวจสอบ file modifications ตั้งแต่ spawn:

```bash
git diff --name-only ${SPAWN_COMMIT}..HEAD
```

ถ้าไฟล์ที่แก้ไขโดย agent อื่น conflict กับไฟล์ที่ agent นี้แก้ไข เตือน user ก่อนดำเนินการต่อ สิ่งนี้ป้องกันการเขียนทับงานที่ทำโดย parallel agents อื่นที่เสร็จหลังการขัดจังหวะ

## Related Files

- `.planning/current-agent-id.txt`: บรรทัดเดียวพร้อม agent ID ที่ active อยู่ปัจจุบัน (สำหรับ quick resume lookup)
- `.planning/STATE.md`: Project state รวมถึง session continuity info

---

## Template Notes

**เมื่อไหร่ควรสร้าง:** Subagent spawn ครั้งแรกระหว่าง execute-plan workflow

**ตำแหน่ง:** `.planning/agent-history.json`

**Companion file:** `.planning/current-agent-id.txt` (agent ID เดียว, ถูกเขียนทับในแต่ละ spawn)

**จุดประสงค์:** เปิดใช้ความสามารถ resume สำหรับ subagent executions ที่ถูกขัดจังหวะผ่าน Task tool's resume parameter
