<template>
  <section class="skills-grid">
    <h3 class="title">Skills & Expertise</h3>
    <ul class="grid">
      <li
        v-for="(skill, i) in skills"
        :key="skill.key || skill.label"
        class="tile"
        :style="tileStyle(skill, i)"
        :title="skill.label"
      >
        <div class="icon-wrap">
          <fa
            :icon="[skill.prefix || 'fas', skill.icon]"
            class="icon"
          />
        </div>
        <span class="label">{{ skill.label }}</span>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'SkillsPreset',
  data: () => ({
    skills: [
      { label:'Python', key:'python', color:'#3776AB', prefix:'fab', icon:'python' },
      { label:'TypeScript', key:'ts', color:'#3178C6', prefix:'fas', icon:'file-code' },
      { label:'Csharp', key:'csharp', color:'#239120', prefix:'fas', icon:'hashtag' },
      { label:'Node.js', key:'node', color:'#3C873A', prefix:'fab', icon:'node-js' },

      { label:'Git', key:'git', color:'#F05032', prefix:'fab', icon:'git' },
      { label:'AWS', key:'aws', color:'#FF9900', prefix:'fab', icon:'aws' },
      { label:'React', key:'react', color:'#61DAFB', prefix:'fab', icon:'react' },
      { label:'VueJS', key:'vue', color:'#41B883', prefix:'fab', icon:'vuejs' },

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
    ]
  }),
  methods: {
    tileStyle (skill, i) {
      const c = skill.color || this.autoColor(i)
      return {
        '--tile': c,
        '--tile-ring': this.mix(c, '#000000', 0.85),
        '--tile-text': '#0A0A0A'
      }
    },
    autoColor (i) {
      const h = (i * 41) % 360, s = 74, l = 62
      return this.hslToHex(h, s, l)
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
    }
  },
  mounted () {
    this.$emit('chat-meta', {
      question: 'Skills',
      answer: 'Essas são as minhas principais skills. São bem legais, né? 😁'
    })
  }
}
</script>

<style scoped lang="scss">
.skills-grid {
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
  background:
    radial-gradient(120% 120% at 80% 0%, rgba(255,255,255,.12) 0%, rgba(255,255,255,.04) 48%, rgba(255,255,255,.02) 100%),
    linear-gradient(160deg, var(--tile) 0%, rgba(255,255,255,.08) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.06),
    0 6px 18px rgba(0,0,0,.25);
  transition: transform .18s ease, 
  box-shadow .18s ease, 
  translate .18s ease;
}

.tile::after {
  content: ''; 
  position: absolute; 
  inset: 0; 
  border-radius: 18px;
  background: radial-gradient(120% 120% at 20% 0%, rgba(255,255,255,.08), transparent 50%);
  pointer-events: none;
}

.tile:hover {
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.06),
    0 10px 24px rgba(0,0,0,.35);
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
</style>
