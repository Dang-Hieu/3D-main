import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

import * as YUKA from 'yuka';

class MyThreeJSApp {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.set(2, 30, 30);

        this.clock = new THREE.Clock(true);
        this.time = new YUKA.Time();

        this.setupScene();
        this.setupRenderer();
        this.setupControls();
        this.setupLights();

        this.setupObjects();

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
    }


    animate() {
        this.controls.update(this.clock.getDelta());
        this.renderer.render(this.scene, this.camera);
    }

    grid() {
        this.axesHelper = new THREE.AxesHelper(50);
        this.scene.add(this.axesHelper);
        this.gridHelper = new THREE.GridHelper(20, 20);
        // this.scene.add(this.gridHelper);
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
