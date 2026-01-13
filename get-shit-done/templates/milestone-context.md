# เทมเพลต Milestone Context

เทมเพลตสำหรับ `.planning/MILESTONE-CONTEXT.md` - ไฟล์ handoff ชั่วคราวจาก discuss-milestone ไปยัง create-milestone

**วัตถุประสงค์:** เก็บรักษา context การสนทนา milestone เพื่อให้สามารถใช้ `/clear` ระหว่างคำสั่งได้ ไฟล์นี้จะถูกใช้โดย `/gsd:new-milestone` และลบหลังจากสร้าง milestone แล้ว

---

## เทมเพลตไฟล์

```markdown
# Milestone Context

**สร้างเมื่อ:** [วันที่]
**สถานะ:** พร้อมสำหรับ /gsd:new-milestone

<features>
## ฟีเจอร์ที่จะสร้าง

[ฟีเจอร์ที่ระบุระหว่างการสนทนา - เนื้อหาหลักของ milestone นี้]

- **[ฟีเจอร์ 1]**: [คำอธิบาย]
- **[ฟีเจอร์ 2]**: [คำอธิบาย]
- **[ฟีเจอร์ 3]**: [คำอธิบาย]

</features>

<scope>
## ขอบเขต

**ชื่อที่แนะนำ:** v[X.Y] [Theme Name]
**จำนวนเฟสโดยประมาณ:** [N]
**จุดเน้น:** [หนึ่งประโยคสรุป theme/focus]

</scope>

<phase_mapping>
## การจับคู่เฟส

[ฟีเจอร์จับคู่กับเฟสอย่างไร - breakdown คร่าวๆ]

- เฟส [N]: [ฟีเจอร์/เป้าหมาย]
- เฟส [N+1]: [ฟีเจอร์/เป้าหมาย]
- เฟส [N+2]: [ฟีเจอร์/เป้าหมาย]

</phase_mapping>

<constraints>
## ข้อจำกัด

[ข้อจำกัดหรือขอบเขตใดๆ ที่กล่าวถึงระหว่างการสนทนา]

- [ข้อจำกัด 1]
- [ข้อจำกัด 2]

</constraints>

<notes>
## Context เพิ่มเติม

[สิ่งอื่นๆ ที่บันทึกระหว่างการสนทนาที่เป็นข้อมูลให้ milestone]

</notes>

---

*ไฟล์นี้เป็นไฟล์ชั่วคราว จะถูกลบหลังจาก /gsd:new-milestone สร้าง milestone แล้ว*
```

<guidelines>
**นี่คือ handoff artifact ไม่ใช่เอกสารถาวร**

ไฟล์นี้มีอยู่เพียงเพื่อส่งผ่าน context จาก `discuss-milestone` ไปยัง `create-milestone` ข้าม `/clear` boundary

**วงจรชีวิต:**
1. `/gsd:discuss-milestone` สร้างไฟล์นี้เมื่อจบการสนทนา
2. ผู้ใช้รัน `/clear` (ปลอดภัยแล้ว - context ถูกเก็บรักษาไว้)
3. `/gsd:new-milestone` อ่านไฟล์นี้
4. `/gsd:new-milestone` ใช้ context เพื่อเติมข้อมูล milestone
5. `/gsd:new-milestone` ลบไฟล์นี้หลังจากสร้างสำเร็จ

**เนื้อหาควรรวม:**
- ฟีเจอร์ที่ระบุ (แกนหลักของสิ่งที่จะสร้าง)
- ชื่อ/theme ที่แนะนำสำหรับ milestone
- การจับคู่เฟสคร่าวๆ
- ข้อจำกัดหรือขอบเขตใดๆ
- โน้ตจากการสนทนา

**เนื้อหาไม่ควรรวม:**
- การวิเคราะห์เชิงเทคนิค (มาระหว่าง phase research)
- รายละเอียดเฟสโดยละเอียด (create-milestone จัดการเอง)
- รายละเอียดการ implementation
</guidelines>
