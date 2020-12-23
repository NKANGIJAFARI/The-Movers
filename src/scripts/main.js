import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands';


import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import './cardsFunctionality';

library.add(fas, far, fab) 

dom.i2svg() 



// let progress = document.querySelector('.progressBar');

// let totalHeight = document.body.scrollHeight - window.innerHeight;
// window.onscroll = function(){
//     let progressHeight = (window.pageXOffset / totalHeight) * 100;
//     progress.style.height = progressHeight + "%"
// }