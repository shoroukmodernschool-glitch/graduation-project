@echo off
cd /d "%~dp0"
echo Laravel: http://127.0.0.1:8000  (stop with Ctrl+C)
php artisan serve --host=127.0.0.1 --port=8000
