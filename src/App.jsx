import { useEffect, useRef,useState } from 'react'
import * as PIXI from 'pixi.js'
import './App.css'
import { createGrid } from './components/Grid'
import { createDragCircle } from './components/DragCircle'

function App() {
  const canvasRef = useRef(null)
  // const [currentView, setCurrentView] = useState('drag')

  useEffect(()=>{
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x333333,
      resizeTo: window,
    })

    if(canvasRef.current){
      canvasRef.current.appendChild(app.view)
    }

    function updateGrid() {
      app.stage.removeChildren()
      app.stage.addChild(createGrid(app))
      app.stage.addChild(createDragCircle(app))
    }

    updateGrid()
    window.addEventListener('resize', updateGrid)

    // setTimeout(() => {
    //   const rectangle = new PIXI.Graphics()
    //   rectangle.beginFill(0x00008B)
    //   rectangle.drawRect(0, 0, 100, 200)
    //   rectangle.endFill()
    //   rectangle.x = 50
    //   rectangle.y = 50
    //   app.stage.addChild(rectangle)
    // }, 5000)

    return ()=>{
      window.removeEventListener('resize', updateGrid)
      app.destroy(true)
    }
  },[])

  return (
    <div className="App">
      <div ref={canvasRef}></div>
    </div>
  )
}

export default App