import { useState, useEffect } from "react";
import "../styles/WeatherApp.css";
import config from "../config.json"
import icon_search from "../assets/search.png";
import icon_arrow from "../assets/arrow.png"

// Use Vite's import.meta.glob to dynamically import all weather icons
const weatherIcons = import.meta.glob('../assets/*.png', { eager: true });

// Create icons object dynamically
const iconCodes = [
  "01d", "01n", "02d", "02n", "03d", "03n", "04d", "04n",
  "09d", "09n", "10d", "10n", "11d", "11n", "13d", "13n",
  "50d", "50n"
];

const icons = {};
iconCodes.forEach(code => {
  const iconPath = `../assets/${code}.png`;
  if (weatherIcons[iconPath]) {
    icons[code] = weatherIcons[iconPath].default;
  }
});

// API base URL as a constant
const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Utility function to capitalize first letter
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function WeatherApp() {
  const apiKey = config.KEY;

  const [userInput, setUserInput] = useState("London");
  const [temperature, setTemperature] = useState(0);
  const [city, setCity] = useState("");
  const [condition, setCondition] = useState("Rain");
  const [icon, setIcon] = useState("");
  const [windDirection, setWindDirection] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    handleSearch();
  }, []);

  // Improved with async/await pattern
  async function handleSearch() {
    if (!userInput.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}?q=${userInput}&appid=${apiKey}&units=metric`
      );
      
      if (!response.ok) {
        let errorMessage = "Unknown error";
        if (response.status === 404) errorMessage = "City not found";
        if (response.status === 500) errorMessage = "Server error";
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      setTemperature(Math.floor(data.main.temp));
      setCity(data.name);
      setCondition(data.weather[0].description);
      setIcon(icons[data.weather[0].icon]);
      setWindDirection(data.wind.deg);
      setWindSpeed(data.wind.speed);
      setUserInput("");
    } catch (error) {
      setError(error.message);
      console.error("Error fetching weather data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }
  
  // Add this function to clear error when user types
  function handleInputChange(e) {
    setUserInput(e.target.value);
    if (error) {
      setError(null);
    }
  }

  return (
    <div className="weather-app">
      <div className="weather-app__input-box">
        <input
          type="text"
          placeholder={error || "Search"}
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className={error ? "error" : ""}
        />
        <img 
          src={icon_search} 
          alt="Search" 
          onClick={handleSearch}
          style={{ cursor: isLoading ? 'wait' : 'pointer' }}
        />
      </div>
      <div className="weather-icon">
        <img src={icon} alt="Weather icon"/>
      </div> 
      <div className="temperature">{temperature}°C</div>
      <div className="condition">
        {capitalizeFirstLetter(condition)}
      </div>
      <div className="wind">
        <div className="wind-direction">
          <img src={icon_arrow} style={{'transform': `rotate(${windDirection - 90}deg)`}}/>
          <div>{windDirection}°</div>
        </div>
        <div className="wind-speed">{windSpeed} m/s</div>
      </div>
      <div className="city">{city}</div>
    </div>
  );
}

export default WeatherApp;
