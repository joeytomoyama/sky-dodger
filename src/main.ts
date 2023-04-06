import './style.css'
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { BoxGeometry, BufferGeometry, Group, Object3D, PerspectiveCamera, SphereGeometry, WebGLRenderer } from 'three';

import Ship from './Ship'
import Obstacles from './Obstacles';

console.log('test')

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

let container: HTMLElement | null
let camera: PerspectiveCamera
let scene: THREE.Scene
let renderer: WebGLRenderer
// let controls: OrbitControls

let ship: Ship

let pointLight: THREE.PointLight

let obstacles: Obstacles

let isAccelerating: boolean
let isDecelerating: boolean
let isYawingRight: boolean
let isYawingLeft: boolean
let isPitchingUp: boolean

let isGameOver: boolean = false

const fpsCounterDiv = document.querySelector('.fpsCounter')

function init(): void {
  container = document.getElementById('container')

  scene = new THREE.Scene()

  // scene.fog = new THREE.Fog('black', 100, 1000)

  //

  camera = new THREE.PerspectiveCamera( 110, aspect, 0.01, 10000 )
  camera.position.setY(3)
  camera.position.setZ(5)

  renderer = new THREE.WebGLRenderer({
    canvas: container as HTMLCanvasElement
  })
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)

  // controls = new OrbitControls(camera, renderer.domElement)

  const gridHelper = new THREE.GridHelper(20000, 500)
  scene.add(gridHelper)

  ship = new Ship(camera)

  scene.add( ship.model )
  // scene.add( ship.arrowHelperPitch )
  // scene.add( ship.arrowHelperRoll )
  // scene.add( ship.arrowHelperYaw )

  // LIGHTS
  pointLight = new THREE.PointLight(0xffffff)
  pointLight.position.set(0, 15, 0)
  scene.add(pointLight)

  const ambientLight = new THREE.AmbientLight(0xffffff)
  scene.add(ambientLight)

  // obstacles
  const obsGeometry = new THREE.SphereGeometry(175, 24, 24)
  const obsMaterial = new THREE.MeshStandardMaterial( { color: 0xFF6347, wireframe: false, opacity: 0.7, transparent: false })

  // obstacles = new Obstacles([obsGeometry, new THREE.TorusGeometry( 175, 45 ), new THREE.BoxGeometry( 100, 70, 250)], obsMaterial)
  obstacles = new Obstacles([obsGeometry], obsMaterial)
  scene.add(obstacles.create(100, 2000, 50, 500))

  renderer.render(scene, camera)

  animate()
}


// function addStar(obsGeometry: BufferGeometry, obsMaterial: THREE.Material, starGroup: Group) {
  
//   const star = new THREE.Mesh( obsGeometry, obsMaterial )
//   const [x, y, z] = Array(3).fill(undefined).map(() => THREE.MathUtils.randFloatSpread( 6000 ))
//   star.position.set(x, Math.abs(y) + 275, z)

//   starGroup.add(star)

//   starArray.push(star)
// }

function gameOver() {
  isGameOver = true
  const gameOverDiv = document.getElementById('gameOverInactive')
  gameOverDiv?.classList.add('gameOver')
  if (gameOverDiv) gameOverDiv.innerHTML = 'GAME OVER'
}

window.addEventListener('click', () => {
  container?.requestPointerLock()
})

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyW') isAccelerating = true
  if (e.code === 'KeyD') isYawingRight = true
  if (e.code === 'KeyA') isYawingLeft = true
  if (e.code === 'KeyS') isDecelerating = true
  if (e.code === 'Space') isPitchingUp = true
})

window.addEventListener('keyup', (e) => {
  if (e.code === 'KeyW') isAccelerating = false
  if (e.code === 'KeyD') isYawingRight = false
  if (e.code === 'KeyA') isYawingLeft = false
  if (e.code === 'KeyS') isDecelerating = false
  if (e.code === 'Space') isPitchingUp = false
})

window.addEventListener('mousemove', e => {
  if (isGameOver) return
  if (document.pointerLockElement !== container) return
  ship.handleMouseInput(e.movementX, e.movementY)
})

window.addEventListener('resize', () => {
  renderer.setSize( window.innerWidth, window.innerHeight )
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

// function checkCollision(ship: Ship, starGroup: Group): void {
//   if (ship.model.position.y < 0) gameOver()
//   // const boundingBox = new THREE.Box3().setFromObject(ship.model)
//   // let boundingSphere: THREE.Sphere
//   // starGroup.traverse(star => {
//   //   boundingSphere = new THREE.Sphere(star.position, 275)
//   //   if (boundingBox.intersectsSphere(boundingSphere)) gameOver()
//   // })

//   const raycasterZ = new THREE.Raycaster()
//   const raycasterX1 = new THREE.Raycaster()
//   const raycasterX2 = new THREE.Raycaster()

//   raycasterZ.set(ship.model.position, ship.axisRoll)
//   raycasterX1.set(ship.model.position, ship.axisPitch)
//   raycasterX2.set(ship.model.position, ship.axisPitch.clone().negate())

//   const intersectionsZ = raycasterZ.intersectObjects(starArray)
//   const intersectionsX1 = raycasterX1.intersectObjects(starArray)
//   const intersectionsX2 = raycasterX2.intersectObjects(starArray)
//   // const isCollision = !intersectionsZ.every(i => i.distance > 10)
//   const isCollisionZ = intersectionsZ[0]?.distance < 10
//   const isCollisionX1 = intersectionsX1[0]?.distance < 10
//   const isCollisionX2 = intersectionsX2[0]?.distance < 10
//   if (isCollisionZ) gameOver()
//   if (isCollisionX1) gameOver()
//   if (isCollisionX2) gameOver()

//   // const vector = new THREE.Vector3()
//   // starGroup.traverse(star => {
//   //   raycaster.set(ship.model.position, vector.subVectors(ship.model.position, star.position))
//   //   const intersects = raycaster.intersectObject(star)
//   //   // console.log(intersects[0]?.distance)
//   //   if (intersects[0]?.distance < 10) gameOver()
//   // })
// }

setInterval(() => {
  ship.updatePosition()
  if (isGameOver) return
  ship.updateSpeed(isAccelerating, isDecelerating)

  if (isYawingRight) ship.yaw(-0.005)
  if (isYawingLeft) ship.yaw(0.005)
  if (isPitchingUp) ship.pitch(0.05)

  // checkCollision(ship, starGroup)
}, 10)

let frameTime = Number.MAX_VALUE
let startTime: number
let endTime: number
function animate(): void {
  endTime = performance.now()
  if (startTime) {
    frameTime = endTime - startTime
    if (fpsCounterDiv) fpsCounterDiv.innerHTML = (1000 / frameTime).toFixed(0)
  }
  startTime = performance.now()

  
  // controls.update()
  
  
  ship.syncShip()
  ship.syncCamera()
  
  pointLight.position.set(ship.model.position.x, ship.model.position.y + 15, ship.model.position.z)
  
  const isCollision = obstacles.checkCollision(ship)
  if (isCollision) gameOver()
  
  requestAnimationFrame( animate )
  renderer.render( scene, camera )
}

// THREE.DefaultLoadingManager.onLoad = () => {
//   console.log('loaded')
//   camera.position.x = ship.position.x
//   camera.position.y = ship.position.y + 5
//   camera.position.z = ship.position.z + 5
//   camera.lookAt(ship.position)
// }

init()