
import { useState } from "react";
import { normalizeText } from "../utils/weather";

function CityList({
  cities,
  selectedCity,
  onSelectCity,
  favorites,
  onToggleFavorite,
}) {
  const [search, setSearch] = useState("");

  const filteredCities = cities.filter((city) =>
    normalizeText(city.name).includes(normalizeText(search))
  );

  return (
    <aside className="city-panel">
      <div className="panel-heading">
        <h2>Thành phố Việt Nam</h2>
        <p>Chọn địa điểm để xem thời tiết</p>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder="Tìm kiếm thành phố..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Tìm kiếm thành phố"
      />

      <div className="city-list">
        {filteredCities.length === 0 ? (
          <p className="empty-search">Không tìm thấy thành phố.</p>
        ) : (
          filteredCities.map((city) => (
            <div
              key={city.id}
              className={`city-item ${
                selectedCity?.id === city.id ? "active" : ""
              }`}
            >
              <button
                type="button"
                className="city-name-button"
                onClick={() => onSelectCity(city)}
                aria-pressed={selectedCity?.id === city.id}
              >
                <span className="city-pin">📍</span>
                <span>{city.name}</span>
              </button>

              <button
                type="button"
                className="favorite-button"
                onClick={() => onToggleFavorite(city.id)}
                aria-label={`${
                  favorites.includes(city.id) ? "Bỏ yêu thích" : "Yêu thích"
                } ${city.name}`}
                aria-pressed={favorites.includes(city.id)}
                title="Yêu thích"
              >
                {favorites.includes(city.id) ? "★" : "☆"}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="city-footer">
        Đang hiển thị {filteredCities.length}/{cities.length} thành phố
      </div>
    </aside>
  );
}

export default CityList;
