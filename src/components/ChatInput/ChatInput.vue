<template>
  <div class="chat-wrap">
  <div class="ci-presets-row" v-if="computedPresets.length">
    <div class="ci-presets" role="list">
      <button
        v-for="(item, i) in computedPresets"
        :key="i"
        class="ci-chip"
        type="button"
        role="listitem"
        :title="item.label"
        @click="onPresetClick(item)"
      >
        <span class="ci-chip-icon" aria-hidden="true">
          <fa :icon="item.icon || ['fas','circle']" />
        </span>
        <span class="ci-chip-label">{{ item.label }}</span>
      </button>
    </div>
  </div>

  <div class="ci-row">
    <div class="chat-input" :class="{ disabled, loading }">
      <input
        ref="inputEl"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled || loading"
        class="ci-field"
        type="text"
        autocomplete="off"
        autocapitalize="sentences"
        :aria-label="ariaLabel || placeholder"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
        @keydown.enter.prevent="handleSubmit"
      />
      <button
        class="ci-send"
        :title="btnTitle"
        :disabled="sendDisabled"
        @click="handleSubmit"
      >
        <span v-if="!loading" class="ci-icon">
          <fa :icon="['fas','paper-plane']" />
        </span>
        <span v-else class="ci-spinner"></span>
      </button>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'ChatInput',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Ask me anything...' },
    ariaLabel: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    autofocus: { type: Boolean, default: false },
    trimOnSubmit: { type: Boolean, default: true },

    presets: {
      type: Array,
      default: () => ([
        { label: 'Me', presetId: 'about', icon: ['far','face-smile'], action: 'preset' },
        { label: 'Projects', presetId: 'projects', icon: ['fas','bag-shopping'], action: 'preset' },
        { label: 'Skills', presetId: 'skills', icon: ['fas','layer-group'], action: 'preset' },
        { label: 'Fun', presetId: 'fun', icon: ['fas','wand-magic-sparkles'], action: 'preset' },
        { label: 'Contact', presetId: 'contact', icon: ['fas','user-lock'], action: 'preset' }
      ])
    }
  },
  emits: ['update:modelValue', 'submit', 'focus', 'blur'],
  computed: {
    sendDisabled () {
      return this.disabled || this.loading || !(this.modelValue && this.modelValue.trim().length)
    },
    btnTitle () {
      return this.loading ? 'Enviando...' : 'Enviar'
    },
    computedPresets () {
      return Array.isArray(this.presets) ? this.presets : []
    }
  },
  mounted () {
    if (this.autofocus) this.$refs.inputEl?.focus()
  },
  methods: {
    handleSubmit () {
      if (this.sendDisabled) return
      const payload = this.trimOnSubmit ? (this.modelValue || '').trim() : (this.modelValue || '')
      this.$emit('submit', payload)
    },
    onPresetClick (item) {
      if (item?.action === 'preset' && item?.presetId) {
        const target = {
          name: 'chat',
          params: { id: item.presetId },
          state: { presetId: item.presetId, question: item.label }
        }

        if (this.$route.name === 'chat' && this.$route.params?.id === item.presetId) {
          this.$router.replace({ ...target, query: { r: Date.now() } })
        } else {
          this.$router.push(target)
        }
        return
      }

      const value = (item?.value || '').trim()
      if (!value) return
      this.$emit('update:modelValue', value)

      if (item.action === 'submit') {
        requestAnimationFrame(() => this.$emit('submit', value))
      } else {
        this.$refs.inputEl?.focus()
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.chat-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;

  --ci-max:  clamp(320px, 92vw, 860px);
  --ci-pad:  clamp(8px,  2.2vw, 14px);
  --ci-gap:  clamp(8px,  2vw,   12px);
  --ci-btn:  clamp(40px, 6.2vw, 48px);
  --ci-fs:   clamp(14px, 2.2vw, 17px);
  --ci-ico:  clamp(16px, 2.4vw, 18px); 
}

.ci-row {
  width: 100%;
  max-width: var(--ci-max);
  padding: 0 15px;
}

.ci-presets-row {
  width: 100%;
  display: flex;
  justify-content: center;
  max-width: calc(var(--ci-max) + 240px);
  padding: 0 12px;
}

.chat-input {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--ci-gap);
  width: 100%;
  padding: var(--ci-pad);
  border-radius: 999px;
  background: $color-bg-glass;
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border: 1px solid $color-border;
  box-shadow: 0 6px 24px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.4);

  &.disabled { opacity: .6; pointer-events: none; }
}

.ci-field {
  flex: 1;
  min-width: 0;
  font-size: 16px;
  line-height: 1.25;
  color: $color-text;
  background: transparent;
  border: 0;
  outline: none;
  padding: calc(var(--ci-pad) * .6) $mg_mini;
  &::placeholder { color: $color-text-light; }
}

.ci-send {
  flex: 0 0 auto;
  width: var(--ci-btn);
  height: var(--ci-btn);
  border-radius: 999px;
  border: 0;
  cursor: pointer;
  color: #fff;
  background: $gradient-primary;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(10,132,255,.35), inset 0 1px 0 rgba(255,255,255,.25);
  transition: transform .08s ease, box-shadow .2s ease, opacity .2s ease;
  &:hover { transform: translateY(-1px); }
  &:active { transform: translateY(0); box-shadow: 0 3px 10px rgba(10,132,255,.35); }
  &:disabled { opacity: .6; cursor: not-allowed; }
}
.ci-icon { font-size: 18px; }

.ci-spinner {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.45);
  border-top-color: rgba(255,255,255,1);
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.ci-presets {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  align-items: stretch;

  @media (max-width: 1024px) { grid-template-columns: repeat(4, 1fr); }
  @media (max-width: 900px)  { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 680px)  { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 520px)  { grid-template-columns: 1fr; }
}

.ci-chip {
  appearance: none;
  border: 1px solid $color-gray-200;
  color: $color-text;
  border-radius: 18px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  cursor: pointer;
  background: linear-gradient(0deg, rgba(255,255,255,0.65), rgba(255,255,255,0.65)), $gradient-glass;
  box-shadow: 0 6px 16px rgba(0,0,0,.04), inset 0 1px 0 rgba(255,255,255,.5);
  transition: transform .12s ease, box-shadow .2s ease, border-color .2s ease;
  &:hover   { transform: translateY(-1px); box-shadow: 0 10px 22px rgba(0,0,0,.06); }
  &:active  { transform: translateY(0); }
}

.ci-chip-icon { font-size: 18px; opacity: .95; filter: drop-shadow(0 1px 1px rgba(0,0,0,.08)); }
.ci-chip-label { font-weight: 600; font-size: 14px; color: $color-text; }

.ci-chip:nth-child(1) .ci-chip-icon { color: $color-success; } 
.ci-chip:nth-child(2) .ci-chip-icon { color: $color-primary; }
.ci-chip:nth-child(3) .ci-chip-icon { color: $color-purple; }
.ci-chip:nth-child(4) .ci-chip-icon { color: $color-danger; } 
.ci-chip:nth-child(5) .ci-chip-icon { color: $color-warning; } 

@media (max-width: 450px) {
  .chat-input { padding: clamp(0px, 2vw, 10px); }
}

</style>