import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
//import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
//import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';

import * as YUKA from 'yuka';
//import * as dat from 'dat.gui';

//--------------------------

const gui = new dat.GUI();
const options = {
    angle: 0.4,
    penumbra: 0.8,
    intensity: 0.5,
    size: 0.1,
    LightX: 0,
    LightY: 50,
    LightZ: 0,
    maxSpeed: 5
};
gui.add(options, 'angle', 0.01, 1);
// (add other GUI controls as needed)

gui.add(options, 'penumbra', 0.01, 1);
gui.add(options, 'intensity', 0.01, 1);
gui.add(options, 'size', 0.01, 1);
gui.add(options, 'LightX', -100, 100);
gui.add(options, 'LightY', 50, 100);
gui.add(options, 'LightZ', -100, 100);
gui.add(options, 'maxSpeed', 1, 50);

//--------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x150016);
scene.fog = new THREE.Fog(0xffffff, 0, 1000);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

//--------------------------
/*

class ThirdPersonCamera {
    constructor(params) {
        this._params = params;
        this._camera = params.camera;
        
        this._currentPosition = new THREE.Vector3();
        this._currentLookAt = new THREE.Vector3();
    }
    
    CaculateIdealOffset() {
        const idealOffset = new THREE.Vector3(5, 5, 5);
        idealOffset.applyQuaternion(this._params.target.Rotation);
        idealOffset.add(this._params.target.Rotation);
        return idealOffset;
    }
    
    CaculateIdealLookAt() {
        const idealLookAt = new THREE.Vector3(0, 0, 0);
        idealLookAt.applyQuaternion(this._params.target.Rotation);
        idealLookAt.add(this._params.target.otation);
        return idealLookAt;
    }
    
    Update(timeElapsed) {
        const idealOffset = this.CaculateIdealOffset();
        const idealLookAt = this.CaculateIdealLookAt();
        
        this._currentPosition.copy(idealOffset);
        this._currentLookAt.copy(idealLookAt);
        
        this._camera.position.copy(this._currentPosition);
        this._camera.lookAt(this._currentLookAt);
    }
}


class ThirdPersonCamera {
    constructor(params) {
        this._params = params;
        this._camera = params.camera;

        // Chỉnh sửa: Thêm offset và lookAt để theo dõi vật
        this._offset = new THREE.Vector3(0, 5, -5);
        this._lookAt = new THREE.Vector3();
    }

    Update(timeElapsed) {
        // Lấy vị trí và quay của vật
        const targetPosition = this._params.target.position;

        // Chỉnh sửa: Cập nhật vị trí và hướng nhìn của camera
        const offset = this._offset.clone().applyQuaternion(this._params.target.rotation);
        const newPosition = new THREE.Vector3().copy(targetPosition).add(offset);
        this._camera.position.lerp(newPosition, 0.1); // Tính toán vị trí mới một cách mượt mà

        this._lookAt.copy(targetPosition);
        this._camera.lookAt(this._lookAt);
    }
}
*/

class ThirdPersonCamera {

    constructor(params) {

        this._params = params;
        this._camera = params.camera;
        
        this._currentPosition = new THREE.Vector3();
        this._currentLookAt = new THREE.Vector3();
    }
    
    CaculateIdealOffset() {
        const idealOffset = new THREE.Vector3(30, -15, 5);
        idealOffset.applyQuaternion(this._params.target.Rotation);
        idealOffset.add(this._params.target.Position);
        return idealOffset;
    }
    
    CaculateIdealLookAt() {
        const idealLookAt = new THREE.Vector3(0, 0, 0);
        idealLookAt.applyQuaternion(this._params.target.Rotation);
        idealLookAt.add(this._params.target.Position);
        return idealLookAt;
    }
    
    Update(timeElapsed) {
        const idealOffset = this.CaculateIdealOffset();
        const idealLookAt = this.CaculateIdealLookAt();
        
        this._currentPosition.copy(idealOffset);
        this._currentLookAt.copy(idealLookAt);
        
        this._camera.position.copy(this._currentPosition);
        this._camera.lookAt(this._currentLookAt);
    }
}
//--------------------------
//tọa độ camera
window.addEventListener('deviceorientation',function(e){
    const x = Math.min(Math.max(Math.round(e.beta/2), -50), 50);
    const z = Math.min(Math.max(Math.round(e.gamma/2), -50), 50);
    const y = Math.min(Math.max(Math.round(e.alpha/2), 0), 50);
    
    //camera.position.set(x, y, z);
});
//camera.position.set(2, 30, 30);

/*this._thirdPersonCamera = new ThirdPersonCamera({
    camera: this._camera,
});*/
        
//khử  răng cưa
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;

//controls.autoRotate = true;
//controls.autoRotateSpee = 10;
//-------------

const FPcontrols = new FirstPersonControls(camera, renderer.domElement);
FPcontrols.movementSpeed = 1;
FPcontrols.lookSpeed = 0.1;
FPcontrols.lookVertical = true;



//const PLControls = new PointerLockControls(camera, renderer.domElement);

//const FControl = new FlyControls(camera, renderer.domElement);



//light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);

spotLight.castShadow = true;
spotLight.angle = 0.2;
spotLight.penumbra = 0.5;
spotLight.intensity = 0.4;

const light = new THREE.PointLight(0xffffff, 10, 100);
light.position.y = 100;
scene.add(light);

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);
//-------------

const pGeo = new THREE.PlaneGeometry(50, 50);
const pMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    //roughness: 0,
    //metalness: 0.50,
    side: THREE.DoubleSide
});
const pMesh= new THREE.Mesh(pGeo, pMat);
scene.add(pMesh);
pMesh.rotation.x = -0.5 * Math.PI;
pMesh.receiveShadow = true;



const sGeo = new THREE.SphereGeometry(5, 50, 50);
const sMat = new THREE.MeshStandardMaterial({
    color: 0x453785,
    wireframe: false,
    roughness: 0,
    metalness: 0.2
    
});
const sMesh = new THREE.Mesh(sGeo, sMat);
//scene.add(sMesh);
sMesh.position.set(0, 10, 0);
sMesh.castShadow = true;

//--------------------------
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

// Đặt kích thước cho canvas
canvas.width = 128;
canvas.height = 128;

//context.clearRect(0, 0, canvas.width, canvas.height);

// Vẽ một hình tròn đen trên nền trắng
context.fillStyle = 'white';
context.beginPath();
context.arc(64, 64, 60, 0, Math.PI * 2);
context.closePath();
context.fill();

// Tạo một texture từ canvas
const particleTexture = new THREE.CanvasTexture(canvas);
//particleTexture.premultiplyAlpha = true;


const particlesGeometry = new THREE.SphereGeometry(5, 50, 50);
const particlesMaterial = new THREE.PointsMaterial({
    color: 0x64755f,
    //size: 0.2,
    sizeAttenuation: true,
    map: particleTexture,
    //blending: THREE.AdditiveBlending,
    transparent: true,
    alphaTest: 0.5,
    depthWrite: true,
    //opacity: 0.2
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
//scene.add(particles);
particles.position.set(0, 7, 0);
particles.castShadow = true;

//--------------------------

const entityManager = new YUKA.EntityManager();

function sync(entity, renderComponent) {
    renderComponent.matrix.copy(entity.worldMatrix);
}

const times = new YUKA.Time();
const clock = new THREE.Clock(true);


const quaternion = new THREE.Quaternion();
quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 4);

//-------------
//Behavior

const alignmentBehavior = new YUKA.AlignmentBehavior();

const cohesionBehavior = new YUKA.CohesionBehavior();

const separationBehavior = new YUKA.SeparationBehavior();

//-------------
const vehicleGeo = new THREE.ConeBufferGeometry(0.2, 1, 20);
vehicleGeo.rotateX(Math.PI * 0.5);
vehicleGeo.computeBoundingSphere();
const vehicleMat = new THREE.MeshNormalMaterial({});
const vehicleMesh = new THREE.Mesh(vehicleGeo, vehicleMat);
scene.add(vehicleMesh);
vehicleMesh.matrixAutoUpdate = false;
vehicleMesh.castShadow = true;


const vehicle = new YUKA.Vehicle();
vehicle.setRenderComponent(vehicleMesh, sync);
vehicle.boundingRadius = vehicleGeo.boundingSphere.radius;
//vehicle.position.set(5, 0, 6);

entityManager.add(vehicle);



const vehMesh = new THREE.Mesh(vehicleGeo, vehicleMat);
scene.add(vehMesh);
vehMesh.matrixAutoUpdate = false;
vehMesh.castShadow = true;


const veh = new YUKA.Vehicle();
veh.setRenderComponent(vehMesh, sync);
veh.boundingRadius = vehicleGeo.boundingSphere.radius;
//vehicle.position.set(5, 0, 6);

entityManager.add(veh);


/*
const path = new YUKA.Path();
path.add( new YUKA.Vector3(-4, 4, 4));
path.add( new YUKA.Vector3(-6, 3, 0));
path.add( new YUKA.Vector3(-4, 2, -4));
path.add( new YUKA.Vector3(0, 3, 0));
path.add( new YUKA.Vector3(4, 1, -4));
path.add( new YUKA.Vector3(6, 2, 0));
path.add( new YUKA.Vector3(4, 4, 4));
path.add( new YUKA.Vector3(0, 4, 6));
path.loop = true;
vehicle.position.copy(path.current());

const followPathBehavior = new YUKA.FollowPathBehavior(path, 1);
vehicle.steering.add(followPathBehavior);
*/


const obstacles = [];

for(let t = 0; t <100; t++) {
const obstacleGeometry = new THREE.SphereGeometry(0.5);
obstacleGeometry.computeBoundingSphere();
const obstacleMaterial = new THREE.MeshPhongMaterial({color: 0xee0808});

const obstacleMesh = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
scene.add(obstacleMesh);
obstacleMesh.position.set((Math.random()*21)-10, Math.random()*20, (Math.random()*21)-10);
obstacleMesh.castShadow = true;
obstacleMesh.receiveShadow = true;
//obstacleMesh.position.set(5, 0, 0);

const obstacle = new YUKA.GameEntity();
obstacle.position.copy(obstacleMesh.position);
entityManager.add(obstacle);
obstacle.boundingRadius = obstacleGeometry.boundingSphere.radius;


obstacles.push(obstacle);
}
const obstacleAvoidanceBehavior = new YUKA.ObstacleAvoidanceBehavior(obstacles);
vehicle.steering.add(obstacleAvoidanceBehavior);


//--------------------------
const targetGeo = new THREE.SphereGeometry(0.1);
const targetMat = new THREE.MeshNormalMaterial({});
const targetMesh = new THREE.Mesh(targetGeo, targetMat);
scene.add(targetMesh);
targetMesh.matrixAutoUpdate = false;

const target = new YUKA.GameEntity();
target.setRenderComponent(targetMesh, sync);
entityManager.add(target);

//Behavior
const seekBehavior = new YUKA.SeekBehavior(target.position, 0.5);

const arriveBehavior = new YUKA.ArriveBehavior(target.position, 3, 1);
//--------------------------
const sBehavior = new YUKA.SeekBehavior(veh.position, 0.5);

const aBehavior = new YUKA.ArriveBehavior(veh.position, 3, 1);
//--------------------------

veh.steering.add(seekBehavior);
veh.steering.add(arriveBehavior);

vehicle.steering.add(sBehavior);
vehicle.steering.add(aBehavior);
vehicle.steering.add(alignmentBehavior);
vehicle.steering.add(cohesionBehavior);
vehicle.steering.add(separationBehavior);




setInterval(function() {
    const x = (Math.random() * 31) - 15;
    const y = Math.random() * 21;
    const z = (Math.random() * 31) - 15;
    const v = Math.random() * 15;
    
    target.position.set(x, y, z);
}, 2000);
//-------------



for(let i=0; i<0; i++) {
    const fvClone = vehicleMesh.clone();
    scene.add(fvClone);
    
    const veh = new YUKA.Vehicle();
    veh.setRenderComponent(fvClone, sync);
    veh.boundingRadius = vehicleGeo.boundingSphere.radius;
    
    entityManager.add(veh);
    
    //const offsetPursuiBehavior = new YUKA.OffsetPursuiBehavior(vehicle, new YUKA.Vector3(Math.random()*5, Math.random()*5, Math.random()*5));
    
    //const sBehavior = new YUKA.SeekBehavior(target.position, 3, 1);
    //veh.steering.add(offsetPursuiBehavior);
    veh.steering.add(seekBehavior);
    veh.steering.add(arriveBehavior);
    veh.steering.add(alignmentBehavior); //dải
    veh.steering.add(cohesionBehavior); // lớp có delay
    veh.steering.add(separationBehavior); //hội tụ delay cao

    
    //veh.position.set((Math.random() * 11) - 5, (Math.random() * 11) - 5, (Math.random() * 11) - 5);
    fvClone.position.set(5, 6, 0);
    
    veh.maxSpeed = (Math.random() * 10)+5;
    
}
    
//-------------
/*
vehicle.maxSpeed = 4;

const onPathBehavior = new YUKA.OnPathBehavior(path);
onPathBehavior.radius = 5;
vehicle.steering.add(onPathBehavior);

const position = [];

for(let i = 0; i < path._waypoints.length; i++) {
    const waypoint = path._waypoints[i];
    position.push(waypoint.x, waypoint.y, waypoint.z);
}

const lineGeometry = new THREE.BufferGeometry();
lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));

const lineMaterial = new THREE.LineBasicMaterial({color: 0xFFFFFF});
const lines = new THREE.LineLoop(lineGeometry, lineMaterial);
scene.add(lines);
*/
//-------------

const targetControls = new THREE.Vector3();
const vectorTG = new THREE.Vector3();
const circleControls = new THREE.Vector2();
vehicle.position.set(10, 0, 0);
vectorTG.copy(vehicle.position);
//console.log(vectorTG);
//--------------------------
/*setInterval(function() {
    //targetControls.copy(veh.position);
    
    //controls.target = targetControls.copy(veh.position);
    //camera.position.set(vectorTG.x + 5, vectorTG.y + 5, vectorTG.z);
    //camera.lookAt(targetControls.x, targetControls.y, targetControls.z);
    //camera.attach(vehicleMesh);
    
    // Lấy góc quay hiện tại của vật thể
    const phi = vectorTG.y;
    
    const theta = Math.PI / 4;

    // Tính toán khoảng cách giữa camera và vật thể
    const distance = 5;

    // Tính toán tọa độ x và z của camera theo công thức hình tròn
    const x = distance * Math.sin(phi) * Math.sin(theta);
    const z = distance * Math.sin(phi) * Math.sin(theta);
    const y = Math.abs(distance * Math.cos(phi)) + vectorTG.y ;
    console.log (x, y, z)

    // Đặt camera ở tọa độ mới và nhìn về phía vật thể
    camera.position.set(x, y, z);
    
}, 1);*/

function animation(time) {
    controls.update(clock.getDelta());
    //FPcontrols.update(clock.getDelta());
    //PLControls.update(time); 
    //FControl.update(time); 
    
    //this._thirdPersonCamera.Update(timeElapsed);
    
    const t = 1.0 * Math.pow(0.001, time);
    
    //camera.applyQuaternion(quaternion); 
    vectorTG.copy(vehicle.position);
    camera.lookAt(vectorTG);
    //camera.lookAt(vectorTG.x, vectorTG.y, vectorTG.z);
    
    const delta = times.update().getDelta();
    entityManager.update(delta);
    
    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    sLightHelper.update();
    particlesMaterial.size = options.size;
    spotLight.position.set(options.LightX, options.LightY, options.LightZ);
    vehicle.maxSpeed = options.maxSpeed;
    veh.maxSpeed = options.maxSpeed + 1;
    
    renderer.render( scene, camera );
}

//--------------------------
//Oxyz
const axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(20, 20);
//scene.add(gridHelper);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});