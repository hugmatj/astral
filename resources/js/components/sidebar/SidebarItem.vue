<script>
import { h } from 'vue'

export default {
  props: {
    tag: {
      type: String,
      default: 'li',
    },
    title: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isHighlighted: {
      type: Boolean,
      default: false,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    labelClasses() {
      return this.isHighlighted
        ? 'text-white bg-brand-600'
        : this.isActive
        ? 'text-brand-600'
        : 'text-gray-400'
    },
    badgeClasses() {
      return this.isHighlighted
        ? 'text-brand-600 bg-white'
        : this.isActive
        ? 'text-white bg-brand-600'
        : 'text-white bg-gray-700'
    },
  },
  render() {
    return h(
      this.tag,
      {
        class: `flex items-center p-1 font-semibold cursor-pointer ${this.labelClasses}`,
      },
      [
        !!this.$slots.icon &&
          h('div', { class: 'flex-shrink-0 w-5 h-5 mr-2' }, this.$slots.icon()),
        h('span', this.title),
        !!this.count &&
          h(
            'div',
            {
              class: `text-white rounded-full px-2 py-0.5 text-xs inline-flex ml-auto flex-shrink-0 ${this.badgeClasses}`,
            },
            this.count
          ),
      ]
    )
  },
}
</script>
