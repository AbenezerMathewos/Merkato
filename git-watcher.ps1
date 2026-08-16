$folder = 'C:\INSA\Merkato.com'
$filter = '*.*'

$watcher = New-Object IO.FileSystemWatcher $folder, $filter -Property @{
    IncludeSubdirectories = $true
    EnableRaisingEvents = $true
}

$action = {
    $path = $Event.SourceEventArgs.FullPath
    # Ignore .git folder changes to prevent infinite loops when committing
    if ($path -notmatch '\\\.git\\') {
        Write-Output "FILE_CHANGED: $path"
    }
}

Register-ObjectEvent $watcher 'Changed' -Action $action > $null
Register-ObjectEvent $watcher 'Created' -Action $action > $null
Register-ObjectEvent $watcher 'Deleted' -Action $action > $null
Register-ObjectEvent $watcher 'Renamed' -Action $action > $null

Write-Output "Git watcher daemon started."

while ($true) {
    Start-Sleep -Seconds 1
}
