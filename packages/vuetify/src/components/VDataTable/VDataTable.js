import '../../stylus/components/_tables.styl'
import '../../stylus/components/_data-table.styl'

import DataIterable from '../../mixins/data-iterable'

import Colgroup from './mixins/colgroup'
import Head from './mixins/head'
import Body from './mixins/body'
import Foot from './mixins/foot'
import Progress from './mixins/progress'

import {
  createSimpleFunctional,
  getObjectValueByPath
} from '../../util/helpers'

// Importing does not work properly
const VTableOverflow = createSimpleFunctional('v-table__overflow')

/* @vue/component */
export default {
  name: 'v-data-table',

  mixins: [DataIterable, Colgroup, Head, Body, Foot, Progress],

  props: {
    headers: {
      type: Array,
      default: () => []
    },
    headersLength: {
      type: Number
    },
    headerText: {
      type: String,
      default: 'text'
    },
    headerKey: {
      type: String,
      default: null
    },
    hideHeaders: Boolean,
    rowsPerPageText: {
      type: String,
      default: '$vuetify.dataTable.rowsPerPageText'
    },
    customFilter: {
      type: Function,
      default: (items, search, filter, headers) => {
        search = search.toString().toLowerCase()
        if (search.trim() === '') return items

        const props = headers.map(h => h.value)

        return items.filter(item => props.some(prop => filter(getObjectValueByPath(item, prop, item[prop]), search)))
      }
    },
    fixedHeaders: Boolean,
    maxHeight: {
      type: String,
      default: '60vh'
    }
  },

  data () {
    return {
      actionsClasses: 'v-datatable__actions',
      actionsRangeControlsClasses: 'v-datatable__actions__range-controls',
      actionsSelectClasses: 'v-datatable__actions__select',
      actionsPaginationClasses: 'v-datatable__actions__pagination'
    }
  },

  computed: {
    classes () {
      return {
        'fixed-headers-table': this.fixedHeaders,
        'fixed-columns-table': this.getFixedColumnLeft(),
        'v-datatable v-table': true,
        'v-datatable--select-all': this.selectAll !== false,
        ...this.themeClasses
      }
    },
    filteredItems () {
      return this.filteredItemsImpl(this.headers)
    },
    headerColumns () {
      return this.headersLength || this.headers.length + (this.selectAll !== false)
    }
  },

  created () {
    const firstSortable = this.headers.find(h => (
      !('sortable' in h) || h.sortable)
    )

    this.defaultPagination.sortBy = !this.disableInitialSort && firstSortable
      ? firstSortable.value
      : null

    this.initPagination()
  },

  methods: {
    hasTag (elements, tag) {
      return Array.isArray(elements) && elements.find(e => e.tag === tag)
    },
    genTR (children, data = {}) {
      return this.$createElement('tr', data, children)
    }
  },

  render (h) {
    const tableOverflow = h(VTableOverflow, {
      style: this.fixedHeaders ? {
        overflowY: 'auto',
        maxHeight: this.maxHeight
      } : {}
    }, [
      h('table', {
        'class': this.classes
      }, [
        this.genTColgroup(),
        this.genTHead(),
        this.genTBody(),
        this.genTFoot()
      ])
    ])

    return h('div', {
      'class': 'v-datatable-root'
    }, [
      tableOverflow,
      this.genActionsFooter()
    ])
  }
}
