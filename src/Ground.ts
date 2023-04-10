import * as THREE from 'three'
import Ship from './Ship'

export default class Ground {

    public mesh: THREE.Mesh
    protected ship: Ship

    constructor(ship: Ship) {
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(5000, 5000), new THREE.MeshStandardMaterial({color: 0xb2b2b2 })).rotateX(-Math.PI / 2)//0xFF6347
        this.ship = ship
    }

    update() {
        this.mesh.position.set(this.ship.position.x, 0, this.ship.position.z)
    }

    setPosition(vector: THREE.Vector3) {
        this.mesh.position.set(vector.x, 0, vector.z)
    }
}