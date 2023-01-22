<script setup lang="ts">
const randomIntFromRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const beforeEnter = (el: Element) => {
  Object.assign((el as HTMLElement).style, {
    transform: 'rotate(0deg) scale(0.9)',
    opacity: 0,
  })
}

const enter = (el: Element) => {
  const idx = Number(el.getAttribute('data-index') || 0)
  const tiltDirection = idx % 2 === 0 ? 1 : -1
  const tilt = randomIntFromRange(2, 7) * tiltDirection
  Object.assign((el as HTMLElement).style, {
    transform: `rotate(${tilt}deg) scale(0.9)`,
    opacity: 1,
  })
}

const leave = (el: Element, done: () => void) => {
  Object.assign((el as HTMLElement).style, {
    transform: 'rotate(0deg) scale(0.9)',
    opacity: 0,
  })
}
</script>

<template>
  <TransitionGroup :css="false" @before-enter="beforeEnter" @enter="enter" @leave="leave"><slot /></TransitionGroup>
</template>
