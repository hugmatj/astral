<script lang="ts">
import { defineComponent, watch } from 'vue'
export default defineComponent({
  props: {
    value: {
      required: true,
      type: undefined
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    watch(() => props.value, (val) => {
      emit('change', val)
    })
  },
  render() {
    return []
  }
})
</script>
