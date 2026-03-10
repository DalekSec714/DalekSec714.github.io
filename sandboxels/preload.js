const { ipcRenderer } = require('electron');

ipcRenderer.invoke('fetch-initial-data')
  .then((data) => window.initialData = data);

process.once('loaded', () => {
  window.addEventListener('message', event => {
    const message = event.data;

    // console.log(message);

    if (message.myTypeField === 'my-custom-message') {
      ipcRenderer.send('custom-message', message);
    }
  });

  ipcRenderer.on('message-to-client', (event, message) => {
    // console.log('Forwarding message to web page:', message);
    window.postMessage({ myTypeField: 'message-to-client', data: message });
  });

  ipcRenderer.on('ok', (event, response) => {
    // console.log('Received response from main:', response);

    // Optionally send it back to the web page if needed
    window.postMessage({ myTypeField: 'response-from-main', data: response });
  });
});