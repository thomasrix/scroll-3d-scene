'use strict';
import {select, create, fetchJSON} from '../../utils/trix';
import BasicText from './basic-text';
import Intro from './intro';
import ModelText3D from './model-text-3d';
import Scene3D from './scene-3d';

export default class Slides{
    constructor(){
        this.container = select('[zoom-entry-point]');
        this.init();
        this.types = {
            'intro':Intro,
            'basic-text':BasicText,
            'scene-3d':Scene3D,
            'model-text-3d':ModelText3D,
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

        this.data.forEach(element => {
            const el = new this.types[element['type']](element, this.container, this.slides);
        })

    }
}