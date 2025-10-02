<template>
  <div class="chat-input" :class="{ disabled, loading }">
    <ul v-if="suggestions && suggestions.length" class="quick-suggestions" role="list">
    <li
        v-for="(s, i) in suggestions"
        :key="i"
        class="chip"
        role="button"
        tabindex="0"
        @click="applySuggestion(s)"
        @keydown.enter.prevent="applySuggestion(s)"
        @keydown.space.prevent="applySuggestion(s)"
    >
        <span v-if="normalizeIcon(s)" class="chip-icon" aria-hidden="true">
        <svg v-if="normalizeIcon(s)?.type === 'svg'" viewBox="0 0 24 24">
            <path :d="normalizeIcon(s).path" />
        </svg>
        <span v-else-if="normalizeIcon(s)?.type === 'emoji'" class="emoji">
            {{ normalizeIcon(s).emoji }}
        </span>
        </span>

        <span class="chip-label">{{ normalizeLabel(s) }}</span>
    </li>
    </ul>

    <div class="composer">

        <textarea
        ref="ta"
        class="input"
        :placeholder="placeholder"
        :value="innerValue"
        :rows="1"
        :maxlength="maxlength || null"
        :disabled="disabled"
        @input="onInput"
        @keydown="onKeydown"
        :style="{
            minHeight: inputMinHeight + 'px',
            fontSize: inputFontSize,
            padding: inputPaddingY + ' ' + inputPaddingX
        }"
        />

      <div class="actions">
        <span v-if="showCounter && maxlength" class="counter">
          {{ innerValue.length }}/{{ maxlength }}
        </span>

        <button
          v-if="loading"
          type="button"
          class="pill-btn stop"
          @click="$emit('stop')"
        >Parar</button>

        <button
          v-else
          type="button"
          class="send-btn"
          :disabled="!canSend || disabled"
          @click="submit"
          title="Enviar (Enter) • Nova linha (Shift+Enter)"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 20.6 22 12 3.4 3.4 3 10l12 2-12 2z"/></svg>
        </button>
      </div>
    </div>

    <!-- <div class="hints">
      <span>Enter: enviar</span>
      <span>Shift + Enter: nova linha</span>
      <span>Ctrl/Cmd + K: limpar</span>
    </div> -->
  </div>
</template>

<script>
export default {
    name: 'ChatInput',
    props: {
        modelValue: { type: String, default: '' },
        placeholder: { type: String, default: 'Escreva sua mensagem…' },
        disabled: { type: Boolean, default: false },
        loading: { type: Boolean, default: false },
        maxlength: { type: Number, default: null },
        showCounter: { type: Boolean, default: false },
        suggestions: { type: Array, default: () => [] },
        inputMinHeight: { type: Number, default: 64 },    
        inputMaxHeight: { type: Number, default: 260 },    
        inputFontSize: { type: String, default: '1.05rem' },
        inputPaddingY: { type: String, default: '.8rem' },
        inputPaddingX: { type: String, default: '.6rem' },
        width: { type: String, default: '100%' },   
        maxWidth: { type: String, default: null } 
    },
    emits: ['update:modelValue', 'submit', 'stop', 'attach', 'typing', 'clear'],
    data () {
        return { innerValue: this.modelValue }
    },
    computed: {
        canSend () {
        return this.innerValue && this.innerValue.trim().length > 0
        }
    },
    watch: {
        modelValue (v) {
        if (v !== this.innerValue) {
            this.innerValue = v || ''
            this.$nextTick(this.autosize)
        }
        }
    },
    mounted () {
        this.autosize()
        window.addEventListener('keydown', this.onGlobalKeydown)
    },
    beforeUnmount () {
        window.removeEventListener('keydown', this.onGlobalKeydown)
    },
    methods: {
    autosize () {
        const el = this.$refs.ta
        if (!el) return
        el.style.height = 'auto'
        const max = this.inputMaxHeight || 260
        el.style.height = Math.min(el.scrollHeight, max) + 'px'
        el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden'
    },
    onInput (e) {
        this.innerValue = e.target.value
        this.$emit('update:modelValue', this.innerValue)
        this.$emit('typing', this.innerValue)
        this.autosize()
    },
    onKeydown (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        this.submit()
        }
    },
    onGlobalKeydown (e) {
        const isCmdK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'
        if (isCmdK && !this.disabled) {
        e.preventDefault()
        this.clear()
        }
    },
    normalizeLabel (s) {
        if (typeof s === 'string') return s
        return s?.label || s?.value || ''
    },
    normalizeValue (s) {
        if (typeof s === 'string') return s
        return s?.value || s?.label || ''
    },
    normalizeIcon (s) {
        if (!s || typeof s === 'string' || !s.icon) return null
        const ic = s.icon
        if (ic.type === 'svg' && ic.path) return { type: 'svg', path: ic.path }
        if (ic.type === 'emoji' && ic.emoji) return { type: 'emoji', emoji: ic.emoji }
        return null
    },
    applySuggestion (s) {
        if (this.disabled || this.loading) return
        const text = this.normalizeValue(s)
        const sep = this.innerValue && !this.innerValue.endsWith(' ') ? ' ' : ''
        this.innerValue = (this.innerValue || '') + sep + text
        this.$emit('update:modelValue', this.innerValue)
        this.$nextTick(() => {
        const el = this.$refs.ta
        if (el) el.focus()
        this.autosize()
        })
    },
    submit () {
        if (!this.canSend || this.disabled) return
        const msg = this.innerValue.trim()
        this.$emit('submit', msg)
        this.innerValue = ''
        this.$emit('update:modelValue', '')
        this.$nextTick(this.autosize)
    },
    clear () {
        this.innerValue = ''
        this.$emit('update:modelValue', '')
        this.$emit('clear')
        this.$nextTick(this.autosize)
    }
    }

}

</script>

<style lang="scss" scoped>

.chat-input {
  display: grid;
  gap: $gap;
  background: var(--ci-bg, $ci-bg);
  padding: $ci-padding;
  border-radius: $ci-radius;
  border: 1px solid $ci-border;
  box-shadow: $ci-shadow;
  transition: border-color .2s ease;

  &.disabled {
    opacity: .6;
    pointer-events: none;
  }
}

.quick-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: .4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: .45rem;
  padding: .42rem .62rem;
  border-radius: 999px;
  border: 1px solid $chip-border;
  background: $chip-bg;
  color: $chip-text;
  font-size: .9rem;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  transition: border-color .15s ease, background-color .15s ease, transform .04s ease;

  &:hover {
    background: $chip-bg-hover;
    border-color: $chip-border-hover;
  }
  &:active {
    transform: translateY(1px);
  }
  &:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 2px rgba($accent, .22);
    border-color: mix($accent, $chip-border-hover, 60%);
  }
}

.chip-icon {
  display: inline-grid;
  place-items: center;
  width: 18px;
  height: 18px;
  flex: 0 0 18px;

  svg {
    width: 18px;
    height: 18px;
    fill: $chip-icon-color;
  }
  .emoji {
    font-size: 16px;
    line-height: 1;
    opacity: .9;
  }
}

.chip-label {
  white-space: nowrap;
  max-width: 22ch;
  overflow: hidden;
  text-overflow: ellipsis;
  color: $chip-text;
  opacity: .95;
}

.chip:hover .chip-label { opacity: 1 }

.composer {
  display: grid;
  grid-template-columns: auto max-content;
  align-items: end;
  gap: $gap;
  background: $composer-bg;
  border: 1px solid $composer-border;
  border-radius: $composer-radius;
  padding: .5rem .5rem .5rem .25rem;
}

.icon-btn {
  appearance: none;
  border: 0;
  background: transparent;
  width: $icon-size;
  height: $icon-size;
  border-radius: .7rem;
  display: grid;
  place-items: center;
  margin: .25rem;
  cursor: pointer;
  transition: background-color .15s ease, transform .05s ease;

  svg {
    width: 18px;
    height: 18px;
    fill: $icon-color;
  }
  &:hover { background: $icon-hover-bg }
  &:active { transform: translateY(1px) }
}

.input {
  grid-column: 1 / span 1;
  width: 100%;
  resize: none;
  border: 0;
  outline: 0;
  background: transparent;
  color: $input-text-dark;
  font-size: 1rem;
  line-height: 1.45;
  padding: .6rem .4rem .6rem .2rem;

  &::placeholder { color: $input-placeholder-dark }
}

.composer:focus-within {
  border-color: mix($accent, $stroke-1, 65%);
  box-shadow: 0 0 0 1px rgba($accent, .18);
}

.actions {
  display: flex;
  align-items: center;
  gap: $gap;
}

.counter {
  color: $muted-1;
  font-size: .8rem;
  margin-right: .25rem;
}

.pill-btn {
  appearance: none;
  border: 1px solid $chip-border;
  background: lighten($composer-bg, 3%);
  color: $input-text-dark;
  padding: .45rem .75rem;
  border-radius: .7rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color .15s ease, background-color .15s ease;

  &:hover {
    border-color: lighten($chip-border, 8%);
    background: lighten($composer-bg, 6%);
  }
  &:active { transform: translateY(1px) }
}

.send-btn {
  appearance: none;
  border: 0;
  background: linear-gradient(180deg, $send-bg, $send-bg-active);
  color: $send-text;
  width: $send-size;
  height: $send-size;
  border-radius: $btn-radius;
  display: grid;
  place-items: center;
  box-shadow: $send-shadow;
  cursor: pointer;
  transition: background-color .15s ease, transform .05s ease, box-shadow .15s ease;

  svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
    transform: translateX(1px);
  }
  &:hover { filter: brightness(1.05) }
  &:active { transform: translateY(1px) }
  &:disabled {
    filter: grayscale(.5);
    opacity: .6;
    cursor: not-allowed;
    box-shadow: none;
  }
}

@media (max-width: 640px) {
  .composer { grid-template-columns: 1fr max-content }
}
</style>
