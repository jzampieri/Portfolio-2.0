<template>
  <section class="projects-grid">
    <h3 class="title">My Projects</h3>

    <ul class="grid">
      <li
        v-for="(p, i) in projects"
        :key="p.key || p.title"
        class="card"
        :style="cardStyle(p, i)"
        @click="openModal(p, i)"
        @keydown.enter.prevent="openModal(p, i)"
        role="button"
        tabindex="0"
        :aria-label="`Abrir ${p.title}`"
      >
        <div class="glass" aria-hidden="true"></div>

        <header class="head">
          <span v-if="p.badge" class="badge">{{ p.badge }}</span>
        </header>

        <div class="body">
          <h4 class="name">
            <fa v-if="p.icon" :icon="p.icon" class="picon" />
            {{ p.title }}
          </h4>

          <p class="desc">{{ p.desc }}</p>

          <div class="thumb" v-if="p.thumb">
            <img :src="p.thumb" :alt="p.title" loading="lazy" />
          </div>
        </div>
      </li>
    </ul>

    <div
      v-if="showModal"
      class="modal-wrap"
      ref="wrap"
      @click.self="closeModal"
      :aria-hidden="!showModal"
    >
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        :aria-label="activeProject?.title"
        ref="modal"
        tabindex="-1"
      >
        <button class="close" @click="closeModal" aria-label="Fechar">
          <fa :icon="['fas','xmark']"/>
        </button>

        <div class="modal-head">
          <span v-if="activeProject?.badge" class="badge">{{ activeProject.badge }}</span>
          <h3 class="title-modal">
            <fa v-if="activeProject?.icon" :icon="activeProject.icon" class="picon"/>
            {{ activeProject?.title }}
          </h3>
        </div>

        <p class="modal-desc">{{ activeProject?.long || activeProject?.desc }}</p>

        <ul v-if="activeProject?.tags?.length" class="tags">
          <li v-for="t in activeProject.tags" :key="t">{{ t }}</li>
        </ul>

        <div class="links" v-if="activeProject?.links">
          <a
            v-if="activeProject.links.demo"
            class="btn primary"
            :href="activeProject.links.demo"
            target="_blank" rel="noopener"
          >
            <fa :icon="['fas','play']"/> Demo
          </a>
          <a
            v-if="activeProject.links.repo"
            class="btn"
            :href="activeProject.links.repo"
            target="_blank" rel="noopener"
          >
            <fa :icon="['fab','github']"/> Código
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { gsap } from 'gsap'

export default {
  name: 'ProjectsGallery',
  data: () => ({
    projects: [
      {
        title: 'Synto',
        key: 'synto',
        badge: 'Startup Project',
        desc: 'Assistente fofíssimo para onboarding de usuários em apps.',
        long: 'Synto nasceu num hack-week. O mascote guia o usuário com micro-tarefas gamificadas, métricas e A/B de tooltips.',
        from: '#0B0B0C', to: '#15151A',
        icon: ['fas','sparkles'],
        thumb: null,
        tags: ['Vue 3', 'GSAP', 'Design System'],
        links: { demo: '#', repo: '#' }
      },
      {
        title: 'Rrate',
        key: 'rrate',
        badge: 'Fun Tool',
        desc: 'Calculadora de salário por moeda (BRL/USD/EUR) com comparativos.',
        from: '#111', to: '#2B2B30',
        icon: ['fas','coins'],
        tags: ['Vue 3', 'Vite', 'Rest Countries'],
        links: { demo: '#', repo: '#' }
      },
      {
        title: 'Defai',
        key: 'defai',
        badge: 'Hackathon Winner',
        desc: 'Bot que simula swaps cripto em ambiente seguro.',
        from: '#1A0D0D', to: '#0D0D0F',
        icon: ['fas','robot'],
        tags: ['Vue 3', 'Avalanche', 'UX Research'],
        links: { demo: '#', repo: '#' }
      },
      {
        title: 'Valoriza — Assistente Financeiro',
        key: 'valoriza',
        badge: 'Product',
        desc: 'Bem-estar financeiro com IA, metas e Open Finance.',
        long: 'Integra Open Finance, análise comportamental, metas inteligentes e visão 360 no Metabase.',
        from: '#4B6BFB', to: '#1E293B',
        icon: ['fas','chart-line'],
        tags: ['Vue 3', 'ASP.NET API', 'Open Finance', 'Metabase'],
        links: { demo: 'https://example.com/valoriza', repo: 'https://github.com/user/valoriza' },
      },
      {
        title: 'Negocie Já — Acordos',
        key: 'negocieja',
        badge: 'Platform',
        desc: 'Parcelamento, PIX, regras dinâmicas e contrato.',
        from: '#7C3AED', to: '#17091F',
        icon: ['fas','diagram-project'],
        tags: ['Laravel', 'Vue 3', 'Clicksign', 'Pix'],
        links: { repo: 'https://github.com/user/negocieja' },
      },
      {
        title: 'Portfolio 2.0 — Chat IA',
        key: 'portfolio2',
        badge: 'This Site',
        desc: 'Portfolio 100% inteligente que fala só sobre mim.',
        from: '#0EA5E9', to: '#0B1324',
        icon: ['fas','wand-magic-sparkles'],
        tags: ['Vue 3', 'Vite', 'OpenAI API', 'GSAP'],
        links: { demo: 'https://example.com/portfolio' }
      }
    ],
    showModal: false,
    activeProject: null,

    modalTl: null,
    reduceMotion: typeof window !== 'undefined'
      ? window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  }),
  methods: {
    cardStyle (p, i) {
      const from = p.from || this.autoColor(i, 0)
      const to   = p.to   || this.mix(from, '#000000', 0.35)
      return { '--from': from, '--to': to }
    },
    autoColor (i, offset = 0) {
      const h = ((i * 41) + (offset ? 24 : 0)) % 360, s = 72, l = 58
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
    hexToRgb(hex) {
      const m = hex.replace('#',''); const b = parseInt(m,16)
      return { r:(b>>16)&255, g:(b>>8)&255, b:(b)&255 }
    },
    rgbToHex(r,g,b){ const to=v=>Math.round(v).toString(16).padStart(2,'0'); return `#${to(r)}${to(g)}${to(b)}` },
    mix(a,b,w=.5){ const A=this.hexToRgb(a),B=this.hexToRgb(b); return this.rgbToHex((1-w)*A.r+w*B.r,(1-w)*A.g+w*B.g,(1-w)*A.b+w*B.b) },

    openModal (p) {
      this.activeProject = p
      this.showModal = true

      document.addEventListener('keydown', this.onEsc)
      this.$nextTick(() => {
        this.$refs.modal?.focus()

        document.documentElement.style.overflow = 'hidden'
        document.body.style.overflow = 'hidden'

        if (this.reduceMotion) return

        gsap.set(this.$refs.wrap, { opacity: 0 })
        gsap.set(this.$refs.modal, { y: 24, scale: 0.96, opacity: 0 })

        this.modalTl = gsap.timeline({ defaults: { ease: 'power2.out' } })
          .to(this.$refs.wrap, { opacity: 1, duration: 0.25 }, 0)
          .to(this.$refs.modal, { y: 0, scale: 1, opacity: 1, duration: 0.38 }, 0.05)
      })
    },

    closeModal () {
      const finish = () => {
        this.showModal = false
        this.activeProject = null
        document.removeEventListener('keydown', this.onEsc)

        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
      }

      if (this.reduceMotion || !this.$refs.modal || !this.$refs.wrap) {
        finish()
        return
      }

      gsap.timeline({
        defaults: { ease: 'power1.inOut' },
        onComplete: finish
      })
      .to(this.$refs.modal, { y: 16, scale: 0.985, opacity: 0, duration: 0.22 }, 0)
      .to(this.$refs.wrap,  { opacity: 0, duration: 0.18 }, 0.02)
    },

    onEsc (e){ if (e.key === 'Escape') this.closeModal() }
  },
  mounted () {
    this.$emit('chat-meta', { question: 'Projetos', answer: 'Meus principais projetos.' })
  },
  beforeUnmount () {
    document.removeEventListener('keydown', this.onEsc)
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
  }
}
</script>

<style scoped lang="scss">
.projects-grid{
  position: relative;
  border-radius: 22px;
  padding: 22px;
  display: grid;
  gap: 16px;
}
.title{ 
  font-size: 22px; 
  font-weight: 800; 
  opacity: .92; 
}

.grid{
  list-style: none; 
  margin: 0; 
  padding: 0;
  display: grid; 
  gap: 18px;
  grid-template-columns: repeat(1, minmax(0,1fr));
  @media (min-width: 640px){ grid-template-columns: repeat(2, minmax(0,1fr)); }
  @media (min-width: 1024px){ grid-template-columns: repeat(3, minmax(0,1fr)); } /* 3x3 */
}

.card{
  position: relative; 
  overflow: hidden; 
  border-radius: 24px;
  min-height: 320px; 
  cursor: pointer; 
  color: #fff;

  background:
    radial-gradient(100% 100% at 50% 0%, rgba(255,255,255,.04), transparent 60%),
    linear-gradient(180deg, rgba(0,0,0,.00), rgba(0,0,0,.55)),
    linear-gradient(180deg, var(--from), var(--to));

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.06),
    0 8px 22px rgba(0,0,0,.25);
}

.card::before{
  content:''; 
  position: absolute; 
  inset: -20%; 
  pointer-events: none; 
  border-radius: inherit;
  background: linear-gradient(22deg, rgba(255,255,255,0) 22%, rgba(255,255,255,.18) 36%, rgba(255,255,255,.06) 46%, rgba(255,255,255,0) 62%);
}

.glass{
  position: absolute; 
  inset: 0; 
  border-radius: inherit; 
  pointer-events: none;
  opacity: .65; /* fixo */
  backdrop-filter: saturate(160%) blur(14px);
  -webkit-backdrop-filter: saturate(160%) blur(14px);
  border: 1px solid rgba(255,255,255,.10);
  background:
    radial-gradient(220px 200px at 50% 50%, rgba(255,255,255,.28), rgba(255,255,255,0) 60%),
    radial-gradient(380px 180px at 90% 0%, rgba(255,255,255,.12), transparent 60%),
    linear-gradient(160deg, rgba(255,255,255,.08), rgba(255,255,255,.02));
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,.06),
    inset 0 -10px 22px rgba(0,0,0,.08);
}

.head{ 
  padding: 18px; 
  display: flex; 
  justify-content: flex-start; 
}
.badge{
  display: inline-flex; 
  align-items: center; 
  gap:8px;
  font-size:12px; 
  font-weight:800; 
  letter-spacing:.2px;
  padding:8px 10px; 
  border-radius:999px;
  background: rgba(255,255,255,.14);
  border: 1px solid rgba(255,255,255,.25);
  backdrop-filter: saturate(160%) blur(6px);
}

.body{ 
  display: grid; 
  gap:10px; 
  padding: 0 18px 18px 18px; 
}
.name{
  display: flex; 
  align-items: center; 
  gap:10px; 
  margin: 0;
  font-size: 28px; 
  line-height:1.1; 
  font-weight: 900; 
  letter-spacing:.2px;
  text-shadow: 0 6px 18px rgba(0,0,0,.35);
}
.picon{ 
  font-size:18px; 
  opacity:.9; 
}
.desc{ 
  font-size:14px; 
  line-height:1.5; 
  opacity:.9; 
  max-width: 60ch; 
}

.thumb{
  margin-top: 4px; 
  display: grid; 
  place-items: center;
  img{
    width: 100%; 
    max-height: 140px; 
    object-fit: contain;
    filter: drop-shadow(0 12px 24px rgba(0,0,0,.45));
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,.16);
    background: rgba(255,255,255,.06);
  }
}

.modal-wrap{
  position: fixed; 
  inset:0; 
  z-index: 50;
  background: rgba(8,8,10,.55);
  backdrop-filter: blur(6px) saturate(140%);
  -webkit-backdrop-filter: blur(6px) saturate(140%);
  display: grid; 
  place-items: center; 
  padding: 20px;

  will-change: opacity;
}
.modal{
  position: relative; 
  outline: none;
  width: min(860px, 96vw);
  background: rgba(20,20,24,.6);
  border: 1px solid rgba(255,255,255,.14);
  color:#fafafa;
  border-radius: 22px;
  box-shadow: 0 30px 70px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.06);
  padding: 22px;

  will-change: transform, opacity;
  backface-visibility: hidden;
  transform: translateZ(0);
}
.close{
  position: absolute; 
  top:10px; 
  right:10px;
  display: inline-flex; 
  align-items: center; 
  justify-content: center;
  width:36px; 
  height:36px; 
  border-radius:999px;
  background: rgba(255,255,255,.10); 
  border: 1px solid rgba(255,255,255,.18);
  color:#fff; 
  cursor: pointer;
}
.modal-head{ 
  display: flex; 
  align-items: center; 
  gap:10px; 
  margin-bottom:10px; 
}
.title-modal{ 
  font-size:22px; 
  font-weight:900; 
  display: flex; 
  align-items: center; 
  gap:8px; 
  margin:0; 
}
.modal-desc{ 
  opacity:.95; 
  line-height:1.6; 
  margin: 6px 0 10px; 
}

.tags{
  display: flex; 
  flex-wrap: wrap; 
  gap:8px; 
  padding:0; 
  margin: 8px 0 16px 0;
  li{
    list-style: none; 
    font-size:12px; 
    font-weight:800; 
    letter-spacing:.2px;
    padding:6px 10px; 
    border-radius:999px; 
    color:#0a0a0a;
    background: rgba(255,255,255,.85);
    border: 1px solid rgba(255,255,255,.35);
  }
}
.links{
  display: flex; 
  gap:10px; 
  flex-wrap: wrap;
  .btn{
    display: inline-flex; 
    align-items: center; 
    gap:8px; 
    text-decoration: none;
    padding:10px 14px; 
    border-radius:999px; 
    font-weight:800; 
    font-size:13px;
    background: rgba(255,255,255,.18); 
    color:#fff; 
    border:1px solid rgba(255,255,255,.28);
    transition: transform .14s ease; 
  }
  .btn:hover{ 
    transform: translateY(-1px); 
  }
  .primary{ 
    background: rgba(255,255,255,.85); 
    color:#0b0b0b; 
  }
}
</style>
