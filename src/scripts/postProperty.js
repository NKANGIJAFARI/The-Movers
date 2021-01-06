import 'bootstrap';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Sass styles/main.scss'

import * as firebase from 'firebase/app'
import 'firebase/storage';
import {auth, storage, database, db} from './firebaseConfig';
import { sub } from 'date-fns';
import { Loader } from '@googlemaps/js-api-loader';

 const submitAdForm = document.querySelector('.submitAdForm');
 const labels = document.querySelectorAll('.form-row-field');
const inputs = document.querySelectorAll('.form-control');
const formGroups = document.querySelectorAll('.form-group');

//Lets do an google maps Api  auto-complete on the input 
//field for the location

let autocomplete;
let selectedLocation;
let selectedLocationCoords = {};

//Google maps initiating 
const loader = new Loader({
  apiKey: "AIzaSyBP2U4W-gt6pOx1pZUa--W13RqU8ob_or8",
  version: "weekly",
  libraries: ["places"]
});


loader
  .load()
  .then(() => {

        autocompleteFunc()

  })
  .catch(error => {
    console.log(error.message)
  });
  
  //user is searching for the location where he wants the property.
  const autocompleteFunc =()=>{

    autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('location'),
      { types: [] }
    );

    //geolocate();

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    // autocomplete.bindTo('bounds', map);

    // autocomplete.setFields([
    //   'address_components',
    //   'geometry',
    //   'icon',
    //   'name',
    // ]);

    //Make autocomplete search only in one country, for my case its Uganda
    
    autocomplete.setComponentRestrictions({ country: ['ug'] });

    // const infowindow = new google.maps.InfoWindow();
    // const infowindowContent = document.getElementById('infowindow-content');
    // infowindow.setContent(infowindowContent);
    // const marker = new google.maps.Marker({
    //   map,
    //   anchorPoint: new google.maps.Point(0, -29),
    // });


autocomplete.addListener('place_changed', () => {
    // infowindow.close();
    // marker.setVisible(false);
    const place = autocomplete.getPlace();

    //Give location field selected place as its value to be sent to 
    //Cloud firestore as the location.
    selectedLocation = place.formatted_address;


    selectedLocationCoords = {
        lat : place.geometry.location.lat(),
        lng : place.geometry.location.lng()
    }
  })
}

auth.onAuthStateChanged((user)=> {
    if (user) {
        submitAdForm.addEventListener('submit', async(e)=>{
            e.preventDefault();
        
           const rooms = submitAdForm['rooms'].value;
           const location = selectedLocation;
           const price = submitAdForm['price'].value;
           const description = submitAdForm['description'].value;
           const propertyId = ('TM' + Math.random().toString(36).substr(2, 7)).toUpperCase();
           const uid = auth.currentUser.uid;
           const displayName = auth.currentUser.displayName;
           const propertyStatus = submitAdForm.propertyStatus.options[submitAdForm.propertyStatus.selectedIndex].value;
           const propertyUsage = submitAdForm.propertyUsage.options[submitAdForm.propertyUsage.selectedIndex].value;
           const propertyDescription = submitAdForm.propertyDescription.options[submitAdForm.propertyDescription.selectedIndex].value;
           const userEmail = auth.currentUser.email;
             let profilePic, landLordName;
            await db.collection('users').doc(auth.currentUser.uid).get().then((user)=>{
                 profilePic = user.data().profilePic;
                 landLordName = user.data().Name;
                // whatsAppNumber = user.data().whatsAppNumber;
            })
        
        //Uploading Image To Storage 
            const ref = storage.ref();
            const selectedImage = document.getElementById("imageUpload").files[0];
            const fileName = (+new Date()) + '-' + selectedImage.name;
            
            const width = 500; const height = 300;
            //const fileName = e.target.files[0].name;
            const reader = new FileReader();
            reader.readAsDataURL(selectedImage);
            reader.onload = event => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                        const elem = document.createElement('canvas');
                        elem.width = width;
                        elem.height = height;
                        const context = elem.getContext('2d');
                        // img.width and img.height will contain the original dimensions
                        context.drawImage(img, 0, 0, width, height);
                        context.canvas.toBlob((blob) => {
                                const file = new File([blob], fileName, {
                                type: 'image/jpeg',
                                lastModified: Date.now()
                                });
                            uploadNow(file)
                        }, 'image/jpeg', 1); 
                    },
                    reader.onerror = error => console.log(error.message);
            };
       
   const uploadNow = async(file) =>{
      const metadata = {contentType: file.type};

    //Lets first upload the coords to the real-time datbase so that 
    //if the connection gets lost on upload, we just get the coords and no dat
        await database.ref('locationsCoords/' + propertyId).set({
            propertyId: propertyId,
            price: price,
            rooms: rooms,
            location: location,
            propertyStatus: propertyStatus,
            propertyUsage: propertyUsage,
            lat: selectedLocationCoords.lat,
            lng: selectedLocationCoords.lng,
            availability: "available"
        })

            //Bellow starts the upload after compressing the image
            const task = ref.child('housePostings').child(propertyId).child("Display Image").put(file, metadata);
            task
            .then((snapshot) => snapshot.ref.getDownloadURL())
            .then((imageUrl) => {
                //adding Data TO storage 
              
                db.collection('housePostings').doc(propertyId).set({
                    propertyDetails: {
                        uid : uid,
                        displayImage : imageUrl,
                        price: price,
                        rooms: rooms,
                        location: location,
                        description: description,
                        propertyUsage: propertyUsage,
                        propertyDescription: propertyDescription,
                        propertyStatus: propertyStatus,
                        displayName: displayName, 
                        propertyId : propertyId,
                        userEmail: userEmail,
                        postedByImg: profilePic,
                        landLordName : landLordName,
                        availability: "available",
                        datePosted: firebase.firestore.FieldValue.serverTimestamp()
                    } 
                })
                })
            .then( 
                ()=>{
                    document.getElementById("submitPostingsuccessfull").style.display = "block";
                    document.getElementById("submitPostingsuccessfull").innerHTML = "Succesfully Posted";        
                    
                    setTimeout(()=>{
                        document.getElementById("submitPostingsuccessfull").style.display = "none";
                        document.getElementById("submitPostingsuccessfull").innerHTML = "Succesfully Posted";        
                    }, 3500);
                         
                    }
                ).then( 
                    ()=>{                        
                        setTimeout(function(){
                            var user = firebase.auth().currentUser;
                            if(user !== null){
                                window.location.href = "userProfile.html";    
                                            } 
                                            }, 2000);
                                                 }
                        ).catch(err=>{
                            console.log(err, err.message)
                        })
   }        

             submitAdForm.reset();
        })
        } else {
    } 
  });



  document.getElementById("imageUpload").addEventListener("change", (e) => {
    const width = 500; const height = 300;
    const fileName = e.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
                const elem = document.createElement('canvas');
                elem.width = width;
                elem.height = height;
                const context = elem.getContext('2d');
                // img.width and img.height will contain the original dimensions
                context.drawImage(img, 0, 0, width, height);
                context.canvas.toBlob((blob) => {
                    const file = new File([blob], fileName, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    console.log("COMPRESSED",file);
                }, 'image/jpeg', 1);

                
            },
            reader.onerror = error => console.log(error);
    };
});

//    const submitAdForm = document.querySelector('.submitAdForm');
//    const labels = document.querySelectorAll('.form-row-field');
//   const inputs = document.querySelectorAll('.form-control');
//   const formGroups = document.querySelectorAll('.form-group');
  
  
//   firebase.auth().onAuthStateChanged((user)=> {
//       if (user) {
//           console.log(`${auth.currentUser.email} is logged In`);
//       const submitPost = async(profilePicUrl) =>{
//           submitAdForm.addEventListener('submit', (e)=>{
//               e.preventDefault();
          
//           const rooms = submitAdForm['rooms'].value;
//           const location = submitAdForm['location'].value;
//           const price = submitAdForm['price'].value;
//           const description = submitAdForm['description'].value;
//           const propertyId = "BK01900";
//           const uid = auth.currentUser.uid;
//           const displayName = auth.currentUser.displayName;
//           const propertyCategory = submitAdForm.propertyCategory.options[submitAdForm.propertyCategory.selectedIndex].value;
//           const propertyUsage = submitAdForm.propertyUsage.options[submitAdForm.propertyUsage.selectedIndex].value;
//           const propertyDescription = submitAdForm.propertyDescription.options[submitAdForm.propertyDescription.selectedIndex].value;
//           const userEmail = auth.currentUser.email;
//           const postedByImg = profilePicUrl;
//           //Uploading Image To Storage 
//               const ref = storage.ref();
//               const file = document.getElementById("addimage").files[0]
//               const name = (+new Date()) + '-' + file.name;
//               const metadata = {contentType: file.type};
//               const task = ref.child("postings").child(name).put(file, metadata);
//               task
//               .then((snapshot) => snapshot.ref.getDownloadURL())
//               .then((imageUrl) => {
//                   //adding Data TO storage 
//               database.ref(`postings/`).push().set({
//                   uid : uid,
//                   imageUrl : imageUrl,
//                   price: price,
//                   rooms: rooms,
//                   location: location,
//                   description: description,
//                   propertyUsage: propertyUsage,
//                   propertyDescription: propertyDescription,
//                   propertyCategory: propertyCategory,
//                   displayName: displayName, 
//                   propertyId : propertyId,
//                   userEmail: userEmail,
//                   profilePicUrl: postedByImg
//               })
//                   })
//               .then( 
//                   ()=>{
              
//               document.getElementById("submitPostingsuccessfull").style.display = "block";
//               document.getElementById("submitPostingsuccessfull").innerHTML = "Succesfully Posted";
                                      
//                       }
//                   ).then( 
//                       ()=>{                        
//                           // setTimeout(function(){
//                           //     var user = firebase.auth().currentUser;
//                           //     if(user !== null){
//                           //         window.location.href = "userProfile.html";    
//                           //                     } 
//                           //                     }, 2000);
//                                                   }
//                           ).catch(err=>{
//                               console.log(err, err.message)
//                           })
                          
//           submitAdForm.reset();
//           })
//       }
  
//       const uploadPost = async(userInfo)=>{
//           db.collection('users').doc(auth.currentUser.uid).get().then(response=>{
//              const userInfo = response.data()
//           })
//           return userInfo;
//        }
  
//        const fireToUploadPost = async()=>{
//           const response = await uploadPost();
//           const submit = await submitPost(response.profilePic);
//           return submit;
//        }
  
//       } else {
//           //If not signed in, do this
//    } 
//   });
   
  
 