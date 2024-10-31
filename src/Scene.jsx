import { 
  Text3D, 
  Center, 
  Float, 
  Environment, 
  useMatcapTexture, 
  Sparkles,
  useHelper,
  SpotLight,
  Sky
} from '@react-three/drei'
import { useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { WORDS_PER_LINE } from './constants'
import * as THREE from 'three'

const FONTS = {
  helvetiker: "/fonts/helvetiker_regular.typeface.json",
  optimer: "/fonts/optimer_regular.typeface.json",
  gentilis: "/fonts/gentilis_regular.typeface.json"
}

export default function Scene({ text, matcapId, font }) {
  const { viewport } = useThree()
  const [matcapTexture] = useMatcapTexture(matcapId, 256)
  const spotLight = useRef()
  
  const calculateTextSize = () => {
    const baseSize = 0.75
    const viewportScale = viewport.width < 10 ? viewport.width / 10 : 1
    return baseSize * viewportScale
  }

  const splitIntoLines = (text) => {
    const words = text.split(' ').filter(word => word.length > 0)
    const lines = []
    for (let i = 0; i < words.length; i += WORDS_PER_LINE) {
      lines.push(words.slice(i, i + WORDS_PER_LINE).join(' '))
    }
    return lines
  }

  const textLines = splitIntoLines(text)
  const textSize = calculateTextSize()

  return (
    <>
      {/* Ambient Scene Lighting */}
      <color attach="background" args={['#0a0a0f']} />
      <fog attach="fog" args={['#0a0a0f', 5, 30]} />
      <ambientLight intensity={0.2} />

      {/* Dramatic Spotlights */}
      <SpotLight
        ref={spotLight}
        position={[3, 2, 2]}
        angle={0.5}
        penumbra={0.8}
        intensity={0.8}
        color="#ffffff"
        distance={10}
        castShadow
      />

      <SpotLight
        position={[-3, -2, 2]}
        angle={0.5}
        penumbra={0.8}
        intensity={0.4}
        color="#4040ff"
        distance={10}
        castShadow
      />

      {/* Layered Sparkles for Depth */}
      <group>
        {/* Background layer */}
        <Sparkles 
          count={20}
          scale={[150, 8, 1]}
          size={200}
          speed={0.2}
          opacity={0.1}
          color="#ffffff"
          position={[0, 0, -2]}
        />
        
        {/* Midground layer */}
        <Sparkles 
          count={30}
          scale={[12, 6, 1]}
          size={200}
          speed={0.3}
          opacity={0.15}
          color="#8080ff"
          position={[0, 0, -1]}
        />
        
        {/* Foreground layer */}
        <Sparkles 
          count={15}
          scale={[10, 5, 1]}
          size={1}
          speed={0.4}
          opacity={0.2}
          color="#ffffff"
          position={[0, 0, 0]}
        />
      </group>

      {/* Main Text */}
      <Float rotationIntensity={2} floatIntensity={2}>
        <Center>
          <group position={[0, (textLines.length - 1) * 0.5, 0]}>
            {textLines.map((line, index) => (
              <Text3D
                key={index}
                font={FONTS[font]}
                size={textSize}
                height={0.2}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.02}
                bevelOffset={0}
                bevelSegments={5}
                position={[0, -index * 1.2, 0]}
              >
                {line}
                <meshMatcapMaterial matcap={matcapTexture} />
              </Text3D>
            ))}
          </group>
        </Center>
      </Float>

      {/* Rich Environment */}
      <Environment preset='warehouse' background={false} />
    </>
  )
}