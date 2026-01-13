# Phase Prompt Template

Template สำหรับ `.planning/phases/XX-name/{phase}-{plan}-PLAN.md` - executable phase plans

**Naming:** ใช้รูปแบบ `{phase}-{plan}-PLAN.md` (เช่น `01-02-PLAN.md` สำหรับ Phase 1, Plan 2)

---

## File Template

```markdown
---
phase: XX-name
plan: NN
type: execute
depends_on: []              # Plan IDs ที่แผนนี้ต้องการ (เช่น ["01-01"]) ว่างเปล่า = อิสระ
files_modified: []          # ไฟล์ที่แผนนี้แก้ไข (จาก <files> elements)
domain: [optional - if domain skill loaded]
---

<objective>
[สิ่งที่เฟสนี้ทำสำเร็จ - จาก roadmap phase goal]

Purpose: [ทำไมสิ่งนี้สำคัญสำหรับโปรเจกต์]
Output: [artifacts อะไรที่จะถูกสร้าง]
</objective>

<execution_context>
~/.claude/get-shit-done/workflows/execute-plan.md
./summary.md
[ถ้าแผนมี checkpoint tasks (type="checkpoint:*") เพิ่ม:]
~/.claude/get-shit-done/references/checkpoints.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
[ถ้ามี discovery:]
@.planning/phases/XX-name/DISCOVERY.md
[ไฟล์ source ที่เกี่ยวข้อง:]
@src/path/to/relevant.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: [ชื่อที่เน้น action]</name>
  <files>path/to/file.ext, another/file.ext</files>
  <action>[Implementation เฉพาะ - ทำอะไร, ทำอย่างไร, หลีกเลี่ยงอะไรและทำไม]</action>
  <verify>[Command หรือ check เพื่อพิสูจน์ว่าใช้งานได้]</verify>
  <done>[Acceptance criteria ที่วัดได้]</done>
</task>

<task type="auto">
  <name>Task 2: [ชื่อที่เน้น action]</name>
  <files>path/to/file.ext</files>
  <action>[Implementation เฉพาะ]</action>
  <verify>[Command หรือ check]</verify>
  <done>[Acceptance criteria]</done>
</task>

<task type="checkpoint:decision" gate="blocking">
  <decision>[อะไรที่ต้องตัดสินใจ]</decision>
  <context>[ทำไมการตัดสินใจนี้สำคัญ]</context>
  <options>
    <option id="option-a">
      <name>[ชื่อ option]</name>
      <pros>[ประโยชน์และข้อดี]</pros>
      <cons>[Tradeoffs และข้อจำกัด]</cons>
    </option>
    <option id="option-b">
      <name>[ชื่อ option]</name>
      <pros>[ประโยชน์และข้อดี]</pros>
      <cons>[Tradeoffs และข้อจำกัด]</cons>
    </option>
  </options>
  <resume-signal>[วิธีระบุการเลือก - "Select: option-a or option-b"]</resume-signal>
</task>

<task type="auto">
  <name>Task 3: [ชื่อที่เน้น action]</name>
  <files>path/to/file.ext</files>
  <action>[Implementation เฉพาะ]</action>
  <verify>[Command หรือ check]</verify>
  <done>[Acceptance criteria]</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>[อะไรที่ Claude เพิ่งสร้างที่ต้องการ verification]</what-built>
  <how-to-verify>
    1. Run: [command เพื่อ start dev server/app]
    2. Visit: [URL ที่ต้องตรวจสอบ]
    3. Test: [Interactions เฉพาะ]
    4. Confirm: [Behaviors ที่คาดหวัง]
  </how-to-verify>
  <resume-signal>พิมพ์ "approved" เพื่อดำเนินการต่อ หรืออธิบายปัญหาเพื่อแก้ไข</resume-signal>
</task>

[ดำเนินการต่อสำหรับ tasks ทั้งหมด - ผสม auto และ checkpoints ตามที่จำเป็น...]

</tasks>

<verification>
ก่อนประกาศว่าเฟสเสร็จ:
- [ ] [Test command เฉพาะ]
- [ ] [Build/type check ผ่าน]
- [ ] [Behavior verification]
</verification>

<success_criteria>

- Tasks ทั้งหมดเสร็จ
- Verification checks ทั้งหมดผ่าน
- ไม่มี errors หรือ warnings ที่เพิ่มขึ้น
- [Criteria เฉพาะเฟส]
</success_criteria>

<output>
หลังเสร็จ สร้าง `.planning/phases/XX-name/{phase}-{plan}-SUMMARY.md`:

# Phase [X] Plan [Y]: [Name] Summary

**[One-liner ที่มีสาระ - อะไรที่ ship ไม่ใช่ "phase complete"]**

## Accomplishments

- [Key outcome 1]
- [Key outcome 2]

## Files Created/Modified

- `path/to/file.ts` - คำอธิบาย
- `path/to/another.ts` - คำอธิบาย

## Decisions Made

[Key decisions และ rationale หรือ "None"]

## Issues Encountered

[ปัญหาและการแก้ไข หรือ "None"]

## Next Step

[ถ้ามีแผนเพิ่มในเฟสนี้: "Ready for {phase}-{next-plan}-PLAN.md"]
[ถ้าเฟสเสร็จ: "Phase complete, ready for next phase"]
</output>
```

<key_elements>
จาก create-meta-prompts patterns:

- โครงสร้าง XML สำหรับ Claude parsing
- @context references สำหรับ file loading
- Task types: auto, checkpoint:human-action, checkpoint:human-verify, checkpoint:decision
- Action รวม "what to avoid and WHY" (จาก intelligence-rules)
- Verification เฉพาะเจาะจงและ executable
- Success criteria วัดได้
- Output specification รวมโครงสร้าง SUMMARY.md
</key_elements>

<scope_guidance>
**Plan sizing:**

- ตั้งเป้า 2-3 tasks ต่อแผน
- ถ้าวางแผน >3 tasks แยกเป็นหลายแผน (01-01, 01-02, etc.)
- เป้าหมาย ~50% context usage สูงสุด
- เฟสซับซ้อน: สร้าง 01-01, 01-02, 01-03 plans แทนแผนใหญ่เดียว

**เมื่อไหร่ควรแยก:**

- Subsystems ต่างกัน (auth vs API vs UI)
- Dependency boundaries ชัดเจน (setup → implement → test)
- เสี่ยง context overflow (>50% estimated usage)
- **TDD candidates** - Features ที่ควรใช้ TDD กลายเป็น TDD plans ของตัวเอง
</scope_guidance>

<tdd_plan_note>
**TDD features ได้ dedicated plans**

TDD ต้องการ 2-3 execution cycles (RED → GREEN → REFACTOR) ที่ใช้ 40-50% context สำหรับ feature เดียว Features ที่ควรใช้ TDD (business logic, validation, algorithms, API contracts) แต่ละตัวได้ TDD plan ของตัวเอง

**Heuristic:** คุณสามารถเขียน `expect(fn(input)).toBe(output)` ก่อนเขียน `fn` ได้ไหม?
→ Yes: สร้าง TDD plan (หนึ่ง feature ต่อ plan)
→ No: Standard task ในแผน standard

ดู `~/.claude/get-shit-done/references/tdd.md` สำหรับโครงสร้าง TDD plan
</tdd_plan_note>

<good_examples>

**Sequential plan (มี dependencies):**

```markdown
---
phase: 01-foundation
plan: 02
type: execute
depends_on: ["01-01"]
files_modified: [src/app/api/auth/login/route.ts]
domain: next-js
---
```

**Independent plan (สามารถรัน parallel ได้):**

```markdown
---
phase: 03-features
plan: 02
type: execute
depends_on: []
files_modified: [src/components/Dashboard.tsx, src/hooks/useDashboard.ts]
---
```

**Full example:**

```markdown
---
phase: 01-foundation
plan: 01
type: execute
depends_on: []
files_modified: [prisma/schema.prisma, src/lib/db.ts]
domain: next-js
---

<objective>
Set up Next.js project with authentication foundation.

Purpose: Establish the core structure and auth patterns all features depend on.
Output: Working Next.js app with JWT auth, protected routes, and user model.
</objective>

<execution_context>
~/.claude/get-shit-done/workflows/execute-plan.md
./summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@src/lib/db.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add User model to database schema</name>
  <files>prisma/schema.prisma</files>
  <action>Add User model with fields: id (cuid), email (unique), passwordHash, createdAt, updatedAt. Add Session relation. Use @db.VarChar(255) for email to prevent index issues.</action>
  <verify>npx prisma validate passes, npx prisma generate succeeds</verify>
  <done>Schema valid, types generated, no errors</done>
</task>

<task type="auto">
  <name>Task 2: Create login API endpoint</name>
  <files>src/app/api/auth/login/route.ts</files>
  <action>POST endpoint that accepts {email, password}, validates against User table using bcrypt, returns JWT in httpOnly cookie with 15-min expiry. Use jose library for JWT (not jsonwebtoken - it has CommonJS issues with Next.js).</action>
  <verify>curl -X POST /api/auth/login -d '{"email":"test@test.com","password":"test"}' -H "Content-Type: application/json" returns 200 with Set-Cookie header</verify>
  <done>Valid credentials return 200 + cookie, invalid return 401, missing fields return 400</done>
</task>

</tasks>

<verification>
Before declaring phase complete:
- [ ] `npm run build` succeeds without errors
- [ ] `npx prisma validate` passes
- [ ] Login endpoint responds correctly to valid/invalid credentials
- [ ] Protected route redirects unauthenticated users
</verification>

<success_criteria>

- All tasks completed
- All verification checks pass
- No TypeScript errors
- JWT auth flow works end-to-end
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-01-SUMMARY.md`
</output>
```

**Independent plan example:**

```markdown
---
phase: 05-features
plan: 01
type: execute
depends_on: []
files_modified: [src/features/user/model.ts, src/features/user/api.ts, src/features/user/UserList.tsx]
---

<objective>
Implement complete User feature as vertical slice.

Purpose: Self-contained user management that can run parallel to other features.
Output: User model, API endpoints, and UI components.
</objective>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
</context>
...
```

**Dependent plan example:**

```markdown
---
phase: 06-integration
plan: 02
type: execute
depends_on: ["06-01"]
files_modified: [src/integration/stripe.ts]
---

<objective>
Integrate Stripe payments using auth from Plan 01.

Purpose: Add payment processing that requires authenticated users.
Output: Stripe integration with user-linked payments.
</objective>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/phases/06-integration/06-01-SUMMARY.md
</context>
...
```

**Parallelization rules:**
- `depends_on` ว่างเปล่า + ไม่มี file conflicts กับ sibling plans = สามารถรัน parallel ได้
- `depends_on` ไม่ว่างเปล่า หรือ shared files = ต้องรัน sequentially
- `/gsd:execute-phase` วิเคราะห์สิ่งนี้อัตโนมัติ

</good_examples>

<bad_examples>

```markdown
# Phase 1: Foundation

## Tasks

### Task 1: Set up authentication

**Action**: Add auth to the app
**Done when**: Users can log in
```

นี่ไร้ประโยชน์ ไม่มีโครงสร้าง XML, ไม่มี @context, ไม่มี verification, ไม่มีความเฉพาะเจาะจง
</bad_examples>

<guidelines>
**เมื่อไหร่ควรใช้:**
- สร้าง execution plans สำหรับแต่ละเฟส
- หนึ่งแผนต่อ 2-3 tasks, หลายแผนต่อเฟสถ้าจำเป็น
- ใช้โครงสร้าง XML เสมอสำหรับ Claude parsing

**Task types:**

- `type="auto"`: ดำเนินการโดยไม่หยุด
- `type="checkpoint:human-action"`: User ต้องทำบางอย่าง (manual step)
- `type="checkpoint:human-verify"`: User ต้องตรวจสอบ output (testing, visual check)
- `type="checkpoint:decision"`: User ต้องเลือกระหว่าง options

**Gate values:**

- `gate="blocking"`: ต้อง resolve ก่อนดำเนินการต่อ
- `gate="optional"`: สามารถข้ามหรือเลื่อนได้

**Context references:**

- ใช้ @path/to/file.md เพื่อโหลดไฟล์
- รวม @.planning/PROJECT.md และ @.planning/ROADMAP.md เสมอ
- รวมไฟล์ source ที่เกี่ยวข้องสำหรับ context
- รวม workflow/template references

**หลังเสร็จ:**

- สร้าง SUMMARY.md ใน directory เดียวกัน
- ทำตามโครงสร้าง summary.md template
- บันทึก deviations, decisions, issues
</guidelines>
