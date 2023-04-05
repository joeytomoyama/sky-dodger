import './style.css'
import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { BufferGeometry, Group, Object3D, PerspectiveCamera, SphereGeometry, WebGLRenderer } from 'three';

import Ship from './Ship'

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

let starGroup: THREE.Group
let starArray: Object3D[] = []

let isAccelerating: boolean
let isPitchingUp: boolean

let isGameOver: boolean = false

const fpsCounterDiv = document.querySelector('.fpsCounter')

function init(): void {
  container = document.getElementById('container')

  scene = new THREE.Scene()

  scene.fog = new THREE.Fog( 'black', 500, 2000)

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
  scene.add( ship.arrowHelperPitch )
  scene.add( ship.arrowHelperRoll )
  scene.add( ship.arrowHelperYaw )

  // LIGHTS
  pointLight = new THREE.PointLight(0xffffff)
  pointLight.position.set(0, 15, 0)
  scene.add(pointLight)

  const ambientLight = new THREE.AmbientLight(0xffffff)
  scene.add(ambientLight)

  // stars
  const starGeometry = new THREE.SphereGeometry(275, 24, 24)
  const starMaterial = new THREE.MeshStandardMaterial( { color: 0xFF6347, wireframe: false })
  starGroup = new THREE.Group()
  scene.add(starGroup)


  Array(1000).fill(undefined).forEach(() => addStar(starGeometry, starMaterial, starGroup))

  renderer.render(scene, camera)

  animate()
}


function addStar(starGeometry: BufferGeometry, starMaterial: THREE.Material, starGroup: Group) {
  
  const star = new THREE.Mesh( starGeometry, starMaterial )
  const [x, y, z] = Array(3).fill(undefined).map(() => THREE.MathUtils.randFloatSpread( 6000 ))
  star.position.set(x, Math.abs(y) + 275, z)

  starGroup.add(star)

  starArray.push(star)
}

let fpsCounter = 0
function animate(): void {
  fpsCounter++
  requestAnimationFrame( animate )

  // controls.update()

  
  // ship.updatePosition()

  renderer.render( scene, camera )
}

function gameOver() {
  isGameOver = true
  document.getElementById('gameOverInactive')?.classList.add('gameOver')
}

window.addEventListener('click', () => {
  container?.requestPointerLock()
})

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyW') {
    isAccelerating = true
  }
  if (e.code === 'Space') {
    isPitchingUp = true
  }
})

window.addEventListener('keyup', (e) => {
  if (e.code === 'KeyW') {
    isAccelerating = false
  }
  if (e.code === 'Space') {
    isPitchingUp = false
  }
})

window.addEventListener('mousemove', e => {
  if (isGameOver) return
  if (document.pointerLockElement !== container) return
  // console.log(e.movementX, e.movementY)
  const impulseX = e.movementX / 400
  const impulseY = e.movementY / 400

  if (impulseX > 0) {
    ship.rollRight(impulseX)
  } else if (impulseX < 0) {
    ship.rollLeft(impulseX)
  }

  if (impulseY > 0) {
    ship.pitchUp(impulseY)
  } else if (impulseY < 0) {
    ship.pitchDown(impulseY)
  }
})

window.addEventListener('resize', () => {
  renderer.setSize( window.innerWidth, window.innerHeight )

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

function checkCollision(ship: Ship, starGroup: Group): void {
  // const boundingBox = new THREE.Box3().setFromObject(ship.model)
  // let boundingSphere: THREE.Sphere
  // starGroup.traverse(star => {
  //   boundingSphere = new THREE.Sphere(star.position, 275)
  //   if (boundingBox.intersectsSphere(boundingSphere)) gameOver()
  // })

  const raycasterZ = new THREE.Raycaster()
  const raycasterX1 = new THREE.Raycaster()
  const raycasterX2 = new THREE.Raycaster()

  raycasterZ.set(ship.model.position, ship.axisRoll)
  raycasterX1.set(ship.model.position, ship.axisPitch)
  raycasterX2.set(ship.model.position, ship.axisPitch.clone().negate())

  const intersectionsZ = raycasterZ.intersectObjects(starArray)
  const intersectionsX1 = raycasterX1.intersectObjects(starArray)
  const intersectionsX2 = raycasterX2.intersectObjects(starArray)
  // const isCollision = !intersectionsZ.every(i => i.distance > 10)
  const isCollisionZ = intersectionsZ[0]?.distance < 10
  const isCollisionX1 = intersectionsX1[0]?.distance < 10
  const isCollisionX2 = intersectionsX2[0]?.distance < 10
  if (isCollisionZ) gameOver()
  if (isCollisionX1) gameOver()
  if (isCollisionX2) gameOver()

  // const vector = new THREE.Vector3()
  // starGroup.traverse(star => {
  //   raycaster.set(ship.model.position, vector.subVectors(ship.model.position, star.position))
  //   const intersects = raycaster.intersectObject(star)
  //   // console.log(intersects[0]?.distance)
  //   if (intersects[0]?.distance < 10) gameOver()
  // })
}

setInterval(() => {
  if (isGameOver) return
  camera.position.x = ship.model.position.x - ship.axisRoll.x * 10 + ship.axisYaw.x * 5
  camera.position.y = ship.model.position.y - ship.axisRoll.y * 10 + ship.axisYaw.y * 5
  camera.position.z = ship.model.position.z - ship.axisRoll.z * 10 + ship.axisYaw.z * 5
  camera.lookAt(ship.model.position)
  camera.rotation.x = ship.model.rotation.x
  camera.rotation.y = ship.model.rotation.y
  camera.rotation.z = ship.model.rotation.z
  ship.updateSpeed(isAccelerating)
  ship.updatePosition()

  if (isPitchingUp) ship.pitchUp(0.01)

  pointLight.position.set(ship.model.position.x, ship.model.position.y + 15, ship.model.position.z)

  checkCollision(ship, starGroup)

  if (fpsCounterDiv) fpsCounterDiv.innerHTML = String(fpsCounter * 100)
  fpsCounter = 0
}, 10)

// THREE.DefaultLoadingManager.onLoad = () => {
//   console.log('loaded')
//   camera.position.x = ship.position.x
//   camera.position.y = ship.position.y + 5
//   camera.position.z = ship.position.z + 5
//   camera.lookAt(ship.position)
// }

init()

/*
in battlefield 3 when you are flying in the pc version you can control the jet by using the w, a ,s d keys and the mouse. how does the game calculate
*/