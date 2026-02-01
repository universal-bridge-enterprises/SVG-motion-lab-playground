import React, { useState } from 'react'

type Props = {
  svgText: string
  setSvgText: (t: string) => void
}

export default function Toolbar({ svgText, setSvgText }: Props) {
  const [saveFormat, setSaveFormat] = useState<'svg' | 'json'>('svg')

  const downloadSVG = () => {
    const svg = svgText || '<svg></svg>'
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `edited-${Date.now()}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadJSON = () => {
    const svg = svgText || '<svg></svg>'
    const data = {
      svg,
      exported_at: new Date().toISOString(),
      format: 'svg-editor-export'
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `edited-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(svgText || '<svg></svg>')
    alert('SVG copied to clipboard!')
  }

  const clear = () => {
    if (confirm('Clear SVG? This cannot be undone.')) {
      setSvgText('')
    }
  }

  return (
    <div className="toolbar">
      <button className="btn" onClick={downloadSVG} disabled={!svgText} title="Download as SVG">
        ⬇ Save SVG
      </button>
      <button className="btn" onClick={downloadJSON} disabled={!svgText} title="Download as JSON">
        ⬇ Export JSON
      </button>
      <button className="btn" onClick={copyToClipboard} disabled={!svgText} title="Copy SVG to clipboard">
        📋 Copy
      </button>
      <button className="btn" onClick={clear} disabled={!svgText} title="Clear all">
        🗑 Clear
      </button>
      <div className="kbd-hint">Keyboard: Ctrl+Z (Undo), Ctrl+Y (Redo)</div>
    </div>
  )
}
