<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.title"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                >
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.description"
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                >
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="article.body"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.tagList"
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                >
                <div class="tag-list" />
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click.prevent="onCreate()"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Article } from '@/engine/article'

export default {
  name: 'EditorIndex',
  middleware: 'authenticated',
  async asyncData ({ params }) {
    if (params.slug) {
      const { data } = await Article.getArticle(params.slug)
      return {
        article: data.article
      }
    } else {
      return {
        article: {
          title: '',
          description: '',
          body: '',
          tagList: []
        }
      }
    }
  },
  watch: {
    tagList: function (val) {
      this.article.tagList.push(val)
    }
  },
  methods: {
    async onCreate () {
      const params = {
        article: {
          ...this.article,
          tagList: typeof (this.article.tagList) === 'string' ? this.article.tagList.split(',') : this.article.tagList
        }
      }
      try {
        let result = {}
        if (this.article.slug) {
          result = await Article.update(this.article.slug, params)
        } else {
          result = await Article.create(params)
        }
        const data = result.data.article
        this.$router.push(`/article/${data.slug}`)
      } catch (e) {
        console.log(e)
        alert(e)
      }
    }
  }
}
</script>

<style></style>
