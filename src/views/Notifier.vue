<template>
    <Modal v-model="modal.show">
        <template slot="content">

            <div class="ui container">
                <h1 class="ui header inverted">
                    <img class="ui huge image" v-if="modal.image" :src="modal.image" alt="">
                    <i v-else class="alarm icon"></i>
                    <div class="content">
                        <div class="text" v-html="modal.text"></div>
                        <div class="subtext" v-html="modal.subtext"></div>
                    </div>
                </h1>
            </div>

        </template>
    </Modal>
</template>

<script>

    import {db} from '../firebase/firebase';
    import Modal from '../components/Modal.vue';

    const modalDuration = 10 * 1000; // 10 seconds
    const modalTimeout = 2.5 * 1000 * 60; // 2,5 minutes
    const modalMultiplier = 0.25;

    const minimumShots = 4;

    const quotes = [
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
                latestUserId: 0,
                modal: {
                    show: false,
                    image: '',
                    text: '',
                    subtext: ''
                }
            }
        },
        firebase: {
            users: db.ref('users'),
            shots: db.ref('shots').orderByChild('amount')
        },
        created() {

            this.$watch;

            // Intervals
            setInterval(() => {
                this.checkBestSupporter();
                setInterval(() => {
                    this.checkBestDrinker();
                }, (modalTimeout / 2) * modalMultiplier)
            }, modalTimeout * modalMultiplier);

        },
        watch: {
            shots(shots) {

                if (!this.modal.show) {
                    this.checkNewestShot(shots);


                    setTimeout(() => {
                        this.modal.show = false;
                    }, modalDuration)
                }

            },
            users(users) {

                // Welcome the new user
                if (!this.modal.show) {
                    this.checkNewestUser(users);


                    setTimeout(() => {
                        this.modal.show = false;
                    }, modalDuration)
                }
            }
        },
        methods: {
            checkNewestUser(users) {

                let newestUser = users.reduce((a, b) => a.identifier > b.identifier ? a : b, 0);

                if(newestUser) {
                    // Prevent newestUser modal from showing multiple times
                    if (this.latestUserId !== newestUser.identifier) {
                        this.modal.show = true;
                        this.modal.image = './public/icons/' + newestUser.identifier + '.svg';
                        this.modal.text = 'Welkom ' + newestUser.nickname;
                        this.modal.subtext = 'Bedankt om ons avontuur te steunen';

                        this.latestUserId = newestUser.identifier;

                    }
                }
            },
            checkNewestShot(shots) {

                if (shots) {

                    let newestShot = shots.reduce((a, b) => a.timestamp > b.timestamp ? a : b, 0);

                    if (newestShot.amount > minimumShots) {
                        this.modal.show = true;
                        this.modal.image = './public/icons/' + this.findUserById(newestShot.userid).identifier + '.svg';
                        this.modal.text = newestShot.amount + ' shots besteld door <br><span class="capitalize">' + this.findUserById(newestShot.userid).nickname + '</span>';
                        this.modal.subtext = quotes[Math.floor(Math.random() * quotes.length)];
                    }

                    setTimeout(() => {
                        this.modal.show = false;
                    }, modalDuration)
                }
            },
            checkBestSupporter() {

                if (!this.modal.show) {

                    let bestSupporter = this.users
                        .filter(user => user.credits > 0)
                        .reduce((a, b) => a.credits > b.credits ? a : b);

                    if (bestSupporter) {
                        this.modal.show = true;
                        this.modal.image = './public/icons/' + bestSupporter.identifier + '.svg';
                        this.modal.text = 'Bedankt aan onze grootste supporter<br>' + bestSupporter.nickname;
                        this.modal.subtext = '';

                        setTimeout(() => {
                            this.modal.show = false;
                        }, modalDuration)
                    }
                }
            },
            checkBestDrinker() {

                if (!this.modal.show) {

                    let bestDrinker = this.users
                        .filter(user => user.shots > 0)
                        .reduce((a, b) => a.shots > b.shots ? a : b);

                    if (bestDrinker) {
                        this.modal.show = true;
                        this.modal.image = './public/icons/' + bestDrinker.identifier + '.svg';
                        this.modal.text = 'De shotmeester van de avond is <br>' + bestDrinker.nickname;
                        this.modal.subtext = '';

                        setTimeout(() => {
                            this.modal.show = false;
                        }, modalDuration)
                    }
                }
            },
            findUserById(id) {
                return this.users.find(user => user['.key'] === id);
            }
        }
    }
</script>