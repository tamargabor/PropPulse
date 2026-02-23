resource staticWebApp 'Microsoft.Web/staticSites@2022-09-01' = {
  name: 'proppulse-swa'
  location: 'westeurope'
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    allowConfigFileUpdates: true
    stagingEnvironmentPolicy: 'Enabled'
  }
}

output swaDefaultHostName string = staticWebApp.properties.defaultHostname