<template>
  <main>
    <section class="chat-page">
      <header class="chat-header">
        <button @click="$router.push({ name: 'home' })" class="back-btn">
          <fa :icon="['fas','arrow-left']" /> Voltar
        </button>
      </header>

      <section class="response">
        <div v-if="!question" class="no-question">Nenhuma pergunta enviada.</div>

        <div v-else class="thread">
          <div class="bubble-wrap user">
            <div class="bubble user">{{ question }}</div>
          </div>

          <div v-if="loading" class="bubble-wrap assistant">
            <div class="bubble assistant">
              <span class="typing"><i></i><i></i><i></i></span>
            </div>
          </div>

          <div v-else-if="displayedAnswer" class="bubble-wrap assistant">
            <div class="bubble assistant">
              <span class="answer-text">{{ displayedAnswer }}</span>
              <span v-if="typing" class="typing"><i></i><i></i><i></i></span>
            </div>
          </div>

          <div v-else-if="error" class="bubble-wrap assistant">
            <div class="bubble assistant">{{ error }}</div>
          </div>
        </div>
      </section>

      <Transition name="gen" mode="out-in">
        <component
          v-if="View && isPresetMode"
          :is="View"
          :key="$route.params.id || $route.query.preset || 'default'"
          class="preset-view"
          v-show="showPreset"
          @chat-meta="onChatMeta"
        />
      </Transition>

      <footer class="chat-footer">
        <ChatInput v-model="query" :presets="presets" @submit="goToChat" />
      </footer>
    </section>

  </main>
</template>

<script>
import { askAgent } from '@/services/agent.service.js'
import { VIEW_REGISTRY } from '@/views/presets/registry.js'
import ChatInput from '@/components/ChatInput/ChatInput.vue'

export default {
  name: 'Chat',
  components: { ChatInput },
  data: () => ({
    query: '', 
    question: '',
    loading: false,
    typing: false,
    displayedAnswer: '',
    error: '',
    View: null,
    isPresetMode: false,
    showPreset: false,
    defaultRenderDelay: 450,
    defaultAnswerDelay: 900
  }),
  async mounted () {
    await this.initFromRoute(this.$route)
  },
  beforeRouteUpdate (to, from, next) {
    this.initFromRoute(to).finally(() => next())
  },
  methods: {
    async onChatMeta (meta) {
      const q = meta?.question || this.question || ''
      const a = meta?.answer || ''
      const renderDelay = Number.isFinite(meta?.renderDelay) ? meta.renderDelay : this.defaultRenderDelay
      const answerDelay = Number.isFinite(meta?.answerDelay) ? meta.answerDelay : this.defaultAnswerDelay

      this.question = q
      this.displayedAnswer = ''
      this.error = ''
      this.typing = false
      this.loading = true
      this.showPreset = false 

      await this.sleep(renderDelay)

      this.typing = true
      await this.typeWriter(a)
      this.typing = false
      this.loading = false

      await this.sleep(answerDelay)
      this.showPreset = true
    },
    async initFromRoute (route) {
      const presetId = route.params?.id || route.query?.preset || route.state?.presetId || null
      this.isPresetMode = !!presetId

      if (this.isPresetMode) {
        this.View = VIEW_REGISTRY[presetId] || null
        this.question = route.state?.question || this.toTitle(presetId)
        this.displayedAnswer = ''
        this.error = ''
        this.typing = false
        this.loading = true
        this.showPreset = false
        return
      }

      this.question = route.state?.question || sessionStorage.getItem('chat:q') || ''
      sessionStorage.removeItem('chat:q')
      if (!this.question) {
        this.loading = false
        this.displayedAnswer = ''
        return
      }
      this.loading = true
      try {
        const full = await askAgent(this.question)
        this.loading = false
        this.typing = true
        this.displayedAnswer = ''
        await this.typeWriter(full)
        this.typing = false
      } catch (e) {
        this.loading = false
        this.typing = false
        this.error = 'Erro ao consultar o agente.'
      }
    },
    sleep (ms) { return new Promise(r => setTimeout(r, ms)) },
    async typeWriter (text) {
      const chars = Array.from(text || '')
      const base = 12
      const accel = 0.92
      let delay = 22
      for (let i = 0; i < chars.length; i++) {
        this.displayedAnswer += chars[i]
        await this.sleep(Math.max(base, delay))
        delay *= accel
      }
    },
    async goToChat (text) {
      const q = (text || this.query || '').trim()
      if (!q) return

      this.question = q
      this.displayedAnswer = ''
      this.error = ''
      this.loading = true
      this.typing = false

      try {
        const full = await askAgent(q)
        this.loading = false
        this.typing = true
        this.displayedAnswer = ''
        await this.typeWriter(full)
        this.typing = false
      } catch (e) {
        this.loading = false
        this.typing = false
        this.error = 'Erro ao consultar o agente.'
      }
    },
    toTitle (s='') {
      return s.replace(/[-_]/g,' ').replace(/\b\w/g, m => m.toUpperCase())
    }
  }
}
</script>

<style lang="scss" scoped>

main {
   background-color: $color-bg; 
   width: 100%; 
   display: flex;
}

.chat-page { 
  max-width: 800px; 
  min-width: 800px; 
  margin: 0 auto; 
  padding: 40px 24px; 
  display: flex; 
  flex-direction: column; 
  gap: 18px; 
}

.chat-header {
   display: block; 
   flex-direction: column;
   background-color: #fff;
   align-items: flex-start; 
   gap: 8px; 
   padding: $mg_mini;
}

.back-btn {
   background: none; 
   border: none; 
   color: $color-primary; 
   font-size: 16px; 
   cursor: pointer; 
   display: flex; 
   align-items: center; 
   gap: 6px; 
   margin-bottom: 8px; 
}

.response {
   display: flex; 
   flex-direction: column; 
   gap: 12px; 
}

.thread {
   display: flex; 
   flex-direction: 
   column; gap: 10px; 
}

.preset-view {
   margin-top: 10px; 
}
.bubble-wrap {
   display: flex; width: 100%; 
}
.bubble-wrap.user {
   justify-content: flex-end; 
}
.bubble-wrap.assistant {
   justify-content: flex-start; 
}

.bubble {
   max-width: min(78%, 560px); 
   padding: 10px 14px; 
   border-radius: 18px; 
   line-height: 1.35; 
   word-wrap: break-word; 
   position: relative; 
   font-size: 16px; 
   box-shadow: 0 2px 6px rgba(0,0,0,.06); 
   white-space: pre-wrap; 
}

.bubble.user {
   color: #fff; 
   background: $color-primary; 
   border-bottom-right-radius: 6px; 
}

.bubble.assistant {
   color: #000; 
   background: #e5e5ea; 
   border-bottom-left-radius: 6px; 
}

.typing {
   display: inline-flex; 
   align-items: center; 
   gap: 4px; 
}

.typing i {
   width: 6px; 
   height: 6px; 
   background: rgba(0,0,0,.35); 
   border-radius: 50%; 
   display: inline-block; 
   animation: blink 1s infinite ease-in-out; 
}

.typing i:nth-child(2) {
   animation-delay: .15s; 
}
.typing i:nth-child(3) {
   animation-delay: .3s; 
}
@keyframes blink { 0%, 80%, 100% { opacity: .25; transform: translateY(0); } 40% { opacity: .9; transform: translateY(-2px); } 
}

.gen-enter-from, .gen-leave-to {
   opacity: 0; 
   transform: translateY(8px) scale(.98); 
   filter: blur(8px) saturate(120%); 
}
.gen-enter-active, .gen-leave-active {
   transition: opacity .35s ease, 
   transform .35s ease, 
   filter .45s ease; 
}
.gen-enter-to, .gen-leave-from {
   opacity: 1; 
   transform: translateY(0) scale(1); 
   filter: blur(0); 
}

.loading {
   color: #888; 
   font-style: italic; 
}
.no-question {
   color: #999; 
   text-align: center; 
   font-style: italic; 
}

.chat-footer {
  margin-top: auto;
  position: sticky;
  bottom: max(env(safe-area-inset-bottom), 16px);
  padding-bottom: max(env(safe-area-inset-bottom), 0px);
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.02) 40%, rgba(255,255,255,.06) 100%);
}
</style>
