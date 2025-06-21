call ng update @angular/material@16
git add * && git commit -m "Update Angular Material to version 16"
pause

@REM loop from 17 to 20 and update anguarl, commit, update angular material, commit
for /l %%i in (17,18,19,20) do (
    call ng update @angular/core@%%i
    if errorlevel 1 (
        echo Failed to update @angular/core to version %%i
        exit /b 1
    )
    git add *
    if errorlevel 1 (
        echo Failed to add files to git after updating @angular/core to version %%i
        exit /b 1
    )
    git commit -m "Update Angular to version %%i"
    if errorlevel 1 (
        echo Failed to commit Angular update to version %%i
        exit /b 1
    )
    call ng update @angular/material@%%i
    if errorlevel 1 (
        echo Failed to update @angular/material to version %%i
        exit /b 1
    )
    git add *
    if errorlevel 1 (
        echo Failed to add files to git after updating @angular/material to version %%i
        exit /b 1
    )
    git commit -m "Update Angular Material to version %%i"
    if errorlevel 1 (
        echo Failed to commit Angular Material update to version %%i
        exit /b 1
    )
)
echo done!
