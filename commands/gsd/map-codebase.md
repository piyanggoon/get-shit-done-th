---
name: gsd:map-codebase
description: วิเคราะห์ codebase ด้วย parallel Explore agents เพื่อสร้าง .planning/codebase/ documents
argument-hint: "[optional: specific area to map, เช่น 'api' หรือ 'auth']"
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - Write
  - Task
---

<objective>
วิเคราะห์ codebase ที่มีอยู่โดยใช้ parallel Explore agents เพื่อสร้าง structured codebase documents

คำสั่งนี้ spawn หลาย Explore agents เพื่อวิเคราะห์ส่วนต่างๆ ของ codebase พร้อมกัน แต่ละตัวมี fresh context

Output: โฟลเดอร์ .planning/codebase/ พร้อม 7 structured documents เกี่ยวกับสถานะ codebase
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/map-codebase.md
@~/.claude/get-shit-done/templates/codebase/stack.md
@~/.claude/get-shit-done/templates/codebase/architecture.md
@~/.claude/get-shit-done/templates/codebase/structure.md
@~/.claude/get-shit-done/templates/codebase/conventions.md
@~/.claude/get-shit-done/templates/codebase/testing.md
@~/.claude/get-shit-done/templates/codebase/integrations.md
@~/.claude/get-shit-done/templates/codebase/concerns.md
</execution_context>

<context>
Focus area: $ARGUMENTS (optional - ถ้าระบุ บอก agents ให้โฟกัสที่ subsystem เฉพาะ)

**โหลด project state ถ้ามี:**
ตรวจสอบ .planning/STATE.md - โหลด context ถ้าโปรเจค initialized แล้ว

**คำสั่งนี้รันได้:**
- ก่อน /gsd:new-project (brownfield codebases) - สร้าง codebase map ก่อน
- หลัง /gsd:new-project (greenfield codebases) - อัพเดท codebase map ตาม code ที่เปลี่ยน
- เมื่อไหร่ก็ได้เพื่อ refresh codebase understanding
</context>

<when_to_use>
**ใช้ map-codebase สำหรับ:**
- Brownfield projects ก่อน initialization (เข้าใจ existing code ก่อน)
- Refresh codebase map หลังการเปลี่ยนแปลงสำคัญ
- Onboarding ไปยัง codebase ที่ไม่คุ้นเคย
- ก่อน major refactoring (เข้าใจสถานะปัจจุบัน)
- เมื่อ STATE.md อ้างอิง codebase info ที่ล้าสมัย

**ข้าม map-codebase สำหรับ:**
- Greenfield projects ที่ยังไม่มี code (ไม่มีอะไรให้ map)
- Trivial codebases (<5 files)
</when_to_use>

<process>
1. ตรวจสอบว่า .planning/codebase/ มีอยู่แล้วหรือไม่ (เสนอให้ refresh หรือข้าม)
2. สร้างโครงสร้างโฟลเดอร์ .planning/codebase/
3. Spawn 4 parallel Explore agents เพื่อวิเคราะห์ codebase:
   - Agent 1: Stack + Integrations (technology focus)
   - Agent 2: Architecture + Structure (organization focus)
   - Agent 3: Conventions + Testing (quality focus)
   - Agent 4: Concerns (issues focus)
4. รอให้ agents ทั้งหมดเสร็จ รวบรวมผลลัพธ์
5. เขียน 7 codebase documents โดยใช้ templates:
   - STACK.md - Languages, frameworks, key dependencies
   - ARCHITECTURE.md - System design, patterns, data flow
   - STRUCTURE.md - Directory layout, module organization
   - CONVENTIONS.md - Code style, naming, patterns
   - TESTING.md - Test structure, coverage, practices
   - INTEGRATIONS.md - APIs, databases, external services
   - CONCERNS.md - Technical debt, risks, issues
6. เสนอขั้นตอนถัดไป (โดยปกติ: /gsd:new-project หรือ /gsd:plan-phase)
</process>

<success_criteria>
- [ ] สร้างโฟลเดอร์ .planning/codebase/ แล้ว
- [ ] เขียน codebase documents ทั้ง 7 แล้ว
- [ ] Documents ตาม template structure
- [ ] Parallel agents เสร็จโดยไม่มี errors
- [ ] ผู้ใช้รู้ขั้นตอนถัดไป
</success_criteria>
