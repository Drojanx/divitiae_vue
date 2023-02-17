<template>
    <form class="rounded px-5 py-4" @submit.prevent="handleSubmit" novalidate id="registration_form">
        <div class="mx-auto w-75">
            <img src="../assets/Divitiae-1.png" id="accessLogo">
        </div>
        <h3 class="text-center">Sign up to Divitiae</h3>

        <div class="form-group mt-3">
            <label>First Name</label>
            <input type="text" class="form-control" v-model="first_name"/>
            <div class="text-danger" v-if="sent && !$v.first_name.required">Please, type your first name.</div>
        </div>

        <div class="form-group mt-3">
            <label>Last name</label>
            <input type="text" class="form-control" v-model="last_name"/>
            <div class="text-danger" v-if="sent && !$v.last_name.required">Please, type your last name.</div>
        </div>

        <div class="form-group mt-3">
            <label>Email</label>
            <input type="email" class="form-control" v-model="email"/>
            <div class="text-danger" v-if="sent && !$v.email.required">Please, type your email.</div>
            <div class="text-danger" v-if="sent && !$v.email.email">Please, type a valid email.</div>
            <div class="text-danger" v-if="sent && api_error"> {{ api_error_message }}</div>
        </div>

        <div class="form-group mt-3">
            <label>Password</label>
            <input type="password" class="form-control" v-model="password"/>
            <div class="text-danger" v-if="sent && !$v.password.required">Please, type a new password.</div>
            <div class="text-danger" v-if="sent && !$v.password.minLength">Password must have more than 6 characters.</div>
        </div>

        <div class="form-group mt-3">
            <label>Confirm Password</label>
            <input type="password" class="form-control" v-model="confirm_password"/>
            <div class="text-danger" v-if="sent && !$v.confirm_password.required">Please, confirm the password.</div>
            <div class="text-danger" v-if="sent && !$v.confirm_password.sameAsPassword">Passwords must be equal.</div>

        </div>

        <button class="btn btn-success btn-block mt-4 w-100">Sign up</button>
        <div class="text-center mt-3">
            <span>Already registered? </span><router-link to="/login" class="text-reset">Log in</router-link>
        </div>
    </form>
</template>

<script>
    import axios from 'axios'
    import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'


    export default {
        name: 'Signup',
        data() {
            return {
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                confirm_password: '',
                sent: false,
                api_error: false,
                api_error_message: ''
            }
        },  
        validations: {
            first_name: {required},
            last_name: {required},
            email: { required, email },
            password: {required, minLength: minLength(6)},
            confirm_password: {required, sameAsPassword: sameAs("password")}
        },
        methods: {
            async handleSubmit() {
                this.sent=true;

                const response = await axios.post('User/register', {
                    Name: this.first_name,
                    LastName: this.last_name,
                    Email: this.email,
                    Password: this.password
                }).then(
                    () => {
                        this.$router.push('/login');
                    }
                ).catch(
                    err => {
                        console.log(err.response.data.message);
                        var erorr_string = err.response.data.message;
                        var error_code = err.response.status;
                        console.log(error_code)
                        if(error_code='409'){
                            this.api_error=true;
                            this.api_error_message=erorr_string;
                        }
                    }
                )

                if (this.$v.$invalid) {
                    return;
                }

                console.log(response);

            }
        }
    }
</script>
