module.exports = {
  apps: [
    {
      name   : "server",
      script: "./dist/index.js",
      instances: 1,
      exec_mode: "cluster"
    },
    {
      name: "worker",
      script: "./dist/events/index.js",
      instances: 1,
      exec_mode: "fork"
    }
  ]
}
