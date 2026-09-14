var mymap = L.map('mapid').setView([47.37128, 8.54161], 13);

// tile.openstreetmap.org actively blocks apps running from shared-IP dev
// environments like Codespaces (see osm.wiki/Blocked). CARTO's basemaps,
// used here previously, now require an API key too. Esri's basemaps are
// free to use without a key or signup. The gray canvas base ships without
// labels, so it's paired with a matching transparent reference layer.
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16,
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
}).addTo(mymap);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16
}).addTo(mymap);

// Leaflet measures its container on init; if the CSS grid layout hasn't
// settled yet the map renders smaller than its card. Re-measure once the
// layout is final, and again whenever the card itself changes size.
window.addEventListener('load', function () {
    mymap.invalidateSize();
});

var mapContainer = document.getElementById('mapid');
if (window.ResizeObserver && mapContainer) {
    new ResizeObserver(function () {
        mymap.invalidateSize();
    }).observe(mapContainer);
}

var LINE_COLORS = {
    '00001': '#ff5c5c',
    '00002': '#ffc857',
    '00003': '#4fd18b'
};

var mapMarkers = { '00001': null, '00002': null, '00003': null };
var messageCounts = { '00001': 0, '00002': 0, '00003': 0 };

function makeIcon(color) {
    return L.divIcon({
        className: 'my-div-icon',
        iconSize: [15, 15],
        html: '<div style="width:100%;height:100%;border-radius:50%;background:' + color + '"></div>'
    });
}

function setConnectionStatus(live) {
    var dot = document.getElementById('conn-dot');
    var label = document.getElementById('conn-label');
    if (!dot || !label) return;
    dot.classList.toggle('live', live);
    label.textContent = live ? 'Live' : 'Connecting…';
}

function formatTime(isoLikeTimestamp) {
    // Timestamps arrive as "YYYY-MM-DD HH:MM:SS.ffffff" (UTC)
    var d = new Date(isoLikeTimestamp.replace(' ', 'T') + 'Z');
    if (isNaN(d.getTime())) return isoLikeTimestamp;
    return d.toLocaleTimeString();
}

function updateLegend(busline, timestamp) {
    messageCounts[busline] += 1;
    var meta = document.getElementById('meta-' + busline);
    var count = document.getElementById('count-' + busline);
    if (meta) meta.textContent = 'last update ' + formatTime(timestamp);
    if (count) count.textContent = messageCounts[busline];
}

var source = new EventSource('/topic/busdata001');

source.addEventListener('open', function () {
    setConnectionStatus(true);
}, false);

source.addEventListener('error', function () {
    setConnectionStatus(false);
}, false);

source.addEventListener('message', function (e) {
    var obj = JSON.parse(e.data);

    if (!LINE_COLORS.hasOwnProperty(obj.busline)) return;

    setConnectionStatus(true);
    updateLegend(obj.busline, obj.timestamp);

    if (mapMarkers[obj.busline]) {
        mymap.removeLayer(mapMarkers[obj.busline]);
    }
    mapMarkers[obj.busline] = L.marker([obj.latitude, obj.longitude], {
        icon: makeIcon(LINE_COLORS[obj.busline])
    }).addTo(mymap);
}, false);
