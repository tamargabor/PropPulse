param serverName string = 'proppulse-sql-db'
param dbName string = 'PropPulseDB'
param location string = resourceGroup().location
param adminLogin string = 'pulseadmin'
@secure()
param adminPassword string

resource sqlServer 'Microsoft.Sql/servers@2022-05-01-preview' = {
  name: serverName
  location: location
  properties: {
    administratorLogin: adminLogin
    administratorLoginPassword: adminPassword
  }
}

resource sqlDatabase 'Microsoft.Sql/servers/databases@2022-05-01-preview' = {
  parent: sqlServer
  name: dbName
  location: location
  sku: {
    name: 'Basic' // PoC-hoz elég
  }
}