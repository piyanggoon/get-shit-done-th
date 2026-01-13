# เทมเพลต Technology Stack

เทมเพลตสำหรับ `.planning/codebase/STACK.md` - บันทึก technology foundation

**วัตถุประสงค์:** บันทึก technologies อะไรรัน codebase นี้ เน้นที่ "อะไร execute เมื่อคุณรันโค้ด"

---

## เทมเพลตไฟล์

```markdown
# Technology Stack

**วันที่วิเคราะห์:** [YYYY-MM-DD]

## Languages

**หลัก:**
- [Language] [Version] - [ใช้ที่ไหน: เช่น "ทุก application code"]

**รอง:**
- [Language] [Version] - [ใช้ที่ไหน: เช่น "build scripts, tooling"]

## Runtime

**Environment:**
- [Runtime] [Version] - [เช่น "Node.js 20.x"]
- [Additional requirements ถ้ามี]

**Package Manager:**
- [Manager] [Version] - [เช่น "npm 10.x"]
- Lockfile: [เช่น "package-lock.json present"]

## Frameworks

**Core:**
- [Framework] [Version] - [วัตถุประสงค์: เช่น "web server", "UI framework"]

**Testing:**
- [Framework] [Version] - [เช่น "Jest สำหรับ unit tests"]
- [Framework] [Version] - [เช่น "Playwright สำหรับ E2E"]

**Build/Dev:**
- [Tool] [Version] - [เช่น "Vite สำหรับ bundling"]
- [Tool] [Version] - [เช่น "TypeScript compiler"]

## Key Dependencies

[รวมแค่ dependencies ที่สำคัญสำหรับการเข้าใจ stack - จำกัดไว้ 5-10 ที่สำคัญที่สุด]

**Critical:**
- [Package] [Version] - [ทำไมสำคัญ: เช่น "authentication", "database access"]
- [Package] [Version] - [ทำไมสำคัญ]

**Infrastructure:**
- [Package] [Version] - [เช่น "Express สำหรับ HTTP routing"]
- [Package] [Version] - [เช่น "PostgreSQL client"]

## Configuration

**Environment:**
- [Configured อย่างไร: เช่น ".env files", "environment variables"]
- [Key configs: เช่น "DATABASE_URL, API_KEY required"]

**Build:**
- [Build config files: เช่น "vite.config.ts, tsconfig.json"]

## Platform Requirements

**Development:**
- [OS requirements หรือ "any platform"]
- [Additional tooling: เช่น "Docker สำหรับ local DB"]

**Production:**
- [Deployment target: เช่น "Vercel", "AWS Lambda", "Docker container"]
- [Version requirements]

---

*Stack analysis: [วันที่]*
*อัปเดตหลังจาก major dependency changes*
```

<good_examples>
```markdown
# Technology Stack

**วันที่วิเคราะห์:** 2025-01-20

## Languages

**หลัก:**
- TypeScript 5.3 - ทุก application code

**รอง:**
- JavaScript - Build scripts, config files

## Runtime

**Environment:**
- Node.js 20.x (LTS)
- ไม่มี browser runtime (CLI tool only)

**Package Manager:**
- npm 10.x
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- ไม่มี (vanilla Node.js CLI)

**Testing:**
- Vitest 1.0 - Unit tests
- tsx - TypeScript execution โดยไม่ต้อง build step

**Build/Dev:**
- TypeScript 5.3 - Compilation ไปยัง JavaScript
- esbuild - ใช้โดย Vitest สำหรับ fast transforms

## Key Dependencies

**Critical:**
- commander 11.x - CLI argument parsing และ command structure
- chalk 5.x - Terminal output styling
- fs-extra 11.x - Extended file system operations

**Infrastructure:**
- Node.js built-ins - fs, path, child_process สำหรับ file operations

## Configuration

**Environment:**
- ไม่ต้องการ environment variables
- Configuration via CLI flags only

**Build:**
- `tsconfig.json` - TypeScript compiler options
- `vitest.config.ts` - Test runner configuration

## Platform Requirements

**Development:**
- macOS/Linux/Windows (any platform ที่มี Node.js)
- ไม่มี external dependencies

**Production:**
- Distributed เป็น npm package
- Installed globally via npm install -g
- รันบน user's Node.js installation

---

*Stack analysis: 2025-01-20*
*อัปเดตหลังจาก major dependency changes*
```
</good_examples>

<guidelines>
**อะไรควรอยู่ใน STACK.md:**
- Languages และ versions
- Runtime requirements (Node, Bun, Deno, browser)
- Package manager และ lockfile
- Framework choices
- Critical dependencies (จำกัดไว้ 5-10 ที่สำคัญที่สุด)
- Build tooling
- Platform/deployment requirements

**อะไรไม่ควรอยู่ที่นี่:**
- File structure (นั่นคือ STRUCTURE.md)
- Architectural patterns (นั่นคือ ARCHITECTURE.md)
- ทุก dependency ใน package.json (แค่ critical ones)
- Implementation details (defer ไปอ่านโค้ด)

**เมื่อกรอกเทมเพลตนี้:**
- ตรวจสอบ package.json สำหรับ dependencies
- Note runtime version จาก .nvmrc หรือ package.json engines
- รวมแค่ dependencies ที่ส่งผลต่อความเข้าใจ (ไม่ใช่ทุก utility)
- ระบุ versions เมื่อ version สำคัญ (breaking changes, compatibility)

**มีประโยชน์สำหรับ phase planning เมื่อ:**
- เพิ่ม dependencies ใหม่ (check compatibility)
- Upgrading frameworks (รู้ว่าอะไรใช้อยู่)
- เลือก implementation approach (ต้องทำงานกับ existing stack)
- เข้าใจ build requirements
</guidelines>
