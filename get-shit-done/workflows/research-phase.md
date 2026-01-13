<purpose>
การวิจัยอย่างครอบคลุมเกี่ยวกับวิธี implement phase ก่อนวางแผน

Triggered โดย /gsd:research-phase command เมื่อ domain เป็น niche, ซับซ้อน หรือ training ของ Claude น่าจะเก่า

สร้าง RESEARCH.md พร้อม ecosystem knowledge ที่ให้ข้อมูล quality planning - ไม่ใช่แค่ "library ไหน" แต่ "ผู้เชี่ยวชาญสร้างสิ่งนี้อย่างไร"
</purpose>

<when_to_use>
**Workflow นี้สำหรับ domains ที่ Claude ล้มเหลวโดยไม่ research:**
- 3D graphics (Three.js, Babylon.js, procedural generation, level design)
- Game development (physics engines, collision, AI, ECS patterns)
- Audio/music (Web Audio, DSP, synthesis, MIDI)
- Shaders (GLSL, Metal, ISF, compute shaders)
- ML/AI integration (model serving, inference, vector DBs)
- Real-time systems (WebSockets, WebRTC, CRDT sync)
- Specialized frameworks ที่มี active ecosystems ที่ Claude อาจไม่รู้

**ข้ามสำหรับ commodity domains:**
- Standard auth (JWT, OAuth)
- CRUD APIs
- Forms และ validation
- Well-documented integrations (Stripe, SendGrid)
</when_to_use>

<key_insight>
"mandatory discovery" ปัจจุบันใน plan-phase ถามว่า: "ฉันควรใช้ library ไหน?"

Workflow นี้ถามว่า: "อะไรที่ฉันไม่รู้ว่าฉันไม่รู้?"

สำหรับ niche domains คำถามไม่ใช่การเลือก library - มันคือ:
- Established architecture pattern คืออะไร?
- Libraries อะไรประกอบเป็น standard stack?
- ปัญหาอะไรที่คนมักเจอ?
- อะไรคือ SOTA vs อะไรที่ Claude คิดว่าเป็น SOTA?
- อะไรที่ไม่ควรทำเอง?
</key_insight>

<process>

<step name="validate_phase" priority="first">
Phase number: $ARGUMENTS (ต้องการ)

ตรวจสอบ phase มีอยู่ใน roadmap:

```bash
if [ -f .planning/ROADMAP.md ]; then
  grep -A5 "Phase ${PHASE}:" .planning/ROADMAP.md
fi
```

**หากไม่พบ phase:**
```
Error: Phase ${PHASE} not found in roadmap.

Use /gsd:progress to see available phases.
```
ออกจาก workflow

**หากพบ phase:**
ดึง:
- Phase number
- Phase name
- Phase description
- "Research: Likely" flags ใดๆ

ดำเนินการไป check_existing
</step>

<step name="check_existing">
ตรวจสอบว่า RESEARCH.md มีอยู่แล้วสำหรับ phase นี้หรือไม่:

```bash
ls .planning/phases/${PHASE}-*/RESEARCH.md 2>/dev/null
ls .planning/phases/${PHASE}-*/${PHASE}-RESEARCH.md 2>/dev/null
```

**หากมี:**
```
Phase ${PHASE} already has research: [path to RESEARCH.md]

What's next?
1. Update research - Refresh with new findings
2. View existing - Show me the current research
3. Skip - Use existing research as-is
```

รอการตอบจากผู้ใช้

หาก "Update research": โหลด RESEARCH.md ที่มี ดำเนินการ research ด้วย update mindset
หาก "View existing": อ่านและแสดง RESEARCH.md แล้วเสนอ update/skip
หาก "Skip": ออกจาก workflow

**หากไม่มี:**
ดำเนินการไป load_context
</step>

<step name="load_context">
โหลด context ที่มีเพื่อให้ข้อมูลทิศทาง research:

**1. Project context:**
```bash
cat .planning/PROJECT.md 2>/dev/null | head -50
```

**2. Phase context (หากมีจาก /gsd:discuss-phase):**
```bash
cat .planning/phases/${PHASE}-*/${PHASE}-CONTEXT.md 2>/dev/null
```

หาก CONTEXT.md มี ใช้เพื่อเข้าใจ:
- เป้าหมายเฉพาะของผู้ใช้สำหรับ phase นี้
- Constraints ที่กล่าวถึง
- Preferences ใดๆ ที่ระบุ

**3. Prior phase decisions:**
```bash
cat .planning/STATE.md 2>/dev/null | grep -A20 "## Accumulated Decisions"
```

สิ่งเหล่านี้อาจ constrain technology choices

แสดงสิ่งที่พบ:
```
Research context สำหรับ Phase ${PHASE}: ${PHASE_NAME}

Roadmap description: ${PHASE_DESCRIPTION}

[หาก CONTEXT.md มี:]
Phase context available - will incorporate user preferences.

[หาก prior decisions มี:]
Prior decisions to respect: [list relevant ones]

Proceeding with ecosystem research...
```
</step>

<step name="identify_domains">
วิเคราะห์ phase description เพื่อระบุอะไรที่ต้อง research

**ถาม: "ความรู้อะไรที่ฉันต้องการเพื่อ implement สิ่งนี้อย่างดี?"**

Categories ที่พิจารณา:

**1. Core Technology:**
- Primary technology/framework คืออะไร?
- Version ปัจจุบันคืออะไร? (training ของ Claude อาจเก่า)
- Standard setup/toolchain คืออะไร?

**2. Ecosystem/Stack:**
- Experts pair libraries อะไรกับสิ่งนี้?
- "Blessed" stack สำหรับ problem domain นี้คืออะไร?
- Helper libraries อะไรมีที่ฉันอาจไม่รู้?

**3. Architecture Patterns:**
- Experts โครงสร้าง project ประเภทนี้อย่างไร?
- Design patterns อะไรใช้ได้?
- Project organization ที่แนะนำคืออะไร?

**4. Common Pitfalls:**
- Beginners ทำผิดอะไร?
- "Gotchas" ใน domain นี้คืออะไร?
- ความผิดพลาดอะไรนำไปสู่การ rewrite?

**5. What NOT to Hand-Roll:**
- Existing solutions อะไรควรใช้แทน custom code?
- ปัญหาอะไรดูง่ายแต่มี nasty edge cases?
- Libraries อะไรแก้ปัญหาที่ฉันไม่รู้ว่ามี?

**6. Current State of the Art:**
- อะไรเปลี่ยนเร็วๆ นี้ใน ecosystem นี้?
- Approaches อะไรถือว่า outdated แล้ว?
- Tools/patterns ใหม่อะไรเกิดขึ้น?

แสดง research scope:
```
Research domains identified:

1. Core: [เช่น "Three.js for 3D web graphics"]
2. Ecosystem: [เช่น "Physics engine, asset loading, controls"]
3. Patterns: [เช่น "Scene graph architecture, game loop patterns"]
4. Pitfalls: [เช่น "Performance, memory, mobile compatibility"]
5. Don't hand-roll: [เช่น "Physics, collision detection, procedural generation"]
6. SOTA check: [เช่น "WebGPU vs WebGL, drei ecosystem"]

Proceeding with comprehensive research...
```
</step>

<step name="execute_research">
Execute research อย่างเป็นระบบสำหรับแต่ละ domain ที่ระบุ

**สำคัญ: Source hierarchy - Context7 ก่อน WebSearch**

ข้อมูล training ของ Claude เก่า 6-18 เดือน Treat pre-existing knowledge เป็น hypothesis ไม่ใช่ fact

<research_protocol>

**สำหรับแต่ละ domain ตามลำดับ:**

**1. Context7 First (authoritative, current):**
```
สำหรับ core technology:
- mcp__context7__resolve-library-id with libraryName: "[main technology]"
- mcp__context7__get-library-docs with topic: "getting started"
- mcp__context7__get-library-docs with topic: "[specific concern]"

สำหรับ ecosystem libraries:
- Resolve และ fetch docs สำหรับแต่ละ major library
- โฟกัสที่ integration patterns ไม่ใช่แค่ API reference
```

**2. Official Documentation:**
- ใช้ WebFetch สำหรับ official docs ที่ไม่อยู่ใน Context7
- ตรวจสอบ "ecosystem" หรือ "community" pages
- มองหา "awesome-{technology}" lists
- ตรวจสอบ GitHub trending/stars สำหรับ domain

**3. WebSearch สำหรับ Ecosystem Discovery:**
```
Ecosystem discovery queries (ใช้ {current_year}):
- "[technology] best practices {current_year}"
- "[technology] recommended libraries {current_year}"
- "[technology] common mistakes"
- "[technology] vs [alternative] {current_year}"
- "how to build [type of thing] with [technology]"
- "[technology] performance optimization"
- "[technology] project structure"

สำหรับ niche domains:
- "[technology] tutorials {current_year}"
- "[technology] examples github"
- "[technology] showcase"
```

**4. Cross-Verification (บังคับ):**
ทุก WebSearch finding ต้องได้รับการ verify:
- ตรวจสอบ Context7 หรือ official docs เพื่อยืนยัน
- ทำเครื่องหมาย confidence level (HIGH หาก verified, MEDIUM หาก partially verified, LOW หาก WebSearch only)
- Flag contradictions ระหว่าง sources

</research_protocol>

<research_execution>
Execute research queries และ document findings ระหว่างทาง:

**Core Technology Findings:**
- Current version: [จาก Context7]
- Key changes since [Claude's training]: [จาก docs/WebSearch]
- Setup approach: [verified pattern]

**Ecosystem Stack:**
- [Library 1]: [what it does, why it's standard, version]
- [Library 2]: [what it does, why it's standard, version]
- [Library 3]: [what it does, why it's standard, version]

**Architecture Patterns:**
- [Pattern 1]: [what it is, when to use]
- [Pattern 2]: [what it is, when to use]
- Project structure: [recommended organization]

**Common Pitfalls:**
- [Pitfall 1]: [what goes wrong, how to avoid]
- [Pitfall 2]: [what goes wrong, how to avoid]
- [Pitfall 3]: [what goes wrong, how to avoid]

**Don't Hand-Roll:**
- [Problem]: ใช้ [library] แทนเพราะ [reason]
- [Problem]: ใช้ [library] แทนเพราะ [reason]

**SOTA Updates:**
- [Old approach]: Now superseded by [new approach]
- [New tool]: [what it enables]
</research_execution>

</step>

<step name="quality_check">
ก่อนสร้าง RESEARCH.md run through research-pitfalls.md checklist:

**จาก ~/.claude/get-shit-done/references/research-pitfalls.md:**

- [ ] ทุก enumerated items investigated (ไม่ใช่แค่บางอัน)
- [ ] Negative claims verified กับ official docs
- [ ] Multiple sources cross-referenced สำหรับ critical claims
- [ ] URLs provided สำหรับ authoritative sources
- [ ] Publication dates checked (prefer recent/current)
- [ ] Tool/environment-specific variations documented
- [ ] Confidence levels assigned honestly
- [ ] Assumptions distinguished จาก verified facts
- [ ] "What might I have missed?" review completed

**เพิ่มเติมสำหรับ ecosystem research:**
- [ ] ตรวจสอบ libraries ที่ Claude อาจไม่รู้
- [ ] Verified version numbers เป็น current
- [ ] Confirmed patterns ยังคง recommended (ไม่ deprecated)
- [ ] มองหา "don't do this" warnings ใน docs
- [ ] ตรวจสอบ breaking changes ใน recent versions
</step>

<step name="write_research">
สร้าง RESEARCH.md โดยใช้ accumulated findings

**File location:** `.planning/phases/${PHASE}-${SLUG}/${PHASE}-RESEARCH.md`

**หาก phase directory ไม่มี:**
สร้างมัน: `.planning/phases/${PHASE}-${SLUG}/`

ใช้ template จาก ~/.claude/get-shit-done/templates/research.md

กรอก sections ด้วย verified findings จาก research execution

**Critical content requirements:**

**1. Standard Stack section:**
- List specific libraries พร้อม versions
- อธิบายแต่ละอันทำอะไรและทำไมถึงเป็น standard
- Note alternatives ใดๆ และเมื่อใดที่ใช้

**2. Architecture Patterns section:**
- Document recommended patterns พร้อม code examples หากมี
- Include project structure recommendations
- Note patterns อะไรที่ต้องหลีกเลี่ยง

**3. Don't Hand-Roll section:**
- Be explicit ว่าปัญหาอะไรมี existing solutions
- อธิบายทำไม custom solutions แย่กว่า
- List libraries ที่ใช้แทน

**4. Common Pitfalls section:**
- Specific mistakes พร้อม explanations
- วิธีหลีกเลี่ยงแต่ละอัน
- Warning signs ที่ต้องระวัง

**5. Code Examples section:**
- Include verified code patterns จาก Context7/official docs
- แสดง "right way" ในการทำ common operations
- Note gotchas ใดๆ ใน examples

เขียนไฟล์
</step>

<step name="confirm_creation">
แสดงสรุป RESEARCH.md ให้ผู้ใช้:

```
Created: .planning/phases/${PHASE}-${SLUG}/${PHASE}-RESEARCH.md

## Research Summary

**Domain:** [อะไรที่ researched]

**Standard Stack:**
- [Library 1] - [brief what/why]
- [Library 2] - [brief what/why]
- [Library 3] - [brief what/why]

**Key Patterns:**
- [Pattern 1]
- [Pattern 2]

**Don't Hand-Roll:**
- [Thing 1] - ใช้ [library] แทน
- [Thing 2] - ใช้ [library] แทน

**Top Pitfalls:**
- [Pitfall 1]
- [Pitfall 2]

**Confidence:** [HIGH/MEDIUM/LOW] - [brief reason]

What's next?
1. Plan this phase (/gsd:plan-phase ${PHASE}) - RESEARCH.md จะถูกโหลดอัตโนมัติ
2. Dig deeper - Research specific areas more thoroughly
3. Review full RESEARCH.md
4. Done for now
```
</step>

<step name="git_commit">
Commit phase research:

```bash
git add .planning/phases/${PHASE}-${SLUG}/${PHASE}-RESEARCH.md
git commit -m "$(cat <<'EOF'
docs(${PHASE}): complete phase research

Phase ${PHASE}: ${PHASE_NAME}
- Standard stack identified
- Architecture patterns documented
- Common pitfalls catalogued
EOF
)"
```

ยืนยัน: "Committed: docs(${PHASE}): complete phase research"
</step>

</process>

<success_criteria>
- [ ] Phase validated กับ roadmap
- [ ] Research domains ระบุจาก phase description
- [ ] Context7 consulted สำหรับทุก relevant libraries
- [ ] Official docs consulted ที่ Context7 ไม่ครอบคลุม
- [ ] WebSearch ใช้สำหรับ ecosystem discovery
- [ ] ทุก WebSearch findings cross-verified
- [ ] Quality checklist completed
- [ ] RESEARCH.md สร้างพร้อม comprehensive ecosystem knowledge
- [ ] Standard stack documented พร้อม versions
- [ ] Architecture patterns documented
- [ ] "Don't hand-roll" list ชัดเจนและ actionable
- [ ] Common pitfalls catalogued
- [ ] Confidence levels assigned honestly
- [ ] RESEARCH.md committed ไป git
- [ ] ผู้ใช้รู้ขั้นตอนถัดไป (plan phase)
</success_criteria>

<integration_with_planning>
เมื่อ /gsd:plan-phase รันหลัง research:

1. plan-phase detects RESEARCH.md มีอยู่ใน phase directory
2. RESEARCH.md โหลดเป็น @context reference
3. "Standard stack" ให้ข้อมูล library choices ใน tasks
4. "Don't hand-roll" ป้องกัน custom solutions ที่มี libraries
5. "Common pitfalls" ให้ข้อมูล verification criteria
6. "Architecture patterns" ให้ข้อมูล task structure
7. "Code examples" สามารถ reference ใน task actions

นี่สร้าง plans คุณภาพสูงกว่าเพราะ Claude รู้:
- Tools อะไรที่ experts ใช้
- Patterns อะไรที่ต้องทำตาม
- Mistakes อะไรที่ต้องหลีกเลี่ยง
- อะไรที่ไม่ควรสร้างจาก scratch
</integration_with_planning>
