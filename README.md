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

**ใช้งานได้บน Mac, Windows และ Linux**

<br>

![GSD Install](assets/terminal.svg)

<br>

*"ถ้าคุณรู้ชัดเจนว่าต้องการอะไร มันจะสร้างให้คุณได้ ไม่มีโม้"*

*"ผมใช้มาหมดแล้ว SpecKit, OpenSpec และ Taskmaster — ตัวนี้ให้ผลลัพธ์ดีที่สุดสำหรับผม"*

*"เป็นส่วนเสริมที่ทรงพลังที่สุดสำหรับ Claude Code ของผม ไม่มีอะไรซับซ้อนเกินไป แค่ทำงานให้เสร็จจริงๆ"*

<br>

**ได้รับความไว้วางใจจากวิศวกรที่ Amazon, Google, Shopify และ Webflow**

[ทำไมถึงสร้างสิ่งนี้](#ทำไมถึงสร้างสิ่งนี้) · [วิธีการทำงาน](#วิธีการทำงาน) · [คำสั่ง](#คำสั่ง) · [ทำไมถึงได้ผล](#ทำไมถึงได้ผล)

</div>

---

## ทำไมถึงสร้างสิ่งนี้

ผมเป็นนักพัฒนาคนเดียว ผมไม่ได้เขียนโค้ด — Claude Code เขียนให้

มีเครื่องมือ spec-driven development อื่นๆ อยู่ เช่น BMAD, Speckit... แต่ทุกตัวดูเหมือนจะทำให้สิ่งต่างๆ ซับซ้อนกว่าที่ควรจะเป็น (sprint ceremonies, story points, stakeholder syncs, retrospectives, Jira workflows) หรือไม่ก็ขาดความเข้าใจภาพรวมใหญ่ของสิ่งที่คุณกำลังสร้าง ผมไม่ใช่บริษัทซอฟต์แวร์ 50 คน ผมไม่อยากเล่นละครองค์กร ผมแค่เป็นคนสร้างสรรค์ที่พยายามสร้างสิ่งดีๆ ที่ใช้งานได้จริง

ดังนั้นผมจึงสร้าง GSD ความซับซ้อนอยู่ในระบบ ไม่ใช่ใน workflow ของคุณ เบื้องหลัง: context engineering, XML prompt formatting, subagent orchestration, state management สิ่งที่คุณเห็น: คำสั่งไม่กี่คำที่ใช้งานได้เลย

ระบบนี้ให้ทุกอย่างที่ Claude ต้องการเพื่อทำงาน *และ* ตรวจสอบมัน ผมไว้ใจ workflow นี้ มันทำงานได้ดีจริงๆ

นั่นคือสิ่งที่มันเป็น ไม่มีโม้แบบองค์กร แค่ระบบที่มีประสิทธิภาพสุดๆ สำหรับการสร้างสิ่งเจ๋งๆ อย่างสม่ำเสมอโดยใช้ Claude Code

— **TÂCHES**

---

Vibecoding มีชื่อเสียงไม่ดี คุณอธิบายสิ่งที่ต้องการ AI สร้างโค้ด แล้วคุณได้ขยะที่ไม่สม่ำเสมอที่พังเมื่อขยายขนาด

GSD แก้ปัญหานั้น มันเป็นชั้น context engineering ที่ทำให้ Claude Code เชื่อถือได้ อธิบายไอเดียของคุณ ปล่อยให้ระบบดึงทุกอย่างที่มันต้องการรู้ และปล่อยให้ Claude Code ทำงาน

---

## สิ่งนี้เหมาะสำหรับใคร

คนที่อยากอธิบายสิ่งที่ต้องการและให้มันถูกสร้างอย่างถูกต้อง — โดยไม่ต้องแกล้งทำเป็นว่ากำลังบริหารทีมวิศวกร 50 คน

---

## เริ่มต้นใช้งาน

```bash
npx get-shit-done-cc
```

แค่นั้นเอง ตรวจสอบด้วย `/gsd:help`

<details>
<summary><strong>การติดตั้งแบบ Non-interactive (Docker, CI, Scripts)</strong></summary>

```bash
npx get-shit-done-cc --global   # ติดตั้งไปที่ ~/.claude/
npx get-shit-done-cc --local    # ติดตั้งไปที่ ./.claude/
```

ใช้ `--global` (`-g`) หรือ `--local` (`-l`) เพื่อข้าม interactive prompt

</details>

<details>
<summary><strong>การติดตั้งสำหรับพัฒนา</strong></summary>

Clone repository และรัน installer ใน local:

```bash
git clone https://github.com/glittercowboy/get-shit-done.git
cd get-shit-done
node bin/install.js --local
```

ติดตั้งไปที่ `./.claude/` สำหรับทดสอบการแก้ไขก่อน contribute

</details>

### แนะนำ: โหมด Skip Permissions

GSD ออกแบบมาเพื่อ automation ที่ลื่นไหล รัน Claude Code ด้วย:

```bash
claude --dangerously-skip-permissions
```

> [!TIP]
> นี่คือวิธีที่ GSD ตั้งใจให้ใช้งาน — การหยุดเพื่ออนุมัติ `date` และ `git commit` 50 ครั้งทำลายจุดประสงค์

<details>
<summary><strong>ทางเลือก: Granular Permissions</strong></summary>

ถ้าคุณไม่ต้องการใช้ flag นั้น เพิ่มสิ่งนี้ใน `.claude/settings.json` ของโปรเจกต์:

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

## วิธีการทำงาน

### 1. เริ่มจากไอเดีย

```
/gsd:new-project
```

ระบบจะถามคำถาม ถามต่อไปจนกว่าจะได้ทุกอย่าง — เป้าหมาย ข้อจำกัด ความชอบด้านเทคโนโลยี edge cases คุณโต้ตอบไปมาจนกว่าไอเดียจะถูกจับเต็มที่ สร้าง **PROJECT.md**

### 2. สร้าง roadmap

```
/gsd:create-roadmap
```

สร้าง:
- **ROADMAP.md** — เฟสตั้งแต่เริ่มต้นจนจบ
- **STATE.md** — ความจำที่มีชีวิตที่คงอยู่ข้าม session

### 3. วางแผนและดำเนินเฟส

```
/gsd:plan-phase 1      # ระบบสร้างแผน atomic task
/gsd:execute-plan      # Subagent implement อัตโนมัติ
```

แต่ละเฟสแบ่งเป็น 2-3 atomic tasks แต่ละ task รันใน subagent context ใหม่ — 200k tokens ล้วนๆ สำหรับ implementation ไม่มีการเสื่อมคุณภาพ

**สำหรับเฟสที่มีหลายแผน:**
```
/gsd:execute-phase 1   # รันทุกแผนพร้อมกัน การดำเนินการแบบ "walk away"
```

ใช้ `/gsd:execute-plan` สำหรับการดำเนินการแบบ interactive ทีละแผนพร้อม checkpoints ใช้ `/gsd:execute-phase` เมื่อมีหลายแผนและต้องการ automation แบบ "walk away" พร้อมกัน

### 4. Ship และปรับปรุง

```
/gsd:complete-milestone   # เก็บ v1 เตรียมสำหรับ v2
/gsd:add-phase            # เพิ่มงานใหม่
/gsd:insert-phase 2       # แทรกงานเร่งด่วนระหว่างเฟส
```

Ship MVP ของคุณในหนึ่งวัน เพิ่ม features แทรก hotfixes ระบบยังคง modular — คุณไม่เคยติดอยู่

---

## โปรเจกต์ที่มีอยู่แล้ว (Brownfield)

มีโค้ดอยู่แล้ว? เริ่มจากตรงนี้แทน

### 1. Map codebase

```
/gsd:map-codebase
```

ส่ง agents ขนานกันเพื่อวิเคราะห์โค้ดของคุณ สร้าง `.planning/codebase/` พร้อมเอกสาร 7 รายการ:

| เอกสาร | จุดประสงค์ |
|----------|---------|
| `STACK.md` | ภาษา, frameworks, dependencies |
| `ARCHITECTURE.md` | Patterns, layers, data flow |
| `STRUCTURE.md` | Layout ของ directory, อะไรอยู่ที่ไหน |
| `CONVENTIONS.md` | Code style, naming patterns |
| `TESTING.md` | Test framework, patterns |
| `INTEGRATIONS.md` | External services, APIs |
| `CONCERNS.md` | Tech debt, ปัญหาที่รู้, จุดเปราะบาง |

### 2. Initialize project

```
/gsd:new-project
```

เหมือนกับ greenfield แต่ระบบรู้จัก codebase ของคุณ คำถามจะเน้นที่สิ่งที่คุณกำลังเพิ่ม/เปลี่ยน ไม่ใช่เริ่มจากศูนย์

### 3. ดำเนินการต่อตามปกติ

จากนี้ก็เหมือนกัน: `/gsd:create-roadmap` → `/gsd:plan-phase` → `/gsd:execute-plan`

เอกสาร codebase โหลดอัตโนมัติระหว่างการวางแผน Claude รู้ patterns, conventions และตำแหน่งที่ควรวางสิ่งต่างๆ ของคุณ

---

## ทำไมถึงได้ผล

### Context Engineering

Claude Code ทรงพลังอย่างเหลือเชื่อ *ถ้า* คุณให้ context ที่มันต้องการ คนส่วนใหญ่ไม่ให้

GSD จัดการให้คุณ:

| ไฟล์ | ทำอะไร |
|------|--------------|
| `PROJECT.md` | วิสัยทัศน์โปรเจกต์, โหลดเสมอ |
| `ROADMAP.md` | คุณกำลังไปไหน, อะไรเสร็จแล้ว |
| `STATE.md` | การตัดสินใจ, blockers, ตำแหน่ง — ความจำข้าม session |
| `PLAN.md` | Atomic task พร้อมโครงสร้าง XML, ขั้นตอนการตรวจสอบ |
| `SUMMARY.md` | เกิดอะไรขึ้น, อะไรเปลี่ยน, commit ลงประวัติ |
| `ISSUES.md` | การปรับปรุงที่เลื่อนไว้ ติดตามข้าม session |
| `todos/` | ไอเดียและ tasks ที่จับไว้สำหรับงานในภายหลัง |

ขนาดจำกัดตามจุดที่คุณภาพของ Claude เสื่อม อยู่ใต้เกณฑ์ ได้ความยอดเยี่ยมที่สม่ำเสมอ

### XML Prompt Formatting

ทุกแผนเป็น XML ที่มีโครงสร้างปรับให้เหมาะกับ Claude:

```xml
<task type="auto">
  <name>Create login endpoint</name>
  <files>src/app/api/auth/login/route.ts</files>
  <action>
    Use jose for JWT (not jsonwebtoken - CommonJS issues).
    Validate credentials against users table.
    Return httpOnly cookie on success.
  </action>
  <verify>curl -X POST localhost:3000/api/auth/login returns 200 + Set-Cookie</verify>
  <done>Valid credentials return cookie, invalid return 401</done>
</task>
```

คำสั่งที่แม่นยำ ไม่ต้องเดา มี verification ในตัว

### Subagent Execution

เมื่อ Claude เติม context window คุณภาพจะลดลง คุณเคยเห็น: *"Due to context limits, I'll be more concise now."* "concision" นั้นหมายถึงการตัดมุม

GSD ป้องกันสิ่งนี้ แต่ละแผนมีไม่เกิน 3 tasks แต่ละแผนรันใน subagent ใหม่ — 200k tokens ล้วนๆ สำหรับ implementation ไม่มีขยะสะสม

| Task | Context | คุณภาพ |
|------|---------|---------|
| Task 1 | ใหม่ | ✅ เต็ม |
| Task 2 | ใหม่ | ✅ เต็ม |
| Task 3 | ใหม่ | ✅ เต็ม |

ไม่มีการเสื่อม เดินออกไป กลับมาเจองานเสร็จ

### Atomic Git Commits

แต่ละ task ได้ commit ของตัวเองทันทีหลังเสร็จ:

```bash
abc123f docs(08-02): complete user registration plan
def456g feat(08-02): add email confirmation flow
hij789k feat(08-02): implement password hashing
lmn012o feat(08-02): create registration endpoint
```

> [!NOTE]
> **ประโยชน์:** Git bisect หา task ที่ผิดพลาดได้แม่นยำ แต่ละ task revert ได้อิสระ ประวัติชัดเจนสำหรับ Claude ใน session อนาคต สังเกตการณ์ได้ดีกว่าใน AI-automated workflow

ทุก commit เป็นแบบผ่าตัด ติดตามได้ และมีความหมาย

### Modular by Design

- เพิ่มเฟสใน milestone ปัจจุบัน
- แทรกงานเร่งด่วนระหว่างเฟส
- ทำ milestone เสร็จแล้วเริ่มใหม่
- ปรับแผนโดยไม่ต้องสร้างใหม่ทั้งหมด

คุณไม่เคยถูกล็อค ระบบปรับตัวได้

---

## คำสั่ง

| คำสั่ง | ทำอะไร |
|---------|--------------|
| `/gsd:new-project` | ดึงไอเดียของคุณผ่านคำถาม สร้าง PROJECT.md |
| `/gsd:create-roadmap` | สร้าง roadmap และการติดตามสถานะ |
| `/gsd:map-codebase` | Map codebase ที่มีอยู่สำหรับโปรเจกต์ brownfield |
| `/gsd:plan-phase [N]` | สร้างแผน task สำหรับเฟส |
| `/gsd:execute-plan` | รันแผนเดียวผ่าน subagent |
| `/gsd:execute-phase <N>` | ดำเนินการทุกแผนในเฟส N พร้อม agents ขนานกัน |
| `/gsd:status [--wait]` | ตรวจสอบสถานะ background agent จากการดำเนินการแบบขนาน |
| `/gsd:progress` | ผมอยู่ไหน? อะไรต่อไป? |
| `/gsd:verify-work [N]` | User acceptance test ของเฟสหรือแผน ¹ |
| `/gsd:plan-fix [plan]` | วางแผนแก้ไขปัญหา UAT จาก verify-work |
| `/gsd:complete-milestone` | Ship แล้ว เตรียมเวอร์ชันถัดไป |
| `/gsd:discuss-milestone` | รวบรวม context สำหรับ milestone ถัดไป |
| `/gsd:new-milestone [name]` | สร้าง milestone ใหม่พร้อมเฟส |
| `/gsd:add-phase` | เพิ่มเฟสใน roadmap |
| `/gsd:insert-phase [N]` | แทรกงานเร่งด่วน |
| `/gsd:remove-phase [N]` | ลบเฟสในอนาคต เรียงหมายเลขใหม่ |
| `/gsd:discuss-phase [N]` | รวบรวม context ก่อนวางแผน |
| `/gsd:research-phase [N]` | Deep ecosystem research สำหรับ niche domains |
| `/gsd:list-phase-assumptions [N]` | ดูว่า Claude คิดอะไรก่อนที่คุณจะแก้ไข |
| `/gsd:pause-work` | สร้างไฟล์ handoff เมื่อหยุดกลางเฟส |
| `/gsd:resume-work` | กลับมาจาก session ล่าสุด |
| `/gsd:resume-task [id]` | กลับมาทำงาน subagent ที่ถูกขัดจังหวะ |
| `/gsd:consider-issues` | ทบทวน deferred issues ปิดที่แก้แล้ว ระบุที่เร่งด่วน |
| `/gsd:add-todo [desc]` | จับไอเดียหรือ task จากการสนทนาสำหรับภายหลัง |
| `/gsd:check-todos [area]` | แสดง pending todos เลือกอันหนึ่งเพื่อทำงาน |
| `/gsd:help` | แสดงคำสั่งทั้งหมดและคู่มือการใช้งาน |

<sup>¹ Contributed โดย reddit user OracleGreyBeard</sup>

---

## การแก้ไขปัญหา

**ไม่พบคำสั่งหลังติดตั้ง?**
- Restart Claude Code เพื่อโหลด slash commands ใหม่
- ตรวจสอบว่าไฟล์มีอยู่ใน `~/.claude/commands/gsd/` (global) หรือ `./.claude/commands/gsd/` (local)

**คำสั่งไม่ทำงานตามที่คาดหวัง?**
- รัน `/gsd:help` เพื่อตรวจสอบการติดตั้ง
- รัน `npx get-shit-done-cc` ใหม่เพื่อติดตั้งซ้ำ

**อัพเดทเป็นเวอร์ชันล่าสุด?**
```bash
npx get-shit-done-cc@latest
```

**ใช้ Docker หรือ containerized environments?**

ถ้าการอ่านไฟล์ล้มเหลวด้วย tilde paths (`~/.claude/...`) ให้ตั้ง `CLAUDE_CONFIG_DIR` ก่อนติดตั้ง:
```bash
CLAUDE_CONFIG_DIR=/home/youruser/.claude npx get-shit-done-cc --global
```
สิ่งนี้ทำให้ใช้ absolute paths แทน `~` ซึ่งอาจไม่ขยายอย่างถูกต้องใน containers

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

MIT License ดูรายละเอียดใน [LICENSE](LICENSE)

---

<div align="center">

**Claude Code ทรงพลัง GSD ทำให้มันเชื่อถือได้**

</div>
