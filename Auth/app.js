function switchForm(formName) {
  document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`${formName}Form`).classList.add('active');
  document.querySelector(`.tab[onclick*="${formName}"]`).classList.add('active');
  detectLocation();
}

document.getElementById('userType').addEventListener('change', function () {
  const isProvider = this.value === 'provider';
  document.getElementById('providerExtra').style.display = isProvider ? 'block' : 'none';
});

function validateLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    alert('Please fill in all login fields.');
    return false;
  }

  // Simulate login success
  alert('Login successful!');
  window.location.assign("../index.html");
  return true;
}

function validateSignup(event) {
  event.preventDefault();
  const email = document.getElementById('signupEmail').value.trim();
  const phone = document.getElementById('signupPhone').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('confirmPassword').value;
  const userType = document.getElementById('userType').value;

  if (!email || !phone || !password || !confirm || !userType) {
    alert('Please fill in all required fields.');
    return false;
  }

  if (password !== confirm) {
    alert('Passwords do not match.');
    return false;
  }

  if (userType === 'provider') {
    const category = document.getElementById('serviceCategory').value;
    if (!category) {
      alert('Please select a service category.');
      return false;
    }
  }

  // Simulate signup success
  alert('Signup successful!');
  window.location.assign("../index.html");
  return true;
}

const fetchData = async (lat, lon) => {
  try {
    const apiKey = 'f19a64e30e364c0cab0a223e72f2a673'; // Replace with your real API key
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C+${lon}&key=${apiKey}`);

    if (!response.ok) throw new Error("Failed to fetch location");

    const data = await response.json();
    const components = data.results[0].components;
    const city = components.city || components.town || components.village || components.county || "Unknown location";
    let formattedAddress = `${components.village}  , ${components.county}  , ${components.state_district}`

    document.getElementById("location").value = formattedAddress || city;
    console.log(`Autofilled city: ${formattedAddress}`);
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    alert("Could not determine your city from coordinates.");
  }
}


function detectLocation() {
  const storedLatitude = localStorage.getItem("latitude");
  const storedLongitude = localStorage.getItem("longitude");

  if (storedLatitude && storedLongitude) {
    console.log("Coordinates already in localStorage:");
    console.log(`Latitude: ${storedLatitude}, Longitude: ${storedLongitude}`);
    fetchData(storedLatitude,storedLongitude);
    return; // Skip asking for permission again
  }

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;

    // Store coordinates in localStorage
    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);
    fetchData(latitude,longitude);

  }, (error) => {
    alert("Location access failed: " + error.message);
  });
}



window.onload = function (){
  if(document.getElementById("loginForm").classList.contains("active")){
    console.log("success");
    return;
  }else{
    detectLocation();
  }
};