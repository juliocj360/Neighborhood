let user
let showingSelf = false

const user1 = document.getElementById('user-one')
const user2 = document.getElementById('user-two')
const user3 = document.getElementById('user-three')
const user4 = document.getElementById('user-four')

function userGetter() {
  const localUser = localStorage.getItem('user');
  if ((!!localUser) === false) {
    user = 'Julio';
    localStorage.setItem('user', 'Julio');
    console.log('No existing user found, set to user one');
    userUpdater(user);
  }
  else {
    user = localUser
    console.log('found user ' + user)
    userUpdater(user);
  }
}

let selfPos
let map
let markers = []

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
      },
      {
        featureType: 'poi.school',
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
  getDataPromise(map)
    .then((result) => result.json())
    .then((result) => {
      JSON.stringify(result);
      addMarkers(result, map);
    })
    .catch((error) => console.error(error))

  getUserPromise(map)
      .then((result) => result.json())
      .then((result) => {
        JSON.stringify(result);
        addUsers(result, map);
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

function getUserPromise(map) {
  return new Promise(((resolve, reject) => {
    const thenable = fetch('/users');
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
      url: events[0].url,
      scaledSize: new google.maps.Size(25, 25),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 25)
    }
    if (type === 'school') {
      image.url = events[4].url
    }
    else if (type === 'party') {
      image.url = events[1].url
    }
    else if (type === 'traffic') {
      image.url = events[2].url
    }
    else if (type === 'drink') {
      image.url = events[3].url
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

function findMe(element) {
  return element.name === user
}

function addUsers(array, map) {
  console.log('1')
  if (array.length === 0) {
    addSelfer(map);
    console.log('not found, added orange dude.')
  }
  for (var i = 0; i < array.length; i++) {
    var pos = array[i].pos;
    var name = array[i].name;
    var mood = array[i].mood;
    var image = {
      url: people[0].url,
      scaledSize: new google.maps.Size(40, 40),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 25)
    }
    if (mood === 'confused') {
      image.url = people[1].url
    }
    else if (mood === 'love') {
      image.url = people[2].url
    }
    else if (mood === 'unhappy') {
      image.url = people[3].url
    }
    else if (mood === 'sleepy') {
      image.url = people[4].url
    }
    if (name === user) {
      name = 'me';
      showingSelf = true
    }
    var test = array.find(findMe)
    console.log('2')
    if (!!test === false) {
      addSelfer(map);
      console.log('not found, added orange dude.')
    }
    var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: 'poly'
    };
    var marker = new google.maps.Marker({
      position: pos,
      map: map,
      icon: image,
      shape: shape,
      title: name,
      animation: google.maps.Animation.DROP,
      zIndex: 4
    })
    if (name === user) {
      markers.push(marker)
      console.log(markers)
    }
  }
}

function addSelfer(map) {
  var image = {
    url: 'pics/oranagedude.png',
    scaledSize: new google.maps.Size(32, 32),
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
  markers.push(marker)
  console.log(markers)
}

function userUpdater(user) {
  if (user === 'Julio') {
    user1.style.color = 'white';
    localStorage.setItem('user', 'Julio');
  }
  else if (user === 'Ron') {
    user2.style.color = 'white';
    localStorage.setItem('user', 'Ron');
  }
  else if (user === 'Tim') {
    user3.style.color = 'white';
    localStorage.setItem('user', 'Tim');
  }
  else if (user === 'Guest') {
    user4.style.color = 'white';
    localStorage.setItem('user', 'Guest');
  }
}

userGetter();

user1.addEventListener('click', () => {
  event.preventDefault();
  if (!(user === 'Julio')) {
    user = 'Julio';
    userUpdater(user);
    window.location.reload(true)
  }
  else {
    console.log('same')
  }
}, false)

user2.addEventListener('click', () => {
  event.preventDefault();
  if (!(user === 'Ron')) {
    user = 'Ron';
    userUpdater(user);
    window.location.reload(true);
  }
  else {
    console.log('same')
  }
}, false)

user3.addEventListener('click', () => {
  event.preventDefault();
  if (!(user === 'Tim')) {
    user = 'Tim';
    userUpdater(user);
    window.location.reload(true);
  }
  else {
    console.log('same')
  }
}, false)

user4.addEventListener('click', () => {
  event.preventDefault();
  if (!(user === 'Guest')) {
    user = 'Guest';
    userUpdater(user);
    window.location.reload(true);
  }
  else {
    console.log('same')
  }
}, false)

const inputButton = document.getElementById('left-button')
const showButton = document.getElementById('right-button')
const inputter = document.getElementById('inputter')
const mapEl = document.getElementById('map')

const events = [
  {
    name: 'restaurant',
    url: 'pics/restaurant.png'
  },
  {
    name: 'party',
    url: 'pics/PartyHat.png'
  },
  {
    name: 'traffic',
    url: 'pics/traffic.png'
  },
  {
    name: 'drink',
    url: 'pics/beer-icon2.png'
  },
  {
    name: 'school',
    url: 'pics/School-icon.png'
  }
]

const likeIcons = [
  {
    name: 'like',
    url: 'pics/like.png'
  },
  {
    name: 'dislike',
    url: 'pics/ProjectNotes.png'
  }
]

const faces = [
  {
    name: 'happy',
    url: 'pics/very happy.png'
  },
  {
    name: 'unhappy',
    url: 'pics/ProjectNotes.png'
  },
  {
    name: 'confused',
    url: 'pics/confused.png'
  },
  {
    name: 'love',
    url: 'pics/love.png'
  },
  {
    name: 'sleepy',
    url: 'pics/Sleeping.png'
  }
]

const people = [
  {
    name: 'happy',
    url: 'pics/yellowhappy.png'
  },
  {
    name: 'confused',
    url: 'pics/yellowconfused.png'
  },
  {
    name: 'love',
    url: 'pics/yellowlove.png'
  },
  {
    name: 'unhappy',
    url: 'pics/yellowunhappy.png'
  },
  {
    name: 'sleepy',
    url: 'pics/yellowsleepy.png'
  },
]

inputButton.addEventListener("click", () => {
  event.preventDefault();
  var el = document.getElementById('icon-row')
  if ((!!el) === true) {
    inputter.removeChild(el);
  }
  showInput();
})

showButton.addEventListener("click", () => {
  event.preventDefault();
  var el = document.getElementById('icon-row')
  if ((!!el) === true) {
    inputter.removeChild(el);
  }
  displayLoc();
})

function showInput() {
  inputter.style.display = 'block';
  var iconRow = document.createElement('div');
  iconRow.setAttribute('id', 'icon-row');
  inputter.appendChild(iconRow);
  console.log('1')
  for (var i = 0; i < events.length; i++) {
    var name = events[i].name
    var url = events[i].url
    var el = document.createElement('img');
    el.className = 'icon-input'
    el.setAttribute('src', url);
    el.setAttribute('id', name);
    iconRow.appendChild(el);
    iconListener(el);
  }
  hideListener()
}

function iconListener(el) {
  el.addEventListener('click', () => {
    event.preventDefault();
    console.log(el.id);
    formPage2(el);
  })
}

function formPage2(el) {
  const iconRow = document.getElementById('icon-row');
  if ((el.id === 'restaurant')||(el.id === 'school')) {
    inputter.removeChild(iconRow);
    liker(el);
  }
  else {
    inputter.removeChild(iconRow);
    submitter(el);
  }
}

function submitter(el) {
  const submitDiv = document.createElement('div');
  submitDiv.setAttribute('id', 'submit-div');
  submitDiv.textContent = 'Submitted'
  inputter.appendChild(submitDiv);
  console.log(el.id + ' submitted!');
  let array = []
  const marker = {}
  marker.name = el.id
  marker.pos = selfPos
  marker.type = el.id
  marker.like = 0
  array.push(marker)
  markerAdder(marker)
  fader(submitDiv)
  addMarkers(array, map)
}

function liker(el) {
  var iconRow = document.createElement('div');
  iconRow.setAttribute('id', 'like-row');
  inputter.appendChild(iconRow);
  console.log(el.id + ' lookign good')
  for (var i = 0; i < likeIcons.length; i++) {
    const name = likeIcons[i].name
    const url = likeIcons[i].url
    const likeEl = document.createElement('img')
    likeEl.className = 'like-input'
    likeEl.setAttribute('src', url);
    likeEl.setAttribute('id', name);
    iconRow.appendChild(likeEl);
    likeListener(el, likeEl)
  }
}

function likeListener(el, likeEl) {
  likeEl.addEventListener('click', () => {
    event.preventDefault();
    console.log(el.id + ' okay ' + likeEl.id);
    likeSubmitter(el, likeEl);
  })
}

function likeSubmitter(elOne, elTwo) {
  const likeRow = document.getElementById('like-row');
  inputter.removeChild(likeRow);
  const submitDiv = document.createElement('div');
  submitDiv.setAttribute('id', 'submit-div');
  submitDiv.textContent = 'Submitted'
  inputter.appendChild(submitDiv);
  let array = []
  const marker = {}
  marker.name = elOne.id
  marker.pos = selfPos
  marker.type = elOne.id
  marker.like = elTwo.id
  array.push(marker)
  fader(submitDiv)
  markerAdder(marker)
  addMarkers(array, map)
}

function fader(el) {
  inputter.className = 'animated fadeOut';
  setTimeout(() => {
    inputter.removeChild(el);
    hider();
    inputter.className = 'input-box'
  },2000)
}

function displayLoc() {
  inputter.style.display= 'block';
  console.log('2')
  var iconRow = document.createElement('div');
  iconRow.setAttribute('id', 'icon-row');
  inputter.appendChild(iconRow);
  for (var i = 0; i < faces.length; i++) {
    var name = faces[i].name
    var url = faces[i].url
    var el = document.createElement('img');
    el.className = 'icon-input'
    el.setAttribute('src', url);
    el.setAttribute('id', name);
    iconRow.appendChild(el);
    moodListener(el, iconRow);
  }
  hideListener()
}

function moodListener(el, iconRow) {
  el.addEventListener('click', () => {
    event.preventDefault();
    console.log(el.id);
    inputter.removeChild(iconRow);
    locSubmitter(el);
  })
}

function locSubmitter(el) {
  const submitDiv = document.createElement('div');
  submitDiv.setAttribute('id', 'submit-div');
  submitDiv.textContent = 'Submitted'
  inputter.appendChild(submitDiv);
  console.log(el.id + ' submitted!');
  const users = {}
  let array = []
  users.name = user
  users.pos = selfPos
  users.mood = el.id
  users.like = 0
  array.push(users)
  clearMarkers();
  showingSelf ? userMooder(users): userAdder(users)
  fader(submitDiv)
  console.log(1122)
  addUsers(array, map)
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setMapOnAll(null);
}

function userMooder(user) {
  let name = user.name
  console.log(name + 'updater ran')
  httpRequest.onreadystatechange = ajaxer;
  httpRequest.open('POST', '/userupdate', true);
  httpRequest.setRequestHeader("Content-Type","application/json; charset=UTF-8");
  httpRequest.send(JSON.stringify(user));
}

function userAdder(marker) {
  httpRequest.onreadystatechange = ajaxer;
  httpRequest.open('POST', '/user', true);
  httpRequest.setRequestHeader("Content-Type","application/json; charset=UTF-8");
  httpRequest.send(JSON.stringify(marker));
}

function hideListener() {
  mapEl.addEventListener('mousedown', hider, false)
}

function hider() {
  var el = document.getElementById('icon-row')
  var likeEl = document.getElementById('like-row')
  var submitDiv = document.getElementById('submit-div')
  if ((!!el) === true) {
    inputter.removeChild(el);
  }
  if ((!!likeEl) === true) {
    inputter.removeChild(likeEl);
  }
  if ((!!submitDiv) === true) {
    inputter.removeChild(submitDiv);
  }
  inputter.style.display= 'none';
  mapEl.removeEventListener('mousedown', hider, false)
}

const httpRequest = new XMLHttpRequest();

function markerAdder(marker) {
  httpRequest.onreadystatechange = ajaxer;
  httpRequest.open('POST', '/poster', true);
  httpRequest.setRequestHeader("Content-Type","application/json; charset=UTF-8");
  httpRequest.send(JSON.stringify(marker));
}

function ajaxer() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    console.log(httpRequest.responseText)
  } else {
    console.log('still not ready')
  }
}

const poster = document.getElementById('testposter')
poster.addEventListener('click', () => {
  event.preventDefault();
  deleteMarkers();
})

function deleteMarkers() {
  httpRequest.onreadystatechange = ajaxer;
  httpRequest.open('DELETE', '/deletemarkers', true);
  httpRequest.setRequestHeader("Content-Type","application/json; charset=UTF-8");
  httpRequest.send()
}





//test
