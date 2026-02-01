import React, { useState } from 'react'

type Props = {
  selectedElement: SVGElement | null
  onChange: (svg: string) => void
}

export default function TransformationsTool({ selectedElement, onChange }: Props) {
  const [rotate, setRotate] = useState(0)
  const [scaleX, setScaleX] = useState(1)
  const [scaleY, setScaleY] = useState(1)
  const [skewX, setSkewX] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)

  React.useEffect(() => {
    if (!selectedElement) return
    const transform = selectedElement.getAttribute('transform') || ''
    parseTransform(transform)
  }, [selectedElement])

  const parseTransform = (transform: string) => {
    // Simple parser for common transforms
    const rotateMatch = transform.match(/rotate\(([^)]+)\)/)
    const scaleMatch = transform.match(/scale\(([^)]+)\)/)
    const skewMatch = transform.match(/skewX\(([^)]+)\)/)
    const translateMatch = transform.match(/translate\(([^)]+)\)/)

    if (rotateMatch) setRotate(parseFloat(rotateMatch[1]))
    if (scaleMatch) {
      const scales = scaleMatch[1].split(/[\s,]+/).map(Number)
      setScaleX(scales[0])
      setScaleY(scales[1] || scales[0])
    }
    if (skewMatch) setSkewX(parseFloat(skewMatch[1]))
    if (translateMatch) {
      const trans = translateMatch[1].split(/[\s,]+/).map(Number)
      setTranslateX(trans[0])
      setTranslateY(trans[1] || 0)
    }
  }

  const applyTransform = (r: number, sx: number, sy: number, skx: number, tx: number, ty: number) => {
    if (!selectedElement) return
    const transforms = []
    if (tx !== 0 || ty !== 0) transforms.push(`translate(${tx},${ty})`)
    if (sx !== 1 || sy !== 1) transforms.push(`scale(${sx},${sy})`)
    if (skx !== 0) transforms.push(`skewX(${skx})`)
    if (r !== 0) transforms.push(`rotate(${r})`)
    selectedElement.setAttribute('transform', transforms.join(' '))
    onChange(document.querySelector('svg')?.outerHTML || '')
  }

  const handleRotate = (value: number) => {
    setRotate(value)
    applyTransform(value, scaleX, scaleY, skewX, translateX, translateY)
  }

  const handleScaleX = (value: number) => {
    setScaleX(value)
    applyTransform(rotate, value, scaleY, skewX, translateX, translateY)
  }

  const handleScaleY = (value: number) => {
    setScaleY(value)
    applyTransform(rotate, scaleX, value, skewX, translateX, translateY)
  }

  const handleSkewX = (value: number) => {
    setSkewX(value)
    applyTransform(rotate, scaleX, scaleY, value, translateX, translateY)
  }

  const handleTranslateX = (value: number) => {
    setTranslateX(value)
    applyTransform(rotate, scaleX, scaleY, skewX, value, translateY)
  }

  const handleTranslateY = (value: number) => {
    setTranslateY(value)
    applyTransform(rotate, scaleX, scaleY, skewX, translateX, value)
  }

  const reset = () => {
    setRotate(0)
    setScaleX(1)
    setScaleY(1)
    setSkewX(0)
    setTranslateX(0)
    setTranslateY(0)
    if (selectedElement) {
      selectedElement.removeAttribute('transform')
      onChange(document.querySelector('svg')?.outerHTML || '')
    }
  }

  if (!selectedElement) return <div className="transformations-tool">Select an element to transform</div>

  return (
    <div className="transformations-tool">
      <h3>Transformations</h3>

      <div className="transform-controls">
        <label>
          Rotate (°)
          <div className="control-row">
            <input
              type="range"
              min="-360"
              max="360"
              value={rotate}
              onChange={(e) => handleRotate(parseFloat(e.target.value))}
            />
            <span className="value">{rotate}°</span>
          </div>
        </label>

        <label>
          Scale X
          <div className="control-row">
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={scaleX}
              onChange={(e) => handleScaleX(parseFloat(e.target.value))}
            />
            <span className="value">{scaleX.toFixed(1)}x</span>
          </div>
        </label>

        <label>
          Scale Y
          <div className="control-row">
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={scaleY}
              onChange={(e) => handleScaleY(parseFloat(e.target.value))}
            />
            <span className="value">{scaleY.toFixed(1)}x</span>
          </div>
        </label>

        <label>
          Skew X (°)
          <div className="control-row">
            <input
              type="range"
              min="-90"
              max="90"
              value={skewX}
              onChange={(e) => handleSkewX(parseFloat(e.target.value))}
            />
            <span className="value">{skewX}°</span>
          </div>
        </label>

        <label>
          Translate X
          <div className="control-row">
            <input
              type="number"
              value={translateX}
              onChange={(e) => handleTranslateX(parseFloat(e.target.value))}
              placeholder="0"
            />
          </div>
        </label>

        <label>
          Translate Y
          <div className="control-row">
            <input
              type="number"
              value={translateY}
              onChange={(e) => handleTranslateY(parseFloat(e.target.value))}
              placeholder="0"
            />
          </div>
        </label>

        <button className="btn" onClick={reset}>
          Reset Transforms
        </button>
      </div>
    </div>
  )
}
