const AmfLoader = {};
AmfLoader.load = function(endpointIndex, methodIndex) {
  endpointIndex = endpointIndex || 0;
  methodIndex = methodIndex || 0;
  const url = location.protocol + '//' + location.host +
    location.pathname.substr(0, location.pathname.lastIndexOf('/'))
    .replace('/test', '/models') + '/demo-api.json';
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      let data;
      try {
        data = JSON.parse(e.target.response);
      } catch (e) {
        reject(e);
        return;
      }
      resolve(data);
    });
    xhr.addEventListener('error',
      () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};