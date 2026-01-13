<overview>
การรวม Git สำหรับ GSD framework
</overview>

<core_principle>

**Commit ผลลัพธ์ ไม่ใช่กระบวนการ**

Git log ควรอ่านเหมือน changelog ของสิ่งที่ shipped ไม่ใช่บันทึกของกิจกรรมวางแผน
</core_principle>

<commit_points>

| เหตุการณ์ | Commit? | ทำไม |
| ----------------------- | ------- | ------------------------------------------------ |
| สร้าง BRIEF + ROADMAP | ใช่ | การเริ่มต้นโปรเจกต์ |
| สร้าง PLAN.md | ไม่ | ระหว่างทาง - commit พร้อมกับเมื่อแผนเสร็จ |
| สร้าง RESEARCH.md | ไม่ | ระหว่างทาง |
| สร้าง DISCOVERY.md | ไม่ | ระหว่างทาง |
| **Task เสร็จ** | ใช่ | หน่วยงานแบบ atomic (1 commit ต่อ task) |
| **แผนเสร็จ** | ใช่ | Metadata commit (SUMMARY + STATE + ROADMAP) |
| สร้าง Handoff | ใช่ | เก็บรักษาสถานะ WIP |

</commit_points>

<git_check>

```bash
[ -d .git ] && echo "GIT_EXISTS" || echo "NO_GIT"
```

ถ้า NO_GIT: รัน `git init` โดยเงียบ โปรเจกต์ GSD ได้ repo ของตัวเองเสมอ
</git_check>

<commit_formats>

<format name="initialization">
## การเริ่มต้นโปรเจกต์ (brief + roadmap ด้วยกัน)

```
docs: initialize [project-name] ([N] phases)

[คำอธิบายหนึ่งบรรทัดจาก PROJECT.md]

Phases:
1. [phase-name]: [goal]
2. [phase-name]: [goal]
3. [phase-name]: [goal]
```

สิ่งที่ต้อง commit:

```bash
git add .planning/
git commit
```

</format>

<format name="task-completion">
## Task เสร็จ (ระหว่างรันแผน)

แต่ละ task ได้ commit ของตัวเองทันทีหลังเสร็จ

```
{type}({phase}-{plan}): {task-name}

- [การเปลี่ยนแปลงสำคัญ 1]
- [การเปลี่ยนแปลงสำคัญ 2]
- [การเปลี่ยนแปลงสำคัญ 3]
```

**Commit types:**
- `feat` - ฟีเจอร์/ฟังก์ชันใหม่
- `fix` - แก้ไข Bug
- `test` - เฉพาะ test (TDD RED phase)
- `refactor` - ทำความสะอาด code (TDD REFACTOR phase)
- `perf` - ปรับปรุง performance
- `chore` - Dependencies, config, tooling

**ตัวอย่าง:**

```bash
# Task มาตรฐาน
git add src/api/auth.ts src/types/user.ts
git commit -m "feat(08-02): create user registration endpoint

- POST /auth/register validates email and password
- Checks for duplicate users
- Returns JWT token on success
"

# TDD task - RED phase
git add src/__tests__/jwt.test.ts
git commit -m "test(07-02): add failing test for JWT generation

- Tests token contains user ID claim
- Tests token expires in 1 hour
- Tests signature verification
"

# TDD task - GREEN phase
git add src/utils/jwt.ts
git commit -m "feat(07-02): implement JWT generation

- Uses jose library for signing
- Includes user ID and expiry claims
- Signs with HS256 algorithm
"
```

</format>

<format name="plan-completion">
## แผนเสร็จ (หลังจาก Tasks ทั้งหมดเสร็จ)

หลังจาก tasks ทั้งหมด committed แล้ว metadata commit หนึ่งอันจับการเสร็จสิ้นแผน

```
docs({phase}-{plan}): complete [plan-name] plan

Tasks completed: [N]/[N]
- [Task 1 name]
- [Task 2 name]
- [Task 3 name]

SUMMARY: .planning/phases/XX-name/{phase}-{plan}-SUMMARY.md
```

สิ่งที่ต้อง commit:

```bash
git add .planning/phases/XX-name/{phase}-{plan}-PLAN.md
git add .planning/phases/XX-name/{phase}-{plan}-SUMMARY.md
git add .planning/STATE.md
git add .planning/ROADMAP.md
git commit
```

**หมายเหตุ:** ไฟล์ Code ไม่รวม - committed ต่อ task แล้ว

</format>

<format name="handoff">
## Handoff (WIP)

```
wip: [phase-name] paused at task [X]/[Y]

Current: [task name]
[ถ้าติดขัด:] Blocked: [reason]
```

สิ่งที่ต้อง commit:

```bash
git add .planning/
git commit
```

</format>
</commit_formats>

<example_log>

**วิธีเก่า (commits ต่อแผน):**
```
a7f2d1 feat(checkout): Stripe payments with webhook verification
3e9c4b feat(products): catalog with search, filters, and pagination
8a1b2c feat(auth): JWT with refresh rotation using jose
5c3d7e feat(foundation): Next.js 15 + Prisma + Tailwind scaffold
2f4a8d docs: initialize ecommerce-app (5 phases)
```

**วิธีใหม่ (commits ต่อ task):**
```
# Phase 04 - Checkout
1a2b3c docs(04-01): complete checkout flow plan
4d5e6f feat(04-01): add webhook signature verification
7g8h9i feat(04-01): implement payment session creation
0j1k2l feat(04-01): create checkout page component

# Phase 03 - Products
3m4n5o docs(03-02): complete product listing plan
6p7q8r feat(03-02): add pagination controls
9s0t1u feat(03-02): implement search and filters
2v3w4x feat(03-01): create product catalog schema

# Phase 02 - Auth
5y6z7a docs(02-02): complete token refresh plan
8b9c0d feat(02-02): implement refresh token rotation
1e2f3g test(02-02): add failing test for token refresh
4h5i6j docs(02-01): complete JWT setup plan
7k8l9m feat(02-01): add JWT generation and validation
0n1o2p chore(02-01): install jose library

# Phase 01 - Foundation
3q4r5s docs(01-01): complete scaffold plan
6t7u8v feat(01-01): configure Tailwind and globals
9w0x1y feat(01-01): set up Prisma with database
2z3a4b feat(01-01): create Next.js 15 project

# Initialization
5c6d7e docs: initialize ecommerce-app (5 phases)
```

แต่ละแผนสร้าง 2-4 commits (tasks + metadata) ชัดเจน, ละเอียด, bisect ได้

</example_log>

<anti_patterns>

**ยังไม่ควร commit (artifacts ระหว่างทาง):**
- การสร้าง PLAN.md (commit พร้อมกับเมื่อแผนเสร็จ)
- RESEARCH.md (ระหว่างทาง)
- DISCOVERY.md (ระหว่างทาง)
- การปรับแต่ง planning เล็กน้อย
- "Fixed typo in roadmap"

**ควร commit (ผลลัพธ์):**
- การเสร็จสิ้นแต่ละ task (feat/fix/test/refactor)
- Metadata เมื่อแผนเสร็จ (docs)
- การเริ่มต้นโปรเจกต์ (docs)

**หลักการสำคัญ:** Commit working code และผลลัพธ์ที่ shipped ไม่ใช่กระบวนการวางแผน

</anti_patterns>

<commit_strategy_rationale>

## ทำไมต้อง Commits ต่อ Task?

**Context engineering สำหรับ AI:**
- Git history กลายเป็นแหล่ง context หลักสำหรับ Claude sessions ในอนาคต
- `git log --grep="{phase}-{plan}"` แสดงงานทั้งหมดสำหรับแผน
- `git diff <hash>^..<hash>` แสดงการเปลี่ยนแปลงที่แน่นอนต่อ task
- พึ่งพาการ parse SUMMARY.md น้อยลง = มี context มากขึ้นสำหรับงานจริง

**การกู้คืนความล้มเหลว:**
- Task 1 committed ✅, Task 2 ล้มเหลว ❌
- Claude ใน session ถัดไป: เห็น task 1 เสร็จ, สามารถลอง task 2 ใหม่
- สามารถ `git reset --hard` ไปยัง task สุดท้ายที่สำเร็จ

**การ debugging:**
- `git bisect` หา task ที่ล้มเหลวที่แน่นอน ไม่ใช่แค่แผนที่ล้มเหลว
- `git blame` ติดตามบรรทัดไปยัง context ของ task เฉพาะ
- แต่ละ commit revert ได้อย่างอิสระ

**Observability:**
- Solo developer + Claude workflow ได้ประโยชน์จาก attribution ที่ละเอียด
- Atomic commits เป็น git best practice
- "Commit noise" ไม่เกี่ยวเมื่อผู้ใช้คือ Claude ไม่ใช่มนุษย์

</commit_strategy_rationale>
