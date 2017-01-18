var selfPos
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.669309, lng: -117.86446649999999},
    zoom: 8,
    streetViewControl: false,
    mapTypeControl: false,
    styles: [
      {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{color: '#263c3f'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#6b9a76'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#38414e'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{color: '#212a37'}]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{color: '#9ca5b3'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#746855'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#1f2835'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{color: '#f3d19c'}]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{color: '#2f3948'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#17263c'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#515c6d'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#17263c'}]
      },
      {
        featureType: 'poi.business',
        stylers: [{visibility: 'off'}]
      }
    ]
  });
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      selfPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(selfPos);
      map.setZoom(15);
      setMarkers(map);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}
function handleLocationError(browserHasGeolocation, infoWindow, selfPos) {
  infoWindow.setPosition(selfPos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}
function setMarkers(map) {
  var image = {
    url: 'https://lh3.googleusercontent.com/axyILZv2CMpNmJB4r-PrYJzeYkSaEnhu26taFHR_WrUmwPNeKfHrASjZe2B-ag2c2wJRcrodyBE4XQ=w1440-h900-rw-no',
    scaledSize: new google.maps.Size(20, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32)
  }
  var shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly'
  };
  var marker = new google.maps.Marker({
    position: {lat: selfPos.lat, lng: selfPos.lng},
    map: map,
    icon: image,
    shape: shape,
    title: 'me',
    animation: google.maps.Animation.DROP,
    zIndex: 10
  })
  var tester1
  getDataPromise(map)
    .then((result) => result.json())
    .then((result) => {
      JSON.stringify(result);
      tester1 = result;
      addMarkers(tester1, map);
    })
    .catch((error) => console.error(error))
}

function getDataPromise(map) {
  return new Promise(((resolve, reject) => {
    const thenable = fetch('/markers');
    if (!thenable) {
      reject(thenable);
    }
    else {
      resolve(thenable);
    }
  }
), map)}

function addMarkers(array, map) {
  for (var i = 0; i < array.length; i++) {
    var pos = array[i].pos;
    var name = array[i].name;
    var type = array[i].type;
    var likes = array[i].likes;
    var image = {
      url: 'https://lh3.googleusercontent.com/X57gQ61tl2JKhBmcJxcpA_YNLjL8wR4Xy100p1gm5qs--uNprYEkZCU3NFmaR-rp1sxN_c85-H0GRnlJjIO3uUrZ8Aney7Ol=w2560-h1440-rw-no',
      scaledSize: new google.maps.Size(20, 20),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 20)
    }
    if (type === 'School') {
      image.url = 'https://lh3.googleusercontent.com/x7i9uu02DQyIzrZZIukdP63F31-H9NOeXPBpDBgKp0Dc-uJd2ZmJFU1FhTV35tsZEq2ZfFwHWoIF2HUh5Xg4XbpGPXkjhFg-hw=w2560-h1440-rw-no'
    }
    var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: 'poly'
    };
    if (likes > 0) {
      var likeText
      likes === 1 ? likeText = ' like!' : likeText = ' likes!'
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: image,
        shape: shape,
        title: name + " : " + likes + likeText,
        animation: google.maps.Animation.DROP,
        zIndex: 2
      })
    }
    else {
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: image,
        shape: shape,
        title: name,
        animation: google.maps.Animation.DROP,
        zIndex: 2
      })
    }
  }
}
