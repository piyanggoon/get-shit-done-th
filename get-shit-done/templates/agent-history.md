# Agent History Template

Template สำหรับ `.planning/agent-history.json` - ติดตาม subagent spawns ระหว่าง plan execution เพื่อ resume capability

---

## File Template

```json
{
  "version": "1.0",
  "max_entries": 50,
  "entries": []
}
```

## Entry Schema

แต่ละ entry ติดตาม subagent spawn หรือการเปลี่ยนแปลง status:

```json
{
  "agent_id": "agent_01HXXXX...",
  "task_description": "Execute tasks 1-3 from plan 02-01",
  "phase": "02",
  "plan": "01",
  "segment": 1,
  "timestamp": "2026-01-15T14:22:10Z",
  "status": "spawned",
  "completion_timestamp": null
}
```

### Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| agent_id | string | Unique ID ที่ Task tool return |
| task_description | string | คำอธิบายสั้นว่า agent กำลัง execute อะไร |
| phase | string | หมายเลข phase (เช่น "02", "02.1") |
| plan | string | หมายเลข plan ใน phase |
| segment | number | หมายเลข segment (1-based) สำหรับ segmented plans, null สำหรับ Pattern A |
| timestamp | string | ISO 8601 timestamp เมื่อ spawn agent |
| status | string | Status ปัจจุบัน: spawned, completed, interrupted, resumed |
| completion_timestamp | string/null | ISO 8601 timestamp เมื่อเสร็จ, null ถ้ายังรอ |

### Status Lifecycle

```
spawned ──────────────────────────> completed
    │                                   ^
    │                                   │
    └──> interrupted ──> resumed ───────┘
```

- **spawned**: Agent ถูกสร้างผ่าน Task tool, กำลัง execute
- **completed**: Agent เสร็จสำเร็จ, ได้รับผลลัพธ์แล้ว
- **interrupted**: Session จบก่อน agent เสร็จ (ตรวจพบเมื่อ resume)
- **resumed**: Agent ที่ถูกขัดจังหวะก่อนหน้า resume ผ่าน resume parameter

## Usage

### เมื่อไหร่ควรสร้างไฟล์

สร้าง `.planning/agent-history.json` จาก template นี้เมื่อ:
- Spawn subagent ครั้งแรกใน execute-phase workflow
- ไฟล์ยังไม่มี

### เมื่อไหร่ควรเพิ่ม Entry

เพิ่ม entry ใหม่ทันทีหลัง Task tool return พร้อม agent_id:

```
1. Task tool spawns subagent
2. Response มี agent_id
3. เขียน agent_id ไปยัง .planning/current-agent-id.txt
4. เพิ่ม entry ใน agent-history.json พร้อม status "spawned"
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

**เมื่อตรวจพบ resume (พบ interrupted agent):**
```json
{
  "status": "interrupted"
}
```

จากนั้นเพิ่ม entry ใหม่พร้อม resumed status:
```json
{
  "agent_id": "agent_01HXXXX...",
  "status": "resumed",
  "timestamp": "2026-01-15T15:00:00Z"
}
```

### Entry Retention

- เก็บ entries สูงสุด 50 รายการ (ปรับได้ผ่าน max_entries)
- เมื่อเกิน limit ลบ completed entries เก่าสุดก่อน
- ไม่เคยลบ entries ที่มี status "spawned" (อาจต้อง resume)
- Prune ระหว่าง init_agent_tracking step

## Example File

```json
{
  "version": "1.0",
  "max_entries": 50,
  "entries": [
    {
      "agent_id": "agent_01HXY123ABC",
      "task_description": "Execute full plan 02-01 (autonomous)",
      "phase": "02",
      "plan": "01",
      "segment": null,
      "timestamp": "2026-01-15T14:22:10Z",
      "status": "completed",
      "completion_timestamp": "2026-01-15T14:45:33Z"
    },
    {
      "agent_id": "agent_01HXY456DEF",
      "task_description": "Execute tasks 1-3 from plan 02-02",
      "phase": "02",
      "plan": "02",
      "segment": 1,
      "timestamp": "2026-01-15T15:00:00Z",
      "status": "spawned",
      "completion_timestamp": null
    }
  ]
}
```

## Related Files

- `.planning/current-agent-id.txt`: บรรทัดเดียวพร้อม agent ID ที่ active อยู่ (สำหรับ quick resume lookup)
- `.planning/STATE.md`: Project state รวมถึง session continuity info

---

## Template Notes

**เมื่อไหร่ควรสร้าง:** Spawn subagent ครั้งแรกระหว่าง execute-phase workflow

**Location:** `.planning/agent-history.json`

**Companion file:** `.planning/current-agent-id.txt` (agent ID เดียว, เขียนทับทุกครั้งที่ spawn)

**วัตถุประสงค์:** เปิดใช้ resume capability สำหรับ interrupted subagent executions ผ่าน Task tool's resume parameter
