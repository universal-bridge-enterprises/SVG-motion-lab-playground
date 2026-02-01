import React from 'react'

type Props = {
  svgText: string
  setSvgText: (t: string) => void
}

export default function Toolbar({ svgText, setSvgText }: Props) {
  const download = () => {
    const blob = new Blob([svgText || '<svg></svg>'], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'edited.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  const clear = () => setSvgText('')

  return (
    <div className="toolbar">
      <button className="btn" onClick={download} disabled={!svgText}>
        Save SVG
      </button>
      <button className="btn" onClick={clear} disabled={!svgText}>
        Clear
      </button>
      <div className="kbd-hint">Shortcuts: Ctrl+Z Undo, Ctrl+Y Redo</div>
    </div>
  )
}
