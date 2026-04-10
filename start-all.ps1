Write-Host "Starting Alumni Smart Archive System..." -ForegroundColor Green

# 1. AI Service
Write-Host "Launching AI Service (Port 5000)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ai-service; python app.py"

# 2. Backend
Write-Host "Launching Backend API (Port 5084)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; dotnet run"

# 3. Frontend
Write-Host "Launching Frontend (Port 3000)..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "All systems GO! Please wait for services to initialize." -ForegroundColor Cyan
