<purpose>
สร้าง milestone ใหม่สำหรับโปรเจกต์ที่มีอยู่ กำหนด phases อัปเดต roadmap และรีเซ็ตการติดตามสถานะสำหรับ milestone ใหม่

นี่ใช้หลังจาก milestone เสร็จสมบูรณ์เมื่อพร้อมกำหนดงานชุดถัดไป
</purpose>

<required_reading>
**อ่านไฟล์เหล่านี้ตอนนี้:**

1. ~/.claude/get-shit-done/templates/roadmap.md (รูปแบบจัดกลุ่มตาม milestone)
2. `.planning/ROADMAP.md`
3. `.planning/STATE.md`
4. `.planning/MILESTONES.md` (ถ้ามี)
   </required_reading>

<process>

<step name="load_context">
โหลด context โปรเจกต์:

```bash
cat .planning/ROADMAP.md
cat .planning/STATE.md
cat .planning/MILESTONES.md 2>/dev/null || echo "No milestones file yet"
cat .planning/MILESTONE-CONTEXT.md 2>/dev/null || echo "No milestone context file"
```

ดึง:

- เวอร์ชัน milestone ก่อนหน้า (เช่น v1.0)
- หมายเลข phase สุดท้ายที่ใช้
- Issues ที่เลื่อนจาก STATE.md
- Context โปรเจกต์จาก PROJECT.md (What This Is, Core Value)

**ตรวจสอบ milestone context จาก discuss-milestone:**

หาก `.planning/MILESTONE-CONTEXT.md` มีอยู่:
- นี่มี context จาก `/gsd:discuss-milestone`
- ดึง: features, ชื่อที่แนะนำ, การ map phase, constraints
- ใช้สิ่งนี้เพื่อกรอกรายละเอียด milestone ล่วงหน้า (ข้ามการถามข้อมูลที่รวบรวมแล้ว)

**คำนวณเวอร์ชัน milestone ถัดไป:**

- ถ้าก่อนหน้าเป็น v1.0 → แนะนำ v1.1 (minor) หรือ v2.0 (major)
- ถ้าก่อนหน้าเป็น v1.3 → แนะนำ v1.4 หรือ v2.0
- Parse จากส่วน "Completed Milestones" ใน ROADMAP.md
  </step>

<step name="get_milestone_info">
**หาก MILESTONE-CONTEXT.md มีอยู่ (จาก /gsd:discuss-milestone):**
ใช้ features, scope และ constraints จากไฟล์ context
ใช้ชื่อ milestone ที่แนะนำจากส่วน `<scope>`
ใช้การ map phase จากส่วน `<phase_mapping>`

**หากเรียกโดยตรง (ไม่มี MILESTONE-CONTEXT.md):**
ถามรายละเอียด milestone:

header: "ชื่อ Milestone"
question: "ควรเรียก milestone นี้ว่าอะไร?"
options:

- "v[X.Y] Features" - เพิ่มฟังก์ชันใหม่
- "v[X.Y] Improvements" - ปรับปรุงฟีเจอร์ที่มี
- "v[X.Y] Fixes" - Bug fixes และ stability
- "v[X.Y] Refactor" - คุณภาพโค้ดและ architecture
- "v[X.Y+1].0 [Major]" - เพิ่มเวอร์ชันหลัก
- "Other" - ชื่อกำหนดเอง

รับชื่อ milestone ในรูปแบบ: "v[X.Y] [Name]"
</step>

<step name="identify_phases">
**คำนวณหมายเลข phase เริ่มต้น:**

```bash
# หาหมายเลข phase สูงสุดจาก roadmap
grep -E "^### Phase [0-9]+" .planning/ROADMAP.md | tail -1
# ดึงหมายเลข บวก 1
```

Phase ถัดไปเริ่มที่: [last_phase + 1]

**ตรวจสอบการตั้งค่า depth และรวบรวม phases ตามนั้น:**

```bash
cat .planning/config.json 2>/dev/null | grep depth
```

| Depth | Phases/Milestone |
|-------|------------------|
| Quick | 3-5 |
| Standard | 5-8 |
| Comprehensive | 8-12 |

หาก context จาก discuss-milestone ให้มา ใช้ scope นั้น

ไม่เช่นนั้น ถาม:

```
Milestone นี้ควรรวม phases อะไรบ้าง?

เริ่มที่ Phase [N]:
- Phase [N]: [name] - [goal หนึ่งบรรทัด]
- Phase [N+1]: [name] - [goal หนึ่งบรรทัด]
...

อธิบาย phases หรือพูดว่า "help me break this down" สำหรับคำแนะนำ
```

สำหรับแต่ละ phase จับ:

- หมายเลข Phase (ลำดับต่อเนื่อง)
- ชื่อ Phase (kebab-case สำหรับ directory)
- Goal หนึ่งบรรทัด
- Flag Research (Likely/Unlikely ตาม triggers)
  </step>

<step name="detect_research_needs">
**สำหรับแต่ละ phase กำหนดว่าต้องการ research หรือไม่**

ใช้ research triggers จาก create-roadmap.md:

<research_triggers>
**Likely (flag phase):**

| รูปแบบ Trigger                                        | ทำไมต้อง Research                       |
| ----------------------------------------------------- | --------------------------------------- |
| "integrate [service]", "connect to [API]"             | External API - ต้องการ docs ปัจจุบัน    |
| "authentication", "auth", "login", "JWT"              | การตัดสินใจ Architectural + เลือก library |
| "payment", "billing", "Stripe", "subscription"        | External API + compliance patterns      |
| "email", "SMS", "notifications", "SendGrid", "Twilio" | External service integration            |
| "database", "Postgres", "MongoDB", "Supabase"         | หากใหม่สำหรับโปรเจกต์ - setup patterns  |
| "real-time", "websocket", "sync", "live updates"      | การตัดสินใจ Architectural              |
| "deploy", "Vercel", "Railway", "hosting"              | หาก deployment ครั้งแรก - config patterns |
| "choose between", "select", "evaluate", "which"       | ต้องการการตัดสินใจชัดเจน               |
| "AI", "OpenAI", "Claude", "LLM", "embeddings"         | APIs เปลี่ยนเร็ว - ต้องการ docs ปัจจุบัน |
| Technology ใดๆ ที่ยังไม่มีใน codebase                 | Integration ใหม่                        |

**Unlikely (ไม่ต้อง flag):**

| รูปแบบ                                      | ทำไมไม่ต้อง Research    |
| ------------------------------------------- | ----------------------- |
| "add button", "create form", "update UI"    | Internal patterns       |
| "CRUD operations", "list/detail views"      | Standard patterns       |
| "refactor", "reorganize", "clean up"        | งานภายใน               |
| "following existing patterns"               | Conventions ที่ตั้งไว้แล้ว |
| Technology ที่มีใน package.json/codebase แล้ว | มี Patterns อยู่แล้ว     |

</research_triggers>

แสดงการประเมิน research:

```
Research needs ที่ตรวจพบ:

Phase [N]: [Name]
  Research: Unlikely (internal patterns)

Phase [N+1]: [Name]
  Research: Likely (new API integration)
  Topics: [สิ่งที่ต้องสืบค้น]

ดูถูกต้องไหม? (yes / adjust)
```

</step>

<step name="confirm_phases">
<config-check>
```bash
cat .planning/config.json 2>/dev/null
```
</config-check>

<if mode="yolo">
```
⚡ อนุมัติอัตโนมัติ: Milestone phases ([N] phases)

1. Phase [X]: [Name] - [goal]
2. Phase [X+1]: [Name] - [goal]
...

ดำเนินการสร้างโครงสร้าง milestone...
```

ดำเนินการไปยังขั้นตอน update_roadmap โดยตรง
</if>

<if mode="interactive" OR="missing OR custom with gates.confirm_phases true">
แสดงการแบ่ง phase:

```
Milestone: v[X.Y] [Name]

Phases:
1. Phase [X]: [Name] - [goal]
2. Phase [X+1]: [Name] - [goal]
3. Phase [X+2]: [Name] - [goal]

รู้สึกถูกต้องไหม? (yes / adjust)
```

หาก "adjust": ถามว่าต้องเปลี่ยนอะไร แก้ไข แสดงอีกครั้ง
</step>

<step name="update_roadmap">
เขียนรายละเอียด milestone ใหม่ลง `.planning/ROADMAP.md`

**ไฟล์ที่อัปเดต:** `.planning/ROADMAP.md`

ไฟล์ ROADMAP.md หลักเก็บรายละเอียด phase ทั้งหมดสำหรับ milestone ที่ active ไฟล์ Archive ใน `milestones/` สร้างเมื่อ milestone ส่งมอบเท่านั้น (ผ่าน `/gsd:complete-milestone`)

**กระบวนการ:**

**1. อัปเดตส่วน Milestones:**

เพิ่ม milestone ใหม่ลงรายการ milestones Milestone ที่เสร็จแล้วแสดงเป็นลิงก์ไปยังไฟล์ archive milestone ใหม่แสดงว่ากำลังดำเนินการ

```markdown
## Milestones

- ✅ **v1.0 [Previous]** - [ลิงก์ไปยัง milestones/v1.0-ROADMAP.md] (Phases 1-9, shipped YYYY-MM-DD)
- 🚧 **v[X.Y] [Name]** - Phases [N]-[M] (in progress)
```

**2. เพิ่มรายละเอียด phase ทั้งหมด:**

เขียนส่วน phase ที่สมบูรณ์สำหรับทุก phases ใน milestone นี้ แต่ละ phase ได้รายละเอียดครบถ้วนรวม goal, dependencies, การประเมิน research และ plan placeholders

```markdown
### 🚧 v[X.Y] [Name] (In Progress)

**Milestone Goal:** [หนึ่งประโยคอธิบายสิ่งที่ milestone นี้ส่งมอบ]

#### Phase [N]: [Name]

**Goal**: [สิ่งที่ phase นี้ส่งมอบ]
**Depends on**: Phase [N-1] (หรือ "Previous milestone complete")
**Research**: [Likely/Unlikely] ([เหตุผล])
**Research topics**: [หาก Likely สิ่งที่ต้องสืบค้น]
**Plans**: TBD

Plans:
- [ ] [N]-01: TBD (run /gsd:plan-phase [N] to break down)

#### Phase [N+1]: [Name]

**Goal**: [สิ่งที่ phase นี้ส่งมอบ]
**Depends on**: Phase [N]
**Research**: [Likely/Unlikely] ([เหตุผล])
**Plans**: TBD

Plans:
- [ ] [N+1]-01: TBD

[... ต่อสำหรับทุก phases ใน milestone นี้ ...]
```

**3. อัปเดตตาราง Progress:**

เพิ่มแถวสำหรับ phases ใหม่ทั้งหมดพร้อมระบุ milestone

```markdown
| Phase         | Milestone | Plans | Status      | Completed |
| ------------- | --------- | ----- | ----------- | --------- |
| [N]. [Name]   | v[X.Y]    | 0/?   | Not started | -         |
| [N+1]. [Name] | v[X.Y]    | 0/?   | Not started | -         |
```

</step>

<step name="create_phase_directories">
สร้าง directories สำหรับ phases ใหม่:

```bash
mkdir -p .planning/phases/[NN]-[slug]
mkdir -p .planning/phases/[NN+1]-[slug]
# ... สำหรับแต่ละ phase
```

ใช้ padding สองหลัก: `10-name`, `11-name` เป็นต้น
</step>

<step name="update_state">
อัปเดต `.planning/STATE.md` สำหรับ milestone ใหม่:

**อัปเดต Current Position:**

```markdown
## Current Position

Phase: [N] of [M] ([ชื่อ Phase แรก])
Plan: Not started
Status: Ready to plan
Last activity: [วันนี้] - Milestone v[X.Y] created

Progress: ░░░░░░░░░░ 0%
```

**อัปเดต Accumulated Context:**

เก็บการตัดสินใจจาก milestone ก่อนหน้า (เป็นบันทึกประวัติ)
ล้างส่วน "Blockers/Concerns Carried Forward"

**เพิ่มลง Roadmap Evolution:**

```markdown
### Roadmap Evolution

- Milestone v[X.Y] created: [theme/focus], [N] phases (Phase [start]-[end])
```

**อัปเดต Session Continuity:**

```markdown
## Session Continuity

Last session: [วันและเวลาวันนี้]
Stopped at: Milestone v[X.Y] initialization
Resume file: None
```

</step>

<step name="git_commit">
Commit การสร้าง milestone:

```bash
git add .planning/ROADMAP.md .planning/STATE.md
git add .planning/phases/
git commit -m "$(cat <<'EOF'
docs: create milestone v[X.Y] [Name] ([N] phases)

Phases:
- [N]. [name]: [goal]
- [N+1]. [name]: [goal]
- [N+2]. [name]: [goal]
EOF
)"
```

ยืนยัน: "Committed: docs: create milestone v[X.Y] [Name]"
</step>

<step name="cleanup_context">
ลบไฟล์ milestone context ชั่วคราวหากมี:

```bash
rm -f .planning/MILESTONE-CONTEXT.md
```

ไฟล์นี้เป็น artifact ส่งต่อจาก `/gsd:discuss-milestone` ตอนนี้ที่ milestone สร้างแล้ว context คงอยู่ใน ROADMAP.md และไฟล์ชั่วคราวไม่จำเป็นอีกต่อไป
</step>

<step name="offer_next">
```
Milestone v[X.Y] [Name] created:
- Phases: [N]-[M] ([count] phases)
- Directories created
- ROADMAP.md updated
- STATE.md reset for new milestone

---

## ▶ ถัดไป

**Phase [N]: [Name]** — [Goal จาก ROADMAP.md]

`/gsd:plan-phase [N]`

<sub>`/clear` ก่อน → context window ใหม่</sub>

---

**ยังมีให้เลือก:**
- `/gsd:discuss-phase [N]` — รวบรวม context ก่อน
- `/gsd:research-phase [N]` — สืบค้นสิ่งที่ไม่รู้
- Review roadmap

---
```
</step>

</process>

<phase_naming>
ใช้รูปแบบ `XX-kebab-case-name` พร้อมลำดับต่อเนื่อง:
- `10-user-profiles`
- `11-notifications`
- `12-analytics`

หมายเลขต่อจาก milestone ก่อนหน้า ชื่ออธิบายเนื้อหา
</phase_naming>

<anti_patterns>
- อย่าเริ่มหมายเลข phase ใหม่ที่ 01 (ลำดับต่อเนื่อง)
- อย่าเพิ่มการประมาณเวลา
- อย่าสร้าง Gantt charts
- เคารพการตั้งค่า depth สำหรับจำนวน phase (quick: 3-5, standard: 5-8, comprehensive: 8-12)
- อย่าแก้ไขส่วน milestone ที่เสร็จแล้ว

Milestones เป็นชุดงานที่สอดคล้องกัน ไม่ใช่ artifacts การจัดการโปรเจกต์
</anti_patterns>

<success_criteria>
Milestone creation สมบูรณ์เมื่อ:
- [ ] หมายเลข phase ถัดไปคำนวณถูกต้อง (ต่อจากก่อนหน้า)
- [ ] Phases กำหนดตามการตั้งค่า depth (quick: 3-5, standard: 5-8, comprehensive: 8-12)
- [ ] Research flags กำหนดสำหรับแต่ละ phase
- [ ] ROADMAP.md อัปเดตด้วยส่วน milestone ใหม่
- [ ] Phase directories สร้างแล้ว
- [ ] STATE.md รีเซ็ตสำหรับ milestone ใหม่
- [ ] Git commit ทำแล้ว
- [ ] ผู้ใช้รู้ขั้นตอนถัดไป
</success_criteria>
```
