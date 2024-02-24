import { useState } from "react";
import { useEffect } from "react";

import "../styles/WeatherApp.css";

import icon_01d from "../assets/01d.png";
import icon_01n from "../assets/01n.png";
import icon_02d from "../assets/02d.png";
import icon_02n from "../assets/02n.png";
import icon_03d from "../assets/03d.png";
import icon_03n from "../assets/03n.png";
import icon_04d from "../assets/04d.png";
import icon_04n from "../assets/04n.png";
import icon_09d from "../assets/09d.png";
import icon_09n from "../assets/09n.png";
import icon_10d from "../assets/10d.png";
import icon_10n from "../assets/10n.png";
import icon_11d from "../assets/11d.png";
import icon_11n from "../assets/11n.png";
import icon_13d from "../assets/13d.png";
import icon_13n from "../assets/13n.png";
import icon_50d from "../assets/50d.png";
import icon_50n from "../assets/50n.png";
import icon_search from "../assets/search.png";
import icon_arrow from "../assets/arrow.png"

const icons = {
  "01d": icon_01d,
  "01n": icon_01n,
  "02d": icon_02d,
  "02n": icon_02n,
  "03d": icon_03d,
  "03n": icon_03n,
  "04d": icon_04d,
  "04n": icon_04n,
  "09d": icon_09d,
  "09n": icon_09n,
  "10d": icon_10d,
  "10n": icon_10n,
  "11d": icon_11d,
  "11n": icon_11n,
  "13d": icon_13d,
  "13n": icon_13n,
  "50d": icon_50d,
  "50n": icon_50n,
};

function WeatherApp() {
  const apiKey = "f391ac358017e56bcd8c4199c1e03a3e";

  const [userInput, setUserInput] = useState("London");
  const [temperature, setTemperature] = useState(0);
  const [city, setCity] = useState("");
  const [condition, setCondition] = useState("Rain");
  const [icon, setIcon] = useState("");
  const [windDirection, setWindDirection] = useState(0);
  const [windSpeed, setWindSpeed] = useState(0);

  useEffect(() => {
    handleSearch();
  }, []);

  async function handleSearch() {
    await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userInput}
    &appid=${apiKey}&units=metric`)
      .then((data) => {
        if (!data.ok) {
          switch (data.status) {
            case 404: {
              alert("Not Found");
              break;
            }
            case 500: {
              alert("Server error");
              break;
            }
            default: {
              alert("Unknown error");
              break;
            }
          }
        }
        return data.json();
      })
      .then((info) => {
        console.log(info);
        setTemperature(Math.floor(info.main.temp));
        setCity(info.name);
        setCondition(info.weather[0].description);
        setIcon(icons[info.weather[0].icon]);
        setWindDirection(info.wind.deg);
        setWindSpeed(info.wind.speed);
      })
      .catch((e) => console.log(e));
    setUserInput("");
  }

  function handleEnterPress(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div className="weather-app">
      <div className="weather-app__input-box">
        <input
          type="text"
          placeholder="Search"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleEnterPress}
        />
        <img src={icon_search} alt="" onClick={handleSearch} />
      </div>
      <div className="weather-icon">
        <img src={icon} alt="Weather icon"/>
      </div>
      <div className="temperature">{temperature}°C</div>
      <div className="condition">
        {condition[0].toUpperCase() + condition.slice(1)}
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
