<template>
    <div>
        <h1>Overview</h1>

        <div>
            <ul>
                <li v-for="user in users">{{ user.name}} {{ user.shots }} {{ user.last }}</li>
            </ul>
        </div>

    </div>
</template>

<script>

    import {db} from '../firebase/firebase';

    export default {
        firebase: {
            users: db.ref('users')
        }
    }
</script>