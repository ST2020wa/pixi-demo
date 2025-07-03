import * as PIXI from 'pixi.js'

export function createDragCircle(app, getRectangle, modifyRectangle) {
  const circle = new PIXI.Graphics()
  circle.beginFill(0x00ffff)
  circle.drawCircle(0, 0, 25)
  circle.endFill()
  circle.x = app.screen.width / 2
  circle.y = app.screen.height / 2

  const dragText = new PIXI.Text('Drag', {
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 'bold',
    fill: 0x00008B,
    align: 'center',
  })
  dragText.anchor.set(0.5)
  dragText.x = 0
  dragText.y = 0
  circle.addChild(dragText)

  const dragEndText = new PIXI.Text('Drag End. WELL DONE!', {
    fontFamily: 'Arial',
    fontSize: 24,
    fontWeight: 'bold',
    fill: 0xffffff,
    align: 'left',
    wordWrap: true,
    wordWrapWidth: 50,
  })

  circle.eventMode = 'dynamic'
  circle.cursor = 'pointer'

  const trailContainer = new PIXI.Container()
  const trailPoints = []
  const particles = []
  const MAX_PARTICLES = 1000 // 最大粒子数限制
  
  let dragging = false
  let dragOffset = null

  // Function to check if circle is inside rectangle
  function isCircleInRectangle(circle, rectangle) {
    if (!rectangle) return false
    
    const circleBounds = {
      left: circle.x - 25, // circle radius
      right: circle.x + 25,
      top: circle.y - 25,
      bottom: circle.y + 25
    }
    
    const rectBounds = {
      left: rectangle.x,
      right: rectangle.x + 100, // rectangle width
      top: rectangle.y,
      bottom: rectangle.y + 200 // rectangle height
    }
    
    return circleBounds.left < rectBounds.right &&
           circleBounds.right > rectBounds.left &&
           circleBounds.top < rectBounds.bottom &&
           circleBounds.bottom > rectBounds.top
  }

  function handleSuccess() {
    // Modify the rectangle - change to darker color
    if (modifyRectangle) {
      modifyRectangle((rect) => {
        rect.clear()
        rect.beginFill(0x333333)
        rect.drawRect(0, 0, 100, 200)
        rect.endFill()
        rect.addChild(dragEndText)
      })
    }

    const button = new PIXI.Text('Restart', {
      fontFamily: 'Arial',
      fontSize: 24,
      fontWeight: 'bold',
      fill: 0xffffff,
      align: 'center',
    })
    button.anchor.set(0.5)
    button.x = app.screen.width / 2
    button.y = app.screen.height / 2 + 100
    button.eventMode = 'dynamic' // Make it interactive
    button.cursor = 'pointer'
    
    button.on('pointerdown', handleDragEnd)
    app.stage.addChild(button)
  }

  function handleDragEnd(){
    console.log('bye');
    
    window.location.reload();
  }
  
  circle.on('pointerdown', (event)=>{
    dragOffset = {
      x: event.global.x - circle.x,
      y: event.global.y - circle.y
    }
    dragging = true
  })
  
  circle.on('pointerup', () => {
    // Check collision when circle is dropped
    const rectangle = getRectangle ? getRectangle() : null
    if (isCircleInRectangle(circle, rectangle)) {
      handleSuccess()
    }
    
    dragging = false
    dragOffset = null
  })
  
  circle.on('pointerupoutside', () => {
    // Check collision when circle is dropped outside
    const rectangle = getRectangle ? getRectangle() : null
    if (isCircleInRectangle(circle, rectangle)) {
      handleSuccess()
    }
    
    dragging = false
    dragOffset = null
  })
  
  app.stage.eventMode = 'dynamic'
  app.stage.on('pointermove', (event) => {
    if (dragging) {
      circle.x = event.global.x - dragOffset.x
      circle.y = event.global.y - dragOffset.y
      
    //拖拽时生成粒子
    if(particles.length < MAX_PARTICLES){
        for (let i = 0; i < 2; i++) {
            const particle = new PIXI.Text('●', {
                fontSize: Math.random() * 10 + 10,
                fill: `hsl(${Math.random() * 360}, 70%, 60%)`,
            })
            particle.anchor.set(0.5)
            particle.x = circle.x + (Math.random() - 0.5) * 30
            particle.y = circle.y + (Math.random() - 0.5) * 30
            particle.alpha = 1
            particle.vx = (Math.random() - 0.5) * 3
            particle.vy = (Math.random() - 0.5) * 3
            particle.life = 60
            particles.push(particle)
            app.stage.addChild(particle)
            }
    }

    // 添加轨迹点 - 增加采样密度
    const lastPoint = trailPoints[trailPoints.length - 1]
    if (!lastPoint || 
        Math.abs(lastPoint.x - circle.x) > 2 || 
        Math.abs(lastPoint.y - circle.y) > 2) {
        trailPoints.push({ x: circle.x, y: circle.y })
        if (trailPoints.length > 100) {
        trailPoints.shift()
        }
    }
    trailContainer.removeChildren()
      const trail = new PIXI.Graphics()
      trail.lineStyle(2, 0x00ff00, 0.5)
      if (trailPoints.length > 1) {
        for (let i = 0; i < trailPoints.length - 1; i++) {
            const trail = new PIXI.Graphics()
            const alpha = (i + 1) / trailPoints.length
            trail.lineStyle(50, 0x00ffff, alpha * 0.6)
            trail.moveTo(trailPoints[i].x, trailPoints[i].y)
            trail.lineTo(trailPoints[i + 1].x, trailPoints[i + 1].y)
            trailContainer.addChild(trail)
          }
      }
    }
  })

  app.ticker.add(() => {
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i]
      particle.x += particle.vx
      particle.y += particle.vy
      particle.alpha -= 1 / 60
      particle.life--
      
      if (particle.life <= 0 || particle.alpha <= 0) {
        app.stage.removeChild(particle)
        particle.destroy()
        particles.splice(i, 1)
      }
    }
  })
  app.stage.addChild(trailContainer)

  return circle
}