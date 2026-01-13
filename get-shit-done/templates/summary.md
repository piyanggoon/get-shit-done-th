# Summary Template

Template สำหรับ `.planning/phases/XX-name/{phase}-{plan}-SUMMARY.md` - เอกสาร phase completion

---

## File Template

```markdown
---
phase: XX-name
plan: YY
subsystem: [หมวดหลัก: auth, payments, ui, api, database, infra, testing, etc.]
tags: [searchable tech: jwt, stripe, react, postgres, prisma]

# Dependency graph
requires:
  - phase: [prior phase ที่นี่ depend on]
    provides: [อะไรที่เฟสนั้นสร้างที่นี่ใช้]
provides:
  - [bullet list ของอะไรที่เฟสนี้สร้าง/ส่งมอบ]
affects: [list ของชื่อเฟสหรือ keywords ที่จะต้องการ context นี้]

# Tech tracking
tech-stack:
  added: [libraries/tools ที่เพิ่มในเฟสนี้]
  patterns: [architectural/code patterns ที่กำหนด]

key-files:
  created: [ไฟล์สำคัญที่สร้าง]
  modified: [ไฟล์สำคัญที่แก้ไข]

key-decisions:
  - "Decision 1"
  - "Decision 2"

patterns-established:
  - "Pattern 1: description"
  - "Pattern 2: description"

issues-created: [ISS-XXX, ISS-YYY] # จาก ISSUES.md ถ้ามี

# Metrics
duration: Xmin
completed: YYYY-MM-DD
---

# Phase [X]: [Name] Summary

**[One-liner ที่มีสาระอธิบาย outcome - ไม่ใช่ "phase complete" หรือ "implementation finished"]**

## Performance

- **Duration:** [time] (เช่น 23 min, 1h 15m)
- **Started:** [ISO timestamp]
- **Completed:** [ISO timestamp]
- **Tasks:** [count completed]
- **Files modified:** [count]

## Accomplishments
- [Most important outcome]
- [Second key accomplishment]
- [Third if applicable]

## Task Commits

แต่ละ task ถูก commit แบบ atomic:

1. **Task 1: [task name]** - `abc123f` (feat/fix/test/refactor)
2. **Task 2: [task name]** - `def456g` (feat/fix/test/refactor)
3. **Task 3: [task name]** - `hij789k` (feat/fix/test/refactor)

**Plan metadata:** `lmn012o` (docs: complete plan)

_Note: TDD tasks อาจมีหลาย commits (test → feat → refactor)_

## Files Created/Modified
- `path/to/file.ts` - ทำอะไร
- `path/to/another.ts` - ทำอะไร

## Decisions Made
[Key decisions พร้อม rationale สั้น หรือ "None - followed plan as specified"]

## Deviations from Plan

[ถ้าไม่มี deviations: "None - plan executed exactly as written"]

[ถ้ามี deviations:]

### Auto-fixed Issues

**1. [Rule X - Category] Brief description**
- **Found during:** Task [N] ([task name])
- **Issue:** [อะไรผิด]
- **Fix:** [ทำอะไร]
- **Files modified:** [file paths]
- **Verification:** [verify อย่างไร]
- **Committed in:** [hash] (part of task commit)

[... repeat สำหรับแต่ละ auto-fix ...]

### Deferred Enhancements

Logged ไปยัง .planning/ISSUES.md สำหรับพิจารณาในอนาคต:
- ISS-XXX: [Brief description] (discovered in Task [N])
- ISS-XXX: [Brief description] (discovered in Task [N])

---

**Total deviations:** [N] auto-fixed ([breakdown by rule]), [N] deferred
**Impact on plan:** [Brief assessment - เช่น "All auto-fixes necessary for correctness/security. No scope creep."]

## Issues Encountered
[ปัญหาและวิธีแก้ไข หรือ "None"]

[Note: "Deviations from Plan" บันทึกงานที่ไม่ได้วางแผนที่ถูกจัดการอัตโนมัติผ่าน deviation rules "Issues Encountered" บันทึกปัญหาระหว่างงานที่วางแผนไว้ที่ต้องการ problem-solving]

## Next Phase Readiness
[อะไรพร้อมสำหรับเฟสถัดไป]
[Blockers หรือ concerns ใดๆ]

---
*Phase: XX-name*
*Completed: [date]*
```

<frontmatter_guidance>
**Purpose:** เปิดใช้ automatic context assembly ผ่าน dependency graph Frontmatter ทำให้ summary metadata machine-readable ดังนั้น plan-phase สามารถ scan summaries ทั้งหมดได้เร็วและเลือกที่เกี่ยวข้องตาม dependencies

**Fast scanning:** Frontmatter เป็น ~25 บรรทัดแรก ถูกใน scan ข้าม summaries ทั้งหมดโดยไม่ต้องอ่านเนื้อหาเต็ม

**Dependency graph:** `requires`/`provides`/`affects` สร้าง explicit links ระหว่างเฟส เปิดใช้ transitive closure สำหรับ context selection

**Subsystem:** Primary categorization (auth, payments, ui, api, database, infra, testing) สำหรับตรวจจับเฟสที่เกี่ยวข้อง

**Tags:** Searchable technical keywords (libraries, frameworks, tools) สำหรับ tech stack awareness

**Key-files:** ไฟล์สำคัญสำหรับ @context references ใน PLAN.md

**Patterns:** Conventions ที่กำหนดที่เฟสอนาคตควรรักษา

**Population:** Frontmatter ถูกกรอกระหว่าง summary creation ใน execute-plan.md ดู `<step name="create_summary">` สำหรับ field-by-field guidance
</frontmatter_guidance>

<one_liner_rules>
One-liner ต้องมีสาระ:

**Good:**
- "JWT auth with refresh rotation using jose library"
- "Prisma schema with User, Session, and Product models"
- "Dashboard with real-time metrics via Server-Sent Events"

**Bad:**
- "Phase complete"
- "Authentication implemented"
- "Foundation finished"
- "All tasks done"

One-liner ควรบอกใครสักคนว่าจริงๆ แล้ว ship อะไร
</one_liner_rules>

<example>
```markdown
# Phase 1: Foundation Summary

**JWT auth with refresh rotation using jose library, Prisma User model, and protected API middleware**

## Performance

- **Duration:** 28 min
- **Started:** 2025-01-15T14:22:10Z
- **Completed:** 2025-01-15T14:50:33Z
- **Tasks:** 5
- **Files modified:** 8

## Accomplishments
- User model with email/password auth
- Login/logout endpoints with httpOnly JWT cookies
- Protected route middleware checking token validity
- Refresh token rotation on each request

## Files Created/Modified
- `prisma/schema.prisma` - User and Session models
- `src/app/api/auth/login/route.ts` - Login endpoint
- `src/app/api/auth/logout/route.ts` - Logout endpoint
- `src/middleware.ts` - Protected route checks
- `src/lib/auth.ts` - JWT helpers using jose

## Decisions Made
- Used jose instead of jsonwebtoken (ESM-native, Edge-compatible)
- 15-min access tokens with 7-day refresh tokens
- Storing refresh tokens in database for revocation capability

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added password hashing with bcrypt**
- **Found during:** Task 2 (Login endpoint implementation)
- **Issue:** Plan didn't specify password hashing - storing plaintext would be critical security flaw
- **Fix:** Added bcrypt hashing on registration, comparison on login with salt rounds 10
- **Files modified:** src/app/api/auth/login/route.ts, src/lib/auth.ts
- **Verification:** Password hash test passes, plaintext never stored
- **Committed in:** abc123f (Task 2 commit)

**2. [Rule 3 - Blocking] Installed missing jose dependency**
- **Found during:** Task 4 (JWT token generation)
- **Issue:** jose package not in package.json, import failing
- **Fix:** Ran `npm install jose`
- **Files modified:** package.json, package-lock.json
- **Verification:** Import succeeds, build passes
- **Committed in:** def456g (Task 4 commit)

### Deferred Enhancements

Logged to .planning/ISSUES.md for future consideration:
- ISS-001: Add rate limiting to login endpoint (discovered in Task 2)
- ISS-002: Improve token refresh UX with auto-retry on 401 (discovered in Task 5)

---

**Total deviations:** 2 auto-fixed (1 missing critical, 1 blocking), 2 deferred
**Impact on plan:** Both auto-fixes essential for security and functionality. No scope creep.

## Issues Encountered
- jsonwebtoken CommonJS import failed in Edge runtime - switched to jose (planned library change, worked as expected)

## Next Phase Readiness
- Auth foundation complete, ready for feature development
- User registration endpoint needed before public launch

---
*Phase: 01-foundation*
*Completed: 2025-01-15*
```
</example>

<guidelines>
**เมื่อไหร่ควรสร้าง:**
- หลังเสร็จแต่ละ phase plan
- Required output จาก execute-plan workflow
- บันทึกสิ่งที่เกิดขึ้นจริง vs สิ่งที่วางแผนไว้

**Frontmatter completion:**
- MANDATORY: กรอก frontmatter fields ทั้งหมดระหว่าง summary creation
- ดู <frontmatter_guidance> สำหรับ field purposes
- Frontmatter เปิดใช้ automatic context assembly สำหรับ future planning

**One-liner requirements:**
- ต้องมีสาระ (อธิบายว่า ship อะไร ไม่ใช่ "phase complete")
- ควรบอกใครสักคนว่าทำอะไรสำเร็จ
- ตัวอย่าง: "JWT auth with refresh rotation using jose library" ไม่ใช่ "Authentication implemented"

**Performance tracking:**
- รวม duration, start/end timestamps
- ใช้สำหรับ velocity metrics ใน STATE.md

**Deviations section:**
- บันทึกงานที่ไม่ได้วางแผนที่จัดการผ่าน deviation rules
- แยกจาก "Issues Encountered" (ซึ่งเป็นปัญหาของงานที่วางแผนไว้)
- Auto-fixed issues: อะไรผิด, แก้อย่างไร, verification
- Deferred enhancements: Logged ไปยัง ISSUES.md พร้อม ISS-XXX numbers

**Decisions section:**
- Key decisions ที่ทำระหว่าง execution
- รวม rationale (ทำไมเลือกอย่างนี้)
- ถูกดึงไปยัง STATE.md accumulated context
- ใช้ "None - followed plan as specified" ถ้าไม่มี deviations

**หลังสร้าง:**
- STATE.md ถูกอัพเดทด้วย position, decisions, issues
- แผนถัดไปสามารถ reference decisions ที่ทำไว้
</guidelines>
