param([int]$Port=4753)
$base="http://127.0.0.1:$Port"
foreach($id in @('ollama','groq')) {
  $body=@{provider=$id}|ConvertTo-Json
  $response=Invoke-RestMethod -Uri "$base/api/local-ai/test" -Method Post -ContentType 'application/json' -Body $body
  Write-Host "$id : $($response.status) : $($response.message)"
  if($id -eq 'ollama' -and -not $response.ok) { exit 1 }
  if($id -eq 'groq' -and $response.status -ne 'missing_key') { exit 2 }
}
