'use strict'
import {create, replaceLineBreaks} from '../../utils/trix';
import '../../../styles/scene-3d.scss';
import * as THREE from 'three';
import {gsap} from 'gsap';

export default class Scene3D{
    constructor(el, container){
        // console.log('basic txt construct');
        this.element = el;
        this.container = container;
        this.build();
    }
    build(){
        this.wrapper = create('div', this.container, 'scroll-animation-container');
        this.wrapper.classList.add('scene-3d');
        // this.fixedContent = create('div', this.wrapper, 'fixed-content');
        this.scrollContent = create('div', this.wrapper, 'scroll-content');

        this.sceneContent = create('div', this.scrollContent, 'scene-content');

        this.canvas = create('canvas', this.sceneContent, 'canvas-element');
        this.ctx = this.canvas.getContext('webgl');

        this.canvas.width = 1000;
        this.canvas.height = 500;

        this.build3D();
        this.setupTimeline();

        // this.textContent = create('div', this.scrollContent, 'text-content');
        // this.textContent.innerHTML = this.formatText(this.element.text);
    }
    setupTimeline(){
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
                this.camera.lookAt(0, 2.3, 0);
                // this.renderer.render(this.scene, this.camera);
            }
            

        });
        this.timeline.to(this.camera.position, {y:.5, ease:'none'})
    }
    build3D(){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('hsl(180, 1%, 85%)');
        // console.log('scene', scene);
        // const context = this.ctx;
        this.renderer = new THREE.WebGLRenderer({
            context:this.ctx
        });
        // console.log(this.renderer.getContext())
        // WebGL background color
        // this.renderer.setClearColor('hsl(0, 0%, 60%)', 0);
        this.renderer.setSize(this.canvas.width, this.canvas.height);
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.shadowMap.enabled = true;
        
        // Setup a camera
        // const camera = new THREE.OrthographicCamera();
        this.camera = new THREE.PerspectiveCamera(40, this.canvas.width / this.canvas.height, 0.1, 100);
        this.camera.position.z = 8;
        this.camera.position.y = 2.8;
        
        this.scene.add(this.camera);

        this.scene.add(new THREE.AmbientLight('hsl(180, 20%, 90%)'));
        let d_light = new THREE.PointLight( 0xffffff, 1, 0, 2);
        
        d_light.castShadow = true;
        d_light.position.set( -10, 15, 12 );
        d_light.shadow.mapSize.height = 1024; // default   
        d_light.shadow.mapSize.width = 1024; // default
        
        this.scene.add(d_light);

        this.sphere = new THREE.SphereGeometry( 0.5, 32, 32 );
        this.box = new THREE.BoxGeometry();
        
        this.group = new THREE.Group();
        
        const items = [
            {x:0, y:0.5, z:0, r:1},
            {x:2, y:0.5, z:0.5, r:2},
            {x:-1.6, y:0.5, z:0.3, r:2},
            {x:-2.2, y:0.5, z:-1.5, r:2.5},
            {x:1.2, y:0.5, z:-2.5, r:2.9},
            {x:-.2, y:0.5, z:-3, r:0.6},
        ]
        const material = new THREE.MeshStandardMaterial({
            color: `hsl(180, 10%, 70%)`,
            metalness:0.5,
            roughness:0.1,
            wireframe:false
        });
        const p_material = new THREE.MeshStandardMaterial({
            color: `hsl(180, 1%, 90%)`,
            metalness:0.5,
            roughness:0.1,
            wireframe:false
        });
        items.forEach((item, index)=>{
            const mesh = new THREE.Mesh(this.box, material);
            mesh.position.set(item.x, item.y, item.z);
            mesh.rotateY(item.r);
            mesh.castShadow = true;
            this.group.add(mesh);
        })
        this.scene.add(this.group);

        const planeG = new THREE.PlaneGeometry(20, 20, 4, 4);

        const plane = new THREE.Mesh(planeG, p_material);
        plane.receiveShadow = true;

        plane.rotation.x = -Math.PI/2;
        plane.position.z = -3
        plane.position.y = -0.01

        this.scene.add(plane)
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