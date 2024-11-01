import { Canvas } from '@react-three/fiber'
import { Loader, OrbitControls } from '@react-three/drei'
import { useState, useEffect, Suspense } from 'react'
import Scene from './Scene'
import { 
  MAX_WORDS, 
  MATCAP_OPTIONS, 
  FONT_OPTIONS,
  MAX_CHARS_PER_WORD,
  FIREFLY_COLORS 
} from './constants'

export default function App() {
  const [text, setText] = useState('Type something...')
  const [matcapId, setMatcapId] = useState(MATCAP_OPTIONS[0].id)
  const [font, setFont] = useState(FONT_OPTIONS[0].id)
  const [canvasHeight, setCanvasHeight] = useState('100vh')
  const [showWarning, setShowWarning] = useState(false)
  const [warningMessage, setWarningMessage] = useState('')
  const [fireFlyColor, setFireFlyColor] = useState(FIREFLY_COLORS[0].value)

  useEffect(() => {
    const updateCanvasHeight = () => {
      const controls = document.getElementById('controls')
      if (controls) {
        const controlsHeight = controls.offsetHeight
        setCanvasHeight(`calc(100vh - ${controlsHeight}px)`)
      }
    }

    updateCanvasHeight()
    window.addEventListener('resize', updateCanvasHeight)
    return () => window.removeEventListener('resize', updateCanvasHeight)
  }, [])

  const handleTextChange = (e) => {
    const newText = e.target.value
    const words = newText.split(' ').filter(word => word.length > 0)
    
    // Check for long words
    const hasLongWord = words.some(word => word.length > MAX_CHARS_PER_WORD)
    
    // Process text based on conditions
    if (words.length > MAX_WORDS || hasLongWord) {
      // Trim words that are too long and limit word count
      const processedWords = words
        .map(word => word.slice(0, MAX_CHARS_PER_WORD))
        .slice(0, MAX_WORDS)
      
      const processedText = processedWords.join(' ')
      setText(processedText)
      
      // Set appropriate warning message
      if (hasLongWord) {
        setWarningMessage(`Words cannot exceed ${MAX_CHARS_PER_WORD} characters`)
      } else {
        setWarningMessage(`Maximum ${MAX_WORDS} words allowed`)
      }
      setShowWarning(true)
    } else {
      setText(newText)
      setShowWarning(false)
    }
  }

  const wordCount = text.split(' ').filter(word => word.length > 0).length

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative flex flex-col">
      <div className="w-screen h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative flex flex-col">
      {/* Existing Canvas div */}
      <div className="w-full flex-grow" style={{ height: canvasHeight }}>
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene 
              text={text} 
              matcapId={matcapId} 
              font={font}
              fireFlyColor={fireFlyColor} 
            />
            <OrbitControls 
              enableDamping 
              enablePan={false} 
              enableZoom={false} 
              dampingFactor={0.05}
            />
          </Suspense>
        </Canvas>
        <Loader/>

        {/* Color Control Panel */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 space-y-4">
          {FIREFLY_COLORS.map((color) => (
            <button
              key={color.id}
              onClick={() => setFireFlyColor(color.value)}
              className={`w-4 h-4 rounded-full transition-all duration-200 
                         border-2 flex items-center justify-center
                         hover:scale-110 active:scale-95
                         ${fireFlyColor === color.value 
                           ? 'border-white scale-110' 
                           : 'border-transparent'}`}
              style={{
                backgroundColor: color.value,
                boxShadow: `0 0 20px ${color.value}40`
              }}
              aria-label={color.label}
            >
              {fireFlyColor === color.value && (
                <div className="w-2 h-2 rounded-full bg-white"/>
              )}
            </button>
          ))}
        </div>
      </div>
      </div>

      <div id="controls" className="w-full bg-black/30 backdrop-blur-md border-t border-white/10 p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="w-full relative">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="text-input" className="text-sm font-medium text-gray-200">
                Enter Text
              </label>
              <span className={`text-xs ${wordCount === MAX_WORDS ? 'text-yellow-400' : 'text-gray-400'}`}>
                {wordCount}/{MAX_WORDS} words
              </span>
            </div>
            {showWarning && (
              <div className="absolute -top-6 left-0 right-0 text-red-400 text-sm text-center">
                {warningMessage}
              </div>
            )}
            <input
              id="text-input"
              type="text"
              value={text}
              onChange={handleTextChange}
              onClick={() => text === 'Type something...' && setText('')}
              className={`w-full px-4 py-2 bg-gray-800/50 border rounded-md text-white 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        placeholder-gray-400 appearance-none
                        ${showWarning ? 'border-red-400' : 'border-gray-700'}`}
              placeholder="Type your text here..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Material
              </label>
              <select
                value={matcapId}
                onChange={(e) => setMatcapId(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          appearance-none"
              >
                {MATCAP_OPTIONS.map((matcap) => (
                  <option key={matcap.id} value={matcap.id}>
                    {matcap.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Font
              </label>
              <select
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          appearance-none"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}