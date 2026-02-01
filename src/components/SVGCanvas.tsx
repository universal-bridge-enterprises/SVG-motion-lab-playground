import React, { useEffect, useRef, useState } from 'react'

type Props = {
  svgText: string
  onChange: (t: string) => void
}

interface HistoryEntry {
  svg: string
  timestamp: number
}

export default function SVGCanvas({ svgText, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [selected, setSelected] = useState<SVGElement | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)

  useEffect(() => {
    if (!svgText) return
    pushToHistory(svgText)
    renderSVG(svgText)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgText])

  function pushToHistory(text: string) {
    setHistory((prev) => {
      const next = prev.slice(0, historyIdx + 1)
      return [...next, { svg: text, timestamp: Date.now() }]
    })
    setHistoryIdx((prev) => prev + 1)
  }

  function undo() {
    const newIdx = Math.max(0, historyIdx - 1)
    if (newIdx === historyIdx) return
    const entry = history[newIdx]
    if (entry) {
      setHistoryIdx(newIdx)
      onChange(entry.svg)
      renderSVG(entry.svg)
    }
  }

  function redo() {
    const newIdx = Math.min(history.length - 1, historyIdx + 1)
    if (newIdx === historyIdx) return
    const entry = history[newIdx]
    if (entry) {
      setHistoryIdx(newIdx)
      onChange(entry.svg)
      renderSVG(entry.svg)
    }
  }

  function serializeAndPush() {
    const html = containerRef.current?.querySelector('svg')?.outerHTML || ''
    if (!html) return
    onChange(html)
    pushToHistory(html)
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
    svg.querySelectorAll('*').forEach((el) => {
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
    const svg = containerRef.current?.querySelector('svg')
    if (!svg) return
    svg.querySelectorAll('[data-highlighted]').forEach((n) => n.removeAttribute('data-highlighted'))
    if (el) el.setAttribute('data-highlighted', 'true')
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        undo()
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyIdx])

  function updateAttr(attr: string, value: string) {
    if (!selected) return
    if (value === '') {
      selected.removeAttribute(attr)
    } else {
      selected.setAttribute(attr, value)
    }
    serializeAndPush()
  }

  function clearSelection() {
    setSelected(null)
    highlight(null)
  }

  const svg = containerRef.current?.querySelector('svg')

  return (
    <div className="canvas-root">
      <div className="svg-area" ref={containerRef} onClick={() => clearSelection()} />

      <aside className="inspector">
        <h3>Inspector</h3>
        {!svg && <div className="muted">Import an SVG to begin</div>}
        {selected ? (
          <div className="props">
            <div><strong>Tag:</strong> {selected.tagName}</div>
            <div className="prop-section">
              <label>ID
                <input
                  type="text"
                  value={selected.getAttribute('id') || ''}
                  onChange={(e) => updateAttr('id', e.target.value)}
                  placeholder="Element ID"
                />
              </label>
              <label>Class
                <input
                  type="text"
                  value={selected.getAttribute('class') || ''}
                  onChange={(e) => updateAttr('class', e.target.value)}
                  placeholder="CSS classes"
                />
              </label>
            </div>
            <div className="prop-section">
              <label>Fill
                <input
                  type="text"
                  value={selected.getAttribute('fill') || ''}
                  onChange={(e) => updateAttr('fill', e.target.value)}
                  placeholder="e.g., #ff0000"
                />
              </label>
              <label>Stroke
                <input
                  type="text"
                  value={selected.getAttribute('stroke') || ''}
                  onChange={(e) => updateAttr('stroke', e.target.value)}
                  placeholder="e.g., #000000"
                />
              </label>
              <label>Stroke Width
                <input
                  type="text"
                  value={selected.getAttribute('stroke-width') || ''}
                  onChange={(e) => updateAttr('stroke-width', e.target.value)}
                  placeholder="e.g., 2"
                />
              </label>
            </div>
            <div className="prop-section">
              <label>Opacity
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={selected.getAttribute('opacity') || '1'}
                  onChange={(e) => updateAttr('opacity', e.target.value)}
                />
              </label>
            </div>
            <div className="prop-section">
              <label>Transform
                <input
                  type="text"
                  value={selected.getAttribute('transform') || ''}
                  onChange={(e) => updateAttr('transform', e.target.value)}
                  placeholder="e.g., rotate(45)"
                />
              </label>
            </div>
            <button className="btn danger" onClick={() => { selected.remove(); serializeAndPush(); clearSelection() }}>
              Delete
            </button>
          </div>
        ) : (
          <div className="muted">Click an element in the SVG to edit</div>
        )}

        <div className="history-controls">
          <button className="btn" onClick={undo} disabled={historyIdx <= 0}>
            ↶ Undo
          </button>
          <button className="btn" onClick={redo} disabled={historyIdx >= history.length - 1}>
            ↷ Redo
          </button>
        </div>

        <div className="current-xml">
          <h4>SVG XML</h4>
          <textarea readOnly value={svg?.outerHTML || ''} />
        </div>
      </aside>
    </div>
  )
}
