'use strict'

import {create, lerp, map, throttleEvents} from '../../utils/trix';
import {gsap, Power1} from 'gsap';

// const imageDimensions = { w:400, h:540};
// const imageDimensions = {inputWidth:960, inputHeight:540, outputWidth:960, outputHeight:540};
const imageDimensions = {inputWidth:1267, inputHeight:713, outputWidth:960, outputHeight:540};

let canvasWidth;
let canvasHeight;
let canvasCenter = {x:0, y:0};

let canvasRatio;

let horisontal;

export default class CanvasRotateZoom{
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
        
        this.activeImage = {scale:1.1, rotation:0};
        // console.log('activeImageObject', this.activeImage)
        
        this.image = {
            active:false,
            loaded:false,
            image:create('img'),
            scale:2,
        };
        // console.log('image:',this.image.image)
        this.image.image.addEventListener('load', ()=>{
            console.log('end image loaded')
            this.image.loaded = true;
            this.render();
            this.ready();
        });
        this.image.image.src = this.imageFiles[0];

        this.timeline.to(this.activeImage, {duration:1, scale:1.8, rotation:10, ease:'out'}, 0)
        // console.log('zoom duration', this.timeline.duration());


        this.ctx = this.canvas.getContext('2d', {alpha:false});
        
        window.addEventListener('resize', throttleEvents(this.onResize.bind(this), 500))
        this.setRenderSize();
        // this.ctx.globalAlpha = 0.8;
        // this.render();
    }
    onResize(){
        this.setRenderSize();
        this.render();
    }
    setRenderSize(){
        let dpr = 1;
        if(window.devicePixelRatio !== undefined) {
		    dpr = window.devicePixelRatio;
		}
        console.log('resize', window.innerHeight, document.documentElement.clientHeight);

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
        
        // let scale = Math.pow(2, this.activeImage.scale%1);
        
        if(this.image !== undefined){
            this.drawImage(this.image, this.activeImage.scale);
        }

    }
    drawImage(item, scale){
        // const i = item.targets()[0];
        // console.log('draw:', scale, this.activeImage.rotation);
        // console.log('draw', item.loaded)
        if(item.loaded){

            // let x = canvasCenter.x - imageDimensions.outputWidth/2*scale;   
            // let y = canvasCenter.y - imageDimensions.outputHeight/2*scale;
            let w = imageDimensions.outputWidth*scale;
            let h = imageDimensions.outputHeight*scale;


            const rad = this.activeImage.rotation * Math.PI / 180;
            this.ctx.save();
            this.ctx.translate(canvasCenter.x, canvasCenter.y);
            this.ctx.rotate(rad);
            this.ctx.drawImage(item.image, w/-2, h/-2, w, h);
            this.ctx.restore();
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