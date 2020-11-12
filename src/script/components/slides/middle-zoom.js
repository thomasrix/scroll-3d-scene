
'use strict'
import {create, select, replaceLineBreaks, isIE} from '../../utils/trix';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import '../../../styles/middle-zoom.scss';
import CanvasScaleZoom from './canvas-scale-zoom';

const IE = isIE();

export default class MiddleZoom{
    constructor(el, container){
        // console.log('intro construct');
        this.element = el;
        this.container = container;
        this.init();
    }
    init(){
        gsap.registerPlugin(ScrollTrigger);
        this.build();

        this.tl = gsap.timeline({
            paused:true,
            scrollTrigger:{
                scrub:true,
                trigger:this.fixedContent,
                pin:true,
                // markers:true,
                start:'top top',
                end:'+=210%'
            },
            onUpdate:()=>{
                // console.log('middle update', this.tl.time(), this.tl.progress());
                this.zoom.render(this.tl);
            }
            
        });
        
        this.setupAnimations();
    }
    build(){
        this.wrapper = create('div', this.container, 'scroll-animation-container');
        this.wrapper.classList.add('middle-zoom');
        this.fixedContent = create('div', this.wrapper, 'fixed-content');
        this.scrollContent = create('div', this.wrapper, 'scroll-content');
        this.textContent = create('div', this.scrollContent, 'text-content');
        this.textContent.innerHTML = this.formatText(this.element.text);

        this.zoom = new CanvasScaleZoom(this.fixedContent, this.element.image);

    }
    ready(){
        console.log('middle ready!!!');
        ScrollTrigger.refresh();
    }
    setupAnimations(){
        // console.log('setup intro animation')
        this.zoom.ready = this.ready.bind(this);
        // const blurAmount = {a:0, intro:20}
        // this.tl.to(this.headerElement, {textShadow:'0px 0px 50px #FFFFFF', duration:1, ease:'none'});
        // this.tl.to(this.headerElement, {blur:'40', duration:1, ease:'none'});
        const v = select('.vignette-overlay');

        this.tl.to(this.zoom.canvas, {opacity:1, duration:.75, ease:'none'}, 0.01);
        this.tl.fromTo(v, {opacity:1, duration:0.75, ease:'none'}, {opacity:0}, 0.25);
        this.tl.to(this.zoom.canvas, {color:'white', duration:2, ease:'none'}, 1);
        this.tl.to(v, {opacity:1, duration:1, ease:'none'}, 1);
        this.tl.to(this.zoom.canvas, {opacity:0, duration:0.5, ease:'none'}, '-=0.5');
        console.log('middle duration', this.tl.duration())
    }
    formatText(t){
        t = replaceLineBreaks(t);
        // t = replaceToImageTags(t);
        // const l = replaceLineBreaks(t);
        let r = t.replace('<c>', '<div class="header">').replace('</c>', '</div>');
        return r;
    }
}