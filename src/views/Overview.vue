<template>
    <div>
        <h1>Overview</h1>

        <div>
            <transition-group name="flip-list" tag="ul">
                <li v-for="user in getUsers" :key="user['.key']">{{ user.name}} {{ user.shots }} {{ user.last }}</li>
            </transition-group>
        </div>

    </div>
</template>

<script>

    import {db} from '../firebase/firebase';

    export default {
        firebase: {
            users: db.ref('users')
        },
        computed: {
            getUsers() {
                return this.users.sort((a, b) => {
                    return b.shots - a.shots;
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