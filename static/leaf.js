var mymap = L.map('mapid').setView([47.37128, 8.54161], 13);

// Use free OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

mapMarkers1 = [];
mapMarkers2 = [];
mapMarkers3 = [];

/* Icons-Settings */
/* https://github.com/pointhi/leaflet-color-markers  */
var myIcon = L.divIcon({
    className: 'my-div-icon',
    iconSize: [15, 15]
});

var source = new EventSource('/topic/busdata001');
source.addEventListener('message', function(e){

    console.log('Message');
    obj = JSON.parse(e.data);
    console.log(obj);

    if(obj.busline == '00001') {
        for (var i = 0; i < mapMarkers1.length; i++) {
            mymap.removeLayer(mapMarkers1[i]);
        }
        marker1 = L.marker([obj.latitude, obj.longitude], {icon: myIcon}).addTo(mymap);
        marker1.valueOf()._icon.style.backgroundColor = 'red';
        mapMarkers1.push(marker1);
    }

    if(obj.busline == '00002') {
        for (var i = 0; i < mapMarkers2.length; i++) {
            mymap.removeLayer(mapMarkers2[i]);
        }
        marker2 = L.marker([obj.latitude, obj.longitude], {icon: myIcon}).addTo(mymap);
        marker2.valueOf()._icon.style.backgroundColor = 'gold';
        mapMarkers2.push(marker2);
    }

    if(obj.busline == '00003') {
        for (var i = 0; i < mapMarkers3.length; i++) {
            mymap.removeLayer(mapMarkers3[i]);
        }
        marker3 = L.marker([obj.latitude, obj.longitude], {icon: myIcon}).addTo(mymap);
        marker3.valueOf()._icon.style.backgroundColor = 'green';
        mapMarkers3.push(marker3);
    }
}, false);
