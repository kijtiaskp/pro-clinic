import { ref, reactive } from 'vue'
import { api } from '@/composables/useAuth.js'

function getQueryParams() {
  const params = new URLSearchParams(window.location.search)
  return {
    treatmentCode: params.get('treatment_code'),
    branchCode: params.get('branch_code'),
    clinicCode: params.get('clinic_code'),
  }
}

function mapPerson(person) {
  return {
    id: person.id,
    prefix: person.prefix ?? null,
    firstname: person.firstname ?? null,
    lastname: person.lastname ?? null,
    nickname: person.nickname ?? null,
    profileImage: person.profileImage ?? null,
    rating: 0,
  }
}

export function useTreatment() {
  const staffs = reactive([])
  const loading = ref(true)
  const error = ref(null)
  const notFound = ref(false)
  const queryParams = getQueryParams()

  async function fetchTreatment() {
    const { treatmentCode, clinicCode } = queryParams
    if (!treatmentCode || !clinicCode) {
      notFound.value = true
      return
    }

    loading.value = true
    error.value = null
    notFound.value = false
    try {
      const { data } = await api.get(`/clinics/${clinicCode}/treatments/${treatmentCode}`)
      const treatment = data.data ?? data

      const all = []
      if (treatment.doctor) all.push(mapPerson(treatment.doctor))
      if (treatment.assistants?.length) all.push(...treatment.assistants.map(mapPerson))
      staffs.splice(0, staffs.length, ...all)
    } catch (err) {
      const status = err.response?.status
      if (status === 400 || status === 404) {
        notFound.value = true
      }
      error.value = err.message
      console.error('Failed to fetch treatment:', err)
    } finally {
      loading.value = false
    }
  }

  return { staffs, loading, error, notFound, queryParams, fetchTreatment }
}
