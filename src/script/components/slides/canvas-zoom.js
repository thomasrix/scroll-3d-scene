'use strict'

import {create, lerp, map, throttleEvents} from '../../utils/trix';
import {gsap} from 'gsap';

const imageDimensions = { w:400, h:540};
// const imageDimensions = { w:960, h:540};

let canvasWidth;
let canvasHeight;

let canvasRatio;

let horisontal;

export default class CanvasZoom{
    constructor(container){
        this.container = container;
        this.init();
    }
    init(){
        // console.log('init CanvasZoom');
        this.canvas = create('canvas', this.container, 'zoom-canvas');
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

        this.imageFiles = [
            'eye_zoom_v01_00000.jpg',
            'eye_zoom_v01_00001.jpg',
            'eye_zoom_v01_00002.jpg',
            'eye_zoom_v01_00003.jpg',
            'eye_zoom_v01_00004.jpg',
            'eye_zoom_v01_00005.jpg',
            'eye_zoom_v01_00006.jpg',
            'eye_zoom_v01_00007.jpg',
            'eye_zoom_v01_00008.jpg',
            'eye_zoom_v01_00009.jpg',
        ];
      
        this.images = [];

        this.timeline = gsap.timeline({paused:true, defaults:{ease:'none'}, onUpdate:()=>{
            // console.log('u:', this.activeImage.i);
            // console.log('target', this.timeline.currentTarget)
        }});

        this.activeImage = {i:0};

        this.imageFiles.forEach((item, index) =>{
            const img = create('img');
            img.addEventListener('load', ()=>{
                if(index == 0) this.render();
            })
            img.src = `${process.env.EXTERNAL_ASSETS_PATH}images/zoom/${imageDimensions.w}/${item}`;
            this.images[index] = {
                active:false,
                image:img,
                left:imageDimensions.w * .25,
                width:imageDimensions.w * .5,
                top:imageDimensions.h * .25,
                height:imageDimensions.h * .5,
            };
            // this.timeline.set(this.images[index], {active:true});
            // this.timeline.set(this.activeImage, {i:index});
            this.timeline.to(this.images[index], {
                duration:1, 
                left:0, 
                width:imageDimensions.w, 
                top:0, 
                height:imageDimensions.h,
                // ease:'none',
                // snap:'left,width,top,height',
                onUpdate: ()=>{
                    this.activeImage.i = index;
                    // console.log('t:', index)
                }
            });
            // this.timeline.to(this.images[index], {duration:0.01, active:false});
        });
/*         this.timeline.to(this.activeImage, {i:this.images.length - 1, 
            modifiers:{
                i:(i) => {
                    return Math.round(i);
                }
            }, 
            duration:this.timeline.duration()},
             0);
 */
        console.log('zoom duration', this.timeline.duration());

        this.ctx = this.canvas.getContext('2d', {alpha:false});
        
        window.addEventListener('resize', throttleEvents(this.onResize.bind(this), 200))
        this.setRenderSize();
        // this.ctx.globalAlpha = 0.8;
        // this.render();
    }
    onResize(){
        this.setRenderSize();
        this.render();
    }
    setRenderSize(){
        const imageFormat = imageDimensions.w / imageDimensions.h;
        console.log('if', imageFormat);
        
        const windowFormat = window.innerWidth / window.innerHeight;
        console.log('wf', windowFormat);
        
        console.log(windowFormat > imageFormat);

        horisontal = windowFormat > imageFormat;
        
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        
        canvasRatio = canvasWidth / canvasHeight;
        console.log(canvasWidth, canvasHeight, canvasRatio);

        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

    }
    render(t){
        if(t){
            this.timeline.progress(t.progress());
        }
        this.drawClippedImage();
        // this.drawFullImage();
 
    }
    drawClippedImage(){
        // console.log('draw');
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        const d = this.setClippingDimensions(this.images[this.activeImage.i]);
        this.ctx.drawImage(this.images[this.activeImage.i].image, d.left, d.top, d.width, d.height, 0, 0, canvasWidth, canvasHeight);
        // this.ctx.drawImage(this.images[this.activeImage.i].image, d.left, d.top, d.width, d.height);
    }
    setClippingDimensions(item){
        let top, height, width, left;
        if(horisontal){
            left = item.left;
            width = item.width;
            height = Math.floor(item.width / canvasRatio);
            top = Math.floor((imageDimensions.h * .5) - (height * .5));
        }else{
            top = (item.top + 0.5) | 0;
            height = (item.height + 0.5) | 0;
            width = ((item.height * canvasRatio) + 0.5) | 0;
            left = (((imageDimensions.w * .5) - (width * .5) + 0.5) | 0);
        }
        
        console.log('top', top);
        // console.log('height', height);
        // console.log('width', width);
        // console.log('left', left);
        return {
            top:top,
            height:height,
            width:width,
            left:left
        }
        // return d;
    }
}