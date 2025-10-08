<template>
    <main class="main">
        <header>
        <h1>👋 Olá, eu sou o Julio Zampieri</h1>
        </header>

        <section class="chat-input">
        <ChatInput
            v-model="query"
            :presets="presets"
            @submit="goToChat"
        />
        </section>
    </main>
</template>

<script>
import Header from '@/components/header/Header.vue'
import ChatInput from '@/components/ChatInput/ChatInput.vue'

export default {
  name: 'Home',
  components: { Header, ChatInput },
  data () {
    return {
      query: '',
      default: []
    }
  },
  methods: {
  goToChat (text) {
      const q = (text || this.query || '').trim()
      if (!q) return
      sessionStorage.setItem('chat:q', q)

      this.$router.push({
      name: 'chat',
      state: { question: q }
      })
  }
}
}

</script>

<style lang="scss" scoped>

.main {
  background-color: $color-bg;
  height: 100vh;
  width: 100%;
  display: flex; flex-direction: column;

  header { 
    display: flex;
    align-items: center; 
    flex-direction: column; 
    padding: $mg; 
  }
}

.chat-input {
  margin-top: auto;
  display: flex; 
  justify-content: center; 
  align-items: flex-end;
  margin-bottom: $mg;
}

</style>
