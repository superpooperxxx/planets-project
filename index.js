const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");

const habitablePlanets = [];

function isHabitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

fs.createReadStream(path.resolve(__dirname, "kepler_data.csv"))
  .pipe(
    parse({
      delimiter: ",",
      comment: "#",
      columns: true,
    })
  )
  .on("data", (data) => {
    if (isHabitable(data)) {
      habitablePlanets.push(data);
    }
  })
  .on("error", (error) => console.log(error))
  .on("end", () => {
    console.log(habitablePlanets.map((planet) => planet["kepler_name"]));
    console.log(`${habitablePlanets.length} habitable planets found!`);
  });
