$git = "C:\Program Files\Git\cmd\git.exe"
& $git config user.email "mohan@example.com"
& $git config user.name "Mohan"
& $git commit -m "first commit"
& $git branch -M main
& $git push -u origin main
