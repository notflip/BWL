<template>
    <div>
        <h1>Overview</h1>

        <!-- Overview -->
        <div>
            <ul>
                <li v-for="shot in shots">{{ findUserById(shot.userid).name }} ({{ summer }} shot) op {{
                    shot.timestamp }}
                </li>
            </ul>
        </div>

    </div>
</template>

<script>

    import {db} from '../firebase/firebase';

    export default {
        firebase: {
            users: db.ref('users'),
            shots: db.ref('shots')
        },
        computed: {
            summer() {
                return this.shots.reduce((sum, shot) => {
                    return sum + parseInt(shot.amount)
                }, 0);
            }
        },
        methods: {
            findUserById(id) {
                return this.users.find(user => user['.key'] === id);
            }
        }
    }
</script>