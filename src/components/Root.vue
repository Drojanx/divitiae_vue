<template>
    <div id="rootSection" class="d-flex flex-column">
        <div class="container-fluid mt-8 w-50 text-center text-white" id="root">
            <h1 class="text-white">LOREM IPSUM DOLOR SIT AMET</h1>
            <p class="w-100 mx-auto mt-5">Curabitur ac ex eu nisl blandit rhoncus. Duis posuere eleifend nibh, in pulvinar elit vestibulum quis. Vivamus sed dolor sit amet lorem efficitur facilisis.</p>
            <div class=" mt-6 mb-9 buttons w-50 mx-auto">
                <button class="btn btn-warning px-5 py-2 rounded-0">Button</button>
                <button class="btn btn-outline-light px-5 py-2 rounded-0">Button</button>
            </div>
        </div>
        <div id="info" class="d-flex flex-column mt-3">
            <div class="container aboutbox d-flex justify-content-around mt-6">
                <div class="w-25 text-justify">
                    <h4 class="text-center">Text one hel ehtm et ertad.</h4>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea, labore voluptates quibusdam officia dolorum.</p>
                    <img class="w-100" src = "../assets/undraw_engineering_team_a7n2.svg"/>
                </div>
                <div class="w-33 text-justify aboutitem rounded-pill">
                    <img class="w-100 px-3 py-4" src = "../assets/undraw_projections_re_ulc6.svg"/>
                    <h4 class="text-center">Text one hel ehtm et ertad.</h4>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea, labore voluptates quibusdam officia dolorum.</p>
                </div>
                <div class="w-25 text-justify">
                    <h4 class="text-center">Text one hel ehtm et ertad.</h4>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea, labore voluptates.</p>
                    <img class="w-100" src = "../assets/undraw_scrum_board_re_wk7v.svg"/>
                </div>
            </div>
        </div>
    </div>    
</template>


<script>

    export default {
        name: 'Root',
        methods: {
            async googleLogIn() {
                console.log('hola ola')
                const googleUser = await this.$gAuth.signIn();
                console.log('Google user', googleUser);
            }
            
        }
    }
    
    
    

</script>