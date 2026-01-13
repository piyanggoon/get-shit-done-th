---
name: gsd:add-phase
description: เพิ่ม phase ต่อท้าย milestone ปัจจุบันใน roadmap
argument-hint: <description>
allowed-tools:
  - Read
  - Write
  - Bash
---

<objective>
เพิ่ม phase ใหม่ (เลขจำนวนเต็ม) ต่อท้าย milestone ปัจจุบันใน roadmap

คำสั่งนี้จะเพิ่ม phase ตามลำดับต่อจาก phase สุดท้าย โดยคำนวณหมายเลข phase ถัดไปอัตโนมัติจาก phase ที่มีอยู่

วัตถุประสงค์: เพิ่มงานที่วางแผนไว้ซึ่งค้นพบระหว่างทำงาน และควรอยู่ท้าย milestone ปัจจุบัน
</objective>

<execution_context>
@.planning/ROADMAP.md
@.planning/STATE.md
</execution_context>

<process>

<step name="parse_arguments">
แยกวิเคราะห์ arguments ของคำสั่ง:
- ทุก argument รวมกันเป็นคำอธิบาย phase
- ตัวอย่าง: `/gsd:add-phase Add authentication` → description = "Add authentication"
- ตัวอย่าง: `/gsd:add-phase Fix critical performance issues` → description = "Fix critical performance issues"

ถ้าไม่มี argument:

```
ERROR: ต้องระบุคำอธิบาย phase
การใช้งาน: /gsd:add-phase <description>
ตัวอย่าง: /gsd:add-phase Add authentication system
```

ออกจากคำสั่ง
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

อ่านเนื้อหา roadmap เพื่อวิเคราะห์
</step>

<step name="find_current_milestone">
วิเคราะห์ roadmap เพื่อหา milestone ปัจจุบัน:

1. หา heading "## Current Milestone:"
2. ดึงชื่อ milestone และเวอร์ชัน
3. ระบุ phases ทั้งหมดใน milestone นี้ (ก่อนถึง "---" หรือ heading milestone ถัดไป)
4. วิเคราะห์หมายเลข phase ที่มีอยู่ (รวมทศนิยมถ้ามี)

ตัวอย่างโครงสร้าง:

```
## Current Milestone: v1.0 Foundation

### Phase 4: Focused Command System
### Phase 5: Path Routing & Validation
### Phase 6: Documentation & Distribution
```

</step>

<step name="calculate_next_phase">
หาหมายเลข phase จำนวนเต็มสูงสุดใน milestone ปัจจุบัน:

1. ดึงหมายเลข phase ทั้งหมดจาก heading (### Phase N:)
2. กรองเฉพาะ phase จำนวนเต็ม (ไม่รวมทศนิยมเช่น 4.1, 4.2)
3. หาค่าสูงสุด
4. บวก 1 เพื่อได้หมายเลข phase ถัดไป

ตัวอย่าง: ถ้า phases เป็น 4, 5, 5.1, 6 → ถัดไปคือ 7

แปลงเป็นเลขสองหลัก: `printf "%02d" $next_phase`
</step>

<step name="generate_slug">
แปลงคำอธิบาย phase เป็น kebab-case slug:

```bash
# ตัวอย่างการแปลง:
# "Add authentication" → "add-authentication"
# "Fix critical performance issues" → "fix-critical-performance-issues"

slug=$(echo "$description" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//')
```

ชื่อโฟลเดอร์ phase: `{two-digit-phase}-{slug}`
ตัวอย่าง: `07-add-authentication`
</step>

<step name="create_phase_directory">
สร้างโครงสร้างโฟลเดอร์ phase:

```bash
phase_dir=".planning/phases/${phase_num}-${slug}"
mkdir -p "$phase_dir"
```

ยืนยัน: "สร้างโฟลเดอร์: $phase_dir"
</step>

<step name="update_roadmap">
เพิ่ม phase ใหม่ใน roadmap:

1. หาจุดแทรก (หลัง phase สุดท้ายใน milestone ปัจจุบัน ก่อน "---")
2. แทรก heading phase ใหม่:

   ```
   ### Phase {N}: {Description}

   **Goal:** [รอวางแผน]
   **Depends on:** Phase {N-1}
   **Plans:** 0 plans

   Plans:
   - [ ] TBD (รัน /gsd:plan-phase {N} เพื่อแบ่งงาน)

   **Details:**
   [จะเพิ่มระหว่างวางแผน]
   ```

3. เขียน roadmap ที่อัพเดทกลับไปที่ไฟล์

คงเนื้อหาอื่นทั้งหมดไว้เหมือนเดิม (formatting, spacing, phases อื่น)
</step>

<step name="update_project_state">
อัพเดท STATE.md เพื่อสะท้อน phase ใหม่:

1. อ่าน `.planning/STATE.md`
2. ใน "## Current Position" → "**Next Phase:**" เพิ่มการอ้างอิง phase ใหม่
3. ใน "## Accumulated Context" → "### Roadmap Evolution" เพิ่มรายการ:
   ```
   - Phase {N} added: {description}
   ```

ถ้าไม่มี section "Roadmap Evolution" ให้สร้างขึ้นมา
</step>

<step name="completion">
แสดงสรุปการเสร็จสิ้น:

```
Phase {N} ถูกเพิ่มใน milestone ปัจจุบัน:
- คำอธิบาย: {description}
- โฟลเดอร์: .planning/phases/{phase-num}-{slug}/
- สถานะ: ยังไม่ได้วางแผน

Roadmap อัพเดทแล้ว: {roadmap-path}
Project state อัพเดทแล้ว: .planning/STATE.md

---

## ▶ ถัดไป

**Phase {N}: {description}**

`/gsd:plan-phase {N}`

<sub>`/clear` ก่อน → เริ่ม context window ใหม่</sub>

---

**ตัวเลือกอื่น:**
- `/gsd:add-phase <description>` — เพิ่ม phase อีก
- ดู roadmap

---
```
</step>

</process>

<anti_patterns>

- อย่าแก้ไข phases นอก milestone ปัจจุบัน
- อย่าเปลี่ยนหมายเลข phases ที่มีอยู่
- อย่าใช้หมายเลขทศนิยม (นั่นคือ /gsd:insert-phase)
- อย่าสร้าง plans ตอนนี้ (นั่นคือ /gsd:plan-phase)
- อย่า commit changes (ผู้ใช้ตัดสินใจเองว่าจะ commit เมื่อไหร่)
  </anti_patterns>

<success_criteria>
การเพิ่ม phase เสร็จสมบูรณ์เมื่อ:

- [ ] สร้างโฟลเดอร์ phase แล้ว: `.planning/phases/{NN}-{slug}/`
- [ ] อัพเดท roadmap ด้วย phase ใหม่แล้ว
- [ ] อัพเดท STATE.md ด้วย roadmap evolution note แล้ว
- [ ] Phase ใหม่ปรากฏท้าย milestone ปัจจุบัน
- [ ] คำนวณหมายเลข phase ถัดไปถูกต้อง (ไม่รวมทศนิยม)
- [ ] แจ้งผู้ใช้เรื่องขั้นตอนถัดไปแล้ว
      </success_criteria>
