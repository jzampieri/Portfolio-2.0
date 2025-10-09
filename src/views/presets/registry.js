import { defineAsyncComponent } from 'vue'

export const VIEW_REGISTRY = {
  contact: defineAsyncComponent(() => import('@/views/presets/ContactCard.vue')),
  skills: defineAsyncComponent(() => import('@/views/presets/SkillsGrid.vue'))
}
