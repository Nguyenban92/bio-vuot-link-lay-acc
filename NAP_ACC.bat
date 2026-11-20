@echo off
chcp 65001 >nul
title NẠP KHO ACC TỪ FILE TXT - MA GIÁO AOV
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\nap_acc.ps1"
