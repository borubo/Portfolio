"use strict"

function initMap() {
  'use strict';

  var target = document.getElementById('target');
  var geocoder = new google.maps.Geocoder();
  var map;
  var tokyo = {lat: 35.681167, lng: 139.767052};
  var service;

  map = new google.maps.Map(target, {
    center: tokyo,
    zoom: 15,
    // disableDefaultUI: true,
    // zoomControl: true,
    // mapTypeId: 'satellite',
    // mapTypeId: 'hybrid',
    // clickableIcons: false
  });

  // 検索機能
  document.getElementById('search').addEventListener('click', function() {
    geocoder.geocode({
      address: document.getElementById('address').value
    }, function(results, status) {
      if (status !== 'OK') {
        alert('Failed: ' + status);
        return;
      }
      // results[0].geometry.location
      if (results[0]) {
        new google.maps.Map(target, {
          center: results[0].geometry.location,
          zoom: 15
        });
      } else {
        alert('No results found');
        return;
      }
    });
  });

  // 中心移動
  map.addListener('click', function(e) {
    // console.log(e.latLng.lat());
    // console.log(e.latLng.lng());
    // console.log(e.latLng.toString());
    // this.setCenter(e.latLng);
    this.panTo(e.latLng);
  });
}

// 終了の操作
document.getElementById("btn").addEventListener("click", () => {
  window.close();
});