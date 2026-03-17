import liff from '@line/liff'

const liffId = import.meta.env.VITE_LIFF_ID

export async function initLiff() {
  await liff.init({ liffId })
}

export function closeLiff() {
  liff.closeWindow()
}
