import { ref, computed, onScopeDispose } from 'vue'
import imageCompression from 'browser-image-compression'
import heic2any from 'heic2any'

export const MAX_IMAGES = 12
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/heic', 'image/heif']
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.heic', '.heif']

function getExtension(file) {
  return '.' + file.name.split('.').pop().toLowerCase()
}

function isAllowedFile(file) {
  return ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(getExtension(file))
}

function isHeic(file) {
  const ext = getExtension(file)
  return file.type === 'image/heic' || file.type === 'image/heif' || ext === '.heic' || ext === '.heif'
}

async function convertHeicToJpeg(file) {
  const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.8 })
  const converted = Array.isArray(blob) ? blob[0] : blob
  return new File([converted], file.name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg'), {
    type: 'image/jpeg',
  })
}

async function compressImage(file) {
  return imageCompression(file, {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.8,
  })
}

export function useImageUpload() {
  const items = ref([]) // [{ url: string, file: File }]
  const imageError = ref('')
  const isProcessing = ref(false)

  const images = computed(() => items.value.map((item) => item.url))
  const imageFiles = computed(() => items.value.map((item) => item.file))

  // Revoke all object URLs when the composable's scope is disposed
  onScopeDispose(() => {
    items.value.forEach((item) => URL.revokeObjectURL(item.url))
  })

  async function handleUpload(event) {
    const files = Array.from(event.target.files)
    const remaining = MAX_IMAGES - items.value.length
    imageError.value = ''
    if (!files.length) return

    // Validate file types
    const invalidFiles = files.filter((f) => !isAllowedFile(f))
    if (invalidFiles.length) {
      imageError.value = 'รองรับเฉพาะไฟล์ PNG, JPG, HEIC เท่านั้น'
      event.target.value = ''
      return
    }

    // Validate file sizes
    const oversizedFiles = files.filter((f) => f.size > MAX_FILE_SIZE)
    if (oversizedFiles.length) {
      imageError.value = 'ไฟล์ขนาดเกิน 10MB ไม่สามารถอัพโหลดได้'
      event.target.value = ''
      return
    }

    const filesToProcess = files.slice(0, remaining)
    if (filesToProcess.length < files.length) {
      imageError.value = `เลือกได้สูงสุด ${MAX_IMAGES} รูป (เพิ่มได้อีก ${remaining} รูป)`
    }

    isProcessing.value = true

    try {
      const results = await Promise.all(
        filesToProcess.map(async (file) => {
          let processed = file
          if (isHeic(file)) {
            processed = await convertHeicToJpeg(file)
          }
          processed = await compressImage(processed)
          return processed
        })
      )

      for (const processed of results) {
        items.value.push({ url: URL.createObjectURL(processed), file: processed })
      }
    } catch (err) {
      console.error('Image processing error:', err)
      imageError.value = 'เกิดข้อผิดพลาดในการประมวลผลรูปภาพ'
    } finally {
      isProcessing.value = false
      event.target.value = ''
    }
  }

  function removeImage(index) {
    URL.revokeObjectURL(items.value[index].url)
    items.value.splice(index, 1)
  }

  return {
    images,
    imageFiles,
    imageError,
    isProcessing,
    handleUpload,
    removeImage,
  }
}
