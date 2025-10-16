<template>
  <section class="skills-grid">
    <h3 class="title">Skills & Expertise</h3>

    <div ref="hoverTip" class="hover-tip" aria-hidden="true"></div>

    <ul class="grid">
      <li
        v-for="(skill, i) in skills"
        :key="skill.key || skill.label"
        class="tile"
        ref="tiles"
        :style="tileStyle(skill, i)"
        :data-label="skill.label"
      >
        <div class="glass" aria-hidden="true"></div>

        <div class="icon-wrap">
          <fa :icon="[skill.prefix || 'fas', skill.icon]" class="icon" />
        </div>
        <span class="label">{{ skill.label }}</span>
      </li>
    </ul>
  </section>
</template>

<script>
import { gsap } from 'gsap'

export default {
  name: 'SkillsPreset',
  data: () => ({
    skills: [
      { label:'Python', key:'python', color:'#3776AB', prefix:'fab', icon:'python' },
      { label:'TypeScript', key:'ts', color:'#3178C6', prefix:'fas', icon:'file-code' },
      { label:'Csharp', key:'csharp', color:'#239120', prefix:'fas', icon:'hashtag' },
      { label:'Node.js', key:'node', color:'#3C873A', prefix:'fab', icon:'node-js' },

      { label:'Git', key:'git', color:'#F05032', prefix:'fab', icon:'git-alt' },
      { label:'AWS', key:'aws', color:'#FF9900', prefix:'fab', icon:'aws' },
      { label:'React', key:'react', color:'#61DAFB', prefix:'fab', icon:'react' },
      { label:'VueJS', key:'vue', color:'#41B883', prefix:'fab', icon:'vuejs' },
      { label:'PHP', key:'php', color:'#5276D9', prefix:'fab', icon:'php' },

      { label:'Apache Spark',key:'spark', color:'#E25A1C', prefix:'fas', icon:'wand-magic-sparkles' },
      { label:'MySQL', key:'mysql', color:'#4479A1', prefix:'fas', icon:'database' },
      { label:'PyTorch', key:'pytorch', color:'#EE4C2C', prefix:'fas', icon:'fire-flame-curved' },
      { label:'Pandas', key:'pandas', color:'#150458', prefix:'fas', icon:'table-cells-large' },

      { label:'NumPy', key:'numpy', color:'#4D77CF', prefix:'fas', icon:'square-root-variable' },
      { label:'Metabase', key:'metabase', color:'#509EE3', prefix:'fas', icon:'chart-line' },
      { label:'TensorFlow', key:'tf', color:'#FF6F00', prefix:'fas', icon:'diagram-project' },
      { label:'Django', key:'django', color:'#092E20', prefix:'fas', icon:'leaf' },

      { label:'Jupyter', key:'jupyter', color:'#F37626', prefix:'fas', icon:'circle-nodes' },
      { label:'ScikitLearn', key:'sklearn', color:'#F7931E', prefix:'fas', icon:'bezier-curve' },
      { label:'Streamlit', key:'streamlit',color:'#FF4B4B', prefix:'fas', icon:'water' },
      { label:'Algorithms',  key:'algos', color:'#8E8FFA', prefix:'fas', icon:'code-branch' },
    ],
    _unbinders: []
  }),
  methods: {
    tileStyle (skill, i) {
      const c = skill.color || this.autoColor(i)
      return {
        '--tile': c,
        '--tile-ring': this.mix(c, '#000000', 0.85),
        '--tile-text': '#0A0A0A',
        '--glass-o': 0,
        '--mx': '50%',
        '--my': '50%',
        '--tiltX': 0,
        '--tiltY': 0
      }
    },
    autoColor (i) {
      const h = (i * 41) % 360, s = 74, l = 62
      return this.hslToHex(h, s, l)
    },
    portalizeTip () {
      const tip = this.$refs.hoverTip
      if (!tip || tip.__portaled) return
      document.body.appendChild(tip)
      tip.__portaled = true
    },
    hslToHex(h, s, l) {
      s/=100; l/=100
      const k = n => (n + h/30) % 12
      const a = s*Math.min(l,1-l)
      const f = n => l - a*Math.max(-1, Math.min(k(n)-3, Math.min(9-k(n),1)))
      const toHex = x => Math.round(255*x).toString(16).padStart(2,'0')
      return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`
    },
    mix(hex1, hex2, w = 0.5) {
      const c1 = this.hexToRgb(hex1), c2 = this.hexToRgb(hex2)
      const r = (1 - w) * c1.r + w * c2.r
      const g = (1 - w) * c1.g + w * c2.g
      const b = (1 - w) * c1.b + w * c2.b
      return this.rgbToHex(r, g, b)
    },
    hexToRgb(hex) {
      const m = hex.replace('#','')
      const bigint = parseInt(m,16)
      return { r:(bigint>>16)&255, g:(bigint>>8)&255, b:(bigint)&255 }
    },
    rgbToHex(r,g,b){
      const to = v => Math.round(v).toString(16).padStart(2,'0')
      return `#${to(r)}${to(g)}${to(b)}`
    },

    bindTileInteractions () {
      const tiles = this.$refs.tiles || []
      const tip = this.$refs.hoverTip
      const isTouch = window.matchMedia('(pointer: coarse)').matches

      if (isTouch && tip) tip.style.display = 'none'

      const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
      const tipRect = () => tip.getBoundingClientRect()

      let qx, qy, setTX, setTY
      if (tip) {
        if (gsap.quickTo) {
          qx = gsap.quickTo(tip, 'left', { duration: 0.18, ease: 'power3.out' })
          qy = gsap.quickTo(tip, 'top',  { duration: 0.18, ease: 'power3.out' })
        } else {
          setTX = gsap.quickSetter(tip, 'left', 'px')
          setTY = gsap.quickSetter(tip, 'top',  'px')
        }
      }

      const showTip = () => tip && gsap.to(tip, { opacity: 1, scale: 1, duration: .18, ease: 'power3.out' })
      const hideTip = () => tip && gsap.to(tip, { opacity: 0, scale: .96, duration: .18, ease: 'power2.out' })

      tiles.forEach((tile) => {
        const setMX = gsap.quickSetter(tile, '--mx', 'px')
        const setMY = gsap.quickSetter(tile, '--my', 'px')
        const setTiltX = gsap.quickSetter(tile, '--tiltX')
        const setTiltY = gsap.quickSetter(tile, '--tiltY')

        let enterTl
        const bounds = () => tile.getBoundingClientRect()

        const onMove = (e) => {
          const b = bounds()
          const x = e.clientX - b.left
          const y = e.clientY - b.top
          setMX(x); setMY(y)

          const rx = ((y / b.height) - 0.5) * -16
          const ry = ((x / b.width)  - 0.5) *  16
          setTiltX(rx.toFixed(2))
          setTiltY(ry.toFixed(2))

          if (!tip || isTouch) return

          const dx = 12, dy = -14
          const { width, height } = tipRect()
          const pad = 8

          const targetX = clamp(e.clientX + dx, pad, window.innerWidth  - width  - pad)
          const targetY = clamp(e.clientY + dy, pad, window.innerHeight - height - pad)

          if (qx && qy) {
            qx(targetX); qy(targetY)
          } else {
            setTX(targetX); setTY(targetY)
          }
        }

        const onEnter = (e) => {
          if (tip) tip.textContent = tile.dataset.label || ''
          onMove(e)
          enterTl?.kill()
          enterTl = gsap.timeline()
            .to(tile, {
              duration: 0.35,
              ease: 'power3.out',
              '--glass-o': 1,
              y: -4,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,.06), 0 14px 30px rgba(0,0,0,.35)'
            }, 0)
          if (!isTouch) showTip()
        }

        const onLeave = () => {
          enterTl?.kill()
          gsap.to(tile, {
            duration: 0.35,
            ease: 'power3.out',
            '--glass-o': 0,
            y: 0,
            '--tiltX': 0,
            '--tiltY': 0,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.06), 0 6px 18px rgba(0,0,0,.25)'
          })
          if (!isTouch) hideTip()
        }

        tile.addEventListener('mousemove', onMove)
        tile.addEventListener('mouseenter', onEnter)
        tile.addEventListener('mouseleave', onLeave)

        this._unbinders.push(() => {
          tile.removeEventListener('mousemove', onMove)
          tile.removeEventListener('mouseenter', onEnter)
          tile.removeEventListener('mouseleave', onLeave)
        })
      })
    }
  },
  mounted () {
    this.$emit('chat-meta', {
      question: 'Skills',
      answer: 'Essas são as minhas principais skills. São bem legais, né? 😁'
    })
    this.portalizeTip()
    this.$nextTick(this.bindTileInteractions)
  },
  beforeUnmount () {
    this._unbinders.forEach(fn => fn())
  }
}
</script>

<style scoped lang="scss">
.skills-grid {
  position: relative;
  background: rgba(255,255,255,.72);
  backdrop-filter: saturate(160%) blur(14px);
  border: 1px solid rgba(0,0,0,.06);
  border-radius: 22px;
  padding: 22px;
  display: grid;
  gap: 16px;
}

.title { 
  font-size: 18px; 
  font-weight: 700; 
  opacity:.9; 
}

.grid {
  list-style: none; 
  margin: 0; 
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 14px;
}

.tile {
  --tile: #eaeaea;
  --tile-text: #0a0a0a;
  --tile-ring: rgba(0,0,0,.12);

  --glass-o: 0;
  --mx: 50%;
  --my: 50%;
  --tiltX: 0;
  --tiltY: 0;

  position: relative;
  display: grid;
  align-content: center;
  justify-items: center;
  text-align: center;
  gap: 10px;

  aspect-ratio: 1 / 1;
  border-radius: 18px;
  padding: 16px;

  color: var(--tile-text);

  background: var(--tile);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.06),
    0 6px 18px rgba(0,0,0,.25);

  transform: perspective(600px) rotateX(calc(var(--tiltX) * 1deg)) rotateY(calc(var(--tiltY) * 1deg));
  transition: transform .18s ease, box-shadow .18s ease, translate .18s ease;
}

.tile .glass {
  position: absolute;
  inset: 0;
  border-radius: 18px;
  pointer-events: none;
  opacity: var(--glass-o);

  backdrop-filter: saturate(160%) blur(14px);
  -webkit-backdrop-filter: saturate(160%) blur(14px);
  border: 1px solid rgba(255,255,255,.10);

  background:
    radial-gradient(160px 160px at var(--mx) var(--my), rgba(255,255,255,.28), rgba(255,255,255,0) 60%),
    radial-gradient(220px 140px at calc(100% - 20%) 0%, rgba(255,255,255,.12), transparent 60%),
    linear-gradient(160deg, rgba(255,255,255,.10), rgba(255,255,255,.02));
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,.06),
    inset 0 -10px 20px rgba(0,0,0,.08);
}

.tile::after {
  content: ''; 
  position: absolute; 
  inset: 0; 
  border-radius: 18px;
  background: radial-gradient(120% 120% at 20% 0%, rgba(255,255,255,.08), transparent 50%);
  pointer-events: none;
}

.icon-wrap {
  display: grid; place-items: center;
  width: 46px; height: 46px;
  border-radius: 12px;
  background: rgba(0,0,0,.28);
  border: 1px solid rgba(255,255,255,.06);
}

.icon { 
  font-size: 24px; 
  line-height: 1; 
  color:#fff; 
  opacity:.95; 
}

.label {
  font-size: 13px; 
  font-weight: 600; 
  letter-spacing: .2px; 
  color:#fff; 
  opacity:.9;
  text-wrap: balance; 
  max-width: 100%;
}

.hover-tip{
  position: fixed;
  top: 0; left: 0;
  transform: scale(.96);
  z-index: 9999;
  pointer-events: none;
  opacity: 0;

  padding: 8px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .2px;
  color: #0b0b0b;

  background: rgba(255,255,255,.6);
  backdrop-filter: saturate(180%) blur(10px);
  -webkit-backdrop-filter: saturate(180%) blur(10px);
  border: 1px solid rgba(255,255,255,.30);
  box-shadow:
    0 6px 18px rgba(0,0,0,.18),
    inset 0 1px 0 rgba(255,255,255,.65);
}
</style>
