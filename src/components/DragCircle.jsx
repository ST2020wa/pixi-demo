import * as PIXI from 'pixi.js'

export function createDragCircle(app) {
  const circle = new PIXI.Graphics()
  circle.beginFill(0x00ffff)
  circle.drawCircle(0, 0, 25)
  circle.endFill()
  circle.x = app.screen.width / 2
  circle.y = app.screen.height / 2

  const text = new PIXI.Text('Drag Me', {
    fontFamily: 'Arial',
    fontSize: 12,
    fill: 0x00008B,
    align: 'center',
  })
  text.anchor.set(0.5)
  text.x = 0
  text.y = 0
  circle.addChild(text)

  circle.eventMode = 'dynamic'
  circle.cursor = 'pointer'

  const trailContainer = new PIXI.Container()
  const trailPoints = []
  const particles = []
  const MAX_PARTICLES = 1000 // 最大粒子数限制
  
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