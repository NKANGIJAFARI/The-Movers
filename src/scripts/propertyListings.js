import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../Sass styles/main.scss";

import {fetchPostsToPostings} from './fetchPostings';



import { getLikedPosts } from './cardsFunctionality';

const postedProperties = document.querySelector('.postedProperties');

const filterBtn = document.querySelector(".filterBtn");



const otherFunctions = async() =>{
     setTimeout(()=>{
        const sidebar = document.querySelector('#sidebar');
        const hideFilter = document.querySelector(".hideFilter");
        const postings = document.querySelectorAll('.houseposting');
    
        filterBtn.addEventListener('click', ()=>{
            sidebar.classList.toggle('active');
            postings.forEach(post=>{ 
                const x = screen.availWidth;

                if(sidebar.classList.contains("active")){
                    if(x < 600){
                        postedProperties.style.display ="inline-flex"
                    }
                
                    hideFilter.innerText = "Show Filter"
                    post.classList.remove("col-lg-6");
                    post.classList.add("col-lg-4");
                }else if(!sidebar.classList.contains("active")){
                    
                    if(x < 600){
                        postedProperties.style.display ="none"
                    }
                    hideFilter.innerText = "Hide Filter"
                    post.classList.remove("col-lg-4");
                    post.classList.add("col-lg-6");
                    sidebar.classList.add("sidebarFixed");
                }
                
            })
        })
    
        //for-sale, for-rent filtration   
       const propertyCategory = document.getElementsByName('propertyCategory')
       const rentSaleOption = document.querySelectorAll('.rentSaleOption');
    
        propertyCategory.forEach(cat =>{
            cat.addEventListener('click', (e)=>{
                const selectedValue = e.target.value;
                for(let i = 0; i < rentSaleOption.length; i++){ 
                    if(selectedValue !== rentSaleOption[i].innerText){
                        rentSaleOption[i].parentElement.parentElement.parentElement.classList.add('hide1')
                    }else{
                        rentSaleOption[i].parentElement.parentElement.parentElement.classList.remove('hide1') 
                    }
                }
            })
        })
    
    //Filter properties by prices
        const priceForm = document.querySelector("#priceForm");
        const getPriceBtn = document.querySelector("#priceForm > div > button");
        const prices = document.querySelectorAll('.price');  
    
        getPriceBtn.addEventListener('click', (e)=>{
            e.preventDefault();
            const minPriceValue = Number(priceForm['minPrice'].value);
            const maxPriceValue = Number(priceForm['maxPrice'].value);
            
            for(let i=0; i<prices.length; i++){
                const price = Number(prices[i].innerText);
                if(minPriceValue >= maxPriceValue){console.log("eroor, min is bigger")}
                else if(minPriceValue > price  ||  maxPriceValue < price){
                    prices[i].parentElement.parentElement.parentElement.classList.add('hide2')
                }else{
                    prices[i].parentElement.parentElement.parentElement.classList.remove('hide2')
                }
            }
        })
    
    
    //Filter properties by property Usage
    const propertyUsage = document.querySelector("#propertyUsage");
    
    propertyUsage.addEventListener('change', (e)=>{
        postings.forEach(post=>{
            if(!post.classList.contains(e.target.value) && e.target.value != 'Any'){
                post.classList.add('hide3')
            }else{
                post.classList.remove('hide3')
            }
        })
    })
    
    
    const propertyType = document.querySelector("#propertyType");
    propertyType.addEventListener('change', (e)=>{
        postings.forEach(post=>{
            if(!post.classList.contains(e.target.value) && e.target.value != 'Any'){
                post.classList.add('hide4')
            }else{
                post.classList.remove('hide4')
            }
        })
    })   
    
    }, 0) 
}

const domManipulation = async()=>{
    const propertiesList = await fetchPostsToPostings(postedProperties);
    let propertyArray = [];
    propertiesList.forEach(property=>{
            propertyArray.push(property)
    });
    const spinner = document.querySelector('.spin');
    spinner.style.display ="none"
    await otherFunctions();
    filterBtn.style.display = "block";
    await getLikedPosts(propertyArray);
}

domManipulation()


