import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { PlaneGeometry, InstancedMesh, Matrix4, Vector3 } from 'three'
import { FireFlyMaterial } from './FireFlyMaterial'

export function FireFlies({ count = 100, radius = 15 }) {
  const mesh = useRef()
  const material = useRef()

  const geometry = useMemo(() => new PlaneGeometry(0.2, 0.2), [])
  const fireFlyMaterial = useMemo(() => new FireFlyMaterial(), [])

  // Initialize positions
  useEffect(() => {
    const matrix = new Matrix4()
    const position = new Vector3()

    for(let i = 0; i < count; i++) {
      position.set(
        (Math.random() - 0.5) * radius,
        (Math.random() - 0.5) * radius,
        (Math.random() - 0.5) * radius
      )
      matrix.setPosition(position)
      mesh.current.setMatrixAt(i, matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  }, [count, radius])

  // Animation
  useFrame((state, delta) => {
    fireFlyMaterial.uniforms.uTime.value += delta
  })

  return (
    <instancedMesh
      ref={mesh}
      args={[geometry, fireFlyMaterial, count]}
      material={fireFlyMaterial}
    />
  )
}