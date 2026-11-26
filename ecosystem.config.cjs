module.exports = {
  apps: [
    {
      name: "nx-swift",
      cwd: __dirname,
      script: "./node_modules/@remix-run/serve/dist/cli.js",
      args: ["./build/server/index.js"],
      node_args: ["--env-file=.env"],
      exec_mode: "fork",
      instances: 1,
      restart_delay: 5000,
      time: true,
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
      },
    },
  ],
};
