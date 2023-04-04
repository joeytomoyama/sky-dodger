import * as THREE from 'three'
import { PerspectiveCamera, Quaternion, Vector3 } from 'three'
// import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
// import { Face } from 'three/examples/jsm/math/ConvexHull'

export default class Ship {
    public speed
    private maxSpeed: number
    private position = new Vector3(0, 0, 0)
    public axisRoll = new Vector3(0, 0, -1)
    private axisPitch = new Vector3(1, 0, 0)
    // private directionUp = new Vector3(0, 1, 0)
    public arrowHelperRoll = new THREE.ArrowHelper(this.axisRoll.normalize(), this.position, 5, 'red');
    // public arrowHelperUp = new THREE.ArrowHelper(this.directionUp.normalize(), this.position, 5, 'white');
    public arrowHelperPitch = new THREE.ArrowHelper(this.axisPitch.normalize(), this.position, 5, 'blue');

    // private xAxis = new THREE.Vector3(1, 0, 0);
    // private yAxis = new THREE.Vector3(0, 1, 0);
    // private zAxis = new THREE.Vector3(0, 0, 1);
    private matrix = new THREE.Matrix4()

    private boxGeo = new THREE.BoxGeometry(10, 10, 10)
    private box = new THREE.Mesh(this.boxGeo, new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true } ))

    private geo = new THREE.TetrahedronGeometry(5)
    private mesh = new THREE.Mesh(this.geo, new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true } ))
    .rotateOnWorldAxis(new Vector3(0, 1, 0), Math.PI / 4)
    .rotateOnWorldAxis(new Vector3(1, 0, 0), Math.PI / 5)
    public model = new THREE.Object3D().add(this.mesh)//.add(this.arrowHelperRoll);//.add(this.box)//.add(this.axisRoll)

    private camera: PerspectiveCamera

    constructor(maxSpeed: number, camera: PerspectiveCamera) {
        this.speed = 0
        this.maxSpeed = maxSpeed
        this.camera = camera
        this.model.scale.set(0.7, 0.3, 1)
    }

    updateSpeed(isAccelerating: boolean) {
        this.speed = isAccelerating ? Math.min(this.maxSpeed, this.speed + 0.1) : Math.max(0, this.speed - 0.1)
    }

    updatePosition() {
        this.model.position.x += this.axisRoll.x * this.speed / 50
        this.model.position.y += this.axisRoll.y * this.speed / 50
        this.model.position.z += this.axisRoll.z * this.speed / 50
        console.log(this.model.rotation.x.toFixed(2), this.model.rotation.y.toFixed(2), this.model.rotation.z.toFixed(2))

        // this.model.position.z -= this.speed / 100

        // console.log(this.axisRoll.x.toFixed(2), this.axisRoll.y.toFixed(2), this.axisRoll.z.toFixed(2));

        // console.log("axis :", this.axisPitch.x.toFixed(2), this.axisPitch.y.toFixed(2), this.axisPitch.z.toFixed(2))
        // console.log((Math.atan2(this.axisPitch.x, this.axisPitch.y) * (180 / Math.PI)) - 90)
        // console.log("model:", this.model.rotation.x.toFixed(2), this.model.rotation.y.toFixed(2), this.model.rotation.z.toFixed(2))
        // console.log("\n")
    }

    rollRight(impulse: number) {
        // const forwardDirection = new THREE.Vector3(0, 0, -1);
        // forwardDirection.applyEuler(new THREE.Euler(Math.PI / 2, Math.PI / 2, Math.PI / 2));
        // console.log(forwardDirection)

        // this.model.rotation.z -= impulse / 100

        this.matrix.makeRotationAxis(this.axisRoll, impulse / 100)
        this.axisPitch.applyMatrix4(this.matrix)
        this.arrowHelperPitch.setDirection(this.axisPitch)

        // const quaternion = new THREE.Quaternion()
        // quaternion.setFromRotationMatrix(this.matrix)
        // this.model.quaternion.multiply(quaternion)
        
        // this.model.applyMatrix4(this.matrix)

        this.model.rotateOnWorldAxis(this.axisRoll, impulse / 100)
        // this.camera.rotateOnWorldAxis(this.axisRoll, impulse / 100)

        // this.model.rotation.z = this.axisPitch.x
    }

    rollLeft(impulse: number) {
        // this.model.rotation.z -= impulse / 100

        this.matrix.makeRotationAxis(this.axisRoll, impulse / 100)
        this.axisPitch.applyMatrix4(this.matrix)
        this.arrowHelperPitch.setDirection(this.axisPitch)

        // const quaternion = new THREE.Quaternion()
        // quaternion.setFromRotationMatrix(this.matrix)
        // this.model.quaternion.multiply(quaternion)
        
        // this.model.applyMatrix4(this.matrix)

        this.model.rotateOnWorldAxis(this.axisRoll, impulse / 100)
        // this.camera.rotateOnWorldAxis(this.axisRoll, impulse / 100)

        // this.model.rotation.z = this.axisPitch.x
    }

    pitchUp(impulse: number) {
        // this.model.rotation.x += impulse / 100

        this.matrix.makeRotationAxis(this.axisPitch, impulse / 100)
        this.axisRoll.applyMatrix4(this.matrix)
        this.arrowHelperRoll.setDirection(this.axisRoll)
        
        // const quaternion = new THREE.Quaternion()
        // quaternion.setFromRotationMatrix(this.matrix)
        // this.model.quaternion.multiply(quaternion)
        
        // this.model.applyMatrix4(this.matrix)

        this.model.rotateOnWorldAxis(this.axisPitch, impulse / 100)
        // this.camera.lookAt(this.model.position)

        // this.model.rotation.x = this.axisRoll.x
    }

    pitchDown(impulse: number) {
        // this.model.rotation.x += impulse / 100

        this.matrix.makeRotationAxis(this.axisPitch, impulse / 100)
        this.axisRoll.applyMatrix4(this.matrix)
        this.arrowHelperRoll.setDirection(this.axisRoll)
        
        // const quaternion = new THREE.Quaternion()
        // quaternion.setFromRotationMatrix(this.matrix)
        // this.model.quaternion.multiply(quaternion)
        
        // this.model.applyMatrix4(this.matrix)

        this.model.rotateOnWorldAxis(this.axisPitch, impulse / 100)
        // this.camera.lookAt(this.model.position)

        // this.model.rotation.x = this.axisRoll.x
    }

}