<template>
  <section class="about-card">
    <div class="row">
      <div class="info">
        <h3 class="title">Julio Cesar Zampieri</h3>

        <ul class="tags">
          <li v-for="t in tags" :key="t">{{ t }}</li>
        </ul>

        <p class="blurb">
          {{ bio }}
        </p>

        <ul class="highlights">
          <li v-for="h in highlights" :key="h.text">
            <fa v-if="h.icon" :icon="h.icon" class="icon" />
            <span>{{ h.text }}</span>
          </li>
        </ul>

        <div class="curios">
          <h4>Curiosidades</h4>
          <ul class="curios-grid">
            <li v-for="c in curiosities" :key="c.text">
              <span class="emoji" aria-hidden="true">{{ c.emoji }}</span>
              <span class="text">{{ c.text }}</span>
            </li>
          </ul>
        </div>

        <!--
        <div class="stack">
          <h4>Stack & Expertise</h4>
          <ul class="stack-grid">
            <li v-for="s in stack" :key="s.label" :title="s.label">
              <fa :icon="s.icon" class="stack-icon" />
              <span>{{ s.label }}</span>
            </li>
          </ul>
        </div>
        -->
      </div>

      <!-- Memoji -->
      <div class="memoji" aria-hidden="true">
        <img src="@/assets/img/memoji.webp" alt="" />
        <span class="sheen" aria-hidden="true"></span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AboutPreset',
  data: () => ({
    tags: ['Software Engineer'],
    bio:
      'Sou um engenheiro de software focado em experiências inteligentes e limpas. Curto unir IA aplicada, design levemente elegante e soluções — sempre priorizando experiências, não produtos.',
    highlights: [
      { icon: ['fas', 'code-branch'], text: 'FIAP — Engenharia de Software (2026)' }
    ],
    curiosities: [
      { text: 'Minha escuderia é a Red Bull Racing.' },
      { text: 'Sou são-paulino e culé desde pequeno.' },
      { text: 'Comecei a programar em 2022.' }
    ],
  }),
  mounted () {
    this.$emit('chat-meta', {
      question: 'Afinal, quem é o Júlio?',
      answer: 'Um dev que é apaixonado pela tecnologia, não se prendendo nem ao front nem no back.'
    })
  }
}
</script>

<style scoped lang="scss">
.about-card {
  background: rgba(255,255,255,.6);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255,255,255,.4);
  border-radius: 22px;
  padding: $mg;
  box-shadow: 0 4px 30px rgba(0,0,0,.05);
  transition: .4s ease-in-out;
}

.row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: $mg;
}

.info { display: grid; gap: 10px; }

.title {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: .2px;
  margin-bottom: $mg_mini;
  opacity: 0;
  transform: translateY(4px);
  animation: rise .42s cubic-bezier(.2,.7,.2,1) forwards;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: $mg_mini;
  li {
    font-size: 13px;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,.55);
    border: 1px solid rgba(0,0,0,.06);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.6);
    backdrop-filter: blur(10px);
  }
}

.blurb {
  color: #4a576b;
  line-height: 1.55;
  opacity: 0;
  transform: translateY(4px);
  animation: rise .42s .08s cubic-bezier(.2,.7,.2,1) forwards;
}

.highlights {
  display: grid;
  gap: 8px;
  margin-top: 4px;
  li {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #2b3340;
    .icon { font-size: 14px; opacity: .9; color:#374151; }
  }
}

.curios { 
    margin-top: $mg_mini; 
}
.curios h4 {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 8px;
    color:#111827;
}
.curios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
}
.curios-grid li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgb(255, 255, 255);
  border: 1px solid rgba(0,0,0,.1);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.5);
  backdrop-filter: blur(10px);
  transition: .25s ease;
  opacity: 0; transform: translateY(4px);
  animation: rise .42s .12s cubic-bezier(.2,.7,.2,1) forwards;

  &:hover { transform: translateY(-2px); }
  .emoji { font-size: 16px; line-height: 1; }
  .text { color:#2b3340; }
}



.memoji {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  animation: float 3s ease-in-out infinite;
  border: 2px solid rgba(255,255,255,.75);

  img { width: 100%; height: 100%; object-fit: cover; }

  .sheen {
    position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,.55) 45%, transparent 60%);
    transform: translateX(-120%);
    animation: sheen 3.5s ease-in-out infinite 1s;
  }
}

@keyframes rise { to { opacity:1; transform: translateY(0); } }
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes sheen {
  0% { transform: translateX(-120%) rotate(0.001deg); }
  60% { transform: translateX(120%) rotate(0.001deg); }
  100% { transform: translateX(120%) rotate(0.001deg); }
}

@media (max-width: 740px) {
  .row { grid-template-columns: 1fr; }
  .memoji { width: 150px; height: 150px; margin: 6px auto 0; }
}
</style>
