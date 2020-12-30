import 'bootstrap';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/propertyListings.css';
import '../styles/main.css'
import '../Sass styles/main.scss'
import '../styles/propertyDetails.css'
import { db, database, auth } from './firebaseConfig';

import pic from "../images/star2.png";
import { getLikedPosts } from './cardsFunctionality';


const propertyArray = [];
let relatedPosts = [];
let post = null;


const postIt = async()=>{

  const landlordDetails = document.querySelector('.landlordDetailsWrapper');
  const propertyPhotosWrapper = document.querySelector('.propertyPhotosWrapper');

  const detailsWrapper = document.querySelector('.detailsWrapper');
    
  //get the property Id in local storage and make a request of a doc 
  //with that id as its id from firestore
  const propertyId = localStorage.getItem('propIdToBeViewed');
  post = await db.collection('housePostings').doc(propertyId).get();

  propertyArray.push(post);

  if(post.data().imagesFiles){
    renderPropertyImages(post.data());
  }else{
    const image = document.createElement('img');
    image.src = post.data().propertyDetails.displayImage;
    propertyPhotosWrapper.append(image);
    alert('No images for this property, message landlord for details');
    const leftBtn = document.querySelector('.leftLst');
    const rightBtn = document.querySelector('.rightLst');
  }
  detailsWrapper.innerHTML = renderPropertyDetails(post.data().propertyDetails);
  landlordDetails.innerHTML = renderLandLordInfo(post.data().propertyDetails);

}


const renderPropertyImages = (post)=>{
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
      if(post.imagesFiles) {
        const imagesWrap = document.querySelector('.images__carousel--inner')
        for(const [imageName, imageUrl, index] of Object.entries(post.imagesFiles)) 
        { 
           if(imageName === "image1"){
             imagesWrap.innerHTML += activeImage(imageUrl)
           }else{
             imagesWrap.innerHTML += allOtherImages(imageUrl)
           }
        }
      }else{
        console.log("You have no images")
      }

  //   <div class="carouselSelectors">
  //     <img src="${post.imagesFiles.image1}" data-target="#propertyImagesCarousel"  data-slide-to="0" class="active">
  //     <img src="${post.imagesFiles.image2}"  data-target="#propertyImagesCarousel"  data-slide-to="1">
  //     <img src="${post.imagesFiles.image3}" data-target="#propertyImagesCarousel"  data-slide-to="2">
  //     <img src="${post.imagesFiles.image4}" data-target="#propertyImagesCarousel"  data-slide-to="3">
  //     <img src="${post.imagesFiles.image5}" data-target="#propertyImagesCarousel"  data-slide-to="4">
  //     <img src="${post.imagesFiles.image6}" data-target="#propertyImagesCarousel"  data-slide-to="5">
  //   </div>
  //   </div>
  // </div>
  // `    
  } catch (err) {
    console.error(err.message, err)
  }
 }

const renderPropertyDetails =(data)=>{
      return `

      <table class="table table-hover table-sm table-striped">
        <thead>
          <tr>
            <th scope="col">Label</th>
            <th scope="col">Details</th>

          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Code:</th>
            <td>${data.propertyId}</td>
          </tr>
          <tr>
            <th scope="row">Price</th>
            <td>Ugx <span>${data.price}</span></td>
          </tr>
          <tr>
            <th scope="row">Rooms</th>
            <td>${data.rooms}</td>
          </tr>
          <tr>
            <th scope="row">Category</th>
            <td>${data.propertyDescription}</td>
          </tr>
          <tr>
            <th scope="row">Status</th>
            <td>${data.propertyStatus}</td>
          </tr>
          <tr>
            <th scope="row">Usage</th>
            <td>${data.propertyUsage}</td>
          </tr>
          <tr>
            <th scope="row">Location</th>
            <td>${data.location}</td>
          </tr>
        </tbody>
      </table>
      <div class="text-center">
        <p><strong>Description</strong></p>
        <p style='word-wrap: break-word;'>${data.description}</p>
      </div>
      </div>
    </div>`
  }

// Render all property summary in a carousel
  const renderLandLordInfo = (data)=>{
    return`
    <div class="col-lg-2 col-md-3 col-sm-4 col-xs-4">
    <img src="${data.postedByImg}" style="width:130px; height:150px">
  </div>
  <div class="col-lg-5 col-md-5 col-sm-8 col-xs-8">
    <div class="landlordDetails">
    <table class="table table-hover table-sm table-striped">
    <thead>
      <tr>
        <th scope="col">Label</th>
        <th scope="col">Details</th>

      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Name</th>
        <td>${data.landLordName} </td>
      </tr>
      <tr>
        <th scope="row">Mobile</th>
        <td>phoneNumber</td>
      </tr>
      <tr>
        <th scope="row">WhatsApp</th>
        <td>+256-702139042</td>
      </tr>
      <tr>
        <th scope="row">Email Address</th>
        <td>${data.userEmail}</td>
      </tr>
  
    </tbody>
  </table>
      <!-- Landlord information will be inserted here by javascript -->
  
    </div>
    <form>
      <div class="form-group">
        <label for="message-text" class="col-form-label">Send Message to LandLord:</label>
        <textarea class="form-control" id="message-text"></textarea>
      </div>
      <div class="text-right">
        <button class="btn-primary btn ">Send</button>
      </div>
    
    </form>
    </div>
    <div class="col-lg-4">

    </div>
    `
  }


 const showRelatedPosts = async() =>{  
  const data = post.data()
  //This are details of the property selected.  
    const usage = data.propertyDetails.propertyUsage; 
    const status = data.propertyDetails.propertyStatus;
    const propUID = data.propertyDetails.uid;
    const location = data.propertyDetails.location;

    let times = 1;

    //Whenever no related by specified, we add 1 on times.
    //Whenever we get a related post of the specification, we push it to the array
  
//Bellow we shall get 3properties related to the selected property in 
//3 different times, by same landlord, status, location or usage.

//Get the posts related to the property by having same Uid
    const relatedPostByUid = await db.collection('housePostings')
        .where("propertyDetails.uid", "==", propUID).limit(1).get();
      
        if(relatedPostByUid.docs.length === 0){
          console.log("Found none by Uid");
          times = times + 1
        }else{
          relatedPostByUid.docs.forEach(doc=>{
          console.log("This is BY Uid ",doc.data());
          relatedPosts.push(doc);
        });
      };


//Get the posts related to the property by having same Locations
    const relatedPostByLocation = await db.collection('housePostings')
      .where("propertyDetails.propertyLocation", "==", location).limit(1).get()

    if(relatedPostByLocation.docs.length === 0){
      console.log("Found none by Location");
       times = times + 1;
    }else{
      relatedPostByLocation.docs.forEach(doc=>{
        relatedPosts.push(doc);
        console.log("This is BY Location ",doc.data())
      });
    }




//Get the posts related to the property by having same Usage
    const relatedPostByUsage = await db.collection('housePostings')
      .where("propertyDetails.propertyUsage", "==", usage).limit(times).get()

      console.log("This is for the usage", relatedPostByUsage.docs)
      if(relatedPostByUsage.docs.length === 0){
          console.log("Found none by Usage")
          times = times + 1
      }else{
          relatedPostByUsage.docs.forEach(doc=>{
            relatedPosts.push(doc);
            console.log("This is BY Usage ",doc.data())
        });
      };


      relatedPosts.forEach(post =>{ 
          const relatedPostsWrapper = document.querySelector('.relatedPosts');
          relatedPostsWrapper.innerHTML += postingCard((post.data().propertyDetails), "col-lg-4 col-md-6 col-sm-12")
      });
    }

    //Generating Post card
  const postingCard  = (data, size)=>{
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
      
  const allFunctions = async() =>{
    await postIt()
    await showRelatedPosts()
    await getLikedPosts(relatedPosts, auth.currentUser.uid);
  }

  allFunctions();