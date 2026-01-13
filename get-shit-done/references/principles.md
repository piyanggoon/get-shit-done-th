<principles>
หลักการหลักสำหรับระบบวางแผน Gets Shit Done

<solo_developer_claude>

คุณกำลังวางแผนสำหรับหนึ่งคน (ผู้ใช้) และหนึ่งผู้ implement (Claude)
- ไม่มีทีม, stakeholders, ceremonies, overhead การประสานงาน
- ผู้ใช้คือ visionary/product owner
- Claude คือผู้สร้าง
- ประมาณการความพยายามด้วยเวลารัน Claude ไม่ใช่เวลา dev มนุษย์
</solo_developer_claude>

<plans_are_prompts>

PLAN.md ไม่ใช่เอกสารที่ถูกแปลงเป็น prompt
PLAN.md คือ prompt ประกอบด้วย:
- Objective (อะไรและทำไม)
- Context (@file references)
- Tasks (พร้อม verification criteria)
- Success criteria (วัดได้)

เมื่อวางแผนเฟส คุณกำลังเขียน prompt ที่จะรันมัน
</plans_are_prompts>

<initialization_leverage>

ช่วงเวลาที่มี leverage มากที่สุดคือการเริ่มต้นโปรเจกต์
- การถามลึกที่นี่ = ทุกอย่างดีขึ้นในอนาคต
- Garbage in = garbage out
- ใช้ tokens ในการรวบรวม context
- อย่ารีบไป "งาน"
</initialization_leverage>

<scope_control>

แผนต้องเสร็จภายในการใช้ context ที่เหมาะสม

**Quality degradation curve:**
- 0-30% context: คุณภาพสูงสุด
- 30-50% context: คุณภาพดี
- 50-70% context: คุณภาพลดลง
- 70%+ context: คุณภาพต่ำ

**วิธีแก้:** Aggressive atomicity - แยกเป็นแผนเล็กๆ ที่เน้น
- 2-3 tasks ต่อแผนสูงสุด
- แต่ละแผนรันได้อย่างอิสระ
- ดีกว่าที่จะมีแผนเล็กหลายแผนมากกว่าแผนใหญ่ไม่กี่แผน
</scope_control>

<claude_automates>

ถ้า Claude ทำได้ผ่าน CLI/API/tool Claude ต้องทำมัน

Checkpoints มีไว้สำหรับ:
- **การยืนยัน** - มนุษย์ยืนยันงานของ Claude (visual, UX)
- **การตัดสินใจ** - มนุษย์เลือก implementation

ไม่ใช่สำหรับ:
- Deploying (ใช้ CLI)
- สร้าง resources (ใช้ CLI/API)
- รัน builds/tests (ใช้ Bash)
- เขียนไฟล์ (ใช้ Write tool)
</claude_automates>

<deviation_rules>

แผนเป็นแนวทาง ไม่ใช่กฎเหล็ก ระหว่างการรัน:

1. **แก้ bugs อัตโนมัติ** - แก้ทันที, บันทึก
2. **เพิ่มสิ่งสำคัญอัตโนมัติ** - ช่องโหว่ security/ความถูกต้อง, เพิ่มทันที
3. **แก้ blockers อัตโนมัติ** - ไปต่อไม่ได้, แก้ทันที
4. **ถามเรื่อง architectural** - การเปลี่ยนแปลงใหญ่, หยุดและถาม
5. **บันทึก enhancements** - Nice-to-haves, บันทึกไป Issues, ทำต่อ
</deviation_rules>

<test_driven_when_beneficial>

ใช้ TDD เมื่องานจะได้ประโยชน์จากมัน ไม่ใช่ dogma—เป็น pragmatism

**TDD candidates (สร้างแผน TDD เฉพาะ):**
- Business logic ที่มี inputs/outputs ที่กำหนดไว้
- API endpoints และ handlers
- Data transformations และ parsing
- กฎ Validation
- State machines และ workflows
- อะไรก็ตามที่คุณสามารถอธิบายพฤติกรรมที่คาดหวังก่อน implement

**ข้าม TDD (ใช้แผนมาตรฐาน):**
- UI layout และ styling
- Exploratory prototyping
- Scripts และ migrations ครั้งเดียว
- การเปลี่ยนแปลง Configuration
- Glue code ที่ไม่มี logic

**Decision heuristic:**
คุณสามารถเขียน `expect(fn(input)).toBe(output)` ก่อนเขียน `fn` ได้หรือไม่?
→ ใช่: สร้างแผน TDD (หนึ่งฟีเจอร์ต่อแผน)
→ ไม่: แผนมาตรฐาน, เพิ่ม tests หลังจากถ้าจำเป็น

**ทำไม TDD ได้แผนของตัวเอง:**
TDD ต้องการ 2-3 execution cycles (RED → GREEN → REFACTOR) แต่ละรอบมีการอ่านไฟล์, การรัน test, และการ debugging ที่อาจเกิดขึ้น นี่ใช้ 40-50% ของ context สำหรับฟีเจอร์เดียว แผน TDD เฉพาะทำให้มั่นใจว่าคุณภาพเต็มตลอดรอบ

**โครงสร้างแผน TDD:**
1. เขียน failing test (RED) → commit
2. Implement ให้ผ่าน (GREEN) → commit
3. Refactor ถ้าจำเป็น → commit

นี่เกี่ยวกับคุณภาพ design ไม่ใช่ metrics test coverage

ดู `~/.claude/get-shit-done/references/tdd.md` สำหรับโครงสร้างแผน TDD
</test_driven_when_beneficial>

<ship_fast>

ไม่มี enterprise process ไม่มี approval gates

Plan → Execute → Ship → Learn → Repeat

Milestones ทำเครื่องหมายเวอร์ชันที่ shipped (v1.0 → v1.1 → v2.0)
</ship_fast>

<atomic_commits>

**Git commits = context engineering สำหรับ Claude**

แต่ละ task ได้ commit ของตัวเองทันทีหลังเสร็จ:
- รูปแบบ: `{type}({phase}-{plan}): {task-description}`
- Types: feat, fix, test, refactor, perf, chore, docs
- Metadata commit สุดท้ายต่อแผน: `docs({phase}-{plan}): complete [plan-name]`

**ทำไม commits ต่อ task:**
- Git history กลายเป็นแหล่ง context หลักสำหรับ Claude sessions ในอนาคต
- `git bisect` หา task ที่ล้มเหลวที่แน่นอน ไม่ใช่แค่แผนที่ล้มเหลว
- แต่ละ task revert ได้อย่างอิสระ
- การกู้คืนความล้มเหลวที่ดีขึ้น (task 1 committed ✅, ลอง task 2 ใหม่)
- Observability ที่ปรับให้เหมาะกับ AI workflow ไม่ใช่การ browse ของมนุษย์

**แผนสร้าง 3-4 commits รวม:**
- 2-3 task commits (working code)
- 1 metadata commit (SUMMARY + STATE + ROADMAP)

ดู `~/.claude/get-shit-done/references/git-integration.md` สำหรับกลยุทธ์ที่ครบถ้วน
</atomic_commits>

<anti_enterprise>

อย่ารวม:
- โครงสร้างทีม, RACI matrices
- Stakeholder management
- Sprint ceremonies
- การประมาณเวลา dev มนุษย์ (ชั่วโมง, วัน, สัปดาห์—Claude ทำงานต่างกัน)
- Change management processes
- เอกสารเพื่อเอกสาร

ถ้าฟังดูเหมือน corporate PM theater ให้ลบทิ้ง
</anti_enterprise>
</principles>
