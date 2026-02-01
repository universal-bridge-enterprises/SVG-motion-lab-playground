import React, { useCallback, useState } from 'react'
import Toolbar from './components/Toolbar'
import SVGCanvas from './components/SVGCanvas'
import FileImport from './components/FileImport'

export default function App() {
  const [svgText, setSvgText] = useState<string>('')

  const handleImport = useCallback((text: string) => {
    setSvgText(text)
  }, [])

  return (
    <div className="app-root">
      <header className="app-header">SVG Motion Lab Playground</header>
      <div className="top-row">
        <Toolbar svgText={svgText} setSvgText={setSvgText} />
        <FileImport onImport={handleImport} />
      </div>
      <main className="editor-area">
        <SVGCanvas svgText={svgText} onChange={setSvgText} />
      </main>
    </div>
  )
}
