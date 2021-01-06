// import 'bootstrap';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
// import '../styles/styleforIndex.css';
// import '../styles/main.css'
import pic from "../images/star2.png";

import { db, auth } from './firebaseConfig';

 
import "../Sass styles/main.scss"
import '../scripts/tabs';

import { getLikedPosts } from './cardsFunctionality';

const houseposting = document.getElementsByClassName('houseposting');


for (let i = 0; i < houseposting.length; i++) {
      //second console output
}

const rentOrBuy = document.querySelector(".selectRentBuy");
const rentSaleOption = document.querySelectorAll(".rentSaleOption");
const priceSelect = document.querySelector(".priceSelect");
const prices = document.querySelectorAll(".price");
const postedProperties = document.querySelector('.postedProperties');
const spinner = document.querySelector('.spin')
const featuredDetails = document.querySelector('.featured__details');
const featuredCarousel = document.querySelector('.featured__carousel--inner');




//Jquery for the testimonial rotations
let i=2;	
jQuery(function(){
    var radius = 200;
    var fields = $('.itemDot');
    var container = $('.dotCircle');
    var width = container.width();
    radius = width/2.5;

    var height = container.height();
    var angle = 0;
    var step = (2*Math.PI) / fields.length;
    fields.each(function() {
        var x = Math.round(width/2 + radius * Math.cos(angle) - $(this).width()/2);
        var y = Math.round(height/2 + radius * Math.sin(angle) - $(this).height()/2);
        if(window.console) {
            //console.log($(this).text(), x, y);
        }
        
        $(this).css({
            left: x + 'px',
            top: y + 'px'
        });
        angle += step;
    });
    
    
    $('.itemDot').click(function(){
        
        var dataTab= $(this).data("tab");
        $('.itemDot').removeClass('active');
        $(this).addClass('active');
        $('.CirItem').removeClass('active');
        $( '.CirItem'+ dataTab).addClass('active');
        i=dataTab;
        
        $('.dotCircle').css({
            "transform":"rotate("+(360-(i-1)*36)+"deg)",
            "transition":"2s"
        });
        $('.itemDot').css({
            "transform":"rotate("+((i-1)*36)+"deg)",
            "transition":"1s"
        });
        
        
    });
    
    setInterval(function(){
        var dataTab= $('.itemDot.active').data("tab");
        if(dataTab>6||i>6){
        dataTab=1;
        i=1;
        }
        $('.itemDot').removeClass('active');
        $('[data-tab="'+i+'"]').addClass('active');
        $('.CirItem').removeClass('active');
        $( '.CirItem'+i).addClass('active');
        i++;
        
        
        $('.dotCircle').css({
            "transform":"rotate("+(360-(i-2)*36)+"deg) ",
            "transition":"2s"
        });
        $('.itemDot').css({
            "transform":"rotate("+((i-2)*36)+"deg)",
            "transition":"1s"
        });
        
        }, 5000);
    
});

// This is the movement of the first carousel
$('#myCarousel').carousel({
  interval: 100000,
})

const carouselFunctions = ()=>{
    
    $(document).ready(function () {
        var itemsMainDiv = ('.MultiCarousel');
        var itemsDiv = ('.MultiCarousel-inner');
        var itemWidth = "";

        $('.leftLst, .rightLst').click(function () {
            var condition = $(this).hasClass("leftLst");
            if (condition)
                click(0, this);
            else
                click(1, this)
        });

        ResCarouselSize();




        $(window).resize(function () {
            ResCarouselSize();
        });

        //this function define the size of the items
        function ResCarouselSize() {
            var incno = 0;
            var dataItems = ("data-items");
            var itemClass = ('.item');
            var id = 0;
            var btnParentSb = '';
            var itemsSplit = '';
            var sampwidth = $(itemsMainDiv).width();
            var bodyWidth = $('body').width();
            $(itemsDiv).each(function () {
                id = id + 1;
                var itemNumbers = $(this).find(itemClass).length;
                btnParentSb = $(this).parent().attr(dataItems);
                itemsSplit = btnParentSb.split(',');
                $(this).parent().attr("id", "MultiCarousel" + id);


                if (bodyWidth >= 1200) {
                    incno = itemsSplit[3];
                    itemWidth = 370;
                }
                else if (bodyWidth >= 992) {
                    incno = itemsSplit[2];
                    itemWidth = 320;
                }
                else if (bodyWidth >= 768) {
                    incno = itemsSplit[1];
                    itemWidth = 300;
                }
                else if (bodyWidth >= 540) {
                    incno = itemsSplit[1];
                    itemWidth = 280;
                }
                else {
                    incno = itemsSplit[0];
                    itemWidth = 320;
                }
                $(this).css({ 'transform': 'translateX(0px)', 'width': itemWidth * itemNumbers });
                $(this).find(itemClass).each(function () {
                    $(this).outerWidth(itemWidth);
                });

                $(".leftLst").addClass("over");
                $(".rightLst").removeClass("over");

            });
        }


        //this function used to move the multi carousel items
        function ResCarousel(e, el, s) {
            var leftBtn = ('.leftLst');
            var rightBtn = ('.rightLst');
            var translateXval = '';
            var divStyle = $(el + ' ' + itemsDiv).css('transform');
            var values = divStyle.match(/-?[\d\.]+/g);
            var xds = Math.abs(values[4]);
            if (e == 0) {
                translateXval = parseInt(xds) - parseInt(itemWidth * s);
                $(el + ' ' + rightBtn).removeClass("over");

                if (translateXval <= itemWidth / 2) {
                    translateXval = 0;
                    $(el + ' ' + leftBtn).addClass("over");
                }
            }
            else if (e == 1) {
                var itemsCondition = $(el).find(itemsDiv).width() - $(el).width();
                translateXval = parseInt(xds) + parseInt(itemWidth * s);
                $(el + ' ' + leftBtn).removeClass("over");

                if (translateXval >= itemsCondition - itemWidth / 2) {
                    translateXval = itemsCondition;
                    $(el + ' ' + rightBtn).addClass("over");
                }
            }
            $(el + ' ' + itemsDiv).css('transform', 'translateX(' + -translateXval + 'px)');
        }

        //It is used to get some elements from btn
        function click(ell, ee) {
            var Parent = "#" + $(ee).parent().attr("id");
            var slide = $(Parent).attr("data-slide");
            ResCarousel(ell, Parent, slide);
        }

    });
}


const fetchPostsToHome = async(divToPutPostings)=>{
    const posts = await db.collection('housePostings').orderBy("propertyDetails.datePosted").limit(10).get();
    posts.forEach(post=>{
      divToPutPostings.innerHTML += postingCardForHome(post.data().propertyDetails);
    });
    return posts;
  }

  export const postingCardForHome = (data)=>{
    return`
    <div  class="housePosting item MultiCarousel__item" >
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
            <a class="card__icons--item button landLordContactBtn" id="${data.uid}">
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
    `
    }

    export  const fetchFeaturedPostToHome = async(divToPutDetails, divToPutPostings)=>{
        try {
            let posts;
          const date = new Date();
          const day = date.getDay();
          
          if(day === 0 || day === 5){
            posts = await db.collection('housePostings').where("imagesAvailable", "==", true )
                        .orderBy("propertyDetails.datePosted").limit(1).get();
      
          }
          else if(day === 1 || day === 4){
            posts = await db.collection('housePostings').where("imagesAvailable", "==", true )
                        .orderBy("propertyDetails.propertyUsage").limit(1).get();
      
          }
          else if(day === 2 || day === 6){
            posts = await db.collection('housePostings').where("imagesAvailable", "==", true )
                        .orderBy("propertyDetails.propertyDescription").limit(1).get();
                       
          }
          else if(day === 3){
            posts = await db.collection('housePostings').where("imagesAvailable", "==", true )
                        .orderBy("propertyDetails.propertyStatus").limit(1).get();
                    
          }
          else{
            console.log('Its a bad day to feature a property');
          }
            
        featuredPostCard(posts, divToPutDetails, divToPutPostings)
          } catch (err) {
          console.error(err.message, err);
        }
      }
    
    //   What to be posted whenever we call the featured property
    const featuredPostCard = (posts,  divToPutDetails, divToPutPostings)=>{
    const activeImage = (image) =>{
        return (
         

            `<div class="carousel-item active">
                <img class="d-block w-100" src=${image} alt="Second slide">
            </div>`
            )
    }

    // `<div class="carousel-item featured__carousel--item active">
    // <img src="${image}" class="d-block featured__carousel--img" alt="...">
    // <div class="carousel-caption featured__carousel--caption d-none d-md-block">
    //     <h5 class="heading featured__carousel--heading">First slide label</h5>
    //     <p class="paragraph featured__carousel--paragraph">Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
    // </div>
    // </div>`
    const allOtherImages = (image) =>{
        return (
            // `<div class="carousel-item featured__carousel--item">
            // <img src="${image}" class="d-block featured__carousel--img" alt="...">
            // <div class="carousel-caption featured__carousel--caption d-none d-md-block">
            //     <h5 class="heading featured__carousel--heading">First slide label</h5>
            //     <p class="paragraph featured__carousel--paragraph">Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            // </div>
            // </div>`

            `<div class="carousel-item">
                <img class="d-block w-100" src=${image} alt="Second slide">
            </div>`
            )
        }
    
    try {
        posts.forEach(post=>{
        if(post.data().imagesFiles) {
            for(const [imageName, imageUrl, index] of Object.entries(post.data().imagesFiles)) 
            { 
                if(imageName === "image1"){
                divToPutPostings.innerHTML += activeImage(imageUrl)
                }else{
                divToPutPostings.innerHTML += allOtherImages(imageUrl)
                }
            }
        }else{
            console.log("You have no images")
        }
        const data = post.data().propertyDetails;
    
        const html = ` 
        <div class="text-center">
            <table class="table table-hover">
            <thead>
                <tr>
                <th scope="col">Property Details</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td> <strong>Price: </strong></td>
                <td>${data.price}</td>
                </tr>
                <tr>
                <td><strong>No_ of rooms:</strong></td>
                <td>${data.rooms} rooms</td>
                </tr>
                <tr>
                <td>Location:</td>
                <td>${data.location}</td>
                </tr>
                <tr>
                <td>Property Status: </td>
                <td>${data.propertyStatus}</td>
                </tr>
                <tr>
                <td>Property Usage: </td>
                <td>${data.propertyUsage}</td>
                </tr>
                <tr>
                <td>Property Size: </td>
                <td>${data.propertyDescription}</td>
                </tr>
                <tr>
                <td>Property ID: </td>
                <td>${data.propertyId}</td>
                </tr>  
                </tbody>
            </table>
    
            <div class="card__icons featured__card--icons" >
            <a class="card__icons--item button" >
                <i class="fas fa-map-marked-alt"></i>
                <span class="text-black">MAP</span>
            </a>
            <a class="card__icons--item button landLordContactBtn" data-toggle="modal" data-target="#messageModal" id="${data.uid}">
                <i class="far fa-comment-alt"></i>
                CHAT
            </a>
    
            <a id="${data.propertyId}" class="card__icons--item viewDetailsBtn" href="">
                <strong> FULL DETAILS</strong>
            </a>
            <a class="card__icons--item">
                <svg  viewBox="0 0 16 16" class="bi bi-heart card__body--heart" style="right: 2.4rem; bottom: 4rem" id="${data.propertyId}" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                </svg>
            </a>
        
            </div>
        </div>
        `
    
        divToPutDetails.innerHTML += html;
        })
    
        
    } catch (err) {
        console.error(err.message)
    }
    }      

    //Check if User is loggedIn so that to access our chat and its functionality

  const MultiCarousel = document.querySelector('.MultiCarousel-inner')
const allFunctions = async()=>{
    const posts = await fetchPostsToHome(MultiCarousel);
    spinner.style.display ="none"
    // await chatFunction()
    await fetchFeaturedPostToHome(featuredDetails, featuredCarousel); 
    carouselFunctions();   
  
    let propertyArray = [];
    posts.forEach(property=>{
            propertyArray.push(property)
    });
    await getLikedPosts(propertyArray);
}

allFunctions()
