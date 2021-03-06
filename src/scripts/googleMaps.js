import { Loader } from '@googlemaps/js-api-loader';
import {auth, storage, database, db} from './firebaseConfig';
import pic from "../images/star2.png";

//Button to show the propertyDetails and wrapper for the prop details
const showHidePropDetailsBtn = document.querySelector('.showHidePropDetails');
const showPropDetailsWrapper = document.querySelector('.showPropDetailsWrapper');
 
//Markers array
const markersArray = [];

let map;
let autocomplete;


// A function to add a marker to show the search result of
  //The place a user selected
  const  addMarker = (props) => {
    var marker = new google.maps.Marker({
        position: props.coords,
        map: map,
    });

    // const iconBase =
    // "https://developers.google.com/maps/documentation/javascript/examples/full/images/";
    // const icons = {
    //   parking: {
    //     icon: iconBase + "parking_lot_maps.png",
    //   }
    // }


    marker.setValues({type: "pointer", id: props.propertyId});
    //new google.maps.Size(21, 34);

  
    if (props.iconImage) {
      var pinIcon = new google.maps.MarkerImage(
          props.iconImage,
          //new google.maps.Point(10, 34),
          new google.maps.Size(42,68)
        );
        marker.setIcon(pinIcon);
        // marker.setIcon(props.iconImage);
    }

    //Check if it has the info window and display it
    if (props.content) {
        var infoWindow = new google.maps.InfoWindow({
          content: props.content,
        });

        marker.addListener('mouseover', function () {
            infoWindow.open(map, marker);
        });
        marker.addListener('mouseout', function () {
          infoWindow.close(map, marker);
        });
        marker.addListener('click', function (event)
         { showPropertyOnClickedMarker(this.id) })
    }
  }

 //A function to addMarkers to the map
  const addMarkers = () => {
    markersArray.forEach((marker) => {
      addMarker(marker);
    })
  };

  const postingCard  = (data)=>{
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

const getFromDatabase = async () =>{
  try {
    database.ref('locationsCoords/').once('value').then((snapshot)=>{
      snapshot.forEach(snap =>{
        const data = snap.val();
        const iconImageSrc = `<img src="./images/iconpng.png" alt=""></img>`
        const propertyLocationObject = {
          propertyId : data.propertyId,
          coords: {lat: data.lat, lng: data.lng },
          content: `
              <div class="infowindow__content">
                <h4> Price: ${data.price}.</h4>
                <h4> Rooms: ${data.rooms}</h4>
                <h4> Satus: ${data.propertyStatus}</h4>
                <h4 class="mapViewDetailsBtn"> Usage: ${data.propertyUsage}</h4>
    
                <div class="text-center">
                  <a href="facebook.com" class="mapViewDetailsBtn" id=${data.propertyId} style="font-size: 14px">view details</a>
                </div>
              </div>
              `,
          iconImage: "https://firebasestorage.googleapis.com/v0/b/the-movers-2020.appspot.com/o/maps%20icons%2Fnew%20icon.png?alt=media&token=56853d11-42f1-4366-b468-25f3f309e99d",
            
        }
    
        markersArray.push(propertyLocationObject);
      });
    
      addMarkers();
    })
  } catch (error) {
    console.log(error.message)
  }
}

getFromDatabase();

//A function to get users geographical location.
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.

  const geolocate = () => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {

          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
          };

          //This object will be used by the add marker to show the user their
          //Location immediately when they open the map.
          const currentPositionInfo = {   
              coords: { lat: lat, lng: lng },
              content: '<h3>Current Location</h3>',
              //iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
              };

          map.setCenter(geolocation)
          map.setZoom(13); // Why 17? Because it looks good.
          addMarker(currentPositionInfo);

          // const circle = new google.maps.Circle({
          //     center: geolocation,
          //     radius: position.coords.accuracy,
          // });
          // autocomplete.setBounds(circle.getBounds());
          });
      }
  }



// Below is the function that does the auto complete when the 
//user is searching for the location where he wants the property.
const autocompleteFunc =()=>{

  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('searchTextField'),{ types: [] }
  );

  
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

  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  const marker = new google.maps.Marker({
    map,
    anchorPoint: new google.maps.Point(0, -29),
  });


  autocomplete.addListener('place_changed', () => {
      infowindow.close();
      marker.setVisible(false);
      const place = autocomplete.getPlace();
      
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert(
          "Choose on the listed locations, '" + place.name + "'"
        );
        return;
      }

      // // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17); // Why 17? Because it looks good.
      }
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
      let address = '';

      if (place.address_components) {
        address = [
          (place.address_components[0] &&
            place.address_components[0].short_name) ||
            '',
          (place.address_components[1] &&
            place.address_components[1].short_name) ||
            '',
          (place.address_components[2] &&
            place.address_components[2].short_name) ||
            '',
        ].join(' ');
      }
      infowindowContent.children['place-icon'].src = place.icon;
      infowindowContent.children['place-name'].textContent = place.name;
      infowindowContent.children['place-address'].textContent = address;
      infowindow.open(map, marker);
    });
}




//Google maps initiating 
  const loader = new Loader({
    apiKey: "AIzaSyBP2U4W-gt6pOx1pZUa--W13RqU8ob_or8",
    version: "weekly",
    libraries: ["places"]
  });
  
  loader.load()
    .then(() => {
      const mapOptions = {
        mapTypeControl: true,
        mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                position: google.maps.ControlPosition.LEFT_TOP,
              },
        fullscreenControl: true,
        center: { lat: 0.3476, lng: 32.5825 },
        zoom: 12
      };

       // mapOptions.fullscreenControlOptions.position = google.maps.ControlPosition.BOTTOM_RIGHT


       map = new google.maps.Map(document.getElementById("map"), mapOptions);
        //addMarkers();
        //geolocate()
        autocompleteFunc()

     


         
         // map.mapTypeControlOptions.ControlPosition.TOP_CENTER;
       // position: maps.ControlPosition.TOP_CENTER
  
      // Add controls to the map, allowing users to hide/show features on the map.
      const styles = {
          default: [],
          hide: [
              {
              featureType: 'poi.business',
              stylers: [{ visibility: 'off' }],
              },
              {
              featureType: 'transit',
              elementType: 'labels.icon',
              stylers: [{ visibility: 'off' }],
              },
          ],
          };
  
          const styleControl = document.getElementById('style-selector-control');
          if(screen.availWidth > 575){
            map.controls[google.maps.ControlPosition.TOP_CENTER].push(styleControl);
          }else if(screen.availWidth < 575){
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(styleControl);
          }
          const showHideBusiness = document.getElementById('showHideBusiness');
          map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(showHideBusiness);
          
          styleControl.style.top = '10px';


          // Apply new JSON when the user chooses to hide/show features.
           map.setOptions({ styles: styles['hide'] });
          document.getElementById('hide-poi').addEventListener('click', () => {
              map.setOptions({ styles: styles['hide'] });
          });
          document.getElementById('show-poi').addEventListener('click', () => {
              map.setOptions({ styles: styles['default'] });
          });
    }).catch(error  => {
      console.log(error)
      // do something
    });


const showPropertyOnClickedMarker = async(propId) =>{
  const showPropDetailsWrapper = document.querySelector('.showPropDetailsWrapper');
  const showPropertyDetails = document.querySelector('.showPropDetails')

  const property =  await db.collection('housePostings').doc(propId).get();
  const data = property.data().propertyDetails;
  showPropertyDetails.innerHTML = postingCard(data);
  if( showPropDetailsWrapper.classList.contains('active')){
    return
  }else{
    showPropDetailsWrapper.classList.add('active');
    showHidePropDetailsBtn.innerHTML = `<i class="fas fa-chevron-left">`
  }
}

//  Below manages the click of anarrow on the left side of 
//The google maps, to sho or hide the selected properties wrapper.
showHidePropDetailsBtn.addEventListener('click', ()=>{
  if(showPropDetailsWrapper.classList.contains('active')){
    showPropDetailsWrapper.classList.remove('active');
    showHidePropDetailsBtn.innerHTML = `<i class="fas fa-chevron-right">`
  }else{
    showPropDetailsWrapper.classList.add('active');
    showHidePropDetailsBtn.innerHTML = `<i class="fas fa-chevron-left">`;
  }
});


// if(showPropDetailsWrapper.classList.contains('active')){
//   showHidePropDetailsBtn.innerContent += `<i class="fas fa-chevron-left"></i>`
// }else{
//   showHidePropDetailsBtn.innerContent += `<i class="fas fa-chevron-left"></i>`
// }








  //Get all the properties to be displayed on the map as markers
  // const getPropertiesFromDatase = async() =>{
    
  //     // ...
  // }

  // setTimeout(()=>{
  //     const view = document.getElementById('TMO3D6DFE');
  //     console.log(view.getAttribute('id'))
  //     const viewDetailsBtns = document.querySelectorAll(".infowindow__content");
  //     console.log(viewDetailsBtns);
  //     // viewDetailsBtns.forEach(btn =>{
  //     //   btn.addEventListener('click', async(e)=>{
  //     //     const propId = e.target.getAttribute('id');
  
  //     //     const propDetails = await db.collection('properties').doc(propId).get();
  
  //     //     console.log(propDetails);
  
  //     //   })
  //     // })
  // }, 6000)




 
