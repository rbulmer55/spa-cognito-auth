<script setup lang="ts">
import { getCatFact } from '../services/info-service'
import { useUserStore } from '../stores/user'
import jwt from 'jwt-decode'

const user = useUserStore()
</script>

<script lang="ts">
export default {
  name: 'App',
  data() {
    return {
      fact: ''
    }
  },
  methods: {
    async catFact() {
      const result = await getCatFact()
      this.fact = result
    }
  },
  mounted() {
    this.catFact()
  }
}
</script>

<style>
.button {
  padding: 10px;
  border: none;
  border-radius: 2px;
  margin: 2px;
}
.button-login {
  background-color: greenyellow;
}
.button-logout {
  background-color: orange;
}

.p-catfact {
  margin: 10px;
  font-weight: bold;
}
</style>

<template>
  <main>
    <button v-if="user.loggedIn" class="button button-logout" @click="$router.push('/logout')">
      Sign out using Cognito
    </button>
    <button v-else class="button button-login" @click="$router.push('/login')">
      Sign in using Cognito
    </button>

    <h1>Our Random Cat Fact:</h1>
    <p class="p-catfact">{{ fact }}</p>

    <p v-if="user.loggedIn">
      You are successfully logged in. <br /><br />
      Your user profile is: <br /><br />{{ jwt(user.cognitoInfo.access_token) }}
    </p>
    <p v-else>You are <u>not</u> logged in, click the sign-in button above</p>
  </main>
</template>
