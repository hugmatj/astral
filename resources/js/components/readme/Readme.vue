<template>
  <div ref="readmeContainerEl" class="absolute inset-0 h-full overflow-y-auto">
    <div v-show="contents" class="relative w-full h-full mt-12 sm:mt-0">
      <div
        ref="readmeEl"
        class="p-4 prose max-w-none sm:max-w-2xl sm:mx-auto"
        v-html="contents"
      ></div>
    </div>
    <div
      v-show="isReadmeLoading"
      class="absolute inset-0 z-10 flex items-center justify-center text-center text-gray-500 bg-gray-50 dark:bg-gray-900"
    >
      Loading...
    </div>
    <div
      v-show="noRepoSelected"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center text-gray-500 bg-gray-50 dark:bg-gray-900"
    >
      <img
        src="/images/readme-not-selected.svg"
        alt="No Readme Selected"
        class="w-full max-w-sm"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, nextTick } from 'vue'
import { useStarsStore } from '@/store/useStarsStore'
import { debouncedWatch } from '@vueuse/core'
export default defineComponent({
  setup() {
    const starsStore = useStarsStore()

    const contents = ref<string>('')
    const isReadmeLoading = ref(false)

    const readmeEl = ref<HTMLElement>()
    const readmeContainerEl = ref<HTMLElement>()

    const noRepoSelected = computed(() => !starsStore.selectedRepos.length)

    debouncedWatch(
      () => starsStore.selectedRepo,
      async selectedRepo => {
        if (Object.keys(selectedRepo).length) {
          isReadmeLoading.value = true
          if (readmeContainerEl.value && readmeEl.value) {
            readmeContainerEl.value.scrollTo(0, 0)
            contents.value = await starsStore.fetchReadme(selectedRepo)

            await nextTick()

            patchReadmeAnchors()
            patchReadmeImages()
          }
          isReadmeLoading.value = false
        } else {
          contents.value = ''
        }
      },
      { debounce: 500 }
    )

    const patchReadmeAnchors = () => {
      if (!readmeEl.value) {
        return false
      }

      Array.from(readmeEl.value.querySelectorAll('a')).forEach(anchor => {
        if (anchor.href.replace(location.href, '').startsWith('#')) {
          anchor.addEventListener('click', e => {
            e.preventDefault()
            if (readmeContainerEl.value && readmeEl.value) {
              const anchorTop: number =
                readmeContainerEl.value.scrollTop +
                (e.currentTarget as HTMLElement).getBoundingClientRect()
                  .top -
                readmeContainerEl.value.getBoundingClientRect().top -
                16

              readmeContainerEl.value.scrollTo(0, anchorTop)
            }
          })
        } else {
          const repoName  = starsStore.selectedRepo.nameWithOwner
          const repoBranch  = starsStore.selectedRepo.defaultBranchRef.name
          const href = anchor.getAttribute('href')

          if (!href?.startsWith('http')) {
            anchor.href = `https://github.com/${repoName}/raw/${repoBranch}/${href}`
          }

          anchor.setAttribute('target', '_blank')
        }
      })
    }

    const patchReadmeImages = () => {

      if (!readmeEl.value) {
        return false
      }

      Array.from(readmeEl.value.querySelectorAll('img')).forEach(img => {
        const repoName  = starsStore.selectedRepo.nameWithOwner
        const repoBranch  = starsStore.selectedRepo.defaultBranchRef.name
        const imgSrc = img.getAttribute('src')

        if (!imgSrc?.startsWith('http')) {
          img.src = `https://github.com/${repoName}/raw/${repoBranch}/${imgSrc}`
        }
      })
    }
    return {
      contents,
      isReadmeLoading,
      readmeEl,
      readmeContainerEl,
      noRepoSelected,
    }
  },
})
</script>

<style lang="postcss">
.entry-content {
  h1,
  h2,
  h3,
  h4,
  h4,
  h5,
  h6 {
    > a.anchor {
      margin-right: 0.3em;

      svg.octicon-link {
        display: inline;
      }
    }
  }

  /* Syntax highlighting */
  .highlight {
    margin-bottom: 16px;
  }

  .highlight pre {
    margin-bottom: 0;
    word-break: normal;
    padding: 0.5rem;
  }

  /*!
 * GitHub Dark v0.5.0
 * Copyright (c) 2012 - 2017 GitHub, Inc.
 * Licensed under MIT (https://github.com/primer/github-syntax-theme-generator/blob/master/LICENSE)
 */

  .pl-c /* comment, punctuation.definition.comment, string.comment */ {
    color: #959da5;
  }

  .pl-c1 /* constant, entity.name.constant, variable.other.constant, variable.language, support, meta.property-name, support.constant, support.variable, meta.module-reference, markup.quote, markup.raw, meta.diff.header */,
.pl-s .pl-v /* string variable */ {
    color: #c8e1ff;
  }

  .pl-e /* entity */,
.pl-en /* entity.name */ {
    color: #b392f0;
  }

  .pl-smi /* variable.parameter.function, storage.modifier.package, storage.modifier.import, storage.type.java, variable.other */,
.pl-s .pl-s1 /* string source */ {
    color: #f6f8fa;
  }

  .pl-ent /* entity.name.tag */ {
    color: #7bcc72;
  }

  .pl-k /* keyword, storage, storage.type */ {
    color: #ea4a5a;
  }

  .pl-s /* string */,
.pl-pds /* punctuation.definition.string, source.regexp, string.regexp.character-class */,
.pl-s .pl-pse .pl-s1 /* string punctuation.section.embedded source */,
.pl-sr /* string.regexp */,
.pl-sr .pl-cce /* string.regexp constant.character.escape */,
.pl-sr .pl-sre /* string.regexp source.ruby.embedded */,
.pl-sr .pl-sra /* string.regexp string.regexp.arbitrary-repitition */ {
    color: #79b8ff;
  }

  .pl-v /* variable */,
.pl-ml /* markup.list, sublimelinter.mark.warning */ {
    color: #fb8532;
  }

  .pl-bu /* invalid.broken, invalid.deprecated, invalid.unimplemented, message.error, brackethighlighter.unmatched, sublimelinter.mark.error */ {
    color: #d73a49;
  }

  .pl-ii /* invalid.illegal */ {
    color: #fafbfc;
    background-color: #d73a49;
  }

  .pl-c2 /* carriage-return */ {
    color: #fafbfc;
    background-color: #d73a49;
  }

  .pl-c2::before /* carriage-return */ {
    content: '^M';
  }

  .pl-sr .pl-cce /* string.regexp constant.character.escape */ {
    font-weight: bold;
    color: #7bcc72;
  }

  .pl-mh /* markup.heading */,
.pl-mh .pl-en /* markup.heading entity.name */,
.pl-ms /* meta.separator */ {
    font-weight: bold;
    color: #0366d6;
  }

  .pl-mi /* markup.italic */ {
    font-style: italic;
    color: #f6f8fa;
  }

  .pl-mb /* markup.bold */ {
    font-weight: bold;
    color: #f6f8fa;
  }

  .pl-md /* markup.deleted, meta.diff.header.from-file, punctuation.definition.deleted */ {
    color: #b31d28;
    background-color: #ffeef0;
  }

  .pl-mi1 /* markup.inserted, meta.diff.header.to-file, punctuation.definition.inserted */ {
    color: #176f2c;
    background-color: #f0fff4;
  }

  .pl-mc /* markup.changed, punctuation.definition.changed */ {
    color: #b08800;
    background-color: #fffdef;
  }

  .pl-mi2 /* markup.ignored, markup.untracked */ {
    color: #2f363d;
    background-color: #959da5;
  }

  .pl-mdr /* meta.diff.range */ {
    font-weight: bold;
    color: #b392f0;
  }

  .pl-mo /* meta.output */ {
    color: #0366d6;
  }

  .pl-ba /* brackethighlighter.tag, brackethighlighter.curly, brackethighlighter.round, brackethighlighter.square, brackethighlighter.angle, brackethighlighter.quote */ {
    color: #ffeef0;
  }

  .pl-sg /* sublimelinter.gutter-mark */ {
    color: #6a737d;
  }

  .pl-corl /* constant.other.reference.link, string.other.link */ {
    text-decoration: underline;
    color: #79b8ff;
  }
}
</style>
