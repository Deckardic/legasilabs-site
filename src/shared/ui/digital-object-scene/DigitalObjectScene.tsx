import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { CSSProperties } from 'react'
import type { Group } from 'three'
import { useReducedMotion } from '../../lib/useReducedMotion'

type DigitalObjectSceneProps = {
  variant: 'hero' | 'contact'
}

const cipherGlyphs = [
  ['#', 50, 7, -18],
  ['0', 39, 11, 14],
  ['1', 61, 11, -6],
  ['/', 31, 21, 20],
  ['#', 69, 21, -22],
  ['{', 36, 33, -14],
  ['}', 64, 33, 18],
  ['0', 50, 38, 24],
  ['=', 50, 20, -6],
  ['1', 43, 23, 18],
  ['0', 57, 23, -18],
  ['#', 50, 47, -10],
  ['=', 50, 55, 18],
  ['1', 50, 63, -18],
  ['=', 50, 71, 12],
  ['#', 50, 79, -8],
  ['=', 60, 79, 20],
  ['+', 70, 79, -16],
  ['#', 80, 79, 16],
  ['/', 80, 88, -18],
  ['=', 68, 88, 10],
  ['#', 58, 88, -12],
] as const

function SymbolCipherKey() {
  return (
    <div className="digital-symbol-key" data-testid="symbol-cipher-key" data-key-style="ascii-orbit" aria-hidden="true">
      <div className="digital-symbol-key__orbit">
        {cipherGlyphs.map(([symbol, x, y, z], index) => (
          <span
            className="digital-symbol-key__glyph"
            key={`${symbol}-${index}`}
            style={
              {
                '--glyph-x': `${x}%`,
                '--glyph-y': `${y}%`,
                '--glyph-z': `${z}px`,
              } as CSSProperties
            }
          >
            {symbol}
          </span>
        ))}
      </div>
    </div>
  )
}

function DigitalModule() {
  const mesh = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (!mesh.current) return
    mesh.current.rotation.x = -0.25 + Math.sin(clock.elapsedTime * 0.35) * 0.08
    mesh.current.rotation.y = clock.elapsedTime * -0.28
  })

  return (
    <group ref={mesh} position={[0, 0, 0]} rotation={[-0.25, 0.6, 0.2]}>
      <mesh>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial color="#101010" emissive="#0f1f05" roughness={0.18} metalness={0.75} wireframe />
      </mesh>
      <mesh scale={0.72}>
        <icosahedronGeometry args={[0.95, 0]} />
        <meshStandardMaterial color="#3a6cff" transparent opacity={0.22} roughness={0.18} metalness={0.5} />
      </mesh>
    </group>
  )
}

export function DigitalObjectScene({ variant }: DigitalObjectSceneProps) {
  const reducedMotion = useReducedMotion()
  const renderFallback = reducedMotion || import.meta.env.MODE === 'test'

  if (renderFallback) {
    if (variant === 'hero') {
      return (
        <div className="digital-fallback digital-fallback--hero" aria-hidden="true">
          <div className="digital-fallback__side digital-fallback__side--right" data-testid="hero-digital-right">
            <SymbolCipherKey />
          </div>
        </div>
      )
    }

    return (
      <div className={`digital-fallback digital-fallback--${variant}`} aria-hidden="true">
        <span />
        <i />
      </div>
    )
  }

  return (
    <div className={`digital-scene digital-scene--${variant}`} aria-hidden="true">
      {variant === 'hero' ? (
        <div className="digital-scene__side digital-scene__side--right" data-testid="hero-digital-right">
          <SymbolCipherKey />
        </div>
      ) : (
        <Canvas camera={{ position: [0, 0, 5.2], fov: 42 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 4, 5]} intensity={2.2} />
          <pointLight position={[-4, -2, 2]} color="#b7ff2a" intensity={3.5} />
          <DigitalModule />
        </Canvas>
      )}
    </div>
  )
}
