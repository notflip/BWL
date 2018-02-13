<template>
    <Modal v-model="amountModal.show" content="amountModal.text">
        <template slot="content">

            <h1 class="ui yellow icon header">
                <i class="massive trophy icon"></i>
                <div class="content">
                    {{ amountModal.text }}
                </div>
            </h1>

        </template>
    </Modal>
</template>

<script>

    import {db} from '../firebase/firebase';
    import Modal from '../components/Modal.vue';

    export default {
        components: {
            Modal
        },
        data() {
            return {
                users: [],
                amountModal: {
                    show: false,
                    text: ''
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
            users(users, old) {

                // Get the total number of shots
                let totalShots = users.reduce((total, user) => {
                    return Number(total) + Number(user.shots);
                }, 0);

                if (totalShots % 5 === 0 && totalShots >= 5) {
                    this.amountModal.show = true;
                    this.amountModal.text = totalShots + ' shots have passed the counter';
                }
            }
        },
        methods: {

        }
    }
</script>