import { Download } from 'lucide-react'
import { useState } from 'react'
import { analyticsService } from '../../services/analyticsService'
import { toMessage } from '../../services/api'

/** Triggers an immediate CSV download of the currently filtered range (PRD 4.5). */
export function CsvExportButton({ filters, onError }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const handleClick = async () => {
    setBusy(true)
    setError(null)
    try {
      await analyticsService.downloadCsv(filters)
    } catch (err) {
      const message = toMessage(err, 'Could not export your expenses.')
      setError(message)
      onError?.(message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button type="button" className="btn btn-secondary" onClick={handleClick} disabled={busy}>
        <Download size={16} aria-hidden="true" />
        {busy ? 'Exporting…' : 'Download CSV'}
      </button>
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  )
}

export default CsvExportButton