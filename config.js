let config = {
    dev: {
        global:{
            TYPE:'Local development',
            DEBUGGING:true,
            ASSETS_PATH:'assets/',
            // EXTERNAL_ASSETS_PATH:'http://192.168.1.103:8080/local-assets/download/zoom/',
            EXTERNAL_ASSETS_PATH:'http://192.168.1.187:8888/local-assets/download/zoom/',
            DATA_ASSETS_PATH:'assets/data/',
            // DATA_FILE:'',
            DATA_FILE:'test-20574499007967b5745c7aa3448fb595-3dscenetest-data.json',
        }
    },
    stage: {
        global:{
            TYPE:'Staging',
            DEBUGGING:true,
            ASSETS_PATH:'https://www.dr.dk/tjenester/visuel/staging/blindness-scroll-animation/assets/',
            EXTERNAL_ASSETS_PATH:'https://downol.dr.dk/download/nyheder/2020/blindhed-medicin/',
            DATA_ASSETS_PATH:'https://storage.googleapis.com/sheet-parser/',
            DATA_FILE:'test-20574499007967b5745c7aa3448fb595-3dscenetest-data.json',
        },
        DEPLOY_FOLDER:'/Volumes/staging/',
        OVERWRITE_CONFIRM:true,
        MINIFY:false,
        WEBDOK:true,
        BASE_URL:'https://www.dr.dk/tjenester/visuel/staging/',
    },
    deploy: {
        global:{
            TYPE:'Production',
            DEBUGGING:false,
            ASSETS_PATH:'https://www.dr.dk/nyheder/htm/grafik/2020/blindness-scroll-animation/assets/',
            EXTERNAL_ASSETS_PATH:'https://downol.dr.dk/download/nyheder/2020/blindhed-medicin/',
            DATA_ASSETS_PATH:'https://storage.googleapis.com/sheet-parser/',
            DATA_FILE:'20574499007967b5745c7aa3448fb595-3dscenetest-data.json',
        },
        DEPLOY_FOLDER:'/Volumes/2020/',
        OVERWRITE_CONFIRM:true,
        WEBDOK:true,
        MINIFY:true,
        BASE_URL:'https://www.dr.dk/nyheder/htm/grafik/2020/',
    }
}
module.exports = config;