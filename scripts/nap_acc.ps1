# ==============================================================
# SCRIPT TỰ ĐỘNG NẠP ACC TỪ FILE ACC.TXT LÊN HỆ THỐNG
# ==============================================================

$baseDir = Split-Path -Parent $PSScriptRoot
$txtFile = Join-Path $baseDir "acc.txt"
$configFile = Join-Path $baseDir "js\config.js"

Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "       ⚡ MA GIÁO AOV - CÔNG CỤ TỰ ĐỘNG NẠP ACC TỪ TXT        " -ForegroundColor Yellow
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $txtFile)) {
    Write-Host "[LỖI] Không tìm thấy file acc.txt tại: $txtFile" -ForegroundColor Red
    pause
    exit
}

# Đọc URL API từ config.js
$apiUrl = ""
if (Test-Path $configFile) {
    $cfgContent = Get-Content -Path $configFile -Raw -Encoding UTF8
    if ($cfgContent -match 'GOOGLE_SHEET_API_URL\s*:\s*"(https://script\.google\.com/macros/s/[^"]+)"') {
        $apiUrl = $matches[1]
    }
}

if (-not $apiUrl) {
    Write-Host "[LỖI] Chưa cấu hình GOOGLE_SHEET_API_URL trong js/config.js!" -ForegroundColor Red
    pause
    exit
}

# Đọc nội dung file acc.txt
$rawText = Get-Content -Path $txtFile -Raw -Encoding UTF8
$cleanLines = ($rawText -split "`n") | Where-Object { $_.Trim() -and -not $_.Trim().StartsWith("#") }

if (-not $cleanLines) {
    Write-Host "[CẢNH BÁO] File acc.txt chưa có Acc nào!" -ForegroundColor Yellow
    Write-Host "Vui lòng mở file acc.txt, dán danh sách tài khoản vào và lưu lại (Ctrl + S)." -ForegroundColor Yellow
    pause
    exit
}

Write-Host "[*] Đã đọc được $($cleanLines.Count) Acc từ file acc.txt." -ForegroundColor Cyan
Write-Host "[*] Đang gửi dữ liệu lên Google Sheets..." -ForegroundColor Cyan
Write-Host ""

$body = @{
    action = "import_txt"
    text = ($cleanLines -join "`n")
} | ConvertTo-Json

$bytes = [System.Text.Encoding]::UTF8.GetBytes($body)

try {
    $resp = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $bytes -ContentType "application/json; charset=utf-8" -TimeoutSec 20
    if ($resp.success) {
        Write-Host "==============================================================" -ForegroundColor Green
        Write-Host "🎉 THÀNH CÔNG: $($resp.message)" -ForegroundColor Green
        Write-Host "📦 Hiện kho có: $($resp.total_available) Acc sẵn sàng phát cho khách!" -ForegroundColor Green
        Write-Host "==============================================================" -ForegroundColor Green
    } else {
        Write-Host "[THẤT BẠI] $($resp.message)" -ForegroundColor Red
        if ($resp.error -eq "INVALID_ACTION") {
            Write-Host "💡 GỢI Ý: Vui lòng vào Apps Script trên Google Sheets dán lại mã mới nhất và bấm 'Triển khai phiên bản mới' nhé!" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "[LỖI KẾT NỐI] $_" -ForegroundColor Red
}

Write-Host ""
pause
