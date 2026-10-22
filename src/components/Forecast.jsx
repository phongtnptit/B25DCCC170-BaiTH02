
import {
  getWeatherInfo,
  convertTemperature,
  formatDate,
} from "../utils/weather";

function Forecast({ daily, unit }) {
  return (
    <section className="forecast-section">
      <div className="forecast-heading">
        <h2>Dự báo 7 ngày</h2>
        <span>7 ngày tới</span>
      </div>

      <div className="forecast-list">
        {daily.time.map((date, index) => {
          const weather = getWeatherInfo(daily.weather_code[index]);
          const formattedDate = formatDate(date);

          const maxTemp = convertTemperature(
            daily.temperature_2m_max[index],
            unit
          );

          const minTemp = convertTemperature(
            daily.temperature_2m_min[index],
            unit
          );

          return (
            <div className="forecast-item" key={date}>
              <div className="forecast-date">
                <strong>
                  {index === 0 ? "Hôm nay" : formattedDate.weekday}
                </strong>
                <span>{formattedDate.date}</span>
              </div>

              <div className="forecast-condition">
                <span className="forecast-icon" role="img" aria-label={weather.description}>
                  {weather.icon}
                </span>
                <span className="forecast-description">
                  {weather.description}
                </span>
              </div>

              <div className="forecast-temp">
                <strong>{maxTemp}°</strong>
                <span>{minTemp}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Forecast;
