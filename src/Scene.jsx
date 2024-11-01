import { 
  Text3D, 
  Center, 
  Float, 
  Environment, 
  useMatcapTexture,
} from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { WORDS_PER_LINE } from './constants'
import { FireFlies } from './FireFlies'

const FONTS = {
  helvetiker: "/fonts/helvetiker_regular.typeface.json",
  optimer: "/fonts/optimer_regular.typeface.json",
  gentilis: "/fonts/gentilis_regular.typeface.json"
}

export default function Scene({ text, matcapId, font }) {
  const { viewport } = useThree()
  const [matcapTexture] = useMatcapTexture(matcapId, 256)
  
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
      {/* Background color */}
      <color attach="background" args={['#0a0a0f']} />
      
      {/* Ambient light */}
      <ambientLight intensity={0.2} />

      {/* FireFlies */}
      <FireFlies count={100} radius={20} />

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

      <Environment preset='warehouse' background={false} />
    </>
  )
}