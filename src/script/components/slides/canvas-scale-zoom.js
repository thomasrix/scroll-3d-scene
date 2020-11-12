'use strict'

import {create, lerp, map, throttleEvents} from '../../utils/trix';
import {gsap, Power1} from 'gsap';

// const imageDimensions = { w:400, h:540};
// const imageDimensions = {inputWidth:960, inputHeight:540, outputWidth:960, outputHeight:540};
const imageDimensions = {inputWidth:1267, inputHeight:713, outputWidth:960, outputHeight:540};

let canvasWidth;
let canvasHeight;
let canvasCenter = {x:0, y:0};

export default class CanvasScaleZoom{
    constructor(container, images){
        this.container = container;
        this.images = images;
        this.init();
    }
    init(){
        this.canvas = create('canvas', this.container, 'zoom-canvas');
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

        this.imageFiles = this.images.replace(/(?:\r\n|\r|\n)/g, '').split(',');

        this.lastImage = this.imageFiles.length;
        // console.log('last:', this.lastImage);
        this.images = [];

        this.timeline = gsap.timeline({paused:true, defaults:{ease:'none'}});
        
        this.activeImage = {i:0, scale:this.imageFiles.length - 0.00001 };
        // console.log('activeImageObject', this.activeImage)
        
        this.imageFiles.forEach((item, index) =>{
            const img = create('img');
            img.addEventListener('load', ()=>{
                this.images[index].loaded = true;
                if(index == 0) {
                    this.render();
                    this.ready();
                };
            })
            img.src = `${item}`;
            this.images[index] = {
                active:false,
                loaded:false,
                image:img,
                scale:2,
            };
        });
        this.timeline.to(this.activeImage, {duration:this.images.length, i:this.images.length -1, scale:0, snap:'i'}, 0)
        // console.log('zoom duration', this.timeline.duration());


        this.ctx = this.canvas.getContext('2d', {alpha:false});
        
        window.addEventListener('resize', throttleEvents(this.onResize.bind(this), 500))
        this.setRenderSize();
        // this.ctx.globalAlpha = 0.8;
        // this.render();
    }
    onResize(){
        // console.log('resize handler')
        // throw(new Error('hey'))
        this.setRenderSize();
        this.render();
    }
    setRenderSize(){
        let dpr = 1;
        if(window.devicePixelRatio !== undefined) {
		    dpr = window.devicePixelRatio;
		}
        // console.log('resize', document.documentElement.clientHeight);
        // console.log('client', this.container.getBoundingClientRect().height, document.documentElement.clientHeight );

        canvasWidth = document.documentElement.clientWidth * dpr;
        // canvasHeight = document.documentElement.clientHeight * dpr;
        canvasHeight = this.container.getBoundingClientRect().height * dpr;

        canvasCenter.x = canvasWidth * 0.5;
        canvasCenter.y = canvasHeight * 0.5;

        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        
        const imageFormat = imageDimensions.inputWidth / imageDimensions.inputHeight;

        if(canvasWidth > canvasHeight * imageFormat){
            imageDimensions.outputWidth = canvasWidth;
            imageDimensions.outputHeight = canvasWidth * (imageDimensions.inputHeight / imageDimensions.inputWidth);
        }else{
            imageDimensions.outputWidth = canvasHeight * (imageFormat);
            imageDimensions.outputHeight = canvasHeight;
        }
    }
    render(t){
        // console.log('render ---', this.activeImage.i);
        if(t){
            this.timeline.progress(t.progress());
            // console.log('p', this.timeline.progress(), this.activeImage.scale)
        }
        // this.drawClippedImage();
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        // const active = this.images[this.activeImage.i];
        // console.log('active', active);
        
        let scale = Math.pow(2, this.activeImage.scale%1);
        let current = this.images.length - 1 - Math.floor(this.activeImage.scale);
        // console.log('scale', scale);
        // console.log('current', current);
        // console.log('i', this.activeImage.i);

        for(let i = 1 ; i > -1 ; i--){
            const n = current + i;
            // console.log('render a', n);
            const image = this.images[n];
            if(image !== undefined) this.drawImage(image, scale);
            if(n != this.lastImage){
                scale *= 0.5;
            }else{
                scale = 1
            }
        }
    }
    drawImage(item, scale){
        // const i = item.targets()[0];
        // console.log('draw:', scale);
        // console.log('draw', item.loaded)
        if(item.loaded){

            let x = canvasCenter.x - imageDimensions.outputWidth/2*scale;
            let y = canvasCenter.y - imageDimensions.outputHeight/2*scale;
            let w = imageDimensions.outputWidth*scale;
            let h = imageDimensions.outputHeight*scale;
            
            this.ctx.drawImage(item.image, x, y, w, h);
        }
    }
    drawBorder(){
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.strokeWidth = 2;
        this.ctx.beginPath();
        this.ctx.rect(x, y, w, h);
        this.ctx.stroke();
        this.ctx.closePath();
    }
}