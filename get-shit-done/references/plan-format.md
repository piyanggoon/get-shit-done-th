<overview>
แผนที่ Claude รันได้มีรูปแบบเฉพาะที่ทำให้ Claude สามารถ implement ได้โดยไม่ต้องตีความ Reference นี้กำหนดสิ่งที่ทำให้แผน executable vs. คลุมเครือ

**ข้อมูลเชิงลึกหลัก:** PLAN.md คือ executable prompt ประกอบด้วยทุกสิ่งที่ Claude ต้องการเพื่อรันเฟส รวมถึง objective, context references, tasks, verification, success criteria, และ output specification
</overview>

<core_principle>
แผน Claude-executable คือเมื่อ Claude อ่าน PLAN.md แล้วสามารถเริ่ม implement ได้ทันทีโดยไม่ต้องถามคำถามชี้แจง

ถ้า Claude ต้องเดา, ตีความ, หรือสมมติ - task นั้นคลุมเครือเกินไป
</core_principle>

<prompt_structure>
ทุก PLAN.md ตามโครงสร้าง XML นี้:

```markdown
---
phase: XX-name
type: execute
domain: [optional]
---

<objective>
[อะไรและทำไม]
Purpose: [...]
Output: [...]
</objective>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@relevant/source/files.ts
</context>

<tasks>
<task type="auto">
  <name>Task N: [ชื่อ]</name>
  <files>[paths]</files>
  <action>[สิ่งที่ต้องทำ, สิ่งที่ต้องหลีกเลี่ยงและทำไม]</action>
  <verify>[command/check]</verify>
  <done>[criteria]</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>[สิ่งที่ Claude ทำอัตโนมัติ]</what-built>
  <how-to-verify>[ขั้นตอนการยืนยันแบบมีหมายเลข]</how-to-verify>
  <resume-signal>[วิธีดำเนินการต่อ - "approved" หรืออธิบายปัญหา]</resume-signal>
</task>

<task type="checkpoint:decision" gate="blocking">
  <decision>[สิ่งที่ต้องตัดสินใจ]</decision>
  <context>[ทำไมเรื่องนี้สำคัญ]</context>
  <options>
    <option id="option-a"><name>[ชื่อ]</name><pros>[ข้อดี]</pros><cons>[ข้อเสีย]</cons></option>
    <option id="option-b"><name>[ชื่อ]</name><pros>[ข้อดี]</pros><cons>[ข้อเสีย]</cons></option>
  </options>
  <resume-signal>[วิธีระบุทางเลือก]</resume-signal>
</task>
</tasks>

<verification>
[การตรวจสอบเฟสโดยรวม]
</verification>

<success_criteria>
[การเสร็จสิ้นที่วัดได้]
</success_criteria>

<output>
[SUMMARY.md specification]
</output>
```

</prompt_structure>

<task_anatomy>
ทุก task มีสี่ฟิลด์ที่จำเป็น:

<field name="files">
**คืออะไร**: Paths ไฟล์ที่แน่นอนที่จะสร้างหรือแก้ไข

**ดี**: `src/app/api/auth/login/route.ts`, `prisma/schema.prisma`
**ไม่ดี**: "the auth files", "relevant components"

ระบุเจาะจง ถ้าไม่รู้ file path ให้หาก่อน
</field>

<field name="action">
**คืออะไร**: คำแนะนำ implementation เฉพาะ รวมถึงสิ่งที่ต้องหลีกเลี่ยงและทำไม

**ดี**: "สร้าง POST endpoint ที่รับ {email, password}, validate โดยใช้ bcrypt กับตาราง User, คืน JWT ใน httpOnly cookie ที่มี expiry 15 นาที ใช้ jose library (ไม่ใช่ jsonwebtoken - มีปัญหา CommonJS กับ Next.js Edge runtime)"

**ไม่ดี**: "Add authentication", "Make login work"

รวม: การเลือกเทคโนโลยี, data structures, รายละเอียดพฤติกรรม, pitfalls ที่ต้องหลีกเลี่ยง
</field>

<field name="verify">
**คืออะไร**: วิธีพิสูจน์ว่า task เสร็จ

**ดี**:

- `npm test` ผ่าน
- `curl -X POST /api/auth/login` คืน 200 พร้อม Set-Cookie header
- Build สำเร็จโดยไม่มี errors

**ไม่ดี**: "It works", "Looks good", "User can log in"

ต้อง executable ได้ - command, test, พฤติกรรมที่สังเกตได้
</field>

<field name="done">
**คืออะไร**: Acceptance criteria - สถานะการเสร็จสมบูรณ์ที่วัดได้

**ดี**: "Credentials ที่ถูกต้องคืน 200 + JWT cookie, credentials ที่ไม่ถูกต้องคืน 401"

**ไม่ดี**: "Authentication is complete"

ต้องทดสอบได้โดยไม่ต้องใช้การตัดสินแบบ subjective
</field>
</task_anatomy>

<task_types>
Tasks มี attribute `type` ที่กำหนดวิธีการทำงาน:

<type name="auto">
**ประเภท task ดีฟอลต์** - Claude รันแบบอัตโนมัติ

**โครงสร้าง:**

```xml
<task type="auto">
  <name>Task 3: สร้าง login endpoint พร้อม JWT</name>
  <files>src/app/api/auth/login/route.ts</files>
  <action>POST endpoint รับ {email, password} Query User ด้วย email, เทียบ password ด้วย bcrypt ถ้าตรง สร้าง JWT ด้วย jose library, set เป็น httpOnly cookie (expiry 15 นาที) คืน 200 ถ้าไม่ตรง คืน 401</action>
  <verify>curl -X POST localhost:3000/api/auth/login คืน 200 พร้อม Set-Cookie header</verify>
  <done>Credentials ถูกต้อง → 200 + cookie Credentials ไม่ถูกต้อง → 401</done>
</task>
```

ใช้สำหรับ: ทุกสิ่งที่ Claude ทำได้อย่างอิสระ (code, tests, builds, file operations)
</type>

<type name="checkpoint:human-action">
**ใช้ไม่บ่อย** - เฉพาะการกระทำที่ไม่มี CLI/API Claude ทำทุกอย่างที่เป็นไปได้อัตโนมัติก่อน

**โครงสร้าง:**

```xml
<task type="checkpoint:human-action" gate="blocking">
  <action>[ขั้นตอน manual ที่หลีกเลี่ยงไม่ได้ - email link, 2FA code]</action>
  <instructions>
    [สิ่งที่ Claude ทำอัตโนมัติแล้ว]
    [สิ่งเดียวที่ต้องการการกระทำจากมนุษย์]
  </instructions>
  <verification>[สิ่งที่ Claude ตรวจสอบได้ภายหลัง]</verification>
  <resume-signal>[วิธีดำเนินการต่อ]</resume-signal>
</task>
```

ใช้เฉพาะสำหรับ: ลิงก์ยืนยันอีเมล, รหัส SMS 2FA, การอนุมัติ manual ที่ไม่มี API, 3D Secure payment flows

อย่าใช้สำหรับ: อะไรก็ตามที่มี CLI (Vercel, Stripe, Upstash, Railway, GitHub), builds, tests, การสร้างไฟล์, deployments

**การรัน:** Claude ทำทุกอย่างอัตโนมัติด้วย CLI/API, หยุดเฉพาะขั้นตอน manual ที่หลีกเลี่ยงไม่ได้จริงๆ
</type>

<type name="checkpoint:human-verify">
**มนุษย์ต้องยืนยันงานของ Claude** - การตรวจสอบ visual, การทดสอบ UX

**โครงสร้าง:**

```xml
<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Responsive dashboard layout</what-built>
  <how-to-verify>
    1. รัน: npm run dev
    2. เยี่ยมชม: http://localhost:3000/dashboard
    3. Desktop (>1024px): ยืนยัน sidebar ซ้าย, content ขวา
    4. Tablet (768px): ยืนยัน sidebar ยุบเป็น hamburger
    5. Mobile (375px): ยืนยัน single column, bottom nav
    6. ตรวจสอบ: ไม่มี layout shift, ไม่มี horizontal scroll
  </how-to-verify>
  <resume-signal>พิมพ์ "approved" หรืออธิบายปัญหา</resume-signal>
</task>
```

ใช้สำหรับ: การยืนยัน UI/UX, การตรวจสอบ visual design, ความลื่นไหลของ animation, การทดสอบ accessibility

**การรัน:** Claude สร้างฟีเจอร์, หยุด, ให้คำแนะนำการทดสอบ, รอการอนุมัติ/feedback
</type>

<type name="checkpoint:decision">
**มนุษย์ต้องเลือก implementation** - การตัดสินใจกำหนดทิศทาง

**โครงสร้าง:**

```xml
<task type="checkpoint:decision" gate="blocking">
  <decision>เลือก authentication provider</decision>
  <context>เราต้องการ user authentication สามแนวทางที่มี tradeoffs ต่างกัน:</context>
  <options>
    <option id="supabase">
      <name>Supabase Auth</name>
      <pros>Built-in กับ Supabase, free tier ใจดี</pros>
      <cons>ปรับแต่ง UI ได้น้อย, ผูกกับ ecosystem</cons>
    </option>
    <option id="clerk">
      <name>Clerk</name>
      <pros>UI pre-built สวย, DX ดีที่สุด</pros>
      <cons>เสียเงินหลัง 10k MAU</cons>
    </option>
    <option id="nextauth">
      <name>NextAuth.js</name>
      <pros>ฟรี, self-hosted, ควบคุมได้สูงสุด</pros>
      <cons>ตั้งค่ามากกว่า, จัดการ security เอง</cons>
    </option>
  </options>
  <resume-signal>เลือก: supabase, clerk, หรือ nextauth</resume-signal>
</task>
```

ใช้สำหรับ: การเลือกเทคโนโลยี, การตัดสินใจ architecture, การเลือก design, การจัดลำดับความสำคัญของฟีเจอร์

**การรัน:** Claude นำเสนอตัวเลือกพร้อม pros/cons ที่สมดุล, รอการตัดสินใจ, ดำเนินการตามทิศทางที่เลือก
</type>

**เมื่อใช้ checkpoints:**

- การยืนยัน Visual/UX (หลัง Claude สร้าง) → `checkpoint:human-verify`
- การเลือกทิศทาง implementation → `checkpoint:decision`
- การกระทำ manual ที่หลีกเลี่ยงไม่ได้จริงๆ (email links, 2FA) → `checkpoint:human-action` (หายาก)

**เมื่อไม่ใช้ checkpoints:**

- อะไรก็ตามที่มี CLI/API (Claude ทำอัตโนมัติ) → `type="auto"`
- Deployments (Vercel, Railway, Fly) → `type="auto"` พร้อม CLI
- การสร้าง resources (Upstash, Stripe, GitHub) → `type="auto"` พร้อม CLI/API
- File operations, tests, builds → `type="auto"`

**กฎทอง:** ถ้า Claude สามารถทำอัตโนมัติได้ Claude ต้องทำอัตโนมัติ

ดู `./checkpoints.md` สำหรับคำแนะนำ checkpoint ที่ครอบคลุม
</task_types>

<tdd_plans>
**งาน TDD ใช้แผนเฉพาะ**

TDD features ต้องการ 2-3 execution cycles (RED → GREEN → REFACTOR) แต่ละรอบมีการอ่านไฟล์, การรัน test, และการ debugging ที่อาจเกิดขึ้น นี่หนักกว่า tasks มาตรฐานโดยพื้นฐานและจะใช้ 50-60% ของ context ถ้าฝังในแผน multi-task

**เมื่อสร้างแผน TDD:**
- Business logic ที่มี inputs/outputs ที่กำหนดไว้
- API endpoints ที่มี request/response contracts
- Data transformations และ parsing
- กฎ Validation
- Algorithms ที่มีพฤติกรรมทดสอบได้

**เมื่อใช้แผนมาตรฐาน (ข้าม TDD):**
- UI layout และ styling
- การเปลี่ยนแปลง configuration
- Glue code ที่เชื่อมต่อ components ที่มีอยู่
- Scripts ครั้งเดียว

**Heuristic:** คุณสามารถเขียน `expect(fn(input)).toBe(output)` ก่อนเขียน `fn` ได้หรือไม่?
→ ใช่: สร้างแผน TDD (หนึ่งฟีเจอร์ต่อแผน)
→ ไม่: ใช้แผนมาตรฐาน, เพิ่ม tests หลังจากถ้าจำเป็น

ดู `./tdd.md` สำหรับโครงสร้างและคำแนะนำการรันแผน TDD
</tdd_plans>

<context_references>
ใช้ @file references เพื่อโหลด context สำหรับ prompt:

```markdown
<context>
@.planning/PROJECT.md           # วิสัยทัศน์โปรเจกต์
@.planning/ROADMAP.md         # โครงสร้างเฟส
@.planning/phases/02-auth/DISCOVERY.md  # ผลการค้นพบ
@src/lib/db.ts                # การตั้งค่า database ที่มีอยู่
@src/types/user.ts            # Type definitions ที่มีอยู่
</context>
```

อ้างอิงไฟล์ที่ Claude ต้องเข้าใจก่อน implement
</context_references>

<verification_section>
การยืนยันเฟสโดยรวม (นอกเหนือจากการยืนยัน task แต่ละรายการ):

```markdown
<verification>
ก่อนประกาศว่าเฟสเสร็จ:
- [ ] `npm run build` สำเร็จโดยไม่มี errors
- [ ] `npm test` ผ่านทุก tests
- [ ] ไม่มี TypeScript errors
- [ ] ฟีเจอร์ทำงาน end-to-end แบบ manual
</verification>
```

</verification_section>

<success_criteria_section>
เกณฑ์ที่วัดได้สำหรับการเสร็จสิ้นเฟส:

```markdown
<success_criteria>

- Tasks ทั้งหมดเสร็จ
- การตรวจสอบทั้งหมดผ่าน
- ไม่มี errors หรือ warnings ที่เพิ่มเข้ามา
- JWT auth flow ทำงาน end-to-end
- Protected routes redirect ผู้ใช้ที่ไม่ได้ authenticate
  </success_criteria>
```

</success_criteria_section>

<output_section>
ระบุโครงสร้าง SUMMARY.md:

```markdown
<output>
หลังเสร็จสิ้น, สร้าง `.planning/phases/XX-name/SUMMARY.md`:

# เฟส X: ชื่อ Summary

**[คำอธิบายสาระสำคัญหนึ่งบรรทัด]**

## Accomplishments

## Files Created/Modified

## Decisions Made

## Issues Encountered

## Next Phase Readiness

</output>
```

</output_section>

<specificity_levels>
<too_vague>

```xml
<task type="auto">
  <name>Task 1: Add authentication</name>
  <files>???</files>
  <action>Implement auth</action>
  <verify>???</verify>
  <done>Users can authenticate</done>
</task>
```

Claude: "อย่างไร? ประเภทไหน? Library ไหน? อยู่ที่ไหน?"
</too_vague>

<just_right>

```xml
<task type="auto">
  <name>Task 1: สร้าง login endpoint พร้อม JWT</name>
  <files>src/app/api/auth/login/route.ts</files>
  <action>POST endpoint รับ {email, password} Query User ด้วย email, เทียบ password ด้วย bcrypt ถ้าตรง สร้าง JWT ด้วย jose library, set เป็น httpOnly cookie (expiry 15 นาที) คืน 200 ถ้าไม่ตรง คืน 401 ใช้ jose แทน jsonwebtoken (มีปัญหา CommonJS กับ Edge)</action>
  <verify>curl -X POST localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test123"}' คืน 200 พร้อม Set-Cookie header ที่มี JWT</verify>
  <done>Credentials ถูกต้อง → 200 + cookie Credentials ไม่ถูกต้อง → 401 Missing fields → 400</done>
</task>
```

Claude สามารถ implement นี้ได้ทันที
</just_right>

<note_on_tdd>
**TDD candidates ได้แผนเฉพาะ**

ถ้า email validation ควรได้ TDD ให้สร้างแผน TDD สำหรับมัน ดู `./tdd.md` สำหรับโครงสร้างแผน TDD
</note_on_tdd>

<too_detailed>
การเขียน code จริงในแผน ไว้ใจ Claude ที่จะ implement จากคำแนะนำที่ชัดเจน
</too_detailed>
</specificity_levels>

<anti_patterns>
<vague_actions>

- "Set up the infrastructure"
- "Handle edge cases"
- "Make it production-ready"
- "Add proper error handling"

เหล่านี้ต้องการให้ Claude ตัดสินใจว่าต้องทำอะไร ระบุให้ชัด
</vague_actions>

<unverifiable_completion>

- "It works correctly"
- "User experience is good"
- "Code is clean"
- "Tests pass" (tests ไหน? มีอยู่หรือไม่?)

เหล่านี้ต้องใช้การตัดสินแบบ subjective ทำให้ objective
</unverifiable_completion>

<missing_context>

- "Use the standard approach"
- "Follow best practices"
- "Like the other endpoints"

Claude ไม่รู้มาตรฐานของคุณ ระบุให้ชัดเจน
</missing_context>
</anti_patterns>

<sizing_tasks>
ขนาด task ที่ดี: 15-60 นาทีของงาน Claude

**เล็กเกินไป**: "Add import statement for bcrypt" (รวมกับ task ที่เกี่ยวข้อง)
**พอดี**: "สร้าง login endpoint พร้อม JWT validation" (เน้น, เจาะจง)
**ใหญ่เกินไป**: "Implement full authentication system" (แยกเป็นหลายแผน)

ถ้า task ใช้หลาย sessions ให้แบ่งย่อย
ถ้า task เล็กน้อยเกินไป ให้รวมกับ tasks ที่เกี่ยวข้อง

**หมายเหตุเรื่อง scope:** ถ้าเฟสมี >3 tasks หรือครอบคลุมหลาย subsystems ให้แยกเป็นหลายแผนโดยใช้ naming convention `{phase}-{plan}-PLAN.md` ดู `./scope-estimation.md` สำหรับคำแนะนำ
</sizing_tasks>
