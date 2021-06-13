<script lang="ts">
import { defineComponent, h, computed } from 'vue'
export default defineComponent({
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
    hasContextMenu: {
      type: Boolean,
      default: false,
    }
  },
  setup(props) {
    const labelClasses = computed(() => {
      return props.isHighlighted
        ? 'text-white bg-brand-600'
        : props.isActive
        ? 'text-brand-600'
        : 'text-gray-400'
    })

    const badgeClasses = computed(() => {
      return (props.isHighlighted
        ? 'text-brand-600 bg-white'
        : props.isActive
        ? 'text-white bg-brand-600'
        : 'text-white bg-gray-700')
        + (props.hasContextMenu ? ' group-hover:opacity-0 group-focus-within:opacity-0' : '')
    })

    const iconClasses = computed(() => {
      return !(props.isActive || props.isHighlighted)
        ? 'opacity-60'
        : 'opacity-100'
    })

    return {
      labelClasses,
      badgeClasses,
      iconClasses,
    }
  },
  render() {
    return h(
      this.tag,
      {
        class: `group flex items-center p-1 font-semibold cursor-pointer text-sm ${this.labelClasses}`,
      },
      [
        !!this.$slots.icon &&
          h(
            'div',
            { class: `flex-shrink-0 w-5 h-5 mr-2 ${this.iconClasses}`, ariaHidden: true },
            this.$slots.icon()
          ),
        h('span', this.title),
        h('div', { class: 'relative ml-auto' }, [
          !!this.count &&
            h(
              'div',
              {
                class: `text-white rounded-full px-2 h-5 text-xs inline-flex items-center flex-shrink-0 ${this.badgeClasses}`,
              },
              this.count
            ),
            !!this.hasContextMenu && this.$slots.contextMenu && this.$slots.contextMenu()
        ])
      ]
    )
  },
})
</script>
