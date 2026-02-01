import React, { useState } from 'react'

type Props = {
  svgElement: SVGSVGElement | null
  onChange: () => void
}

export default function ShapeTools({ svgElement, onChange }: Props) {
  const [tool, setTool] = useState<'rect' | 'circle' | 'line' | 'text' | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })

  if (!svgElement) return <div className="shape-tools">Import SVG first</div>

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!tool) return
    setIsDrawing(true)
    const rect = svgElement.getBoundingClientRect()
    setStartPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing || !tool) return
    const rect = svgElement.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top

    // Live preview of shape being drawn
    let shape = svgElement.querySelector('.temp-shape') as SVGElement | null
    if (!shape) {
      shape = document.createElementNS('http://www.w3.org/2000/svg', tool === 'line' ? 'line' : tool)
      shape.classList.add('temp-shape')
      shape.setAttribute('stroke', '#06b6d4')
      shape.setAttribute('fill', 'none')
      shape.setAttribute('stroke-width', '2')
      svgElement.appendChild(shape)
    }

    if (tool === 'rect') {
      const width = Math.abs(currentX - startPos.x)
      const height = Math.abs(currentY - startPos.y)
      shape.setAttribute('x', String(Math.min(startPos.x, currentX)))
      shape.setAttribute('y', String(Math.min(startPos.y, currentY)))
      shape.setAttribute('width', String(width))
      shape.setAttribute('height', String(height))
    } else if (tool === 'circle') {
      const dx = currentX - startPos.x
      const dy = currentY - startPos.y
      const r = Math.sqrt(dx * dx + dy * dy)
      shape.setAttribute('cx', String(startPos.x))
      shape.setAttribute('cy', String(startPos.y))
      shape.setAttribute('r', String(r))
    } else if (tool === 'line') {
      shape.setAttribute('x1', String(startPos.x))
      shape.setAttribute('y1', String(startPos.y))
      shape.setAttribute('x2', String(currentX))
      shape.setAttribute('y2', String(currentY))
    }
  }

  const handleMouseUp = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    const tempShape = svgElement.querySelector('.temp-shape')
    if (tempShape) {
      tempShape.classList.remove('temp-shape')
      tempShape.setAttribute('id', `shape-${Date.now()}`)
      onChange()
    }
    setTool(null)
  }

  return (
    <div className="shape-tools">
      <h4>Shape Tools</h4>
      <div className="shape-buttons">
        <button
          className={`btn ${tool === 'rect' ? 'active' : ''}`}
          onClick={() => setTool(tool === 'rect' ? null : 'rect')}
          title="Draw Rectangle"
        >
          ▭
        </button>
        <button
          className={`btn ${tool === 'circle' ? 'active' : ''}`}
          onClick={() => setTool(tool === 'circle' ? null : 'circle')}
          title="Draw Circle"
        >
          ○
        </button>
        <button
          className={`btn ${tool === 'line' ? 'active' : ''}`}
          onClick={() => setTool(tool === 'line' ? null : 'line')}
          title="Draw Line"
        >
          ╱
        </button>
      </div>
      <div className="hint">
        {tool ? `Click and drag to draw a ${tool}` : 'Select a shape tool to draw'}
      </div>

      {/* Invisible overlay for drawing */}
      {tool && (
        <svg
          className="drawing-overlay"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      )}
    </div>
  )
}
