<template>
    <div>
        <h1>Overview</h1>

        <div>
            <table border="1">
                <transition-group name="flip-list" tag="tbody">
                    <tr v-for="user in getUsers" :key="user['.key']">
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
</template>

<script>

    import {db} from '../firebase/firebase';

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
        }
    }
</script>

<style>
    .flip-list-move {
        transition: transform 1s;
    }
</style>