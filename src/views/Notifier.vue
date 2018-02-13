<template>
    <Modal v-model="amountModal.show" content="amountModal.text">
        <template slot="content">

            <h1 class="ui yellow icon header">
                <i class="massive trophy icon"></i>
                <div class="content">
                    {{ amountModal.text }}<br>
                </div>
            </h1>

            <h2 class="ui yellow icon header">
                <span class="subtext">{{ amountModal.subtext}}</span>
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
                previous: 0,
                amountModal: {
                    show: false,
                    text: '',
                    subtext: ''
                }
            }
        },
        firebase: {
            users: db.ref('users')
        },
        created() {
            this.$watch;
        },
        watch: {
            users(users) {

                // Get the total number of shots
                let totalShots = users.reduce((total, user) => {
                    return Number(total) + Number(user.shots);
                }, 0);

                if (totalShots !== this.previous && totalShots % 5 === 0 && totalShots >= 5) {
                    this.amountModal.show = true;
                    this.amountModal.text = totalShots + ' shots gepasseerd. Keep it up';
                    this.amountModal.subtext = texts[Math.floor(Math.random() * texts.length)];
                }

                this.previous = totalShots;

                setTimeout(() => {
                    this.amountModal.show = false;
                }, 10000)
            }
        },
        methods: {}
    }
</script>