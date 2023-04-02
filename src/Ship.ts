import * as THREE from 'three'
import { Vector3 } from 'three'

export default class Ship {
    public speed
    private maxSpeed: number
    private position = new Vector3(0, 0, -1)
    private direction = new Vector3(0, 0, -1)

    private geo = new THREE.TetrahedronGeometry(5)
    private mesh = new THREE.Mesh(this.geo, new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true } ))
    .rotateOnWorldAxis(new Vector3(0, 1, 0), Math.PI / 4)
    .rotateOnWorldAxis(new Vector3(1, 0, 0), Math.PI / 5)
    public model = new THREE.Object3D().add(this.mesh)//.add(this.direction)


    constructor(maxSpeed: number) {
        this.speed = 0
        this.maxSpeed = maxSpeed
        this.model.scale.set(0.7, 0.3, 1)
    }

    updateSpeed(isAccelerating: boolean) {
        this.speed = isAccelerating ? Math.min(this.maxSpeed, this.speed + 0.1) : Math.max(0, this.speed - 0.1)
    }

    updatePosition() {
        this.model.position.z -= this.speed / 100
        console.log(this.speed)
    }

    rollRight(impulse: number) {
        this.model.rotation.z -= impulse / 100
    }

    rollLeft(impulse: number) {
        // this.model.rotation.z += impulse / 100
        this.model.rotation.z -= impulse / 100
    }

    pitchUp(impulse: number) {
        this.model.rotation.x += impulse / 100
        // this.direction.rota
    }

    pitchDown(impulse: number) {
        // this.model.rotation.x -= impulse / 100
        this.model.rotation.x += impulse / 100
    }

}