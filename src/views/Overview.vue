<template>
    <div class="ui container">
        <div class="ui grid">
            <div class="column">
                <table class="ui celled table">

                    <transition-group name="flip-list" tag="tbody">
                        <tr v-for="user in getUsers" :key="user['.key']">
                            <td>
                                <img class="ui tiny rounded image" :src="generateAvatar(user)" />
                            </td>
                            <td>
                                {{ user.nickname}}<br>
                                {{ user.name}}
                            </td>
                            <td>
                                {{ user.shots }} 🍷
                            </td>
                            <td>
                                {{ new Date(user.last) | moment("from") }}
                            </td>
                        </tr>
                    </transition-group>
                </table>
            </div>
        </div>
    </div>
</template>

<script>

    import {db} from '../firebase/firebase';
    import * as toonavatar from 'cartoon-avatar';

    export default {
        firebase: {
            users: db.ref('users')
        },
        computed: {
            getUsers() {
                let results = this.users.filter(user => {
                    return user.shots >= 1;
                });

                return results.sort((a, b) => {
                    return b.shots - a.shots;
                });
            }
        },
        methods: {
            generateAvatar(user) {
                return 'https://api.adorable.io/avatars/80/'+ user['.key'] +'.png'
            }
        }
    }
</script>

<style>
    .flip-list-move {
        transition: transform 1s;
    }
</style>