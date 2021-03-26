import { reactive, toRefs } from "vue";
import { Inertia } from "@inertiajs/inertia";
import { useForm } from "@inertiajs/inertia-vue3";

const state = reactive({
  selectedTag: {},
});

export function useTags() {
  const addTagForm = useForm({
    name: "",
  });

  const addTag = () => {
    addTagForm.value.clearErrors();
    addTagForm.value.post("/tags", {
      onSuccess: () => addTagForm.value.reset("name"),
    });
  };

  const deleteTag = (id) => Inertia.delete(`/tags/${id}`);

  const setSelectedTag = (tag = {}) => {
    state.selectedTag = tag;
  };

  return {
    ...toRefs(state),
    addTag,
    deleteTag,
    setSelectedTag,
    addTagForm,
  };
}
