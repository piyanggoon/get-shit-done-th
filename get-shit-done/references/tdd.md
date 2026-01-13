<overview>
TDD เกี่ยวกับคุณภาพ design ไม่ใช่ coverage metrics รอบ red-green-refactor บังคับให้คุณคิดเกี่ยวกับพฤติกรรมก่อน implementation สร้าง interfaces ที่สะอาดกว่าและ code ที่ทดสอบได้มากกว่า

**หลักการ:** ถ้าคุณสามารถอธิบายพฤติกรรมเป็น `expect(fn(input)).toBe(output)` ก่อนเขียน `fn` ได้ TDD จะปรับปรุงผลลัพธ์

**ข้อมูลเชิงลึกสำคัญ:** งาน TDD หนักกว่า tasks มาตรฐานโดยพื้นฐาน—ต้องการ 2-3 execution cycles (RED → GREEN → REFACTOR) แต่ละรอบมีการอ่านไฟล์, การรัน test, และการ debugging ที่อาจเกิดขึ้น TDD features ได้แผนเฉพาะเพื่อให้มั่นใจว่ามี context เต็มตลอดรอบ
</overview>

<when_to_use_tdd>
## เมื่อ TDD ปรับปรุงคุณภาพ

**TDD candidates (สร้างแผน TDD):**
- Business logic ที่มี inputs/outputs ที่กำหนดไว้
- API endpoints ที่มี request/response contracts
- Data transformations, parsing, formatting
- กฎ Validation และ constraints
- Algorithms ที่มีพฤติกรรมทดสอบได้
- State machines และ workflows
- Utility functions ที่มี specifications ชัดเจน

**ข้าม TDD (ใช้แผนมาตรฐานพร้อม `type="auto"` tasks):**
- UI layout, styling, visual components
- การเปลี่ยนแปลง Configuration
- Glue code ที่เชื่อมต่อ components ที่มีอยู่
- Scripts และ migrations ครั้งเดียว
- CRUD ง่ายที่ไม่มี business logic
- Exploratory prototyping

**Heuristic:** คุณสามารถเขียน `expect(fn(input)).toBe(output)` ก่อนเขียน `fn` ได้หรือไม่?
→ ใช่: สร้างแผน TDD
→ ไม่: ใช้แผนมาตรฐาน, เพิ่ม tests หลังจากถ้าจำเป็น
</when_to_use_tdd>

<tdd_plan_structure>
## โครงสร้างแผน TDD

แต่ละแผน TDD implement **หนึ่งฟีเจอร์** ผ่านรอบ RED-GREEN-REFACTOR เต็ม

```markdown
---
phase: XX-name
plan: NN
type: tdd
---

<objective>
[ฟีเจอร์อะไรและทำไม]
Purpose: [ประโยชน์ design ของ TDD สำหรับฟีเจอร์นี้]
Output: [ฟีเจอร์ที่ทำงานและทดสอบแล้ว]
</objective>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@relevant/source/files.ts
</context>

<feature>
  <name>[ชื่อฟีเจอร์]</name>
  <files>[source file, test file]</files>
  <behavior>
    [พฤติกรรมที่คาดหวังในรูปแบบที่ทดสอบได้]
    Cases: input → expected output
  </behavior>
  <implementation>[วิธี implement เมื่อ tests ผ่าน]</implementation>
</feature>

<verification>
[Test command ที่พิสูจน์ว่าฟีเจอร์ทำงาน]
</verification>

<success_criteria>
- Failing test เขียนและ committed
- Implementation ทำให้ test ผ่าน
- Refactor เสร็จ (ถ้าจำเป็น)
- มี commits ทั้ง 2-3 อัน
</success_criteria>

<output>
หลังเสร็จ สร้าง SUMMARY.md พร้อม:
- RED: Test อะไรถูกเขียน, ทำไมมันล้มเหลว
- GREEN: Implementation อะไรทำให้มันผ่าน
- REFACTOR: Cleanup อะไรถูกทำ (ถ้ามี)
- Commits: รายการ commits ที่สร้าง
</output>
```

**หนึ่งฟีเจอร์ต่อแผน TDD** ถ้าฟีเจอร์เล็กพอที่จะรวม มันเล็กพอที่จะข้าม TDD—ใช้แผนมาตรฐานและเพิ่ม tests หลังจาก
</tdd_plan_structure>

<execution_flow>
## รอบ Red-Green-Refactor

**RED - เขียน failing test:**
1. สร้าง test file ตาม conventions โปรเจกต์
2. เขียน test อธิบายพฤติกรรมที่คาดหวัง (จาก `<behavior>` element)
3. รัน test - มันต้องล้มเหลว
4. ถ้า test ผ่าน: ฟีเจอร์อาจมีอยู่แล้วหรือ test ผิด สืบสวน
5. Commit: `test({phase}-{plan}): add failing test for [feature]`

**GREEN - Implement ให้ผ่าน:**
1. เขียน code น้อยที่สุดเพื่อให้ test ผ่าน
2. ไม่ใช่ความฉลาด, ไม่ optimize - แค่ทำให้ทำงาน
3. รัน test - มันต้องผ่าน
4. Commit: `feat({phase}-{plan}): implement [feature]`

**REFACTOR (ถ้าจำเป็น):**
1. ทำความสะอาด implementation ถ้ามีการปรับปรุงที่ชัดเจน
2. รัน tests - ต้องยังผ่าน
3. Commit เฉพาะถ้ามีการเปลี่ยนแปลง: `refactor({phase}-{plan}): clean up [feature]`

**ผลลัพธ์:** แต่ละแผน TDD สร้าง 2-3 atomic commits
</execution_flow>

<test_quality>
## Tests ที่ดี vs Tests ที่ไม่ดี

**ทดสอบพฤติกรรม ไม่ใช่ implementation:**
- ดี: "returns formatted date string"
- ไม่ดี: "calls formatDate helper with correct params"
- Tests ควรอยู่รอด refactors

**หนึ่ง concept ต่อ test:**
- ดี: Tests แยกสำหรับ valid input, empty input, malformed input
- ไม่ดี: Test เดียวตรวจสอบ edge cases ทั้งหมดด้วย assertions หลายอัน

**ชื่อที่อธิบายได้:**
- ดี: "should reject empty email", "returns null for invalid ID"
- ไม่ดี: "test1", "handles error", "works correctly"

**ไม่มีรายละเอียด implementation:**
- ดี: ทดสอบ public API, พฤติกรรมที่สังเกตได้
- ไม่ดี: Mock internals, ทดสอบ private methods, assert บน internal state
</test_quality>

<framework_setup>
## การตั้งค่า Test Framework (ถ้าไม่มี)

เมื่อรันแผน TDD แต่ไม่มี test framework configured ให้ตั้งค่าเป็นส่วนหนึ่งของ RED phase:

**1. ตรวจหาประเภทโปรเจกต์:**
```bash
# JavaScript/TypeScript
if [ -f package.json ]; then echo "node"; fi

# Python
if [ -f requirements.txt ] || [ -f pyproject.toml ]; then echo "python"; fi

# Go
if [ -f go.mod ]; then echo "go"; fi

# Rust
if [ -f Cargo.toml ]; then echo "rust"; fi
```

**2. ติดตั้ง framework น้อยที่สุด:**
| โปรเจกต์ | Framework | Install |
|---------|-----------|---------|
| Node.js | Jest | `npm install -D jest @types/jest ts-jest` |
| Node.js (Vite) | Vitest | `npm install -D vitest` |
| Python | pytest | `pip install pytest` |
| Go | testing | Built-in |
| Rust | cargo test | Built-in |

**3. สร้าง config ถ้าจำเป็น:**
- Jest: `jest.config.js` พร้อม ts-jest preset
- Vitest: `vitest.config.ts` พร้อม test globals
- pytest: `pytest.ini` หรือ `pyproject.toml` section

**4. ตรวจสอบการตั้งค่า:**
```bash
# รัน empty test suite - ควรผ่านด้วย 0 tests
npm test  # Node
pytest    # Python
go test ./...  # Go
cargo test    # Rust
```

**5. สร้าง test file แรก:**
ตาม conventions โปรเจกต์สำหรับตำแหน่ง test:
- `*.test.ts` / `*.spec.ts` ข้าง source
- `__tests__/` directory
- `tests/` directory ที่ root

การตั้งค่า Framework เป็นค่าใช้จ่ายครั้งเดียวรวมใน RED phase ของแผน TDD แรก
</framework_setup>

<error_handling>
## การจัดการ Error

**Test ไม่ล้มเหลวใน RED phase:**
- ฟีเจอร์อาจมีอยู่แล้ว - สืบสวน
- Test อาจผิด (ไม่ได้ทดสอบสิ่งที่คุณคิด)
- แก้ไขก่อนดำเนินการต่อ

**Test ไม่ผ่านใน GREEN phase:**
- Debug implementation
- อย่าข้ามไป refactor
- ทำซ้ำจนกว่าจะ green

**Tests ล้มเหลวใน REFACTOR phase:**
- Undo refactor
- Commit ก่อนกำหนด
- Refactor ในขั้นตอนเล็กลง

**Tests ที่ไม่เกี่ยวข้องพัง:**
- หยุดและสืบสวน
- อาจบ่งบอกปัญหา coupling
- แก้ไขก่อนดำเนินการต่อ
</error_handling>

<commit_pattern>
## Commit Pattern สำหรับแผน TDD

แผน TDD สร้าง 2-3 atomic commits (หนึ่งต่อ phase):

```
test(08-02): add failing test for email validation

- Tests valid email formats accepted
- Tests invalid formats rejected
- Tests empty input handling

feat(08-02): implement email validation

- Regex pattern matches RFC 5322
- Returns boolean for validity
- Handles edge cases (empty, null)

refactor(08-02): extract regex to constant (optional)

- Moved pattern to EMAIL_REGEX constant
- No behavior changes
- Tests still pass
```

**เปรียบเทียบกับแผนมาตรฐาน:**
- แผนมาตรฐาน: 1 commit ต่อ task, 2-4 commits ต่อแผน
- แผน TDD: 2-3 commits สำหรับฟีเจอร์เดียว

ทั้งสองตามรูปแบบเดียวกัน: `{type}({phase}-{plan}): {description}`

**ประโยชน์:**
- แต่ละ commit revert ได้อย่างอิสระ
- Git bisect ทำงานที่ระดับ commit
- ประวัติชัดเจนแสดง TDD discipline
- สม่ำเสมอกับกลยุทธ์ commit โดยรวม
</commit_pattern>

<context_budget>
## งบประมาณ Context

แผน TDD เป้าหมาย **~40% การใช้ context** (ต่ำกว่า ~50% ของแผนมาตรฐาน)

ทำไมต่ำกว่า:
- RED phase: เขียน test, รัน test, อาจ debug ว่าทำไมมันไม่ล้มเหลว
- GREEN phase: implement, รัน test, อาจทำซ้ำเมื่อล้มเหลว
- REFACTOR phase: แก้ไข code, รัน tests, ยืนยันไม่มี regressions

แต่ละ phase เกี่ยวข้องกับการอ่านไฟล์, การรัน commands, การวิเคราะห์ output การไป-กลับหนักกว่าการรัน task แบบ linear โดยธรรมชาติ

การเน้นฟีเจอร์เดียวทำให้มั่นใจคุณภาพเต็มตลอดรอบ
</context_budget>
