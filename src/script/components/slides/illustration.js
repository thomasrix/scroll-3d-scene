'use strict'
import {create, select, replaceLineBreaks} from '../../utils/trix';
import {gsap} from 'gsap';
import '../../../styles/illustration.scss';

export default class Illustration{
    constructor(el, container){
        console.log('Illustration construct');
        this.element = el;
        this.container = container;
        this.build();
    }
    build(){
        this.wrapper = create('div', this.container, 'scroll-animation-container');
        this.wrapper.classList.add('illustration');
        // this.fixedContent = create('div', this.wrapper, 'fixed-content');
        // this.fixedContent = create('div', this.wrapper, 'fixed-content');

        this.scrollContent = create('div', this.wrapper, 'scroll-content');
        this.imageContent = create('div', this.scrollContent, 'illu-content');
        this.imageContent.innerHTML = this.createPicture();

        this.textContent = create('div', this.scrollContent, 'text-content');
        this.textContent.innerHTML = this.formatText(this.element.text);

        // console.log(this.createPicture());
        this.tl = gsap.timeline({
            paused:true,
            scrollTrigger:{
                scrub:true,
                trigger:this.imageContent,
                // pin:true,
                start:'120% bottom',
                // markers:true,
                end:'20% top'
            },
            onUpdate:()=>{
                // console.log('end update', this.tl.time(), this.tl.progress());
            }
            
        });
        this.setupAnimations();
        
    }
    setupAnimations(){
        const n = select('#needle', this.imageContent);
        const e = select('#goodEye', this.imageContent);
        const m = select('#theMaskCircle', this.imageContent);

        this.tl.to(n, {x:'-=150px', duration:1, ease:'power1.out'}, 0.2);
        this.tl.to(e, {opacity:1, duration:2, ease:'none'}, 1.21);

        // this.tl.to(m, {scale:38, duration:1.5, ease:'none'}, 1.1);
        this.tl.to(m, {duration:2, attr:{r:180}, ease:'none'}, 1.1);

        this.tl.to(n, {x:'+=150px', duration:1, ease:'power1.out'});
        this.tl.to(n, {opacity:0, duration:1, ease:'power1.in'}, '-=1');
        // this.tl.to(f, {opacity:0.3, duration:2, ease:'none'});
        // this.tl.to(n, {x:'-=0', duration:1, ease:'none'});
        // this.tl.to(v, {opacity:0, duration:0.5, ease:'none'}, 1);
        console.log('illu duration', this.tl.duration())
    }
    createPicture(){
        
        const p = this.element.image.replace(/(?:\r\n|\r|\n)/g, '').split(',');

        return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="600px"
             height="330px" viewBox="0 0 600 330" style="overflow:visible;enable-background:new 0 0 600 330;" xml:space="preserve">
             <defs>
             <circle id="theMaskCircle" fill="#FFFFFF" class="st3" cx="125" cy="165" r="2.5"/>
             <clipPath id="theMask">
                 <use xlink:href="#theMaskCircle"  overflow="visible"/>
             </clipPath>
             </defs>
        <g id="badEye">
            <circle class="st1" cx="125" cy="165" r="92.54"/>
            <circle class="st2" cx="125" cy="165" r="55"/>
            <path d="M145.31,145.34c0,0.07,0.01,0.15,0.01,0.22c0,3.9-3.16,7.07-7.07,7.07s-7.07-3.16-7.07-7.07c0-3.08,1.97-5.68,4.71-6.66
                c-3.35-1.4-7.03-2.18-10.89-2.18c-15.61,0-28.27,12.66-28.27,28.27c0,15.61,12.66,28.27,28.27,28.27s28.27-12.66,28.27-28.27
                C153.27,157.36,150.23,150.43,145.31,145.34z"/>
        </g>
        <g id="goodEye" clip-path="url(#theMask)">
            <circle class="st3" cx="125" cy="165" r="92.54"/>
            <circle class="st4" cx="125" cy="165" r="55"/>
            <path d="M145.31,145.34c0,0.07,0.01,0.15,0.01,0.22c0,3.9-3.16,7.07-7.07,7.07s-7.07-3.16-7.07-7.07c0-3.08,1.97-5.68,4.71-6.66
                c-3.35-1.4-7.03-2.18-10.89-2.18c-15.61,0-28.27,12.66-28.27,28.27c0,15.61,12.66,28.27,28.27,28.27s28.27-12.66,28.27-28.27
                C153.27,157.36,150.23,150.43,145.31,145.34z"/>
        </g>
        <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="290.8499" y1="165" x2="549.1501" y2="165">
            <stop  offset="0" style="stop-color:#CCCCCC"/>
            <stop  offset="0.3872" style="stop-color:#CACACA;stop-opacity:0.8051"/>
            <stop  offset="0.5267" style="stop-color:#C3C3C3;stop-opacity:0.7349"/>
            <stop  offset="0.6262" style="stop-color:#B8B8B8;stop-opacity:0.6849"/>
            <stop  offset="0.7067" style="stop-color:#A7A7A7;stop-opacity:0.6444"/>
            <stop  offset="0.7755" style="stop-color:#919191;stop-opacity:0.6098"/>
            <stop  offset="0.8365" style="stop-color:#757575;stop-opacity:0.5791"/>
            <stop  offset="0.8917" style="stop-color:#555555;stop-opacity:0.5513"/>
            <stop  offset="0.9423" style="stop-color:#2F2F2F;stop-opacity:0.5258"/>
            <stop  offset="0.9875" style="stop-color:#060606;stop-opacity:0.5031"/>
            <stop  offset="0.9936" style="stop-color:#000000;stop-opacity:0.5"/>
        </linearGradient>
        <g id="needle">
            <polygon class="st5" points="311.43,163 290.85,167 303.1,167 549.15,167 549.15,163 "/>
        </g>
        </svg>`;

    }
    formatText(t){
        t = replaceLineBreaks(t);
        return t;
    }
}