"use strict"

import 'bootstrap';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../styles/main.css';
import '../styles/editPost.css'

import '../Sass styles/main.scss';

//import { error } from 'jquery';
import * as firebase from 'firebase/app';
import {db, auth, database, storage} from './firebaseConfig';
import { add } from 'date-fns';

const editImages = document.querySelector(".editImages");
const propId = localStorage.getItem('idForPropertyToBeEdited');

const addImagesInput = document.querySelector('.addImagesInput');
const cancelButton = document.getElementById("cancelEdiTBtn")


//Whenever a property is received from the database, its saved in an array
//And also when uploading we save into an array and then when showing on scree
//we shall spread the array, but on upload, just post those that were not there.
let arrayOfimagesFromDB = [];
let arrayOfImagesFromUpload = [];
let successfullUploads= [];
let TotalImages = [...arrayOfImagesFromUpload, ...arrayOfimagesFromDB];
let imagesToBeDeletedFromStorage = [];
let numberFromDB = 0;

let usedSlots = [];
let availableIdSlots = [];



const propertyDetails = {
    description: " ",
    displayImage: "https://firebasestorage.googleapis.com/v0/b/the-movers-2020.appspot.com/o/housePostings%2FTMK034UY1%2FDisplay%20Image?alt=media&token=910fae1a-895c-4581-a400-0fe73c88c9d9",
    displayName: null,
    landLordName: "Zenia Lykke",
    location: "Kibuye - Kampala",
    postedByImg: "https://firebasestorage.googleapis.com/v0/b/the-movers-2020.appspot.com/o/userImages%2FiTGYtokuL1cQwyqAXoERn1uD3F73?alt=media&token=b1e621c1-2b4e-44f4-991a-b0a179cb6296",
    price: "300000000",
    propertyDescription: "countryHouse",
    propertyId: "TMK034UY1",
    propertyStatus: "For-Sale",
    propertyUsage: "Residential",
    rooms: "8",
    uid: "iTGYtokuL1cQwyqAXoERn1uD3F73",
    userEmail: "zenia@gmail.com"
}

//For each image added from DB this number will increase


// const  getIdSlots = () =>{
//     const avail =  6 - arrayOfimagesFromDB.length;

//     for(let i=0; i< avail; i++){
//         const num = arrayOfimagesFromDB.length + i;
//         availableIdSlots.push(`image${num}`);
//     }
// }      

const hideAddImagesInput = () =>{
    if(usedSlots.length === 6){
        console.log("mORE THAN 6", usedSlots.length);
         addImagesInput.style.display = "none";
        // addImagesInput.classList.add("hide");
        console.log(addImagesInput)
    }else if(usedSlots.length < 6){
        console.log("NO mORE THAN 6", usedSlots.length)
        // document.querySelector('#imagesAllowed').innerContent = (6 - usedSlots.length)
         addImagesInput.style.display = "block";
    }
}


const imageToBeUploadedCard = (image) =>{
    return  `
    <div class="imagewrap text-center" id="${image.imageNumber}">
        <img src = ${image.imageUrl} />
        <button type="button"  id="${image.imageNumber}"
            class="btn btn-danger btn-md button-delete-Image"> Delete Image 
        </button>

   
    </div>` ;      
}
{/* <select class="custom-select mr-sm-2" id="propertyViews">
<option selected>Image Description</option>
<option value="front-View">Front View</option>
<option value="back-View">Back View</option>
<option value="Gate">Gate</option>
<option value="Compound">Gate</option>
<option value="bed-room">Bed Room</option>
<option value="sitting-room">Sitting Room</option>
<option value="kitchen">Kitchen</option>
<option value="rear-view">Rear view</option>
<option value="balcony">alcony</option>
</select> */}

const showPropToBeEdited = async() =>{
    const property = await db.collection('housePostings').doc(propId).get();
    console.log(property.data())

    const editedDetails = document.querySelector(".editedDetails");
    const data = property.data().propertyDetails;
    const imagesFromDB = property.data().imagesFiles;

    const htmlForm = `
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
                        <td>
                            <input type="number" class="form__input form__input--sm" value="${data.price}" id="price" required>
                        </td
                    </tr>

                    <tr>
                        <th scope="row">Rooms</th>
                        <td>
                            <input name="rooms" type="number" class="form__input form__input--sm" value="${data.rooms}" id="rooms" required>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row">Location</th>
                        <td>
                            <input name="location" type="text" value="${data.location}" class="form__input" id="location" required>
                        </td>
                    </tr>

                    
                    <tr>
                        <th scope="row">Status</th>
                        <td>
                            <select name="status" class="form__input form__input--sm" id="propertyStatus" required>
                                <option value="For-rent" ${data.propertyStatus === "For-Rent" && "selected"}>For-Rent</option>
                                <option value="For-Sale" ${data.propertyStatus === "For-Sale" && "selected"}>For-Sale</option>
                            </select>    
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">Category</th>
                        <td>
                            <select name="propertyDescription"  class="form__input form__input--sm" required>
                               
                                <option value =${data.propertyDescription} selected>${data.propertyDescription}</option>
                                <option value="singleRoom">Single Room</option>
                                <option value="doubleRoom">Double rooms</option>
                                <option value="selfContained">Self Contained</option>
                                <option value="bungalow">Bungalow</option>
                                <option value="Apartment">Apartment</option>
                                <option value="countryHouse">Country House</option>
                                <option value="villa">Villa</option>
                                <option value="Mansion">Mansion</option>
                            </select>
                        </td>
                    </tr>


                    <tr>
                        <th scope="row">Usage</th>
                        <td>
                            <select name="propertyUsage" class=" form__input form__input--sm" id="propertyUsage" required>
                                <option value="Residential" ${data.propertyStatus === "Residential" && "selected"}>Residential</option>
                                <option value="Commercial" ${data.propertyStatus === "Commercial" && "selected"}>Commercial</option>
                            </select>
                        </td>
                    </tr>


                    <tr>
                        <th scope="row">Detailed Description</th>
                        <td>
                            <textarea name="description" class="form__input form__input--sm"   
                                id="description" rows="3" required>${data.description}</textarea>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">Display Image</th>
                        <td>
                            <input name="addimage" type="file" class="form__input form__input--sm" id="editDisplayImage">
                        </td>
                    </tr>
                    
                </tbody>
                </table>
        `
    editedDetails.innerHTML += htmlForm;

//Iterate through the images object from DB and for each image, push it to an array.

    if(!imagesFromDB){
        //throw new Error("There is no image");
        hideAddImagesInput();
        return
    }

    Object.entries(imagesFromDB).forEach((image, index) =>{
        console.log('From db', image)
        numberFromDB = numberFromDB + 1;
        const [key, value] = image;
        usedSlots.push(key);
        const imageObject = {newUpload: false, imageNumber: key, imageUrl: value};
        arrayOfimagesFromDB.push(imageObject);
        editImages.innerHTML += imageToBeUploadedCard(imageObject);
        hideAddImagesInput();
    });
}

const removePic = async() =>{
    const editImagesWrap = document.querySelector(".editImages")

    editImagesWrap.addEventListener('click', (e)=>{
        const imageWraps = document.querySelectorAll('.imagewrap');
        
        if(e.target.tagName === "BUTTON"){

            const btnId = e.target.getAttribute("id");

            for(let i=0; i < imageWraps.length; i++){
                const imageWrapId = imageWraps[i].getAttribute('id');
                if(imageWrapId === btnId){
                    console.log('FOund a match')
                    imageWraps[i].style.display = "none";
                    arrayOfimagesFromDB =  arrayOfimagesFromDB.filter(image => image.imageNumber !== imageWrapId );
                    arrayOfImagesFromUpload =  arrayOfImagesFromUpload.filter(image => image.imageNumber !== imageWrapId );
                    imagesToBeDeletedFromStorage.push(imageWrapId)
                    usedSlots = usedSlots.filter(slot => slot !== imageWrapId);
                }
            }

            hideAddImagesInput();
        }
    })
}

const fileUploadCompressor = async() => {
    //Check File API support
    if(window.File && window.FileList && window.FileReader){
        console.log('yOU CAN UPLOAD');
        const getImagesInput = document.querySelector('.insertImage');    
        getImagesInput.addEventListener("change", (e) => {
            console.log("Got the pics")

        //We have an array with images from database and for that reason,
        //We can only add few pics to make it 6. Each property can only have 6pics

        const numberOfImagesToUpload = (6 - usedSlots);
        if(numberOfImagesToUpload === 0){
            throw new Error("You cant upload new images, change existing ones")
        }
            
        const files = e.target.files;
        if(files.length > numberOfImagesToUpload){
            throw new error(
                `You can only Upload ${numberOfImagesToUpload} pictures because you have ${TotalArray} pictures already`)
        }

        fileCompressor(files);

            
            
            getImagesInput.value = ""
        });
    }
    else
    {
        throw new error('Your device doesnt support image uplaod')
    }
}

const fileCompressor = (files) =>{
    
    const width = 400; const height = 300;
    for(let i = 0; i< files.length; i++){

        const file = files[i];
        const fileName = "TM0000012";
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
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
                        lastModified: Date.now(),
                    });

            //Image Number is like its id, it will be determined by the images got from
            //Database, their number + 1;
                let imageNumber =null;
            
                if(!usedSlots.includes("image0")){
                    imageNumber = "image0"
                    usedSlots.push("image0")
                }else if(!usedSlots.includes("image1")){
                    imageNumber = "image1";
                    usedSlots.push("image1")
                }else if(!usedSlots.includes("image2")){
                    imageNumber = "image2";
                    usedSlots.push("image2")
                }else if(!usedSlots.includes("image3")){
                    imageNumber = "image3";
                    usedSlots.push("image3")
                }else if(!usedSlots.includes("image4")){
                    imageNumber = "image4";
                    usedSlots.push("image4")
                }else if(!usedSlots.includes("image5")){
                    imageNumber = "image5";
                    usedSlots.push("image5")
                }else{
                    console.log("Cant find one")
                }

                const imageObject = {
                    image: file,
                    newUpload: true,
                    imageNumber: imageNumber,
                    imageUrl: URL.createObjectURL(file)
                }
                    hideAddImagesInput();
                    arrayOfImagesFromUpload.push(imageObject);                
                    editImages.innerHTML += imageToBeUploadedCard(imageObject);
                    //hideAddImagesInput();
                }, 'image/jpeg', 1);
                },
                reader.onerror = error => console.log(error);
        };
    }
}


const playThem = async() =>{
    await showPropToBeEdited();
    await fileUploadCompressor();
    // changeImages();
    await removePic() 
}

playThem()


//This function will display images on the UI to make user know which images
//they have chosen to upload and also give this images a caption like bedroom,
//sitting room etc


//This function will be used to upload all the images that
//will be selected and given captions and will capture the captions also

document.querySelector(".showArrays").addEventListener('click', ()=>{
    console.log("This is from the databae",arrayOfimagesFromDB);
    //console.log("This is from the upload",arrayOfImagesFromUpload);
    // console.log(numberFromDB);
    // console.log(availableIdSlots);
    // console.log(successfullUploads);
    //selectImagesToUpload()
    console.log(usedSlots)
})

let fileName = "";

const uploadImages = async() =>{
    console.log("Uploading....")
    if(arrayOfImagesFromUpload.length === 0){
        imagesToBeDeletedFromStorage.forEach(image =>{
            var deleteImgRef = storage.ref().child(`housePostings/${propId}/${image}`);
                // Delete the file
            deleteImgRef.delete().then(function() {
                console.log(`File ${image} deleted successfully`)
            }).catch(function(error) {
                console.log(error, error.message)
            });
        })
        updateDocInFirestore();
    }
    arrayOfImagesFromUpload.forEach(file=>{
        const img = file.image;
        const metadata = {contentType: file.type};
        fileName = file.imageNumber;
        const uploadedImg = {imageNumber: fileName, imageUrl: ""}
        const task = storage.ref().child("housePostings").child(propId).child(fileName).put(img, metadata);
        task
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((imageUrl) => {
            uploadedImg.imageUrl = imageUrl;
            successfullUploads.push(uploadedImg);
            if(successfullUploads.length === arrayOfImagesFromUpload.length ){
                updateDocInFirestore()
            }
            
        }).then(()=>{        
            //After uploading, go to the view post to check new updates
            // localStorage.setItem("propIdToBeViewed", propId);
            // window.location.pathname = "/propertyDetails.html"
        }).catch(err=> console.log(err.message));

     })
}


// const submitButton = document.getElementById('submitBtn');



cancelButton.addEventListener('click', ()=>{
    console.log("delete")
    localStorage.setItem("propIdToBeViewed", propId);
            window.location.pathname = "/propertyDetails.html"
});


const editPostForm =  document.querySelector(".editPostForm");
editPostForm.addEventListener('submit', async(e)=>{
    e.preventDefault();
    await uploadImages();
    propertyDetails.rooms = editPostForm['rooms'].value;
    propertyDetails.location = editPostForm['location'].value;
    propertyDetails.price = editPostForm['price'].value;
    propertyDetails.description = editPostForm['description'].value;
    //const selectedImage = document.getElementById("editDisplayImage").files[0]
    propertyDetails.propertyStatus = editPostForm.propertyStatus.options[editPostForm.propertyStatus.selectedIndex].value;
    propertyDetails.propertyUsage = editPostForm.propertyUsage.options[editPostForm.propertyUsage.selectedIndex].value;
    propertyDetails.propertyDescription = editPostForm.propertyDescription.options[editPostForm.propertyDescription.selectedIndex].value;

//Create an object with all values from details form after update   

});

const updateDocInFirestore = async() =>{
    const allImages = [...successfullUploads, ...arrayOfimagesFromDB]

    console.log("all images",allImages)
    const {
        description,
        displayImage,
        displayName,
        landLordName,
        location,
        postedByImg,
        price,
        propertyDescription,
        propertyId,
        propertyStatus,
        propertyUsage,
        rooms,
        uid,
        userEmail  
    } = propertyDetails;


    const imagesFiles = {};
    allImages.forEach(image =>{
        console.log(image)
        console.log(image.imageNumber, image.imageUrl)
        imagesFiles[image.imageNumber] = image.imageUrl;
    });
    console.log(imagesFiles)

    db.collection('housePostings').doc(propId).update({
        imagesFiles: imagesFiles,
        imagesAvailable: true,
        propertyDetails: {
            uid : uid,
            price: price,
            rooms: rooms,
            location: location,
            description: description,
            propertyUsage: propertyUsage,
            propertyDescription: propertyDescription,
            propertyStatus: propertyStatus,
            propertyId : propId,
            userEmail: userEmail,
            postedByImg: postedByImg,
            landLordName : landLordName,
            displayImage: displayImage,
            displayName: displayName,
            datePosted: firebase.firestore.FieldValue.serverTimestamp()
        }
        
    }).then(()=>{
    })

}



$('.carousel.carousel-multi-item.v-2 .carousel-item').each(function(){
    var next = $(this).next();
    if (!next.length) {
      next = $(this).siblings(':first');
    }
    next.children(':first-child').clone().appendTo($(this));
  
    for (var i=0;i<4;i++) {
      next=next.next();
      if (!next.length) {
        next=$(this).siblings(':first');
      }
      next.children(':first-child').clone().appendTo($(this));
    }
  });