<purpose>
Orchestrate parallel Explore agents เพื่อวิเคราะห์ codebase และสร้างเอกสารที่มีโครงสร้างใน .planning/codebase/

แต่ละ agent มี fresh context และโฟกัสที่ด้านเฉพาะ Output กระชับและ actionable สำหรับ planning
</purpose>

<philosophy>
**ทำไมต้อง parallel agents:**
- Fresh context ต่อ domain (ไม่มี token contamination)
- การวิเคราะห์ละเอียดโดยไม่หมด context
- แต่ละ agent optimized สำหรับ domain ของมัน (tech vs organization vs quality vs issues)
- Execution เร็วกว่า (agents run พร้อมกัน)

**Document quality over length:**
Include รายละเอียดเพียงพอที่จะมีประโยชน์เป็น reference ให้ความสำคัญกับตัวอย่างจริง (โดยเฉพาะ code patterns) มากกว่าความสั้นโดยพลการ TESTING.md 200 บรรทัดที่มี real patterns มีค่ามากกว่าสรุป 74 บรรทัด

**ใส่ file paths เสมอ:**
Documents เป็น reference material สำหรับ Claude เมื่อ planning/executing คำอธิบายคลุมเครือเช่น "UserService handles users" ไม่ actionable ใส่ actual file paths ที่ format ด้วย backticks เสมอ: `src/services/user.ts` นี่ช่วยให้ Claude navigate ไปที่ relevant code ได้โดยตรงโดยไม่ต้อง re-search อย่าใส่ line numbers (เก่าเร็ว) แค่ file paths
</philosophy>

<process>

<step name="check_existing" priority="first">
ตรวจสอบว่า .planning/codebase/ มีอยู่แล้วหรือไม่:

```bash
ls -la .planning/codebase/ 2>/dev/null
```

**หากมี:**

```
.planning/codebase/ มีอยู่แล้วพร้อมเอกสารเหล่านี้:
[List files found]

What's next?
1. Refresh - ลบที่มีและ remap codebase
2. Update - เก็บที่มี อัปเดตเฉพาะเอกสารบางตัว
3. Skip - ใช้ codebase map ที่มีตามที่เป็น
```

รอการตอบจากผู้ใช้

หาก "Refresh": ลบ .planning/codebase/ ดำเนินการไป create_structure
หาก "Update": ถามว่าจะอัปเดตเอกสารไหน ดำเนินการไป spawn_agents (filtered)
หาก "Skip": ออกจาก workflow

**หากไม่มี:**
ดำเนินการไป create_structure
</step>

<step name="create_structure">
สร้าง .planning/codebase/ directory:

```bash
mkdir -p .planning/codebase
```

**Expected output files:**
- STACK.md (จาก stack.md template)
- ARCHITECTURE.md (จาก architecture.md template)
- STRUCTURE.md (จาก structure.md template)
- CONVENTIONS.md (จาก conventions.md template)
- TESTING.md (จาก testing.md template)
- INTEGRATIONS.md (จาก integrations.md template)
- CONCERNS.md (จาก concerns.md template)

ดำเนินการไป spawn_agents
</step>

<step name="spawn_agents">
Spawn 4 parallel Explore agents เพื่อวิเคราะห์ codebase

ใช้ Task tool ด้วย `subagent_type="Explore"` และ `run_in_background=true` สำหรับ parallel execution

**Agent 1: Stack + Integrations (Technology Focus)**

Task tool parameters:
```
subagent_type: "Explore"
run_in_background: true
task_description: "Analyze codebase technology stack and external integrations"
```

Prompt:
```
Analyze this codebase for technology stack and external integrations.

IMPORTANT: ใส่ actual file paths ใน findings ของคุณเสมอ ใช้ backtick formatting เช่น `src/config/database.ts` นี่ทำให้ output actionable สำหรับ planning

Focus areas:
1. Languages (check file extensions, package manifests)
2. Runtime environment (Node.js, Python, etc. - check .nvmrc, .python-version, engines field)
3. Package manager และ lockfiles
4. Frameworks (web, testing, build tools)
5. Key dependencies (critical packages for functionality)
6. External services (APIs, databases, auth providers)
7. Third-party integrations (payment, analytics, etc.)
8. Configuration approach (.env, config files)

Search for:
- package.json / requirements.txt / Cargo.toml / go.mod
- .env files, .env.example
- Config files (vite.config, webpack.config, tsconfig.json)
- API client code, database connection code
- Import statements for major libraries

Output findings สำหรับ populate sections เหล่านี้:
- STACK.md: Languages, Runtime, Frameworks, Dependencies, Configuration
- INTEGRATIONS.md: External APIs, Services, Third-party tools

For each finding, include the file path where you found it. Example:
- "TypeScript 5.3 - `package.json`"
- "Supabase client - `src/lib/supabase.ts`"
- "Stripe integration - `src/services/stripe.ts`, `src/webhooks/stripe.ts`"

If something is not found, note "Not detected" for that category.
```

**Agent 2: Architecture + Structure (Organization Focus)**

Task tool parameters:
```
subagent_type: "Explore"
run_in_background: true
task_description: "Analyze codebase architecture patterns and directory structure"
```

Prompt:
```
Analyze this codebase architecture and directory structure.

IMPORTANT: ใส่ actual file paths ใน findings ของคุณเสมอ ใช้ backtick formatting เช่น `src/index.ts` นี่ทำให้ output actionable สำหรับ planning

Focus areas:
1. Overall architectural pattern (monolith, microservices, layered, etc.)
2. Conceptual layers (API, service, data, utility)
3. Data flow และ request lifecycle
4. Key abstractions และ patterns (services, controllers, repositories)
5. Entry points (main files, server files, CLI entry)
6. Directory organization และ purposes
7. Module boundaries
8. Naming conventions สำหรับ directories และ files

Search for:
- Entry points: index.ts, main.ts, server.ts, app.ts, cli.ts
- Directory structure patterns (src/, lib/, components/, services/)
- Import patterns (what imports what)
- Recurring code patterns (base classes, interfaces, common abstractions)

Output findings สำหรับ populate sections เหล่านี้:
- ARCHITECTURE.md: Pattern, Layers, Data Flow, Abstractions, Entry Points
- STRUCTURE.md: Directory layout, Organization, Key locations

For each finding, include the file path. Examples:
- "CLI entry point: `bin/install.js`"
- "Service layer: `src/services/*.ts` (UserService, ProjectService)"
- "API routes: `src/routes/api/*.ts`"

If something is not clear, provide best-guess interpretation based on code structure.
```

**Agent 3: Conventions + Testing (Quality Focus)**

Task tool parameters:
```
subagent_type: "Explore"
run_in_background: true
task_description: "Analyze coding conventions and test patterns"
```

Prompt:
```
Analyze this codebase for coding conventions and testing practices.

IMPORTANT: ใส่ actual file paths ใน findings ของคุณเสมอ ใช้ backtick formatting เช่น `vitest.config.ts` นี่ทำให้ output actionable สำหรับ planning

Focus areas:
1. Code style (indentation, quotes, semicolons, formatting)
2. File naming conventions (kebab-case, PascalCase, etc.)
3. Function/variable naming patterns
4. Comment และ documentation style
5. Test framework และ structure
6. Test organization (unit, integration, e2e)
7. Test coverage approach
8. Linting และ formatting tools

Search for:
- Config files: .eslintrc, .prettierrc, tsconfig.json
- Test files: *.test.*, *.spec.*, __tests__/
- Test setup: vitest.config, jest.config
- Code patterns ข้ามหลาย files
- README หรือ CONTRIBUTING docs

Output findings สำหรับ populate sections เหล่านี้:
- CONVENTIONS.md: Code Style, Naming, Patterns, Documentation
- TESTING.md: Framework, Structure, Coverage, Tools

For each finding, include file paths. Examples:
- "Prettier config: `.prettierrc`"
- "Test pattern: `src/**/*.test.ts` (co-located with source)"
- "Example of naming convention: `src/services/user-service.ts`"

Look at actual code files to infer conventions if config files are missing.
```

**Agent 4: Concerns (Issues Focus)**

Task tool parameters:
```
subagent_type: "Explore"
run_in_background: true
task_description: "Identify technical debt and areas of concern"
```

Prompt:
```
Analyze this codebase for technical debt, known issues, and areas of concern.

CRITICAL: ใส่ actual file paths ใน findings ของคุณเสมอ ใช้ backtick formatting เช่น `src/auth/login.ts` Concerns ที่ไม่มี file paths ไม่ actionable สำหรับแต่ละ issue ที่พบ ระบุว่าอยู่ที่ไหนแน่นอน

Focus areas:
1. TODO และ FIXME comments
2. Complex หรือ hard-to-understand code
3. Missing error handling (try/catch, error checks)
4. Security patterns (hardcoded secrets, unsafe operations)
5. Outdated dependencies (check versions against current)
6. Missing tests สำหรับ critical code
7. Duplicate code patterns
8. Performance concerns (N+1 queries, inefficient loops)
9. Documentation gaps (complex code without comments)

Search for:
- TODO, FIXME, HACK, XXX comments
- Large functions หรือ files (>200 lines)
- Repeated code patterns
- Missing .env.example เมื่อ .env ถูกใช้
- Dependencies ที่มี known vulnerabilities (check versions)
- Error-prone patterns (no validation, no error handling)

Output findings สำหรับ populate:
- CONCERNS.md: Technical Debt, Issues, Security, Performance, Documentation

For EVERY concern, include file paths. Examples:
- "Direct DB queries in components: `src/pages/Dashboard.tsx`, `src/pages/Profile.tsx`"
- "Missing error handling: `src/api/webhook.ts` (Stripe webhook has no try/catch)"
- "TODO: 'fix race condition' in `src/services/subscription.ts`"

Be constructive - focus on actionable concerns, not nitpicks.
If codebase is clean, note that rather than inventing problems.
```

ดำเนินการไป collect_results
</step>

<step name="collect_results">
รอทุก 4 agents complete

ใช้ TaskOutput tool เพื่อรวบรวม results จากแต่ละ agent เนื่องจาก agents รันด้วย `run_in_background=true` retrieve output ของพวกมัน

**Collection pattern:**

สำหรับแต่ละ agent ใช้ TaskOutput tool เพื่อดู full exploration findings

**Aggregate findings ตาม document:**

จาก Agent 1 output ดึง:
- STACK.md sections: Languages, Runtime, Frameworks, Dependencies, Configuration, Platform
- INTEGRATIONS.md sections: External APIs, Services, Authentication, Webhooks

จาก Agent 2 output ดึง:
- ARCHITECTURE.md sections: Pattern Overview, Layers, Data Flow, Key Abstractions, Entry Points
- STRUCTURE.md sections: Directory Layout, Key Locations, Organization

จาก Agent 3 output ดึง:
- CONVENTIONS.md sections: Code Style, Naming Conventions, Common Patterns, Documentation Style
- TESTING.md sections: Framework, Structure, Coverage, Tools

จาก Agent 4 output ดึง:
- CONCERNS.md sections: Technical Debt, Known Issues, Security, Performance, Missing

**Handling missing findings:**

หาก agent ไม่พบข้อมูลสำหรับ section ใช้ placeholder:
- "Not detected" (สำหรับ infrastructure/tools ที่อาจไม่มี)
- "Not applicable" (สำหรับ patterns ที่ไม่ใช้กับ codebase นี้)
- "No significant concerns" (สำหรับ CONCERNS.md หาก codebase clean)

ดำเนินการไป write_documents
</step>

<step name="write_documents">
เขียนทุก 7 codebase documents โดยใช้ templates และ agent findings

**Template filling process:**

สำหรับแต่ละ document:

1. **อ่าน template file** จาก `~/.claude/get-shit-done/templates/codebase/{name}.md`
2. **ดึงส่วน "File Template"** - นี่คือ markdown code block ที่มีโครงสร้าง document จริง
3. **กรอก template placeholders** ด้วย agent findings:
   - แทนที่ `[YYYY-MM-DD]` ด้วยวันที่ปัจจุบัน
   - แทนที่ `[Placeholder text]` ด้วย specific findings จาก agents
   - หาก agent ไม่พบอะไรสำหรับ section ใช้ placeholder ที่เหมาะสม:
     - "Not detected" สำหรับ optional infrastructure
     - "Not applicable" สำหรับ patterns ที่ไม่เหมาะกับ codebase นี้
     - "No significant concerns" สำหรับ codebase areas ที่ clean
4. **เขียนไปยัง .planning/codebase/{NAME}.md** (uppercase filename)

**ตัวอย่าง filling pattern:**

Template placeholder:
```
**Primary:**
- [Language] [Version] - [Where used: e.g., "all application code"]
```

Agent finding:
```
Found: TypeScript 5.3 used in all .ts files throughout src/
```

Filled result:
```
**Primary:**
- TypeScript 5.3 - All application code
```

**Document writing order:**

1. **STACK.md** (จาก stack.md template + Agent 1 findings)
2. **INTEGRATIONS.md** (จาก integrations.md template + Agent 1 findings)
3. **ARCHITECTURE.md** (จาก architecture.md template + Agent 2 findings)
4. **STRUCTURE.md** (จาก structure.md template + Agent 2 findings)
5. **CONVENTIONS.md** (จาก conventions.md template + Agent 3 findings)
6. **TESTING.md** (จาก testing.md template + Agent 3 findings)
7. **CONCERNS.md** (จาก concerns.md template + Agent 4 findings)

หลังเขียนทุก documents ดำเนินการไป verify_output
</step>

<step name="verify_output">
Verify ทุก documents สร้างสำเร็จ:

```bash
ls -la .planning/codebase/
wc -l .planning/codebase/*.md
```

**Verification checklist:**
- ทุก 7 documents มี
- ไม่มี empty documents
- Templates populated ด้วย findings

หาก checks ใดล้มเหลว report issues ให้ผู้ใช้

ดำเนินการไป commit_codebase_map
</step>

<step name="commit_codebase_map">
Commit codebase map:

```bash
git add .planning/codebase/*.md
git commit -m "$(cat <<'EOF'
docs: map existing codebase

- STACK.md - Technologies and dependencies
- ARCHITECTURE.md - System design and patterns
- STRUCTURE.md - Directory layout
- CONVENTIONS.md - Code style and patterns
- TESTING.md - Test structure
- INTEGRATIONS.md - External services
- CONCERNS.md - Technical debt and issues
EOF
)"
```

ดำเนินการไป offer_next
</step>

<step name="offer_next">
แสดง completion summary และขั้นตอนถัดไป

**Output format:**

```
Codebase mapping complete.

Created .planning/codebase/:
- STACK.md ([N] lines) - Technologies and dependencies
- ARCHITECTURE.md ([N] lines) - System design and patterns
- STRUCTURE.md ([N] lines) - Directory layout and organization
- CONVENTIONS.md ([N] lines) - Code style and patterns
- TESTING.md ([N] lines) - Test structure and practices
- INTEGRATIONS.md ([N] lines) - External services and APIs
- CONCERNS.md ([N] lines) - Technical debt and issues


---

## ▶ ถัดไป

**Initialize project** — ใช้ codebase context สำหรับ planning

`/gsd:new-project`

<sub>`/clear` ก่อน → context window ใหม่</sub>

---

**ยังมีให้เลือก:**
- Re-run mapping: `/gsd:map-codebase`
- Review specific file: `cat .planning/codebase/STACK.md`
- Edit เอกสารใดๆ ก่อนดำเนินการ

---
```

จบ workflow
</step>

</process>

<success_criteria>
- .planning/codebase/ directory สร้างแล้ว
- 4 parallel Explore agents spawned ด้วย run_in_background=true
- Agent prompts specific และ actionable
- TaskOutput ใช้เพื่อรวบรวม agent results ทั้งหมด
- ทุก 7 codebase documents เขียนโดยใช้ template filling
- Documents ทำตามโครงสร้าง template ด้วย actual findings
- Completion summary ชัดเจนพร้อม line counts
- ผู้ใช้เสนอขั้นตอนถัดไปชัดเจนในสไตล์ GSD
</success_criteria>
