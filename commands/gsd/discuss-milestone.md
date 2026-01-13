---
name: gsd:discuss-milestone
description: รวบรวม context สำหรับ milestone ถัดไปผ่านการถามคำถามแบบปรับตัว
---

<objective>
ช่วยคุณหาว่าจะสร้างอะไรใน milestone ถัดไปผ่านการคิดร่วมกัน

วัตถุประสงค์: หลังจาก milestone เสร็จ สำรวจว่าคุณต้องการเพิ่ม ปรับปรุง หรือแก้ไขฟีเจอร์อะไร ฟีเจอร์มาก่อน — scope และ phases มาจากสิ่งที่คุณต้องการสร้าง
Output: รวบรวม context แล้ว จากนั้น route ไปยัง /gsd:new-milestone
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/discuss-milestone.md
</execution_context>

<context>
**โหลด project state ก่อน:**
@.planning/STATE.md

**โหลด roadmap:**
@.planning/ROADMAP.md

**โหลด milestones (ถ้ามี):**
@.planning/MILESTONES.md
</context>

<process>
1. ตรวจสอบว่า milestone ก่อนหน้าเสร็จแล้ว (หรือรับทราบ milestone ที่ active อยู่)
2. แสดง context จาก milestone ก่อนหน้า (accomplishments, จำนวน phases)
3. ทำตาม discuss-milestone.md workflow โดย**ทุกคำถามใช้ AskUserQuestion**:
   - ใช้ AskUserQuestion: "คุณต้องการเพิ่ม ปรับปรุง หรือแก้ไขอะไร?" พร้อม feature categories
   - ใช้ AskUserQuestion เพื่อขุดลึกเรื่องฟีเจอร์ที่พูดถึง
   - ใช้ AskUserQuestion เพื่อช่วยให้พูดออกมาว่าอะไรสำคัญที่สุด
   - ใช้ AskUserQuestion สำหรับ decision gate (พร้อม / ถามเพิ่ม / ขอเพิ่ม context)
4. ส่งต่อไปยัง /gsd:new-milestone พร้อม context ที่รวบรวม

**สำคัญมาก: ทุกคำถามใช้ AskUserQuestion อย่าถามคำถาม inline text**
</process>

<success_criteria>

- โหลดและแสดง project state แล้ว
- สรุป context ของ milestone ก่อนหน้าแล้ว
- รวบรวม milestone scope ผ่านการถามคำถามแบบปรับตัว
- ส่งต่อ context ไปยัง /gsd:new-milestone แล้ว
  </success_criteria>
