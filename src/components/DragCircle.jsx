import * as PIXI from 'pixi.js'

export function createDragCircle(app) {
  const circle = new PIXI.Graphics()
  circle.beginFill(0xffffff)
  circle.drawCircle(0, 0, 20)
  circle.endFill()
  circle.x = app.screen.width / 2
  circle.y = app.screen.height / 2

  circle.eventMode = 'dynamic'
  circle.cursor = 'pointer'
  
  let dragging = false
  let dragOffset = null
  
  circle.on('pointerdown', (event)=>{
    dragOffset = {
      x: event.global.x - circle.x,
      y: event.global.y - circle.y
    }
    dragging = true
  })
  
  circle.on('pointerup', () => {
    dragging = false
    dragOffset = null
  })
  
  circle.on('pointerupoutside', () => {
    dragging = false
    dragOffset = null
  })
  
  app.stage.eventMode = 'dynamic'
  app.stage.on('pointermove', (event) => {
    if (dragging) {
      circle.x = event.global.x - dragOffset.x
      circle.y = event.global.y - dragOffset.y
    }
  })

  return circle
}