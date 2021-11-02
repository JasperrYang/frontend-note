<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img">
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <div v-if="isCurrentUser()">
              <router-link
                class="btn btn-sm btn-outline-secondary action-btn"
                :to="{ name: 'settings' }"
              >
                <i name="settings-outline" /> Edit Profile
                Settings
              </router-link>
            </div>
            <div v-else>
              <button
                v-if="profile.following"
                class="btn btn-sm btn-secondary action-btn"
                @click.prevent="unfollow()"
              >
                <i name="add-circle" /> &nbsp;Unfollow
                {{ profile.username }}
              </button>
              <button
                v-else
                class="btn btn-sm btn-outline-secondary action-btn"
                @click.prevent="follow()"
              >
                <i name="add-circle" /> &nbsp;Follow
                {{ profile.username }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <div class="articles-toggle">
              <ul class="nav nav-pills outline-active">
                <li class="nav-item">
                  <a class="nav-link active" href="">My Articles</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="">Favorited Articles</a>
                </li>
              </ul>
            </div>

            <div class="article-preview">
              <div class="article-meta">
                <a href=""><img src="http://i.imgur.com/Qr71crq.jpg"></a>
                <div class="info">
                  <a href="" class="author">Eric Simons</a>
                  <span class="date">January 20th</span>
                </div>
                <button class="btn btn-outline-primary btn-sm pull-xs-right"><i class="ion-heart" /> 29</button>
              </div>
              <a href="" class="preview-link">
                <h1>How to build webapps that scale</h1>
                <p>This is the description for the post.</p>
                <span>Read more...</span>
              </a>
            </div>

            <div class="article-preview">
              <div class="article-meta">
                <a href=""><img src="http://i.imgur.com/N4VcUeJ.jpg"></a>
                <div class="info">
                  <a href="" class="author">Albert Pai</a>
                  <span class="date">January 20th</span>
                </div>
                <button class="btn btn-outline-primary btn-sm pull-xs-right"><i class="ion-heart" /> 32</button>
              </div>
              <a href="" class="preview-link">
                <h1>The song you won't ever stop singing. No matter how hard you try.</h1>
                <p>This is the description for the post.</p>
                <span>Read more...</span>
                <ul class="tag-list">
                  <li class="tag-default tag-pill tag-outline">Music</li>
                  <li class="tag-default tag-pill tag-outline">Song</li>
                </ul>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { User } from '@/engine/user'
import { mapState } from 'vuex'

export default {
  name: 'UserProfile',
  middleware: 'authenticated',
  async asyncData ({ params }) {
    const { data } = await User.getProfiles(params.username)
    return {
      profile: data.profile
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    isCurrentUser () {
      if (this.user.username && this.profile.username) {
        return this.user.username === this.profile.username
      }
      return false
    },
    async follow () {
      await User.follow(this.profile.username)
    },
    async unfollow () {
      await User.unfollow(this.profile.username)
    }
  }
}
</script>

<style></style>
