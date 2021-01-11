// export const postingCard  = (data)=>{
//     return`
//     <div  class="houseposting ${size}" >
//       <div  class=" ${data.propertyDescription} ${data.propertyUsage} " >
//         <div class="card text-center">
//           <p class="card-header card__header text-left">
//             <span class="card__price">Price: UgShs.
//               <span class="price">${data.price}</span >
//             </span>
//             <span class="card__rentSaleOption">${data.propertyStatus}</span>
//           </p>
    
//           <div class="card__ImgWrapper">
//             <img src="${data.displayImage}" class="card-img-top card__ImgWrapper--Img" alt="House Image">
//           </div>
    
//           <div class="card-body text-center cardInfo card__body">
//             <div class="card__icons">
//               <a class="card__icons--item button">
//                 <i class="fas fa-images"></i>
//                 <span>GALLERY</span>
//               </a>
//               <a class="card__icons--item button" >
//                 <i class="fas fa-map-marked-alt"></i>
//                 <span class="text-black">MAP</span>
//               </a>
//               <a class="card__icons--item button landLordContactBtn" id="${data.uid}">
//                 <i class="far fa-comment-alt"></i>
//                 CHAT
//               </a>
//             </div>
//             <p class="card-text card__body-text">
//               <span class="card__body--bedrooms"> ${data.rooms} rooms  </span>
//               <span class="card__body--category"> ${data.propertyDescription}
//             </p>
//             <p class="m-0 text-muted">
//               <strong><span class="location card__body--location">${data.location}</span></strong>
//             </p>
    
//             <span class="${data.propertyId}">
//               <a id="${data.propertyId}" class="card__body--viewDetails viewDetailsBtn" href="">
//                 <strong> FULL DETAILS</strong>
//               </a>
//             </span>
    
//             <!-- <a href="#landlordContacts" data-uid="${data.uid}" class="card__body--ContactBtn">CONTACT LANDLORD</a> -->
//           </div>
//           <div class="card__body--postedByDetails">
//             <img src="${data.postedByImg}" alt="Posted By" class="card__body--postedByImg">
//             <img src= "${pic}" class="card__body--starRating"></img>
//           </div>
//           <svg  viewBox="0 0 16 16" class="bi bi-heart card__body--heart" id="${data.propertyId}" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//               <path fill-rule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
//           </svg>
//         </div>
//       </div>
//     </div>
//     `
//     }
