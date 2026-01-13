# เทมเพลต Codebase Concerns

เทมเพลตสำหรับ `.planning/codebase/CONCERNS.md` - บันทึกปัญหาที่รู้จักและพื้นที่ที่ต้องระวัง

**วัตถุประสงค์:** แสดง actionable warnings เกี่ยวกับ codebase เน้นที่ "ต้องระวังอะไรเมื่อทำการเปลี่ยนแปลง"

---

## เทมเพลตไฟล์

```markdown
# Codebase Concerns

**วันที่วิเคราะห์:** [YYYY-MM-DD]

## Tech Debt

**[พื้นที่/Component]:**
- ปัญหา: [อะไรคือ shortcut/workaround]
- ทำไม: [ทำไมทำแบบนี้]
- ผลกระทบ: [อะไรพังหรือแย่ลงเพราะมัน]
- แนวทางแก้ไข: [วิธี address อย่างถูกต้อง]

**[พื้นที่/Component]:**
- ปัญหา: [อะไรคือ shortcut/workaround]
- ทำไม: [ทำไมทำแบบนี้]
- ผลกระทบ: [อะไรพังหรือแย่ลงเพราะมัน]
- แนวทางแก้ไข: [วิธี address อย่างถูกต้อง]

## Known Bugs

**[คำอธิบาย Bug]:**
- อาการ: [อะไรเกิดขึ้น]
- Trigger: [วิธีทำซ้ำ]
- Workaround: [mitigation ชั่วคราวถ้ามี]
- สาเหตุ: [ถ้ารู้]
- Blocked by: [ถ้ารออะไรอยู่]

**[คำอธิบาย Bug]:**
- อาการ: [อะไรเกิดขึ้น]
- Trigger: [วิธีทำซ้ำ]
- Workaround: [mitigation ชั่วคราวถ้ามี]
- สาเหตุ: [ถ้ารู้]

## Security Considerations

**[พื้นที่ที่ต้องระวัง security]:**
- ความเสี่ยง: [อะไรอาจผิดพลาด]
- Mitigation ปัจจุบัน: [อะไรมีอยู่ตอนนี้]
- คำแนะนำ: [อะไรควรเพิ่ม]

**[พื้นที่ที่ต้องระวัง security]:**
- ความเสี่ยง: [อะไรอาจผิดพลาด]
- Mitigation ปัจจุบัน: [อะไรมีอยู่ตอนนี้]
- คำแนะนำ: [อะไรควรเพิ่ม]

## Performance Bottlenecks

**[Operation/endpoint ที่ช้า]:**
- ปัญหา: [อะไรช้า]
- การวัด: [ตัวเลขจริง: "500ms p95", "2s load time"]
- สาเหตุ: [ทำไมช้า]
- แนวทางปรับปรุง: [วิธีเร่งความเร็ว]

**[Operation/endpoint ที่ช้า]:**
- ปัญหา: [อะไรช้า]
- การวัด: [ตัวเลขจริง]
- สาเหตุ: [ทำไมช้า]
- แนวทางปรับปรุง: [วิธีเร่งความเร็ว]

## Fragile Areas

**[Component/Module]:**
- ทำไมเปราะบาง: [อะไรทำให้พังง่าย]
- ความล้มเหลวทั่วไป: [อะไรมักผิดพลาด]
- การแก้ไขอย่างปลอดภัย: [วิธีเปลี่ยนโดยไม่พัง]
- Test coverage: [มี test ไหม? gaps?]

**[Component/Module]:**
- ทำไมเปราะบาง: [อะไรทำให้พังง่าย]
- ความล้มเหลวทั่วไป: [อะไรมักผิดพลาด]
- การแก้ไขอย่างปลอดภัย: [วิธีเปลี่ยนโดยไม่พัง]
- Test coverage: [มี test ไหม? gaps?]

## Scaling Limits

**[Resource/System]:**
- ความจุปัจจุบัน: [ตัวเลข: "100 req/sec", "10k users"]
- ขีดจำกัด: [ที่ไหนที่มันพัง]
- อาการที่ขีดจำกัด: [อะไรเกิดขึ้น]
- แนวทาง scaling: [วิธีเพิ่ม capacity]

## Dependencies at Risk

**[Package/Service]:**
- ความเสี่ยง: [เช่น "deprecated", "unmaintained", "breaking changes coming"]
- ผลกระทบ: [อะไรพังถ้ามันล้มเหลว]
- Migration plan: [ทางเลือกหรือแนวทาง upgrade]

## Missing Critical Features

**[Feature gap]:**
- ปัญหา: [อะไรหายไป]
- Workaround ปัจจุบัน: [ผู้ใช้รับมืออย่างไร]
- Blocks: [อะไรทำไม่ได้หากไม่มีมัน]
- Implementation complexity: [ประมาณ effort คร่าวๆ]

## Test Coverage Gaps

**[พื้นที่ที่ไม่ได้ test]:**
- อะไรไม่ได้ test: [Functionality เฉพาะ]
- ความเสี่ยง: [อะไรอาจพังโดยไม่รู้]
- Priority: [High/Medium/Low]
- Difficulty to test: [ทำไมยังไม่ได้ test]

---

*Concerns audit: [วันที่]*
*อัปเดตเมื่อปัญหาถูกแก้ไขหรือค้นพบใหม่*
```

<good_examples>
```markdown
# Codebase Concerns

**วันที่วิเคราะห์:** 2025-01-20

## Tech Debt

**Database queries ใน React components:**
- ปัญหา: Direct Supabase queries ใน 15+ page components แทนที่จะใช้ server actions
- ไฟล์: `app/dashboard/page.tsx`, `app/profile/page.tsx`, `app/courses/[id]/page.tsx`, `app/settings/page.tsx` (และอีก 11 ใน `app/`)
- ทำไม: Rapid prototyping ระหว่าง MVP phase
- ผลกระทบ: Implement RLS อย่างถูกต้องไม่ได้, expose DB structure ให้ client
- แนวทางแก้ไข: ย้าย queries ทั้งหมดไปยัง server actions ใน `app/actions/`, เพิ่ม proper RLS policies

**Manual webhook signature validation:**
- ปัญหา: Copy-pasted Stripe webhook verification code ใน 3 endpoints ต่างกัน
- ไฟล์: `app/api/webhooks/stripe/route.ts`, `app/api/webhooks/checkout/route.ts`, `app/api/webhooks/subscription/route.ts`
- ทำไม: แต่ละ webhook เพิ่ม ad-hoc โดยไม่มี abstraction
- ผลกระทบ: ง่ายที่จะพลาด verification ใน webhooks ใหม่ (security risk)
- แนวทางแก้ไข: สร้าง shared `lib/stripe/validate-webhook.ts` middleware

## Known Bugs

**Race condition ใน subscription updates:**
- อาการ: ผู้ใช้แสดงเป็น "free" tier เป็นเวลา 5-10 วินาทีหลังจาก payment สำเร็จ
- Trigger: Fast navigation หลัง Stripe checkout redirect ก่อน webhook processes
- ไฟล์: `app/checkout/success/page.tsx` (redirect handler), `app/api/webhooks/stripe/route.ts` (webhook)
- Workaround: Stripe webhook ในที่สุดอัปเดต status (self-heals)
- สาเหตุ: Webhook processing ช้ากว่า user navigation ไม่มี optimistic UI update
- แก้ไข: เพิ่ม polling ใน `app/checkout/success/page.tsx` หลัง redirect

**Inconsistent session state หลัง logout:**
- อาการ: ผู้ใช้ถูก redirect ไปยัง /dashboard หลัง logout แทนที่จะเป็น /login
- Trigger: Logout ผ่านปุ่มใน mobile nav (desktop ทำงานปกติ)
- ไฟล์: `components/MobileNav.tsx` (บรรทัด ~45, logout handler)
- Workaround: Manual URL navigation ไปยัง /login ทำงาน
- สาเหตุ: Mobile nav component ไม่ได้ await supabase.auth.signOut()
- แก้ไข: เพิ่ม await ให้ logout handler ใน `components/MobileNav.tsx`

## Security Considerations

**Admin role check client-side only:**
- ความเสี่ยง: Admin dashboard pages ตรวจสอบ isAdmin จาก Supabase client ไม่มี server verification
- ไฟล์: `app/admin/page.tsx`, `app/admin/users/page.tsx`, `components/AdminGuard.tsx`
- Mitigation ปัจจุบัน: ไม่มี (พึ่งพา UI hiding)
- คำแนะนำ: เพิ่ม middleware ให้ admin routes ใน `middleware.ts`, verify role server-side

**Unvalidated file uploads:**
- ความเสี่ยง: ผู้ใช้สามารถ upload file type ใดก็ได้ไปยัง avatar bucket (ไม่มี size/type validation)
- ไฟล์: `components/AvatarUpload.tsx` (upload handler)
- Mitigation ปัจจุบัน: Supabase bucket จำกัด 2MB (configured ใน dashboard)
- คำแนะนำ: เพิ่ม file type validation (image/* only) ใน `lib/storage/validate.ts`

## Performance Bottlenecks

**/api/courses endpoint:**
- ปัญหา: Fetching courses ทั้งหมดพร้อม nested lessons และ authors
- ไฟล์: `app/api/courses/route.ts`
- การวัด: 1.2s p95 response time กับ 50+ courses
- สาเหตุ: N+1 query pattern (query แยกต่อ course สำหรับ lessons)
- แนวทางปรับปรุง: ใช้ Prisma include เพื่อ eager-load lessons ใน `lib/db/courses.ts`, เพิ่ม Redis caching

**Dashboard initial load:**
- ปัญหา: Waterfall ของ 5 serial API calls เมื่อ mount
- ไฟล์: `app/dashboard/page.tsx`
- การวัด: 3.5s จนถึง interactive บน slow 3G
- สาเหตุ: แต่ละ component fetch data ของตัวเองแยกกัน
- แนวทางปรับปรุง: แปลงเป็น Server Component พร้อม single parallel fetch

## Fragile Areas

**Authentication middleware chain:**
- ไฟล์: `middleware.ts`
- ทำไมเปราะบาง: 4 middleware functions ต่างกันรันตามลำดับเฉพาะ (auth -> role -> subscription -> logging)
- ความล้มเหลวทั่วไป: Middleware order เปลี่ยนแล้วทุกอย่างพัง debug ยาก
- การแก้ไขอย่างปลอดภัย: เพิ่ม tests ก่อนเปลี่ยน order, document dependencies ใน comments
- Test coverage: ไม่มี integration tests สำหรับ middleware chain (มีแค่ unit tests)

**Stripe webhook event handling:**
- ไฟล์: `app/api/webhooks/stripe/route.ts`
- ทำไมเปราะบาง: Giant switch statement กับ 12 event types, shared transaction logic
- ความล้มเหลวทั่วไป: Event type ใหม่เพิ่มโดยไม่ handle, partial DB updates เมื่อ error
- การแก้ไขอย่างปลอดภัย: Extract แต่ละ event handler ไปยัง `lib/stripe/handlers/*.ts`
- Test coverage: แค่ 3 จาก 12 event types มี tests

## Scaling Limits

**Supabase Free Tier:**
- ความจุปัจจุบัน: 500MB database, 1GB file storage, 2GB bandwidth/เดือน
- ขีดจำกัด: ~5000 users ประมาณก่อนถึง limits
- อาการที่ขีดจำกัด: 429 rate limit errors, DB writes fail
- แนวทาง scaling: Upgrade เป็น Pro ($25/เดือน) extends ไปยัง 8GB DB, 100GB storage

**Server-side render blocking:**
- ความจุปัจจุบัน: ~50 concurrent users ก่อน slowdown
- ขีดจำกัด: Vercel Hobby plan (10s function timeout, 100GB-hrs/เดือน)
- อาการที่ขีดจำกัด: 504 gateway timeouts บน course pages
- แนวทาง scaling: Upgrade เป็น Vercel Pro ($20/เดือน), เพิ่ม edge caching

## Dependencies at Risk

**react-hot-toast:**
- ความเสี่ยง: Unmaintained (last update 18 เดือนที่แล้ว), React 19 compatibility ไม่รู้
- ผลกระทบ: Toast notifications พัง ไม่มี graceful degradation
- Migration plan: เปลี่ยนไปใช้ sonner (actively maintained, similar API)

## Missing Critical Features

**Payment failure handling:**
- ปัญหา: ไม่มี retry mechanism หรือ user notification เมื่อ subscription payment ล้มเหลว
- Workaround ปัจจุบัน: ผู้ใช้ manual re-enter payment info (ถ้าสังเกตเห็น)
- Blocks: รักษาผู้ใช้ที่ cards expired ไม่ได้, ไม่มี dunning process
- Implementation complexity: Medium (Stripe webhooks + email flow + UI)

**Course progress tracking:**
- ปัญหา: ไม่มี persistent state สำหรับ lessons ที่เสร็จไปแล้ว
- Workaround ปัจจุบัน: ผู้ใช้ manual track progress
- Blocks: แสดง completion percentage ไม่ได้, แนะนำ next lesson ไม่ได้
- Implementation complexity: Low (เพิ่ม completed_lessons junction table)

## Test Coverage Gaps

**Payment flow end-to-end:**
- อะไรไม่ได้ test: Full Stripe checkout -> webhook -> subscription activation flow
- ความเสี่ยง: Payment processing อาจพังเงียบๆ (เคยเกิดสองครั้ง)
- Priority: High
- Difficulty to test: ต้อง Stripe test fixtures และ webhook simulation setup

**Error boundary behavior:**
- อะไรไม่ได้ test: App behaves อย่างไรเมื่อ components throw errors
- ความเสี่ยง: White screen of death สำหรับผู้ใช้, ไม่มี error reporting
- Priority: Medium
- Difficulty to test: ต้อง intentionally trigger errors ใน test environment

---

*Concerns audit: 2025-01-20*
*อัปเดตเมื่อปัญหาถูกแก้ไขหรือค้นพบใหม่*
```
</good_examples>

<guidelines>
**อะไรควรอยู่ใน CONCERNS.md:**
- Tech debt พร้อม clear impact และ fix approach
- Known bugs พร้อม reproduction steps
- Security gaps และ mitigation recommendations
- Performance bottlenecks พร้อม measurements
- Fragile code ที่พังง่าย
- Scaling limits พร้อมตัวเลข
- Dependencies ที่ต้องการความสนใจ
- Missing features ที่ block workflows
- Test coverage gaps

**อะไรไม่ควรอยู่ที่นี่:**
- ความคิดเห็นโดยไม่มีหลักฐาน ("code is messy")
- ข้อร้องเรียนโดยไม่มี solutions ("auth sucks")
- Future feature ideas (นั่นสำหรับ product planning)
- TODOs ปกติ (อยู่ใน code comments)
- Architectural decisions ที่ทำงานดี
- Minor code style issues

**เมื่อกรอกเทมเพลตนี้:**
- **รวม file paths เสมอ** - Concerns ที่ไม่มีตำแหน่งไม่ actionable ใช้ backticks: `src/file.ts`
- เจาะจงพร้อม measurements ("500ms p95" ไม่ใช่ "slow")
- รวม reproduction steps สำหรับ bugs
- แนะนำ fix approaches ไม่ใช่แค่ปัญหา
- เน้นที่ actionable items
- จัดลำดับตาม risk/impact
- อัปเดตเมื่อ issues ถูกแก้ไข
- เพิ่ม concerns ใหม่เมื่อค้นพบ

**แนวทาง Tone:**
- Professional ไม่ใช่ emotional ("N+1 query pattern" ไม่ใช่ "terrible queries")
- Solution-oriented ("Fix: add index" ไม่ใช่ "needs fixing")
- Risk-focused ("Could expose user data" ไม่ใช่ "security is bad")
- Factual ("3.5s load time" ไม่ใช่ "really slow")

**มีประโยชน์สำหรับ phase planning เมื่อ:**
- ตัดสินใจจะทำอะไรต่อไป
- ประมาณ risk ของ changes
- เข้าใจที่ไหนต้องระวัง
- จัดลำดับ improvements
- Onboarding new Claude contexts
- วางแผน refactoring work

**สิ่งนี้ถูก populated อย่างไร:**
Explore agents ตรวจจับสิ่งเหล่านี้ระหว่าง codebase mapping Manual additions ยินดีต้อนรับสำหรับ human-discovered issues นี่คือ living documentation ไม่ใช่ complaint list
</guidelines>
