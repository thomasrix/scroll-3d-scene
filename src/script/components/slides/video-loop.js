'use strict'
import {create, replaceLineBreaks, select} from '../../utils/trix';
import '../../../styles/video-loop.scss';

export default class VideoLoop{
    constructor(el, container){
        // console.log('video loop construct');
        this.element = el;
        this.container = container;
        this.build();
    }
    build(){
        this.query = window.matchMedia('(max-width: 767px)');
        this.query.addListener(this.querySwitch.bind(this));

        this.wrapper = create('div', this.container, 'scroll-animation-container');
        this.wrapper.classList.add('video-loop');
        // this.fixedContent = create('div', this.wrapper, 'fixed-content');
        this.scrollContent = create('div', this.wrapper, 'scroll-content');
        this.videoContent = create('div', this.scrollContent, 'video-content');
        
        // this.setSource(query);
        this.videoContent.innerHTML = this.createVideo();
        const video = select('.video-loop', this.scrollContent);
        video.muted = true;
    }
    querySwitch(q){
        // console.log('switch');
        const m = (q.matches) ? 0 : 1;
        const video = select('.video-loop', this.scrollContent);
        video.src = this.v[m];
        video.poster = this.p[m];

    }
    createVideo(){
        // console.log('videos', this.query.matches, this.element.video.split(','));
        this.v = this.element.video.replace(/(?:\r\n|\r|\n)/g, '').split(',');
        this.p = this.element.image.replace(/(?:\r\n|\r|\n)/g, '').split(',');
        const m = (this.query.matches) ? 0 : 1;
        return `<video class="video-loop" muted autoplay playsinline loop data-object-fit="cover" src="${this.v[m]}" poster="${this.p[m]}"></video>`;

    }

}