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

     }
    build(){
        this.wrapper = create('div', this.container, 'scroll-animation-container');
        this.wrapper.classList.add('intro');
        // this.fixedContent = create('div', this.wrapper, 'fixed-content');
        this.scrollContent = create('div', this.wrapper, 'scroll-content');
        this.textContent = create('div', this.scrollContent, 'text-content');
        this.textContent.innerHTML = this.formatText(this.element.text);
        this.ready();

    }
    hideLoader(){
        select('#loader-points').style.display = 'none';
    }
    ready(){
        console.log('ready!!!');
        this.hideLoader();
        ScrollTrigger.refresh();
    }
    setupAnimations(){

    }
    formatText(t){
        t = replaceLineBreaks(t);
        // t = replaceToImageTags(t);
        // const l = replaceLineBreaks(t);
        let r = t.replace('<c>', '<div class="header">').replace('</c>', '</div>');
        return r;
    }
}