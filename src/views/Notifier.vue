<template>
    <Modal v-model="modal.show">
        <template slot="content">

            <h1 class="ui icon header" :class="modal.color">
                <i class="massive trophy icon"></i>
                <div class="content">
                    <span v-html="modal.text"></span><br>
                </div>
            </h1>

            <h2 class="ui icon header" :class="modal.color">
                <span class="subtext" v-html="modal.subtext"></span>
            </h2>

        </template>
    </Modal>
</template>

<script>

    import {db} from '../firebase/firebase';
    import Modal from '../components/Modal.vue';

    const texts = [
        '&quot;Alcohol may be man\'s worst enemy, but the bible says love your enemy&quot;'
    ];

    export default {
        components: {
            Modal
        },
        data() {
            return {
                users: [],
                shots: [],
                previous: {
                    total: 0,
                    highest: 0
                },
                modal: {
                    show: false,
                    text: '',
                    subtext: '',
                    color: ''
                }
            }
        },
        firebase: {
            users: db.ref('users'),
            shots: db.ref('shots').orderByChild('amount')
        },
        created() {
            this.$watch;

            // Check Credits every 5 minutes
            setInterval(this.checkUsersWithoutCredits, (5000));
        },
        watch: {
            shots(shots) {

                let highestShot = shots.reduce((max, shot) => {
                    return shot.amount > max.amount ? shot : max;
                }, {amount: 0});

                if (!this.modal.show) {
                    if (highestShot.amount !== this.previous.highest && highestShot.amount > 1) {
                        this.modal.show = true;
                        this.modal.text = 'Nieuw Record!<br>' + highestShot.amount + ' shots besteld door <br><span class="capitalize">' + this.findUserById(highestShot.userid).nickname + '</span>';
                        this.modal.color = 'yellow';
                    }

                    this.previous.highest = Number(highestShot.amount);

                    setTimeout(() => {
                        this.modal.show = false;
                    }, 10000)
                }
            }
        },
        users(users) {

            let totalShots = users.reduce((total, user) => {
                return Number(total) + Number(user.shots);
            }, 0);

            if (!this.modal.show) {
                if (totalShots !== this.previous.total && totalShots % 5 === 0 && totalShots >= 5) {
                    this.modal.show = true;
                    this.modal.text = totalShots + ' shots gepasseerd. Keep it up';
                    this.modal.subtext = texts[Math.floor(Math.random() * texts.length)];
                    this.modal.color = 'inverted';
                }

                this.previous.total = Number(totalShots);

                setTimeout(() => {
                    this.modal.show = false;
                }, 10000)
            }
        },
        methods: {
            checkUsersWithoutCredits() {

                if (!this.modal.show) {

                    let usersWithoutCredits = this.users.filter((user) => {
                        return user.credits === 0
                    });

                    let userWithMostCredits = this.users
                        .filter((user) => user.credits > 0)
                        .reduce((max, current) => current.credits > max.credits ? current : max, {credits: 0});


                    if(userWithMostCredits.credits) {
                        this.modal.show = true;
                        this.modal.text = usersWithoutCredits[Math.floor(Math.random() * texts.length)].name + ' je shots zijn op';
                        this.modal.subtext = ' vraag er wat aan ' + userWithMostCredits.name + '<br> hij heeft er genoeg!';
                        this.modal.color = 'inverted';

                        setTimeout(() => {
                            this.modal.show = false;
                        }, 4000)
                    }
                }
            },
            findUserById(id) {
                return this.users.find(user => user['.key'] === id);
            }
        }
    }
</script>