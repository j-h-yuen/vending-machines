document.addEventListener('DOMContentLoaded', () => {
  const maps = document.querySelectorAll('.map-container');
  const sacDropdownPC = document.querySelector('.tab-dropdown-pc-sac');
  const sacDropdownMobile = document.querySelector('.mobile-only-sac');

  let sacMapInitialized = false;

  function initSacramentoMap() {
    if (sacMapInitialized) return;
    sacMapInitialized = true;

    const map = L.map('sac-Route');

    const sacramentoBounds = L.latLngBounds([38.45, -121.55], [38.80, -121.15]);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> | &copy; OpenStreetMap contributors',
      subdomains: 'abcd',
      maxZoom: 18,
    }).addTo(map);

    Promise.all([
      fetch('assets/sacramento/routesSac.geojson').then(res => res.json()),
      fetch('assets/sacramento/stopsSac.geojson').then(res => res.json())
    ])
      .then(([routesData, stopsData]) => {
        const routesLayer = L.geoJSON(routesData, {
          style: { color: 'lightblue', weight: 3, opacity: 0.75 }
        }).addTo(map);

        const stopsLayer = L.geoJSON(stopsData, {
          onEachFeature: (feature, layer) => {
            const { address = "Unknown address", performer = "Unknown", sequence = "N/A" } = feature.properties;
            const encoded = encodeURIComponent(address);
            const popup = `
              <strong>${performer} (Stop #${sequence})</strong><br>
              ${address}<br>
              <a href="https://www.google.com/maps?q=${encoded}" target="_blank">Google Maps</a><br>
              <a href="https://maps.apple.com/?address=${encoded}" target="_blank">Apple Maps</a>
            `;
            layer.bindPopup(popup);
          }
        }).addTo(map);

        const allBounds = L.featureGroup([routesLayer, stopsLayer]).getBounds();
        map.fitBounds(allBounds.isValid() ? allBounds : sacramentoBounds);

        setTimeout(() => map.invalidateSize(), 200);
      })
      .catch(err => {
        console.error('GeoJSON load error:', err);
        map.fitBounds(sacramentoBounds);
        setTimeout(() => map.invalidateSize(), 200);
      });
  }

  function activateSacramentoMap(mapId) {
    maps.forEach(m => m.classList.remove('active'));

    const container = document.getElementById(mapId);
    if (container) {
      container.classList.add('active');
    }

    if (mapId === 'sac-Route') {
      initSacramentoMap();
    }

    setTimeout(() => {
      const mapEl = document.getElementById(mapId);
      if (mapEl && mapEl._leaflet_id) {
        const leafletMap = L.Map._instances[mapEl._leaflet_id];
        if (leafletMap) leafletMap.invalidateSize();
      }
    }, 200);
  }

  // Desktop dropdown (fade + reset like Bay Area)
  if (sacDropdownPC) {
    sacDropdownPC.addEventListener('change', (e) => {
      activateSacramentoMap(e.target.value);

      setTimeout(() => {
        sacDropdownPC.style.opacity = 0;
        setTimeout(() => {
          sacDropdownPC.value = "";
          sacDropdownPC.style.opacity = 1;
        }, 300);
      }, 250);
    });
  }

  // Mobile dropdown — just switch, no fade/reset
  if (sacDropdownMobile) {
    sacDropdownMobile.addEventListener('change', (e) => {
      activateSacramentoMap(e.target.value);
    });
  }
});