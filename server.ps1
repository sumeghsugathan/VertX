$port = 8085
$address = [System.Net.IPAddress]::Loopback
$listener = [System.Net.Sockets.TcpListener]::new($address, $port)

try {
    $listener.Start()
    Write-Host "Server listening on 127.0.0.1:$port..."
} catch {
    Write-Host "Error starting listener: $_"
    exit
}

$root = "d:\projects\VertX"

while ($true) {
    try {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = [System.IO.StreamReader]::new($stream)

        $requestLine = $reader.ReadLine()
        if ($null -ne $requestLine -and $requestLine.Length -gt 0) {
            $tokens = $requestLine.Split(' ')
            if ($tokens.Length -ge 2) {
                $path = $tokens[1]
                if ($path -eq "/") { $path = "/index.html" }
                $cleanPath = $path.Split('?')[0].TrimStart('/')
                $filePath = [System.IO.Path]::Combine($root, $cleanPath.Replace('/', '\'))

                if (Test-Path $filePath -PathType Leaf) {
                    $bytes = [System.IO.File]::ReadAllBytes($filePath)
                    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                    $contentType = switch ($ext) {
                        ".html" { "text/html; charset=utf-8" }
                        ".css"  { "text/css; charset=utf-8" }
                        ".js"   { "application/javascript; charset=utf-8" }
                        ".jpg"  { "image/jpeg" }
                        ".jpeg" { "image/jpeg" }
                        ".png"  { "image/png" }
                        ".svg"  { "image/svg+xml" }
                        default { "application/octet-stream" }
                    }
                    $responseHeader = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($responseHeader)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    $stream.Write($bytes, 0, $bytes.Length)
                } else {
                    $notFoundHeader = "HTTP/1.1 404 Not Found`r`nContent-Length: 0`r`nConnection: close`r`n`r`n"
                    $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes($notFoundHeader)
                    $stream.Write($notFoundBytes, 0, $notFoundBytes.Length)
                }
            }
        }
        $stream.Close()
        $client.Close()
    } catch {
        # continue loop
    }
}
