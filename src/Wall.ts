import * as THREE from 'three'
import { MeshStandardMaterial, PlaneGeometry } from 'three'
import { gameOver } from './main'

export default class Wall {

    public mesh: THREE.Mesh
    public progression: number = 0
    protected ship: Ship

    constructor(ship: Shipt) {
        this.ship = ship
        this.mesh = new THREE.Mesh(new PlaneGeometry(50000, 50000), new MeshStandardMaterial({ color: 'black', side: THREE.DoubleSide })).rotateY(Math.PI)
    }

    progress(delta: number) {
        this.progression += delta
        // this.mesh.translateZ(delta)
        this.mesh.position.set(this.ship.model.position.x, this.ship.model.position.y, this.mesh.position.z + this.progression)
        if (this.ship.position.z >= this.mesh.position.z) gameOver()
        // console.log(this.ship.position.z, this.mesh.position.z)
    }

    setPosition(vector: THREE.Vector3) {
        this.mesh.position.set(vector.x, vector.y, vector.z)
    }
}