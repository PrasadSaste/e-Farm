const axios        = require('axios');
const { Alert }    = require('../models/Scheme');

// @desc  Get weather forecast
// @route GET /api/weather?lat=18.5&lon=73.8
exports.getForecast = async (req, res) => {
  try {
    const { lat = 18.52, lon = 73.85, city } = req.query;
    const query = city ? `q=${city},IN` : `lat=${lat}&lon=${lon}`;
    const key   = process.env.OPENWEATHER_KEY;

    // If no API key, return mock data for development
    if (!key || key === 'your_openweather_api_key') {
      return res.json({ success: true, data: getMockWeather() });
    }

    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${key}&units=metric`
    );

    const advisories = [];
    data.list.forEach(entry => {
      if (entry.rain?.['3h'] > 5)
        advisories.push({
          type: 'warning',
          message: `Heavy rain expected at ${entry.dt_txt}. Protect stored harvests.`,
        });
    });

    res.json({ success: true, data: { current: data.list[0], forecast: data.list.slice(0, 14), city: data.city, advisories } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get weather alerts
// @route GET /api/weather/alerts
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({
      type: 'weather',
      $or: [{ expiresAt: { $gte: new Date() } }, { expiresAt: null }],
    }).sort('-createdAt').limit(10);
    res.json({ success: true, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

function getMockWeather() {
  return {
    current: { main: { temp: 28, feels_like: 31, humidity: 72 }, weather: [{ description: 'partly cloudy', icon: '02d' }], wind: { speed: 3.3 } },
    forecast: [
      { dt_txt: '2025-02-24 12:00:00', main: { temp: 30, humidity: 68 }, weather: [{ description: 'sunny', icon: '01d' }] },
      { dt_txt: '2025-02-25 12:00:00', main: { temp: 26, humidity: 80 }, weather: [{ description: 'light rain', icon: '10d' }] },
      { dt_txt: '2025-02-26 12:00:00', main: { temp: 24, humidity: 88 }, weather: [{ description: 'heavy rain', icon: '09d' }] },
      { dt_txt: '2025-02-27 12:00:00', main: { temp: 29, humidity: 65 }, weather: [{ description: 'partly cloudy', icon: '02d' }] },
      { dt_txt: '2025-02-28 12:00:00', main: { temp: 31, humidity: 60 }, weather: [{ description: 'sunny', icon: '01d' }] },
    ],
    advisories: [
      { type: 'warning', message: 'Heavy rain expected Feb 26-27. Cover harvested cotton bales.' },
      { type: 'info',    message: 'Sunny spell Feb 28 - Mar 2 ideal for sowing tomato seedlings.' },
    ],
  };
}
