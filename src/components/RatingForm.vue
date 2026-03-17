<template>
  <div>
    <div class="overflow-hidden">
      <img src="/header.png" alt="เพราะคุณคือคนสำคัญ" class="w-full block" />
    </div>

    <div class="content-area">
      <section class="flex flex-col gap-5">
        <div class="text-base font-bold text-[#282E45] leading-3.75">ทั่วไป</div>
        <div class="flex flex-col gap-5">
          <RatingRow
            v-for="item in generalCategories"
            :key="item.label"
            v-model="item.rating"
            :icon="item.icon"
            :icon-bg="item.iconBg"
            :label="item.label"
          />
        </div>
      </section>

      <section class="flex flex-col gap-5">
        <div class="text-base font-bold text-[#282E45] leading-3.75">แพทย์ / พนักงาน</div>
        <div class="flex flex-col gap-5">
          <StaffRatingRow
            v-for="staff in staffs"
            :key="staff.id"
            v-model="staff.rating"
            :staff="staff"
          />
        </div>
      </section>

      <section class="flex flex-col gap-2">
        <div class="text-base font-bold text-[#282E45] leading-3.75">แสดงความคิดเห็นเพิ่มเติม</div>
        <textarea
          v-model="comment"
          rows="4"
          class="w-full border border-[#E5E7EB] rounded-xl p-4 text-sm text-[#282E45] resize-none outline-none placeholder:text-[#BABFC9]"
          placeholder="กรุณากรอกข้อความ"
        />
      </section>

      <section>
        <div class="flex items-center justify-between">
          <div class="grid gap-2">
            <div class="text-base font-bold text-[#282E45] leading-3.75">รูปภาพเพิ่มเติม</div>
            <p class="text-xs text-[#BABFC9]">ไฟล์ PNG, JPG, HEIC ขนาดไม่เกิน 10MB/รูป, สูงสุด {{ MAX_IMAGES }} รูป</p>
          </div>
          <label v-if="images.length < MAX_IMAGES" class="shrink-0 size-8 bg-white border border-[#2EC4B6] rounded-lg flex items-center justify-center cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1V15M1 8H15" stroke="#2EC4B6" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <input type="file" accept=".png,.jpg,.jpeg,.heic,.heif" multiple class="hidden" @change="$emit('upload', $event)" />
          </label>
          <div v-else class="shrink-0 size-8 bg-[#E5E7EB] border border-[#E5E7EB] rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1V15M1 8H15" stroke="#BABFC9" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
        <div v-if="imageError" class="text-xs text-[#E57373] mt-2">{{ imageError }}</div>
        <div v-if="isProcessing" class="text-xs text-[#2EC4B6] mt-2">กำลังประมวลผลรูปภาพ...</div>
        <div class="grid grid-cols-4 gap-2 mt-2" v-if="images.length">
          <div v-for="(img, i) in images" :key="img" class="relative aspect-square rounded-lg overflow-hidden">
            <img :src="img" class="size-full object-cover" />
            <button @click="$emit('remove-image', i)" class="absolute top-1 right-1 size-3 flex items-center justify-center cursor-pointer p-0">
              <img src="@/assets/icon/btn-bin.png" alt="delete" class="size-full" />
            </button>
          </div>
        </div>
      </section>

    </div>

    <div class="sticky-bottom">
      <button @click="$emit('submit')" :disabled="isProcessing || submitting" class="w-full bg-[#2EC4B6] text-white rounded-full font-semibold text-base py-3.5 border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        ส่งข้อมูล
      </button>
    </div>
  </div>
</template>

<script setup>
import RatingRow from '@/components/RatingRow.vue'
import StaffRatingRow from '@/components/StaffRatingRow.vue'
import { MAX_IMAGES } from '@/composables/useImageUpload.js'

defineProps({
  generalCategories: { type: Array, required: true },
  staffs: { type: Array, required: true },
  images: { type: Array, required: true },
  imageError: { type: String, default: '' },
  isProcessing: { type: Boolean, default: false },
  submitting: { type: Boolean, default: false },
})

const comment = defineModel('comment', { type: String, default: '' })

defineEmits(['upload', 'remove-image', 'submit'])
</script>

<style scoped>
.content-area {
  border-radius: 24px 24px 0 0;
  background: white;
  margin-top: -24px;
  position: relative;
  z-index: 10;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 36px;
  padding-bottom: 84px;
}

.sticky-bottom {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 390px;
  padding: 12px 24px calc(12px + env(safe-area-inset-bottom));
  background: white;
  z-index: 20;
}
</style>
