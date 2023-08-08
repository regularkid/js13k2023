ECHO OFF

REM Variable setup
SET year=%DATE:~-4%
SET month=%DATE:~4,2%
SET day=%DATE:~7,2%
SET hour=%TIME:~0,2%
SET minute=%TIME:~3,2%
SET second=%TIME:~6,2%
SET backupDirectory=%UserProfile%\Dropbox\SuperMicroFun\Projects\js13k_2023_Backups
SET backupPath=%backupDirectory%\Backup_%year%_%month%_%day%__%hour%_%minute%_%second%.zip
SET devPath=.\*

REM Zip up entire dev folder and put it in Dropbox
CALL "C:\Program Files\7-Zip\7z.exe" a -tzip %backupPath% %devPath%

REM Display to verify that it worked
DIR /a-d /o-d %backupDirectory%

REM Wait for user input
PAUSE