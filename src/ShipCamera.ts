import * as THREE from 'three'
import Ship from './Ship'

export default class ShipCamera extends THREE.PerspectiveCamera {

    ship: Ship
    invertedCamera = 1
    fovOffset = 0

    constructor(fov: number, aspect: number, min: number, max: number, ship: Ship) {
        super(fov, aspect, min, max)
        this.ship = ship
    }

    syncCamera() {
        // this.position.x = this.ship.position.x - this.ship.axisRoll.x * 10// * this.invertedCamera + this.ship.axisYaw.x * 5
        // this.position.y = this.ship.position.y - this.ship.axisRoll.y * 10// * this.invertedCamera + this.ship.axisYaw.y * 5
        // this.position.z = this.ship.position.z - this.ship.axisRoll.z * 10// * this.invertedCamera + this.ship.axisYaw.z * 5
        if (this.invertedCamera === 1) {
            this.position.x = this.ship.position.x - this.ship.axisRoll.x * 10 * this.invertedCamera + this.ship.axisYaw.x * 5
            this.position.y = this.ship.position.y - this.ship.axisRoll.y * 10 * this.invertedCamera + this.ship.axisYaw.y * 5
            this.position.z = this.ship.position.z - this.ship.axisRoll.z * 10 * this.invertedCamera + this.ship.axisYaw.z * 5
        } else {
            this.position.x = this.ship.position.x - this.ship.axisRoll.x * 10 * this.invertedCamera
            this.position.y = this.ship.position.y - this.ship.axisRoll.y * 10 * this.invertedCamera
            this.position.z = this.ship.position.z - this.ship.axisRoll.z * 10 * this.invertedCamera
        }

        // this.setRotationFromEuler(this.ship.rotation)
        this.lookAt(this.ship.position)

        if (this.invertedCamera === 1) {
            this.rotation.set(this.ship.rotation.x, this.ship.rotation.y, this.ship.rotation.z)
        } else {
            this.rotation.set(this.rotation.x, this.rotation.y, -this.ship.rotation.z + Math.PI)
        }
    }

    pursuitCamera() {
        this.invertedCamera = -1
    }

    chaseCamera() {
        this.invertedCamera = 1
    }
}