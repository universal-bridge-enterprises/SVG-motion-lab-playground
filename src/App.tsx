import React, { useCallback, useState, useEffect } from 'react'
import Toolbar from './components/Toolbar'
import SVGCanvas from './components/SVGCanvas'
import FileImport from './components/FileImport'
import ThemeToggle from './components/ThemeToggle'
import ElementLibrary from './components/ElementLibrary'
import ShapeTools from './components/ShapeTools'
import LayerPanel from './components/LayerPanel'
import PathEditor from './components/PathEditor'
import AnimationPanel from './components/AnimationPanel'
import ExportEnhancements from './components/ExportEnhancements'
import TextEditor from './components/TextEditor'
import TransformationsTool from './components/TransformationsTool'
import RulersGrid from './components/RulersGrid'

export default function App() {
  const [svgText, setSvgText] = useState<string>('')
  const [theme, setTheme] = useState<'light'|'dark'>(() => {
    try { return (localStorage.getItem('theme') as 'light'|'dark') || 'light' } catch { return 'light' }
  })

  useEffect(() => {
    try { setTheme((document.documentElement.getAttribute('data-theme') as 'light'|'dark') || theme) } catch {}
  }, [])

  const handleImport = useCallback((text: string) => {
    setSvgText(text)
  }, [])

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="brand">SVG Motion Lab</div>
        <div className="header-actions">
          <div className="header-left">
            <Toolbar svgText={svgText} setSvgText={setSvgText} />
            <FileImport onImport={handleImport} />
          </div>
          <div className="header-right">
            <div className="theme-indicator" aria-hidden>{theme === 'dark' ? '🌚' : '🌞'}</div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar-left">
          <div className="card">
            <h4>Tools</h4>
            <div className="card-body">
              <ElementLibrary onChange={setSvgText} />
              <ShapeTools svgElement={null} onChange={() => setSvgText(document.querySelector('svg')?.outerHTML || '')} />
            </div>
          </div>
        </aside>

        <main className="canvas-column">
          <div className="canvas-wrapper card">
            <SVGCanvas svgText={svgText} onChange={setSvgText} />
          </div>
        </main>

        <aside className="sidebar-right">
          <div className="tabs card">
            <div className="tabs-header">
              <button className="tab active">Inspector</button>
              <button className="tab">Layers</button>
              <button className="tab">Path</button>
              <button className="tab">Animations</button>
              <button className="tab">Export</button>
              <button className="tab">Text</button>
              <button className="tab">Transform</button>
              <button className="tab">Grid</button>
            </div>
            <div className="tabs-body">
              <div className="tab-panel">
                {/* Inspector content currently rendered inside SVGCanvas's aside — keep a lightweight placeholder */}
                <div className="muted">Select an element on the canvas to view inspector here.</div>
              </div>
              <div className="tab-panel hidden"><LayerPanel svgElement={null} onSelectElement={() => {}} onDeleteElement={() => {}} /></div>
              <div className="tab-panel hidden"><PathEditor selectedElement={null as any} onChange={setSvgText} /></div>
              <div className="tab-panel hidden"><AnimationPanel selectedElement={null as any} onChange={setSvgText} /></div>
              <div className="tab-panel hidden"><ExportEnhancements svgText={svgText} /></div>
              <div className="tab-panel hidden"><TextEditor selectedElement={null as any} onChange={setSvgText} /></div>
              <div className="tab-panel hidden"><TransformationsTool selectedElement={null as any} onChange={setSvgText} /></div>
              <div className="tab-panel hidden"><RulersGrid svgElement={null as any} onChange={() => setSvgText(document.querySelector('svg')?.outerHTML || '')} /></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
