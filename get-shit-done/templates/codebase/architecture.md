# เทมเพลต Architecture

เทมเพลตสำหรับ `.planning/codebase/ARCHITECTURE.md` - บันทึกการจัดระเบียบโค้ดเชิงแนวคิด

**วัตถุประสงค์:** บันทึกว่าโค้ดถูกจัดระเบียบอย่างไรในระดับแนวคิด เสริม STRUCTURE.md (ซึ่งแสดงตำแหน่งไฟล์ทางกายภาพ)

---

## เทมเพลตไฟล์

```markdown
# Architecture

**วันที่วิเคราะห์:** [YYYY-MM-DD]

## ภาพรวม Pattern

**โดยรวม:** [ชื่อ Pattern: เช่น "Monolithic CLI", "Serverless API", "Full-stack MVC"]

**ลักษณะสำคัญ:**
- [ลักษณะ 1: เช่น "Single executable"]
- [ลักษณะ 2: เช่น "Stateless request handling"]
- [ลักษณะ 3: เช่น "Event-driven"]

## Layers

[อธิบาย conceptual layers และความรับผิดชอบ]

**[ชื่อ Layer]:**
- วัตถุประสงค์: [layer นี้ทำอะไร]
- ประกอบด้วย: [ประเภทโค้ด: เช่น "route handlers", "business logic"]
- ขึ้นอยู่กับ: [ใช้อะไร: เช่น "data layer only"]
- ใช้โดย: [อะไรใช้มัน: เช่น "API routes"]

**[ชื่อ Layer]:**
- วัตถุประสงค์: [layer นี้ทำอะไร]
- ประกอบด้วย: [ประเภทโค้ด]
- ขึ้นอยู่กับ: [ใช้อะไร]
- ใช้โดย: [อะไรใช้มัน]

## Data Flow

[อธิบาย typical request/execution lifecycle]

**[ชื่อ Flow] (เช่น "HTTP Request", "CLI Command", "Event Processing"):**

1. [Entry point: เช่น "User runs command"]
2. [Processing step: เช่น "Router matches path"]
3. [Processing step: เช่น "Controller validates input"]
4. [Processing step: เช่น "Service executes logic"]
5. [Output: เช่น "Response returned"]

**State Management:**
- [จัดการ state อย่างไร: เช่น "Stateless - no persistent state", "Database per request", "In-memory cache"]

## Key Abstractions

[Core concepts/patterns ที่ใช้ทั่ว codebase]

**[ชื่อ Abstraction]:**
- วัตถุประสงค์: [แทนอะไร]
- ตัวอย่าง: [เช่น "UserService, ProjectService"]
- Pattern: [เช่น "Singleton", "Factory", "Repository"]

**[ชื่อ Abstraction]:**
- วัตถุประสงค์: [แทนอะไร]
- ตัวอย่าง: [ตัวอย่างจริง]
- Pattern: [Pattern ที่ใช้]

## Entry Points

[ที่ที่ execution เริ่ม]

**[Entry Point]:**
- ตำแหน่ง: [สั้น: เช่น "src/index.ts", "API Gateway triggers"]
- Triggers: [อะไร invoke มัน: เช่น "CLI invocation", "HTTP request"]
- ความรับผิดชอบ: [ทำอะไร: เช่น "Parse args, route to command"]

## Error Handling

**กลยุทธ์:** [จัดการ errors อย่างไร: เช่น "Exception bubbling to top-level handler", "Per-route error middleware"]

**Patterns:**
- [Pattern: เช่น "try/catch at controller level"]
- [Pattern: เช่น "Error codes returned to user"]

## Cross-Cutting Concerns

[Aspects ที่ส่งผลต่อหลาย layers]

**Logging:**
- [แนวทาง: เช่น "Winston logger, injected per-request"]

**Validation:**
- [แนวทาง: เช่น "Zod schemas at API boundary"]

**Authentication:**
- [แนวทาง: เช่น "JWT middleware on protected routes"]

---

*Architecture analysis: [วันที่]*
*อัปเดตเมื่อ major patterns เปลี่ยน*
```

<good_examples>
```markdown
# Architecture

**วันที่วิเคราะห์:** 2025-01-20

## ภาพรวม Pattern

**โดยรวม:** CLI Application พร้อม Plugin System

**ลักษณะสำคัญ:**
- Single executable พร้อม subcommands
- Plugin-based extensibility
- File-based state (ไม่มี database)
- Synchronous execution model

## Layers

**Command Layer:**
- วัตถุประสงค์: Parse user input และ route ไปยัง handler ที่เหมาะสม
- ประกอบด้วย: Command definitions, argument parsing, help text
- ตำแหน่ง: `src/commands/*.ts`
- ขึ้นอยู่กับ: Service layer สำหรับ business logic
- ใช้โดย: CLI entry point (`src/index.ts`)

**Service Layer:**
- วัตถุประสงค์: Core business logic
- ประกอบด้วย: FileService, TemplateService, InstallService
- ตำแหน่ง: `src/services/*.ts`
- ขึ้นอยู่กับ: File system utilities, external tools
- ใช้โดย: Command handlers

**Utility Layer:**
- วัตถุประสงค์: Shared helpers และ abstractions
- ประกอบด้วย: File I/O wrappers, path resolution, string formatting
- ตำแหน่ง: `src/utils/*.ts`
- ขึ้นอยู่กับ: Node.js built-ins only
- ใช้โดย: Service layer

## Data Flow

**CLI Command Execution:**

1. ผู้ใช้รัน: `gsd new-project`
2. Commander parses args และ flags
3. Command handler invoked (`src/commands/new-project.ts`)
4. Handler เรียก service methods (`src/services/project.ts` → `create()`)
5. Service อ่าน templates, process files, เขียน output
6. Results logged ไปยัง console
7. Process exits พร้อม status code

**State Management:**
- File-based: state ทั้งหมดอยู่ใน `.planning/` directory
- ไม่มี persistent in-memory state
- แต่ละ command execution เป็นอิสระ

## Key Abstractions

**Service:**
- วัตถุประสงค์: Encapsulate business logic สำหรับ domain
- ตัวอย่าง: `src/services/file.ts`, `src/services/template.ts`, `src/services/project.ts`
- Pattern: Singleton-like (imported เป็น modules ไม่ได้ instantiated)

**Command:**
- วัตถุประสงค์: CLI command definition
- ตัวอย่าง: `src/commands/new-project.ts`, `src/commands/plan-phase.ts`
- Pattern: Commander.js command registration

**Template:**
- วัตถุประสงค์: Reusable document structures
- ตัวอย่าง: PROJECT.md, PLAN.md templates
- Pattern: Markdown files พร้อม substitution variables

## Entry Points

**CLI Entry:**
- ตำแหน่ง: `src/index.ts`
- Triggers: User รัน `gsd <command>`
- ความรับผิดชอบ: Register commands, parse args, display help

**Commands:**
- ตำแหน่ง: `src/commands/*.ts`
- Triggers: Matched command จาก CLI
- ความรับผิดชอบ: Validate input, call services, format output

## Error Handling

**กลยุทธ์:** Throw exceptions, catch ที่ command level, log และ exit

**Patterns:**
- Services throw Error พร้อม descriptive messages
- Command handlers catch, log error ไปยัง stderr, exit(1)
- Validation errors แสดงก่อน execution (fail fast)

## Cross-Cutting Concerns

**Logging:**
- Console.log สำหรับ normal output
- Console.error สำหรับ errors
- Chalk สำหรับ colored output

**Validation:**
- Zod schemas สำหรับ config file parsing
- Manual validation ใน command handlers
- Fail fast เมื่อ input ไม่ถูกต้อง

**File Operations:**
- FileService abstraction over fs-extra
- ทุก paths validated ก่อน operations
- Atomic writes (temp file + rename)

---

*Architecture analysis: 2025-01-20*
*อัปเดตเมื่อ major patterns เปลี่ยน*
```
</good_examples>

<guidelines>
**อะไรควรอยู่ใน ARCHITECTURE.md:**
- Overall architectural pattern (monolith, microservices, layered, เป็นต้น)
- Conceptual layers และความสัมพันธ์
- Data flow / request lifecycle
- Key abstractions และ patterns
- Entry points
- Error handling strategy
- Cross-cutting concerns (logging, auth, validation)

**อะไรไม่ควรอยู่ที่นี่:**
- Exhaustive file listings (นั่นคือ STRUCTURE.md)
- Technology choices (นั่นคือ STACK.md)
- Line-by-line code walkthrough (defer ไปอ่านโค้ด)
- Implementation details ของ features เฉพาะ

**File paths ยินดีต้อนรับ:**
รวม file paths เป็นตัวอย่างจริงของ abstractions ใช้ backtick formatting: `src/services/user.ts` สิ่งนี้ทำให้ architecture document actionable สำหรับ Claude เมื่อวางแผน

**เมื่อกรอกเทมเพลตนี้:**
- อ่าน main entry points (index, server, main)
- ระบุ layers โดยอ่าน imports/dependencies
- Trace typical request/command execution
- Note recurring patterns (services, controllers, repositories)
- รักษา descriptions เป็น conceptual ไม่ใช่ mechanical

**มีประโยชน์สำหรับ phase planning เมื่อ:**
- เพิ่ม features ใหม่ (มันอยู่ที่ไหนใน layers?)
- Refactoring (เข้าใจ current patterns)
- ระบุที่จะเพิ่มโค้ด (layer ไหนจัดการ X?)
- เข้าใจ dependencies ระหว่าง components
</guidelines>
