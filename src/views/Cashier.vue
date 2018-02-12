<template>
    <div>
        <h1>Cashier</h1>

        <!-- If an NFC card is scanned -->
        <div v-if="currentuser.id">

            <!-- If user exists -->
            <form v-if="activeUser" v-on:submit.prevent="saveUser()">

                <h4>Active User</h4>

                <input type="text" v-model="currentuser.id" disabled required>

                <input type="text" name="name" v-model="activeUser.name" disabled required/>
                <input type="text" name="name" v-model="activeUser.nickname" disabled required/>

                <input type="number" name="credits" v-model="activeUser.credits" min="1"/>
                <span>{{ creditsmoney }}&euro;</span>

                <button type="submit">Update</button>

            </form>

            <!-- If user doesn't yet exist -->
            <form v-else v-on:submit.prevent="saveUser()">

                <h4>New User</h4>

                <input type="text" v-model="currentuser.id" disabled required>

                <label>Name</label>
                <input type="text" name="name" v-model="user.name" required/>
                <label>Nickname</label>
                <input type="text" name="name" v-model="user.nickname" />

                <input type="number" name="credits" v-model="user.credits" min="1"/>
                <span>{{ creditsmoney }}&euro;</span>

                <button type="submit">Save</button>

            </form>

        </div>


        <ul>
            <li v-for="user in users" v-bind:key="user['.key']">{{ user.name }} : {{ user.credits }}</li>
        </ul>
    </div>
</template>

<script>

    import {db} from '../firebase/firebase';

    export default {
        data() {
            return {
                price: 2,
                user: {
                    name: '',
                    nickname: '',
                    credits: 1
                }
            }
        },
        firebase: {
            users: db.ref('users'),
            currentuser: {
                source: db.ref('currentuser'),
                asObject: true
            }
        },
        computed: {
            activeUser() {
                return this.users.find(user => user['.key'] === this.currentuser.id);
            },
            creditsmoney() {
                return this.activeUser
                    ? this.activeUser.credits * this.price
                    : this.user.credits * this.price;
            },
            validation() {
                return {
                    name: this.activeUser ? !!this.activeUser.name.trim() : !!this.user.name.trim(),
                    credits: this.activeUser ? this.activeUser.credits >= 1 : this.user.credits >= 1
                }
            },
            isValid() {
                return Object.keys(this.validation).every((key) => {
                    return this.validation[key];
                });
            }
        },
        methods: {
            saveUser() {
                if (this.isValid) {

                    let uid = this.currentuser.id;
                    let data = {
                        name: this.activeUser ? this.activeUser.name : this.user.name,
                        nickname: this.activeUser ? this.activeUser.nickname : (this.user.nickname ? this.user.nickname : this.user.name),
                        credits: this.activeUser ? this.activeUser.credits : this.user.credits,
                        shots: this.activeUser ? this.activeUser.shots : 0,
                        last: this.activeUser ? this.activeUser.last : null
                    };

                    this.$firebaseRefs.users.child(uid).set(data);
                    this.$firebaseRefs.currentuser.remove();

                    this.user.name = '';
                    this.user.credits = 0;
                }
            }
        }
    }
</script>