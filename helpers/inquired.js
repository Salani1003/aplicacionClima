const inquired = require("inquirer");
require("colors");

const preguntas = [
  {
    type: "list",
    name: "option",
    message: "¿Que desea hacer?",
    choices: [
      {
        value: 1,
        name: `${"1".brightGreen}.Buscar ciudad`,
      },
      {
        value: 2,
        name: `${"2".brightGreen}.Historial`,
      },
      {
        value: 0,
        name: `${"0".brightGreen}.Salir`,
      },
    ],
  },
];

const inquireMenu = async () => {
  //console.clear();
  console.log("===============================================".green);
  console.log("             Seleccione una opcion             ".white);
  console.log("===============================================\n".green);

  const {option} = await inquired.prompt(preguntas);
  return option;
};

const pausa = async () => {
  const continuar = [
    {
      type: "input",
      name: "seguir",
      message: `Presione ${"ENTER".blue} para continuar\n `,
    },
  ];
  await inquired.prompt(continuar);
};

const leerInput = async message => {
  const question = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Ingrese un valor";
        }
        return true;
      },
    },
  ];

  const {desc} = await inquired.prompt(question);
  return desc;
};

const listarLugares = async (lugares = []) => {
  const choices = lugares.map((lugar, i) => {
    const index = `${i + 1}.`.green;
    return {
      value: lugar.id,
      name: `${index} ${lugar.nombre}`,
    };
  });

  choices.unshift({
    value: "0",
    name: "0.".green + "Cancelar",
  });

  const preguntas = [
    {
      type: "list",
      name: "id",
      message: "Seleccione lugar",
      choices,
    },
  ];

  const {id} = await inquired.prompt(preguntas);
  return id;
};

const confirmar = async message => {
  const pregunta = [
    {
      type: "confirm",
      name: "ok",
      message,
    },
  ];
  const {ok} = await inquired.prompt(pregunta);
  return ok;
};

const listadoChecklist = async (tareas = []) => {
  const choices = tareas.map((tarea, i) => {
    const index = `${i + 1}.`.green;
    return {
      value: tarea.id,
      name: `${index} ${tarea.desc}`,
      checked: tarea.completadoEn ? true : false,
    };
  });

  const preguntas = [
    {
      type: "checkbox",
      name: "ids",
      message: "Seleccione",
      choices,
    },
  ];

  const {ids} = await inquired.prompt(preguntas);
  return ids;
};
module.exports = {
  inquireMenu,
  pausa,
  leerInput,
  listarLugares,
  confirmar,
  listadoChecklist,
};
