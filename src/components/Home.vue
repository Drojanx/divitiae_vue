<template>
    <h3>Hello poteto</h3>
</template>

<script>
import axios from 'axios';


    export default {
        name: 'Home',
        async created() {

            const response = await axios.get('user');

            
            console.log(response);
            console.log(response.data.token)

        }
    }
</script>