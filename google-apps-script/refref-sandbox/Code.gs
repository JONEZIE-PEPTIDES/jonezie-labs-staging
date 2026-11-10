// Private Apps Script project: Jonezie Partner Sandbox (jonezielabs@gmail.com).
// The API key lives only in the project's Script Properties.
function checkRefRefSandboxConnection() {
  const key = PropertiesService.getScriptProperties().getProperty('REFREF_SANDBOX_API_KEY');
  if (!key) throw new Error('Missing sandbox API key');
  const response = UrlFetchApp.fetch('https://api.refref.ai/v1/projects', {
    method: 'get',
    headers: { 'X-Api-Key': key },
    muteHttpExceptions: true
  });
  const status = response.getResponseCode();
  if (status !== 200) throw new Error('RefRef sandbox connection failed with HTTP ' + status);
  Logger.log('RefRef sandbox API connection: HTTP 200');
}
