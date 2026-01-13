---
name: gsd:remove-phase
description: ลบ future phase จาก roadmap และ renumber phases ถัดไป
argument-hint: <phase-number>
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
---

<objective>
ลบ unstarted future phase จาก roadmap และ renumber phases ถัดไปทั้งหมดเพื่อรักษาลำดับ linear ที่สะอาด

วัตถุประสงค์: ลบงานที่ตัดสินใจไม่ทำอย่างสะอาด โดยไม่ทำให้ context เต็มไปด้วย cancelled/deferred markers
Output: Phase ถูกลบ, phases ถัดไปทั้งหมดถูก renumber, git commit เป็น historical record
</objective>

<execution_context>
@.planning/ROADMAP.md
@.planning/STATE.md
</execution_context>

<process>

<step name="parse_arguments">
Parse arguments ของคำสั่ง:
- Argument คือ phase number ที่จะลบ (integer หรือ decimal)
- ตัวอย่าง: `/gsd:remove-phase 17` → phase = 17
- ตัวอย่าง: `/gsd:remove-phase 16.1` → phase = 16.1

ถ้าไม่มี argument:

```
ERROR: ต้องระบุ phase number
การใช้งาน: /gsd:remove-phase <phase-number>
ตัวอย่าง: /gsd:remove-phase 17
```

ออกจากคำสั่ง
</step>

<step name="load_state">
โหลด project state:

```bash
cat .planning/STATE.md 2>/dev/null
cat .planning/ROADMAP.md 2>/dev/null
```

Parse current phase number จาก STATE.md "Current Position" section
</step>

<step name="validate_phase_exists">
ตรวจสอบว่า target phase มีอยู่ใน ROADMAP.md:

1. ค้นหา `### Phase {target}:` heading
2. ถ้าไม่พบ:

   ```
   ERROR: ไม่พบ Phase {target} ใน roadmap
   Phases ที่มี: [list phase numbers]
   ```

   ออกจากคำสั่ง
</step>

<step name="validate_future_phase">
ตรวจสอบว่า phase เป็น future phase (ยังไม่เริ่ม):

1. เปรียบเทียบ target phase กับ current phase จาก STATE.md
2. Target ต้อง > current phase number

ถ้า target <= current phase:

```
ERROR: ไม่สามารถลบ Phase {target}

ลบได้เฉพาะ future phases:
- Current phase: {current}
- Phase {target} เป็น current หรือ completed

เพื่อยกเลิกงานปัจจุบัน ใช้ /gsd:pause-work แทน
```

ออกจากคำสั่ง

3. ตรวจสอบไฟล์ SUMMARY.md ในโฟลเดอร์ phase:

```bash
ls .planning/phases/{target}-*/*-SUMMARY.md 2>/dev/null
```

ถ้ามีไฟล์ SUMMARY.md:

```
ERROR: Phase {target} มีงานที่เสร็จแล้ว

พบ executed plans:
- {list of SUMMARY.md files}

ไม่สามารถลบ phases ที่มีงานเสร็จแล้ว
```

ออกจากคำสั่ง
</step>

<step name="gather_phase_info">
รวบรวมข้อมูลเกี่ยวกับ phase ที่จะลบ:

1. ดึงชื่อ phase จาก ROADMAP.md heading: `### Phase {target}: {Name}`
2. หาโฟลเดอร์ phase: `.planning/phases/{target}-{slug}/`
3. หา phases ถัดไปทั้งหมด (integer และ decimal) ที่ต้อง renumber

**การตรวจจับ subsequent phases:**

สำหรับการลบ integer phase (เช่น 17):
- หา phases ทั้งหมด > 17 (integers: 18, 19, 20...)
- หา decimal phases ทั้งหมด >= 17.0 และ < 18.0 (17.1, 17.2...) → กลายเป็น 16.x
- หา decimal phases สำหรับ subsequent integers (18.1, 19.1...) → renumber ไปกับ parent

สำหรับการลบ decimal phase (เช่น 17.1):
- หา decimal phases ทั้งหมด > 17.1 และ < 18 (17.2, 17.3...) → renumber ลง
- Integer phases ไม่เปลี่ยน

แสดงรายการ phases ทั้งหมดที่จะถูก renumber
</step>

<step name="confirm_removal">
แสดงสรุปการลบและขอยืนยัน:

```
กำลังจะลบ Phase {target}: {Name}

จะทำสิ่งนี้:
- ลบ: .planning/phases/{target}-{slug}/
- Renumber {N} subsequent phases:
  - Phase 18 → Phase 17
  - Phase 18.1 → Phase 17.1
  - Phase 19 → Phase 18
  [etc.]

ดำเนินการ? (y/n)
```

รอการยืนยัน
</step>

<step name="delete_phase_directory">
ลบโฟลเดอร์ target phase ถ้ามี:

```bash
if [ -d ".planning/phases/{target}-{slug}" ]; then
  rm -rf ".planning/phases/{target}-{slug}"
  echo "ลบแล้ว: .planning/phases/{target}-{slug}/"
fi
```

ถ้าไม่มีโฟลเดอร์ จด: "ไม่มีโฟลเดอร์ให้ลบ (phase ยังไม่ได้สร้าง)"
</step>

<step name="renumber_directories">
เปลี่ยนชื่อโฟลเดอร์ subsequent phases ทั้งหมด:

สำหรับแต่ละโฟลเดอร์ phase ที่ต้อง renumber (เรียงจากมากไปน้อยเพื่อหลีกเลี่ยง conflicts):

```bash
# ตัวอย่าง: เปลี่ยนชื่อ 18-dashboard เป็น 17-dashboard
mv ".planning/phases/18-dashboard" ".planning/phases/17-dashboard"
```

ดำเนินการจากมากไปน้อย (20→19, แล้ว 19→18, แล้ว 18→17) เพื่อหลีกเลี่ยงการเขียนทับ

เปลี่ยนชื่อโฟลเดอร์ decimal phase ด้วย:
- `17.1-fix-bug` → `16.1-fix-bug` (ถ้าลบ integer 17)
- `17.2-hotfix` → `17.1-hotfix` (ถ้าลบ decimal 17.1)
</step>

<step name="rename_files_in_directories">
เปลี่ยนชื่อไฟล์ plan ในโฟลเดอร์ที่ renumber แล้ว:

สำหรับแต่ละโฟลเดอร์ที่ renumber เปลี่ยนชื่อไฟล์ที่มี phase number:

```bash
# ใน 17-dashboard (เดิมเป็น 18-dashboard):
mv "18-01-PLAN.md" "17-01-PLAN.md"
mv "18-02-PLAN.md" "17-02-PLAN.md"
mv "18-01-SUMMARY.md" "17-01-SUMMARY.md"  # ถ้ามี
# etc.
```

จัดการ CONTEXT.md และ DISCOVERY.md ด้วย (เหล่านี้ไม่มี phase prefixes จึงไม่ต้องเปลี่ยนชื่อ)
</step>

<step name="update_roadmap">
อัพเดท ROADMAP.md:

1. **ลบ phase section ทั้งหมด:**
   - ลบจาก `### Phase {target}:` ถึง phase heading ถัดไป (หรือ section end)

2. **ลบจาก phase list:**
   - ลบบรรทัด `- [ ] **Phase {target}: {Name}**` หรือคล้ายกัน

3. **ลบจาก Progress table:**
   - ลบ row สำหรับ Phase {target}

4. **Renumber phases ถัดไปทั้งหมด:**
   - `### Phase 18:` → `### Phase 17:`
   - `- [ ] **Phase 18:` → `- [ ] **Phase 17:`
   - Table rows: `| 18. Dashboard |` → `| 17. Dashboard |`
   - Plan references: `18-01:` → `17-01:`

5. **อัพเดท dependency references:**
   - `**Depends on:** Phase 18` → `**Depends on:** Phase 17`
   - สำหรับ phase ที่ depend on phase ที่ลบ:
     - `**Depends on:** Phase 17` (ลบแล้ว) → `**Depends on:** Phase 16`

6. **Renumber decimal phases:**
   - `### Phase 17.1:` → `### Phase 16.1:` (ถ้าลบ integer 17)
   - อัพเดท references ทั้งหมดให้สอดคล้องกัน

เขียน ROADMAP.md ที่อัพเดท
</step>

<step name="update_state">
อัพเดท STATE.md:

1. **อัพเดท total phase count:**
   - `Phase: 16 of 20` → `Phase: 16 of 19`

2. **คำนวณ progress percentage ใหม่:**
   - Percentage ใหม่ตาม completed plans / new total plans

อย่าเพิ่ม "Roadmap Evolution" note - git commit คือ record

เขียน STATE.md ที่อัพเดท
</step>

<step name="update_file_contents">
ค้นหาและอัพเดท phase references ในไฟล์ plan:

```bash
# หาไฟล์ที่อ้างอิง phase numbers เดิม
grep -r "Phase 18" .planning/phases/17-*/ 2>/dev/null
grep -r "Phase 19" .planning/phases/18-*/ 2>/dev/null
# etc.
```

อัพเดท internal references เพื่อสะท้อน numbering ใหม่
</step>

<step name="commit">
Stage และ commit การลบ:

```bash
git add .planning/
git commit -m "chore: remove phase {target} ({original-phase-name})"
```

Commit message เก็บ historical record ของสิ่งที่ถูกลบ
</step>

<step name="completion">
แสดงสรุปการเสร็จสิ้น:

```
Phase {target} ({original-name}) ลบแล้ว

การเปลี่ยนแปลง:
- ลบ: .planning/phases/{target}-{slug}/
- Renumber: Phases {first-renumbered}-{last-old} → {first-renumbered-1}-{last-new}
- อัพเดท: ROADMAP.md, STATE.md
- Committed: chore: remove phase {target} ({original-name})

Roadmap ปัจจุบัน: {total-remaining} phases
ตำแหน่งปัจจุบัน: Phase {current} จาก {new-total}

---

## ถัดไป

ต้องการ:
- `/gsd:progress` — ดู roadmap status ที่อัพเดท
- ทำ current phase ต่อ
- Review roadmap

---
```
</step>

</process>

<anti_patterns>

- อย่าลบ completed phases (มีไฟล์ SUMMARY.md)
- อย่าลบ current หรือ past phases
- อย่าทิ้ง gaps ใน numbering - renumber เสมอ
- อย่าเพิ่ม "removed phase" notes ใน STATE.md - git commit คือ record
- อย่าถามเรื่องแต่ละ decimal phase - renumber เลย
- อย่าแก้ไขโฟลเดอร์ completed phases
</anti_patterns>

<edge_cases>

**ลบ decimal phase (เช่น 17.1):**
- ส่งผลเฉพาะ decimals อื่นใน series เดียวกัน (17.2 → 17.1, 17.3 → 17.2)
- Integer phases ไม่เปลี่ยน
- Operation ง่ายกว่า

**ไม่มี subsequent phases ให้ renumber:**
- ลบ phase สุดท้าย (เช่น Phase 20 เมื่อนั่นคือท้ายสุด)
- แค่ลบและอัพเดท ROADMAP.md ไม่ต้อง renumber

**โฟลเดอร์ phase ไม่มี:**
- Phase อาจอยู่ใน ROADMAP.md แต่โฟลเดอร์ยังไม่ได้สร้าง
- ข้ามการลบโฟลเดอร์ ดำเนินการอัพเดท ROADMAP.md

**Decimal phases ใต้ integer ที่ลบ:**
- ลบ Phase 17 เมื่อมี 17.1, 17.2 อยู่
- 17.1 → 16.1, 17.2 → 16.2
- คงตำแหน่งใน execution order (หลัง current last integer)

</edge_cases>

<success_criteria>
การลบ phase เสร็จสมบูรณ์เมื่อ:

- [ ] ตรวจสอบ target phase ว่าเป็น future/unstarted
- [ ] ลบโฟลเดอร์ phase แล้ว (ถ้ามี)
- [ ] Renumber โฟลเดอร์ subsequent phases ทั้งหมดแล้ว
- [ ] เปลี่ยนชื่อไฟล์ในโฟลเดอร์แล้ว ({old}-01-PLAN.md → {new}-01-PLAN.md)
- [ ] อัพเดท ROADMAP.md (ลบ section, renumber references ทั้งหมด)
- [ ] อัพเดท STATE.md (phase count, progress percentage)
- [ ] อัพเดท dependency references ใน subsequent phases
- [ ] Commit changes ด้วย descriptive message
- [ ] ไม่มี gaps ใน phase numbering
- [ ] แจ้งผู้ใช้เรื่องการเปลี่ยนแปลง
</success_criteria>
