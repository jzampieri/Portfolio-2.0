<template>
    <main class="main">
        <header>
            <Header/>
        </header>
        <section class="chat-input">
            <article>
                <ChatInput
                v-model="query"
                :presets="default"
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