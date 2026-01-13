---
name: gsd:insert-phase
description: แทรกงานเร่งด่วนเป็น decimal phase (เช่น 72.1) ระหว่าง phases ที่มีอยู่
argument-hint: <after> <description>
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
แทรก decimal phase สำหรับงานเร่งด่วนที่ค้นพบกลาง milestone ซึ่งต้องทำระหว่าง integer phases ที่มีอยู่

ใช้หมายเลขทศนิยม (72.1, 72.2, etc.) เพื่อรักษาลำดับ logical ของ phases ที่วางแผนไว้ขณะรองรับการแทรกเร่งด่วน

วัตถุประสงค์: จัดการงานเร่งด่วนที่ค้นพบระหว่าง execution โดยไม่ต้อง renumber roadmap ทั้งหมด
</objective>

<execution_context>
@.planning/ROADMAP.md
@.planning/STATE.md
</execution_context>

<process>

<step name="parse_arguments">
Parse arguments ของคำสั่ง:
- Argument แรก: หมายเลข integer phase ที่จะแทรกหลังจาก
- Arguments ที่เหลือ: คำอธิบาย phase

ตัวอย่าง: `/gsd:insert-phase 72 Fix critical auth bug`
→ after = 72
→ description = "Fix critical auth bug"

Validation:

```bash
if [ $# -lt 2 ]; then
  echo "ERROR: ต้องระบุทั้งหมายเลข phase และคำอธิบาย"
  echo "การใช้งาน: /gsd:insert-phase <after> <description>"
  echo "ตัวอย่าง: /gsd:insert-phase 72 Fix critical auth bug"
  exit 1
fi
```

Parse argument แรกเป็น integer:

```bash
after_phase=$1
shift
description="$*"

# ตรวจสอบ after_phase เป็น integer
if ! [[ "$after_phase" =~ ^[0-9]+$ ]]; then
  echo "ERROR: หมายเลข phase ต้องเป็น integer"
  exit 1
fi
```

</step>

<step name="load_roadmap">
โหลดไฟล์ roadmap:

```bash
if [ -f .planning/ROADMAP.md ]; then
  ROADMAP=".planning/ROADMAP.md"
else
  echo "ERROR: ไม่พบ roadmap (.planning/ROADMAP.md)"
  exit 1
fi
```

อ่านเนื้อหา roadmap เพื่อ parse
</step>

<step name="verify_target_phase">
ตรวจสอบว่า target phase มีอยู่ใน roadmap:

1. ค้นหา "### Phase {after_phase}:" heading
2. ถ้าไม่พบ:

   ```
   ERROR: ไม่พบ Phase {after_phase} ใน roadmap
   Phases ที่มี: [list phase numbers]
   ```

   ออกจากคำสั่ง

3. ตรวจสอบว่า phase อยู่ใน current milestone (ไม่ใช่ completed/archived)
   </step>

<step name="find_existing_decimals">
หา decimal phases ที่มีอยู่หลัง target phase:

1. ค้นหา "### Phase {after_phase}.N:" headings ทั้งหมด
2. ดึง decimal suffixes (เช่น สำหรับ Phase 72: หา 72.1, 72.2, 72.3)
3. หา decimal suffix สูงสุด
4. คำนวณ decimal ถัดไป: max + 1

ตัวอย่าง:

- Phase 72 ไม่มี decimals → ถัดไปคือ 72.1
- Phase 72 มี 72.1 → ถัดไปคือ 72.2
- Phase 72 มี 72.1, 72.2 → ถัดไปคือ 72.3

เก็บเป็น: `decimal_phase="$(printf "%02d" $after_phase).${next_decimal}"`
</step>

<step name="generate_slug">
แปลงคำอธิบาย phase เป็น kebab-case slug:

```bash
slug=$(echo "$description" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//')
```

ชื่อโฟลเดอร์ phase: `{decimal-phase}-{slug}`
ตัวอย่าง: `06.1-fix-critical-auth-bug` (phase 6 insertion)
</step>

<step name="create_phase_directory">
สร้างโครงสร้างโฟลเดอร์ phase:

```bash
phase_dir=".planning/phases/${decimal_phase}-${slug}"
mkdir -p "$phase_dir"
```

ยืนยัน: "สร้างโฟลเดอร์: $phase_dir"
</step>

<step name="update_roadmap">
แทรก phase entry ใหม่ใน roadmap:

1. หาจุดแทรก: ทันทีหลังเนื้อหา Phase {after_phase} (ก่อน phase heading ถัดไปหรือ "---")
2. แทรก phase heading ใหม่พร้อม (INSERTED) marker:

   ```
   ### Phase {decimal_phase}: {Description} (INSERTED)

   **Goal:** [งานเร่งด่วน - รอวางแผน]
   **Depends on:** Phase {after_phase}
   **Plans:** 0 plans

   Plans:
   - [ ] TBD (รัน /gsd:plan-phase {decimal_phase} เพื่อแบ่งงาน)

   **Details:**
   [จะเพิ่มระหว่างวางแผน]
   ```

3. เขียน roadmap ที่อัพเดทกลับไปที่ไฟล์

Marker "(INSERTED)" ช่วยระบุ decimal phases ว่าเป็นการแทรกเร่งด่วน

คงเนื้อหาอื่นทั้งหมดไว้เหมือนเดิม (formatting, spacing, phases อื่น)
</step>

<step name="update_project_state">
อัพเดท STATE.md เพื่อสะท้อน phase ที่แทรก:

1. อ่าน `.planning/STATE.md`
2. ใน "## Accumulated Context" → "### Roadmap Evolution" เพิ่มรายการ:
   ```
   - Phase {decimal_phase} inserted after Phase {after_phase}: {description} (URGENT)
   ```

ถ้าไม่มี section "Roadmap Evolution" ให้สร้างขึ้นมา

เพิ่มหมายเหตุเรื่องเหตุผลการแทรกถ้าเหมาะสม
</step>

<step name="completion">
แสดงสรุปการเสร็จสิ้น:

```
Phase {decimal_phase} แทรกหลัง Phase {after_phase}:
- คำอธิบาย: {description}
- โฟลเดอร์: .planning/phases/{decimal-phase}-{slug}/
- สถานะ: ยังไม่ได้วางแผน
- Marker: (INSERTED) - ระบุว่าเป็นงานเร่งด่วน

Roadmap อัพเดทแล้ว: {roadmap-path}
Project state อัพเดทแล้ว: .planning/STATE.md

---

## ▶ ถัดไป

**Phase {decimal_phase}: {description}** — urgent insertion

`/gsd:plan-phase {decimal_phase}`

<sub>`/clear` ก่อน → เริ่ม context window ใหม่</sub>

---

**ตัวเลือกอื่น:**
- ตรวจสอบผลกระทบการแทรก: ตรวจสอบว่า dependencies ของ Phase {next_integer} ยังสมเหตุสมผล
- ดู roadmap

---
```
</step>

</process>

<anti_patterns>

- อย่าใช้สำหรับงานวางแผนท้าย milestone (ใช้ /gsd:add-phase)
- อย่าแทรกก่อน Phase 1 (decimal 0.1 ไม่สมเหตุสมผล)
- อย่า renumber phases ที่มีอยู่
- อย่าแก้ไขเนื้อหา target phase
- อย่าสร้าง plans ตอนนี้ (นั่นคือ /gsd:plan-phase)
- อย่า commit changes (ผู้ใช้ตัดสินใจเองว่าจะ commit เมื่อไหร่)
  </anti_patterns>

<success_criteria>
การแทรก phase เสร็จสมบูรณ์เมื่อ:

- [ ] สร้างโฟลเดอร์ phase แล้ว: `.planning/phases/{N.M}-{slug}/`
- [ ] อัพเดท roadmap ด้วย phase entry ใหม่ (รวม "(INSERTED)" marker)
- [ ] Phase แทรกในตำแหน่งที่ถูกต้อง (หลัง target phase, ก่อน next integer phase)
- [ ] อัพเดท STATE.md ด้วย roadmap evolution note
- [ ] คำนวณ decimal number ถูกต้อง (ตาม decimals ที่มีอยู่)
- [ ] แจ้งผู้ใช้เรื่องขั้นตอนถัดไปและ dependency implications
      </success_criteria>
