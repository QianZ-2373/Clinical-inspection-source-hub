# Builds a single self-contained index.html (data.js + app.js inlined) for GitHub Pages.
# Run after editing data.js / app.js / the HTML:  right-click > "Run with PowerShell"
$dir  = $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
$html = [IO.File]::ReadAllText((Join-Path $dir 'Open this_Html tool.html'), $utf8)
$data = [IO.File]::ReadAllText((Join-Path $dir 'data.js'), $utf8)
$app  = [IO.File]::ReadAllText((Join-Path $dir 'app.js'), $utf8)

$html = $html.Replace('<script src="data.js"></script>', "<script>`n" + $data + "`n</script>")
$html = $html.Replace('<script src="app.js"></script>', "<script>`n" + $app + "`n</script>")

if ($html.Contains('src="data.js"') -or $html.Contains('src="app.js"')) { throw 'Script tags not found in the HTML file.' }
[IO.File]::WriteAllText((Join-Path $dir 'index.html'), $html, $utf8)
Write-Host "index.html written ($([math]::Round($html.Length / 1kb)) KB)"
