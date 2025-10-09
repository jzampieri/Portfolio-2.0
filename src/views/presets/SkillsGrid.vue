<template>
  <section class="skills-card">
    <h3 class="title">Skills & Expertise</h3>
    <div class="section" v-for="(s, si) in sections" :key="s.title" :style="{ '--s': si }">
      <div class="section-head">
        <span class="section-title">{{ s.title }}</span>
      </div>
      <div class="chips">
        <span class="chip" v-for="(t, i) in s.items" :key="t" :style="{ '--i': i }">{{ t }}</span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SkillsPreset',
  data: () => ({
    sections: [
      { title: 'Frontend', items: ['Vue 3','Vite','SCSS','Tailwind','Font Awesome'] },
      { title: 'Backend', items: ['Node/Express','PHP/Laravel','Docker','PostgreSQL'] },
      { title: 'AI/Agents', items: ['OpenAI API','Agents','Prompt Engineering'] }
    ]
  }),
  mounted () {
    this.$emit('chat-meta', {
      question: 'Skills',
      answer: 'Essas são as stacks e competências que mais uso nos meus projetos recentes.'
    })
  }
}
</script>

<style scoped lang="scss">
.skills-card { background:#fff; border-radius:22px; padding:22px; border:1px solid rgba(0,0,0,.06); display:grid; gap:18px; }
.title { font-size:24px; font-weight:700; opacity:0; transform: translateY(6px); animation: rise .4s ease forwards; }
.section { opacity:0; transform: translateY(6px); animation: rise .4s ease forwards; animation-delay: calc(var(--s) * 90ms + 80ms); display:grid; gap:10px; }
.section-title { font-weight:600; }
.chips { display:flex; flex-wrap:wrap; gap:10px; }
.chip {
  background:#111; color:#fff; padding:6px 10px; border-radius:999px; font-size:13px;
  opacity:0; transform: translateY(3px) scale(.98);
  animation: blip .36s ease forwards;
  animation-delay: calc(var(--s) * 90ms + var(--i) * 35ms + 120ms);
}
@keyframes rise { to { opacity:1; transform: translateY(0); } }
@keyframes blip { to { opacity:1; transform: translateY(0) scale(1); } }
</style>
