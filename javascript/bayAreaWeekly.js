const tabs = document.querySelectorAll('.tab-button'); // variable tabs = all elements with class tab-button
const maps = document.querySelectorAll('.map-container'); // variable maps = all elements with class map-container
// returns a node list

const mapObjects = {}; // empty object 
const fixedBounds = L.latLngBounds(
  [37.3234, -122.6044],  
  [38.28, -121.34]   
); // fixed defined box 

fetch('assets/bay_area/schedule_day.geojson')
  .then(res => res.json()) // parsed as json 
  .then(data => {
    const groupedByDay = {}; // empty object

    data.features.forEach(f => {
      const day = f.properties.day;
      if (!groupedByDay[day]) groupedByDay[day] = [];
      groupedByDay[day].push(f);
    }); // iterates over each geojson feature, groups features into groupByDay by day property

    Object.keys(groupedByDay).forEach(day => {
      const map = L.map('bay-' + day); // creates a new Leaflet map in a container with ID "bay-<day>"
      mapObjects[day] = map; // store map instance in mapObjects, using day as the key

      L.control.locate().addTo(map); // adds the "locate me" button to the map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> | &copy; OpenStreetMap contributors',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map); // adds base map layer from CARTO 

      groupedByDay[day].forEach(feature => {
        const [lng, lat] = feature.geometry.coordinates;
        const { address, performer } = feature.properties; // from each feature on that day: extract coordinates and properties 

        const encodedAddress = encodeURIComponent(address); 
        const popupContent = `
          <strong>${performer}</strong><br>
          ${address}<br>
          <a href="https://www.google.com/maps?q=${encodedAddress}" target="_blank">Google Maps</a><br>
          <a href="https://maps.apple.com/?address=${encodedAddress}" target="_blank">Apple Maps</a>
        `;

        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(popupContent);
      }); // builds a popup with info and links to maps 

      if (day === "Home") {
        map.fitBounds(fixedBounds);
        setTimeout(() => map.invalidateSize(), 200);
      }
    });
  });

tabs.forEach(tab => {
  tab.addEventListener('click', () => { // adds click event to each tab 
    // removes all active classes 
    tabs.forEach(t => t.classList.remove('active')); 
    maps.forEach(m => m.classList.remove('active')); 
    tab.classList.add('active');

    // adds active class to tab and corresponding map container 
    const mapId = tab.dataset.map;
    const container = document.getElementById(mapId);
    container.classList.add('active');

    const day = mapId.replace('bay-', '');
    setTimeout(() => {
      mapObjects[day].invalidateSize();
      mapObjects[day].fitBounds(fixedBounds);
    }, 200);
  });
});

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const mondayMap = mapObjects["Monday"];
    if (mondayMap) {
      mondayMap.invalidateSize();
      mondayMap.fitBounds(fixedBounds);
    }
  }, 300);
});
// once DOM loads, after 300ms, it resizes and fits the "monday" map if it exists.

// mobile dropdown handling 
const dropdown = document.querySelector('.tab-dropdown');
if (dropdown) { // dropdown refers to tab-dropdown 
  dropdown.addEventListener('change', (e) => { // adds change event to mobile dropdown 
    const mapId = e.target.value;

    // removes all active classes 
    tabs.forEach(t => t.classList.remove('active'));
    maps.forEach(m => m.classList.remove('active')); 

    // actives map container for selected day from dropdown
    const container = document.getElementById(mapId);
    container.classList.add('active');

    // fix it and fit map after switching tab via dropdown 
    const day = mapId.replace('bay-', '');
    setTimeout(() => {
      mapObjects[day].invalidateSize();
      mapObjects[day].fitBounds(fixedBounds);
    }, 200);
  });
}

// fades out the ui/ux
const dropdown2 = document.querySelector('.tab-dropdown-pc');
if (dropdown2) { // dropdown2 refers to tap-dropdown-pc
  dropdown2.addEventListener('change', (e) => {
    const mapId = e.target.value;

    tabs.forEach(t => t.classList.remove('active'));
    maps.forEach(m => m.classList.remove('active'));

    const container = document.getElementById(mapId);
    if (container) {
      container.classList.add('active');
    }

    const day = mapId.replace('bay-', '');
    setTimeout(() => {
      if (mapObjects[day]) {
        mapObjects[day].invalidateSize();
        mapObjects[day].fitBounds(fixedBounds);
      }
    }, 200);

    setTimeout(() => {
      dropdown2.style.opacity = 0;
      setTimeout(() => {
        dropdown2.value = "";
        dropdown2.style.opacity = 1;
      }, 300);
    }, 250);
  });
}
