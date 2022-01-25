const fs = require("fs");

const axios = require("axios");

class Busquedas {
  historial = [];
  dbPath = "./db/database.json";

  constructor() {
    this.leerDB();
  }

  get historialCapitalizado() {
    return this.historial.map(lugar => {
      let palabras = lugar.split(" ");
      palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

      return palabras.join(" ");
    });
  }

  get ParamsMapbox() {
    return {
      access_token: process.env.MAPBOX,
      limit: 5,
      language: "es",
    };
  }
  get ParamsWeather() {
    return {
      appid: process.env.OPENWEATHER,
      lang: "es",
      units: "metric",
    };
  }

  async ciudad(lugar = "") {
    try {
      const instance = axios.default.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/`,
        params: this.ParamsMapbox,
      });
      const resp = await instance.get(`${lugar}.json`);

      return resp.data.features.map(lugar => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      console.log("No se encontro nada");
      return [];
    }
  }
  async climaPorLugar(lon, lat) {
    try {
      const instance = axios.default.create({
        baseURL: `https://api.openweathermap.org/`,
        params: {...this.ParamsWeather, lon, lat},
      });

      const resp = await instance.get(`data/2.5/weather`);

      const {weather, main} = resp.data;
      console.log(main);
      console.log(weather);
      return {
        temp: main.temp,
        tMin: main.temp_min,
        tMax: main.temp_max,
        desc: weather[0].description,
      };
    } catch (error) {
      console.log(error);
    }
  }

  agregarHistorial(lugar = "") {
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return;
    }
    this.historial = this.historial.splice(0, 4);
    this.historial.unshift(lugar.toLocaleLowerCase());
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }
  leerDB() {
    if (!fs.existsSync(this.dbPath)) {
      return null;
    }
    const info = fs.readFileSync(this.dbPath, {encoding: "utf-8"});
    const data = JSON.parse(info);
    this.historial = data.historial;
  }
}

module.exports = Busquedas;
