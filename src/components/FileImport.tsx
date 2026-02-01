import React from 'react'

type Props = {
  onImport: (svgText: string) => void
}

export default function FileImport({ onImport }: Props) {
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const text = await f.text()
    onImport(text)
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text')
    if (text.trim().startsWith('<svg')) onImport(text)
  }

  return (
    <div className="file-import" onPaste={handlePaste}>
      <label className="btn">
        Import SVG
        <input type="file" accept="image/svg+xml" onChange={handleFile} />
      </label>
      <div className="hint">Or paste raw SVG into the page</div>
    </div>
  )
}
