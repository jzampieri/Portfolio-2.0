<template>
    <main class="main">
        <header>
            <Header/>
        </header>
        <section class="chat-input">
            <article>
                <ChatInput
                v-model="query"
                :presets="[
                    { label: 'Me', value: 'Quem é o Julio?', icon: ['far','face-smile'], action: 'fill' },
                    { label: 'Projects', value: 'Mostre meus projetos recentes',  icon: ['fas','bag-shopping'], action: 'submit' },
                    { label: 'Skills', value: 'Quais são minhas skills?', icon: ['fas','layer-group'], action: 'fill' },
                    { label: 'Fun', value: 'Conte um fun fact', icon: ['fas','wand-magic-sparkles'], action: 'fill' },
                    { label: 'Contact', value: 'Formas de contato', icon: ['fas','user-lock'], action: 'fill' }
                ]"
                @submit="handleSearch"
                />
            </article>
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

    .main {
        background-color: $color-bg;
        height: 100vh;
        width: 100%;

        display: flex;
        flex-direction: column;

        header {
            display: flex;
            align-items: center;
            flex-direction: column;
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