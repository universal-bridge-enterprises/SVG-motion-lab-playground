import React, { useEffect, useRef, useState } from 'react'

type Props = {
  svgText: string
  onChange: (t: string) => void
}

export default function SVGCanvas({ svgText, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [selected, setSelected] = useState<SVGElement | null>(null)
  const historyRef = useRef<string[]>([])
  const idxRef = useRef(-1)

  useEffect(() => {
    // initialize history when svgText imported
    if (!svgText) return
    pushHistory(svgText)
    renderSVG(svgText)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgText])

  function pushHistory(text: string) {
    const h = historyRef.current
    const next = h.slice(0, idxRef.current + 1)
    next.push(text)
    historyRef.current = next
    idxRef.current = next.length - 1
  }

  function undo() {
    if (idxRef.current <= 0) return
    idxRef.current -= 1
    const txt = historyRef.current[idxRef.current]
    onChange(txt)
    renderSVG(txt)
  }

  function redo() {
    if (idxRef.current >= historyRef.current.length - 1) return
    idxRef.current += 1
    const txt = historyRef.current[idxRef.current]
    onChange(txt)
    renderSVG(txt)
  }

  function serializeAndPush() {
    const html = containerRef.current?.querySelector('svg')?.outerHTML || ''
    if (!html) return
    pushHistory(html)
    onChange(html)
  }

  function renderSVG(text: string) {
    const container = containerRef.current
    if (!container) return
    container.innerHTML = text
    attachElementListeners()
  }

  function attachElementListeners() {
    const svg = containerRef.current?.querySelector('svg')
    if (!svg) return
    const elements = svg.querySelectorAll('*')
    elements.forEach((el) => {
      (el as Element).addEventListener('click', onElementClick as any)
    })
  }

  function onElementClick(e: Event) {
    e.stopPropagation()
    const el = e.currentTarget as SVGElement
    setSelected(el)
    highlight(el)
  }

  function highlight(el: SVGElement | null) {
    // remove previous
    const svg = containerRef.current?.querySelector('svg')
    if (!svg) return
    svg.querySelectorAll('[data-highlighted]').forEach((n) => n.removeAttribute('data-highlighted'))
    if (!el) return
    el.setAttribute('data-highlighted', 'true')
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault(); undo()
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault(); redo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // property helpers
  function updateAttr(attr: string, value: string) {
    if (!selected) return
    selected.setAttribute(attr, value)
    serializeAndPush()
  }

  function clearSelection() {
    setSelected(null)
    highlight(null)
  }

  return (
    <div className="canvas-root">
      <div className="svg-area" ref={containerRef} onClick={() => clearSelection()} />

      <aside className="inspector">
        <h3>Inspector</h3>
        {!containerRef.current?.querySelector('svg') && <div className="muted">Import an SVG to begin</div>}
        {selected ? (
          <div className="props">
            <div><strong>Tag:</strong> {selected.tagName}</div>
            <label>Fill<input value={selected.getAttribute('fill') || ''} onChange={(e) => updateAttr('fill', e.target.value)} /></label>
            <label>Stroke<input value={selected.getAttribute('stroke') || ''} onChange={(e) => updateAttr('stroke', e.target.value)} /></label>
            <label>Transform<input value={selected.getAttribute('transform') || ''} onChange={(e) => updateAttr('transform', e.target.value)} /></label>
            <button className="btn" onClick={() => { selected.remove(); serializeAndPush(); clearSelection() }}>Delete</button>
          </div>
        ) : (
          <div className="muted">Click an element in the SVG to edit</div>
        )}

        <div className="history-controls">
          <button className="btn" onClick={undo}>Undo</button>
          <button className="btn" onClick={redo}>Redo</button>
        </div>

        <div className="current-xml">
          <h4>SVG XML</h4>
          <textarea readOnly value={containerRef.current?.querySelector('svg')?.outerHTML || ''} />
        </div>
      </aside>
    </div>
  )
}
