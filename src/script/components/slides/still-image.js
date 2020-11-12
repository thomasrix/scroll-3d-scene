'use strict'
import {create, replaceLineBreaks} from '../../utils/trix';
import '../../../styles/still-image.scss';

export default class StillImage{
    constructor(el, container){
        // console.log('still image construct');
        this.element = el;
        this.container = container;
        this.build();
    }
    build(){
        this.wrapper = create('div', this.container, 'scroll-animation-container');
        this.wrapper.classList.add('still-image');
        // this.fixedContent = create('div', this.wrapper, 'fixed-content');
        this.scrollContent = create('div', this.wrapper, 'scroll-content');
        this.imageContent = create('div', this.scrollContent, 'image-content');
        this.imageContent.innerHTML = this.createPicture();
        // console.log(this.createPicture());
        
    }
    createPicture(){
        // console.log(this.element.image.split(','));
        const p = this.element.image.replace(/(?:\r\n|\r|\n)/g, '').split(',');
        return `<picture>
        <source srcset="${p[0]}" media="(max-width: 767px)"/>
        <source srcset="${p[1]}" media="(min-width: 768px)"/>
        <img src="${p[1]}"/ alt="${this.element.text}">
    </picture>`;
    }
    formatText(t){
        t = replaceLineBreaks(t);
        return t;
    }
}