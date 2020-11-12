'use strict'
import {create, select, replaceLineBreaks, isIE, blurText} from '../../utils/trix';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import '../../../styles/intro.scss';
// import CanvasZoom from './canvas-zoom';
import CanvasScaleZoom from './canvas-scale-zoom';

const IE = isIE();

export default class Intro{
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
                end:'+=360%'
            },
            onUpdate:()=>{
                // console.log('intro update', this.tl.time());
                this.zoom.render(this.tl);
            }
            
        });
        
        this.setupAnimations();
/*         window.addEventListener('resize', ()=>{
            console.log('window resize')
        }) */
    }
    build(){
        this.wrapper = create('div', this.container, 'scroll-animation-container');
        this.wrapper.classList.add('intro');
        this.fixedContent = create('div', this.wrapper, 'fixed-content');
        this.scrollContent = create('div', this.wrapper, 'scroll-content');
        this.textContent = create('div', this.scrollContent, 'text-content');
        this.textContent.innerHTML = this.formatText(this.element.text);

        this.zoom = new CanvasScaleZoom(this.fixedContent, this.element.image);

        this.headerElement = select('.header'); 

        this.fixedContent.appendChild(this.headerElement);

        this.inlineHeader = select('.inline-header');
        this.scrollContent.insertBefore(this.inlineHeader, this.textContent);


    }
    hideLoader(){
        select('#loader-points').style.display = 'none';
    }
    ready(){
        console.log('ready!!!');
        this.hideLoader();
        ScrollTrigger.refresh();
        this.introAnimation.play();
    }
    setupAnimations(){
        // console.log('setup intro animation')
        this.zoom.ready = this.ready.bind(this);
        const blurAmount = {a:0, intro:20}
        this.introAnimation = gsap.timeline({paused:true});
        this.introAnimation.to('.vignette-overlay', {opacity:0, duration:0.1});
        this.introAnimation.fromTo(this.headerElement, {color:'#000'}, {color:'#FFF', duration:1.5});

        this.introAnimation.to(blurAmount, {intro:0, duration:5, ease:'power1.out', onUpdate:()=>{
            blurText(this.headerElement, blurAmount.intro);
        }}, '-=1.5');
        
        
        // this.tl.fromTo('.vignette-overlay', {opacity:0, duration:0.1, ease:'none'},{opacity:0}, 0);
        this.tl.to(blurAmount, {a:20, duration:1, ease:'none', snap:{a:1}, onUpdate:()=>{
            if(this.introAnimation.isActive) this.introAnimation.pause();
            blurText(this.headerElement, blurAmount.a);
        }});
        this.tl.to(this.headerElement, {opacity:0, display:'none', duration:1, ease:'none'}, 0.5);
        this.tl.fromTo('.vignette-overlay', {opacity:0, duration:1, ease:'none'}, {opacity:1}, 1.5);
        this.tl.to(this.zoom.canvas, {opacity:0, duration:.5, ease:'none'});
        console.log('intro duration', this.tl.duration())
    }
    formatText(t){
        t = replaceLineBreaks(t);
        // t = replaceToImageTags(t);
        // const l = replaceLineBreaks(t);
        let r = t.replace('<c>', '<div class="header">').replace('</c>', '</div>');
        return r;
    }
}