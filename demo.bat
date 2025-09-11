@echo off
REM Đường dẫn tới Chrome, bạn cần đúng với máy của mình
SET CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"

REM Link ứng dụng web của bạn
SET APP_URL=https://healthcare-kiosk.vercel.app

REM Chạy Chrome ở chế độ app, có title bar
%CHROME_PATH% ^

  --app=%APP_URL% ^
  --window-size=1280,800 ^
  --window-position=100,100 ^
  --autoplay-policy=no-user-gesture-required ^
  --no-first-run ^
  --disable-infobars ^
  --incognito

exit