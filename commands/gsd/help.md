---
name: gsd:help
description: แสดงคำสั่ง GSD ที่ใช้ได้และคู่มือการใช้งาน
---

<objective>
แสดง GSD command reference ทั้งหมด

Output เฉพาะ reference content ด้านล่าง อย่าเพิ่ม:

- การวิเคราะห์เฉพาะโปรเจค
- Git status หรือ file context
- คำแนะนำขั้นตอนถัดไป
- ความเห็นใดๆ นอกเหนือจาก reference
  </objective>

<reference>
# GSD Command Reference

**GSD** (Get Shit Done) สร้าง hierarchical project plans ที่ optimize สำหรับ solo agentic development กับ Claude Code

## Quick Start

1. `/gsd:new-project` - Initialize โปรเจคด้วย brief
2. `/gsd:create-roadmap` - สร้าง roadmap และ phases
3. `/gsd:plan-phase <number>` - สร้าง detailed plan สำหรับ phase แรก
4. `/gsd:execute-plan <path>` - Execute plan

## Core Workflow

```
Initialization → Planning → Execution → Milestone Completion
```

### Project Initialization

**`/gsd:new-project`**
Initialize โปรเจคใหม่ด้วย brief และ configuration

- สร้าง `.planning/PROJECT.md` (vision และ requirements)
- สร้าง `.planning/config.json` (workflow mode)
- ถาม workflow mode (interactive/yolo) ล่วงหน้า
- Commit initialization files ไปยัง git

การใช้งาน: `/gsd:new-project`

**`/gsd:create-roadmap`**
สร้าง roadmap และ state tracking สำหรับโปรเจคที่ initialized

- สร้าง `.planning/ROADMAP.md` (phase breakdown)
- สร้าง `.planning/STATE.md` (project memory)
- สร้างโฟลเดอร์ `.planning/phases/`

การใช้งาน: `/gsd:create-roadmap`

**`/gsd:map-codebase`**
Map codebase ที่มีอยู่สำหรับ brownfield projects

- วิเคราะห์ codebase ด้วย parallel Explore agents
- สร้าง `.planning/codebase/` พร้อม 7 focused documents
- ครอบคลุม stack, architecture, structure, conventions, testing, integrations, concerns
- ใช้ก่อน `/gsd:new-project` บน codebases ที่มีอยู่

การใช้งาน: `/gsd:map-codebase`

### Phase Planning

**`/gsd:discuss-phase <number>`**
ช่วยอธิบาย vision สำหรับ phase ก่อนวางแผน

- บันทึกว่าคุณจินตนาการว่า phase นี้ทำงานอย่างไร
- สร้าง CONTEXT.md พร้อม vision, essentials, และ boundaries
- ใช้เมื่อคุณมีไอเดียว่าบางอย่างควรดู/ให้ความรู้สึกอย่างไร

การใช้งาน: `/gsd:discuss-phase 2`

**`/gsd:research-phase <number>`**
Comprehensive ecosystem research สำหรับ niche/complex domains

- ค้นพบ standard stack, architecture patterns, pitfalls
- สร้าง RESEARCH.md พร้อม "how experts build this" knowledge
- ใช้สำหรับ 3D, games, audio, shaders, ML, และ specialized domains อื่น
- ไปไกลกว่า "which library" สู่ ecosystem knowledge

การใช้งาน: `/gsd:research-phase 3`

**`/gsd:list-phase-assumptions <number>`**
ดูว่า Claude กำลังจะทำอะไรก่อนเริ่ม

- แสดง Claude's intended approach สำหรับ phase
- ให้คุณ course-correct ถ้า Claude เข้าใจ vision คุณผิด
- ไม่สร้างไฟล์ - conversational output เท่านั้น

การใช้งาน: `/gsd:list-phase-assumptions 3`

**`/gsd:plan-phase <number>`**
สร้าง detailed execution plan สำหรับ specific phase

- สร้าง `.planning/phases/XX-phase-name/XX-YY-PLAN.md`
- แบ่ง phase เป็น concrete, actionable tasks
- รวม verification criteria และ success measures
- รองรับหลาย plans ต่อ phase (XX-01, XX-02, etc.)

การใช้งาน: `/gsd:plan-phase 1`
ผลลัพธ์: สร้าง `.planning/phases/01-foundation/01-01-PLAN.md`

### Execution

**`/gsd:execute-plan <path>`**
Execute ไฟล์ PLAN.md โดยตรง

- รัน plan tasks ตามลำดับ
- สร้าง SUMMARY.md หลังเสร็จ
- อัพเดท STATE.md ด้วย accumulated context
- Execution รวดเร็วโดยไม่ต้องโหลด full skill context

การใช้งาน: `/gsd:execute-plan .planning/phases/01-foundation/01-01-PLAN.md`

### Roadmap Management

**`/gsd:add-phase <description>`**
เพิ่ม phase ใหม่ต่อท้าย milestone ปัจจุบัน

- เพิ่มใน ROADMAP.md
- ใช้หมายเลขลำดับถัดไป
- อัพเดท phase directory structure

การใช้งาน: `/gsd:add-phase "Add admin dashboard"`

**`/gsd:insert-phase <after> <description>`**
แทรกงานเร่งด่วนเป็น decimal phase ระหว่าง phases ที่มีอยู่

- สร้าง intermediate phase (เช่น 7.1 ระหว่าง 7 และ 8)
- มีประโยชน์สำหรับงานที่ค้นพบซึ่งต้องเกิดกลาง milestone
- คงการเรียงลำดับ phase

การใช้งาน: `/gsd:insert-phase 7 "Fix critical auth bug"`
ผลลัพธ์: สร้าง Phase 7.1

**`/gsd:remove-phase <number>`**
ลบ future phase และ renumber phases ถัดไป

- ลบ phase directory และ references ทั้งหมด
- Renumber phases ถัดไปทั้งหมดเพื่อปิด gap
- ทำงานได้เฉพาะกับ future (unstarted) phases
- Git commit เก็บ historical record

การใช้งาน: `/gsd:remove-phase 17`
ผลลัพธ์: Phase 17 ถูกลบ, phases 18-20 กลายเป็น 17-19

### Milestone Management

**`/gsd:discuss-milestone`**
หาว่าคุณต้องการสร้างอะไรใน milestone ถัดไป

- Review สิ่งที่ ship ใน milestone ก่อนหน้า
- ช่วยคุณระบุ features ที่จะเพิ่ม ปรับปรุง หรือแก้ไข
- Route ไปยัง /gsd:new-milestone เมื่อพร้อม

การใช้งาน: `/gsd:discuss-milestone`

**`/gsd:new-milestone <name>`**
สร้าง milestone ใหม่พร้อม phases สำหรับโปรเจคที่มีอยู่

- เพิ่ม milestone section ใน ROADMAP.md
- สร้างโฟลเดอร์ phase
- อัพเดท STATE.md สำหรับ milestone ใหม่

การใช้งาน: `/gsd:new-milestone "v2.0 Features"`

**`/gsd:complete-milestone <version>`**
Archive milestone ที่เสร็จแล้วและเตรียมสำหรับ version ถัดไป

- สร้าง MILESTONES.md entry พร้อมสถิติ
- Archive full details ไปยังโฟลเดอร์ milestones/
- สร้าง git tag สำหรับ release
- เตรียม workspace สำหรับ version ถัดไป

การใช้งาน: `/gsd:complete-milestone 1.0.0`

### Progress Tracking

**`/gsd:progress`**
ตรวจสอบ project status และ route ไปยัง next action อย่างชาญฉลาด

- แสดง visual progress bar และ completion percentage
- สรุปงานล่าสุดจากไฟล์ SUMMARY
- แสดง current position และสิ่งที่ต้องทำต่อ
- แสดง key decisions และ open issues
- เสนอให้ execute next plan หรือสร้างถ้าไม่มี
- ตรวจจับ 100% milestone completion

การใช้งาน: `/gsd:progress`

### Session Management

**`/gsd:resume-work`**
Resume work จาก session ก่อนหน้าพร้อม full context restoration

- อ่าน STATE.md สำหรับ project context
- แสดง current position และ recent progress
- เสนอ next actions ตาม project state

การใช้งาน: `/gsd:resume-work`

**`/gsd:pause-work`**
สร้าง context handoff เมื่อหยุดงานกลาง phase

- สร้างไฟล์ .continue-here พร้อม current state
- อัพเดท STATE.md session continuity section
- บันทึก in-progress work context

การใช้งาน: `/gsd:pause-work`

### Issue Management

**`/gsd:consider-issues`**
Review deferred issues พร้อม codebase context

- วิเคราะห์ open issues ทั้งหมดกับ codebase state ปัจจุบัน
- ระบุ resolved issues (ปิดได้)
- ระบุ urgent issues (ควร address ตอนนี้)
- ระบุ natural fits สำหรับ upcoming phases
- เสนอ batch actions (close, insert phase, note for planning)

การใช้งาน: `/gsd:consider-issues`

### Todo Management

**`/gsd:add-todo [description]`**
บันทึกไอเดียหรืองานเป็น todo จากการสนทนาปัจจุบัน

- ดึง context จากการสนทนา (หรือใช้ description ที่ให้)
- สร้าง structured todo file ใน `.planning/todos/pending/`
- อนุมาน area จาก file paths สำหรับ grouping
- ตรวจสอบ duplicates ก่อนสร้าง
- อัพเดท STATE.md todo count

การใช้งาน: `/gsd:add-todo` (อนุมานจากการสนทนา)
การใช้งาน: `/gsd:add-todo Fix modal z-index`

**`/gsd:check-todos [area]`**
แสดงรายการ pending todos และเลือกงานที่จะทำ

- แสดง pending todos ทั้งหมดพร้อม title, area, age
- Optional area filter (เช่น `/gsd:check-todos api`)
- โหลด full context สำหรับ todo ที่เลือก
- Route ไปยัง action ที่เหมาะสม (work now, add to phase, brainstorm)
- ย้าย todo ไป done/ เมื่อเริ่มทำงาน

การใช้งาน: `/gsd:check-todos`
การใช้งาน: `/gsd:check-todos api`

### Utility Commands

**`/gsd:help`**
แสดง command reference นี้

## Files & Structure

```
.planning/
├── PROJECT.md            # Project vision
├── ROADMAP.md            # Current phase breakdown
├── STATE.md              # Project memory & context
├── ISSUES.md             # Deferred enhancements (สร้างเมื่อต้องการ)
├── config.json           # Workflow mode & gates
├── todos/                # Captured ideas and tasks
│   ├── pending/          # Todos รอทำ
│   └── done/             # Todos ที่เสร็จแล้ว
├── codebase/             # Codebase map (brownfield projects)
│   ├── STACK.md          # Languages, frameworks, dependencies
│   ├── ARCHITECTURE.md   # Patterns, layers, data flow
│   ├── STRUCTURE.md      # Directory layout, key files
│   ├── CONVENTIONS.md    # Coding standards, naming
│   ├── TESTING.md        # Test setup, patterns
│   ├── INTEGRATIONS.md   # External services, APIs
│   └── CONCERNS.md       # Tech debt, known issues
└── phases/
    ├── 01-foundation/
    │   ├── 01-01-PLAN.md
    │   └── 01-01-SUMMARY.md
    └── 02-core-features/
        ├── 02-01-PLAN.md
        └── 02-01-SUMMARY.md
```

## Workflow Modes

ตั้งค่าระหว่าง `/gsd:new-project`:

**Interactive Mode**

- ยืนยันแต่ละ major decision
- หยุดที่ checkpoints เพื่อขออนุมัติ
- มี guidance มากขึ้นตลอด

**YOLO Mode**

- Auto-approve decisions ส่วนใหญ่
- Execute plans โดยไม่ต้องยืนยัน
- หยุดเฉพาะ critical checkpoints

เปลี่ยนเมื่อไหร่ก็ได้โดยแก้ไข `.planning/config.json`

## Common Workflows

**เริ่มโปรเจคใหม่:**

```
/gsd:new-project
/gsd:create-roadmap
/gsd:plan-phase 1
/gsd:execute-plan .planning/phases/01-foundation/01-01-PLAN.md
```

**Resume work หลังหยุดพัก:**

```
/gsd:progress  # ดูว่าหยุดตรงไหนและทำต่อ
```

**เพิ่มงานเร่งด่วนกลาง milestone:**

```
/gsd:insert-phase 5 "Critical security fix"
/gsd:plan-phase 5.1
/gsd:execute-plan .planning/phases/05.1-critical-security-fix/05.1-01-PLAN.md
```

**Complete milestone:**

```
/gsd:complete-milestone 1.0.0
/gsd:new-project  # เริ่ม milestone ถัดไป
```

**บันทึกไอเดียระหว่างทำงาน:**

```
/gsd:add-todo                    # บันทึกจาก conversation context
/gsd:add-todo Fix modal z-index  # บันทึกด้วย explicit description
/gsd:check-todos                 # Review และทำงาน todos
/gsd:check-todos api             # Filter ตาม area
```

## Getting Help

- อ่าน `.planning/PROJECT.md` สำหรับ project vision
- อ่าน `.planning/STATE.md` สำหรับ current context
- ตรวจสอบ `.planning/ROADMAP.md` สำหรับ phase status
- รัน `/gsd:progress` เพื่อดูว่าอยู่ตรงไหน
  </reference>
