
function mapLoad(api) {
  const url = 'https://maps.googleapis.com/maps/api/js?key=' + api + '&callback=initMap';
  const mapDiv = document.getElementById('map');
  const scriptAdd = document.createElement('script');
  scriptAdd.setAttribute('src', url);
  scriptAdd.setAttribute('defer', 'true');
  mapDiv.appendChild(scriptAdd);
  return scriptAdd;
}

getDataPromise()
  .then((result) => result.json())
  .then((result) => {
    JSON.stringify(result);
    mapLoad(result);
  })
  .catch((error) => console.log(error))

function getDataPromise() {
  return new Promise((resolve, reject) => {
    const thenable = fetch('/map_api');
    if (!thenable) {
      reject(thenable);
    }
    else {
    resolve(thenable);
    }
  }
)}
