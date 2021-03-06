import 'bootstrap';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../Sass styles/main.scss';

// import * as firebase from 'firebase/app'
// import 'firebase/storage';
import {db, auth, database, storage} from './firebaseConfig';
import { data } from 'jquery';

auth.onAuthStateChanged(function(user) {
  if (user) {
    
    allFunctions()

    console.log('Logged in as:', user.email);
    document.getElementById(`suh`).innerHTML = `YOUR POSTS`;

    //UPDATE PROFILE PICTURE OF A USER
    const profilePicUpload = document.querySelector('#profilePicUpload');
    const uploadProfilePic = document.querySelector('#uploadProfilePic');
    profilePicUpload.addEventListener('change', (e)=>{
      const image = document.getElementById('output');
      image.src = URL.createObjectURL(e.target.files[0]);

      uploadProfilePic.addEventListener('click', ()=>{
        const ref = storage.ref();
            const file = e.target.files[0]
            const name = auth.currentUser.uid;
            const metadata = {contentType: file.type};
            const task = ref.child("userImages").child(name).put(file, metadata);
            task
            .then((snapshot) => snapshot.ref.getDownloadURL())
            .then(async(imageUrl) => {
              await db.collection('users').doc(auth.currentUser.uid).update({
                profilePic : imageUrl
              })
              // await db.collection('housePostings').where("propertyDetails.uid", "==", auth.currentUser.uid).update({
              //   "propertyDetails.postedByImg" : imageUrl
              // })
                })
            .then(()=>{
              
            document.getElementById("profilePicUploadSuccessMsg").style.display = "block";                                    
                    }
                ).then( 
                    ()=>{                        
                        setTimeout(function(){
                                window.location.href = "userProfile.html";    
                                            }, 1000);
                                                 }
                        ).catch(err=>{
                            console.log(err.message)
                        })
      })
    });



    //UPDATE USER PHONE NUMBER IN THE FIRESTORE USER COLLECTION
    const updatePhoneNumberForm = document.querySelector('#updatePhoneNumberForm');
    updatePhoneNumberForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const enteredNumber = updatePhoneNumberForm['numberUpdate'].value.trim();
      const confirmedNumber = updatePhoneNumberForm['confirmNumberUpdate'].value.trim();

      if(confirmedNumber !== enteredNumber){
        document.querySelector("#confirmNumberErrorMsg").style = 'display: block';
        updatePhoneNumberForm['confirmNumberUpdate'].style = "border: red 2px solid";
      
      }else{
        updateNumber(confirmedNumber).then(()=>{
          updatePhoneNumberForm.reset();
          document.querySelector('#numberUpdatesuccessMsg').innerHTML =`
                <p>Successfully updated your number to 
                  <span id="successMessage">${confirmedNumber}</span>
                </p>`;
          document.querySelector("#confirmNumberErrorMsg").style = 'display: none';
          updatePhoneNumberForm['confirmNumberUpdate'].style = "border: green 2px solid";
        })
      }
    })

    const updateNumber = async(confirmedNumber)=>{
      db.collection('users').doc(auth.currentUser.uid).update({
        PhoneNumber: confirmedNumber
      })
    } 


    //UPDATE USER EMAIL ADDRESS IN USER COLLECTION
    const currentEmail = document.querySelector('#currentEmail');
    currentEmail.innerText += auth.currentUser.email;
    const updateEmailForm = document.querySelector('#updateEmailForm');
    updateEmailForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const enteredEmail = updateEmailForm['emailUpdate'].value;
      const confirmedEmail = updateEmailForm['confirmEmailUpdate'].value;

      if(confirmedEmail !== enteredEmail){
        document.querySelector("#confirmEmailErrorMsg").style = 'display: block';
        updateEmailForm['confirmEmailUpdate'].style = "border: red 2px solid";
      }else{
        updateEmail(confirmedEmail).then(()=>{
          updateEmailForm.reset();
          document.querySelector('#emailUpdatesuccessMsg').innerHTML =`
                <p>Successfully updated your Email to 
                  <span id="successMessage">${confirmedEmail}</span>
                </p>`;
          document.querySelector("#confirmEmailErrorMsg").style = 'display: none';
          updatePhoneEmailForm['confirmEmailUpdate'].style = "border: green 2px solid";
    })
  }

    })

  const updateEmail = async(confirmedEmail)=>{
    db.collection('users').doc(auth.currentUser.uid).update({
      email : confirmedEmail
    })
  } 



}else {
    // No user is signed in.
  } 
});


const allFunctions = async () =>{
  await fetchUserPostings();
  updatePropertyStatus();
}

    //Selecting a category
const categorySelection = (data)=>{
  const categorySelection = document.querySelector('#categorySelection');
  const postings = document.querySelectorAll('.portfolio-item');
  categorySelection.addEventListener('change', (e)=>{
  
    if(e.target.value != data.category){
      postings.forEach(post=>{
        post.classList.add('hide');
      })
    }
  })
}
    
    // //var database = firebase.database();
    // var userPostings = database.ref("postings/");
  
  //Fetching UserPostings
  const fetchUserPostings =async()=>{

    const spinner = document.querySelector('.spin')

    const posts = await db.collection('housePostings').where('propertyDetails.uid', '==', auth.currentUser.uid).get();
    spinner.style.display ="none";
    posts.forEach(post=>{
      document.getElementById("ownerPosts").innerHTML += propertyCard(post.data().propertyDetails);
    })
    const editPostBtn = document.querySelectorAll('.editPostBtn');
    
    if(!editPostBtn){
      throw new error('Reload the page');
    }

    editPostBtn.forEach(button=>{
      button.addEventListener('click', (e)=>{
        e.preventDefault()
        const selectedPropertyId = e.target.parentElement.getAttribute('id');
        localStorage.setItem("idForPropertyToBeEdited", selectedPropertyId);
        window.location = "editPost.html"
      })
    })
  }

  
  //Generating propertyCard
  function propertyCard(data){
   return`
   <div class=" houseposting col-sm-12 col-md-6 col-lg-4" >
    <div class="${data.propertyDescription} ${data.propertyUsage} rounded" >
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
    
        <div class="card-body text-center p-0 mx-2 cardInfo card__body">
          <p class="card-text card__body--text">
            <span class="card__body--bedrooms"> ${data.rooms}rooms </span> 
            <span class="card__body--category">${data.propertyDescription} || </span>
          </p>
          <p>
            <span>
              <a href="#Property Information" class="editPostBtn" id="${data.propertyId}">
                <strong>EDIT POST  </strong>
              </a>
            </span>
            <span class="${data.propertyId}">
                <a id="${data.propertyId}" class="card__body--viewDetails viewDetailsBtn" href="#">
                <strong>  VIEW DETAILS</strong> </a>
            </span>
          </p>
          <p class="m-0 text-muted">
            <strong><span class="location">${data.location}</span></strong>
          </p>
  
          <div class="text-center mb-4 mt-4">
            <button type="button" data-propId="${data.propertyId}" data-propAvailability ="occupiued" class="btn btn-danger cardBtn card__body--btn updatePropertyStatusBtn">Occupied</button>
            <button type="button" data-propId="${data.propertyId}" data-propAvailability ="available" class="btn btn-success cardBtn card__body--btn updatePropertyStatusBtn">Availble</button>
            <button type="button" data-propId="${data.propertyId}" data-propAvailability ="underInnovation" class="btn btn-secondary cardBtn card__body--btn updatePropertyStatusBtn">Under Innovation</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
   }

  //Delete the postings

  const updatePropertyStatus = () =>{
    const updatePropertyStatusBtns = document.querySelectorAll('.updatePropertyStatusBtn');

    updatePropertyStatusBtns.forEach(btn =>{
      btn.addEventListener('click', (e)=>{
        const propId = e.target.getAttribute('data-propId');
        const propAvailability = e.target.getAttribute('data-propAvailability');

        db.collection('housePostings').doc(propId).update({
          "propertyDetails.availability" : propAvailability
          }).then(()=> console.log(`Updated to ${propAvailability}`))
        })
      })
  }




  //search function
  function searchFunction() {
    var search = document.getElementById('search');
    var filter = search.value.toUpperCase();
    var list =document.getElementsByClassName('card-title');
    for(i=0 ;i<list.length ;i++){
      // console.log(list[i].innerText);
        if(list[i].innerText.toUpperCase().indexOf(filter) > -1){
          list[i].parentElement.parentElement.parentElement.style.display="";
        }
      else{
        var a =list[i].parentElement.parentElement.parentElement;
        a.parentElement.removeChild(a);
      }
    }
  }
