const map = L.map('map').setView([20.5937, 78.9629], 5);
L.control.zoom({ position: 'bottomleft' }).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

fetch('indiaborder.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      style: { color: 'blue', weight: 2, fillOpacity: 0.1 }
    }).addTo(map);
  });

let marker, labelDiv;
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

function addMarker(lat, lng, label) {
  if (marker) map.removeLayer(marker);
  if (labelDiv) map.getPanes().overlayPane.removeChild(labelDiv);

  marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
  labelDiv = document.createElement('div');
  labelDiv.className = 'label-overlay';
  labelDiv.textContent = label;
  map.getPanes().overlayPane.appendChild(labelDiv);

  const updatePos = () => {
    const pos = map.latLngToLayerPoint([lat, lng]);
    labelDiv.style.left = `${pos.x}px`;
    labelDiv.style.top = `${pos.y - 45}px`;
  };

  map.on('move zoom', updatePos);
  updatePos();
}

async function getPlace(lat, lng) {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
  const data = await res.json();
  return data.display_name?.split(',')[0] || "Unknown";
}

async function getWeather(lat, lng) {
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=relativehumidity_2m`);
  const data = await res.json();
  return {
    temp: data.current_weather.temperature,
    wind: data.current_weather.windspeed,
    humidity: data.hourly.relativehumidity_2m[0]
  };
}

function renderWeather(data) {
  return `
    <div class="weather-row"><img src="https://cdn-icons-png.flaticon.com/512/1163/1163657.png" />Temperature: <span class="temp">${data.temp}°C</span></div>
    <div class="weather-row"><img src="https://cdn-icons-png.flaticon.com/512/1779/1779946.png" />Humidity: ${data.humidity}%</div>
    <div class="weather-row"><img src="https://cdn-icons-png.flaticon.com/512/414/414927.png" />Wind Speed: ${data.wind} m/s</div>
  `;
}

async function update(lat, lng) {
  const [name, weather] = await Promise.all([getPlace(lat, lng), getWeather(lat, lng)]);
  document.getElementById('location-name').textContent = name;
  document.getElementById('weather-details').innerHTML = renderWeather(weather);
  addMarker(lat, lng, name);
}

document.getElementById('locate-me').addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    map.setView([lat, lng], 12);
    update(lat, lng);
  });
});

document.getElementById('search-input').addEventListener('input', e => {
  const q = e.target.value.trim();
  if (q.length < 2) return document.getElementById('suggestions').style.display = 'none';

  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('suggestions');
      container.innerHTML = '';
      data.forEach(place => {
        const div = document.createElement('div');
        div.textContent = place.display_name;
        div.onclick = () => {
          map.setView([+place.lat, +place.lon], 12);
          update(+place.lat, +place.lon);
          container.style.display = 'none';
        };
        container.appendChild(div);
      });
      container.style.display = 'block';
    });
});

document.addEventListener('click', e => {
  if (!document.getElementById('search-container').contains(e.target)) {
    document.getElementById('suggestions').style.display = 'none';
  }
});

update(20.5937, 78.9629); // default India
const map = L.map('map').setView([20.5937, 78.9629], 5);
L.control.zoom({ position: 'bottomleft' }).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

fetch('indiaborder.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      style: { color: 'blue', weight: 2, fillOpacity: 0.1 }
    }).addTo(map);
  });

let marker, labelDiv;
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

function addMarker(lat, lng, label) {
  if (marker) map.removeLayer(marker);
  if (labelDiv) map.getPanes().overlayPane.removeChild(labelDiv);

  marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
  labelDiv = document.createElement('div');
  labelDiv.className = 'label-overlay';
  labelDiv.textContent = label;
  map.getPanes().overlayPane.appendChild(labelDiv);

  const updatePos = () => {
    const pos = map.latLngToLayerPoint([lat, lng]);
    labelDiv.style.left = `${pos.x}px`;
    labelDiv.style.top = `${pos.y - 45}px`;
  };

  map.on('move zoom', updatePos);
  updatePos();
}

async function getPlace(lat, lng) {
  const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
  const data = await res.json();
  return data.display_name?.split(',')[0] || "Unknown";
}

async function getWeather(lat, lng) {
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=relativehumidity_2m`);
  const data = await res.json();
  return {
    temp: data.current_weather.temperature,
    wind: data.current_weather.windspeed,
    humidity: data.hourly.relativehumidity_2m[0]
  };
}

function renderWeather(data) {
  return `
    <div class="weather-row"><img src="https://cdn-icons-png.flaticon.com/512/1163/1163657.png" />Temperature: <span class="temp">${data.temp}°C</span></div>
    <div class="weather-row"><img src="https://cdn-icons-png.flaticon.com/512/1779/1779946.png" />Humidity: ${data.humidity}%</div>
    <div class="weather-row"><img src="https://cdn-icons-png.flaticon.com/512/414/414927.png" />Wind Speed: ${data.wind} m/s</div>
  `;
}

async function update(lat, lng) {
  const [name, weather] = await Promise.all([getPlace(lat, lng), getWeather(lat, lng)]);
  document.getElementById('location-name').textContent = name;
  document.getElementById('weather-details').innerHTML = renderWeather(weather);
  addMarker(lat, lng, name);
}

document.getElementById('locate-me').addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    map.setView([lat, lng], 12);
    update(lat, lng);
  });
});

document.getElementById('search-input').addEventListener('input', e => {
  const q = e.target.value.trim();
  if (q.length < 2) return document.getElementById('suggestions').style.display = 'none';

  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('suggestions');
      container.innerHTML = '';
      data.forEach(place => {
        const div = document.createElement('div');
        div.textContent = place.display_name;
        div.onclick = () => {
          map.setView([+place.lat, +place.lon], 12);
          update(+place.lat, +place.lon);
          container.style.display = 'none';
        };
        container.appendChild(div);
      });
      container.style.display = 'block';
    });
});

document.addEventListener('click', e => {
  if (!document.getElementById('search-container').contains(e.target)) {
    document.getElementById('suggestions').style.display = 'none';
  }
});

update(20.5937, 78.9629); // default India
