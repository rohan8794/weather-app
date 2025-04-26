import React, { useState } from 'react';
import axios from 'axios';
import { Search, Thermometer, Droplets, Wind, Cloud } from 'lucide-react';

const API_KEY = import.meta.env.VITE_VISUALCROSSING_API_KEY; // Make sure to set this in your .env file

interface WeatherData {
  resolvedAddress: string;
  currentConditions: {
    temp: number;
    humidity: number;
    conditions: string;
    icon: string;
    windspeed: number;
  };
}

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${API_KEY}&contentType=json`
      );
      setWeatherData(response.data);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          if (err.response.status === 404) {
            setError('City not found. Please try again.');
          } else if (err.response.status === 401) {
            setError('Invalid API key. Please check your API key.');
          } else {
            setError('An error occurred. Please try again later.');
          }
        } else {
          setError('Network error. Please check your internet connection.');
        }
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
      setWeatherData(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Weather App</h1>
      <form onSubmit={fetchWeatherData} className="mb-8 flex">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r-md flex items-center justify-center"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {weatherData && (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">{weatherData.resolvedAddress}</h2>
          <div className="flex items-center justify-center mb-4">
            <img
              src={`https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/SVG/1st%20Set%20-%20Color/${weatherData.currentConditions.icon}.svg`}
              alt="Weather icon"
              className="w-16 h-16"
            />
            <p className="text-3xl font-bold ml-4">
              {weatherData.currentConditions.temp}°C
            </p>
          </div>
          <p className="text-xl mb-2 capitalize">
            {weatherData.currentConditions.conditions}
          </p>
          <div className="flex justify-around mt-4">
            <div className="flex items-center">
              <Thermometer className="w-5 h-5 mr-2" />
              <p>{weatherData.currentConditions.temp}°C</p>
            </div>
            <div className="flex items-center">
              <Droplets className="w-5 h-5 mr-2" />
              <p>{weatherData.currentConditions.humidity}%</p>
            </div>
            <div className="flex items-center">
              <Wind className="w-5 h-5 mr-2" />
              <p>{weatherData.currentConditions.windspeed} km/h</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
