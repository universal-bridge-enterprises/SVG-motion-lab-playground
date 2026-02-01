import React, { useState } from 'react'

type Props = {
  selectedElement: SVGPathElement | null
  onChange: (svg: string) => void
}

interface PathNode {
  command: string
  x: number
  y: number
  index: number
}

export default function PathEditor({ selectedElement, onChange }: Props) {
  const [nodes, setNodes] = useState<PathNode[]>([])

  React.useEffect(() => {
    if (!selectedElement || selectedElement.tagName !== 'path') return
    const pathData = selectedElement.getAttribute('d') || ''
    parsePathData(pathData)
  }, [selectedElement])

  const parsePathData = (pathData: string) => {
    const commands = pathData.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g) || []
    const parsedNodes: PathNode[] = []
    let index = 0

    commands.forEach((cmd) => {
      const command = cmd[0]
      const params = cmd.slice(1).trim().split(/[\s,]+/).map(Number)

      if (command === 'M' || command === 'm') {
        parsedNodes.push({ command: 'M', x: params[0], y: params[1], index: index++ })
      } else if (command === 'L' || command === 'l') {
        parsedNodes.push({ command: 'L', x: params[0], y: params[1], index: index++ })
      } else if (command === 'Z' || command === 'z') {
        parsedNodes.push({ command: 'Z', x: 0, y: 0, index: index++ })
      }
    })

    setNodes(parsedNodes)
  }

  const updateNodePosition = (index: number, x: number, y: number) => {
    const updated = [...nodes]
    updated[index] = { ...updated[index], x, y }
    setNodes(updated)
    rebuildPath()
  }

  const rebuildPath = () => {
    if (!selectedElement) return
    const pathData = nodes.map((n) => {
      if (n.command === 'Z') return 'Z'
      return `${n.command}${n.x},${n.y}`
    }).join(' ')
    selectedElement.setAttribute('d', pathData)
    onChange(document.querySelector('svg')?.outerHTML || '')
  }

  const addNode = (afterIndex: number) => {
    const newNodes = [...nodes]
    const afterNode = newNodes[afterIndex]
    const nextNode = newNodes[afterIndex + 1]
    const midX = (afterNode.x + (nextNode?.x || 0)) / 2
    const midY = (afterNode.y + (nextNode?.y || 0)) / 2
    newNodes.splice(afterIndex + 1, 0, { command: 'L', x: midX, y: midY, index: Date.now() })
    setNodes(newNodes)
    rebuildPath()
  }

  const removeNode = (index: number) => {
    const updated = nodes.filter((_, i) => i !== index)
    setNodes(updated)
    rebuildPath()
  }

  if (!selectedElement || selectedElement.tagName !== 'path') {
    return <div className="path-editor">Select a path element to edit</div>
  }

  return (
    <div className="path-editor">
      <h3>Path Editor</h3>
      <div className="path-nodes">
        {nodes.map((node, i) => (
          <div key={i} className="path-node">
            <div className="node-info">
              <strong>{node.command}</strong> ({node.x.toFixed(1)}, {node.y.toFixed(1)})
            </div>
            <div className="node-controls">
              <input
                type="number"
                value={node.x}
                onChange={(e) => updateNodePosition(i, parseFloat(e.target.value), node.y)}
                placeholder="X"
              />
              <input
                type="number"
                value={node.y}
                onChange={(e) => updateNodePosition(i, node.x, parseFloat(e.target.value))}
                placeholder="Y"
              />
              {i < nodes.length - 1 && (
                <button className="btn" onClick={() => addNode(i)} title="Add node after this">
                  +
                </button>
              )}
              {nodes.length > 2 && (
                <button className="btn danger" onClick={() => removeNode(i)} title="Remove node">
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
