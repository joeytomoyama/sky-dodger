// import THREE, { Group, MathUtils } from "three"
import * as THREE from 'three'
import Ship from './Ship'

export default class Obstacles {

    private geometries: THREE.BufferGeometry[]
    private material: THREE.Material
    private obsGroup: THREE.Group
    private obsArray: Array<THREE.Mesh>

    constructor(geometries: THREE.BufferGeometry[], material: THREE.Material) {
        this.geometries = geometries
        this.material = material
        this.obsGroup = new THREE.Group()
        this.obsArray = []
    }

    create(amount: number, spread: number, minSize?: number, maxSize?: number): THREE.Group {
        // const test = this.geometries[0] as SphereGeometry
        // if (minSize && maxSize) test.parameters.radius = MathUtils.randInt(minSize, maxSize)
        for (let i = 0; i < amount; i++) {
            const obstacle = new THREE.Mesh( this.geometries[THREE.MathUtils.randInt(0, this.geometries.length - 1)], this.material )
            // const obstacle = new THREE.Mesh( test, this.material )
            const [x, y, z] = Array(3).fill(undefined).map(() => THREE.MathUtils.randFloatSpread( spread ))
            obstacle.position.set(x, y + spread / 2, z)
            this.obsGroup.add(obstacle)
            this.obsArray.push(obstacle)
        }
        console.log(this.obsGroup.children)
        return this.obsGroup
    }

    checkCollision(ship: Ship): boolean {
        if (ship.model.position.y < 0) return true
        // const boundingBox = new THREE.Box3().setFromObject(ship.model)
        // let boundingSphere: THREE.Sphere
        // starGroup.traverse(star => {
        //   boundingSphere = new THREE.Sphere(star.position, 275)
        //   if (boundingBox.intersectsSphere(boundingSphere)) return true
        // })
      
        const raycasterZ = new THREE.Raycaster()
        const raycasterX1 = new THREE.Raycaster()
        const raycasterX2 = new THREE.Raycaster()
      
        raycasterZ.set(ship.model.position, ship.axisRoll)
        raycasterX1.set(ship.model.position, ship.axisPitch)
        raycasterX2.set(ship.model.position, ship.axisPitch.clone().negate())
      
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
        //   raycaster.set(ship.model.position, vector.subVectors(ship.model.position, star.position))
        //   const intersects = raycaster.intersectObject(star)
        //   // console.log(intersects[0]?.distance)
        //   if (intersects[0]?.distance < 10) return true
        // })
      }
}