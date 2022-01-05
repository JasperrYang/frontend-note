<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="member.image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="member.username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                >
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="member.bio"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="member.email"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                >
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                @click.prevent="onUpdate()"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr>
          <button class="btn btn-outline-danger" @click="logout()">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { User } from '@/engine/user'
const Cookie = process.client ? require('js-cookie') : undefined
export default {
  name: 'SettingsIndex',
  middleware: 'authenticated',
  data () {
    return {
      member: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  beforeMount () {
    this.member = Object.assign({}, this.user)
    delete this.member.token
  },
  methods: {
    async onUpdate () {
      const params = {
        user: this.member
      }
      const { data } = await User.update(params)
      this.$store.commit('setUser', data.user)
      Cookie.set('user', data.user)
      this.$router.push(`/profile/${data.user.username}`)
    },
    async logout () {
      this.$store.commit('setUser', {})
      Cookie.remove('user')
      this.$router.push('/')
    }
  }
}
</script>

<style></style>
