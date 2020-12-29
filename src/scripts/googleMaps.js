import { Loader } from '@googlemaps/js-api-loader';
import {auth, storage, database, db} from './firebaseConfig';
import {postingCard} from './fetchPostings';

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

    marker.setValues({type: "point", id: props.propertyId});

    if (props.iconImage) {
        marker.setIcon(props.iconImage);
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
    console.log(markersArray)
    markersArray.forEach((marker) => {
      addMarker(marker);
      console.log("added markers");
    })
  };

const getFromDatabase = async () =>{
  database.ref('locationsCoords/').once('value').then((snapshot)=>{
    console.log('PROPERTIES ARE GOT')
    snapshot.forEach(snap =>{
      const data = snap.val();
      console.log(data);
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
        iconImage:
          'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      }
  
      markersArray.push(propertyLocationObject);
    });
  
    addMarkers();
  })
}

getFromDatabase();
  console.log("function", getFromDatabase)

//A function to get users geographical location.
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.

  const geolocate = () => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            console.log(position.coords.latitude)

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

      // console.log(place.geometry.location);
      // console.log(place);
      // console.log(place.address_components[0].types);
      // console.log(place.address_components[1].types);
      // console.log(place.address_components[2].types);
      

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
  
  const mapOptions = {
    mapTypeControl: true,
    center: { lat: 0.3476, lng: 32.5825 },
    zoom: 10
  };
  
  loader.load()
    .then(() => {
       map = new google.maps.Map(document.getElementById("map"), mapOptions);
        //addMarkers();
        //geolocate()
        autocompleteFunc()
  
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
          map.controls[google.maps.ControlPosition.TOP_CENTER].push(styleControl);

          const showHideBusiness = document.getElementById('showHideBusiness');
          map.controls[google.maps.ControlPosition.TOP_CENTER].push(showHideBusiness);
          
          styleControl.style.top = '10px';


          // Apply new JSON when the user chooses to hide/show features.
          // map.setOptions({ styles: styles['hide'] });
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
  console.log(property.data());
  const data = property.data().propertyDetails;
  showPropertyDetails.innerHTML = postingCard(data);
  if( showPropDetailsWrapper.classList.contains('active')){
    return
  }else{
    showPropDetailsWrapper.classList.add('active');
    showHidePropDetailsBtn.innerHTML = `<i class="fas fa-chevron-left">`
  }
}


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




 
