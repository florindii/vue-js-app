// self.addEventListener('message', async (event) => {
//   const { action, inventarId } = event.data;
  
//   if (action === 'fetchMapDataRegions') {
//     try {
//       const response = await fetch('https://tilia.rrota.org/api/Inventory/MapRegion');
//       console.log("ressss",response);
//       const data = await response.json();
//       console.log("ne worker",data);
//       self.postMessage({ action: 'mapDataRegions', data }); // Send the map data back to the main thread
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   else if (action === 'fetchMapDataAreaRegions') {
//     try {
//       const response = await fetch(`https://tilia.rrota.org/api/Tree/MapRegion/${inventarId}`);
//       const data = await response.json();
//       console.log("pemt",data);
//       self.postMessage({ action: 'mapDataAreaRegions', data }); // Send the area regions data back to the main thread
//     } catch (error) {
//       console.log(error);
//     }
//   } else if (action === 'fetchMapDataTreeRegions') {
//     try {
//       const response = await fetch(`https://tilia.rrota.org/api/Tree/MapRegion/${inventarId}`);
//       const data = await response.json();
//       console.log("area",data);
//       const processedData = data.treeRegions.map(region => {
//         return {
//           ...region,
//           coordinates: [region.coordinates], // Convert single coordinate pair to an array of arrays
//         };
//       });
//       self.postMessage({ action: 'mapDataTreeRegions', data: processedData }); // Send the tree regions data back to the main thread
//     } catch (error) {
//       console.log(error);
//     }
//   }
  
//   // Add other actions for different data fetching functions if needed
// });

console.log("erdh");
// worker.js
self.addEventListener('message', async (event) => {
  const { action, inventarId } = event.data;

  if (action === 'fetchMapDataRegions') {
    try {
      const data = await fetchMapDataRegions();
      self.postMessage({ action: 'mapDataRegionsFetched', data });
    } catch (error) {
      console.log(error);
    }
  } else if (action === 'fetchMapDataAreaRegions') {
    try {
      const data = await fetchMapDataAreaRegions(inventarId);
      self.postMessage({ action: 'mapDataAreaRegionsFetched', data });
    } catch (error) {
      console.log(error);
    }
  } else if (action === 'fetchMapDataTreeRegions') {
    try {
      const data = await fetchMapDataTreeRegions(inventarId);
      self.postMessage({ action: 'mapDataTreeRegionsFetched', data });
    } catch (error) {
      console.log(error);
    }
  }
});

async function fetchMapDataRegions() {
  const response = await fetch('https://tilia.rrota.org/api/Inventory/MapRegion');
  const data = await response.json();
  console.log("daataaaa",data);
  return data;
}

async function fetchMapDataAreaRegions(inventarId) {
  const response = await fetch(`https://tilia.rrota.org/api/Tree/MapRegion/${inventarId}`);
  const data = await response.json();
  return data.areaRegions;
}

async function fetchMapDataTreeRegions(inventarId) {
  const response = await fetch(`https://tilia.rrota.org/api/Tree/MapRegion/${inventarId}`);
  const data = await response.json();
  const treeRegions = data.treeRegions.map(region => ({
    ...region,
    coordinates: [region.coordinates], // Convert single coordinate pair to an array of arrays
  }));
  return treeRegions;
}

