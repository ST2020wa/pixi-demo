import * as PIXI from 'pixi.js'

export function createGrid(app) {
  const grid = new PIXI.Graphics()
  
  // 细线网格
  grid.lineStyle(1, 0x555555)
  for (let x = 0; x <= app.screen.width; x += 10) {
    grid.moveTo(x, 0)
    grid.lineTo(x, app.screen.height)
  }
  for (let y = 0; y <= app.screen.height; y += 10) {
    grid.moveTo(0, y)
    grid.lineTo(app.screen.width, y)
  }
  
  // 粗线网格
//   grid.lineStyle(2, 0x777777)
//   for (let x = 0; x <= app.screen.width; x += 50) {
//     grid.moveTo(x, 0)
//     grid.lineTo(x, app.screen.height)
//   }
//   for (let y = 0; y <= app.screen.height; y += 50) {
//     grid.moveTo(0, y)
//     grid.lineTo(app.screen.width, y)
//   }

  return grid
}