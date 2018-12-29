/* @vue/component */
export default {
  methods: {
    genTColgroup () {
      if (!this.headers.every(header => header.width)) return // Exit we don't have width specified for all cols

      const children = this.genCols()

      return this.$createElement('colgroup', children)
    },
    genCols () {
      const columns = []

      for (const header of this.headers) {
        columns.push(this.$createElement('col', {
          attrs: { width: header.width }
        }))
      }

      return columns
    }
  }
}
