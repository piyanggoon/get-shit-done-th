<overview>
แผนทำงานแบบอัตโนมัติ Checkpoints ทำให้จุดโต้ตอบที่ต้องการการยืนยันหรือการตัดสินใจจากมนุษย์เป็นทางการ

**หลักการหลัก:** Claude ทำทุกอย่างอัตโนมัติด้วย CLI/API Checkpoints มีไว้สำหรับการยืนยันและการตัดสินใจ ไม่ใช่งาน manual
</overview>

<checkpoint_types>

## checkpoint:human-verify (90% ของ checkpoints)

**เมื่อไหร่:** Claude ทำงานอัตโนมัติเสร็จแล้ว มนุษย์ยืนยันว่าทำงานถูกต้อง

**ใช้สำหรับ:** ตรวจสอบ UI แบบ visual, interactive flows, การยืนยันฟังก์ชัน, คุณภาพ audio/video, ความลื่นไหลของ animation, การทดสอบ accessibility

**โครงสร้าง:**
```xml
<task type="checkpoint:human-verify" gate="blocking">
  <what-built>[สิ่งที่ Claude ทำอัตโนมัติ]</what-built>
  <how-to-verify>[ขั้นตอนมีเลข - URLs, คำสั่ง, พฤติกรรมที่คาดหวัง]</how-to-verify>
  <resume-signal>[วิธีดำเนินการต่อ - "approved" หรืออธิบายปัญหา]</resume-signal>
</task>
```

**ตัวอย่าง:**
```xml
<task type="auto">
  <name>Deploy ไป Vercel</name>
  <action>รัน `vercel --yes` เพื่อ deploy จับ URL</action>
  <verify>vercel ls แสดง deployment, curl {url} คืน 200</verify>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Deploy แล้วที่ https://myapp.vercel.app</what-built>
  <how-to-verify>
    เยี่ยมชม URL และยืนยัน:
    1. Homepage โหลดโดยไม่มี errors
    2. รูปภาพ/assets ทั้งหมดโหลด
    3. ไม่มี console errors
  </how-to-verify>
  <resume-signal>พิมพ์ "approved" หรืออธิบายปัญหา</resume-signal>
</task>
```

## checkpoint:decision (9% ของ checkpoints)

**เมื่อไหร่:** มนุษย์ต้องเลือกทางเลือกที่ส่งผลต่อทิศทางการ implementation

**ใช้สำหรับ:** การเลือกเทคโนโลยี, การตัดสินใจด้าน architecture, การเลือก design, การจัดลำดับความสำคัญของฟีเจอร์

**โครงสร้าง:**
```xml
<task type="checkpoint:decision" gate="blocking">
  <decision>[สิ่งที่กำลังตัดสินใจ]</decision>
  <context>[ทำไมเรื่องนี้สำคัญ]</context>
  <options>
    <option id="option-a"><name>[ชื่อ]</name><pros>[ข้อดี]</pros><cons>[ข้อเสีย]</cons></option>
    <option id="option-b"><name>[ชื่อ]</name><pros>[ข้อดี]</pros><cons>[ข้อเสีย]</cons></option>
  </options>
  <resume-signal>[วิธีระบุทางเลือก]</resume-signal>
</task>
```

**ตัวอย่าง:**
```xml
<task type="checkpoint:decision" gate="blocking">
  <decision>เลือก authentication provider</decision>
  <context>ต้องการ user auth มีสามตัวเลือกที่มี tradeoffs ต่างกัน</context>
  <options>
    <option id="supabase"><name>Supabase Auth</name><pros>Built-in กับ DB, free tier, RLS integration</pros><cons>ปรับแต่งได้น้อย, ผูกกับ ecosystem</cons></option>
    <option id="clerk"><name>Clerk</name><pros>UI สวย, DX ดีที่สุด</pros><cons>เสียเงินหลัง 10k MAU</cons></option>
    <option id="nextauth"><name>NextAuth.js</name><pros>ฟรี, self-hosted, ควบคุมได้สูงสุด</pros><cons>ตั้งค่ามากกว่า, ต้องจัดการ security เอง</cons></option>
  </options>
  <resume-signal>เลือก: supabase, clerk, หรือ nextauth</resume-signal>
</task>
```

## checkpoint:human-action (1% - หายาก)

**เมื่อไหร่:** การกระทำที่ไม่มี CLI/API และต้องการการโต้ตอบจากมนุษย์เท่านั้น

**ใช้เฉพาะสำหรับ:** ลิงก์ยืนยันอีเมล, รหัส SMS 2FA, การอนุมัติบัญชีแบบ manual, 3D Secure payment flows, การอนุมัติ OAuth app

**อย่าใช้สำหรับ:** Deployments (ใช้ CLI), การสร้าง resources (ใช้ CLI/API), builds/tests (ใช้ Bash), file operations (ใช้ Write/Edit)

**โครงสร้าง:**
```xml
<task type="checkpoint:human-action" gate="blocking">
  <action>[ขั้นตอน manual ที่หลีกเลี่ยงไม่ได้]</action>
  <instructions>[สิ่งที่ Claude ทำอัตโนมัติแล้ว] [สิ่งเดียวที่ต้องการการกระทำจากมนุษย์]</instructions>
  <verification>[สิ่งที่ Claude ตรวจสอบภายหลัง]</verification>
  <resume-signal>[วิธีดำเนินการต่อ]</resume-signal>
</task>
```

**ตัวอย่าง (การยืนยันอีเมล):**
```xml
<task type="checkpoint:human-action" gate="blocking">
  <action>ยืนยันอีเมลสำหรับบัญชี SendGrid</action>
  <instructions>
    ฉันสร้างบัญชีแล้วและขอส่งอีเมลยืนยัน
    ตรวจสอบ inbox สำหรับลิงก์ยืนยันและคลิก
  </instructions>
  <verification>SendGrid API key ใช้งานได้: curl test สำเร็จ</verification>
  <resume-signal>พิมพ์ "done" เมื่อยืนยันแล้ว</resume-signal>
</task>
```

</checkpoint_types>

<execution_protocol>

เมื่อ Claude พบ `type="checkpoint:*"`:

1. **หยุดทันที** - ไม่ดำเนินการไป task ถัดไป
2. **แสดง checkpoint อย่างชัดเจน:**

```
════════════════════════════════════════
CHECKPOINT: [ประเภท]
════════════════════════════════════════

Task [X] of [Y]: [ชื่อ]

[เนื้อหาเฉพาะ checkpoint]

[คำแนะนำ resume signal]
════════════════════════════════════════
```

3. **รอการตอบสนองจากผู้ใช้** - ไม่หลอกว่าเสร็จ
4. **ตรวจสอบถ้าเป็นไปได้** - ตรวจสอบไฟล์, รันการทดสอบ
5. **ดำเนินการต่อ** - ทำต่อหลังจากได้รับการยืนยันเท่านั้น

</execution_protocol>

<authentication_gates>

**สำคัญ:** เมื่อ Claude ลอง CLI/API และได้ auth error นี่ไม่ใช่ความล้มเหลว — มันเป็น gate ที่ต้องการ input จากมนุษย์เพื่อปลดล็อค automation

**Pattern:** Claude ลอง automation → auth error → สร้าง checkpoint → คุณ authenticate → Claude ลองใหม่ → ดำเนินการต่อ

**Gate protocol:**
1. รับรู้ว่าไม่ใช่ความล้มเหลว - missing auth คาดหวังได้
2. หยุด task ปัจจุบัน - ไม่ลองซ้ำหลายครั้ง
3. สร้าง checkpoint:human-action แบบ dynamic
4. ให้ขั้นตอน authentication ที่แน่นอน
5. ตรวจสอบว่า authentication ใช้งานได้
6. ลอง task เดิมอีกครั้ง
7. ดำเนินการต่อตามปกติ

**ตัวอย่าง (Vercel auth gate):**
```xml
<!-- Claude ลอง deploy -->
<task type="auto">
  <name>Deploy ไป Vercel</name>
  <action>รัน `vercel --yes` เพื่อ deploy</action>
</task>

<!-- ถ้า vercel คืน "Error: Not authenticated" -->
<task type="checkpoint:human-action" gate="blocking">
  <action>Authenticate Vercel CLI เพื่อให้ฉันดำเนินการต่อ</action>
  <instructions>
    ฉันลอง deploy แต่ได้ authentication error
    รัน: vercel login (เปิด browser)
  </instructions>
  <verification>vercel whoami คืนบัญชีของคุณ</verification>
  <resume-signal>พิมพ์ "done" เมื่อ authenticated แล้ว</resume-signal>
</task>

<!-- หลัง auth, Claude ลองใหม่อัตโนมัติ -->
<task type="auto">
  <name>ลอง deployment ใหม่</name>
  <action>รัน `vercel --yes` (ตอนนี้ authenticated แล้ว)</action>
</task>
```

**ความแตกต่างสำคัญ:**
- Checkpoint ที่วางแผนล่วงหน้า: "ฉันต้องการให้คุณทำ X" (ผิด - Claude ควรทำอัตโนมัติ)
- Auth gate: "ฉันพยายามทำ X อัตโนมัติแต่ต้องการ credentials" (ถูก - ปลดล็อค automation)

</authentication_gates>

<automation_reference>

**กฎ:** ถ้ามี CLI/API Claude ต้องทำมันเอง ไม่ขอให้มนุษย์ทำงานที่ทำอัตโนมัติได้

| Service | CLI/API | คำสั่งสำคัญ | Auth Gate |
|---------|---------|--------------|-----------|
| Vercel | `vercel` | `--yes`, `env add`, `--prod`, `ls` | `vercel login` |
| Railway | `railway` | `init`, `up`, `variables set` | `railway login` |
| Fly | `fly` | `launch`, `deploy`, `secrets set` | `fly auth login` |
| Stripe | `stripe` + API | `listen`, `trigger`, API calls | API key ใน .env |
| Supabase | `supabase` | `init`, `link`, `db push`, `gen types` | `supabase login` |
| Upstash | `upstash` | `redis create`, `redis get` | `upstash auth login` |
| PlanetScale | `pscale` | `database create`, `branch create` | `pscale auth login` |
| GitHub | `gh` | `repo create`, `pr create`, `secret set` | `gh auth login` |
| Node | `npm`/`pnpm` | `install`, `run build`, `test` | N/A |
| Xcode | `xcodebuild` | `-project`, `-scheme`, `build`, `test` | N/A |

**Env files:** ใช้ Write/Edit tools ไม่ขอให้มนุษย์สร้าง .env แบบ manual

**อ้างอิงด่วน:**

| การกระทำ | ทำอัตโนมัติได้? | Claude ทำมัน? |
|--------|--------------|-----------------|
| Deploy ไป Vercel | ใช่ (`vercel`) | ใช่ |
| สร้าง Stripe webhook | ใช่ (API) | ใช่ |
| เขียน .env file | ใช่ (Write tool) | ใช่ |
| สร้าง Upstash DB | ใช่ (`upstash`) | ใช่ |
| รัน tests | ใช่ (`npm test`) | ใช่ |
| คลิกลิงก์ยืนยันอีเมล | ไม่ | ไม่ |
| ใส่บัตรเครดิตกับ 3DS | ไม่ | ไม่ |

</automation_reference>

<guidelines>

**ทำ:**
- ทำทุกอย่างอัตโนมัติด้วย CLI/API ก่อน checkpoint
- ระบุเจาะจง: "เยี่ยมชม https://myapp.vercel.app" ไม่ใช่ "ตรวจสอบ deployment"
- ใส่หมายเลขขั้นตอนการยืนยัน
- ระบุผลลัพธ์ที่คาดหวัง
- ทำให้การยืนยัน executable ได้

**อย่า:**
- ขอให้มนุษย์ทำงานที่ Claude ทำอัตโนมัติได้
- สมมติว่ารู้: "ตั้งค่าการตั้งค่าปกติ"
- รวม verifications หลายอย่างใน checkpoint เดียว
- ใช้ checkpoints บ่อยเกินไป (verification fatigue)

**ตำแหน่ง:**
- หลังจาก automation เสร็จ (ไม่ใช่ก่อน)
- หลังจากสร้าง UI
- ก่อนงานที่ขึ้นกัน (การตัดสินใจ)
- ที่จุด integration

</guidelines>

<anti_patterns>

**ไม่ดี: ขอให้มนุษย์ทำ automation**
```xml
<task type="checkpoint:human-action">
  <action>Deploy ไป Vercel</action>
  <instructions>เยี่ยมชม vercel.com/new, import repo, คลิก Deploy</instructions>
</task>
```
ทำไมไม่ดี: Vercel มี CLI ใช้ `vercel --yes`

**ไม่ดี: Checkpoints มากเกินไป**
```xml
<task type="auto">สร้าง schema</task>
<task type="checkpoint:human-verify">ตรวจสอบ schema</task>
<task type="auto">สร้าง API</task>
<task type="checkpoint:human-verify">ตรวจสอบ API</task>
```
ทำไมไม่ดี: Verification fatigue รวมเป็น checkpoint เดียวตอนท้าย

**ดี: Claude ทำอัตโนมัติ, มนุษย์ยืนยันครั้งเดียว**
```xml
<task type="auto">สร้าง schema</task>
<task type="auto">สร้าง API</task>
<task type="auto">สร้าง UI</task>

<task type="checkpoint:human-verify">
  <what-built>Complete auth flow</what-built>
  <how-to-verify>ทดสอบ flow ทั้งหมด: register, login, เข้าถึง protected page</how-to-verify>
</task>
```

</anti_patterns>

<summary>

**กฎทอง:** ถ้า Claude สามารถทำอัตโนมัติได้ Claude ต้องทำอัตโนมัติ

**ลำดับความสำคัญ Checkpoint:**
1. **checkpoint:human-verify** (90%) - Claude ทำอัตโนมัติ, มนุษย์ยืนยันความถูกต้อง visual/functional
2. **checkpoint:decision** (9%) - มนุษย์เลือก architectural/technology
3. **checkpoint:human-action** (1%) - ขั้นตอน manual ที่หลีกเลี่ยงไม่ได้จริงๆ ที่ไม่มี API/CLI

**เมื่อไม่ใช้ checkpoints:**
- สิ่งที่ Claude ตรวจสอบได้ทาง programmatic (tests, builds)
- File operations (Claude อ่าน/เขียนได้)
- อะไรก็ตามที่มี CLI/API

</summary>
