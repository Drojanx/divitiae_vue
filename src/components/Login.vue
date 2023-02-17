<template>
    <form class="rounded px-5 py-4" @submit.prevent="handleSubmit">
        <div class="mx-auto w-75">
            <img src="../assets/Divitiae-1.png" id="accessLogo">
        </div>
        <h3 class="text-center">Log in to Divitiae</h3>

        <div class="form-group my-3">
            <label>Email</label>
            <input type="email" class="form-control" v-model="email" autofocus/>
        </div>

        <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" v-model="password"/>
        </div>

        <button class="btn btn-success btn-block mt-4 w-100">Login</button>
        <router-link to="/forgot" class="btn btn-dark btn-block mt-2 w-100">Forgot password?</router-link>

        <div class="text-center mt-3">
            <span>Don't have an account? </span><router-link to="/signup" class="text-reset">Sign up</router-link>
        </div>
        
        <div class="text-center mt-3">
            <span class="btn btn-block mt-2 w-100" @click="googleLogIn"><img src="../assets/google_signin_buttons/web/2x/btn_google.png" style="width: 100%"></span>
        </div>
    </form>
</template>

<script>
    import axios from 'axios'
    import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
    
    export default {
        name: 'Login',
        data() {
            return {
                email: '',
                password: ''
            }
        },
        methods: {
            async handleSubmit() {
                const response = await axios.post('user/login', {
                    email: this.email,
                    password: this.password,
                    isGoogleAccount: false
                })

                console.log(response)

                localStorage.setItem('token', response.data.token)
                this.$store.dispatch('user', response.data.user);
                this.$router.push('/home');               
                
                
            },
            async googleLogIn() {
                const provider = new GoogleAuthProvider;
                var gUser;
                await signInWithPopup(getAuth(), provider)
                    .then((result) => {
                        gUser = result.user;
                        console.log(gUser);
 
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                console.log(gUser);
                /*const response = await axios.post('user/google-login', {
                        name: gUser.displayName,
                        email: gUser.email,
                        googleUID: gUser.uid
                    })*/

                //console.log(response)

                //localStorage.setItem('token', response.data.token)
                //this.$store.dispatch('user', response.data.user);
                //this.$router.push('/home'); 
            }            
            
        }
    }
</script>
