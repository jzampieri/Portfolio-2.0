<template>
    <main class="main">
        <header>
            <Header/>
        </header>
        <section class="chat-input">
            <ChatInput
                v-model="draft"
                :inputMinHeight="40"
                :inputMaxHeight="320"
                inputFontSize="1.1rem"
                inputPaddingY="1rem"
                inputPaddingX=".8rem"
                :loading="sending"
                :disabled="false"
                :maxlength="800"
                :showCounter="true"
                :suggestions="[
                    { label: 'Quem é você?', value: 'Quem é você?', icon: { type: 'emoji', emoji: '👤' } },
                    { label: 'Projetos recentes', value: 'Fale dos seus projetos mais recentes', icon: { type: 'svg', path: 'M3 7h18v2H3zm0 4h12v2H3zm0 4h18v2H3z' } },
                    { label: 'Skills', value: 'Liste suas principais skills', icon: { type: 'emoji', emoji: '🛠️' } },
                    'Contato'
                ]"
                placeholder="Pergunte algo sobre o Julio…"
                @submit="onSubmit"
                @stop="onStop"
                @attach="onAttach"
            />
        </section>
    </main>
    </template>
<script>

import Header from '@/components/header/Header.vue';
import ChatInput from '@/components/ChatInput/ChatInput.vue';

export default {
    components: {
        Header,
        ChatInput
    }
}
</script>
<style lang="scss" scoped>

    .main{
        background-color: $preto;
        height: 100vh;
    }

</style>