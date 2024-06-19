const Service = require('node-windows').Service;
const path = require('path');

// Créez une nouvelle instance de Service
const svc = new Service({
  name: 'BlasterAPI',
  description: 'Webservice qui manipule le mantis',
  script: path.join(__dirname, 'dist', 'server.js'), // Chemin vers votre script principal
  env: {
    name: 'NODE_ENV',
    value: 'production',
  },
});

// Écoutez les événements de Service
svc.on('install', () => {
  svc.start();
});

// Installez le service
svc.install();
