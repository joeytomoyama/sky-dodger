import * as THREE from 'three'
import { PerspectiveCamera, Vector3 } from 'three'
// import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
// import { Face } from 'three/examples/jsm/math/ConvexHull'

export default class Ship {
    public speed
    private maxSpeed = 15
    private position = new Vector3(0, 0, 0)

    public axisRoll = new Vector3(0, 0, -1)
    public axisYaw = new Vector3(0, 1, 0)
    public axisPitch = new Vector3(1, 0, 0)

    public arrowHelperRoll = new THREE.ArrowHelper(this.axisRoll.normalize(), this.position, 5, 'red');
    public arrowHelperYaw = new THREE.ArrowHelper(this.axisYaw.normalize(), this.position, 5, 'green');
    public arrowHelperPitch = new THREE.ArrowHelper(this.axisPitch.normalize(), this.position, 5, 'blue');
    
    private matrix = new THREE.Matrix4()

    private boxGeo = new THREE.BoxGeometry(10, 10, 10)
    private box = new THREE.Mesh(this.boxGeo, new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true } ))

    private geo = new THREE.TetrahedronGeometry(5)
    private mesh = new THREE.Mesh(this.geo, new THREE.MeshStandardMaterial( {color: 'grey', wireframe: false } )) //0xFF6347
    .rotateOnWorldAxis(new Vector3(0, 1, 0), Math.PI / 4)
    .rotateOnWorldAxis(new Vector3(1, 0, 0), Math.PI / 5)
    public model = new THREE.Object3D().add(this.mesh)//.add(this.arrowHelperRoll);//.add(this.box)//.add(this.axisRoll)

    private camera: PerspectiveCamera

    constructor(camera: PerspectiveCamera) {
        this.speed = 0
        this.camera = camera
        this.model.scale.set(1.5, 0.2, 1.5)
    }

    updateSpeed(isAccelerating: boolean) {
        this.speed = isAccelerating ? Math.min(this.maxSpeed, this.speed + 0.01) : Math.max(0.3, this.speed - 0.01)
    }

    updatePosition() {
        this.model.position.x += this.axisRoll.x * this.speed
        this.model.position.y += this.axisRoll.y * this.speed
        this.model.position.z += this.axisRoll.z * this.speed
        // console.log(this.model.rotation.x.toFixed(2), this.model.rotation.y.toFixed(2), this.model.rotation.z.toFixed(2))

        // this.model.position.z -= this.speed / 100

        // console.log(this.axisRoll.x.toFixed(2), this.axisRoll.y.toFixed(2), this.axisRoll.z.toFixed(2));

        // console.log("axis :", this.axisPitch.x.toFixed(2), this.axisPitch.y.toFixed(2), this.axisPitch.z.toFixed(2))
        // console.log((Math.atan2(this.axisPitch.x, this.axisPitch.y) * (180 / Math.PI)) - 90)
        // console.log("model:", this.model.rotation.x.toFixed(2), this.model.rotation.y.toFixed(2), this.model.rotation.z.toFixed(2))
        // console.log("\n")
    }

    updateYaw() {
        this.axisYaw = this.axisYaw.crossVectors(this.axisPitch, this.axisRoll)//this.axisRoll.dot(this.axisPitch)
        this.arrowHelperYaw.setDirection(this.axisYaw)
    }

    rollRight(impulse: number) {
        // if (impulse > 2.2) impulse = 2.2
        // const forwardDirection = new THREE.Vector3(0, 0, -1);
        // forwardDirection.applyEuler(new THREE.Euler(Math.PI / 2, Math.PI / 2, Math.PI / 2));
        // console.log(forwardDirection)

        // this.model.rotation.z -= impulse

        this.matrix.makeRotationAxis(this.axisRoll, impulse)
        this.axisPitch.applyMatrix4(this.matrix)
        this.arrowHelperPitch.setDirection(this.axisPitch)

        // const quaternion = new THREE.Quaternion()
        // quaternion.setFromRotationMatrix(this.matrix)
        // this.model.quaternion.multiply(quaternion)
        
        // this.model.applyMatrix4(this.matrix)

        this.model.rotateOnWorldAxis(this.axisRoll, impulse)
        // this.camera.rotateOnWorldAxis(this.axisRoll, impulse)

        // this.model.rotation.z = this.axisPitch.x
        this.updateYaw()
    }

    rollLeft(impulse: number) {
        // if (impulse < 2.2) impulse = -2.2
        // this.model.rotation.z -= impulse

        this.matrix.makeRotationAxis(this.axisRoll, impulse)
        this.axisPitch.applyMatrix4(this.matrix)
        this.arrowHelperPitch.setDirection(this.axisPitch)

        // const quaternion = new THREE.Quaternion()
        // quaternion.setFromRotationMatrix(this.matrix)
        // this.model.quaternion.multiply(quaternion)
        
        // this.model.applyMatrix4(this.matrix)

        this.model.rotateOnWorldAxis(this.axisRoll, impulse)
        // this.camera.rotateOnWorldAxis(this.axisRoll, impulse)

        // this.model.rotation.z = this.axisPitch.x
        this.updateYaw()
    }

    pitchUp(impulse: number) {
        // if (impulse > 4.2) impulse = 4.2
        // this.model.rotation.x += impulse

        this.matrix.makeRotationAxis(this.axisPitch, impulse)
        this.axisRoll.applyMatrix4(this.matrix)
        this.arrowHelperRoll.setDirection(this.axisRoll)
        
        // const quaternion = new THREE.Quaternion()
        // quaternion.setFromRotationMatrix(this.matrix)
        // this.model.quaternion.multiply(quaternion)
        
        // this.model.applyMatrix4(this.matrix)

        this.model.rotateOnWorldAxis(this.axisPitch, impulse)
        // this.camera.lookAt(this.model.position)

        // this.model.rotation.x = this.axisRoll.x
        this.updateYaw()
    }

    pitchDown(impulse: number) {
        // if (impulse < 4.2) impulse = -4.2
        // this.model.rotation.x += impulse

        this.matrix.makeRotationAxis(this.axisPitch, impulse)
        this.axisRoll.applyMatrix4(this.matrix)
        this.arrowHelperRoll.setDirection(this.axisRoll)
        
        // const quaternion = new THREE.Quaternion()
        // quaternion.setFromRotationMatrix(this.matrix)
        // this.model.quaternion.multiply(quaternion)
        
        // this.model.applyMatrix4(this.matrix)

        this.model.rotateOnWorldAxis(this.axisPitch, impulse)
        // this.camera.lookAt(this.model.position)

        // this.model.rotation.x = this.axisRoll.x
        this.updateYaw()
    }

}