<template>
  <div class="flex items-center gap-4">
    <div
      class="shrink-0 flex items-center justify-center size-14 rounded-xl text-2xl"
      :style="{ backgroundColor: iconBg }"
    >
      <img :src="icon" alt="" class="size-7" />
    </div>
    <div class="flex flex-col gap-1">
      <p class="text-xs font-medium text-[#1E1E1E] m-0">{{ label }}</p>
      <StarRating v-model="rating" />
    </div>
  </div>
</template>

<script setup>
import StarRating from '@/components/StarRating.vue'

defineProps({
  icon: { type: String, required: true },
  iconBg: { type: String, default: '#f0f4f8' },
  label: { type: String, required: true },
})

const rating = defineModel({ type: Number, default: 0 })
</script>
