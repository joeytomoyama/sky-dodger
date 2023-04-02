import * as THREE from 'three'
import { Vector3 } from 'three'
// import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';

export default class Ship {
    public speed
    private maxSpeed: number
    private position = new Vector3(0, 0, 0)
    private direction = new Vector3(0, 1, -1)
    public arrowHelper = new THREE.ArrowHelper(this.direction.normalize(), this.position, 5, 'white');

    private xAxis = new THREE.Vector3(1, 0, 0);
    private yAxis = new THREE.Vector3(0, 1, 0);
    private zAxis = new THREE.Vector3(0, 0, 1);
    private matrix = new THREE.Matrix4()

    // private box = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true } ))

    private geo = new THREE.TetrahedronGeometry(5)
    private mesh = new THREE.Mesh(this.geo, new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true } ))
    .rotateOnWorldAxis(new Vector3(0, 1, 0), Math.PI / 4)
    .rotateOnWorldAxis(new Vector3(1, 0, 0), Math.PI / 5)
    public model = new THREE.Object3D().add(this.mesh)//.add(this.arrowHelper);//.add(this.box)//.add(this.direction)


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
        this.model.rotation.z -= impulse / 100
    }

    pitchUp(impulse: number) {
        this.matrix.makeRotationAxis(this.xAxis, impulse / 100)
        this.direction.applyMatrix4(this.matrix)
        this.arrowHelper.setDirection(this.direction)
        // console.log(this.direction)
        this.model.rotation.x = this.direction.x
        this.model.rotation.y = this.direction.y
        this.model.rotation.z = this.direction.z
        // this.direction.rota
    }

    pitchDown(impulse: number) {
        this.matrix.makeRotationAxis(this.xAxis, impulse / 100)
        this.direction.applyMatrix4(this.matrix)
        this.arrowHelper.setDirection(this.direction)
        console.log(this.direction.y)
        this.model.rotation.x = this.direction.x
        console.log(this.model.rotation.y)
    }

}