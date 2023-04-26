// import THREE, { Group, MathUtils } from "three"
import * as THREE from 'three'
import Ship from './Ship'

export default class Obstacle {

    private position: THREE.Vector3
    private length: number
    private geometries: THREE.BufferGeometry[]
    private material: THREE.Material
    private obsGroup: THREE.Group

    constructor(position: THREE.Vector3, length: number, geometries: THREE.BufferGeometry[], material: THREE.Material) {
        this.position = position
        this.length = length
        this.geometries = geometries
        this.material = material
        this.obsGroup = new THREE.Group()
    }

    create(amount: number, minSize?: number, maxSize?: number): THREE.Group {
        // const test = this.geometries[0] as SphereGeometry
        // if (minSize && maxSize) test.parameters.radius = MathUtils.randInt(minSize, maxSize)
        for (let i = 0; i < amount; i++) {
            const obstacle = new THREE.Mesh( this.geometries[THREE.MathUtils.randInt(0, this.geometries.length - 1)], this.material )
            // const obstacle = new THREE.Mesh( test, this.material )
            const [x, y, z] = [this.position.x, this.position.y, this.position.z].map((position) => position + THREE.MathUtils.randFloatSpread( this.length - 100 ))
            obstacle.position.set(x, y, z)
            this.obsGroup.add(obstacle)
        }
        console.log(this.obsGroup.children)
        return this.obsGroup
    }

    checkCollision(ship: Ship): boolean {
        // if (ship.position.y < 0) return true
        // const boundingBox = new THREE.Box3().setFromObject(ship)
        // let boundingSphere: THREE.Sphere
        // starGroup.traverse(star => {
        //   boundingSphere = new THREE.Sphere(star.position, 275)
        //   if (boundingBox.intersectsSphere(boundingSphere)) return true
        // })
      
        const raycasterZ = new THREE.Raycaster()
        const raycasterX1 = new THREE.Raycaster()
        const raycasterX2 = new THREE.Raycaster()
      
        raycasterZ.set(ship.position, ship.axisRoll)
        raycasterX1.set(ship.position, ship.axisPitch)
        raycasterX2.set(ship.position, ship.axisPitch.clone().negate())
      
        const intersectionsZ = raycasterZ.intersectObjects(this.obsGroup.children)
        const intersectionsX1 = raycasterX1.intersectObjects(this.obsGroup.children)
        const intersectionsX2 = raycasterX2.intersectObjects(this.obsGroup.children)
        // const isCollision = !intersectionsZ.every(i => i.distance > 10)
        const isCollisionZ = intersectionsZ[0]?.distance < 10
        const isCollisionX1 = intersectionsX1[0]?.distance < 10
        const isCollisionX2 = intersectionsX2[0]?.distance < 10
        if (isCollisionZ) return true
        if (isCollisionX1) return true
        if (isCollisionX2) return true

        return false
      
        // const vector = new THREE.Vector3()
        // starGroup.traverse(star => {
        //   raycaster.set(ship.position, vector.subVectors(ship.position, star.position))
        //   const intersects = raycaster.intersectObject(star)
        //   // console.log(intersects[0]?.distance)
        //   if (intersects[0]?.distance < 10) return true
        // })
      }

      isShipInside(ship: Ship) { 
        const minX = this.position.x - this.length / 2;
        const maxX = this.position.x + this.length / 2;
        const minY = this.position.y - this.length / 2;
        const maxY = this.position.y + this.length / 2;
        const minZ = this.position.z - this.length / 2;
        const maxZ = this.position.z + this.length / 2;

        return ship.position.x >= minX && ship.position.x <= maxX &&
                ship.position.y >= minY && ship.position.y <= maxY &&
                ship.position.z >= minZ && ship.position.z <= maxZ;
      }

      isShipPassed(ship: Ship) {
        const minZ = this.position.z - this.length / 2;
        const maxZ = this.position.z + this.length / 2;

        return ship.position.z >= minZ && ship.position.z <= maxZ;
      }

      getPosition() {
        return this.position
      }

      getGroup() {
        return this.obsGroup
      }
}