import React, { useState } from 'react'

type Props = {
  svgText: string
}

export default function ExportEnhancements({ svgText }: Props) {
  const [format, setFormat] = useState<'svg' | 'json' | 'jsx' | 'base64' | 'minified'>('svg')

  const exportSVG = () => {
    const blob = new Blob([svgText], { type: 'image/svg+xml' })
    downloadFile(blob, `export-${Date.now()}.svg`, 'image/svg+xml')
  }

  const exportJSON = () => {
    const data = {
      format: 'svg',
      content: svgText,
      exported: new Date().toISOString(),
      metadata: { editor: 'SVG Motion Lab' }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    downloadFile(blob, `export-${Date.now()}.json`, 'application/json')
  }

  const exportJSX = () => {
    const escaped = svgText
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')

    const jsx = `import React from 'react';

export default function SVGComponent() {
  return (
    <>
      {React.createElement('svg', {
        dangerouslySetInnerHTML: { __html: "${escaped}" }
      })}
    </>
  );
}

// Or as a string:
export const SVG_DATA = \`${svgText}\`;
`
    const blob = new Blob([jsx], { type: 'text/plain' })
    downloadFile(blob, `export-${Date.now()}.jsx`, 'text/plain')
  }

  const exportBase64 = () => {
    const base64 = btoa(svgText)
    const dataUrl = `data:image/svg+xml;base64,${base64}`
    const blob = new Blob([dataUrl], { type: 'text/plain' })
    downloadFile(blob, `export-${Date.now()}-base64.txt`, 'text/plain')
    copyToClipboard(dataUrl)
  }

  const exportMinified = () => {
    const minified = svgText
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .trim()
    const blob = new Blob([minified], { type: 'image/svg+xml' })
    downloadFile(blob, `export-${Date.now()}-min.svg`, 'image/svg+xml')
  }

  const downloadFile = (blob: Blob, filename: string, type: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  if (!svgText) return <div className="export-panel">Import SVG to export</div>

  return (
    <div className="export-panel">
      <h3>Export Options</h3>

      <div className="export-buttons">
        <button className="btn" onClick={exportSVG} title="Download standard SVG file">
          📄 SVG
        </button>
        <button className="btn" onClick={exportJSON} title="Export with metadata as JSON">
          🔗 JSON
        </button>
        <button className="btn" onClick={exportJSX} title="React JSX component">
          ⚛ JSX
        </button>
        <button className="btn" onClick={exportBase64} title="Copy Base64 data URL">
          🔐 Base64
        </button>
        <button className="btn" onClick={exportMinified} title="Minified SVG">
          📦 Minified
        </button>
      </div>

      <div className="export-info">
        <p><strong>Formats:</strong></p>
        <ul>
          <li><strong>SVG:</strong> Standard scalable vector format</li>
          <li><strong>JSON:</strong> SVG with metadata for storage</li>
          <li><strong>JSX:</strong> React component code</li>
          <li><strong>Base64:</strong> Embeddable data URL</li>
          <li><strong>Minified:</strong> Optimized SVG (smaller file)</li>
        </ul>
      </div>
    </div>
  )
}
