
import { useEffect, useState } from "react";

import CityList from "./components/CityList";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";

import { cities } from "./data/cities";
import { getWeatherInfo } from "./utils/weather";

import "./App.css";

function App() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [unit, setUnit] = useState("C");
  const [retryCount, setRetryCount] = useState(0);

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("weather-favorites"));
      return Array.isArray(saved)
        ? saved.filter((id) => cities.some((city) => city.id === id))
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("weather-favorites", JSON.stringify(favorites));
    } catch {
      // Ứng dụng vẫn hoạt động nếu trình duyệt chặn localStorage.
    }
  }, [favorites]);

  useEffect(() => {
    if (!selectedCity) return;

    const controller = new AbortController();

    async function fetchWeather() {
      setLoading(true);
      setError("");
      setWeatherData(null);

      const params = new URLSearchParams({
        latitude: selectedCity.latitude,
        longitude: selectedCity.longitude,
        current:
          "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
        daily:
          "weather_code,temperature_2m_max,temperature_2m_min",
        timezone: "Asia/Ho_Chi_Minh",
        forecast_days: "7",
      });

      const url = `https://api.open-meteo.com/v1/forecast?${params}`;

      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Lỗi HTTP ${response.status}`);
        }

        const data = await response.json();

        if (
          data.error ||
          !data.current ||
          !data.daily ||
          !Array.isArray(data.daily.time) ||
          !Array.isArray(data.daily.weather_code) ||
          !Array.isArray(data.daily.temperature_2m_max) ||
          !Array.isArray(data.daily.temperature_2m_min) ||
          data.daily.time.length !== 7 ||
          data.daily.weather_code.length !== 7 ||
          data.daily.temperature_2m_max.length !== 7 ||
          data.daily.temperature_2m_min.length !== 7
        ) {
          throw new Error("Dữ liệu thời tiết không hợp lệ.");
        }

        if (!controller.signal.aborted) {
          setWeatherData(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            "Không thể tải dữ liệu thời tiết. Vui lòng thử lại."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchWeather();

    return () => {
      controller.abort();
    };
  }, [selectedCity, retryCount]);

  function handleSelectCity(city) {
    setSelectedCity(city);
  }

  function handleRetry() {
    setRetryCount((prev) => prev + 1);
  }

  function handleToggleFavorite(cityId) {
    setFavorites((prev) => {
      if (prev.includes(cityId)) {
        return prev.filter((id) => id !== cityId);
      }

      return [...prev, cityId];
    });
  }

  const theme = weatherData
    ? getWeatherInfo(weatherData.current.weather_code).theme
    : "default";

  return (
    <div className={`app theme-${theme}`}>
      <div className="app-container">
        <header className="app-header">
          <div className="brand">
            <span className="brand-icon">🌤️</span>

            <div>
              <h1>VietWeather</h1>
              <p>Thời tiết các thành phố Việt Nam</p>
            </div>
          </div>

          <div className="unit-switch" aria-label="Đơn vị nhiệt độ">
            <button
              type="button"
              className={unit === "C" ? "selected" : ""}
              onClick={() => setUnit("C")}
              aria-pressed={unit === "C"}
            >
              °C
            </button>

            <button
              type="button"
              className={unit === "F" ? "selected" : ""}
              onClick={() => setUnit("F")}
              aria-pressed={unit === "F"}
            >
              °F
            </button>
          </div>
        </header>

        <main className="main-layout">
          <CityList
            cities={cities}
            selectedCity={selectedCity}
            onSelectCity={handleSelectCity}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />

          <div className="weather-panel">
            {!selectedCity && (
              <div className="state-box">
                <span className="state-icon">🗺️</span>
                <h2>Chào mừng đến VietWeather</h2>
                <p>
                  Hãy chọn một thành phố bên trái để xem
                  thời tiết hiện tại và dự báo 7 ngày.
                </p>
              </div>
            )}

            {selectedCity && loading && (
              <div className="state-box" role="status">
                <div className="spinner"></div>
                <h2>Đang tải thời tiết...</h2>
                <p>Đang lấy dữ liệu cho {selectedCity.name}</p>
              </div>
            )}

            {selectedCity && !loading && error && (
              <div className="state-box" role="alert">
                <span className="state-icon">⚠️</span>
                <h2>Đã xảy ra lỗi</h2>
                <p>{error}</p>

                <button
                  type="button"
                  className="retry-button"
                  onClick={handleRetry}
                >
                  ↻ Thử lại
                </button>
              </div>
            )}

            {selectedCity && !loading && !error && weatherData && (
              <>
                <CurrentWeather
                  city={selectedCity}
                  current={weatherData.current}
                  unit={unit}
                />

                <Forecast
                  daily={weatherData.daily}
                  unit={unit}
                />
              </>
            )}
          </div>
        </main>

        <footer className="app-footer">
          Dữ liệu thời tiết cung cấp bởi{" "}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noreferrer"
          >
            Open-Meteo
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;
