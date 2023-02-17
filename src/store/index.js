import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null
  },
  getters: {
    user: (state) => {
      return state.user;
    }
  },
  mutations: {
    user(state, userPayload) {
      state.user =  userPayload;
    }
  },
  actions: {
    user(context, user) {
      context.commit('user', user);
    }
  },
  modules: {
  }
})
