import { useMemo, useState } from 'react'
import { CATEGORIES, getCategory } from '../../data/categories'
import { fileToCompressedBase64 } from '../../utils/imageToBase64'
import { submitProblem } from '../../services/problems'
import { getProfile, rememberGrievance, saveProfile } from '../../utils/grievance'
import { CategoryGlyph } from '../ui/Icons'
import { STREETS } from '../../data/streets'
import { useT } from '../../context/useT'

function GrievanceForm({ street: lockedStreet, onSubmitted }) {
  const { t, lang } = useT()
  const profile = useMemo(() => getProfile(), [])
  const [streetId, setStreetId] = useState(lockedStreet?.id ? String(lockedStreet.id) : '')
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [landmark, setLandmark] = useState('')
  const [description, setDescription] = useState('')
  const [citizenName, setCitizenName] = useState(profile.name || '')
  const [citizenPhone, setCitizenPhone] = useState(profile.phone || '')
  const [preview, setPreview] = useState('')
  const [imageBase64, setImageBase64] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const street = lockedStreet || STREETS.find((s) => String(s.id) === streetId) || null
  const catMeta = getCategory(category)
  const subs = catMeta?.subcategories || []

  async function handleImageChange(e) {
    const file = e.target.files?.[0]
    setError('')
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

    if (!street) {
      setError(lang === 'te' ? 'వీధిని ఎంచుకోండి.' : 'Please select your street.')
      return
    }
    if (!category) {
      setError(lang === 'te' ? 'వర్గం ఎంచుకోండి.' : 'Please select a category.')
      return
    }
    if (!subcategory) {
      setError(lang === 'te' ? 'ఉప వర్గం ఎంచుకోండి.' : 'Please select a sub-category.')
      return
    }
    if (!imageBase64) {
      setError(lang === 'te' ? 'సమస్య ఫోటోను అప్‌లోడ్ చేయండి.' : 'Please upload a photo of the problem.')
      return
    }
    const phone = citizenPhone.replace(/\D/g, '')
    if (citizenPhone && phone.length !== 10) {
      setError(lang === 'te' ? '10 అంకెల మొబైల్ నంబర్ ఇవ్వండి.' : 'Enter a valid 10-digit mobile number.')
      return
    }

    try {
      setBusy(true)
      const result = await submitProblem({
        streetId: street.id,
        streetName: street.name,
        category,
        subcategory,
        description,
        landmark,
        imageBase64,
        citizenName,
        citizenPhone: phone,
      })
      rememberGrievance(result.id)
      saveProfile({ name: citizenName.trim(), phone })
      onSubmitted?.(result)
    } catch (err) {
      console.error(err)
      setError(
        err?.message?.includes('permission')
          ? 'Could not save. Publish the updated Firestore rules, then try again.'
          : 'Could not submit the grievance. Please try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!lockedStreet ? (
        <label className="block space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">{t.street} *</span>
          <select
            value={streetId}
            onChange={(e) => setStreetId(e.target.value)}
            className="w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm outline-none ring-teal/30 focus:ring-2"
          >
            <option value="">{t.selectStreet}</option>
            {STREETS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <div className="rounded-xl border border-teal/20 bg-teal/5 px-3.5 py-3 text-sm">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{t.street}</p>
          <p className="font-bold text-teal-deep">{lockedStreet.name}</p>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">{t.category} *</p>
        <p className="text-xs text-muted">{t.selectCategory}</p>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((c) => {
            const active = category === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCategory(c.id)
                  setSubcategory('')
                }}
                className={`rounded-2xl border px-2 py-3 text-center transition ${
                  active
                    ? 'border-transparent text-white shadow-card'
                    : 'border-line bg-white text-ink'
                }`}
                style={active ? { backgroundColor: c.accent } : undefined}
              >
                <span className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-white/15">
                  <CategoryGlyph category={c.id} className="h-5 w-5" />
                </span>
                <span className="mt-1.5 block text-[12px] font-bold leading-tight">
                  {lang === 'te' ? c.labelTe : c.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">{t.subcategory} *</p>
        {!category ? (
          <p className="rounded-xl border border-dashed border-line bg-white/70 px-3 py-3 text-sm text-muted">
            {t.selectSubcategory}
          </p>
        ) : (
          <div className="space-y-2">
            {subs.map((s) => {
              const active = subcategory === s.id
              return (
                <label
                  key={s.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-sm font-semibold ${
                    active ? 'border-teal bg-teal/5 text-teal-deep' : 'border-line bg-white text-ink'
                  }`}
                >
                  <input
                    type="radio"
                    name="subcategory"
                    checked={active}
                    onChange={() => setSubcategory(s.id)}
                    className="accent-teal"
                  />
                  {lang === 'te' ? s.labelTe : s.label}
                </label>
              )
            })}
          </div>
        )}
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-wide text-muted">{t.photo} *</span>
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
        <span className="text-xs font-bold uppercase tracking-wide text-muted">
          {t.landmark} <span className="normal-case tracking-normal font-medium">({t.optional})</span>
        </span>
        <input
          type="text"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
          maxLength={200}
          placeholder={lang === 'te' ? 'ఉదా. 12వ ఇంటి ఎదురుగా' : 'e.g. Opposite house no. 12'}
          className="w-full rounded-xl border border-line bg-white px-3.5 py-3 text-base outline-none ring-teal/30 focus:ring-2"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-wide text-muted">
          {t.description} <span className="normal-case tracking-normal font-medium">({t.optional})</span>
        </span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={600}
          rows={3}
          placeholder={lang === 'te' ? 'సమస్యను గుర్తించే అదనపు వివరాలు…' : 'Any extra details that help locate or fix it…'}
          className="w-full resize-y rounded-xl border border-line bg-white px-3.5 py-3 text-base outline-none ring-teal/30 focus:ring-2"
        />
      </label>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">
            {t.name} <span className="normal-case tracking-normal font-medium">({t.optional})</span>
          </span>
          <input
            type="text"
            value={citizenName}
            onChange={(e) => setCitizenName(e.target.value)}
            maxLength={80}
            className="w-full rounded-xl border border-line bg-white px-3.5 py-3 text-base outline-none ring-teal/30 focus:ring-2"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-muted">
            {t.mobile} <span className="normal-case tracking-normal font-medium">({t.optional})</span>
          </span>
          <input
            type="tel"
            inputMode="numeric"
            value={citizenPhone}
            onChange={(e) => setCitizenPhone(e.target.value)}
            maxLength={10}
            placeholder="10-digit"
            className="w-full rounded-xl border border-line bg-white px-3.5 py-3 text-base outline-none ring-teal/30 focus:ring-2"
          />
        </label>
      </div>

      {error ? (
        <p className="rounded-xl border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-xl bg-gov-red px-4 py-3.5 text-base font-bold text-white shadow-sm transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? t.submitting : t.submit}
      </button>
    </form>
  )
}

export default GrievanceForm
