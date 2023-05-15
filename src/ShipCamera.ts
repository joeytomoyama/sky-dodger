import * as THREE from 'three'
import Ship from './Ship'

export default class ShipCamera extends THREE.PerspectiveCamera {

    ship: Ship
    invertedCamera = 1
    maxFovOffset = 7
    fovReference: number

    constructor(fov: number, aspect: number, min: number, max: number, ship: Ship) {
        super(fov, aspect, min, max)
        this.ship = ship
        this.fovReference = fov
    }

    syncCamera() {
        const cameraZOffset = this.maxFovOffset * this.calculateFovOffset() + 10
        if (this.invertedCamera === 1) {
            this.position.x = this.ship.position.x - this.ship.axisRoll.x * cameraZOffset * this.invertedCamera + this.ship.axisYaw.x * 4
            this.position.y = this.ship.position.y - this.ship.axisRoll.y * cameraZOffset * this.invertedCamera + this.ship.axisYaw.y * 4
            this.position.z = this.ship.position.z - this.ship.axisRoll.z * cameraZOffset * this.invertedCamera + this.ship.axisYaw.z * 4
            this.fov = this.fovReference + this.maxFovOffset * this.calculateFovOffset()
            this.updateProjectionMatrix()
        } else {
            this.position.x = this.ship.position.x - this.ship.axisRoll.x * 10 * this.invertedCamera
            this.position.y = this.ship.position.y - this.ship.axisRoll.y * 10 * this.invertedCamera
            this.position.z = this.ship.position.z - this.ship.axisRoll.z * 10 * this.invertedCamera
            // this.fov = 160
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

    calculateFovOffset() {
        const speedRange = this.ship.maxSpeed - this.ship.minSpeed
        const currentSpeed = this.ship.speed
        const minSpeed = this.ship.minSpeed
        const footRoom = currentSpeed - minSpeed

        return footRoom / speedRange
    }
}