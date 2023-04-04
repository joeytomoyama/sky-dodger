import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PerspectiveCamera, Vector3, WebGLRenderer } from 'three';

import Ship from './Ship'

console.log('test')

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

let container: HTMLElement | null
let camera: PerspectiveCamera
let scene: THREE.Scene
let renderer: WebGLRenderer
let controls: OrbitControls

let ship: Ship

let isAccelerating: boolean

const fpsCounterDiv = document.querySelector('.fpsCounter')

function init(): void {
  container = document.getElementById('container')

  scene = new THREE.Scene()

  //

  camera = new THREE.PerspectiveCamera( 90, aspect, 0.1, 10000 )
  camera.position.setY(3)
  camera.position.setZ(5)

  renderer = new THREE.WebGLRenderer({
    canvas: container as HTMLCanvasElement
  })
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)

  // controls = new OrbitControls(camera, renderer.domElement)

  const gridHelper = new THREE.GridHelper(200, 50)
  scene.add(gridHelper)

  ship = new Ship(20, camera)

  scene.add( ship.model )
  scene.add( ship.arrowHelperPitch )
  scene.add( ship.arrowHelperRoll )

  renderer.render(scene, camera)

  animate()
}

let fpsCounter = 0
function animate(): void {
  fpsCounter++
  requestAnimationFrame( animate )

  // controls.update()

  // camera.lookAt(0, 5, 0)

  renderer.render( scene, camera )
}

window.addEventListener('click', e => {
  container?.requestPointerLock()
})

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyW') {
    isAccelerating = true
  }
})

window.addEventListener('keyup', (e) => {
  if (e.code === 'KeyW') {
    isAccelerating = false
  }
})

window.addEventListener('mousemove', e => {
  // console.log(e.movementX, e.movementY)
  if (e.movementX > 0) {
    ship.rollRight(e.movementX)
  } else if (e.movementX < 0) {
    ship.rollLeft(e.movementX)
  }

  if (e.movementY > 0) {
    ship.pitchUp(e.movementY)
  } else if (e.movementY < 0) {
    ship.pitchDown(e.movementY)
  }
})

setInterval(() => {
  // console.log(isAccelerating)
  // ship.position.z -= 0.1
  camera.position.x = ship.model.position.x - ship.axisRoll.x * 10
  camera.position.y = ship.model.position.y - ship.axisRoll.y * 10
  camera.position.z = ship.model.position.z - ship.axisRoll.z * 10
  camera.lookAt(ship.model.position)
  camera.rotation.x = ship.model.rotation.x
  camera.rotation.y = ship.model.rotation.y
  camera.rotation.z = ship.model.rotation.z
  ship.updateSpeed(isAccelerating)
  ship.updatePosition()

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