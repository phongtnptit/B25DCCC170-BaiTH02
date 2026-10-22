
import {
  getWeatherInfo,
  convertTemperature,
  formatUpdateTime,
} from "../utils/weather";

function CurrentWeather({ city, current, unit }) {
  const weather = getWeatherInfo(current.weather_code);

  return (
    <section className="current-weather">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THỜI TIẾT HIỆN TẠI</p>
          <h2>{city.name}</h2>
        </div>

        <span className="live-badge">● Dữ liệu mới nhất</span>
      </div>

      <div className="current-main">
        <span className="main-weather-icon" role="img" aria-label={weather.description}>
          {weather.icon}
        </span>

        <div>
          <div className="temperature">
            {convertTemperature(current.temperature_2m, unit)}
            <span>°{unit}</span>
          </div>

          <p className="weather-description">{weather.description}</p>
        </div>
      </div>

      <div className="weather-metrics">
        <div className="metric">
          <span className="metric-icon">💧</span>
          <div>
            <span className="metric-label">Độ ẩm</span>
            <strong>{current.relative_humidity_2m}%</strong>
          </div>
        </div>

        <div className="metric">
          <span className="metric-icon">💨</span>
          <div>
            <span className="metric-label">Tốc độ gió</span>
            <strong>{current.wind_speed_10m} km/h</strong>
          </div>
        </div>
      </div>

      <p className="updated-time">
        🕒 Cập nhật: {formatUpdateTime(current.time)} (giờ Việt Nam)
      </p>
    </section>
  );
}

export default CurrentWeather;
