# เทมเพลต Testing Patterns

เทมเพลตสำหรับ `.planning/codebase/TESTING.md` - บันทึก test framework และ patterns

**วัตถุประสงค์:** บันทึกว่า tests เขียนและรันอย่างไร Guide สำหรับเพิ่ม tests ที่ตรงกับ patterns ที่มีอยู่

---

## เทมเพลตไฟล์

```markdown
# Testing Patterns

**วันที่วิเคราะห์:** [YYYY-MM-DD]

## Test Framework

**Runner:**
- [Framework: เช่น "Jest 29.x", "Vitest 1.x"]
- [Config: เช่น "jest.config.js ใน project root"]

**Assertion Library:**
- [Library: เช่น "built-in expect", "chai"]
- [Matchers: เช่น "toBe, toEqual, toThrow"]

**Run Commands:**
```bash
[เช่น "npm test" หรือ "npm run test"]              # รันทุก tests
[เช่น "npm test -- --watch"]                       # Watch mode
[เช่น "npm test -- path/to/file.test.ts"]         # Single file
[เช่น "npm run test:coverage"]                     # Coverage report
```

## Test File Organization

**ตำแหน่ง:**
- [Pattern: เช่น "*.test.ts ข้างๆ source files"]
- [Alternative: เช่น "__tests__/ directory" หรือ "separate tests/ tree"]

**การตั้งชื่อ:**
- [Unit tests: เช่น "module-name.test.ts"]
- [Integration: เช่น "feature-name.integration.test.ts"]
- [E2E: เช่น "user-flow.e2e.test.ts"]

**โครงสร้าง:**
```
[แสดง actual directory pattern เช่น:
src/
  lib/
    utils.ts
    utils.test.ts
  services/
    user-service.ts
    user-service.test.ts
]
```

## Test Structure

**Suite Organization:**
```typescript
[แสดง actual pattern ที่ใช้ เช่น:

describe('ModuleName', () => {
  describe('functionName', () => {
    it('should handle success case', () => {
      // arrange
      // act
      // assert
    });

    it('should handle error case', () => {
      // test code
    });
  });
});
]
```

**Patterns:**
- [Setup: เช่น "beforeEach สำหรับ shared setup, หลีกเลี่ยง beforeAll"]
- [Teardown: เช่น "afterEach สำหรับ clean up, restore mocks"]
- [Structure: เช่น "arrange/act/assert pattern required"]

## Mocking

**Framework:**
- [Tool: เช่น "Jest built-in mocking", "Vitest vi", "Sinon"]
- [Import mocking: เช่น "vi.mock() ที่ top ของไฟล์"]

**Patterns:**
```typescript
[แสดง actual mocking pattern เช่น:

// Mock external dependency
vi.mock('./external-service', () => ({
  fetchData: vi.fn()
}));

// Mock ใน test
const mockFetch = vi.mocked(fetchData);
mockFetch.mockResolvedValue({ data: 'test' });
]
```

**อะไรควร Mock:**
- [เช่น "External APIs, file system, database"]
- [เช่น "Time/dates (use vi.useFakeTimers)"]
- [เช่น "Network calls (use mock fetch)"]

**อะไรไม่ควร Mock:**
- [เช่น "Pure functions, utilities"]
- [เช่น "Internal business logic"]

## Fixtures and Factories

**Test Data:**
```typescript
[แสดง pattern สำหรับสร้าง test data เช่น:

// Factory pattern
function createTestUser(overrides?: Partial<User>): User {
  return {
    id: 'test-id',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides
  };
}

// Fixture file
// tests/fixtures/users.ts
export const mockUsers = [/* ... */];
]
```

**ตำแหน่ง:**
- [เช่น "tests/fixtures/ สำหรับ shared fixtures"]
- [เช่น "factory functions ใน test file หรือ tests/factories/"]

## Coverage

**Requirements:**
- [Target: เช่น "80% line coverage", "no specific target"]
- [Enforcement: เช่น "CI blocks <80%", "coverage for awareness only"]

**Configuration:**
- [Tool: เช่น "built-in coverage via --coverage flag"]
- [Exclusions: เช่น "exclude *.test.ts, config files"]

**View Coverage:**
```bash
[เช่น "npm run test:coverage"]
[เช่น "open coverage/index.html"]
```

## Test Types

**Unit Tests:**
- [Scope: เช่น "test single function/class in isolation"]
- [Mocking: เช่น "mock ทุก external dependencies"]
- [Speed: เช่น "ต้องรันใน <1s ต่อ test"]

**Integration Tests:**
- [Scope: เช่น "test หลาย modules ด้วยกัน"]
- [Mocking: เช่น "mock external services, ใช้ real internal modules"]
- [Setup: เช่น "use test database, seed data"]

**E2E Tests:**
- [Framework: เช่น "Playwright สำหรับ E2E"]
- [Scope: เช่น "test full user flows"]
- [ตำแหน่ง: เช่น "e2e/ directory แยกจาก unit tests"]

## Common Patterns

**Async Testing:**
```typescript
[แสดง pattern เช่น:

it('should handle async operation', async () => {
  const result = await asyncFunction();
  expect(result).toBe('expected');
});
]
```

**Error Testing:**
```typescript
[แสดง pattern เช่น:

it('should throw on invalid input', () => {
  expect(() => functionCall()).toThrow('error message');
});

// Async error
it('should reject on failure', async () => {
  await expect(asyncCall()).rejects.toThrow('error message');
});
]
```

**Snapshot Testing:**
- [Usage: เช่น "สำหรับ React components only" หรือ "not used"]
- [ตำแหน่ง: เช่น "__snapshots__/ directory"]

---

*Testing analysis: [วันที่]*
*อัปเดตเมื่อ test patterns เปลี่ยน*
```

<good_examples>
```markdown
# Testing Patterns

**วันที่วิเคราะห์:** 2025-01-20

## Test Framework

**Runner:**
- Vitest 1.0.4
- Config: vitest.config.ts ใน project root

**Assertion Library:**
- Vitest built-in expect
- Matchers: toBe, toEqual, toThrow, toMatchObject

**Run Commands:**
```bash
npm test                              # รันทุก tests
npm test -- --watch                   # Watch mode
npm test -- path/to/file.test.ts     # Single file
npm run test:coverage                 # Coverage report
```

## Test File Organization

**ตำแหน่ง:**
- *.test.ts ข้างๆ source files
- ไม่มี separate tests/ directory

**การตั้งชื่อ:**
- unit-name.test.ts สำหรับทุก tests
- ไม่มีการแยกระหว่าง unit/integration ใน filename

**โครงสร้าง:**
```
src/
  lib/
    parser.ts
    parser.test.ts
  services/
    install-service.ts
    install-service.test.ts
  bin/
    install.ts
    (ไม่มี test - integration tested via CLI)
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('ModuleName', () => {
  describe('functionName', () => {
    beforeEach(() => {
      // reset state
    });

    it('should handle valid input', () => {
      // arrange
      const input = createTestInput();

      // act
      const result = functionName(input);

      // assert
      expect(result).toEqual(expectedOutput);
    });

    it('should throw on invalid input', () => {
      expect(() => functionName(null)).toThrow('Invalid input');
    });
  });
});
```

**Patterns:**
- ใช้ beforeEach สำหรับ per-test setup, หลีกเลี่ยง beforeAll
- ใช้ afterEach เพื่อ restore mocks: vi.restoreAllMocks()
- Explicit arrange/act/assert comments ใน complex tests
- หนึ่ง assertion focus ต่อ test (แต่หลาย expects OK)

## Mocking

**Framework:**
- Vitest built-in mocking (vi)
- Module mocking via vi.mock() ที่ top ของ test file

**Patterns:**
```typescript
import { vi } from 'vitest';
import { externalFunction } from './external';

// Mock module
vi.mock('./external', () => ({
  externalFunction: vi.fn()
}));

describe('test suite', () => {
  it('mocks function', () => {
    const mockFn = vi.mocked(externalFunction);
    mockFn.mockReturnValue('mocked result');

    // test code ที่ใช้ mocked function

    expect(mockFn).toHaveBeenCalledWith('expected arg');
  });
});
```

**อะไรควร Mock:**
- File system operations (fs-extra)
- Child process execution (child_process.exec)
- External API calls
- Environment variables (process.env)

**อะไรไม่ควร Mock:**
- Internal pure functions
- Simple utilities (string manipulation, array helpers)
- TypeScript types

## Fixtures and Factories

**Test Data:**
```typescript
// Factory functions ใน test file
function createTestConfig(overrides?: Partial<Config>): Config {
  return {
    targetDir: '/tmp/test',
    global: false,
    ...overrides
  };
}

// Shared fixtures ใน tests/fixtures/
// tests/fixtures/sample-command.md
export const sampleCommand = `---
description: Test command
---
Content here`;
```

**ตำแหน่ง:**
- Factory functions: define ใน test file ใกล้ usage
- Shared fixtures: tests/fixtures/ (สำหรับ multi-file test data)
- Mock data: inline ใน test เมื่อง่าย, factory เมื่อซับซ้อน

## Coverage

**Requirements:**
- ไม่มี enforced coverage target
- Coverage tracked สำหรับ awareness
- เน้น critical paths (parsers, service logic)

**Configuration:**
- Vitest coverage via c8 (built-in)
- Excludes: *.test.ts, bin/install.ts, config files

**View Coverage:**
```bash
npm run test:coverage
open coverage/index.html
```

## Test Types

**Unit Tests:**
- Test single function in isolation
- Mock ทุก external dependencies (fs, child_process)
- Fast: แต่ละ test <100ms
- ตัวอย่าง: parser.test.ts, validator.test.ts

**Integration Tests:**
- Test หลาย modules ด้วยกัน
- Mock แค่ external boundaries (file system, process)
- ตัวอย่าง: install-service.test.ts (tests service + parser)

**E2E Tests:**
- ไม่ได้ใช้ปัจจุบัน
- CLI integration tested manually

## Common Patterns

**Async Testing:**
```typescript
it('should handle async operation', async () => {
  const result = await asyncFunction();
  expect(result).toBe('expected');
});
```

**Error Testing:**
```typescript
it('should throw on invalid input', () => {
  expect(() => parse(null)).toThrow('Cannot parse null');
});

// Async error
it('should reject on file not found', async () => {
  await expect(readConfig('invalid.txt')).rejects.toThrow('ENOENT');
});
```

**File System Mocking:**
```typescript
import { vi } from 'vitest';
import * as fs from 'fs-extra';

vi.mock('fs-extra');

it('mocks file system', () => {
  vi.mocked(fs.readFile).mockResolvedValue('file content');
  // test code
});
```

**Snapshot Testing:**
- ไม่ได้ใช้ใน codebase นี้
- Prefer explicit assertions สำหรับความชัดเจน

---

*Testing analysis: 2025-01-20*
*อัปเดตเมื่อ test patterns เปลี่ยน*
```
</good_examples>

<guidelines>
**อะไรควรอยู่ใน TESTING.md:**
- Test framework และ runner configuration
- Test file location และ naming patterns
- Test structure (describe/it, beforeEach patterns)
- Mocking approach และตัวอย่าง
- Fixture/factory patterns
- Coverage requirements
- วิธีรัน tests (commands)
- Common testing patterns ในโค้ดจริง

**อะไรไม่ควรอยู่ที่นี่:**
- Specific test cases (defer ไปอ่าน test files จริง)
- Technology choices (นั่นคือ STACK.md)
- CI/CD setup (นั่นคือ deployment docs)

**เมื่อกรอกเทมเพลตนี้:**
- ตรวจสอบ package.json scripts สำหรับ test commands
- หา test config file (jest.config.js, vitest.config.ts)
- อ่าน 3-5 existing test files เพื่อระบุ patterns
- มองหา test utilities ใน tests/ หรือ test-utils/
- ตรวจสอบ coverage configuration
- Document actual patterns ที่ใช้ ไม่ใช่ ideal patterns

**มีประโยชน์สำหรับ phase planning เมื่อ:**
- เพิ่ม features ใหม่ (เขียน matching tests)
- Refactoring (maintain test patterns)
- Fixing bugs (add regression tests)
- เข้าใจ verification approach
- ตั้งค่า test infrastructure

**แนวทาง Analysis:**
- ตรวจสอบ package.json สำหรับ test framework และ scripts
- อ่าน test config file สำหรับ coverage, setup
- ตรวจสอบ test file organization (collocated vs separate)
- Review 5 test files สำหรับ patterns (mocking, structure, assertions)
- มองหา test utilities, fixtures, factories
- Note test types ใดๆ (unit, integration, e2e)
- Document commands สำหรับรัน tests
</guidelines>
