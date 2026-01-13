# เทมเพลต Phase Prompt

เทมเพลตสำหรับ `.planning/phases/XX-name/{phase}-{plan}-PLAN.md` - แผนเฟสที่ executable ได้

**การตั้งชื่อ:** ใช้รูปแบบ `{phase}-{plan}-PLAN.md` (เช่น `01-02-PLAN.md` สำหรับเฟส 1 แผน 2)

---

## เทมเพลตไฟล์

```markdown
---
phase: XX-name
type: execute
domain: [optional - ถ้า domain skill loaded]
---

<objective>
[สิ่งที่เฟสนี้สำเร็จ - จาก roadmap phase goal]

วัตถุประสงค์: [ทำไมสิ่งนี้สำคัญสำหรับโปรเจกต์]
Output: [artifacts อะไรจะถูกสร้าง]
</objective>

<execution_context>
~/.claude/get-shit-done/workflows/execute-phase.md
./summary.md
[ถ้าแผนมี checkpoint tasks (type="checkpoint:*") เพิ่ม:]
~/.claude/get-shit-done/references/checkpoints.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
[ถ้ามี discovery:]
@.planning/phases/XX-name/DISCOVERY.md
[Source files ที่เกี่ยวข้อง:]
@src/path/to/relevant.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: [ชื่อที่เน้น action]</name>
  <files>path/to/file.ext, another/file.ext</files>
  <action>[Implementation เฉพาะ - ทำอะไร ทำอย่างไร หลีกเลี่ยงอะไรและทำไม]</action>
  <verify>[คำสั่งหรือการตรวจสอบเพื่อพิสูจน์ว่าทำงาน]</verify>
  <done>[Acceptance criteria ที่วัดได้]</done>
</task>

<task type="auto">
  <name>Task 2: [ชื่อที่เน้น action]</name>
  <files>path/to/file.ext</files>
  <action>[Implementation เฉพาะ]</action>
  <verify>[คำสั่งหรือการตรวจสอบ]</verify>
  <done>[Acceptance criteria]</done>
</task>

<task type="checkpoint:decision" gate="blocking">
  <decision>[ต้องตัดสินใจอะไร]</decision>
  <context>[ทำไมการตัดสินใจนี้สำคัญ]</context>
  <options>
    <option id="option-a">
      <name>[ชื่อตัวเลือก]</name>
      <pros>[ข้อดีและประโยชน์]</pros>
      <cons>[ข้อเสียและข้อจำกัด]</cons>
    </option>
    <option id="option-b">
      <name>[ชื่อตัวเลือก]</name>
      <pros>[ข้อดีและประโยชน์]</pros>
      <cons>[ข้อเสียและข้อจำกัด]</cons>
    </option>
  </options>
  <resume-signal>[วิธีระบุตัวเลือก - "Select: option-a หรือ option-b"]</resume-signal>
</task>

<task type="auto">
  <name>Task 3: [ชื่อที่เน้น action]</name>
  <files>path/to/file.ext</files>
  <action>[Implementation เฉพาะ]</action>
  <verify>[คำสั่งหรือการตรวจสอบ]</verify>
  <done>[Acceptance criteria]</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>[สิ่งที่ Claude เพิ่งสร้างที่ต้องการ verification]</what-built>
  <how-to-verify>
    1. Run: [คำสั่งเริ่ม dev server/app]
    2. Visit: [URL ที่ต้องตรวจสอบ]
    3. Test: [Interactions เฉพาะ]
    4. Confirm: [Expected behaviors]
  </how-to-verify>
  <resume-signal>พิมพ์ "approved" เพื่อดำเนินการต่อ หรืออธิบายปัญหาที่ต้องแก้ไข</resume-signal>
</task>

[ต่อสำหรับ tasks ทั้งหมด - ผสม auto และ checkpoints ตามต้องการ...]

</tasks>

<verification>
ก่อนประกาศว่าเฟสเสร็จสมบูรณ์:
- [ ] [คำสั่ง test เฉพาะ]
- [ ] [Build/type check ผ่าน]
- [ ] [Behavior verification]
</verification>

<success_criteria>

- Tasks ทั้งหมดเสร็จสมบูรณ์
- Verification checks ทั้งหมดผ่าน
- ไม่มี errors หรือ warnings ใหม่
- [Criteria เฉพาะเฟส]
  </success_criteria>

<output>
หลังเสร็จสมบูรณ์ สร้าง `.planning/phases/XX-name/{phase}-{plan}-SUMMARY.md`:

# เฟส [X] แผน [Y]: [ชื่อ] Summary

**[One-liner ที่มีสาระ - อะไร shipped ไม่ใช่ "phase complete"]**

## ความสำเร็จ

- [Key outcome 1]
- [Key outcome 2]

## Files Created/Modified

- `path/to/file.ts` - คำอธิบาย
- `path/to/another.ts` - คำอธิบาย

## การตัดสินใจที่ทำ

[การตัดสินใจสำคัญและเหตุผล หรือ "ไม่มี"]

## ปัญหาที่พบ

[ปัญหาและการแก้ไข หรือ "ไม่มี"]

## ขั้นตอนถัดไป

[ถ้ามีแผนเพิ่มในเฟสนี้: "พร้อมสำหรับ {phase}-{next-plan}-PLAN.md"]
[ถ้าเฟสเสร็จ: "เฟสเสร็จสมบูรณ์ พร้อมสำหรับเฟสถัดไป"]
</output>
```

<key_elements>
จาก patterns ของ create-meta-prompts:

- โครงสร้าง XML สำหรับ Claude parsing
- @context references สำหรับการโหลดไฟล์
- Task types: auto, checkpoint:human-action, checkpoint:human-verify, checkpoint:decision
- Action รวม "หลีกเลี่ยงอะไรและทำไม" (จาก intelligence-rules)
- Verification เฉพาะและ executable
- Success criteria วัดได้
- Output specification รวมโครงสร้าง SUMMARY.md
  </key_elements>

<scope_guidance>
**ขนาดแผน:**

- เป้าหมาย 2-3 tasks ต่อแผน
- ถ้าวางแผน >3 tasks แยกเป็นหลายแผน (01-01, 01-02, เป็นต้น)
- เป้าหมาย context usage สูงสุด ~50%
- เฟสซับซ้อน: สร้างแผน 01-01, 01-02, 01-03 แทนแผนใหญ่แผนเดียว

**เมื่อไหร่ควรแยก:**

- Subsystems ต่างกัน (auth vs API vs UI)
- Dependency boundaries ชัดเจน (setup → implement → test)
- เสี่ยง context overflow (>50% estimated usage)
- **TDD candidates** - Features ที่ควรทำ TDD กลายเป็น TDD plans ของตัวเอง
</scope_guidance>

<tdd_plan_note>
**TDD features ได้แผนเฉพาะ**

TDD ต้องการ 2-3 execution cycles (RED → GREEN → REFACTOR) ที่กิน 40-50% context สำหรับ feature เดียว Features ที่ควรทำ TDD (business logic, validation, algorithms, API contracts) แต่ละตัวได้แผน TDD ของตัวเอง

**Heuristic:** คุณเขียน `expect(fn(input)).toBe(output)` ก่อนเขียน `fn` ได้ไหม?
→ ได้: สร้าง TDD plan (หนึ่ง feature ต่อแผน)
→ ไม่ได้: Standard task ในแผน standard

ดู `~/.claude/get-shit-done/references/tdd.md` สำหรับโครงสร้าง TDD plan
</tdd_plan_note>

<good_examples>

```markdown
---
phase: 01-foundation
type: execute
domain: next-js
---

<objective>
ตั้งค่า Next.js project พร้อม authentication foundation

วัตถุประสงค์: สร้างโครงสร้างหลักและ auth patterns ที่ features ทั้งหมดขึ้นอยู่กับ
Output: Working Next.js app พร้อม JWT auth, protected routes และ user model
</objective>

<execution_context>
~/.claude/get-shit-done/workflows/execute-phase.md
./summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@src/lib/db.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: เพิ่ม User model ใน database schema</name>
  <files>prisma/schema.prisma</files>
  <action>เพิ่ม User model พร้อม fields: id (cuid), email (unique), passwordHash, createdAt, updatedAt เพิ่ม Session relation ใช้ @db.VarChar(255) สำหรับ email เพื่อป้องกันปัญหา index</action>
  <verify>npx prisma validate ผ่าน, npx prisma generate สำเร็จ</verify>
  <done>Schema valid, types generated, ไม่มี errors</done>
</task>

<task type="auto">
  <name>Task 2: สร้าง login API endpoint</name>
  <files>src/app/api/auth/login/route.ts</files>
  <action>POST endpoint ที่รับ {email, password}, validate กับ User table ใช้ bcrypt, return JWT ใน httpOnly cookie พร้อม 15-min expiry ใช้ jose library สำหรับ JWT (ไม่ใช่ jsonwebtoken - มี CommonJS issues กับ Next.js)</action>
  <verify>curl -X POST /api/auth/login -d '{"email":"test@test.com","password":"test"}' -H "Content-Type: application/json" returns 200 พร้อม Set-Cookie header</verify>
  <done>Valid credentials return 200 + cookie, invalid return 401, missing fields return 400</done>
</task>

</tasks>

<verification>
ก่อนประกาศว่าเฟสเสร็จสมบูรณ์:
- [ ] `npm run build` สำเร็จไม่มี errors
- [ ] `npx prisma validate` ผ่าน
- [ ] Login endpoint ตอบสนองถูกต้องกับ valid/invalid credentials
- [ ] Protected route redirect unauthenticated users
</verification>

<success_criteria>

- Tasks ทั้งหมดเสร็จสมบูรณ์
- Verification checks ทั้งหมดผ่าน
- ไม่มี TypeScript errors
- JWT auth flow ทำงาน end-to-end
  </success_criteria>

<output>
หลังเสร็จสมบูรณ์ สร้าง `.planning/phases/01-foundation/01-01-SUMMARY.md`
</output>
```

</good_examples>

<bad_examples>

```markdown
# เฟส 1: Foundation

## Tasks

### Task 1: ตั้งค่า authentication

**Action**: เพิ่ม auth ใน app
**Done when**: Users สามารถ log in ได้
```

นี่ไร้ประโยชน์ ไม่มีโครงสร้าง XML ไม่มี @context ไม่มี verification ไม่มีความเฉพาะเจาะจง
</bad_examples>

<guidelines>
**เมื่อไหร่ใช้:**
- สร้างแผน execution สำหรับแต่ละเฟส
- หนึ่งแผนต่อ 2-3 tasks หลายแผนต่อเฟสถ้าต้องการ
- ใช้โครงสร้าง XML สำหรับ Claude parsing เสมอ

**Task types:**

- `type="auto"`: Execute โดยไม่หยุด
- `type="checkpoint:human-action"`: ผู้ใช้ต้องทำอะไร (manual step)
- `type="checkpoint:human-verify"`: ผู้ใช้ต้อง verify output (testing, visual check)
- `type="checkpoint:decision"`: ผู้ใช้ต้องเลือกระหว่างตัวเลือก

**Gate values:**

- `gate="blocking"`: ต้อง resolve ก่อนดำเนินการต่อ
- `gate="optional"`: สามารถข้ามหรือเลื่อนได้

**Context references:**

- ใช้ @path/to/file.md เพื่อโหลดไฟล์
- รวม @.planning/PROJECT.md และ @.planning/ROADMAP.md เสมอ
- รวม source files ที่เกี่ยวข้องสำหรับ context
- รวม workflow/template references

**หลังเสร็จสมบูรณ์:**

- สร้าง SUMMARY.md ใน directory เดียวกัน
- ทำตามโครงสร้าง summary.md template
- Document deviations, decisions, issues
  </guidelines>
