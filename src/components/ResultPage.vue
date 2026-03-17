<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-6">
    <img :src="iconPath" alt="" class="result-icon" />

    <div class="text-[24px] text-center" :style="{ color: titleColor }">
      <slot name="title" />
    </div>

    <slot />

    <button @click="$emit('close')" class="mt-7 text-[#282E45] font-medium text-sm underline bg-transparent border-none cursor-pointer">
      กลับหน้า LINEOA
    </button>
  </div>
</template>

<script setup>
defineProps({
  iconPath: { type: String, required: true },
  titleColor: { type: String, default: '#1D2A62' },
})
defineEmits(['close'])
</script>

<style scoped>
.result-icon {
  width: 96px;
  height: 96px;
  margin-bottom: 8px;
}
</style>
