'use strict'
import {create, replaceLineBreaks} from '../../utils/trix';
import '../../../styles/scene-3d.scss';
import * as THREE from 'three';

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

        // this.textContent = create('div', this.scrollContent, 'text-content');
        // this.textContent.innerHTML = this.formatText(this.element.text);
    }
    build3D(){
        const scene = new THREE.Scene();
        console.log('scene', scene);
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
        this.camera.position.z = 6;
        this.camera.position.y = 1.2;
        
        scene.add(this.camera);

        scene.add(new THREE.AmbientLight('hsl(0, 0%, 90%)'));
        let d_light = new THREE.PointLight( 0xffffcc, 1, 0, 2);
        
        // d_light.castShadow = true;
        d_light.position.set( 10, 15, 7 );
        
        scene.add(d_light);

        this.sphere = new THREE.SphereGeometry( 0.5, 32, 32 );
        this.box = new THREE.BoxGeometry();
        
        this.group = new THREE.Group();
        
        
        const material = new THREE.MeshStandardMaterial({
            color: `hsl(180, 10%, 70%)`,
            metalness:0.5,
            roughness:0.1,
            wireframe:false
        });
        
        const mesh = new THREE.Mesh(this.box, material);
        mesh.position.set(0, 0, 0);
        mesh.rotateY(20)
        this.group.add(mesh);
        scene.add(this.group);
        console.log('render', this.camera)

        const render = ()=>{
            // controls.update();
            this.renderer.render(scene, this.camera);
            requestAnimationFrame(render);
        }
        render();
    }
    formatText(t){
        t = replaceLineBreaks(t);
        return t;
    }
}