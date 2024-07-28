import Worker from 'worker-loader!./worker';

const worker = new Worker();

export function fetchMapDataRegions() {
  return new Promise((resolve, reject) => {
    worker.addEventListener('message', (event) => {
      const { action, data } = event.data;
      if (action === 'mapDataRegions') {
        resolve(data);
      }
    });

    worker.postMessage({ action: 'fetchMapDataRegions' });
  });
}


export function fetchMapDataAreaRegions(inventarId) {
    return new Promise((resolve, reject) => {
      worker.addEventListener('message', (event) => {
        const { action, data } = event.data;
        if (action === 'mapDataAreaRegions') {
          resolve(data);
        }
      });
  
      worker.postMessage({ action: 'fetchMapDataAreaRegions', inventarId });
    });
  }
  
  export function fetchMapDataTreeRegions(inventarId) {
    return new Promise((resolve, reject) => {
      worker.addEventListener('message', (event) => {
        const { action, data } = event.data;
        if (action === 'mapDataTreeRegions') {
          resolve(data);
        }
      });
  
      worker.postMessage({ action: 'fetchMapDataTreeRegions', inventarId });
    });
  }