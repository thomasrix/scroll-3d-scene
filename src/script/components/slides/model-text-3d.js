'use strict'
import {create, replaceLineBreaks, lerp, normalize} from '../../utils/trix';
import '../../../styles/model-text-3d.scss';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

export default class ModelText3D{
    constructor(el, container){
        // console.log('basic txt construct');
        this.element = el;
        this.container = container;
        this.build();
    }
    build(){
        this.to = {
            y:5,
            a:1,
            z:12
        }
        this.wrapper = create('div', this.container, 'scroll-animation-container');
        this.wrapper.classList.add('model-text-3d');
        // this.fixedContent = create('div', this.wrapper, 'fixed-content');
        this.scrollContent = create('div', this.wrapper, 'scroll-content');

        this.sceneContent = create('div', this.scrollContent, 'scene-content');

        
        this.canvas = create('canvas', this.sceneContent, 'canvas-element');
        this.ctx = this.canvas.getContext('webgl');

        this.query = window.matchMedia('(max-width: 767px)');
        // console.log('listener', this.query.addEventListener);
        if(this.query.addEventListener === undefined || this.query.addEventListener === null){
            this.query.addListener(this.querySwitch.bind(this));
        }else{
            this.query.addEventListener('change', this.querySwitch.bind(this));
        }
        this.querySwitch(this.query);
        

        this.build3D();
        this.setupTimeline();
        
        this.sceneContent.addEventListener('mousedown', this.startRotating.bind(this));
        this.sceneContent.addEventListener('mouseup', this.stopRotating.bind(this));
        // this.sceneContent.addEventListener('mouseenter', this.startRotating.bind(this));
        this.sceneContent.addEventListener('mouseleave', this.stopRotating.bind(this));

        this.sceneContent.addEventListener('touchstart', this.startRotating.bind(this));
        this.sceneContent.addEventListener('touchend', this.stopRotating.bind(this));

        this.boundRotate = this.rotateScene.bind(this);
        // this.textContent = create('div', this.scrollContent, 'text-content');
        // this.textContent.innerHTML = this.formatText(this.element.text);
    }
    querySwitch(q){
        console.log('switch', q.matches);
        if(q.matches){
            this.canvas.width = 2000;
            this.canvas.height = 2000;
        }else{
            this.canvas.width = 2000;
            this.canvas.height = 1000;
        }
        if(this.renderer!==undefined){
            this.camera.aspect = this.canvas.width / this.canvas.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.canvas.width, this.canvas.height);
            // console.log('switch render:');
            // ScrollTrigger.refresh();
            // this.renderer.render(this.scene, this.camera);
        }
    }
    startRotating(e){
        console.log('start rotating');
        this.deltaX = (e.type == 'touchstart') ? e.touches[0].clientX : e.clientX;
        this.sceneContent.addEventListener('mousemove', this.boundRotate);
        this.sceneContent.addEventListener('touchmove', this.boundRotate);
    }
    stopRotating(){
        console.log('stop rotating');
        this.sceneContent.removeEventListener('mousemove', this.boundRotate);
        this.sceneContent.removeEventListener('touchmove', this.boundRotate);
    }
    rotateScene(e){
        const ex = (e.type == 'touchmove') ? e.touches[0].clientX : e.clientX;
        // console.log(ex);
        const r = (ex - this.deltaX) / this.sceneContent.getBoundingClientRect().width;
        // console.log(r);
        this.deltaX = ex;
        this.rotationObject.rotation.y += r;
    }
    moveCameraSideways(e){
        // console.log('move', e.clientX);
        const normPos = e.clientX / this.sceneContent.getBoundingClientRect().width;
        const x = lerp(normalize(e.clientX, 0, this.sceneContent.getBoundingClientRect().width), 3, -3);
        console.log(x);
        this.camera.position.x = x;
        this.camera.lookAt(1, this.to.a, 0);
        // this.renderer.render(this.scene, this.camera);

    }

    setupTimeline(){
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.matchMedia({
            '(max-width: 767px)':()=>{
                this.timeline = gsap.timeline({
                    paused:true,
                    scrollTrigger:{
                        scrub:true,
                        trigger:this.scrollContent,
                        onEnter:this.startAnimating.bind(this),
                        onLeave:this.stopAnimating.bind(this),
                        onEnterBack:this.startAnimating.bind(this),
                        onLeaveBack:this.stopAnimating.bind(this),
                    },
                    onUpdate:()=>{
                        this.camera.position.y = this.to.y;
                        this.camera.position.z = this.to.z;
                        this.camera.lookAt(1, this.to.a, 0);
                    }
                });
                this.timeline.to(this.to, {y:1.5, a:2.8, z:13, ease:'none'});
                ScrollTrigger.refresh();
                this.camera.position.y = this.to.y;
                this.camera.position.z = this.to.z;
                this.camera.lookAt(1, this.to.a, 0);
            },
            '(min-width: 768px)':()=>{
                this.timeline = gsap.timeline({
                    paused:true,
                    scrollTrigger:{
                        scrub:true,
                        trigger:this.scrollContent,
                        onEnter:this.startAnimating.bind(this),
                        onLeave:this.stopAnimating.bind(this),
                        onEnterBack:this.startAnimating.bind(this),
                        onLeaveBack:this.stopAnimating.bind(this),
                    },
                    onUpdate:()=>{
                        this.camera.position.y = this.to.y;
                        this.camera.position.z = this.to.z;
                        this.camera.lookAt(1, this.to.a, 0);
                    }
                });
                this.timeline.to(this.to, {y:1.5, a:2.5, z:13, ease:'none'});
                // console.log(this.timeline.time());
                ScrollTrigger.refresh();
                this.camera.position.y = this.to.y;
                this.camera.position.z = this.to.z;
                this.camera.lookAt(1, this.to.a, 0);
            }
        })
    }
    startAnimating(){
        console.log('start animating');
        // this.render();
        const render = ()=>{
            // console.log('r')
            this.renderer.render(this.scene, this.camera);
            this.reqID = requestAnimationFrame(render);
        }
        render();
    }
    stopAnimating(){
        console.log('stop animating', this.reqID);
        cancelAnimationFrame(this.reqID)
    }
    build3D(){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('hsl(180, 1%, 3%)');
        // console.log('scene', scene);
        // const context = this.ctx;
        this.renderer = new THREE.WebGLRenderer({
            context:this.ctx
        });
        // const axesHelper = new THREE.AxesHelper( 5 );
        // this.scene.add( axesHelper );
        // console.log(this.renderer.getContext())
        // WebGL background color
        // this.renderer.setClearColor('hsl(0, 0%, 60%)', 0);
        this.renderer.setSize(this.canvas.width, this.canvas.height);
        // this.renderer.antialias = true;
        // this.renderer.physicallyCorrectLights = true;
        // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // this.renderer.shadowMap.enabled = true;
        
        // Setup a camera
        // const camera = new THREE.OrthographicCamera();
        this.camera = new THREE.PerspectiveCamera(40, this.canvas.width / this.canvas.height, 0.1, 1000);
        this.camera.position.z = this.to.z;
        this.camera.position.x = 0;
        this.camera.position.y = this.to.y;
        
        this.scene.add(this.camera);

/*         const controls = new OrbitControls( this.camera, this.canvas );
        controls.enableZoom = false;
        controls.enableDamping = true;
        controls.enablePan = false; */

        this.rotationObject = new THREE.Group();
        this.scene.add(this.rotationObject);

        this.rotationObject.add(new THREE.AmbientLight('#DDDDDD'));

        // let d_light = new THREE.PointLight( 0xffffff, 1, 0, 2);
        let d_light = new THREE.DirectionalLight( 0xeeeeee, 0.5);
        let d_light_2 = new THREE.DirectionalLight( 0xffffff, 0.5);
        
        let d_light_3 = new THREE.DirectionalLight( 0xdddddd, 0.4);
        
        // d_light.castShadow = true;
        d_light.position.set( 3, 3 , 0);
        d_light_2.position.set( 3, 3, 2 );
        d_light_3.position.set( -4, 4, 2 );
        // d_light.shadow.mapSize.height = 1024; // default   
        // d_light.shadow.mapSize.width = 1024; // default
        
        this.rotationObject.add(d_light);
        this.rotationObject.add(d_light_2);
        this.rotationObject.add(d_light_3);

        const loader = new GLTFLoader();

        const localScene = this.rotationObject;

        loader.load( process.env.EXTERNAL_ASSETS_PATH + 'baking-test-04.glb', function ( gltf ) {

            localScene.add( gltf.scene );
            // gltf.scene.scale = 0.9;
            // this.renderer.render(this.scene, this.camera);

        }, undefined, function ( error ) {

        console.error( error );

        } );
        this.rotationObject.rotation.y -= 0.7
        // console.log('render', this.camera)
        
        this.renderer.render(this.scene, this.camera);

    }
    formatText(t){
        t = replaceLineBreaks(t);
        return t;
    }
}