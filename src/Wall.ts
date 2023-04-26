import * as THREE from 'three'
import { MeshStandardMaterial, PlaneGeometry } from 'three'
import { gameOver } from './main'
import Ship from './Ship'

export default class Wall {

    public mesh: THREE.Mesh
    public progression: number = 0
    protected ship: Ship

    constructor(ship: Ship) {
        this.ship = ship
        this.mesh = new THREE.Mesh(new PlaneGeometry(50000, 50000), new MeshStandardMaterial({ color: 'black', side: THREE.DoubleSide })).rotateY(Math.PI)
    }

    progress(delta: number) {
        this.progression += delta
        // this.mesh.translateZ(delta)
        this.mesh.position.set(this.ship.position.x, this.ship.position.y, Math.min(this.mesh.position.z + this.progression, this.ship.position.z + 1000))
        if (this.ship.position.z >= this.mesh.position.z) gameOver()
        // console.log(this.ship.position.z, this.mesh.position.z)
    }

    setPosition(vector: THREE.Vector3) {
        this.mesh.position.set(vector.x, vector.y, vector.z)
    }
}