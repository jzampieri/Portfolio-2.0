<template>
  <main class="chat-page">
    <header class="chat-header">
      <button @click="$router.push({ name: 'home' })" class="back-btn">
        <fa :icon="['fas','arrow-left']" /> Voltar
      </button>
      <h2>Pergunta</h2>
      <p class="question">“{{ question }}”</p>
    </header>

    <section class="response">
      <div v-if="loading" class="loading">Carregando resposta...</div>
      <div v-else-if="answer" class="answer glass-card">{{ answer }}</div>
      <div v-else class="no-question">Nenhuma pergunta enviada.</div>
    </section>
  </main>
</template>

<script>
import { askAgent } from '@/services/agent.service.js'

export default {
  name: 'Chat',
  data: () => ({
    question: '',
    answer: '',
    loading: false
  }),
  async mounted () {
    this.question = this.$route.state?.question
      || sessionStorage.getItem('chat:q')
      || ''

    sessionStorage.removeItem('chat:q')

    if (!this.question) return

    this.loading = true
    try {
      this.answer = await askAgent(this.question)
    } catch (e) {
      console.error(e)
      this.answer = 'Erro ao consultar o agente.'
    } finally {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.chat-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;

  .back-btn {
    background: none;
    border: none;
    color: #007aff;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
  }

  .question {
    font-style: italic;
    color: #555;
  }
}

.loading {
  color: #888;
  font-style: italic;
}

.glass-card {
  padding: 20px;
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,.35);
  background: linear-gradient(0deg, rgba(255,255,255,.65), rgba(255,255,255,.65));
  box-shadow: 0 12px 30px rgba(0,0,0,.08);
}

.no-question {
  color: #999;
  text-align: center;
  font-style: italic;
}
</style>
