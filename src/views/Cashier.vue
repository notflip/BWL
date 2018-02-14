<template>
    <div>

        <!-- If an NFC card is scanned -->
        <div v-if="currentuser.id">

            <!-- If user exists -->
            <form class="ui form" v-if="activeUser" v-on:submit.prevent="saveUser()">

                <div class="field">
                    <input type="text" v-model="currentuser.id" disabled required>
                </div>

                <div class="field">
                    <input type="text" name="name" v-model="activeUser.name" disabled required/>
                </div>

                <div class="field">
                    <input type="text" name="name" v-model="activeUser.nickname" disabled required/>
                </div>

                <div class="inline fields">
                    <div class="field">
                        <input type="radio" id="a-male" value="m" v-model="activeUser.gender">
                        <label for="a-male">Male</label>
                    </div>
                    <div class="field">
                        <input type="radio" id="a-female" value="f" v-model="activeUser.gender">
                        <label for="a-female">Female</label>
                    </div>
                </div>

                <div class="field">
                    <input type="number" name="credits" v-model="activeUser.credits" min="1"/>
                    <div class="ui label">
                        <i class="mail icon"></i> {{ creditsmoney }}&euro;
                    </div>
                </div>

                <button type="submit">Update</button>

            </form>

            <!-- If user doesn't yet exist -->
            <form v-else v-on:submit.prevent="saveUser()">

                <h4>New User</h4>

                <input type="text" v-model="currentuser.id" disabled required>

                <label>Name</label>
                <input type="text" name="name" v-model="user.name" required/>
                <label>Nickname</label>
                <input type="text" name="name" v-model="user.nickname"/>

                <input type="radio" id="u-male" value="m" v-model="user.gender">
                <label for="u-male">Male</label>
                <input type="radio" id="u-female" value="f" v-model="user.gender">
                <label for="u-female">Female</label>

                <input type="number" name="credits" v-model="user.credits" min="1"/>
                <span>{{ creditsmoney }}&euro;</span>

                <button type="submit">Save</button>

            </form>

        </div>

        <div class="ui container">
            <div class="ui grid">
                <div class="column">
                    <h1>
                        Cashier
                    </h1>
                    <div class="ui red horizontal large label">
                        <i class="euro icon"></i> {{ earnings }}
                    </div>
                    <table class="ui very basic table">
                        <thead>
                            <tr>
                                <th>Naam</th>
                                <th>Credits</th>
                                <th>Shots</th>
                            </tr>
                        </thead>
                        <tr v-for="user in reversedUsers" :key="user['.key']">
                            <td>{{ user.name }}</td>
                            <td>{{ user.credits }}</td>
                            <td>{{ user.shots }}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>


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
                    gender: 'm',
                    credits: 1
                }
            }
        },
        firebase: {
            users: db.ref('users').orderByChild('credits'),
            currentuser: {
                source: db.ref('currentuser'),
                asObject: true
            }
        },
        computed: {
            earnings() {
                return this.users.reduce((total, user) => {
                    return Number(total) + Number(user.credits * this.price);
                }, 0);
            },
            reversedUsers() {
                return this.users.reverse();
            },
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
                        last: this.activeUser ? this.activeUser.last : 0,
                        gender: this.activeUser ? this.activeUser.gender : this.user.gender
                    };

                    console.log(data);

                    this.$firebaseRefs.users.child(uid).set(data);
                    this.$firebaseRefs.currentuser.remove();

                    this.user.name = '';
                    this.user.nickname = '';
                    this.user.gender = 'm';
                    this.user.credits = 0;
                }
            }
        }
    }
</script>