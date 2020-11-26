'use strict'
import {create, replaceLineBreaks} from '../../utils/trix';
import '../../../styles/model-text-3d.scss';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {gsap} from 'gsap';

export default class ModelText3D{
    constructor(el, container){
        // console.log('basic txt construct');
        this.element = el;
        this.container = container;
        this.build();
    }
    build(){
        this.wrapper = create('div', this.container, 'scroll-animation-container');
        this.wrapper.classList.add('model-text-3d');
        // this.fixedContent = create('div', this.wrapper, 'fixed-content');
        this.scrollContent = create('div', this.wrapper, 'scroll-content');

        this.sceneContent = create('div', this.scrollContent, 'scene-content');

        this.canvas = create('canvas', this.sceneContent, 'canvas-element');
        this.ctx = this.canvas.getContext('webgl');

        this.canvas.width = 2000;
        this.canvas.height = 1000;

        this.build3D();
        this.setupTimeline();

        // this.textContent = create('div', this.scrollContent, 'text-content');
        // this.textContent.innerHTML = this.formatText(this.element.text);
    }
    setupTimeline(){
        const to = {}
        this.timeline = gsap.timeline({
            paused:true,
            scrollTrigger:{
                scrub:true,
                trigger:this.scrollContent,
                // pin:true,
                // markers:true,
                // start:'top top',
                // end:'+=210%'
            },
            onUpdate:()=>{
                // console.log('middle update', this.tl.time(), this.tl.progress());
                // this.zoom.render(this.tl);
                this.camera.lookAt(1, 1.3, 0);
                // this.renderer.render(this.scene, this.camera);
            }
            

        });
        this.timeline.to(this.camera.position, {y:.5, ease:'none'})
    }
    build3D(){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('hsl(180, 1%, 2%)');
        // console.log('scene', scene);
        // const context = this.ctx;
        this.renderer = new THREE.WebGLRenderer({
            context:this.ctx
        });
        // console.log(this.renderer.getContext())
        // WebGL background color
        // this.renderer.setClearColor('hsl(0, 0%, 60%)', 0);
        this.renderer.setSize(this.canvas.width, this.canvas.height);
        // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // this.renderer.shadowMap.enabled = true;
        
        // Setup a camera
        // const camera = new THREE.OrthographicCamera();
        this.camera = new THREE.PerspectiveCamera(40, this.canvas.width / this.canvas.height, 0.1, 100);
        this.camera.position.z = 7;
        this.camera.position.x = -3;
        this.camera.position.y = 4;
        
        this.scene.add(this.camera);

        this.scene.add(new THREE.AmbientLight('hsl(180, 5%, 40%)'));
        let d_light = new THREE.PointLight( 0xffffff, 1, 0, 2);
        
        // d_light.castShadow = true;
        d_light.position.set( -10, 15, 12 );
        d_light.shadow.mapSize.height = 1024; // default   
        d_light.shadow.mapSize.width = 1024; // default
        
        this.scene.add(d_light);

        const loader = new GLTFLoader();

        const localScene = this.scene;

        loader.load( process.env.EXTERNAL_ASSETS_PATH + 'df-2.glb', function ( gltf ) {

	    localScene.add( gltf.scene );

        }, undefined, function ( error ) {

        console.error( error );

        } );

        // console.log('render', this.camera)
        
        this.renderer.render(this.scene, this.camera);

        const render = ()=>{
            // controls.update();
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(render);
        }
        render();
    }
    formatText(t){
        t = replaceLineBreaks(t);
        return t;
    }
}