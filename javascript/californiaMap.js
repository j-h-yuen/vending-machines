const californiaMap = L.map('map-California');
L.control.locate().addTo(californiaMap);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://carto.com/">CARTO</a> | &copy; OpenStreetMap contributors',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(californiaMap);

const californiaBounds = L.latLngBounds([32.5, -123.0], [39.0, -117.0]);

fetch('assets/californiaData.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        const address = feature.properties.address;
        const performer = feature.properties.performer;
        const encodedAddress = encodeURIComponent(address);
        const googleMapsLink = `https://www.google.com/maps?q=${encodedAddress}`;
        const appleMapsLink = `https://maps.apple.com/?address=${encodedAddress}`;

        const popupContent = `
          <strong>${performer}</strong><br>
          ${address}<br>
          <a href="${googleMapsLink}" target="_blank" rel="noopener noreferrer">Google Maps</a><br>
          <a href="${appleMapsLink}" target="_blank" rel="noopener noreferrer">Apple Maps</a>
        `;

        layer.bindPopup(popupContent);
      }
    }).addTo(californiaMap);
  });

// Ensure California map displays correctly on initial load
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    californiaMap.invalidateSize();
    californiaMap.fitBounds(californiaBounds);
  }, 300);
});

// Handle tab switch sizing
const californiaButton = document.querySelector('[data-map="map-California"]');
californiaButton.addEventListener('click', () => {
  setTimeout(() => {
    californiaMap.invalidateSize();
    californiaMap.fitBounds(californiaBounds);
  }, 200);
});

const californiaDropdown2 = document.querySelector('.tab-dropdown-pc');
if (californiaDropdown2) {
  californiaDropdown2.addEventListener('change', (e) => {
    if (e.target.value === "map-California") {
      setTimeout(() => {
        californiaMap.invalidateSize();
        californiaMap.fitBounds(californiaBounds);
      }, 200);
    }

    // Smooth transition back to "CHOOSE A DAY"
    setTimeout(() => {
      californiaDropdown2.style.opacity = 0;

      setTimeout(() => {
        californiaDropdown2.value = "";
        californiaDropdown2.style.opacity = 1;
      }, 300); // wait for fade out before reset
    }, 250);
  });
}


