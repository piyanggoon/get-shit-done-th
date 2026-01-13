# เทมเพลต Coding Conventions

เทมเพลตสำหรับ `.planning/codebase/CONVENTIONS.md` - บันทึก coding style และ patterns

**วัตถุประสงค์:** บันทึกว่าโค้ดเขียนอย่างไรใน codebase นี้ Prescriptive guide สำหรับ Claude ให้ตรงกับ style ที่มีอยู่

---

## เทมเพลตไฟล์

```markdown
# Coding Conventions

**วันที่วิเคราะห์:** [YYYY-MM-DD]

## Naming Patterns

**Files:**
- [Pattern: เช่น "kebab-case สำหรับทุกไฟล์"]
- [Test files: เช่น "*.test.ts ข้างๆ source"]
- [Components: เช่น "PascalCase.tsx สำหรับ React components"]

**Functions:**
- [Pattern: เช่น "camelCase สำหรับทุก functions"]
- [Async: เช่น "ไม่มี special prefix สำหรับ async functions"]
- [Handlers: เช่น "handleEventName สำหรับ event handlers"]

**Variables:**
- [Pattern: เช่น "camelCase สำหรับ variables"]
- [Constants: เช่น "UPPER_SNAKE_CASE สำหรับ constants"]
- [Private: เช่น "_prefix สำหรับ private members" หรือ "no prefix"]

**Types:**
- [Interfaces: เช่น "PascalCase, ไม่มี I prefix"]
- [Types: เช่น "PascalCase สำหรับ type aliases"]
- [Enums: เช่น "PascalCase สำหรับ enum name, UPPER_CASE สำหรับ values"]

## Code Style

**Formatting:**
- [Tool: เช่น "Prettier พร้อม config ใน .prettierrc"]
- [Line length: เช่น "100 characters max"]
- [Quotes: เช่น "single quotes สำหรับ strings"]
- [Semicolons: เช่น "required" หรือ "omitted"]

**Linting:**
- [Tool: เช่น "ESLint พร้อม eslint.config.js"]
- [Rules: เช่น "extends airbnb-base, no console in production"]
- [Run: เช่น "npm run lint"]

## Import Organization

**ลำดับ:**
1. [เช่น "External packages (react, express, etc.)"]
2. [เช่น "Internal modules (@/lib, @/components)"]
3. [เช่น "Relative imports (., ..)"]
4. [เช่น "Type imports (import type {})"]

**Grouping:**
- [Blank lines: เช่น "blank line ระหว่าง groups"]
- [Sorting: เช่น "alphabetical ภายในแต่ละ group"]

**Path Aliases:**
- [Aliases ที่ใช้: เช่น "@/ สำหรับ src/, @components/ สำหรับ src/components/"]

## Error Handling

**Patterns:**
- [Strategy: เช่น "throw errors, catch at boundaries"]
- [Custom errors: เช่น "extend Error class, ตั้งชื่อ *Error"]
- [Async: เช่น "use try/catch, no .catch() chains"]

**Error Types:**
- [เมื่อไหร่ throw: เช่น "invalid input, missing dependencies"]
- [เมื่อไหร่ return: เช่น "expected failures return Result<T, E>"]
- [Logging: เช่น "log error with context before throwing"]

## Logging

**Framework:**
- [Tool: เช่น "console.log, pino, winston"]
- [Levels: เช่น "debug, info, warn, error"]

**Patterns:**
- [Format: เช่น "structured logging with context object"]
- [When: เช่น "log state transitions, external calls"]
- [Where: เช่น "log at service boundaries, not in utils"]

## Comments

**เมื่อไหร่ Comment:**
- [เช่น "explain why, not what"]
- [เช่น "document business logic, algorithms, edge cases"]
- [เช่น "avoid obvious comments like // increment counter"]

**JSDoc/TSDoc:**
- [Usage: เช่น "required สำหรับ public APIs, optional สำหรับ internal"]
- [Format: เช่น "use @param, @returns, @throws tags"]

**TODO Comments:**
- [Pattern: เช่น "// TODO(username): description"]
- [Tracking: เช่น "link to issue number if available"]

## Function Design

**Size:**
- [เช่น "keep under 50 lines, extract helpers"]

**Parameters:**
- [เช่น "max 3 parameters, use object for more"]
- [เช่น "destructure objects in parameter list"]

**Return Values:**
- [เช่น "explicit returns, no implicit undefined"]
- [เช่น "return early for guard clauses"]

## Module Design

**Exports:**
- [เช่น "named exports preferred, default exports สำหรับ React components"]
- [เช่น "export from index.ts สำหรับ public API"]

**Barrel Files:**
- [เช่น "use index.ts to re-export public API"]
- [เช่น "avoid circular dependencies"]

---

*Convention analysis: [วันที่]*
*อัปเดตเมื่อ patterns เปลี่ยน*
```

<good_examples>
```markdown
# Coding Conventions

**วันที่วิเคราะห์:** 2025-01-20

## Naming Patterns

**Files:**
- kebab-case สำหรับทุกไฟล์ (command-handler.ts, user-service.ts)
- *.test.ts ข้างๆ source files
- index.ts สำหรับ barrel exports

**Functions:**
- camelCase สำหรับทุก functions
- ไม่มี special prefix สำหรับ async functions
- handleEventName สำหรับ event handlers (handleClick, handleSubmit)

**Variables:**
- camelCase สำหรับ variables
- UPPER_SNAKE_CASE สำหรับ constants (MAX_RETRIES, API_BASE_URL)
- ไม่มี underscore prefix (ไม่มี private marker ใน TS)

**Types:**
- PascalCase สำหรับ interfaces ไม่มี I prefix (User, ไม่ใช่ IUser)
- PascalCase สำหรับ type aliases (UserConfig, ResponseData)
- PascalCase สำหรับ enum names, UPPER_CASE สำหรับ values (Status.PENDING)

## Code Style

**Formatting:**
- Prettier พร้อม .prettierrc
- 100 character line length
- Single quotes สำหรับ strings
- Semicolons required
- 2 space indentation

**Linting:**
- ESLint พร้อม eslint.config.js
- Extends @typescript-eslint/recommended
- ไม่มี console.log ใน production code (ใช้ logger)
- Run: npm run lint

## Import Organization

**ลำดับ:**
1. External packages (react, express, commander)
2. Internal modules (@/lib, @/services)
3. Relative imports (./utils, ../types)
4. Type imports (import type { User })

**Grouping:**
- Blank line ระหว่าง groups
- Alphabetical ภายในแต่ละ group
- Type imports สุดท้ายภายในแต่ละ group

**Path Aliases:**
- @/ maps ไปยัง src/
- ไม่มี aliases อื่น defined

## Error Handling

**Patterns:**
- Throw errors, catch at boundaries (route handlers, main functions)
- Extend Error class สำหรับ custom errors (ValidationError, NotFoundError)
- Async functions ใช้ try/catch ไม่ใช่ .catch() chains

**Error Types:**
- Throw เมื่อ invalid input, missing dependencies, invariant violations
- Log error พร้อม context ก่อน throwing: logger.error({ err, userId }, 'Failed to process')
- รวม cause ใน error message: new Error('Failed to X', { cause: originalError })

## Logging

**Framework:**
- pino logger instance exported จาก lib/logger.ts
- Levels: debug, info, warn, error (ไม่มี trace)

**Patterns:**
- Structured logging พร้อม context: logger.info({ userId, action }, 'User action')
- Log at service boundaries ไม่ใช่ใน utility functions
- Log state transitions, external API calls, errors
- ไม่มี console.log ใน committed code

## Comments

**เมื่อไหร่ Comment:**
- Explain why, not what: // Retry 3 times เพราะ API มี transient failures
- Document business rules: // Users ต้อง verify email ภายใน 24 ชั่วโมง
- Explain non-obvious algorithms หรือ workarounds
- หลีกเลี่ยง obvious comments: // set count to 0

**JSDoc/TSDoc:**
- Required สำหรับ public API functions
- Optional สำหรับ internal functions ถ้า signature self-explanatory
- ใช้ @param, @returns, @throws tags

**TODO Comments:**
- Format: // TODO: description (ไม่มี username ใช้ git blame)
- Link to issue ถ้ามี: // TODO: Fix race condition (issue #123)

## Function Design

**Size:**
- รักษาให้ต่ำกว่า 50 บรรทัด
- Extract helpers สำหรับ complex logic
- หนึ่ง level of abstraction ต่อ function

**Parameters:**
- Max 3 parameters
- ใช้ options object สำหรับ 4+ parameters: function create(options: CreateOptions)
- Destructure ใน parameter list: function process({ id, name }: ProcessParams)

**Return Values:**
- Explicit return statements
- Return early สำหรับ guard clauses
- ใช้ Result<T, E> type สำหรับ expected failures

## Module Design

**Exports:**
- Named exports preferred
- Default exports สำหรับ React components เท่านั้น
- Export public API จาก index.ts barrel files

**Barrel Files:**
- index.ts re-exports public API
- รักษา internal helpers private (don't export from index)
- หลีกเลี่ยง circular dependencies (import จาก specific files ถ้าต้องการ)

---

*Convention analysis: 2025-01-20*
*อัปเดตเมื่อ patterns เปลี่ยน*
```
</good_examples>

<guidelines>
**อะไรควรอยู่ใน CONVENTIONS.md:**
- Naming patterns ที่สังเกตได้ใน codebase
- Formatting rules (Prettier config, linting rules)
- Import organization patterns
- Error handling strategy
- Logging approach
- Comment conventions
- Function และ module design patterns

**อะไรไม่ควรอยู่ที่นี่:**
- Architecture decisions (นั่นคือ ARCHITECTURE.md)
- Technology choices (นั่นคือ STACK.md)
- Test patterns (นั่นคือ TESTING.md)
- File organization (นั่นคือ STRUCTURE.md)

**เมื่อกรอกเทมเพลตนี้:**
- ตรวจสอบ .prettierrc, .eslintrc หรือ similar config files
- ตรวจสอบ 5-10 representative source files สำหรับ patterns
- มองหา consistency: ถ้า 80%+ ทำตาม pattern ให้ document มัน
- Be prescriptive: "Use X" ไม่ใช่ "Sometimes Y is used"
- Note deviations: "Legacy code uses Y, new code should use X"
- รักษาให้ต่ำกว่า ~150 บรรทัดทั้งหมด

**มีประโยชน์สำหรับ phase planning เมื่อ:**
- เขียนโค้ดใหม่ (match existing style)
- เพิ่ม features (follow naming patterns)
- Refactoring (apply consistent conventions)
- Code review (check against documented patterns)
- Onboarding (understand style expectations)

**แนวทาง Analysis:**
- Scan src/ directory สำหรับ file naming patterns
- ตรวจสอบ package.json scripts สำหรับ lint/format commands
- อ่าน 5-10 files เพื่อระบุ function naming, error handling
- มองหา config files (.prettierrc, eslint.config.js)
- Note patterns ใน imports, comments, function signatures
</guidelines>
