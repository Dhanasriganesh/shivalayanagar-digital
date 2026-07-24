import { useState } from 'react'
import { fileToCompressedBase64 } from '../../utils/imageToBase64'
import { submitProblem } from '../../services/problems'

function ProblemForm({ street, onSubmitted }) {
  const [heading, setHeading] = useState('')
  const [description, setDescription] = useState('')
  const [preview, setPreview] = useState('')
  const [imageBase64, setImageBase64] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleImageChange(e) {
    const file = e.target.files?.[0]
    setError('')
    setSuccess(false)
    if (!file) {
      setPreview('')
      setImageBase64('')
      return
    }
    try {
      setBusy(true)
      const dataUrl = await fileToCompressedBase64(file)
      setImageBase64(dataUrl)
      setPreview(dataUrl)
    } catch (err) {
      setPreview('')
      setImageBase64('')
      setError(err.message || 'Could not process image.')
    } finally {
      setBusy(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!heading.trim()) {
      setError('Please add a short heading for the problem.')
      return
    }
    if (!imageBase64) {
      setError('Please upload a photo of the problem.')
      return
    }

    try {
      setBusy(true)
      await submitProblem({
        streetId: street.id,
        streetName: street.name,
        heading,
        description,
        imageBase64,
      })
      setHeading('')
      setDescription('')
      setPreview('')
      setImageBase64('')
      setSuccess(true)
      onSubmitted?.()
    } catch (err) {
      console.error(err)
      setError(
        err?.message?.includes('permission')
          ? 'Could not save. Check Firestore rules / Firebase config.'
          : 'Could not submit the report. Please try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-line bg-white p-4 shadow-[0_10px_30px_-18px_rgba(20,35,31,0.4)] sm:p-5"
    >
      <div>
        <h2 className="font-display text-lg font-bold text-ink">Report a problem</h2>
        <p className="mt-1 text-sm text-muted">
          Photo + short heading required. Description is optional.
        </p>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Photo *</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageChange}
          className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-teal file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
      </label>

      {preview ? (
        <div className="overflow-hidden rounded-xl border border-line bg-mist">
          <img src={preview} alt="Preview" className="max-h-56 w-full object-cover" />
        </div>
      ) : null}

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Heading *</span>
        <input
          type="text"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          maxLength={120}
          placeholder="e.g. Broken street light near house 12"
          className="w-full rounded-xl border border-line bg-paper px-3.5 py-3 text-base outline-none ring-teal/30 focus:ring-2"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">
          Description <span className="normal-case tracking-normal">(optional)</span>
        </span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={600}
          rows={3}
          placeholder="Any extra details that help locate or fix it…"
          className="w-full resize-y rounded-xl border border-line bg-paper px-3.5 py-3 text-base outline-none ring-teal/30 focus:ring-2"
        />
      </label>

      {error ? (
        <p className="rounded-xl border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral" role="alert">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-xl border border-leaf/30 bg-leaf/10 px-3 py-2 text-sm text-teal-deep" role="status">
          Report submitted. Thank you for helping the neighbourhood.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-xl bg-coral px-4 py-3.5 text-base font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? 'Submitting…' : 'Submit report'}
      </button>
    </form>
  )
}

export default ProblemForm
