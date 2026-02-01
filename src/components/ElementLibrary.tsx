import React from 'react'

type Props = {
  onChange: (svg: string) => void
}

export default function ElementLibrary({ onChange }: Props) {
  const insertElement = (element: string) => {
    const svg = document.querySelector('svg') as SVGSVGElement
    if (!svg) return

    const newEl = document.createElementNS('http://www.w3.org/2000/svg', element.split(' ')[0])
    const attrs = element.split(' ').slice(1)

    attrs.forEach((attr) => {
      const [key, value] = attr.split('=')
      newEl.setAttribute(key, value.replace(/"/g, ''))
    })

    newEl.setAttribute('id', `${element.split(' ')[0]}-${Date.now()}`)
    svg.appendChild(newEl)
    onChange(svg.outerHTML)
  }

  const presets = [
    { label: '▭ Rectangle', element: 'rect x="50" y="50" width="100" height="60" fill="#06b6d4"' },
    { label: '○ Circle', element: 'circle cx="100" cy="100" r="40" fill="#06b6d4"' },
    { label: '⬟ Ellipse', element: 'ellipse cx="100" cy="100" rx="60" ry="40" fill="#06b6d4"' },
    { label: '◾ Polygon', element: 'polygon points="100,10 40,198 190,78 10,78 160,198" fill="#06b6d4"' },
    { label: '✶ Star', element: 'polygon points="50,10 61,35 87,35 66,57 77,82 50,60 23,82 34,57 13,35 39,35" fill="#06b6d4"' },
    { label: '— Line', element: 'line x1="10" y1="10" x2="100" y2="100" stroke="#000" stroke-width="2"' },
    { label: '─ Horizontal Line', element: 'line x1="0" y1="50" x2="200" y2="50" stroke="#000" stroke-width="2"' },
    { label: 'A Text', element: 'text x="50" y="50" font-family="Arial" font-size="16" fill="#000">Sample Text</text>' },
    { label: '◻ Square', element: 'rect x="50" y="50" width="80" height="80" fill="#06b6d4"' },
    { label: '▼ Triangle', element: 'polygon points="100,20 180,180 20,180" fill="#06b6d4"' },
    { label: '╱ Diagonal', element: 'line x1="10" y1="10" x2="200" y2="200" stroke="#000" stroke-width="2"' },
    { label: '◉ Dot', element: 'circle cx="100" cy="100" r="5" fill="#000"' }
  ]

  return (
    <div className="element-library">
      <h3>Element Library</h3>
      <div className="library-grid">
        {presets.map((preset, i) => (
          <button
            key={i}
            className="library-btn"
            onClick={() => insertElement(preset.element)}
            title={preset.element}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}
