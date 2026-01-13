# เทมเพลต Summary

เทมเพลตสำหรับ `.planning/phases/XX-name/{phase}-{plan}-SUMMARY.md` - เอกสาร phase completion

---

## เทมเพลตไฟล์

```markdown
---
phase: XX-name
plan: YY
subsystem: [หมวดหลัก: auth, payments, ui, api, database, infra, testing, เป็นต้น]
tags: [searchable tech: jwt, stripe, react, postgres, prisma]

# Dependency graph
requires:
  - phase: [เฟสก่อนหน้าที่นี่ขึ้นอยู่กับ]
    provides: [อะไรที่เฟสนั้นสร้างที่นี่ใช้]
provides:
  - [bullet list ของอะไรที่เฟสนี้สร้าง/ส่งมอบ]
affects: [list of phase names หรือ keywords ที่จะต้องการ context นี้]

# Tech tracking
tech-stack:
  added: [libraries/tools ที่เพิ่มในเฟสนี้]
  patterns: [architectural/code patterns ที่ established]

key-files:
  created: [ไฟล์สำคัญที่สร้าง]
  modified: [ไฟล์สำคัญที่แก้ไข]

key-decisions:
  - "การตัดสินใจ 1"
  - "การตัดสินใจ 2"

patterns-established:
  - "Pattern 1: คำอธิบาย"
  - "Pattern 2: คำอธิบาย"

issues-created: [ISS-XXX, ISS-YYY] # จาก ISSUES.md ถ้ามี

# Metrics
duration: Xmin
completed: YYYY-MM-DD
---

# เฟส [X]: [ชื่อ] Summary

**[One-liner ที่มีสาระอธิบายผลลัพธ์ - ไม่ใช่ "phase complete" หรือ "implementation finished"]**

## Performance

- **ระยะเวลา:** [เวลา] (เช่น 23 นาที, 1 ชม. 15 นาที)
- **เริ่ม:** [ISO timestamp]
- **เสร็จ:** [ISO timestamp]
- **Tasks:** [จำนวนที่เสร็จ]
- **Files modified:** [จำนวน]

## ความสำเร็จ
- [ผลลัพธ์สำคัญที่สุด]
- [ความสำเร็จสำคัญที่สอง]
- [ที่สามถ้ามี]

## Task Commits

แต่ละ task ถูก commit แบบ atomic:

1. **Task 1: [ชื่อ task]** - `abc123f` (feat/fix/test/refactor)
2. **Task 2: [ชื่อ task]** - `def456g` (feat/fix/test/refactor)
3. **Task 3: [ชื่อ task]** - `hij789k` (feat/fix/test/refactor)

**Plan metadata:** `lmn012o` (docs: complete plan)

_หมายเหตุ: TDD tasks อาจมีหลาย commits (test → feat → refactor)_

## Files Created/Modified
- `path/to/file.ts` - ทำอะไร
- `path/to/another.ts` - ทำอะไร

## การตัดสินใจที่ทำ
[การตัดสินใจสำคัญพร้อมเหตุผลสั้น หรือ "ไม่มี - ทำตามแผนที่ระบุ"]

## การเบี่ยงเบนจากแผน

[ถ้าไม่มีการเบี่ยงเบน: "ไม่มี - แผน execute ตรงตามที่เขียน"]

[ถ้ามีการเบี่ยงเบน:]

### ปัญหาที่แก้ไขอัตโนมัติ

**1. [Rule X - หมวด] คำอธิบายสั้น**
- **พบระหว่าง:** Task [N] ([ชื่อ task])
- **ปัญหา:** [อะไรผิด]
- **แก้ไข:** [ทำอะไร]
- **Files modified:** [file paths]
- **Verification:** [verify อย่างไร]
- **Committed in:** [hash] (ส่วนหนึ่งของ task commit)

[... ทำซ้ำสำหรับแต่ละ auto-fix ...]

### Enhancements ที่เลื่อนออกไป

Logged ไปยัง .planning/ISSUES.md สำหรับพิจารณาในอนาคต:
- ISS-XXX: [คำอธิบายสั้น] (พบใน Task [N])
- ISS-XXX: [คำอธิบายสั้น] (พบใน Task [N])

---

**การเบี่ยงเบนทั้งหมด:** [N] auto-fixed ([breakdown ตาม rule]), [N] เลื่อนออกไป
**ผลกระทบต่อแผน:** [การประเมินสั้น - เช่น "All auto-fixes จำเป็นสำหรับ correctness/security ไม่มี scope creep"]

## ปัญหาที่พบ
[ปัญหาและวิธีแก้ไข หรือ "ไม่มี"]

[หมายเหตุ: "การเบี่ยงเบนจากแผน" บันทึกงานที่ไม่ได้วางแผนที่ถูกจัดการอัตโนมัติผ่าน deviation rules "ปัญหาที่พบ" บันทึกปัญหาระหว่างงานที่วางแผนที่ต้อง problem-solving]

## ความพร้อมเฟสถัดไป
[อะไรพร้อมสำหรับเฟสถัดไป]
[Blockers หรือ concerns ใดๆ]

---
*เฟส: XX-name*
*เสร็จ: [วันที่]*
```

<frontmatter_guidance>
**วัตถุประสงค์:** เปิดใช้ automatic context assembly ผ่าน dependency graph Frontmatter ทำให้ summary metadata เป็น machine-readable เพื่อให้ plan-phase สามารถ scan summaries ทั้งหมดอย่างรวดเร็วและเลือกที่เกี่ยวข้องตาม dependencies

**Fast scanning:** Frontmatter เป็น ~25 บรรทัดแรก ราคาถูกในการ scan across summaries ทั้งหมดโดยไม่ต้องอ่านเนื้อหาเต็ม

**Dependency graph:** `requires`/`provides`/`affects` สร้าง explicit links ระหว่างเฟส เปิดใช้ transitive closure สำหรับ context selection

**Subsystem:** Primary categorization (auth, payments, ui, api, database, infra, testing) สำหรับตรวจจับเฟสที่เกี่ยวข้อง

**Tags:** Searchable technical keywords (libraries, frameworks, tools) สำหรับ tech stack awareness

**Key-files:** ไฟล์สำคัญสำหรับ @context references ใน PLAN.md

**Patterns:** Established conventions ที่เฟสในอนาคตควรรักษา

**Population:** Frontmatter ถูก populate ระหว่าง summary creation ใน execute-phase.md ดู `<step name="create_summary">` สำหรับ field-by-field guidance
</frontmatter_guidance>

<one_liner_rules>
One-liner ต้องมีสาระ:

**ดี:**
- "JWT auth พร้อม refresh rotation ใช้ jose library"
- "Prisma schema พร้อม User, Session และ Product models"
- "Dashboard พร้อม real-time metrics ผ่าน Server-Sent Events"

**แย่:**
- "Phase complete"
- "Authentication implemented"
- "Foundation finished"
- "All tasks done"

One-liner ควรบอกคนว่าอะไร shipped จริงๆ
</one_liner_rules>

<example>
```markdown
# เฟส 1: Foundation Summary

**JWT auth พร้อม refresh rotation ใช้ jose library, Prisma User model และ protected API middleware**

## Performance

- **ระยะเวลา:** 28 นาที
- **เริ่ม:** 2025-01-15T14:22:10Z
- **เสร็จ:** 2025-01-15T14:50:33Z
- **Tasks:** 5
- **Files modified:** 8

## ความสำเร็จ
- User model พร้อม email/password auth
- Login/logout endpoints พร้อม httpOnly JWT cookies
- Protected route middleware ตรวจสอบ token validity
- Refresh token rotation ทุก request

## Files Created/Modified
- `prisma/schema.prisma` - User และ Session models
- `src/app/api/auth/login/route.ts` - Login endpoint
- `src/app/api/auth/logout/route.ts` - Logout endpoint
- `src/middleware.ts` - Protected route checks
- `src/lib/auth.ts` - JWT helpers ใช้ jose

## การตัดสินใจที่ทำ
- ใช้ jose แทน jsonwebtoken (ESM-native, Edge-compatible)
- 15-min access tokens พร้อม 7-day refresh tokens
- เก็บ refresh tokens ใน database สำหรับ revocation capability

## การเบี่ยงเบนจากแผน

### ปัญหาที่แก้ไขอัตโนมัติ

**1. [Rule 2 - Missing Critical] เพิ่ม password hashing ด้วย bcrypt**
- **พบระหว่าง:** Task 2 (Login endpoint implementation)
- **ปัญหา:** แผนไม่ได้ระบุ password hashing - เก็บ plaintext จะเป็น critical security flaw
- **แก้ไข:** เพิ่ม bcrypt hashing ตอน registration, comparison ตอน login พร้อม salt rounds 10
- **Files modified:** src/app/api/auth/login/route.ts, src/lib/auth.ts
- **Verification:** Password hash test ผ่าน, plaintext ไม่ถูกเก็บ
- **Committed in:** abc123f (Task 2 commit)

**2. [Rule 3 - Blocking] Install missing jose dependency**
- **พบระหว่าง:** Task 4 (JWT token generation)
- **ปัญหา:** jose package ไม่อยู่ใน package.json, import ล้มเหลว
- **แก้ไข:** รัน `npm install jose`
- **Files modified:** package.json, package-lock.json
- **Verification:** Import สำเร็จ, build ผ่าน
- **Committed in:** def456g (Task 4 commit)

### Enhancements ที่เลื่อนออกไป

Logged ไปยัง .planning/ISSUES.md สำหรับพิจารณาในอนาคต:
- ISS-001: เพิ่ม rate limiting ให้ login endpoint (พบใน Task 2)
- ISS-002: ปรับปรุง token refresh UX ด้วย auto-retry เมื่อ 401 (พบใน Task 5)

---

**การเบี่ยงเบนทั้งหมด:** 2 auto-fixed (1 missing critical, 1 blocking), 2 เลื่อนออกไป
**ผลกระทบต่อแผน:** Both auto-fixes จำเป็นสำหรับ security และ functionality ไม่มี scope creep

## ปัญหาที่พบ
- jsonwebtoken CommonJS import ล้มเหลวใน Edge runtime - เปลี่ยนเป็น jose (library change ที่วางแผนไว้, ทำงานตามคาด)

## ความพร้อมเฟสถัดไป
- Auth foundation เสร็จสมบูรณ์ พร้อมสำหรับ feature development
- User registration endpoint ต้องการก่อน public launch

---
*เฟส: 01-foundation*
*เสร็จ: 2025-01-15*
```
</example>

<guidelines>
**เมื่อไหร่สร้าง:**
- หลังจากเสร็จสิ้นแต่ละ phase plan
- Required output จาก execute-phase workflow
- บันทึกอะไรที่เกิดขึ้นจริง vs อะไรที่วางแผนไว้

**Frontmatter completion:**
- จำเป็น: กรอก frontmatter fields ทั้งหมดระหว่าง summary creation
- ดู <frontmatter_guidance> สำหรับ field purposes
- Frontmatter เปิดใช้ automatic context assembly สำหรับการวางแผนในอนาคต

**One-liner requirements:**
- ต้องมีสาระ (อธิบายอะไร shipped ไม่ใช่ "phase complete")
- ควรบอกคนว่าอะไรสำเร็จ
- ตัวอย่าง: "JWT auth พร้อม refresh rotation ใช้ jose library" ไม่ใช่ "Authentication implemented"

**Performance tracking:**
- รวม duration, start/end timestamps
- ใช้สำหรับ velocity metrics ใน STATE.md

**Deviations section:**
- บันทึกงานที่ไม่ได้วางแผนที่จัดการผ่าน deviation rules
- แยกจาก "ปัญหาที่พบ" (ซึ่งเป็นปัญหางานที่วางแผน)
- Auto-fixed issues: อะไรผิด, แก้ไขอย่างไร, verification
- Deferred enhancements: Logged ไปยัง ISSUES.md พร้อม ISS-XXX numbers

**Decisions section:**
- การตัดสินใจสำคัญที่ทำระหว่าง execution
- รวมเหตุผล (ทำไมเลือกนี้)
- Extract ไปยัง STATE.md accumulated context
- ใช้ "ไม่มี - ทำตามแผนที่ระบุ" ถ้าไม่มีการเบี่ยงเบน

**หลังจากสร้าง:**
- STATE.md อัปเดตพร้อม position, decisions, issues
- แผนถัดไปสามารถ reference การตัดสินใจที่ทำ
</guidelines>
