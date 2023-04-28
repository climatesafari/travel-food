const informUser = (message) => {
	const infoElement = document.getElementById('info');
	infoElement.textContent = message;
  };
  
  const fetchClimateData = async (location) => {
	try {
	  const coordinates = await getCoordinates(location);
	  if (coordinates) {
		const data = await fetchWeatherStatistics(coordinates);
		updateTemperatureTable(data);
	  } else {
		informUser('Location not found. Please try again.');
	  }
	} catch (error) {
	  console.error('Network error:', error);
	}
  };
  
  const getCoordinates = async (location) => {
	const apiKey = '1475108c2c07af44c0187970522d42ca';
	const baseUrl = 'http://api.positionstack.com/v1/forward';
	const query = encodeURIComponent(location);
	const url = `${baseUrl}?access_key=${apiKey}&query=${query}`;
  
	const response = await fetch(url);
	const data = await response.json();
  
	if (data.data.length > 0) {
	  return {
		lat: data.data[0].latitude,
		lon: data.data[0].longitude,
	  };
	} else {
	  return null;
	}
  };
  
  const fetchWeatherStatistics = async (coordinates) => {
	const { lat, lon } = coordinates;
	const baseUrl = 'https://api.met.no/weatherapi/weatherstat/2.0/data';
	const url = `${baseUrl}?lat=${lat}&lon=${lon}`;
  
	const response = await fetch(url);
	const data = await response.json();
  
	return data;
  };
  
  const updateTemperatureTable = (temperatures) => {
	const monthlyAverages = calculateMonthlyAverages(temperatures);
	const tableBody = document.getElementById('temperature-table').querySelector('tbody');
	tableBody.innerHTML = '';
  
	const months = [
	  'January', 'February', 'March', 'April', 'May', 'June',
	  'July', 'August', 'September', 'October', 'November', 'December'
	];
  
	months.forEach((month, index) => {
	  const row = document.createElement('tr');
	  const monthCell = document.createElement('td');
	  const temperatureCell = document.createElement('td');
  
	  monthCell.textContent = month;
	  temperatureCell.textContent = monthlyAverages[index].toFixed(1);
  
	  row.appendChild(monthCell);
	  row.appendChild(temperatureCell);
	  tableBody.appendChild(row);
	});
  };
  
  const calculateMonthlyAverages = (temperatures) => {
	const monthlySums = Array(12).fill(0);
	const monthlyCounts = Array(12).fill(0);
  
	temperatures.forEach((data) => {
	  const date = new Date(data.time);
	  const month = date.getMonth();
	  const temp = data.temperature.value;
  
	  monthlySums[month] += temp;
	  monthlyCounts[month]++;
	});
  
	return monthlySums.map((sum, index) => sum / monthlyCounts[index]);
  };
  
  
  const locationInput = document.getElementById('location-input');
  const searchBtn = document.getElementById('search-btn');
  
  const showManualInput = () => {
	locationInput.style.display = 'block';
	searchBtn.style.display = 'block';
  };
  
  showManualInput();
  
  locationInput.addEventListener('change', async () => {
	const location = locationInput.value;
	fetchClimateData(location);
  });
  