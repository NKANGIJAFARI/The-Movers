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


// NAVIGATION BAR STYLING
const navOpenCloseBtn = document.querySelector('.navbar__open-btn');
const navBarWrapper = document.querySelector(".navbar__wrapper");
const navClosureBtn = document.querySelector('.navbar__closure-btn');

navOpenCloseBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    console.log(navOpenCloseBtn)
    console.log(navBarWrapper)
    navBarWrapper.classList.toggle('active');
});

navClosureBtn.addEventListener('click' , () =>{
    navBarWrapper.classList.remove('active');
})