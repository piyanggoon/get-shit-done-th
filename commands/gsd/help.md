---
name: gsd:help
description: แสดงคำสั่ง GSD ที่ใช้ได้และคู่มือการใช้งาน
---

<objective>
แสดง GSD command reference แบบเต็ม

แสดงเฉพาะเนื้อหา reference ด้านล่าง ห้ามเพิ่ม:

- การวิเคราะห์เฉพาะโปรเจกต์
- สถานะ Git หรือ file context
- คำแนะนำขั้นตอนถัดไป
- ความคิดเห็นใดๆ นอกเหนือจาก reference
</objective>

<reference>
# GSD Command Reference

**GSD** (Get Shit Done) สร้างแผนโปรเจกต์แบบลำดับชั้นที่ปรับให้เหมาะสำหรับการพัฒนา agentic คนเดียวกับ Claude Code

## เริ่มต้นอย่างรวดเร็ว

1. `/gsd:new-project` - เริ่มต้นโปรเจกต์พร้อม brief
2. `/gsd:create-roadmap` - สร้าง roadmap และเฟส
3. `/gsd:plan-phase <number>` - สร้างแผนละเอียดสำหรับเฟสแรก
4. `/gsd:execute-plan <path>` - ดำเนินการแผน

## Core Workflow

```
Initialization → Planning → Execution → Milestone Completion
```

### Project Initialization

**`/gsd:new-project`**
เริ่มต้นโปรเจกต์ใหม่พร้อม brief และ configuration

- สร้าง `.planning/PROJECT.md` (วิสัยทัศน์และความต้องการ)
- สร้าง `.planning/config.json` (workflow mode)
- ถาม workflow mode (interactive/yolo) ล่วงหน้า
- Commit ไฟล์ initialization ไปยัง git

การใช้งาน: `/gsd:new-project`

**`/gsd:create-roadmap`**
สร้าง roadmap และการติดตามสถานะสำหรับโปรเจกต์ที่ initialized แล้ว

- สร้าง `.planning/ROADMAP.md` (การแบ่งเฟส)
- สร้าง `.planning/STATE.md` (ความจำโปรเจกต์)
- สร้าง `.planning/phases/` directories

การใช้งาน: `/gsd:create-roadmap`

**`/gsd:map-codebase`**
Map codebase ที่มีอยู่สำหรับโปรเจกต์ brownfield

- วิเคราะห์ codebase ด้วย Explore agents แบบขนาน
- สร้าง `.planning/codebase/` พร้อมเอกสาร 7 รายการที่เฉพาะเจาะจง
- ครอบคลุม stack, architecture, structure, conventions, testing, integrations, concerns
- ใช้ก่อน `/gsd:new-project` บน codebases ที่มีอยู่

การใช้งาน: `/gsd:map-codebase`

### Phase Planning

**`/gsd:discuss-phase <number>`**
ช่วยอธิบายวิสัยทัศน์ของคุณสำหรับเฟสก่อนวางแผน

- จับภาพว่าคุณจินตนาการเฟสนี้ทำงานอย่างไร
- สร้าง CONTEXT.md พร้อมวิสัยทัศน์ สิ่งจำเป็น และขอบเขตของคุณ
- ใช้เมื่อคุณมีไอเดียว่าบางอย่างควรมีหน้าตา/ความรู้สึกอย่างไร

การใช้งาน: `/gsd:discuss-phase 2`

**`/gsd:research-phase <number>`**
การวิจัย ecosystem อย่างครอบคลุมสำหรับ niche/complex domains

- ค้นพบ standard stack, architecture patterns, pitfalls
- สร้าง RESEARCH.md พร้อมความรู้ "ผู้เชี่ยวชาญสร้างสิ่งนี้อย่างไร"
- ใช้สำหรับ 3D, games, audio, shaders, ML และ domains เฉพาะทางอื่นๆ
- ไปไกลกว่า "ใช้ library ไหน" สู่ความรู้ ecosystem

การใช้งาน: `/gsd:research-phase 3`

**`/gsd:list-phase-assumptions <number>`**
ดูว่า Claude วางแผนจะทำอะไรก่อนเริ่ม

- แสดง approach ที่ Claude ตั้งใจสำหรับเฟส
- ให้คุณแก้ไขเส้นทางถ้า Claude เข้าใจวิสัยทัศน์คุณผิด
- ไม่สร้างไฟล์ - แค่ output แบบสนทนา

การใช้งาน: `/gsd:list-phase-assumptions 3`

**`/gsd:plan-phase <number>`**
สร้างแผนดำเนินการละเอียดสำหรับเฟสที่ระบุ

- สร้าง `.planning/phases/XX-phase-name/XX-YY-PLAN.md`
- แบ่งเฟสเป็น tasks ที่เป็นรูปธรรมและปฏิบัติได้
- รวม verification criteria และ success measures
- รองรับหลายแผนต่อเฟส (XX-01, XX-02, etc.)

การใช้งาน: `/gsd:plan-phase 1`
ผลลัพธ์: สร้าง `.planning/phases/01-foundation/01-01-PLAN.md`

### Execution

**`/gsd:execute-plan <path>`**
ดำเนินการไฟล์ PLAN.md เดียว

- รัน plan tasks ตามลำดับ
- สร้าง SUMMARY.md หลังเสร็จ
- อัพเดท STATE.md ด้วย accumulated context
- ใช้สำหรับการดำเนินการแบบ interactive พร้อม checkpoints

การใช้งาน: `/gsd:execute-plan .planning/phases/01-foundation/01-01-PLAN.md`

**`/gsd:execute-phase <phase-number>`**
ดำเนินการแผนทั้งหมดที่ยังไม่ได้ดำเนินการในเฟสด้วย background agents แบบขนาน

- วิเคราะห์ plan dependencies และ spawn แผนอิสระพร้อมกัน
- ใช้เมื่อเฟสมี 2+ แผนและคุณต้องการการดำเนินการแบบ "walk away"
- เคารพ max_concurrent_agents จาก config.json

การใช้งาน: `/gsd:execute-phase 5`

Options (ผ่าน `.planning/config.json` parallelization section):
- `max_concurrent_agents`: จำกัด agents ขนาน (default: 3)
- `skip_checkpoints`: ข้าม human checkpoints ใน background (default: true)
- `min_plans_for_parallel`: แผนขั้นต่ำเพื่อ trigger parallelization (default: 2)

**`/gsd:status [--wait]`**
ตรวจสอบสถานะ background agents จากการดำเนินการแบบขนาน

- แสดง agents ที่กำลังทำงาน/เสร็จแล้วจาก agent-history.json
- ใช้ TaskOutput เพื่อ poll สถานะ agent
- ด้วย `--wait`: รอจนกว่า agents ทั้งหมดจะเสร็จ

การใช้งาน: `/gsd:status` หรือ `/gsd:status --wait`

### Roadmap Management

**`/gsd:add-phase <description>`**
เพิ่มเฟสใหม่ที่ท้าย milestone ปัจจุบัน

- ต่อท้าย ROADMAP.md
- ใช้หมายเลขลำดับถัดไป
- อัพเดทโครงสร้าง phase directory

การใช้งาน: `/gsd:add-phase "Add admin dashboard"`

**`/gsd:insert-phase <after> <description>`**
แทรกงานเร่งด่วนเป็นเฟสทศนิยมระหว่างเฟสที่มีอยู่

- สร้างเฟสกลาง (เช่น 7.1 ระหว่าง 7 และ 8)
- มีประโยชน์สำหรับงานที่ค้นพบที่ต้องเกิดขึ้นกลาง milestone
- รักษาการเรียงลำดับเฟส

การใช้งาน: `/gsd:insert-phase 7 "Fix critical auth bug"`
ผลลัพธ์: สร้าง Phase 7.1

**`/gsd:remove-phase <number>`**
ลบเฟสในอนาคตและเรียงหมายเลขเฟสถัดมาใหม่

- ลบ phase directory และการอ้างอิงทั้งหมด
- เรียงหมายเลขเฟสถัดมาทั้งหมดใหม่เพื่อปิดช่องว่าง
- ใช้ได้เฉพาะกับเฟสในอนาคต (ยังไม่เริ่ม) เท่านั้น
- Git commit เก็บรักษา historical record

การใช้งาน: `/gsd:remove-phase 17`
ผลลัพธ์: Phase 17 ถูกลบ, phases 18-20 กลายเป็น 17-19

### Milestone Management

**`/gsd:discuss-milestone`**
หาว่าคุณต้องการสร้างอะไรใน milestone ถัดไป

- ทบทวนสิ่งที่ ship ใน milestone ก่อนหน้า
- ช่วยคุณระบุ features ที่จะเพิ่ม ปรับปรุง หรือแก้ไข
- Route ไป /gsd:new-milestone เมื่อพร้อม

การใช้งาน: `/gsd:discuss-milestone`

**`/gsd:new-milestone <name>`**
สร้าง milestone ใหม่พร้อมเฟสสำหรับโปรเจกต์ที่มีอยู่

- เพิ่ม milestone section ใน ROADMAP.md
- สร้าง phase directories
- อัพเดท STATE.md สำหรับ milestone ใหม่

การใช้งาน: `/gsd:new-milestone "v2.0 Features"`

**`/gsd:complete-milestone <version>`**
เก็บ milestone ที่เสร็จแล้วและเตรียมสำหรับเวอร์ชันถัดไป

- สร้าง MILESTONES.md entry พร้อม stats
- เก็บรายละเอียดเต็มใน milestones/ directory
- สร้าง git tag สำหรับ release
- เตรียม workspace สำหรับเวอร์ชันถัดไป

การใช้งาน: `/gsd:complete-milestone 1.0.0`

### Progress Tracking

**`/gsd:progress`**
ตรวจสอบสถานะโปรเจกต์และ route อย่างชาญฉลาดไปยัง action ถัดไป

- แสดง visual progress bar และเปอร์เซ็นต์ความสมบูรณ์
- สรุปงานล่าสุดจาก SUMMARY files
- แสดงตำแหน่งปัจจุบันและอะไรต่อไป
- แสดง key decisions และ open issues
- เสนอที่จะดำเนินการแผนถัดไปหรือสร้างถ้าไม่มี
- ตรวจจับ 100% milestone completion

การใช้งาน: `/gsd:progress`

### Session Management

**`/gsd:resume-work`**
กลับมาทำงานจาก session ก่อนหน้าพร้อม full context restoration

- อ่าน STATE.md สำหรับ project context
- แสดงตำแหน่งปัจจุบันและความคืบหน้าล่าสุด
- เสนอ actions ถัดไปตามสถานะโปรเจกต์

การใช้งาน: `/gsd:resume-work`

**`/gsd:pause-work`**
สร้าง context handoff เมื่อหยุดงานกลางเฟส

- สร้างไฟล์ .continue-here พร้อมสถานะปัจจุบัน
- อัพเดท STATE.md session continuity section
- จับ context งานที่กำลังทำ

การใช้งาน: `/gsd:pause-work`

### Issue Management

**`/gsd:consider-issues`**
ทบทวน deferred issues พร้อม codebase context

- วิเคราะห์ open issues ทั้งหมดเทียบกับสถานะ codebase ปัจจุบัน
- ระบุ resolved issues (ปิดได้)
- ระบุ urgent issues (ควรจัดการตอนนี้)
- ระบุ natural fits สำหรับเฟสที่จะมาถึง
- เสนอ batch actions (ปิด, แทรกเฟส, note สำหรับการวางแผน)

การใช้งาน: `/gsd:consider-issues`

### Todo Management

**`/gsd:add-todo [description]`**
จับไอเดียหรือ task เป็น todo จากการสนทนาปัจจุบัน

- ดึง context จากการสนทนา (หรือใช้ description ที่ให้มา)
- สร้างไฟล์ todo แบบมีโครงสร้างใน `.planning/todos/pending/`
- อนุมาน area จาก file paths สำหรับการจัดกลุ่ม
- ตรวจสอบ duplicates ก่อนสร้าง
- อัพเดท STATE.md todo count

การใช้งาน: `/gsd:add-todo` (อนุมานจากการสนทนา)
การใช้งาน: `/gsd:add-todo Add auth token refresh`

**`/gsd:check-todos [area]`**
แสดง pending todos และเลือกอันหนึ่งเพื่อทำงาน

- แสดง pending todos ทั้งหมดพร้อม title, area, age
- Optional area filter (เช่น `/gsd:check-todos api`)
- โหลด full context สำหรับ todo ที่เลือก
- Route ไปยัง action ที่เหมาะสม (ทำตอนนี้, เพิ่มในเฟส, brainstorm)
- ย้าย todo ไป done/ เมื่อเริ่มทำงาน

การใช้งาน: `/gsd:check-todos`
การใช้งาน: `/gsd:check-todos api`

### Utility Commands

**`/gsd:help`**
แสดง command reference นี้

## Files & Structure

```
.planning/
├── PROJECT.md            # วิสัยทัศน์โปรเจกต์
├── ROADMAP.md            # การแบ่งเฟสปัจจุบัน
├── STATE.md              # ความจำโปรเจกต์ & context
├── ISSUES.md             # การปรับปรุงที่เลื่อนไว้ (สร้างเมื่อต้องการ)
├── config.json           # Workflow mode & gates
├── todos/                # ไอเดียและ tasks ที่จับไว้
│   ├── pending/          # Todos ที่รอทำ
│   └── done/             # Todos ที่เสร็จแล้ว
├── codebase/             # Codebase map (โปรเจกต์ brownfield)
│   ├── STACK.md          # ภาษา, frameworks, dependencies
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
- หยุดที่ checkpoints เพื่อ approval
- มี guidance มากขึ้นตลอด

**YOLO Mode**

- Auto-approve decisions ส่วนใหญ่
- ดำเนินการแผนโดยไม่ต้องยืนยัน
- หยุดเฉพาะ critical checkpoints

เปลี่ยนเมื่อไหร่ก็ได้โดยแก้ไข `.planning/config.json`

## Common Workflows

**เริ่มโปรเจกต์ใหม่:**

```
/gsd:new-project
/gsd:create-roadmap
/gsd:plan-phase 1
/gsd:execute-plan .planning/phases/01-foundation/01-01-PLAN.md
```

**กลับมาทำงานหลังพัก:**

```
/gsd:progress  # ดูว่าหยุดตรงไหนและดำเนินการต่อ
```

**เพิ่มงานเร่งด่วนกลาง milestone:**

```
/gsd:insert-phase 5 "Critical security fix"
/gsd:plan-phase 5.1
/gsd:execute-plan .planning/phases/05.1-critical-security-fix/05.1-01-PLAN.md
```

**ทำ milestone เสร็จ:**

```
/gsd:complete-milestone 1.0.0
/gsd:new-project  # เริ่ม milestone ถัดไป
```

**จับไอเดียระหว่างทำงาน:**

```
/gsd:add-todo                    # จับจาก conversation context
/gsd:add-todo Fix modal z-index  # จับด้วย description ที่ระบุ
/gsd:check-todos                 # ทบทวนและทำงานกับ todos
/gsd:check-todos api             # กรองตาม area
```

## Getting Help

- อ่าน `.planning/PROJECT.md` สำหรับวิสัยทัศน์โปรเจกต์
- อ่าน `.planning/STATE.md` สำหรับ context ปัจจุบัน
- ตรวจสอบ `.planning/ROADMAP.md` สำหรับสถานะเฟส
- รัน `/gsd:progress` เพื่อตรวจสอบว่าอยู่ตรงไหน
</reference>
