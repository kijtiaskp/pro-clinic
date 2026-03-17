<template>
  <div class="flex items-center gap-4">
    <div class="shrink-0 overflow-hidden flex items-center justify-center size-14 rounded-full bg-[#E8FAF8]">
      <img :src="staff.profileImage || defaultAvatar" class="size-full object-cover" />
    </div>
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-[#1E1E1E] m-0">{{ displayName }}</p>
      <StarRating v-model="rating" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StarRating from '@/components/StarRating.vue'
import defaultAvatar from '@/assets/icon/default-admin.png'

const props = defineProps({
  staff: { type: Object, required: true },
})

const displayName = computed(() => {
  const { prefix, firstname, lastname, nickname } = props.staff
  const fullName = [prefix, firstname, lastname].filter(Boolean).join(' ')
  if (nickname) return `${fullName} (${nickname})`
  return fullName
})

const rating = defineModel({ type: Number, default: 0 })
</script>
