module.exports = {
  apps: [
    {
      name: "saada-frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "./frontend",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    },
    {
      name: "saada-backend",
      script: "dotnet",
      args: "./publish/AlumniSmartArchive.Backend.dll --urls http://0.0.0.0:5084",
      cwd: "./backend",
      watch: false,
      env: {
        ASPNETCORE_ENVIRONMENT: "Production",
        ASPNETCORE_URLS: "http://0.0.0.0:5084"
      }
    },
    {
      name: "saada-ai-service",
      script: "python",
      args: "-m uvicorn app:app --host 0.0.0.0 --port 5000",
      cwd: "./ai-service",
      watch: false
    }
  ]
};
