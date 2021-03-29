import { reactive, toRefs } from "vue";
import Worker from "@/workers/githubStars.worker.js";

const state = reactive({
  githubStars: [],
});

export function useGitHubStars(token) {
  const worker = new Worker();

  const fetchStars = () => {
    worker.postMessage({ token });

    worker.onmessage = ({ data }) => {
      state.githubStars = state.githubStars.concat(
        data.viewer.starredRepositories.edges
      );
    };
  };

  return {
    ...toRefs(state),
    fetchStars,
  };
}
