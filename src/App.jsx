import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import './App.css'
import { createGrid } from './components/Grid'
import { createDragCircle } from './components/DragCircle'

function App() {
  const canvasRef = useRef(null)

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