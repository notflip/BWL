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

    const modalDuration = 15 * 1000; // 15 seconds
    const modalTimeout = 30 * 1000 * 60; // 30 minutes
    const modalMultiplier = 0.1;

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

            // Periodic Checks
            setInterval(this.checkBestSupporter, modalTimeout * modalMultiplier);

            // Periodic Check with Offset
            let offset = setInterval(() => {
                clearInterval(offset);
                setInterval(this.checkTimeSinceLastShot, modalTimeout * modalMultiplier);
            }, (modalTimeout / 2) * modalMultiplier);


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
                    }, modalDuration * modalMultiplier)
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
                }, modalDuration * modalMultiplier)
            }
        },
        methods: {
            checkTimeSinceLastShot() {

                if (!this.modal.show) {

                    let lastShot = this.shots.reduce((max, current) => current.timestamp > max.timestamp ? current : max, {timestamp: 0});

                    if(lastShot.timestamp) {
                        this.modal.show = true;
                        this.modal.text = 'De laatste shot is al ' + this.$moment().to(lastShot.timestamp);
                        this.modal.subtext = 'De bar verveelt zich te pletter';
                        this.modal.color = 'inverted';

                        setTimeout(() => {
                            this.modal.show = false;
                        }, modalDuration * modalMultiplier)
                    }

                }
            },
            checkBestSupporter() {

                if (!this.modal.show) {

                    let bestSupporter = this.users
                        .filter(user => user.credits > 0)
                        .reduce((a, b) => a.credits > b.credits ? a : b);

                    if(bestSupporter) {
                        this.modal.show = true;
                        this.modal.text = 'Onze beste supporter is momenteel ' + bestSupporter.name;
                        this.modal.subtext = '';

                        this.modal.color = 'inverted';

                        setTimeout(() => {
                            this.modal.show = false;
                        }, modalDuration * modalMultiplier)
                    }
                }
            },
            findUserById(id) {
                return this.users.find(user => user['.key'] === id);
            }
        }
    }
</script>