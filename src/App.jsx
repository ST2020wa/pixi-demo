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

    let rectangle = null
    let dragCircle = null
    // Function to get rectangle
    function getRectangle() {
      return rectangle
    }
    
    // Function to modify rectangle
    function modifyRectangle(modifier) {
      if (rectangle) {
        modifier(rectangle)
      }
    }

    function updateGrid() {
      if(app.stage){
        app.stage.removeChildren()
        app.stage.addChild(createGrid(app))
        dragCircle = createDragCircle(app, getRectangle, modifyRectangle) // Pass both functions
        app.stage.addChild(dragCircle)

        if (rectangle) {
          app.stage.addChild(rectangle)
        }
      }
    }

    updateGrid()
    window.addEventListener('resize', updateGrid)

    setTimeout(() => {
      rectangle = new PIXI.Graphics()
      rectangle.beginFill(0x00008B)
      rectangle.drawRect(0, 0, 100, 200)
      rectangle.endFill()
      rectangle.x = 50
      rectangle.y = 50
      app?.stage?.addChild(rectangle)
    }, 5000)

    return ()=>{
      window.removeEventListener('resize', updateGrid)
      if (app && !app.destroyed) {
        app.destroy(true)
      }
    }
  },[])

  return (
    <div className="App">
      <div ref={canvasRef}></div>
    </div>
  )
}

export default App