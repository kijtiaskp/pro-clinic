<template>
  <div class="flex gap-3">
    <button
      v-for="star in 5"
      :key="star"
      @click="rating = star"
      class="text-2xl leading-none p-0 border-none bg-transparent cursor-pointer"
    >
      <i :class="[star <= rating ? 'fa-solid' : 'fa-regular', 'fa-star text-[#FFD075]']"></i>
    </button>
  </div>
</template>

<script setup>
const rating = defineModel({ type: Number, default: 0 })
</script>
