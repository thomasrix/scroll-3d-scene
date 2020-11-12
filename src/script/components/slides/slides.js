'use strict';
import {select, create, fetchJSON} from '../../utils/trix';
import BasicText from './basic-text';
import Intro from './intro';
import Quote from './quote';
import StillImage from './still-image';
import VideoLoop from './video-loop';
import MiddleZoom from './middle-zoom';
import EndZoom from './end-zoom';
import Illustration from './illustration';

export default class Slides{
    constructor(){
        this.container = select('[zoom-entry-point]');
        this.init();
        this.types = {
            'intro':Intro,
            'basic-text':BasicText,
            'still-image':StillImage,
            'illustration':Illustration,
            'video-loop':VideoLoop,
            'middle-zoom':MiddleZoom,
            'end-zoom':EndZoom,
            'quote':Quote,
        }
    }
    init(){
        this.load();
    }
    load(){
        fetchJSON(`${process.env.DATA_ASSETS_PATH}${process.env.DATA_FILE}`)
        .then(result =>{
            // console.log('result', result.data);
            this.data = result.data;
            this.build();
            // content.innerHTML += result.data[0].text;
        });

    }
    build(){

        const vignette = create('div', this.container, 'vignette-overlay');
        const vignetteImage = create('img', vignette);
        vignetteImage.src = `${process.env.EXTERNAL_ASSETS_PATH}images/vignette-wide.png`;

        this.data.forEach(element => {
            const el = new this.types[element['type']](element, this.container, this.slides);
        })

    }
}