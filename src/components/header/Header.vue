<template>
    <main class="container-header">
        <header>
            <section>
                <img src="/img/menu.png" alt="Logo" class="logo">
                <h1>Zampieri</h1>
            </section>
        </header>
    </main>
</template>
<script>
export default {
    
}
</script>
<style lang="scss" scoped>

    .container-header{
        padding: $mg
    }

    header{
        color: $branco;
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 3rem;
        border-bottom: 1px solid;

        section{
            gap: 1rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            img{
                width: 2rem;
            }
        }
    }
</style>