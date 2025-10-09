<template>
  <section class="contact-card">
    <div class="row">
      <h3 class="title">Contato</h3>
      <span class="handle">Julio Zampieri</span>
    </div>
    <a class="email" href="mailto:contact.zampieri@gmail.com">
      <span>contact.zampieri@gmail.com</span>
      <fa :icon="['fas','envelope']" class="icon" />
    </a>
    <nav class="links">
      <a
        v-for="(l,i) in linkList"
        :key="l.label"
        :href="l.href"
        target="_blank"
        rel="noopener"
        :style="{ '--i': i }"
      >
        <fa :icon="l.icon" class="icon" />
        <span>{{ l.label }}</span>
      </a>
    </nav>
    <p>+55 11 99129-2785</p>
    <!-- <p class="blurb">Você pode me contatar quando quiser!</p> -->
  </section>
</template>

<script>
export default {
  name: 'ContactPreset',
  data: () => ({
    linkList: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/julio-cesar-zampieri-3257b6267/' },
      { label: 'GitHub', href: 'https://github.com/jzampieri' },
      { label: 'Hugging Face', href: 'https://huggingface.co/jzampieri' }
    ]
  }),
  mounted () {
    this.$emit('chat-meta', {
      question: 'Contact',
      answer: 'Aqui estão meus contatos e redes. Se preferir, deixe sua mensagem e eu retorno assim que possível.'
    })
  }
}
</script>

<style scoped lang="scss">

.contact-card {
  background:#fff; 
  border-radius:22px; 
  padding:$mg; 
  border:1px solid rgba(0,0,0,.06);
  display:grid; 
  gap:14px; 
  will-change: opacity, transform, filter;
}
.row {
    display:flex; 
    align-items:baseline; 
    justify-content:space-between; 
}

.title, .handle, .email, .blurb {
  opacity:0; 
  transform: translateY(4px);
  animation: rise .42s cubic-bezier(.2,.7,.2,1) forwards;
}

.email {
   animation-delay:120ms; 
   display:flex; 
   align-items:center; 
   gap:10px; 
   text-decoration:none; 
   color:#1460ca; 

   &:hover {
    text-decoration: underline;
    text-decoration-color: #1460ca;
   }
  }

.phone { 
  animation-delay:180ms; 
  display:flex; 
  align-items:center; 
  gap:10px; 
  text-decoration:none; 
  color:#1f2937; 
}

.title  { 
    animation-delay: 0ms;
    font-size: 30px;
    padding-bottom: $mg;
    font-weight: bold;
}

.handle { 
    animation-delay: 60ms; 
}

.email  { 
    animation-delay: 120ms; 
}

.blurb  {
    animation-delay: 240ms; 
}

.icon { 
  font-size:18px; 
  opacity:.9; 
  color: #374151;
}

.links { 
    display:flex;
    flex-wrap:wrap; 
    gap:$mg; 
    padding-top: $mg_mini;
    padding-bottom: $mg_mini;

    a{
      opacity:0; 
      transform: translateY(4px);
      animation: rise .42s cubic-bezier(.2,.7,.2,1) forwards;
      animation-delay: calc(var(--i) * 60ms + 160ms);
      text-decoration:none; 
      color:#4a576b;
      transition: .6s;

      &:hover {
        color: black;
      }
    }
}


@keyframes rise { to { opacity:1; transform: translateY(0); } }
</style>
