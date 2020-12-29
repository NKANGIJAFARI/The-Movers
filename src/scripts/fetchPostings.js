'use strict';

import {database, db, auth} from './firebaseConfig';
import pic from "../images/star2.png";

export  const fetchPostsToPostings = async(divToPutPostings)=>{
  const posts = await db.collection('housePostings').get();
  if(window.location.pathname === "/propertyListing.html"){
    posts.forEach(post=>{
      divToPutPostings.innerHTML += postingCard(post.data().propertyDetails);
    })
    return posts;
  }
}

export  const fetchPostsToHome = async(divToPutPostings)=>{
  const posts = await db.collection('housePostings').orderBy("propertyDetails.datePosted").limit(10).get();
  posts.forEach(post=>{
    divToPutPostings.innerHTML += postingCardForHome(post.data().propertyDetails);
  });
  return posts;
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


const featuredPostCard = (posts,  divToPutDetails, divToPutPostings)=>{
  const activeImage = (image) =>{
    return (
        `<div class="carousel-item featured__carousel--item active">
          <img src="${image}" class="d-block featured__carousel--img" alt="...">
          <div class="carousel-caption featured__carousel--caption d-none d-md-block">
            <h5 class="heading featured__carousel--heading">First slide label</h5>
            <p class="paragraph featured__carousel--paragraph">Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </div>
        </div>`
        )
  }
  const allOtherImages = (image) =>{
    return (
        `<div class="carousel-item featured__carousel--item">
          <img src="${image}" class="d-block featured__carousel--img" alt="...">
          <div class="carousel-caption featured__carousel--caption d-none d-md-block">
            <h5 class="heading featured__carousel--heading">First slide label</h5>
            <p class="paragraph featured__carousel--paragraph">Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </div>
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



export const postingCard  = (data)=>{
  console.log(data)
    return`
    <div  class="houseposting" >
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
  `
  }


      