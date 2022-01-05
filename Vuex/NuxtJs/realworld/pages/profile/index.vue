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
                  <nuxt-link
                    class="nav-link"
                    :class="{
                      active: tab === 'myArticles'
                    }"
                    exact
                    :to="{
                      name: 'profile',
                      query: {
                        tab: 'myArticles'
                      }
                    }"
                  >
                    My Articles
                  </nuxt-link>
                </li>
                <li class="nav-item">
                  <nuxt-link
                    class="nav-link"
                    :class="{
                      active: tab === 'favorited'
                    }"
                    exact
                    :to="{
                      name: 'profile',
                      query: {
                        tab: 'favorited'
                      }
                    }"
                  >
                    Favorited Articless
                  </nuxt-link>
                </li>
              </ul>
            </div>

            <div
              v-for="article in articles"
              :key="article.slug"
              class="article-preview"
            >
              <div class="article-meta">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username
                    }
                  }"
                >
                  <img :src="article.author.image">
                </nuxt-link>
                <div class="info">
                  <nuxt-link
                    class="author"
                    :to="{
                      name: 'profile',
                      params: {
                        username: article.author.username
                      }
                    }"
                  >
                    {{ article.author.username }}
                  </nuxt-link>
                  <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
                </div>
                <button
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{
                    active: article.favorited
                  }"
                  :disabled="article.favoriteDisabled"
                  @click="onFavorite(article)"
                >
                  <i class="ion-heart" /> {{ article.favoritesCount }}
                </button>
              </div>
              <nuxt-link
                class="preview-link"
                :to="{
                  name: 'article',
                  params: {
                    slug: article.slug
                  }
                }"
              >
                <h1>{{ article.title }}</h1>
                <p>{{ article.description }}</p>
                <span>Read more...</span>
              </nuxt-link>
            </div>

            <nav>
              <ul class="pagination">
                <li
                  v-for="item in totalPage"
                  :key="item"
                  class="page-item"
                  :class="{
                    active: item === page
                  }"
                >
                  <nuxt-link
                    class="page-link"
                    :to="{
                      name: 'home',
                      query: {
                        page: item,
                        tab: tab
                      }
                    }"
                  >
                    {{ item }}
                  </nuxt-link>
                </li>
              </ul>
            </nav>
          <!-- /分页列表 -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { User } from '@/engine/user'
import { Article } from '@/engine/article'
import { mapState } from 'vuex'

export default {
  name: 'UserProfile',
  middleware: 'authenticated',
  async asyncData ({ query, params }) {
    const page = Number.parseInt(query.page || 1)
    const limit = 20
    const tab = query.tab || 'myArticles'
    const { data } = await User.getProfiles(params.username)
    const getArticlesParams = {
      limit,
      offset: (page - 1) * limit
    }
    tab === 'myArticles'
      ? getArticlesParams.author = params.username
      : getArticlesParams.favorited = params.username
    const articleRes = await Article.getArticles(getArticlesParams)
    const { articles, articlesCount } = articleRes.data
    return {
      articles,
      articlesCount,
      profile: data.profile,
      tab,
      limit,
      page
    }
  },
  watchQuery: ['page', 'tag', 'tab'],
  computed: {
    ...mapState(['user']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
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
    },
    async onFavorite (article) {
      article.favoriteDisabled = true
      if (article.favorited) {
        // 取消点赞
        await Article.deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        // 添加点赞
        await Article.addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    }
  }
}
</script>

<style></style>
