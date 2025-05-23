
const tabs = document.querySelectorAll('.tab-button');
const maps = document.querySelectorAll('.map-container');

const mapObjects = {};
const mapData = {
  "Monday": [
    [37.957912, -122.093952, "6688 Alhambra Ave, Martinez, CA 94553, USA", "Jazz"],
    [37.934251, -122.072346, "600 Patterson Blvd, Pleasant Hill, CA 94523, USA", "Jazz"],
    [37.83631, -122.128386, "Moraga Shopping Center, 1355 Moraga Way, Moraga, CA 94556, USA", "Jazz"],
    [37.948412, -122.058221, "1978 Contra Costa Blvd, Pleasant Hill, CA 94523, USA", "Jazz"],
    [37.971259, -122.06155, "707 Contra Costa Blvd, Pleasant Hill, CA 94523, USA", "Jazz"],
    [37.293191, -121.911197, "1530 Hamilton Ave, San Jose, CA 95125, USA", "Melody"],
    [37.26741, -121.833892, "179 Branham Ln, San Jose, CA 95136, USA", "Melody"],
    [37.772584, -122.509428, "850 La Playa St, San Francisco, CA 94121, USA", "Asian Dude"],
    [38.269567, -122.638885, "701 Sonoma Mountain Pkwy, Petaluma, CA 94954, USA", "Stephanie"],
    [38.249127, -122.621917, "389 S McDowell Blvd, Petaluma, CA 94954, USA", "Stephanie"],
  ],
  "Tuesday": [
    [37.231411, -121.979037, "470 N Santa Cruz Ave, Los Gatos, CA 95030, USA", "Jazz"],
    [37.292887, -121.966685, "950 W Hamilton Ave, Campbell, CA 95008, USA", "Jazz"],
    [37.281232, -122.031092, "12876 Saratoga Sunnyvale Rd, Saratoga, CA 95070, USA", "Jazz"],
    [37.322137, -121.995112, "5146 Stevens Creek Blvd, San Jose, CA 95129, USA", "Jazz"],
    [37.402619, -122.111348, "645 San Antonio Rd, Mountain View, CA 94040, USA", "Jazz"],
    [37.964774, -121.729267, "6700 Lone Tree Wy, Brentwood, CA 94513, USA", "Melody"],
    [37.680436, -121.777421, "1554 First St, Livermore, CA 94550, USA", "Melody"],
    [37.69597, -121.743056, "4495 First St, Livermore, CA 94551, USA", "Melody"],
    [37.674918, -121.874584, "Amador Center, 1701 Santa Rita Rd, Pleasanton, CA 94566, USA", "Melody"],
    [37.518614, -122.275761, "1100 El Camino Real, Belmont, CA 94002, USA", "Stephanie"],
    [37.520829, -122.337787, "100 De Anza Blvd, San Mateo, CA 94402, USA", "Stephanie"],
    [37.553274, -122.313498, "1655 S El Camino Real, San Mateo, CA 94402, USA", "Stephanie"],
    [37.556792, -122.27595, "921 E Hillsdale Blvd, Foster City, CA 94404, USA", "Stephanie"],
  ],
  "Wednesday": [
    [38.084509, -122.210165, "122 Robles Way, Vallejo, CA 94591, USA", "Melody"],
    [37.980715, -122.564229, "838 Sir Francis Drake Blvd, San Anselmo, CA 94960, USA", "Melody"],
    [37.92797, -122.517711, "137 Corte Madera Town Center, Corte Madera, CA 94925, USA", "Melody"],
    [38.062346, -122.532091, "5720 Nave Dr, Novato, CA 94949, USA", "Melody"],
    [36.940009, -121.77559, "2010 Freedom Blvd, Freedom, CA 95019, USA", "Stephanie"],
    [36.978599, -121.908464, "16 Rancho Del Mar, Aptos, CA 95003, USA", "Stephanie"],
    [36.961358, -122.045212, "2203 Mission St, Santa Cruz, CA 95060, USA", "Stephanie"],
  ],
  "Thursday": [
    [38.426913, -122.742122, "2055 Sebastopol Rd, Santa Rosa, CA 95407, USA", "Melody"],
    [38.404452, -122.827055, "406 N Main St, Sebastopol, CA 95472, USA", "Melody"],
    [38.452054, -122.752896, "1799 Marlow Rd, Santa Rosa, CA 95401, USA", "Melody"],
    [37.694739, -122.050451, "4015 E Castro Valley Blvd, Castro Valley, CA 94552, USA", "Stephanie"],
    [37.705862, -121.927013, "7499 Dublin Blvd, Dublin, CA 94568, USA", "Stephanie"],
    [37.706699, -121.874139, "4440 Tassajara Rd, Dublin, CA 94568, USA", "Stephanie"],
    [37.798045, -121.917666, "3496 Camino Tassajara, Danville, CA 94506, USA", "Stephanie"],
    [37.774169, -121.921901, "11060 Bollinger Canyon Rd, San Ramon, CA 94582, USA", "Stephanie"],
  ],
  "Friday": [
    [37.688412, -122.138634, "699 Lewelling Blvd, San Leandro, CA 94579, USA", "Jazz"],
    [37.758673, -122.250832, "2227 S Shore Center, Alameda, CA 94501, USA", "Jazz"],
    [37.775728, -122.230647, "3000 E 9th St, Oakland, CA 94606, USA", "Jazz"],
    [37.797958, -122.181974, "4100 Redwood Rd, Oakland, CA 94619, USA", "Jazz"],
    [37.829282, -122.280098, "3889 San Pablo Ave, Emeryville, CA 94608, USA", "Jazz"],
    [37.679797, -122.083478, "22280 Foothill Blvd, Hayward, CA 94541, USA", "Melody"],
    [37.63243, -122.09627, "27300 Hesperian Blvd, Hayward, CA 94545, USA", "Melody"],
    [37.652712, -122.091467, "231 W Jackson St, Hayward, CA 94544, USA", "Melody"],
    [37.785476, -122.28051, "2600 5th St, Alameda, CA 94501, USA", "Melody"],
  ],
};

const fixedBounds = L.latLngBounds(
  [37.3234, -122.6044],  // shifted SW latitude south by ~0.05
  [38.28, -121.34]   // shifted NE latitude south by ~0.05
);

Object.keys(mapData).forEach(day => {
  const map = L.map('map-' + day);
  mapObjects[day] = map;

  // Add locate control
  L.control.locate().addTo(map);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> | &copy; OpenStreetMap contributors',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

mapData[day].forEach(loc => {
  const lat = loc[0];
  const lng = loc[1];
  const address = loc[2];
  const performer = loc[3];
  const encodedAddress = encodeURIComponent(address);
  const googleMapsLink = `https://www.google.com/maps?q=${encodedAddress}`;
  const appleMapsLink = `https://maps.apple.com/?address=${encodedAddress}`;

  const popupContent = `
  <strong>${performer}</strong><br>
  ${address}<br>
  <a href="${googleMapsLink}" target="_blank" rel="noopener noreferrer">Google Maps</a><br>
  <a href="${appleMapsLink}" target="_blank" rel="noopener noreferrer">Apple Maps</a>
  `;

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(popupContent);
});

  if (day === "Home") {
    map.fitBounds(fixedBounds);
    setTimeout(() => map.invalidateSize(), 200);
  }
});

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    maps.forEach(m => m.classList.remove('active'));
    tab.classList.add('active');
    const mapId = tab.dataset.map;
    const container = document.getElementById(mapId);
    container.classList.add('active');

    const day = mapId.replace('map-', '');
    setTimeout(() => {
      mapObjects[day].invalidateSize();
      mapObjects[day].fitBounds(fixedBounds);
    }, 200);
  });
});


// Ensure Monday map displays correctly on initial load
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const mondayMap = mapObjects["Monday"];
    mondayMap.invalidateSize();
    mondayMap.fitBounds(fixedBounds);
  }, 300);
});

const dropdown = document.querySelector('.tab-dropdown');
if (dropdown) {
  dropdown.addEventListener('change', (e) => {
    const mapId = e.target.value;

    tabs.forEach(t => t.classList.remove('active'));
    maps.forEach(m => m.classList.remove('active'));

    const container = document.getElementById(mapId);
    container.classList.add('active');

    const day = mapId.replace('map-', '');
    setTimeout(() => {
      mapObjects[day].invalidateSize();
      mapObjects[day].fitBounds(fixedBounds);
    }, 200);
  });
}
