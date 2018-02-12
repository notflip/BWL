<template>
    <div>
        <h1>Bar</h1>

        <!-- If an NFC card is scanned -->
        <div v-if="currentuser.id">

            <!-- If user exists and has at least 1 credit -->
            <form v-if="findUserById(currentuser.id) && findUserById(currentuser.id).credits >= 1" v-on:submit.prevent="saveShots()">

                <h4>Active User</h4>

                <input type="text" v-model="currentuser.id" disabled required>
                <input type="text" name="name" v-model="findUserById(currentuser.id).name" disabled required />

                <input type="number" name="shots" v-model="amount" min="1" />
                <button type="submit">Send</button>

            </form>

        </div>

        <!-- Shots -->
        <div>
            <ul>
                <li v-for="shot in shots">{{ findUserById(shot.userid).name }} ({{ shot.amount }} shot) op {{ shot.timestamp }}</li>
            </ul>
        </div>

    </div>
</template>

<script>

    import {db} from '../firebase/firebase';

    export default {
        data() {
            return {
                amount: 1
            }
        },
        firebase: {
            currentuser: {
                source: db.ref('currentuser'),
                asObject: true
            },
            users: db.ref('users'),
            shots: db.ref('shots')
        },
        methods: {
            findUserById(id) {
                return this.users.find(user => user['.key'] === id);
            },
            saveShots() {

                let user = this.findUserById(this.currentuser.id);

                if(user.credits < this.amount) {
                    return false;
                }

                let data = {
                    userid: user['.key'],
                    amount: this.amount,
                    timestamp: Date.now()
                };

                this.$firebaseRefs.shots.push(data);
                this.$firebaseRefs.currentuser.remove();

                const updatedUser = {...user};
                updatedUser.credits = user.credits - this.amount;

                delete updatedUser['.key'];
                this.$firebaseRefs.users.child(user['.key']).set(updatedUser);

                this.amount = 1;
            }
        }
    }
</script>