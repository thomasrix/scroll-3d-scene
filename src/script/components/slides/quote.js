'use strict'
import {create, replaceLineBreaks, blurText} from '../../utils/trix';
import '../../../styles/quote.scss';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

export default class Quote{
    constructor(el, container){
        // console.log('quote contruct');
        this.element = el;
        this.container = container;
        gsap.registerPlugin(ScrollTrigger);
        this.build();

        this.tl = gsap.timeline({
            paused:true,
            scrollTrigger:{
                scrub:true,
                repeat:10,
                trigger:this.textContent,
                start:'top bottom',
                end:'top 40%',
                // pin:true,
                // markers:true
            }
            
        });

        this.setupAnimations();
    }
    build(){
        this.wrapper = create('div', this.container, 'scroll-animation-container');
        this.wrapper.classList.add('quote');
        // this.fixedContent = create('div', this.wrapper, 'fixed-content');
        this.scrollContent = create('div', this.wrapper, 'scroll-content');
        this.textContent = create('div', this.scrollContent, ['text-content', 'quote-block']);
        this.textContent.innerHTML = this.formatText(this.element.text);
    }
    setupAnimations(){
        const blurAmount = {a:20};
        this.tl.to(blurAmount, {a:0, duration:1, ease:'Power1.out', snap:{a:1}, onUpdate:()=>{
            blurText(this.textContent, blurAmount.a)
        }});

    }
    formatText(t){
        t = replaceLineBreaks(t);
        return t;
    }
}