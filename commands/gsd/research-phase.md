---
name: gsd:research-phase
description: Research วิธี implement phase ก่อนวางแผน
argument-hint: "[phase]"
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - Write
  - WebFetch
  - WebSearch
  - mcp__context7__*
---

<objective>
Comprehensive research เกี่ยวกับวิธี implement phase ก่อนวางแผน

นี่สำหรับ niche/complex domains ที่ training data ของ Claude มีน้อยหรือล้าสมัย Research ค้นพบ:
- มี libraries อะไรสำหรับปัญหานี้
- Experts ใช้ architecture patterns อะไร
- Standard stack หน้าตาเป็นอย่างไร
- คนมักพบปัญหาอะไร
- อะไรที่ไม่ควรเขียนเอง (ใช้ existing solutions)

Output: RESEARCH.md พร้อม ecosystem knowledge ที่ช่วยให้วางแผนได้ดี
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/research-phase.md
@~/.claude/get-shit-done/templates/research.md
@~/.claude/get-shit-done/references/research-pitfalls.md
</execution_context>

<context>
Phase number: $ARGUMENTS (required)

**โหลด project state:**
@.planning/STATE.md

**โหลด roadmap:**
@.planning/ROADMAP.md

**โหลด phase context ถ้ามี:**
ตรวจสอบ `.planning/phases/XX-name/{phase}-CONTEXT.md` - bonus context จาก discuss-phase
</context>

<process>
1. ตรวจสอบ phase number argument (error ถ้าไม่มีหรือไม่ถูกต้อง)
2. ตรวจสอบว่า phase มีอยู่ใน roadmap - ดึง phase description
3. ตรวจสอบว่า RESEARCH.md มีอยู่แล้วหรือไม่ (เสนอให้ update หรือใช้ที่มี)
4. โหลด CONTEXT.md ถ้ามี (bonus context สำหรับ research direction)
5. ทำตาม research-phase.md workflow:
   - วิเคราะห์ phase เพื่อระบุ knowledge gaps
   - กำหนด research domains (architecture, ecosystem, patterns, pitfalls)
   - Execute comprehensive research ผ่าน Context7, official docs, WebSearch
   - Cross-verify ผลลัพธ์ทั้งหมด
   - สร้าง RESEARCH.md พร้อม actionable ecosystem knowledge
6. เสนอขั้นตอนถัดไป (plan phase)
</process>

<when_to_use>
**ใช้ research-phase สำหรับ:**
- 3D graphics (Three.js, WebGL, procedural generation)
- Game development (physics, collision, AI, procedural content)
- Audio/music (Web Audio API, DSP, synthesis)
- Shaders (GLSL, Metal, ISF)
- ML/AI integration (model serving, inference, pipelines)
- Real-time systems (WebSockets, WebRTC, sync)
- Specialized frameworks ที่มี active ecosystems
- Domain ใดก็ตามที่ "experts ทำอย่างไร" มีความสำคัญ

**ข้าม research-phase สำหรับ:**
- Standard web dev (auth, CRUD, REST APIs)
- Well-known patterns (forms, validation, testing)
- Simple integrations (Stripe, SendGrid ที่มี docs ชัดเจน)
- Commodity features ที่ Claude จัดการได้ดี
</when_to_use>

<success_criteria>
- [ ] ตรวจสอบ phase กับ roadmap แล้ว
- [ ] ระบุ domain/ecosystem จาก phase description
- [ ] Execute comprehensive research (Context7 + official docs + WebSearch)
- [ ] Cross-verify ผลลัพธ์ WebSearch ทั้งหมดกับ authoritative sources
- [ ] สร้าง RESEARCH.md พร้อม ecosystem knowledge
- [ ] ระบุ standard stack/libraries แล้ว
- [ ] Document architecture patterns แล้ว
- [ ] Catalog common pitfalls แล้ว
- [ ] ชัดเจนว่าอะไรไม่ควรเขียนเอง
- [ ] ผู้ใช้รู้ขั้นตอนถัดไป (plan phase)
</success_criteria>
