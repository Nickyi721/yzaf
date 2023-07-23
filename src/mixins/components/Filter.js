import Moment from 'moment'
export default {
  data () {
    return {
      options: {},
      bindData: {}
    }
  },
  filters: {
    formatDate (val, format = 'YYYY-MM-DD') {
      return Moment(val).format(format)
    }
  },
  methods: {
    _ButtonClick () {
      this.$emit('query', this.bindData, true)
    }
  }
}
