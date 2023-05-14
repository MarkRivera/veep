import { driver } from "../events/index";

setInterval(() => { }, 1 << 30);

process.on("Ready", (data) => {
  console.log(data);
})

driver.on("Ready", (data) => {
  console.log(data);
});