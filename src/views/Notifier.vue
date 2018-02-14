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
                <span class="subtext">{{ modal.subtext}}</span>
            </h2>

        </template>
    </Modal>
</template>

<script>

    import {db} from '../firebase/firebase';
    import Modal from '../components/Modal.vue';

    const texts = [
        'Op u muileke',
        'Goé bezig amigos',
        'Nie neute nie pleuje'
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
        },
        watch: {
            shots(shots) {

                // If the Modal is not currently open
                if(!this.modal.show) {
                    // Get the highest amount of shots bought
                    let highestShot = shots.reduce((max, shot) => shot.amount > max ? shot : max, 0);

                    // If the amount of shots is different from the previous, show the modal
                    if (highestShot.amount !== this.previous.highest && highestShot.amount > 1) {
                        this.modal.show = true;
                        this.modal.text = highestShot.amount + ' shots tegelijk besteld door <br>' + this.findUserById(highestShot.userid).name;
                        this.modal.subtext = texts[Math.floor(Math.random() * texts.length)];
                        this.modal.color = 'yellow';
                    }

                    this.previous.highest = highestShot.amount;

                    setTimeout(() => {
                        this.modal.show = false;
                    }, 10000)
                }

            },
            users(users) {

                // Get the total number of shots
                let totalShots = users.reduce((total, user) => {
                    return Number(total) + Number(user.shots);
                }, 0);

                // If the number of shots is different from the previous, show the modal
                if (totalShots !== this.previous.total && totalShots % 5 === 0 && totalShots >= 5) {
                    this.modal.show = true;
                    this.modal.text = totalShots + ' shots gepasseerd. Keep it up';
                    this.modal.subtext = texts[Math.floor(Math.random() * texts.length)];
                    this.modal.color = 'inverted';
                }

                this.previous.total = totalShots;

                setTimeout(() => {
                    this.modal.show = false;
                }, 10000)
            }
        },
        methods: {
            findUserById(id) {
                return this.users.find(user => user['.key'] === id);
            },
        }
    }
</script>