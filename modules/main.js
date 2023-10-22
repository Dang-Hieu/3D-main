import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

import * as YUKA from 'yuka';

class ThirdPersonCamera {
    constructor(params) {
        this._params = params;
        this._camera = params.camera;

        this._currentPosition = new THREE.Vector3();
        this._currentLookAt = new THREE.Vector3();
    }

    CalculateIdealOffset() {
        const idealOffset = new THREE.Vector3(5, 5, 5);
        idealOffset.applyQuaternion(this._params.target.rotation);
        idealOffset.add(this._params.target.position);
        return idealOffset;
    }

    CalculateIdealLookAt() {
        const idealLookAt = new THREE.Vector3(0, 0, 0);
        idealLookAt.applyQuaternion(this._params.target.rotation);
        idealLookAt.add(this._params.target.position);
        return idealLookAt;
    }

    Update() {
        const idealOffset = this.CalculateIdealOffset();
        const idealLookAt = this.CalculateIdealLookAt();

        this._currentPosition.copy(idealOffset);
        this._currentLookAt.copy(idealLookAt);

        this._camera.position.copy(this._currentPosition);
        this._camera.lookAt(this._currentLookAt);
    }
}

class MyThreeJSApp {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.camera.position.set(2, 30, 30);

        this.entityManager = new YUKA.EntityManager();
        // this.vehicle = new YUKA.Vehicle();

        this.clock = new THREE.Clock(true);
        this.time = new YUKA.Time();

        this.setupScene();
        this.setupRenderer();
        this.setupControls();
        this.setupLights();

        this.setupObjects();
        this.setupObjectsEntity();

        this.animate();
        this.grid();
        this.setupEventListeners();
    }

    setupScene() {
        this.scene.background = new THREE.Color(0x150016);
        this.scene.fog = new THREE.Fog(0xffffff, 0, 1000);
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setAnimationLoop(this.animate.bind(this));
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
    }

    setupControls() {
        this.controls.enableDamping = true;
        this.controls.enablePan = true;
    }

    setupLights() {
        this.ambientLight = new THREE.AmbientLight(0x333333);
        this.scene.add(this.ambientLight);

        this.spotLight = new THREE.SpotLight(0xFFFFFF);
        this.scene.add(this.spotLight);

        this.spotLight.castShadow = true;
        this.spotLight.angle = 0.2;
        this.spotLight.penumbra = 0.5;
        this.spotLight.intensity = 0.4;
        this.spotLight.position.set(0, 100, 10);

        // this.light = new THREE.PointLight(0xffffff, 10, 100);
        // this.light.position.y = 100;
        // this.scene.add(this.light);

        this.sLightHelper = new THREE.SpotLightHelper(this.spotLight);
        this.scene.add(this.sLightHelper);
    }

    sync(entity, renderComponent) {
        renderComponent.matrix.copy(entity.worldMatrix);
    }



    entityBehavior() {
        this.alignmentBehavior = new YUKA.AlignmentBehavior();
        this.cohesionBehavior = new YUKA.CohesionBehavior();
        this.separationBehavior = new YUKA.SeparationBehavior();
        this.seekBehavior = new YUKA.SeekBehavior(this.target.position, 0.5);
        this.arriveBehavior = new YUKA.ArriveBehavior(this.target.position, 3, 1);
    }

    setupObjects() {
        this.pGeo = new THREE.PlaneGeometry(50, 50);
        this.pMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 1,
            metalness: 0,
            side: THREE.DoubleSide
        });
        this.pMesh= new THREE.Mesh(this.pGeo, this.pMat);
        this.scene.add(this.pMesh);
        this.pMesh.rotation.x = -0.5 * Math.PI;
        this.pMesh.receiveShadow = true;

        this.vehicleGeo = new THREE.ConeBufferGeometry(0.2, 1, 20);
        this.vehicleGeo.rotateX(Math.PI * 0.5);
        this.vehicleGeo.computeBoundingSphere();
        this.vehicleMat = new THREE.MeshNormalMaterial({});
        this.vehicleMesh = new THREE.Mesh(this.vehicleGeo, this.vehicleMat);
        this.scene.add(this.vehicleMesh);
        this.vehicleMesh.matrixAutoUpdate = true;
        this.vehicleMesh.castShadow = true;

        this.targetGeo = new THREE.SphereGeometry(0.1);
        this.targetMat = new THREE.MeshNormalMaterial({});
        this.targetMesh = new THREE.Mesh(this.targetGeo, this.targetMat);
        this.scene.add(this.targetMesh);
        this.targetMesh.matrixAutoUpdate = false;

    }

    setupObjectsEntity() {
        this.vehicle = new YUKA.Vehicle();
        this.vehicle.setRenderComponent(this.vehicleMesh, this.sync);
        this.vehicle.boundingRadius = this.vehicleGeo.boundingSphere.radius;
        this.vehicle.position.set(5, 0, 6);
        this.vehicle.maxSpeed = 10;
        
        this.entityManager.add(this.vehicle);
        

        this.target = new YUKA.GameEntity();
        this.target.setRenderComponent(this.targetMesh, this.sync);
        this.entityManager.add(this.target);

        this.entityBehavior();

        this.vehicle.steering.add(this.seekBehavior)
        this.vehicle.steering.add(this.arriveBehavior);

        this.thirdPersonCamera = new ThirdPersonCamera({
            camera: this.camera,
            target: this.vehicle,
        });

        setInterval(() => {
            const x = (Math.random() * 31) - 15;
            const y = Math.random() * 21;
            const z = (Math.random() * 31) - 15;
            const v = Math.random() * 15;
        
            this.target.position.set(x, y, z);
        }, 2000);
    }

    animate() {
        this.delta = this.time.update().getDelta();
        this.entityManager.update(this.delta);

        this.thirdPersonCamera.Update(this.clock.getDelta()*0.0001);
        
        this.controls.update(this.clock.getDelta());
        this.renderer.render(this.scene, this.camera);
    }

    grid() {
        this.axesHelper = new THREE.AxesHelper(50);
        this.scene.add(this.axesHelper);
        this.gridHelper = new THREE.GridHelper(20, 20);
        //this.scene.add(this.gridHelper);
    }

    setupEventListeners() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

const myApp = new MyThreeJSApp();
