import React, { useState } from 'react'

type Props = {
  onImport: (svgText: string) => void
}

export default function FileImport({ onImport }: Props) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')

  const validateSVG = (text: string): boolean => {
    const trimmed = text.trim()
    return trimmed.startsWith('<svg') && trimmed.endsWith('</svg>')
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    const f = e.target.files?.[0]
    if (!f) return
    
    if (!f.name.toLowerCase().endsWith('.svg')) {
      setError('Please select a valid SVG file')
      return
    }

    try {
      const text = await f.text()
      if (!validateSVG(text)) {
        setError('Invalid SVG format')
        return
      }
      onImport(text)
    } catch (err) {
      setError('Failed to read file')
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    setError('')
    const text = e.clipboardData.getData('text')
    if (validateSVG(text)) {
      onImport(text)
    } else {
      setError('Invalid SVG in clipboard')
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError('')

    const files = e.dataTransfer.files
    if (!files.length) return

    const f = files[0]
    if (!f.name.toLowerCase().endsWith('.svg')) {
      setError('Please drop a valid SVG file')
      return
    }

    try {
      const text = await f.text()
      if (!validateSVG(text)) {
        setError('Invalid SVG format')
        return
      }
      onImport(text)
    } catch (err) {
      setError('Failed to read dropped file')
    }
  }

  return (
    <div
      className={`file-import ${dragActive ? 'drag-active' : ''}`}
      onPaste={handlePaste}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <label className="btn">
        Import SVG
        <input type="file" accept="image/svg+xml" onChange={handleFile} />
      </label>
      <div className="hint">Or drag & drop SVG file, or paste raw SVG</div>
      {error && <div className="error">{error}</div>}
    </div>
  )
}
