import React, { useState } from 'react'

type Props = {
  svgElement: SVGSVGElement | null
  onChange: () => void
}

export default function RulersGrid({ svgElement, onChange }: Props) {
  const [showGrid, setShowGrid] = useState(false)
  const [gridSize, setGridSize] = useState(20)
  const [snapToGrid, setSnapToGrid] = useState(false)
  const [showRulers, setShowRulers] = useState(true)

  const toggleGrid = () => {
    const newShowGrid = !showGrid
    setShowGrid(newShowGrid)
    applyGrid(newShowGrid, gridSize)
  }

  const updateGridSize = (size: number) => {
    setGridSize(size)
    if (showGrid) applyGrid(true, size)
  }

  const applyGrid = (show: boolean, size: number) => {
    if (!svgElement) return

    let defs = svgElement.querySelector('defs')
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
      svgElement.insertBefore(defs, svgElement.firstChild)
    }

    let pattern = defs.querySelector('#grid-pattern') as SVGPatternElement | null
    if (show) {
      if (!pattern) {
        pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern')
        pattern.setAttribute('id', 'grid-pattern')
        pattern.setAttribute('patternUnits', 'userSpaceOnUse')
        defs.appendChild(pattern)
      }

      pattern.setAttribute('width', String(size))
      pattern.setAttribute('height', String(size))

      // Clear old content
      pattern.innerHTML = ''

      // Add grid lines
      const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line1.setAttribute('x1', '0')
      line1.setAttribute('y1', '0')
      line1.setAttribute('x2', String(size))
      line1.setAttribute('y2', '0')
      line1.setAttribute('stroke', 'rgba(255,255,255,0.1)')
      line1.setAttribute('stroke-width', '0.5')
      pattern.appendChild(line1)

      const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line2.setAttribute('x1', '0')
      line2.setAttribute('y1', '0')
      line2.setAttribute('x2', '0')
      line2.setAttribute('y2', String(size))
      line2.setAttribute('stroke', 'rgba(255,255,255,0.1)')
      line2.setAttribute('stroke-width', '0.5')
      pattern.appendChild(line2)

      let rect = svgElement.querySelector('#grid-rect') as SVGRectElement | null
      if (!rect) {
        rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        rect.setAttribute('id', 'grid-rect')
        rect.setAttribute('width', '100%')
        rect.setAttribute('height', '100%')
        rect.setAttribute('fill', 'url(#grid-pattern)')
        svgElement.insertBefore(rect, svgElement.firstChild)
      }
    } else {
      const rect = svgElement.querySelector('#grid-rect')
      if (rect) rect.remove()
      if (pattern) pattern.remove()
    }

    onChange()
  }

  if (!svgElement) return <div className="rulers-grid">Import SVG to use grid</div>

  return (
    <div className="rulers-grid">
      <h3>Rulers & Grid</h3>

      <div className="grid-controls">
        <label className="checkbox">
          <input type="checkbox" checked={showRulers} onChange={(e) => setShowRulers(e.target.checked)} />
          Show Rulers
        </label>

        <label className="checkbox">
          <input type="checkbox" checked={showGrid} onChange={() => toggleGrid()} />
          Show Grid
        </label>

        {showGrid && (
          <label>
            Grid Size
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={gridSize}
              onChange={(e) => updateGridSize(parseInt(e.target.value))}
            />
            <span className="value">{gridSize}px</span>
          </label>
        )}

        <label className="checkbox">
          <input type="checkbox" checked={snapToGrid} onChange={(e) => setSnapToGrid(e.target.checked)} />
          Snap to Grid
        </label>
      </div>

      <div className="grid-info">
        <p>
          <strong>Grid Helper:</strong> Enables visual alignment grid to assist with precise element positioning.
        </p>
        <p>
          <strong>Snap to Grid:</strong> When enabled, elements will align to grid intersection points when moved.
        </p>
      </div>

      {showRulers && (
        <div className="rulers-display">
          <div className="ruler-horizontal">
            {Array.from({ length: 20 }, (_, i) => (
              <span key={i} style={{ width: '50px' }}>
                {i * 50}
              </span>
            ))}
          </div>
          <div className="ruler-vertical">
            {Array.from({ length: 15 }, (_, i) => (
              <span key={i} style={{ height: '50px' }}>
                {i * 50}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
