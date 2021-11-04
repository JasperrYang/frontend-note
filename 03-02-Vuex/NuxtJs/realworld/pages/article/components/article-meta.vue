<template>
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
    <template v-if="user.username !== article.author.username">
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following
        }"
      >
        <i class="ion-plus-round" />
        &nbsp;
        Follow Eric Simons <span class="counter">(10)</span>
      </button>
          &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited
        }"
      >
        <i class="ion-heart" />
        &nbsp;
        Favorite Post <span class="counter">(29)</span>
      </button>
    </template>
    <template v-else>
      <button
        class="btn btn-sm btn-outline-secondary"
      >
        <i class="ion-edit" />
        &nbsp;
        Edit Article
      </button>
    &nbsp;&nbsp;
      <button
        class="btn btn-outline-danger btn-sm"
      >
        <i class="ion-trash-a" />
        &nbsp;
        Delete Article
      </button>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style>

</style>
