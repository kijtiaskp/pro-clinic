<template>
  <div class="min-h-screen bg-gray-100 flex justify-center">
    <div class="w-97.5 min-h-screen bg-white">
      <div v-if="loading" class="loading-page">
        <img :src="loadingIcon" alt="loading" class="loading-spinner" />
        <p class="mt-7 text-[20px] text-[#1E1E1E] font-semibold">กำลังโหลด</p>
      </div>

      <div v-else-if="notFound" class="not-found-page">
        <h1 class="not-found-code">404</h1>
        <p class="not-found-text">ไม่พบหน้าที่คุณค้นหา</p>
      </div>

      <RatingForm
        v-else-if="currentPage === 'form'"
        :general-categories="generalCategories"
        :staffs="staffs"
        v-model:comment="comment"
        :images="images"
        :image-error="imageError"
        :is-processing="isProcessing"
        :submitting="submitting"
        @upload="handleUpload"
        @remove-image="removeImage"
        @submit="submitFeedback"
      />

      <div v-if="submitting" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div class="w-85.5 h-50 bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-7">
          <img :src="loadingIcon" alt="loading" class="loading-spinner" />
          <p class="text-[20px] text-[#1E1E1E] font-semibold">กำลังตรวจสอบข้อมูล</p>
        </div>
      </div>

      <ResultPage
        v-else-if="currentPage === 'complete'"
        :icon-path="checkGif"
        @close="closeLiff"
      >
        <template #title>ขอบคุณที่ร่วมประเมิน<br>ความพึงพอใจ</template>
      </ResultPage>

      <ResultPage
        v-else-if="currentPage === 'failed'"
        :icon-path="crossGif"
        @close="closeLiff"
      >
        <template #title>ประเมินไม่สำเร็จ</template>
        <p class="text-[#282E45] text-sm">กรุณาทำรายการใหม่อีกครั้ง</p>
      </ResultPage>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { closeLiff } from '@/liff.js'
import { useImageUpload } from '@/composables/useImageUpload.js'
import { api } from '@/composables/useAuth.js'
import { useTreatment } from '@/composables/useTreatment.js'
import RatingForm from '@/components/RatingForm.vue'
import ResultPage from '@/components/ResultPage.vue'
import checkGif from '@/assets/gif/check.gif'
import crossGif from '@/assets/gif/cross.gif'
import syringeIcon from '@/assets/icon/syringe.png'
import packageIcon from '@/assets/icon/package.png'
import broomIcon from '@/assets/icon/broom.png'
import loadingIcon from '@/assets/icon/loading.png'

const currentPage = ref('form')
const comment = ref('')
const submitting = ref(false)

const { images, imageFiles, imageError, isProcessing, handleUpload, removeImage } = useImageUpload()
const { staffs, loading, notFound, queryParams, fetchTreatment } = useTreatment()

const generalCategories = reactive([
  { label: 'การบริการ', icon: syringeIcon, iconBg: '#FAFAFD', rating: 0 },
  { label: 'คุณภาพของสินค้า', icon: packageIcon, iconBg: '#FAFAFD', rating: 0 },
  { label: 'ความสะอาดภายในคลินิก', icon: broomIcon, iconBg: '#FAFAFD', rating: 0 },
])

onMounted(async () => {
  await fetchTreatment()
})

async function submitFeedback() {
  const { clinicCode, branchCode, treatmentCode } = queryParams
  submitting.value = true

  try {
    const payload = {
      branchCode,
      treatmentCode,
      serviceRating: generalCategories[0].rating,
      productQualityRating: generalCategories[1].rating,
      cleanlinessRating: generalCategories[2].rating,
      staffRatings: staffs
        .filter((s) => s.rating > 0)
        .map((s) => ({ userId: s.id, rating: s.rating })),
      comment: comment.value,
      isAnonymous: false,
    }

    const { data } = await api.post(`/clinics/${clinicCode}/reviews`, payload)
    const review = data.data ?? data

    if (imageFiles.value.length && review.id && review.uploadToken) {
      try {
        const formData = new FormData()
        formData.append('uploadToken', review.uploadToken)
        imageFiles.value.forEach((file) => formData.append('images', file))
        await api.post(`/clinics/${clinicCode}/reviews/${review.id}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } catch (uploadErr) {
        console.warn('Image upload failed, review was saved:', uploadErr)
      }
    }

    currentPage.value = 'complete'
  } catch (err) {
    console.error('Submit error:', err)
    currentPage.value = 'failed'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.not-found-code {
  font-size: 120px;
  font-weight: 900;
  color: #282E45;
  line-height: 1;
  margin: 0;
}

.not-found-text {
  font-size: 18px;
  color: #282E45;
  margin-top: 12px;
}

.loading-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.loading-spinner {
  width: 100px;
  height: 100px;
  animation: spin 2s linear infinite;
}


@keyframes spin {
  to { transform: rotate(360deg); }
}


</style>
