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
                this.camera.lookAt(0, 0, 0);
                this.renderer.render(this.scene, this.camera)
            }
            

        });
        this.timeline.to(this.camera.position, {y:-.2, ease:'none'})
    }
    build3D(){
        this.scene = new THREE.Scene();
        // console.log('scene', scene);
        // const context = this.ctx;
        this.renderer = new THREE.WebGLRenderer({
            context:this.ctx
        });
        // console.log(this.renderer.getContext())
        // WebGL background color
        this.renderer.setClearColor('hsl(0, 0%, 60%)', 0);
        this.renderer.setSize(this.canvas.width, this.canvas.height);
        
        // Setup a camera
        // const camera = new THREE.OrthographicCamera();
        this.camera = new THREE.PerspectiveCamera(40, this.canvas.width / this.canvas.height, 0.1, 100);
        this.camera.position.z = 8;
        this.camera.position.y = 2.8;
        
        this.scene.add(this.camera);

        this.scene.add(new THREE.AmbientLight('hsl(0, 0%, 90%)'));
        let d_light = new THREE.PointLight( 0xffffcc, 1, 0, 2);
        
        // d_light.castShadow = true;
        d_light.position.set( -10, 15, 7 );
        
        this.scene.add(d_light);

        this.sphere = new THREE.SphereGeometry( 0.5, 32, 32 );
        this.box = new THREE.BoxGeometry();
        
        this.group = new THREE.Group();
        
        const items = [
            {x:0, y:0, z:0, r:1},
            {x:2, y:0, z:0.5, r:2},
            {x:-1.6, y:0, z:0.2, r:2},
        ]
        const material = new THREE.MeshStandardMaterial({
            color: `hsl(180, 10%, 70%)`,
            metalness:0.5,
            roughness:0.1,
            wireframe:false
        });
        items.forEach((item, index)=>{
            const mesh = new THREE.Mesh(this.box, material);
            mesh.position.set(item.x, item.y, item.z);
            mesh.rotateY(item.r)
            this.group.add(mesh);
        })
        this.scene.add(this.group);
        // console.log('render', this.camera)
        
        this.renderer.render(this.scene, this.camera);

        const render = ()=>{
            // controls.update();
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(render);
        }
        // render();
    }
    formatText(t){
        t = replaceLineBreaks(t);
        return t;
    }
}