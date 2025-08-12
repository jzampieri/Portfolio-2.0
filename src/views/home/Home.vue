<template>
    <main class="main">
        <header>
            <Header/>
        </header>
    </main>
    </template>
<script>
import Header from '@/components/header/Header.vue';

export default {
    components: {
        Header
    }
}
</script>
<style lang="scss" scoped>

    .main{
        background-color: $preto;
        height: 100vh;
    }

</style>