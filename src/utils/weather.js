
export function getWeatherInfo(code) {
  if (code === 0) {
    return { icon: "☀️", description: "Trời quang", theme: "sunny" };
  }

  if (code === 1 || code === 2) {
    return { icon: "🌤️", description: "Ít mây", theme: "sunny" };
  }

  if (code === 3) {
    return { icon: "☁️", description: "Nhiều mây", theme: "cloudy" };
  }

  if (code === 45 || code === 48) {
    return { icon: "🌫️", description: "Sương mù", theme: "cloudy" };
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return { icon: "🌦️", description: "Mưa phùn", theme: "rainy" };
  }

  if ([61, 63, 65, 66, 67].includes(code)) {
    return { icon: "🌧️", description: "Trời mưa", theme: "rainy" };
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { icon: "❄️", description: "Có tuyết", theme: "cloudy" };
  }

  if ([80, 81, 82].includes(code)) {
    return { icon: "🌧️", description: "Mưa rào", theme: "rainy" };
  }

  if ([95, 96, 99].includes(code)) {
    return { icon: "⛈️", description: "Dông", theme: "stormy" };
  }

  return { icon: "🌡️", description: "Không xác định", theme: "default" };
}

export function convertTemperature(temp, unit) {
  if (typeof temp !== "number") return "--";

  if (unit === "F") {
    return Math.round(temp * 9 / 5 + 32);
  }

  return Math.round(temp);
}

export function formatDate(dateString) {
  if (!dateString) return "--";

  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  const weekday = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    timeZone: "UTC",
  }).format(date);

  return {
    weekday,
    date: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}`,
  };
}

export function formatUpdateTime(timeString) {
  if (!timeString) return "--";

  const [date, time] = timeString.split("T");
  const [year, month, day] = date.split("-");

  return `${time.slice(0, 5)} - ${day}/${month}/${year}`;
}

export function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}
