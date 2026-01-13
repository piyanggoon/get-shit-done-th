<div align="center">

# GET SHIT DONE

**ระบบ meta-prompting, context engineering และ spec-driven development ที่เบาและทรงพลังสำหรับ Claude Code โดย TÂCHES**

[![npm version](https://img.shields.io/npm/v/get-shit-done-cc?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/get-shit-done-cc)
[![npm downloads](https://img.shields.io/npm/dm/get-shit-done-cc?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/get-shit-done-cc)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/glittercowboy/get-shit-done?style=for-the-badge&logo=github&color=181717)](https://github.com/glittercowboy/get-shit-done)

<br>

```bash
npx get-shit-done-cc
```

**ใช้ได้บน Mac, Windows และ Linux**

<br>

![GSD Install](assets/terminal.svg)

<br>

*"ถ้าคุณรู้ชัดเจนว่าต้องการอะไร มันจะสร้างให้คุณ ไม่มีเรื่องไร้สาระ"*

*"ผมเคยใช้ SpecKit, OpenSpec และ Taskmaster — อันนี้ให้ผลลัพธ์ดีที่สุดสำหรับผม"*

*"เป็นส่วนเสริมที่ทรงพลังที่สุดสำหรับ Claude Code ของผม ไม่มีอะไรซับซ้อนเกินไป แค่ทำงานให้เสร็จจริงๆ"*

<br>

**ได้รับความไว้วางใจจากวิศวกรที่ Amazon, Google, Shopify และ Webflow**

[ทำไมผมถึงสร้างสิ่งนี้](#ทำไมผมถึงสร้างสิ่งนี้) · [มันทำงานอย่างไร](#มันทำงานอย่างไร) · [Commands](#commands) · [ทำไมมันถึงได้ผล](#ทำไมมันถึงได้ผล)

</div>

---

## ทำไมผมถึงสร้างสิ่งนี้

ผมเป็น solo developer ผมไม่เขียนโค้ด — Claude Code เขียน

เครื่องมือ spec-driven development อื่นๆ มีอยู่; BMAD, Speckit... แต่พวกมันดูเหมือนจะทำทุกอย่างซับซ้อนกว่าที่จำเป็น (sprint ceremonies, story points, stakeholder syncs, retrospectives, Jira workflows) หรือขาดความเข้าใจภาพรวมจริงๆ ของสิ่งที่คุณกำลังสร้าง ผมไม่ใช่บริษัทซอฟต์แวร์ 50 คน ผมไม่อยากเล่นละคร enterprise ผมแค่เป็นคนครีเอทีฟที่พยายามสร้างสิ่งดีๆ ที่ใช้งานได้

เลยสร้าง GSD ขึ้นมา ความซับซ้อนอยู่ในระบบ ไม่ใช่ใน workflow ของคุณ เบื้องหลัง: context engineering, XML prompt formatting, subagent orchestration, state management สิ่งที่คุณเห็น: แค่ไม่กี่ commands ที่ทำงานได้เลย

ระบบให้ทุกอย่างที่ Claude ต้องการเพื่อทำงาน *และ* ตรวจสอบมัน ผมไว้ใจ workflow มันทำงานได้ดี

นี่คือสิ่งนี้ ไม่มีเรื่องไร้สาระแบบ enterprise แค่ระบบที่มีประสิทธิภาพสุดๆ สำหรับสร้างของเจ๋งๆ อย่างสม่ำเสมอโดยใช้ Claude Code

— **TÂCHES**

---

Vibecoding มีชื่อเสียงไม่ดี คุณอธิบายสิ่งที่ต้องการ AI สร้างโค้ด และคุณได้ขยะที่ไม่สม่ำเสมอที่พังเมื่อ scale

GSD แก้ปัญหานั้น มันคือ context engineering layer ที่ทำให้ Claude Code น่าเชื่อถือ อธิบายไอเดียของคุณ ปล่อยให้ระบบดึงทุกอย่างที่ต้องรู้ และปล่อยให้ Claude Code ทำงาน

---

## สิ่งนี้เหมาะสำหรับใคร

คนที่ต้องการอธิบายสิ่งที่ต้องการและให้มันถูกสร้างอย่างถูกต้อง — โดยไม่ต้องแกล้งทำเป็นว่ากำลังบริหารทีม engineering 50 คน

---

## เริ่มต้น

```bash
npx get-shit-done-cc
```

เท่านั้น ตรวจสอบด้วย `/gsd:help`

<details>
<summary><strong>ติดตั้งแบบ Non-interactive (Docker, CI, Scripts)</strong></summary>

```bash
npx get-shit-done-cc --global   # ติดตั้งไปที่ ~/.claude/
npx get-shit-done-cc --local    # ติดตั้งไปที่ ./.claude/
```

ใช้ `--global` (`-g`) หรือ `--local` (`-l`) เพื่อข้าม interactive prompt

</details>

<details>
<summary><strong>ติดตั้งสำหรับ Development</strong></summary>

Clone repository และรัน installer แบบ local:

```bash
git clone https://github.com/glittercowboy/get-shit-done.git
cd get-shit-done
node bin/install.js --local
```

ติดตั้งไปที่ `./.claude/` สำหรับทดสอบการแก้ไขก่อน contribute

</details>

### แนะนำ: โหมด Skip Permissions

GSD ออกแบบมาสำหรับ automation ที่ไม่มีอุปสรรค รัน Claude Code ด้วย:

```bash
claude --dangerously-skip-permissions
```

> [!TIP]
> นี่คือวิธีที่ตั้งใจให้ใช้ GSD — หยุดอนุมัติ `date` และ `git commit` 50 ครั้งเอาชนะวัตถุประสงค์

<details>
<summary><strong>ทางเลือก: Granular Permissions</strong></summary>

ถ้าคุณไม่ต้องการใช้ flag นั้น เพิ่มสิ่งนี้ไปที่ `.claude/settings.json` ของโปรเจกต์:

```json
{
  "permissions": {
    "allow": [
      "Bash(date:*)",
      "Bash(echo:*)",
      "Bash(cat:*)",
      "Bash(ls:*)",
      "Bash(mkdir:*)",
      "Bash(wc:*)",
      "Bash(head:*)",
      "Bash(tail:*)",
      "Bash(sort:*)",
      "Bash(grep:*)",
      "Bash(tr:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git status:*)",
      "Bash(git log:*)",
      "Bash(git diff:*)",
      "Bash(git tag:*)"
    ]
  }
}
```

</details>

---

## มันทำงานอย่างไร

### 1. เริ่มด้วยไอเดีย

```
/gsd:new-project
```

ระบบถามคำถาม ถามต่อจนกว่าจะมีทุกอย่าง — เป้าหมาย, ข้อจำกัด, preferences เทคโนโลยี, edge cases คุณโต้ตอบไปมาจนไอเดียถูกจับได้ครบ สร้าง **PROJECT.md**

### 2. สร้าง roadmap

```
/gsd:create-roadmap
```

สร้าง:
- **ROADMAP.md** — เฟสตั้งแต่เริ่มจนจบ
- **STATE.md** — ความจำที่มีชีวิตที่คงอยู่ข้าม sessions

### 3. วางแผนและรันเฟส

```
/gsd:plan-phase 1      # ระบบสร้างแผน task แบบ atomic
/gsd:execute-plan      # Subagent implement แบบอัตโนมัติ
```

แต่ละเฟสแบ่งเป็น 2-3 atomic tasks แต่ละ task รันใน subagent context ใหม่ — 200k tokens เฉพาะสำหรับ implementation, ไม่มี degradation

### 4. Ship และทำซ้ำ

```
/gsd:complete-milestone   # Archive v1, เตรียม v2
/gsd:add-phase            # เพิ่มงานใหม่
/gsd:insert-phase 2       # แทรกงานเร่งด่วนระหว่างเฟส
```

Ship MVP ของคุณภายในวัน เพิ่มฟีเจอร์ แทรก hotfixes ระบบยังคง modular — คุณไม่มีวันติดขัด

---

## โปรเจกต์ที่มีอยู่แล้ว (Brownfield)

มีโค้ดอยู่แล้ว? เริ่มที่นี่แทน

### 1. Map codebase

```
/gsd:map-codebase
```

Spawn agents แบบ parallel เพื่อวิเคราะห์โค้ดของคุณ สร้าง `.planning/codebase/` พร้อม 7 เอกสาร:

| เอกสาร | วัตถุประสงค์ |
|----------|---------|
| `STACK.md` | ภาษา, frameworks, dependencies |
| `ARCHITECTURE.md` | Patterns, layers, data flow |
| `STRUCTURE.md` | Layout ของ directory, ของอยู่ที่ไหน |
| `CONVENTIONS.md` | Style ของโค้ด, naming patterns |
| `TESTING.md` | Test framework, patterns |
| `INTEGRATIONS.md` | External services, APIs |
| `CONCERNS.md` | Tech debt, ปัญหาที่รู้, พื้นที่เปราะบาง |

### 2. เริ่มต้นโปรเจกต์

```
/gsd:new-project
```

เหมือนกับ greenfield แต่ระบบรู้จัก codebase ของคุณ คำถามเน้นที่สิ่งที่คุณกำลังเพิ่ม/เปลี่ยน ไม่ใช่เริ่มจากศูนย์

### 3. ดำเนินการต่อตามปกติ

จากที่นี่เหมือนกัน: `/gsd:create-roadmap` → `/gsd:plan-phase` → `/gsd:execute-plan`

เอกสาร codebase โหลดอัตโนมัติระหว่างการวางแผน Claude รู้ patterns, conventions และจะวางของที่ไหน

---

## ทำไมมันถึงได้ผล

### Context Engineering

Claude Code ทรงพลังมาก *ถ้า* คุณให้ context ที่มันต้องการ คนส่วนใหญ่ไม่ให้

GSD จัดการให้คุณ:

| ไฟล์ | ทำอะไร |
|------|--------------|
| `PROJECT.md` | วิสัยทัศน์โปรเจกต์, โหลดเสมอ |
| `ROADMAP.md` | คุณกำลังไปไหน, อะไรเสร็จแล้ว |
| `STATE.md` | การตัดสินใจ, blockers, ตำแหน่ง — ความจำข้าม sessions |
| `PLAN.md` | Atomic task พร้อมโครงสร้าง XML, ขั้นตอนการยืนยัน |
| `SUMMARY.md` | เกิดอะไรขึ้น, อะไรเปลี่ยน, commit ไปที่ประวัติ |
| `ISSUES.md` | Enhancements ที่เลื่อนติดตามข้าม sessions |
| `todos/` | ไอเดียและ tasks ที่จับไว้สำหรับงานในภายหลัง |

ขีดจำกัดขนาดตามจุดที่คุณภาพของ Claude ลดลง อยู่ใต้นั้น ได้ความเป็นเลิศที่สม่ำเสมอ

### XML Prompt Formatting

ทุกแผนเป็น XML ที่มีโครงสร้างปรับให้เหมาะกับ Claude:

```xml
<task type="auto">
  <name>สร้าง login endpoint</name>
  <files>src/app/api/auth/login/route.ts</files>
  <action>
    ใช้ jose สำหรับ JWT (ไม่ใช่ jsonwebtoken - มีปัญหา CommonJS)
    Validate credentials กับตาราง users
    คืน httpOnly cookie เมื่อสำเร็จ
  </action>
  <verify>curl -X POST localhost:3000/api/auth/login คืน 200 + Set-Cookie</verify>
  <done>Credentials ที่ถูกต้องคืน cookie, ไม่ถูกต้องคืน 401</done>
</task>
```

คำแนะนำที่แม่นยำ ไม่ต้องเดา การยืนยัน built in

### Subagent Execution

เมื่อ Claude เติม context window ของมัน คุณภาพลดลง คุณเคยเห็น: *"เนื่องจากข้อจำกัด context ผมจะกระชับขึ้นตอนนี้"* "ความกระชับ" นั้นหมายถึงการตัดมุม

GSD ป้องกันสิ่งนี้ แต่ละแผนมีสูงสุด 3 tasks แต่ละแผนรันใน subagent ใหม่ — 200k tokens เฉพาะสำหรับ implementation, ไม่มีขยะสะสม

| Task | Context | คุณภาพ |
|------|---------|---------|
| Task 1 | ใหม่ | ✅ เต็ม |
| Task 2 | ใหม่ | ✅ เต็ม |
| Task 3 | ใหม่ | ✅ เต็ม |

ไม่มี degradation ออกไป กลับมาพบงานที่เสร็จแล้ว

### Atomic Git Commits

แต่ละ task ได้ commit ของตัวเองทันทีหลังเสร็จ:

```bash
abc123f docs(08-02): complete user registration plan
def456g feat(08-02): add email confirmation flow
hij789k feat(08-02): implement password hashing
lmn012o feat(08-02): create registration endpoint
```

> [!NOTE]
> **ประโยชน์:** Git bisect หา task ที่ล้มเหลวที่แน่นอน แต่ละ task revert ได้อย่างอิสระ ประวัติที่ชัดเจนสำหรับ Claude ใน sessions อนาคต Observability ที่ดีกว่าใน workflow ที่ AI automate

ทุก commit เป็น surgical, traceable และมีความหมาย

### Modular by Design

- เพิ่มเฟสไป milestone ปัจจุบัน
- แทรกงานเร่งด่วนระหว่างเฟส
- เสร็จ milestones และเริ่มใหม่
- ปรับแผนโดยไม่ต้อง rebuild ทุกอย่าง

คุณไม่เคยติดขัด ระบบปรับตัว

---

## Commands

| Command | ทำอะไร |
|---------|--------------|
| `/gsd:new-project` | ดึงไอเดียของคุณผ่านคำถาม, สร้าง PROJECT.md |
| `/gsd:create-roadmap` | สร้าง roadmap และการติดตามสถานะ |
| `/gsd:map-codebase` | Map codebase ที่มีอยู่สำหรับโปรเจกต์ brownfield |
| `/gsd:plan-phase [N]` | สร้างแผน task สำหรับเฟส |
| `/gsd:execute-plan` | รันแผนผ่าน subagent |
| `/gsd:progress` | ผมอยู่ไหน? อะไรถัดไป? |
| `/gsd:verify-work [N]` | User acceptance test ของเฟสหรือแผน ¹ |
| `/gsd:plan-fix [plan]` | วางแผนแก้ไขสำหรับ UAT issues จาก verify-work |
| `/gsd:complete-milestone` | Ship มัน, เตรียมเวอร์ชันถัดไป |
| `/gsd:discuss-milestone` | รวบรวมบริบทสำหรับ milestone ถัดไป |
| `/gsd:new-milestone [name]` | สร้าง milestone ใหม่พร้อมเฟส |
| `/gsd:add-phase` | เพิ่มเฟสไปที่ roadmap |
| `/gsd:insert-phase [N]` | แทรกงานเร่งด่วน |
| `/gsd:remove-phase [N]` | ลบเฟสในอนาคต, renumber เฟสถัดไป |
| `/gsd:discuss-phase [N]` | รวบรวมบริบทก่อนวางแผน |
| `/gsd:research-phase [N]` | ค้นคว้า ecosystem เชิงลึกสำหรับโดเมนเฉพาะทาง |
| `/gsd:list-phase-assumptions [N]` | ดูสิ่งที่ Claude คิดก่อนที่คุณจะแก้ไข |
| `/gsd:pause-work` | สร้าง handoff file เมื่อหยุดกลางเฟส |
| `/gsd:resume-work` | คืนสถานะจาก session ล่าสุด |
| `/gsd:resume-task [id]` | ดำเนินการต่อ subagent execution ที่ถูกขัดจังหวะ |
| `/gsd:consider-issues` | ตรวจสอบ issues ที่เลื่อน, ปิดที่แก้ไขแล้ว, ระบุที่เร่งด่วน |
| `/gsd:add-todo [desc]` | จับไอเดียหรือ task จากบทสนทนาสำหรับภายหลัง |
| `/gsd:check-todos [area]` | แสดงรายการ todos ที่รอดำเนินการ, เลือกอันที่จะทำงาน |
| `/gsd:help` | แสดง commands ทั้งหมดและคู่มือการใช้งาน |

<sup>¹ Contributed โดย reddit user OracleGreyBeard</sup>

---

## การแก้ปัญหา

**หา Commands ไม่พบหลังติดตั้ง?**
- Restart Claude Code เพื่อ reload slash commands
- ตรวจสอบว่าไฟล์มีอยู่ใน `~/.claude/commands/gsd/` (global) หรือ `./.claude/commands/gsd/` (local)

**Commands ไม่ทำงานตามที่คาดหวัง?**
- รัน `/gsd:help` เพื่อตรวจสอบการติดตั้ง
- รัน `npx get-shit-done-cc` ใหม่เพื่อติดตั้งใหม่

**อัปเดตเป็นเวอร์ชันล่าสุด?**
```bash
npx get-shit-done-cc@latest
```

**ใช้ Docker หรือ containerized environments?**

ถ้าการอ่านไฟล์ล้มเหลวด้วย tilde paths (`~/.claude/...`) ให้ตั้ง `CLAUDE_CONFIG_DIR` ก่อนติดตั้ง:
```bash
CLAUDE_CONFIG_DIR=/home/youruser/.claude npx get-shit-done-cc --global
```
สิ่งนี้ทำให้มั่นใจว่าใช้ absolute paths แทน `~` ซึ่งอาจ expand ไม่ถูกต้องใน containers

---

## Star History

<a href="https://star-history.com/#glittercowboy/get-shit-done&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=glittercowboy/get-shit-done&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=glittercowboy/get-shit-done&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=glittercowboy/get-shit-done&type=Date" />
 </picture>
</a>

---

## License

MIT License ดู [LICENSE](LICENSE) สำหรับรายละเอียด

---

<div align="center">

**Claude Code ทรงพลัง GSD ทำให้มันน่าเชื่อถือ**

</div>
