<template>
    <div>

        <transition-group name="flip-list" tag="ul">
            <li v-for="user in users" :key="user.id">{{ user.name }} : {{ user.score}}</li>
        </transition-group>

    </div>
</template>

<script>
    export default {
        computed: {
            users() {
                return this.$store.state.users.sort((a, b) => {
                    return b.score - a.score;
                });
            }
        }
    }
</script>

<style>
    .flip-list-move {
        transition: transform 1s;
    }
</style>