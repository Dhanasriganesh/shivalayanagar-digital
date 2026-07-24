const MAX_WIDTH = 900
const MAX_HEIGHT = 900
const JPEG_QUALITY = 0.72
const MAX_FILE_BYTES = 8 * 1024 * 1024 // 8MB raw pick

/**
 * Compress an image file and return a base64 data URL (JPEG).
 * Keeps Firestore docs under the 1MB limit for typical phone photos.
 */
export function fileToCompressedBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file.'))
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      reject(new Error('Image is too large. Please pick a photo under 8MB.'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read the image.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not load the image.'))
      img.onload = () => {
        let { width, height } = img
        const scale = Math.min(1, MAX_WIDTH / width, MAX_HEIGHT / height)
        width = Math.round(width * scale)
        height = Math.round(height * scale)

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not process the image.'))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY)
          if (dataUrl.length > 900_000) {
            const tighter = canvas.toDataURL('image/jpeg', 0.55)
            resolve(tighter)
            return
          }
          resolve(dataUrl)
        } catch {
          reject(new Error('Could not convert the image.'))
        }
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
