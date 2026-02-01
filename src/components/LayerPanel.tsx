import React, { useState } from 'react'

type Props = {
  svgElement: SVGSVGElement | null
  onSelectElement: (el: SVGElement) => void
  onDeleteElement: (el: SVGElement) => void
}

interface Layer {
  element: SVGElement
  visible: boolean
  locked: boolean
  children: Layer[]
}

export default function LayerPanel({ svgElement, onSelectElement, onDeleteElement }: Props) {
  const [expandedLayers, setExpandedLayers] = useState<Set<SVGElement>>(new Set())

  if (!svgElement) return <div className="layer-panel">Import SVG to see layers</div>

  const buildLayerTree = (el: SVGElement): Layer[] => {
    const layers: Layer[] = []
    for (let i = 0; i < el.children.length; i++) {
      const child = el.children[i] as SVGElement
      layers.push({
        element: child,
        visible: child.style.display !== 'none',
        locked: child.hasAttribute('data-locked'),
        children: buildLayerTree(child)
      })
    }
    return layers
  }

  const toggleLayerVisibility = (el: SVGElement) => {
    const current = el.style.display
    el.style.display = current === 'none' ? '' : 'none'
  }

  const toggleLayerLock = (el: SVGElement) => {
    if (el.hasAttribute('data-locked')) {
      el.removeAttribute('data-locked')
    } else {
      el.setAttribute('data-locked', 'true')
    }
  }

  const toggleExpanded = (el: SVGElement) => {
    const newSet = new Set(expandedLayers)
    if (newSet.has(el)) {
      newSet.delete(el)
    } else {
      newSet.add(el)
    }
    setExpandedLayers(newSet)
  }

  const renderLayerItem = (layer: Layer, depth: number) => {
    const isExpanded = expandedLayers.has(layer.element)
    const hasChildren = layer.children.length > 0

    return (
      <div key={layer.element.toString()} className="layer-item" style={{ paddingLeft: `${depth * 12}px` }}>
        <div className="layer-row">
          {hasChildren && (
            <button
              className="expand-btn"
              onClick={() => toggleExpanded(layer.element)}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          {!hasChildren && <span className="expand-placeholder"></span>}

          <span
            className="layer-name"
            onClick={() => onSelectElement(layer.element)}
            title={layer.element.tagName}
          >
            {layer.element.tagName.toLowerCase()}
            {layer.element.id && ` #${layer.element.id}`}
          </span>

          <button
            className="layer-btn"
            onClick={() => toggleLayerVisibility(layer.element)}
            title={layer.visible ? 'Hide' : 'Show'}
          >
            {layer.visible ? '👁' : '🚫'}
          </button>

          <button
            className="layer-btn"
            onClick={() => toggleLayerLock(layer.element)}
            title={layer.locked ? 'Unlock' : 'Lock'}
          >
            {layer.locked ? '🔒' : '🔓'}
          </button>

          <button
            className="layer-btn danger"
            onClick={() => onDeleteElement(layer.element)}
            title="Delete"
          >
            ✕
          </button>
        </div>

        {isExpanded && hasChildren && (
          <div className="layer-children">
            {layer.children.map((child) => renderLayerItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  const layers = buildLayerTree(svgElement)

  return (
    <div className="layer-panel">
      <h3>Layers</h3>
      <div className="layers-list">
        {layers.map((layer) => renderLayerItem(layer, 0))}
      </div>
    </div>
  )
}
