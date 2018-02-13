<template>
    <div>

        <Notifier />

        <div class="ui container">
            <div class="ui grid">
                <div class="column">
                    <table class="ui very basic table">

                        <transition-group name="flip-list" tag="tbody">
                            <tr v-for="(user, index) in getUsers" :key="user['.key']">
                                <td>
                                    <h2 class="ui image header">
                                        <h3>{{ index + 1 }}</h3>
                                        <img class="ui rounded image" :src="avatar(user)" />
                                        <div class="content">
                                            {{ user.nickname}}
                                            <div class="sub header">{{ user.name }}</div>
                                        </div>
                                    </h2>
                                </td>
                                <td v-if="user.shots" class="center aligned">
                                    <h1>{{ user.shots }}</h1>
                                </td>
                                <td v-if="user.last" class="center aligned">
                                    <h3>{{ new Date(user.last) | moment("from") }}</h3>
                                </td>
                            </tr>
                        </transition-group>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import {db} from '../firebase/firebase';
    import Notifier from './Notifier';

    export default {
        components: {
          Notifier
        },
        firebase: {
            users: db.ref('users').orderByChild('shots').limitToLast(10)
        },
        computed: {
            getUsers() {
                return this.users.sort((a, b) => {
                    return b.shots - a.shots;
                });
            }
        },
        methods: {
            avatar(user) {
                return 'https://api.adorable.io/avatars/60/'+ user['.key'] +'.png'
            }
        }
    }
</script>

<style>
    .flip-list-move {
        transition: transform 1s;
    }
</style>