import { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import './App.css'

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

    const grid = new PIXI.Graphics();

    grid.lineStyle(1, 0x555555)
    for (let x = 0; x <= window.innerWidth; x += 10) {
      grid.moveTo(x, 0)
      grid.lineTo(x, window.innerHeight)
    }
    for (let y = 0; y <= window.innerHeight; y += 10) {
      grid.moveTo(0, y)
      grid.lineTo(window.innerWidth, y)
    }

    grid.lineStyle(2, 0x777777)
    for (let x = 0; x <= window.innerWidth; x += 100) {
      grid.moveTo(x, 0)
      grid.lineTo(x, window.innerHeight)
    }
    for (let y = 0; y <= window.innerHeight; y += 100) {
      grid.moveTo(0, y)
      grid.lineTo(window.innerWidth, y)
    }

    app.stage.addChild(grid)
    
    return ()=>{
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