import React, { useState } from 'react'

type Props = {
  selectedElement: SVGElement | null
  onChange: (svg: string) => void
}

interface Animation {
  id: string
  attributeName: string
  from: string
  to: string
  duration: number
  repeatCount: string
}

export default function AnimationPanel({ selectedElement, onChange }: Props) {
  const [animations, setAnimations] = useState<Animation[]>([])
  const [newAnim, setNewAnim] = useState<Partial<Animation>>({
    duration: 1,
    repeatCount: '1'
  })

  if (!selectedElement) return <div className="animation-panel">Select an element to animate</div>

  const addAnimation = () => {
    if (!newAnim.attributeName || !newAnim.from || !newAnim.to) return

    const id = `anim-${Date.now()}`
    const animation: Animation = {
      id,
      attributeName: newAnim.attributeName,
      from: newAnim.from,
      to: newAnim.to,
      duration: newAnim.duration || 1,
      repeatCount: newAnim.repeatCount || '1'
    }

    const animEl = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
    animEl.setAttribute('attributeName', animation.attributeName)
    animEl.setAttribute('from', animation.from)
    animEl.setAttribute('to', animation.to)
    animEl.setAttribute('dur', `${animation.duration}s`)
    animEl.setAttribute('repeatCount', animation.repeatCount)
    animEl.setAttribute('data-anim-id', id)

    selectedElement.appendChild(animEl)
    setAnimations([...animations, animation])
    setNewAnim({ duration: 1, repeatCount: '1' })
    onChange(document.querySelector('svg')?.outerHTML || '')
  }

  const removeAnimation = (id: string) => {
    const animEl = selectedElement.querySelector(`[data-anim-id="${id}"]`)
    if (animEl) animEl.remove()
    setAnimations(animations.filter((a) => a.id !== id))
    onChange(document.querySelector('svg')?.outerHTML || '')
  }

  return (
    <div className="animation-panel">
      <h3>Animations</h3>

      <div className="anim-form">
        <label>
          Attribute
          <select
            value={newAnim.attributeName || ''}
            onChange={(e) => setNewAnim({ ...newAnim, attributeName: e.target.value })}
          >
            <option value="">Select attribute</option>
            <option value="opacity">Opacity</option>
            <option value="fill">Fill</option>
            <option value="x">X Position</option>
            <option value="y">Y Position</option>
            <option value="r">Radius</option>
            <option value="width">Width</option>
            <option value="height">Height</option>
            <option value="transform">Transform</option>
          </select>
        </label>

        <label>
          From
          <input
            type="text"
            placeholder="e.g., 0 or #ff0000"
            value={newAnim.from || ''}
            onChange={(e) => setNewAnim({ ...newAnim, from: e.target.value })}
          />
        </label>

        <label>
          To
          <input
            type="text"
            placeholder="e.g., 100 or #00ff00"
            value={newAnim.to || ''}
            onChange={(e) => setNewAnim({ ...newAnim, to: e.target.value })}
          />
        </label>

        <label>
          Duration (s)
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={newAnim.duration || 1}
            onChange={(e) => setNewAnim({ ...newAnim, duration: parseFloat(e.target.value) })}
          />
        </label>

        <label>
          Repeat
          <select
            value={newAnim.repeatCount || '1'}
            onChange={(e) => setNewAnim({ ...newAnim, repeatCount: e.target.value })}
          >
            <option value="1">Once</option>
            <option value="2">Twice</option>
            <option value="3">Thrice</option>
            <option value="indefinite">Infinite</option>
          </select>
        </label>

        <button className="btn" onClick={addAnimation}>
          Add Animation
        </button>
      </div>

      {animations.length > 0 && (
        <div className="anim-list">
          <h4>Active Animations</h4>
          {animations.map((anim) => (
            <div key={anim.id} className="anim-item">
              <div>
                <strong>{anim.attributeName}:</strong> {anim.from} → {anim.to} ({anim.duration}s)
              </div>
              <button className="btn danger" onClick={() => removeAnimation(anim.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
