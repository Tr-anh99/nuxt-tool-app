import { useClipboard } from '@vueuse/core'

export function useCopyToClipboard() {
  const { copy, copied } = useClipboard({ legacy: true })
  const toast = useToast()

  async function copyText(text: string) {
    if (!text) {
      return
    }

    await copy(text)
    toast.add({
      title: 'Đã sao chép vào clipboard',
      icon: 'i-lucide-check',
      color: 'success'
    })
  }

  return { copyText, copied }
}
