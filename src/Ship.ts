import * as THREE from 'three'
// import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
// import { Face } from 'three/examples/jsm/math/ConvexHull'

export default class Ship extends THREE.Object3D {
    public speed
    public maxSpeed = 15
    public minSpeed = 3
    public position = new THREE.Vector3(0, 20, -50)

    public axisRoll = new THREE.Vector3(0, 0, -1)
    public axisYaw = new THREE.Vector3(0, 1, 0)
    public axisPitch = new THREE.Vector3(1, 0, 0)

    // public arrowHelperRoll = new THREE.ArrowHelper(this.axisRoll.normalize(), this.position, 5, 'red');
    // public arrowHelperYaw = new THREE.ArrowHelper(this.axisYaw.normalize(), this.position, 5, 'green');
    // public arrowHelperPitch = new THREE.ArrowHelper(this.axisPitch.normalize(), this.position, 5, 'blue');
    
    private rotationMatrix = new THREE.Matrix4()

    // private boxGeo = new THREE.BoxGeometry(10, 10, 10)
    // private box = new THREE.Mesh(this.boxGeo, new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true } ))

    private geo = new THREE.TetrahedronGeometry(5)
    private mesh = new THREE.Mesh(this.geo, new THREE.MeshStandardMaterial( {color: 'grey', wireframe: false } )) //0xFF6347
    .rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI / 4)
    .rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), Math.PI / 5)
    // public model = new THREE.Object3D().add(this.mesh)//.add(this.arrowHelperRoll);//.add(this.box)//.add(this.axisRoll)

    public invertedCamera = 1

    constructor() {
        super()
        this.add(this.mesh)
        this.speed = 0
        this.scale.set(1, 0.15, 1)
    }

    updateSpeed(isAccelerating: boolean, isDecelerating: boolean): void {
        // this.speed = isAccelerating ? Math.min(this.maxSpeed, this.speed + 0.01) : Math.max(this.minSpeed, this.speed - 0.01)
        if (isAccelerating) this.speed += 0.01
        if (isDecelerating) this.speed -= 0.01
        if (!isAccelerating && !isDecelerating) this.speed -= 0.002

        this.speed = THREE.MathUtils.clamp(this.speed, this.minSpeed, this.maxSpeed)
    }

    updatePosition() {
        this.position.addScaledVector(this.axisRoll, this.speed)

        // console.log("axis :", this.axisPitch.x.toFixed(2), this.axisPitch.y.toFixed(2), this.axisPitch.z.toFixed(2))
        // console.log((Math.atan2(this.axisPitch.x, this.axisPitch.y) * (180 / Math.PI)) - 90)
        // console.log("model:", this.rotation.x.toFixed(2), this.rotation.y.toFixed(2), this.rotation.z.toFixed(2))
        // console.log("\n")
    }

    updateYaw() {
        this.axisYaw = this.axisYaw.crossVectors(this.axisPitch, this.axisRoll)//this.axisRoll.dot(this.axisPitch)
        // this.arrowHelperYaw.setDirection(this.axisYaw)
    }

    syncShip() {
        this.position.set(this.position.x, this.position.y, this.position.z)
    }

    handleMouseInput(movementX: number, movementY: number): void {
        const impulseX = movementX / 400
        const impulseY = movementY / 400

        this.roll(impulseX)

        this.pitch(impulseY)
    }

    roll(impulse: number): void {
        // if (impulse > 2.2) impulse = 2.2
        // const forwardDirection = new THREE.THREE.Vector3(0, 0, -1);
        // forwardDirection.applyEuler(new THREE.Euler(Math.PI / 2, Math.PI / 2, Math.PI / 2));
        // console.log(forwardDirection)

        // this.rotation.z -= impulse

        this.rotationMatrix.makeRotationAxis(this.axisRoll, impulse)
        this.axisPitch.applyMatrix4(this.rotationMatrix)
        // this.arrowHelperPitch.setDirection(this.axisPitch)

        // const quaternion = new THREE.Quaternion()
        // quaternion.setFromRotationMatrix(this.rotationMatrix)
        // this.quaternion.multiply(quaternion)
        
        // this.applyMatrix4(this.rotationMatrix)

        this.rotateOnWorldAxis(this.axisRoll, impulse)
        // this.camera.rotateOnWorldAxis(this.axisRoll, impulse)

        // this.rotation.z = this.axisPitch.x
        // this.updateYaw()
    }

    pitch(impulse: number): void {
        // if (impulse > 4.2) impulse = 4.2
        // this.rotation.x += impulse

        this.rotationMatrix.makeRotationAxis(this.axisPitch, impulse)
        this.axisRoll.applyMatrix4(this.rotationMatrix)
        // this.arrowHelperRoll.setDirection(this.axisRoll)
        
        // const quaternion = new THREE.Quaternion()
        // quaternion.setFromRotationMatrix(this.rotationMatrix)
        // this.quaternion.multiply(quaternion)
        
        // this.applyMatrix4(this.rotationMatrix)

        this.rotateOnWorldAxis(this.axisPitch, impulse)
        // this.camera.lookAt(this.position)

        // this.rotation.x = this.axisRoll.x
        this.updateYaw()
    }

    yaw(impulse: number): void {
        this.rotationMatrix.makeRotationAxis(this.axisYaw, impulse)
        this.axisPitch.applyMatrix4(this.rotationMatrix)
        this.axisRoll.applyMatrix4(this.rotationMatrix)
        this.rotateOnWorldAxis(this.axisYaw, impulse)
    }

    // pursuitCamera() {
    //     this.invertedCamera = -1
    // }

    // chaseCamera() {
    //     this.invertedCamera = 1
    // }
}