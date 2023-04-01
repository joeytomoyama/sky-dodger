import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PerspectiveCamera, Vector3, WebGLRenderer } from 'three';

console.log('test')

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

let container: HTMLElement | null
let camera: PerspectiveCamera
let scene: THREE.Scene
let renderer: WebGLRenderer
let controls: OrbitControls

let ship: any

let goingForwards: boolean

function init(): void {
  container = document.getElementById('container')

  scene = new THREE.Scene()

  //

  camera = new THREE.PerspectiveCamera( 90, aspect, 0.1, 10000 )
  // camera.position.setY(5)

  renderer = new THREE.WebGLRenderer({
    canvas: container as HTMLCanvasElement
  })
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)

  // controls = new OrbitControls(camera, renderer.domElement)

  const gridHelper = new THREE.GridHelper(200, 50)
  scene.add(gridHelper)

  ship = makeShip()

  scene.add( ship )

  renderer.render(scene, camera)

  // setInterval(() => {
  //   console.log(goingForwards)
  //   if (goingForwards) {
  //     ship.position.z -= 0.1
  //     camera.position.x = ship.position.x
  //     camera.position.y = ship.position.y + 5
  //     camera.position.z = ship.position.z + 5
  //     camera.lookAt(ship.position)
  //   }
  // }, 10)
  // camera.position.x = ship.position.x
  // camera.position.y = ship.position.y + 5
  // camera.position.z = ship.position.z + 5
  // camera.lookAt(ship.position)

  animate()
}

function makeShip(): THREE.Group {
  const group = new THREE.Group()
  const shipGeo = new THREE.TetrahedronGeometry(5)
  shipGeo.rotateY(Math.PI / 4)
  const ship = new THREE.Mesh(shipGeo, new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true } ))
  ship.rotateX(Math.PI / 5)
  group.add(ship)
  group.scale.set(0.7, 0.3, 1)
  // ship.lookAt(5, 5, 5)
  // ship.rotateX(Math.PI / 10)
  // ship.add(camera)
  // camera.position.z = 10
  return group
}

function animate(): void {
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
    goingForwards = true
  }
})

window.addEventListener('keyup', (e) => {
  if (e.code === 'KeyW') {
    goingForwards = false
  }
})

window.addEventListener('mousemove', e => {
  // e.preventDefault
  console.log(e.movementX, e.movementY)
  // const event = new MouseEvent('mousemove', { clientX: SCREEN_WIDTH / 2, clientY: SCREEN_HEIGHT / 2 })
  // document.getElementById('canvas')?.dispatchEvent(event)
})

setInterval(() => {
  console.log(goingForwards)
  if (goingForwards) {
    ship.position.z -= 0.1
    camera.position.x = ship.position.x
    camera.position.y = ship.position.y + 5
    camera.position.z = ship.position.z + 5
    camera.lookAt(ship.position)
  }
}, 10)
// camera.position.x = ship.position.x
// camera.position.y = ship.position.y + 5
// camera.position.z = ship.position.z + 5
// camera.lookAt(ship.position)

init()

/*
in battlefield 3 when you are flying in the pc version you can control the jet by using the w, a ,s d keys and the mouse. how does the game calculate
*/