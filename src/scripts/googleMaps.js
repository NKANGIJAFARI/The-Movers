import { Loader } from '@googlemaps/js-api-loader';
 

  

let map;
let autocomplete;

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

loader
  .load()
  .then(() => {
     map = new google.maps.Map(document.getElementById("map"), mapOptions);
      addMarkers();

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
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(styleControl);
        styleControl.style.top = '10px';
        // Apply new JSON when the user chooses to hide/show features.
        document.getElementById('hide-poi').addEventListener('click', () => {
            map.setOptions({ styles: styles['hide'] });
        });
        document.getElementById('show-poi').addEventListener('click', () => {
            map.setOptions({ styles: styles['default'] });
        });
  
        autocompleteFunc()
  })
  .catch(e => {
    // do something
  });
  


//Markers array
const markersArray = [
    { coords: { lat: 0.303, lng: 32.5783 }, content: '<h1>Kampala</h1>' },

    {
      coords: { lat: 0.3456, lng: 32.5853 },
      content: '<h1>Kampala</h1>',
      iconImage:
        'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
    },
    { coords: { lat: 0.331697, lng: 32.571024 } },
  ];


  //A function to addMarkers to the map
  const addMarkers = () => {
    markersArray.forEach((marker) => {
      addMarker(marker);
    });
  };

  
    // A function to add a marker to show the search result of
    //The place a user selected
    const  addMarker = (props) => {
        var marker = new google.maps.Marker({
            position: props.coords,
            map: map,
        });

        if (props.iconImage) {
            marker.setIcon(props.iconImage);
        }

        //Check if it has the info window and display it
        if (props.content) {
            var infoWindow = new google.maps.InfoWindow({
            content: props.content,
            });

            marker.addListener('click', function () {
                infoWindow.open(map, marker);
            });
        }
    }

//A function to get users geographical location.
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.

    const geolocate =() => {
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
                content: '<h1>Current Location</h1>',
                //iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
                };

            map.setCenter(geolocation)
            map.setZoom(10); // Why 17? Because it looks good.
            addMarker(currentPositionInfo);

            const circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy,
            });
            autocomplete.setBounds(circle.getBounds());
            });
        }
    }


// Below is the function that does the auto complete when the 
//user is searching for the location where he wants the property.
  const autocompleteFunc =()=>{

    autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('searchTextField'),
      { types: [] }
    );

    geolocate();
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

        console.log(place.geometry.location);
        console.log(place);

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