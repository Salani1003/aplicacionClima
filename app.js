require("dotenv").config();
const {
  leerInput,
  inquireMenu,
  pausa,
  listarLugares,
} = require("./helpers/inquired");
const Busquedas = require("./models/busquedas");

const main = async () => {
  let opt = "";
  const busquedas = new Busquedas();
  do {
    opt = await inquireMenu();
    switch (opt) {
      case 1:
        //mostrar mensaje
        const termino = await leerInput("Ingrese el lugar:");
        //buscar lugares
        const lugares = await busquedas.ciudad(termino);
        //seleccione lugar
        const idSeleccionado = await listarLugares(lugares);
        if (idSeleccionado === "0") continue;

        const {nombre, lat, lng} = lugares.find(l => l.id === idSeleccionado);
        busquedas.agregarHistorial(nombre);
        //clima
        const clima = await busquedas.climaPorLugar(lng, lat);
        console.log(clima);
        //mostrar resultados
        console.log("\nInformacion del lugar\n".green);
        console.log("Ciudad".blue, nombre);
        console.log("Lat".blue, lat);
        console.log("Long".blue, lng);
        console.log("T.Min:".blue, clima.tMin);
        console.log("T. Max:".blue, clima.tMax);
        console.log("Temperatura:".blue, clima.temp);
        console.log("Estado : ".blue, clima.desc);

        break;
      case 2:
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const index = `${i + 1}`.green;
          console.log(`${index} ${lugar}`);
        });
        break;
    }
    await pausa();
  } while (opt !== 0);
};

main();
