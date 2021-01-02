import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../Sass styles/main.scss";
import { db, auth } from './firebaseConfig';

import './googleMaps';

import { getLikedPosts } from './cardsFunctionality';
import pic from "../images/star2.png";

const postedProperties = document.querySelector('.postedProperties');

const filterBtn = document.querySelector(".filterBtn");

const toggleMapAndCardsBtns = document.querySelectorAll('.toggleMapAndCardsBtn');
toggleMapAndCardsBtns.forEach(btn =>{
    btn.addEventListener('click', (e)=>{
        const propertyListWrapper = document.querySelector(".propertyListWrapper");
        const mapWrapper = document.querySelector('.map__wrapper')
        const showCards = document.querySelector('#showCards');
        const showMap = document.querySelector('#showMap');

        if(e.target.getAttribute('id') === "showCards"){
            console.log("This are cards");
         
            if(propertyListWrapper.classList.contains('active')){
                console.log("ALREADY IS ACTIVE")
                return
            }

            if(mapWrapper.classList.contains('active')){
                mapWrapper.classList.remove('active');
            }
            propertyListWrapper.classList.add('active');

            if(showCards.classList.contains('active')){
                return
            }else{
                showMap.classList.remove("active")
                showCards.classList.add('active')
            }

        }else if(e.target.getAttribute('id') === "showMap"){
            console.log('This are maps');
            if(mapWrapper.classList.contains("active")){
                console.log("Already on maps")
                return
            }

            if(propertyListWrapper.classList.contains('active')){
                propertyListWrapper.classList.remove('active');
                console.log('removed', propertyListWrapper)
            }
            mapWrapper.classList.add('active');

            if(showMap.classList.contains('active')){
                return
            }else{
                showCards.classList.remove("active")
                showMap.classList.add('active')
            }            
        }
    })
})


const fetchPostsToPostings = async(divToPutPostings)=>{
    const posts = await db.collection('housePostings').get();
    if(window.location.pathname === "/propertyListing.html"){
      posts.forEach(post=>{
        divToPutPostings.innerHTML += postingCard(post.data().propertyDetails, "col-lg-4 col-md-6 col-sm-12");
      })
      return posts;
    }
  }

  export const postingCard  = (data, size)=>{
    return`
    <div  class="houseposting ${size}" >
      <div  class=" ${data.propertyDescription} ${data.propertyUsage} " >
        <div class="card text-center">
          <p class="card-header card__header text-left">
            <span class="card__price">Price: UgShs.
              <span class="price">${data.price}</span >
            </span>
            <span class="card__rentSaleOption">${data.propertyStatus}</span>
          </p>
    
          <div class="card__ImgWrapper">
            <img src="${data.displayImage}" class="card-img-top card__ImgWrapper--Img" alt="House Image">
          </div>
    
          <div class="card-body text-center cardInfo card__body">
            <div class="card__icons">
              <a class="card__icons--item button">
                <i class="fas fa-images"></i>
                <span>GALLERY</span>
              </a>
              <a class="card__icons--item button" >
                <i class="fas fa-map-marked-alt"></i>
                <span class="text-black">MAP</span>
              </a>
              <a class="card__icons--item button landLordContactBtn" data-toggle="modal" data-target="#messageModal" id="${data.uid}">
                <i class="far fa-comment-alt"></i>
                CHAT
              </a>
            </div>
            <p class="card-text card__body-text">
              <span class="card__body--bedrooms"> ${data.rooms} rooms  </span>
              <span class="card__body--category"> ${data.propertyDescription}
            </p>
            <p class="m-0 text-muted">
              <strong><span class="location card__body--location">${data.location}</span></strong>
            </p>
    
            <span class="${data.propertyId}">
              <a id="${data.propertyId}" class="card__body--viewDetails viewDetailsBtn" href="">
                <strong> FULL DETAILS</strong>
              </a>
            </span>
    
            <!-- <a href="#landlordContacts" data-toggle="modal" data-target="#messageModal" data-uid="${data.uid}" class="card__body--ContactBtn">CONTACT LANDLORD</a> -->
          </div>
          <div class="card__body--postedByDetails">
            <img src="${data.postedByImg}" alt="Posted By" class="card__body--postedByImg">
            <img src= "${pic}" class="card__body--starRating"></img>
          </div>
          <svg  viewBox="0 0 16 16" class="bi bi-heart card__body--heart" id="${data.propertyId}" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
          </svg>
        </div>
      </div>
    </div>
    `
    }


const otherFunctions = async() =>{
     setTimeout(()=>{
        const sidebar = document.querySelector('#sidebar');
        const hideFilter = document.querySelector(".hideFilter");
        const postings = document.querySelectorAll('.houseposting');
    
        filterBtn.addEventListener('click', ()=>{
            sidebar.classList.toggle('active');
            postings.forEach(post=>{ 
                const x = screen.availWidth;

                if(!sidebar.classList.contains("active")){
                    if(x < 600){
                        postedProperties.style.display ="inline-flex"
                    }
                
                    hideFilter.innerText = "Show Filter"
                    post.classList.remove("col-lg-6");
                    post.classList.add("col-lg-4");
                }else if(sidebar.classList.contains("active")){
                    
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


