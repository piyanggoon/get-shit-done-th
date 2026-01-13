<scope_estimation>
แผนต้องรักษาคุณภาพที่สม่ำเสมอตั้งแต่ task แรกถึง task สุดท้าย สิ่งนี้ต้องการความเข้าใจ quality degradation และการแยกอย่าง aggressive

<quality_insight>
Claude ลดคุณภาพเมื่อ *รับรู้* ความกดดัน context และเข้าสู่ "completion mode"

| การใช้ Context | คุณภาพ | สถานะของ Claude |
|---------------|---------|----------------|
| 0-30% | สูงสุด | ละเอียด, ครอบคลุม |
| 30-50% | ดี | มั่นใจ, งานมั่นคง |
| 50-70% | ลดลง | โหมดประหยัดเริ่ม |
| 70%+ | ต่ำ | รีบ, น้อยที่สุด |

**จุดหักเห 40-50%:** Claude เห็น context สะสมและคิด "ฉันควรประหยัดตอนนี้" ผลลัพธ์: "ฉันจะทำ tasks ที่เหลือให้กระชับขึ้น" = คุณภาพตก

**กฎ:** หยุดก่อนคุณภาพลดลง ไม่ใช่ที่ขีดจำกัด context
</quality_insight>

<context_target>
**แผนควรเสร็จภายในการใช้ context ~50%**

ทำไม 50% ไม่ใช่ 80%?
- ไม่มี context anxiety ได้
- คุณภาพคงที่ตั้งแต่ต้นจนจบ
- มีที่ว่างสำหรับความซับซ้อนที่ไม่คาดคิด
- ถ้าคุณตั้งเป้า 80%, คุณใช้ 40% ใน degradation mode แล้ว
</context_target>

<task_rule>
**แต่ละแผน: 2-3 tasks สูงสุด อยู่ใต้ 50% context**

| ความซับซ้อน Task | Tasks/แผน | Context/Task | รวม |
|-----------------|------------|--------------|-------|
| ง่าย (CRUD, config) | 3 | ~10-15% | ~30-45% |
| ซับซ้อน (auth, payments) | 2 | ~20-30% | ~40-50% |
| ซับซ้อนมาก (migrations, refactors) | 1-2 | ~30-40% | ~30-50% |

**เมื่อไม่แน่ใจ: Default เป็น 2 tasks** ดีกว่ามีแผนเพิ่มกว่าคุณภาพลดลง
</task_rule>

<tdd_plans>
**TDD features ได้แผนของตัวเอง เป้าหมาย ~40% context**

TDD ต้องการ 2-3 execution cycles (RED → GREEN → REFACTOR) แต่ละรอบมีการอ่านไฟล์, การรัน test, และการ debugging ที่อาจเกิดขึ้น นี่หนักกว่าการรัน task แบบ linear โดยพื้นฐาน

| ความซับซ้อน TDD Feature | การใช้ Context |
|------------------------|---------------|
| Utility function ง่าย | ~25-30% |
| Business logic พร้อม edge cases | ~35-40% |
| Algorithm ซับซ้อน | ~40-50% |

**หนึ่งฟีเจอร์ต่อแผน TDD** ถ้าฟีเจอร์เล็กพอที่จะรวม มันเล็กพอที่จะข้าม TDD

**ทำไมแผน TDD แยก:**
- TDD ใช้ 40-50% context สำหรับฟีเจอร์เดียว
- แผนเฉพาะทำให้มั่นใจคุณภาพเต็มตลอด RED-GREEN-REFACTOR
- แต่ละ TDD feature ได้ context ใหม่, คุณภาพสูงสุด

ดู `~/.claude/get-shit-done/references/tdd.md` สำหรับโครงสร้างแผน TDD
</tdd_plans>

<split_signals>

<always_split>
- **มากกว่า 3 tasks** - แม้ tasks จะดูเล็ก
- **หลาย subsystems** - DB + API + UI = แผนแยก
- **Task ใดมี >5 file modifications** - แยกตามกลุ่มไฟล์
- **Checkpoint + งาน implementation** - Checkpoints ในแผนหนึ่ง, implementation หลังจากในแผนแยก
- **Discovery + implementation** - DISCOVERY.md ในแผนหนึ่ง, implementation ในอีกแผน
</always_split>

<consider_splitting>
- ประมาณการ >5 files modified รวม
- โดเมนซับซ้อน (auth, payments, data modeling)
- มีความไม่แน่ใจเกี่ยวกับแนวทาง
- ขอบเขต semantic ธรรมชาติ (Setup -> Core -> Features)
</consider_splitting>
</split_signals>

<splitting_strategies>
**ตาม subsystem:** Auth → 01: DB models, 02: API routes, 03: Protected routes, 04: UI components

**ตาม dependency:** Payments → 01: Stripe setup, 02: Subscription logic, 03: Frontend integration

**ตาม complexity:** Dashboard → 01: Layout shell, 02: Data fetching, 03: Visualization

**ตาม verification:** Deploy → 01: Vercel setup (checkpoint), 02: Env config (auto), 03: CI/CD (checkpoint)
</splitting_strategies>

<anti_patterns>
**ไม่ดี - แผนครอบคลุม:**
```
แผน: "Complete Authentication System"
Tasks: 8 (models, migrations, API, JWT, middleware, hashing, login form, register form)
ผลลัพธ์: Task 1-3 ดี, Task 4-5 ลดลง, Task 6-8 รีบ
```

**ดี - แผน Atomic:**
```
แผน 1: "Auth Database Models" (2 tasks)
แผน 2: "Auth API Core" (3 tasks)
แผน 3: "Auth API Protection" (2 tasks)
แผน 4: "Auth UI Components" (2 tasks)
แต่ละ: 30-40% context, คุณภาพสูงสุด, atomic commits (2-3 task commits + 1 metadata commit)
```
</anti_patterns>

<estimating_context>
| Files Modified | ผลกระทบ Context |
|----------------|----------------|
| 0-3 files | ~10-15% (เล็ก) |
| 4-6 files | ~20-30% (ปานกลาง) |
| 7+ files | ~40%+ (ใหญ่ - แยก) |

| ความซับซ้อน | Context/Task |
|------------|--------------|
| CRUD ง่าย | ~15% |
| Business logic | ~25% |
| Algorithms ซับซ้อน | ~40% |
| Domain modeling | ~35% |

**2 tasks:** ง่าย ~30%, ปานกลาง ~50%, ซับซ้อน ~80% (แยก)
**3 tasks:** ง่าย ~45%, ปานกลาง ~75% (เสี่ยง), ซับซ้อน 120% (เป็นไปไม่ได้)
</estimating_context>

<depth_calibration>
**Depth ควบคุม compression tolerance ไม่ใช่ artificial inflation**

| Depth | เฟสโดยทั่วไป | แผน/เฟสโดยทั่วไป | Tasks/แผน |
|-------|----------------|---------------------|------------|
| Quick | 3-5 | 1-3 | 2-3 |
| Standard | 5-8 | 3-5 | 2-3 |
| Comprehensive | 8-12 | 5-10 | 2-3 |

Tasks/แผนคงที่ที่ 2-3 กฎ 50% context ใช้ได้ทั่วไป

**หลักการสำคัญ:** ได้มาจากงานจริง Depth กำหนดว่าคุณรวมสิ่งต่างๆ อย่าง aggressive แค่ไหน ไม่ใช่เป้าหมายที่ต้องถึง

- Auth แบบ comprehensive = 8 แผน (เพราะ auth มี 8 concerns จริงๆ)
- "add favicon" แบบ comprehensive = 1 แผน (เพราะนั่นคือทั้งหมดที่เป็น)

อย่า pad งานเล็กให้ถึงตัวเลข อย่า compress งานซับซ้อนให้ดูมีประสิทธิภาพ

**ตัวอย่าง Comprehensive depth:**
Auth system ที่ comprehensive depth = 8 แผน (ไม่ใช่ 3 แผนใหญ่):
- 01: DB models (2 tasks)
- 02: Password hashing (2 tasks)
- 03: JWT generation (2 tasks)
- 04: JWT validation middleware (2 tasks)
- 05: Login endpoint (2 tasks)
- 06: Register endpoint (2 tasks)
- 07: Protected route patterns (2 tasks)
- 08: Auth UI components (3 tasks)

แต่ละแผน: context ใหม่, คุณภาพสูงสุด แผนมากขึ้น = ละเอียดมากขึ้น, คุณภาพเท่ากันต่อแผน
</depth_calibration>

<summary>
**2-3 tasks, เป้าหมาย 50% context:**
- Tasks ทั้งหมด: คุณภาพสูงสุด
- Git: Atomic per-task commits (แต่ละ task = 1 commit, แผน = 1 metadata commit)
- แผน Autonomous: Subagent execution (context ใหม่)

**หลักการ:** Aggressive atomicity แผนมากขึ้น, scope เล็กลง, คุณภาพสม่ำเสมอ

**กฎ:** ถ้าไม่แน่ใจ แยก คุณภาพเหนือการรวม เสมอ

**กฎ Depth:** Depth เพิ่มจำนวนแผน ไม่ใช่ขนาดแผน

**กฎ Commit:** แต่ละแผนสร้าง 3-4 commits รวม (2-3 task commits + 1 docs commit) ประวัติที่ละเอียดกว่า = observability ดีกว่าสำหรับ Claude
</summary>
</scope_estimation>
