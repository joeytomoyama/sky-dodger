import * as THREE from 'three'
import { gameOver } from './main';
import Obstacles from "./Obstacles";
import Ship from "./Ship";

export default class ObstaclesManager {

    private scene: THREE.Scene
    private ship: Ship
    // private obstacles: Obstacles
    private obsGeometry = new THREE.SphereGeometry(200, 24, 24)
    private obsMaterial = new THREE.MeshStandardMaterial( { color: 0xFF6347, wireframe: false, opacity: 0.7, transparent: false })
    private obstaclesArray: Array<Obstacles>
    private chunkSize: number
    idx = 1
    
    constructor(scene: THREE.Scene, ship: Ship, chunkSize: number, obstacles?: Obstacles) {
        this.scene = scene
        this.ship = ship
        // this.obstacles = obstacles
        this.chunkSize = chunkSize
        this.obstaclesArray = new Array<Obstacles>(2)
    }

    initialize() {
        this.obstaclesArray[0] = new Obstacles(new THREE.Vector3(0, this.chunkSize / 2, -this.chunkSize * this.idx++), this.chunkSize, [this.obsGeometry], this.obsMaterial)
        this.obstaclesArray[1] = new Obstacles(new THREE.Vector3(0, this.chunkSize / 2, -this.chunkSize * this.idx++), this.chunkSize, [this.obsGeometry], this.obsMaterial)
        this.obstaclesArray.forEach(obstacles => {
            this.scene.add(obstacles.create(40))
        })
    }

    spawnObstacles() {
        if (this.obstaclesArray[1].isShipPassed(this.ship)) {
            let zValue = this.obstaclesArray.shift()?.getPosition().z as number - this.chunkSize * 2
            // if (zValue) zValue -= this.chunkSize * 2
            console.log(zValue, -this.chunkSize * this.idx++)
            this.obstaclesArray[1] = new Obstacles(new THREE.Vector3(this.ship.position.x, this.ship.position.y, zValue), this.chunkSize, [this.obsGeometry], this.obsMaterial)
            this.scene.add(this.obstaclesArray[1].create(400))
        }

        let isCollision = false
        this.obstaclesArray.forEach(o => {
            if (o.isShipInside(this.ship)) console.log(o)
            isCollision = o.checkCollision(this.ship)
            if (isCollision) gameOver()
        })
    }
}