'use strict'
import {create, replaceLineBreaks} from '../../utils/trix';
import '../../../styles/basic-text.scss';

export default class BasicText{
    constructor(el, container){
        // console.log('basic txt construct');
        this.element = el;
        this.container = container;
        this.build();
    }
    build(){
        this.wrapper = create('div', this.container, 'scroll-animation-container');
        this.wrapper.classList.add('basic-text');
        // this.fixedContent = create('div', this.wrapper, 'fixed-content');
        this.scrollContent = create('div', this.wrapper, 'scroll-content');
        this.textContent = create('div', this.scrollContent, 'text-content');
        this.textContent.innerHTML = this.formatText(this.element.text);
    }
    formatText(t){
        t = replaceLineBreaks(t);
        return t;
    }
}