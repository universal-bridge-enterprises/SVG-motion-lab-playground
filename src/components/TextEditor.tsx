import React, { useState } from 'react'

type Props = {
  selectedElement: SVGTextElement | null
  onChange: (svg: string) => void
}

export default function TextEditor({ selectedElement, onChange }: Props) {
  const [content, setContent] = useState('')
  const [fontSize, setFontSize] = useState('16')
  const [fontFamily, setFontFamily] = useState('Arial')
  const [fontWeight, setFontWeight] = useState('400')
  const [textAnchor, setTextAnchor] = useState('start')
  const [fill, setFill] = useState('#000000')

  React.useEffect(() => {
    if (!selectedElement || selectedElement.tagName !== 'text') return
    setContent(selectedElement.textContent || '')
    setFontSize(selectedElement.getAttribute('font-size') || '16')
    setFontFamily(selectedElement.getAttribute('font-family') || 'Arial')
    setFontWeight(selectedElement.getAttribute('font-weight') || '400')
    setTextAnchor(selectedElement.getAttribute('text-anchor') || 'start')
    setFill(selectedElement.getAttribute('fill') || '#000000')
  }, [selectedElement])

  const updateText = (newContent: string) => {
    setContent(newContent)
    if (selectedElement) {
      selectedElement.textContent = newContent
      onChange(document.querySelector('svg')?.outerHTML || '')
    }
  }

  const updateStyle = (attr: string, value: string) => {
    if (!selectedElement) return
    selectedElement.setAttribute(attr, value)
    onChange(document.querySelector('svg')?.outerHTML || '')

    if (attr === 'font-size') setFontSize(value)
    if (attr === 'font-family') setFontFamily(value)
    if (attr === 'font-weight') setFontWeight(value)
    if (attr === 'text-anchor') setTextAnchor(value)
    if (attr === 'fill') setFill(value)
  }

  const addNewText = () => {
    const svg = document.querySelector('svg')
    if (!svg) return
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', '50')
    text.setAttribute('y', '50')
    text.setAttribute('font-family', 'Arial')
    text.setAttribute('font-size', '16')
    text.setAttribute('fill', '#000000')
    text.textContent = 'New Text'
    text.setAttribute('id', `text-${Date.now()}`)
    svg.appendChild(text)
    onChange(svg.outerHTML)
  }

  if (!selectedElement || selectedElement.tagName !== 'text') {
    return (
      <div className="text-editor">
        <h3>Text Editor</h3>
        <button className="btn" onClick={addNewText}>
          ➕ Add Text Element
        </button>
      </div>
    )
  }

  return (
    <div className="text-editor">
      <h3>Text Editor</h3>

      <label>
        Content
        <textarea
          value={content}
          onChange={(e) => updateText(e.target.value)}
          placeholder="Enter text..."
          rows={3}
        />
      </label>

      <label>
        Font Family
        <select value={fontFamily} onChange={(e) => updateStyle('font-family', e.target.value)}>
          <option>Arial</option>
          <option>Helvetica</option>
          <option>Times New Roman</option>
          <option>Courier New</option>
          <option>Georgia</option>
          <option>Verdana</option>
        </select>
      </label>

      <label>
        Font Size
        <input
          type="number"
          min="8"
          max="72"
          value={fontSize}
          onChange={(e) => updateStyle('font-size', e.target.value)}
        />
      </label>

      <label>
        Font Weight
        <select value={fontWeight} onChange={(e) => updateStyle('font-weight', e.target.value)}>
          <option value="400">Normal</option>
          <option value="700">Bold</option>
          <option value="300">Light</option>
          <option value="900">Heavy</option>
        </select>
      </label>

      <label>
        Text Anchor
        <select value={textAnchor} onChange={(e) => updateStyle('text-anchor', e.target.value)}>
          <option value="start">Left</option>
          <option value="middle">Center</option>
          <option value="end">Right</option>
        </select>
      </label>

      <label>
        Color
        <input
          type="color"
          value={fill}
          onChange={(e) => updateStyle('fill', e.target.value)}
        />
      </label>
    </div>
  )
}
