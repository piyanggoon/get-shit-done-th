# เทมเพลต Research

เทมเพลตสำหรับ `.planning/phases/XX-name/{phase}-RESEARCH.md` - การวิจัย ecosystem แบบครอบคลุมก่อนการวางแผน

**วัตถุประสงค์:** บันทึกสิ่งที่ Claude จำเป็นต้องรู้เพื่อ implement เฟสได้ดี - ไม่ใช่แค่ "library ไหน" แต่ "ผู้เชี่ยวชาญสร้างสิ่งนี้อย่างไร"

---

## เทมเพลตไฟล์

```markdown
# เฟส [X]: [ชื่อ] - Research

**วันที่วิจัย:** [วันที่]
**โดเมน:** [เทคโนโลยีหลัก/problem domain]
**ความมั่นใจ:** [HIGH/MEDIUM/LOW]

<research_summary>
## สรุป

[สรุปผู้บริหาร 2-3 ย่อหน้า]
- สิ่งที่วิจัย
- แนวทางมาตรฐานคืออะไร
- คำแนะนำสำคัญ

**คำแนะนำหลัก:** [หนึ่งบรรทัด guidance ที่ actionable]
</research_summary>

<standard_stack>
## Standard Stack

libraries/tools ที่เป็นมาตรฐานสำหรับโดเมนนี้:

### Core
| Library | Version | วัตถุประสงค์ | ทำไมเป็นมาตรฐาน |
|---------|---------|---------|--------------|
| [ชื่อ] | [ver] | [ทำอะไร] | [ทำไมผู้เชี่ยวชาญใช้] |
| [ชื่อ] | [ver] | [ทำอะไร] | [ทำไมผู้เชี่ยวชาญใช้] |

### Supporting
| Library | Version | วัตถุประสงค์ | เมื่อไหร่ใช้ |
|---------|---------|---------|-------------|
| [ชื่อ] | [ver] | [ทำอะไร] | [use case] |
| [ชื่อ] | [ver] | [ทำอะไร] | [use case] |

### Alternatives ที่พิจารณา
| แทนที่ | อาจใช้ | Tradeoff |
|------------|-----------|----------|
| [มาตรฐาน] | [ทางเลือก] | [เมื่อไหร่ทางเลือกเหมาะสม] |

**การติดตั้ง:**
```bash
npm install [packages]
# หรือ
yarn add [packages]
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### โครงสร้างโปรเจกต์ที่แนะนำ
```
src/
├── [folder]/        # [วัตถุประสงค์]
├── [folder]/        # [วัตถุประสงค์]
└── [folder]/        # [วัตถุประสงค์]
```

### Pattern 1: [ชื่อ Pattern]
**อะไร:** [คำอธิบาย]
**เมื่อไหร่ใช้:** [เงื่อนไข]
**ตัวอย่าง:**
```typescript
// [ตัวอย่างโค้ดจาก Context7/official docs]
```

### Pattern 2: [ชื่อ Pattern]
**อะไร:** [คำอธิบาย]
**เมื่อไหร่ใช้:** [เงื่อนไข]
**ตัวอย่าง:**
```typescript
// [ตัวอย่างโค้ด]
```

### Anti-Patterns ที่ควรหลีกเลี่ยง
- **[Anti-pattern]:** [ทำไมไม่ดี ควรทำอะไรแทน]
- **[Anti-pattern]:** [ทำไมไม่ดี ควรทำอะไรแทน]
</architecture_patterns>

<dont_hand_roll>
## อย่าเขียนเอง

ปัญหาที่ดูง่ายแต่มี solutions อยู่แล้ว:

| ปัญหา | อย่าสร้าง | ใช้แทน | ทำไม |
|---------|-------------|-------------|-----|
| [ปัญหา] | [สิ่งที่คุณจะสร้าง] | [library] | [edge cases, complexity] |
| [ปัญหา] | [สิ่งที่คุณจะสร้าง] | [library] | [edge cases, complexity] |
| [ปัญหา] | [สิ่งที่คุณจะสร้าง] | [library] | [edge cases, complexity] |

**Insight สำคัญ:** [ทำไม custom solutions แย่กว่าในโดเมนนี้]
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: [ชื่อ]
**ผิดพลาดอะไร:** [คำอธิบาย]
**ทำไมเกิด:** [สาเหตุหลัก]
**วิธีหลีกเลี่ยง:** [กลยุทธ์ป้องกัน]
**สัญญาณเตือน:** [วิธีตรวจจับเร็ว]

### Pitfall 2: [ชื่อ]
**ผิดพลาดอะไร:** [คำอธิบาย]
**ทำไมเกิด:** [สาเหตุหลัก]
**วิธีหลีกเลี่ยง:** [กลยุทธ์ป้องกัน]
**สัญญาณเตือน:** [วิธีตรวจจับเร็ว]

### Pitfall 3: [ชื่อ]
**ผิดพลาดอะไร:** [คำอธิบาย]
**ทำไมเกิด:** [สาเหตุหลัก]
**วิธีหลีกเลี่ยง:** [กลยุทธ์ป้องกัน]
**สัญญาณเตือน:** [วิธีตรวจจับเร็ว]
</common_pitfalls>

<code_examples>
## ตัวอย่างโค้ด

Patterns ที่ verified จาก official sources:

### [Common Operation 1]
```typescript
// Source: [Context7/official docs URL]
[code]
```

### [Common Operation 2]
```typescript
// Source: [Context7/official docs URL]
[code]
```

### [Common Operation 3]
```typescript
// Source: [Context7/official docs URL]
[code]
```
</code_examples>

<sota_updates>
## State of the Art (2024-2025)

อะไรเปลี่ยนล่าสุด:

| แนวทางเก่า | แนวทางปัจจุบัน | เปลี่ยนเมื่อไหร่ | ผลกระทบ |
|--------------|------------------|--------------|--------|
| [เก่า] | [ใหม่] | [วันที่/version] | [หมายถึงอะไรสำหรับ implementation] |

**เครื่องมือ/patterns ใหม่ที่ควรพิจารณา:**
- [Tool/Pattern]: [เปิดใช้อะไร เมื่อไหร่ใช้]
- [Tool/Pattern]: [เปิดใช้อะไร เมื่อไหร่ใช้]

**Deprecated/outdated:**
- [สิ่ง]: [ทำไม outdated อะไรแทนที่]
</sota_updates>

<open_questions>
## คำถามที่ยังเปิดอยู่

สิ่งที่ไม่สามารถแก้ไขได้อย่างสมบูรณ์:

1. **[คำถาม]**
   - สิ่งที่เรารู้: [ข้อมูลบางส่วน]
   - สิ่งที่ไม่ชัด: [ช่องว่าง]
   - คำแนะนำ: [วิธีจัดการระหว่างการวางแผน/execution]

2. **[คำถาม]**
   - สิ่งที่เรารู้: [ข้อมูลบางส่วน]
   - สิ่งที่ไม่ชัด: [ช่องว่าง]
   - คำแนะนำ: [วิธีจัดการ]
</open_questions>

<sources>
## แหล่งข้อมูล

### Primary (HIGH confidence)
- [Context7 library ID] - [topics fetched]
- [Official docs URL] - [สิ่งที่ตรวจสอบ]

### Secondary (MEDIUM confidence)
- [WebSearch verified with official source] - [finding + verification]

### Tertiary (LOW confidence - ต้อง validation)
- [WebSearch only] - [finding ต้อง validation ระหว่าง implementation]
</sources>

<metadata>
## Metadata

**ขอบเขต Research:**
- Core technology: [อะไร]
- Ecosystem: [libraries ที่สำรวจ]
- Patterns: [patterns ที่วิจัย]
- Pitfalls: [areas ที่ตรวจสอบ]

**Confidence breakdown:**
- Standard stack: [HIGH/MEDIUM/LOW] - [เหตุผล]
- Architecture: [HIGH/MEDIUM/LOW] - [เหตุผล]
- Pitfalls: [HIGH/MEDIUM/LOW] - [เหตุผล]
- Code examples: [HIGH/MEDIUM/LOW] - [เหตุผล]

**วันที่วิจัย:** [วันที่]
**ใช้ได้ถึง:** [ประมาณ - 30 วันสำหรับ tech ที่ stable, 7 วันสำหรับ fast-moving]
</metadata>

---

*เฟส: XX-name*
*Research เสร็จ: [วันที่]*
*พร้อมสำหรับการวางแผน: [yes/no]*
```

---

## ตัวอย่างที่ดี

```markdown
# เฟส 3: 3D City Driving - Research

**วันที่วิจัย:** 2025-01-20
**โดเมน:** Three.js 3D web game พร้อม driving mechanics
**ความมั่นใจ:** HIGH

<research_summary>
## สรุป

วิจัย Three.js ecosystem สำหรับการสร้าง 3D city driving game แนวทางมาตรฐานใช้ Three.js พร้อม React Three Fiber สำหรับ component architecture, Rapier สำหรับ physics และ drei สำหรับ common helpers

Finding สำคัญ: อย่าเขียน physics หรือ collision detection เอง Rapier (ผ่าน @react-three/rapier) จัดการ vehicle physics, terrain collision และ city object interactions อย่างมีประสิทธิภาพ Custom physics code นำไปสู่ bugs และปัญหา performance

**คำแนะนำหลัก:** ใช้ R3F + Rapier + drei stack เริ่มด้วย vehicle controller จาก drei เพิ่ม Rapier vehicle physics สร้างเมืองด้วย instanced meshes เพื่อ performance
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | วัตถุประสงค์ | ทำไมเป็นมาตรฐาน |
|---------|---------|---------|--------------|
| three | 0.160.0 | 3D rendering | มาตรฐานสำหรับ web 3D |
| @react-three/fiber | 8.15.0 | React renderer สำหรับ Three.js | Declarative 3D, DX ดีกว่า |
| @react-three/drei | 9.92.0 | Helpers และ abstractions | แก้ปัญหาทั่วไป |
| @react-three/rapier | 1.2.1 | Physics engine bindings | Physics ที่ดีที่สุดสำหรับ R3F |

### Supporting
| Library | Version | วัตถุประสงค์ | เมื่อไหร่ใช้ |
|---------|---------|---------|-------------|
| @react-three/postprocessing | 2.16.0 | Visual effects | Bloom, DOF, motion blur |
| leva | 0.9.35 | Debug UI | Tweaking parameters |
| zustand | 4.4.7 | State management | Game state, UI state |
| use-sound | 4.0.1 | Audio | Engine sounds, ambient |

### Alternatives ที่พิจารณา
| แทนที่ | อาจใช้ | Tradeoff |
|------------|-----------|----------|
| Rapier | Cannon.js | Cannon ง่ายกว่าแต่ performant น้อยกว่าสำหรับ vehicles |
| R3F | Vanilla Three | Vanilla ถ้าไม่มี React แต่ R3F DX ดีกว่ามาก |
| drei | Custom helpers | drei ผ่านการทดสอบแล้ว อย่าคิดค้นใหม่ |

**การติดตั้ง:**
```bash
npm install three @react-three/fiber @react-three/drei @react-three/rapier zustand
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### โครงสร้างโปรเจกต์ที่แนะนำ
```
src/
├── components/
│   ├── Vehicle/          # รถผู้เล่นพร้อม physics
│   ├── City/             # City generation และอาคาร
│   ├── Road/             # Road network
│   └── Environment/      # Sky, lighting, fog
├── hooks/
│   ├── useVehicleControls.ts
│   └── useGameState.ts
├── stores/
│   └── gameStore.ts      # Zustand state
└── utils/
    └── cityGenerator.ts  # Procedural generation helpers
```

### Pattern 1: Vehicle พร้อม Rapier Physics
**อะไร:** ใช้ RigidBody พร้อม vehicle-specific settings ไม่ใช่ custom physics
**เมื่อไหร่ใช้:** ground vehicle ใดๆ
**ตัวอย่าง:**
```typescript
// Source: @react-three/rapier docs
import { RigidBody, useRapier } from '@react-three/rapier'

function Vehicle() {
  const rigidBody = useRef()

  return (
    <RigidBody
      ref={rigidBody}
      type="dynamic"
      colliders="hull"
      mass={1500}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh>
        <boxGeometry args={[2, 1, 4]} />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  )
}
```

### Pattern 2: Instanced Meshes สำหรับเมือง
**อะไร:** ใช้ InstancedMesh สำหรับ objects ที่ซ้ำกัน (อาคาร, ต้นไม้, props)
**เมื่อไหร่ใช้:** >100 objects ที่คล้ายกัน
**ตัวอย่าง:**
```typescript
// Source: drei docs
import { Instances, Instance } from '@react-three/drei'

function Buildings({ positions }) {
  return (
    <Instances limit={1000}>
      <boxGeometry />
      <meshStandardMaterial />
      {positions.map((pos, i) => (
        <Instance key={i} position={pos} scale={[1, Math.random() * 5 + 1, 1]} />
      ))}
    </Instances>
  )
}
```

### Anti-Patterns ที่ควรหลีกเลี่ยง
- **สร้าง meshes ใน render loop:** สร้างครั้งเดียว อัปเดตแค่ transforms
- **ไม่ใช้ InstancedMesh:** Individual meshes สำหรับอาคารฆ่า performance
- **Custom physics math:** Rapier จัดการได้ดีกว่า ทุกครั้ง
</architecture_patterns>

<dont_hand_roll>
## อย่าเขียนเอง

| ปัญหา | อย่าสร้าง | ใช้แทน | ทำไม |
|---------|-------------|-------------|-----|
| Vehicle physics | Custom velocity/acceleration | Rapier RigidBody | Wheel friction, suspension, collisions ซับซ้อน |
| Collision detection | Raycasting ทุกอย่าง | Rapier colliders | Performance, edge cases, tunneling |
| Camera follow | Manual lerp | drei CameraControls หรือ custom พร้อม useFrame | Smooth interpolation, bounds |
| City generation | Pure random placement | Grid-based พร้อม noise สำหรับ variation | Random ดูผิด grid คาดเดาได้ |
| LOD | Manual distance checks | drei <Detailed> | จัดการ transitions, hysteresis |

**Insight สำคัญ:** 3D game development มีปัญหาที่แก้ไขแล้ว 40+ ปี Rapier implement proper physics simulation drei implement proper 3D helpers สู้กับสิ่งเหล่านี้นำไปสู่ bugs ที่ดูเหมือน "game feel" issues แต่จริงๆ คือ physics edge cases
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Physics Tunneling
**ผิดพลาดอะไร:** Objects เร็วทะลุกำแพง
**ทำไมเกิด:** Default physics step ใหญ่เกินไปสำหรับ velocity
**วิธีหลีกเลี่ยง:** ใช้ CCD (Continuous Collision Detection) ใน Rapier
**สัญญาณเตือน:** Objects ปรากฏนอกอาคารแบบสุ่ม

### Pitfall 2: Performance Death by Draw Calls
**ผิดพลาดอะไร:** เกมกระตุกเมื่อมีอาคารเยอะ
**ทำไมเกิด:** แต่ละ mesh = 1 draw call, หลายร้อยอาคาร = หลายร้อย calls
**วิธีหลีกเลี่ยง:** InstancedMesh สำหรับ objects ที่คล้ายกัน merge static geometry
**สัญญาณเตือน:** GPU bound, FPS ต่ำแม้ scene ง่าย

### Pitfall 3: Vehicle "ลอย" Feel
**ผิดพลาดอะไร:** รถไม่รู้สึกติดพื้น
**ทำไมเกิด:** ขาด proper wheel/suspension simulation
**วิธีหลีกเลี่ยง:** ใช้ Rapier vehicle controller หรือ tune mass/damping อย่างระมัดระวัง
**สัญญาณเตือน:** รถกระเด้งแปลกๆ ไม่ยึดเกาะโค้ง
</common_pitfalls>

<code_examples>
## ตัวอย่างโค้ด

### Basic R3F + Rapier Setup
```typescript
// Source: @react-three/rapier getting started
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'

function Game() {
  return (
    <Canvas>
      <Physics gravity={[0, -9.81, 0]}>
        <Vehicle />
        <City />
        <Ground />
      </Physics>
    </Canvas>
  )
}
```

### Vehicle Controls Hook
```typescript
// Source: Community pattern, verified with drei docs
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'

function useVehicleControls(rigidBodyRef) {
  const [, getKeys] = useKeyboardControls()

  useFrame(() => {
    const { forward, back, left, right } = getKeys()
    const body = rigidBodyRef.current
    if (!body) return

    const impulse = { x: 0, y: 0, z: 0 }
    if (forward) impulse.z -= 10
    if (back) impulse.z += 5

    body.applyImpulse(impulse, true)

    if (left) body.applyTorqueImpulse({ x: 0, y: 2, z: 0 }, true)
    if (right) body.applyTorqueImpulse({ x: 0, y: -2, z: 0 }, true)
  })
}
```
</code_examples>

<sota_updates>
## State of the Art (2024-2025)

| แนวทางเก่า | แนวทางปัจจุบัน | เปลี่ยนเมื่อไหร่ | ผลกระทบ |
|--------------|------------------|--------------|--------|
| cannon-es | Rapier | 2023 | Rapier เร็วกว่า maintain ดีกว่า |
| vanilla Three.js | React Three Fiber | 2020+ | R3F เป็นมาตรฐานสำหรับ React apps แล้ว |
| Manual InstancedMesh | drei <Instances> | 2022 | API ง่ายกว่า จัดการ updates |

**เครื่องมือ/patterns ใหม่ที่ควรพิจารณา:**
- **WebGPU:** กำลังมาแต่ยังไม่พร้อม production สำหรับเกม (2025)
- **drei Gltf helpers:** <useGLTF.preload> สำหรับ loading screens

**Deprecated/outdated:**
- **cannon.js (original):** ใช้ cannon-es fork หรือดีกว่า Rapier
- **Manual raycasting สำหรับ physics:** แค่ใช้ Rapier colliders
</sota_updates>

<sources>
## แหล่งข้อมูล

### Primary (HIGH confidence)
- /pmndrs/react-three-fiber - getting started, hooks, performance
- /pmndrs/drei - instances, controls, helpers
- /dimforge/rapier-js - physics setup, vehicle physics

### Secondary (MEDIUM confidence)
- Three.js discourse "city driving game" threads - verified patterns กับ docs
- R3F examples repository - verified code works

### Tertiary (LOW confidence - ต้อง validation)
- ไม่มี - findings ทั้งหมด verified
</sources>

<metadata>
## Metadata

**ขอบเขต Research:**
- Core technology: Three.js + React Three Fiber
- Ecosystem: Rapier, drei, zustand
- Patterns: Vehicle physics, instancing, city generation
- Pitfalls: Performance, physics, feel

**Confidence breakdown:**
- Standard stack: HIGH - verified กับ Context7 ใช้กันแพร่หลาย
- Architecture: HIGH - จาก official examples
- Pitfalls: HIGH - documented ใน discourse verified ใน docs
- Code examples: HIGH - จาก Context7/official sources

**วันที่วิจัย:** 2025-01-20
**ใช้ได้ถึง:** 2025-02-20 (30 วัน - R3F ecosystem stable)
</metadata>

---

*เฟส: 03-city-driving*
*Research เสร็จ: 2025-01-20*
*พร้อมสำหรับการวางแผน: yes*
```

---

## แนวทาง

**เมื่อไหร่ควรสร้าง:**
- ก่อนวางแผนเฟสใน niche/complex domains
- เมื่อ training data ของ Claude น่าจะ stale หรือ sparse
- เมื่อ "ผู้เชี่ยวชาญทำอย่างไร" สำคัญกว่า "library ไหน"

**โครงสร้าง:**
- ใช้ XML tags สำหรับ section markers (ตรงกับ GSD templates)
- เจ็ด core sections: summary, standard_stack, architecture_patterns, dont_hand_roll, common_pitfalls, code_examples, sources
- ทุก sections จำเป็น (ขับเคลื่อน comprehensive research)

**คุณภาพเนื้อหา:**
- Standard stack: versions ที่เจาะจง ไม่ใช่แค่ชื่อ
- Architecture: รวมตัวอย่างโค้ดจริงจาก authoritative sources
- Don't hand-roll: ระบุชัดเจนว่าปัญหาไหนไม่ควรแก้เอง
- Pitfalls: รวม warning signs ไม่ใช่แค่ "อย่าทำ"
- Sources: mark confidence levels อย่างซื่อสัตย์

**Integration กับการวางแผน:**
- RESEARCH.md load เป็น @context reference ใน PLAN.md
- Standard stack inform library choices
- Don't hand-roll ป้องกัน custom solutions
- Pitfalls inform verification criteria
- Code examples สามารถ reference ใน task actions

**หลังจากสร้าง:**
- ไฟล์อยู่ใน phase directory: `.planning/phases/XX-name/{phase}-RESEARCH.md`
- Reference ระหว่าง planning workflow
- plan-phase load อัตโนมัติเมื่อมีอยู่
