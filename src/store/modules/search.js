import axios from "axios";

const searchStore = {
  state: {
    baumartlisteResults: [],
    massnahmeResults: [],
    // Add other component-specific search results properties here
  },
  mutations: {
    setBaumartlisteResults(state, results) {
      state.baumartlisteResults = results;
    },
    setCoverageTypeResults(state,results) {
      state.coverageTypeResults = results;
    },
    setVegetationTypeResults(state,results) {
      state.setVegetationTypeResults=results;
    },
    setArachnidTypeResults(state,results) {
      state.setArachnidTypeResults=results;
    },
    setHealthTypeResults(state,results) {
      state.setHealthTypeResults=results;
    },
    setParasitTypeResults(state,results) {
      state.setParasitTypeResults=results;
    },
    setRoadSafetyTypeResults(state,results) {
      state.setRoadSafetyTypeResults=results;
    },
    setSubstanceTypeResults(state,results) {
      state.setSubstanceTypeResults=results;
    },
    setBeetleTypeResults(state,results) {
      state.setBeetleTypeResults=results;
    },
    setInsectTypeResults(state,results) {
      state.setInsectTypeResults=results;
    },
    setBirdTypeResults(state,results) {
      state.setBirdTypeResults=results;
    },
    setMushroomTypeResults(state,results) {
      state.setMushroomTypeResults=results;
    },
    setMammalTypeResults(state,results) {
      state.setMammalTypeResults=results;
    },
    setLocationTypeResults(state,results) {
      state.setLocationTypeResults=results;
    },
    setInventarResults(state,results) {
      state.setInventarResults=results;
    },
    setWorkTypeResults(state, results) {
      state.setWorkTypeResults = results;
    },
    // Add other mutation methods here
  },
  actions: {
    async searchBaumartListe({ commit }, query) {
        try {
          const response = await axios.get("https://tilia.rrota.org/api/TreeType/GetAll");
          const results = response.data.filter((item) => {
            return item.name.toLowerCase().includes(query.toLowerCase());
          });
          commit("setBaumartlisteResults", results);
        } catch (error) {
          console.error("Error searching baumartListe", error);
          throw error;
        }
      },
      async searchCoverageType({ commit }, query) {
        try {
          const response = await axios.get("https://tilia.rrota.org/api/CoverageType/GetAll");
          const results = response.data.filter((item) => {
            return item.name.toLowerCase().includes(query.toLowerCase());
          });
          commit("setCoverageTypeResults", results);
        } catch (error) {
          console.error("Error searching CoverageType list", error);
          throw error;
        }
      },
      async searchVegetationType({ commit }, query) {
        try {
          const response = await axios.get("https://tilia.rrota.org/api/VegetationType/GetAll");
          const results = response.data.filter((item) => {
            return item.name.toLowerCase().includes(query.toLowerCase());
          });
          commit("setVegetationTypeResults", results);
        } catch (error) {
          console.error("Error searching CoverageType list", error);
          throw error;
        }
      },
      async searchArachnidType({ commit }, query) {
        try {
          const response = await axios.get("https://tilia.rrota.org/api/Arachnids/GetAll");
          const results = response.data.filter((item) => {
            return item.name.toLowerCase().includes(query.toLowerCase());
          });
          commit("setArachnidTypeResults", results);
        } catch (error) {
          console.error("Error searching Arachnids type list", error);
          throw error;
        }
      },
      async searchHealthType({ commit }, query) {
        try {
          const response = await axios.get("https://tilia.rrota.org/api/Health/GetAll");
          const results = response.data.filter((item) => {
            return item.name.toLowerCase().includes(query.toLowerCase());
          });
          commit("setHealthTypeResults", results);
        } catch (error) {
          console.error("Error searching Health type list", error);
          throw error;
        }
      },
      async searchParasitType({ commit }, query) {
        try {
          const response = await axios.get("https://tilia.rrota.org/api/Parasit/GetAll");
          const results = response.data.filter((item) => {
            return item.name.toLowerCase().includes(query.toLowerCase());
          });
          commit("setParasitTypeResults", results);
        } catch (error) {
          console.error("Error searching Health type list", error);
          throw error;
        }
      },
      async searchRoadSafetyType({ commit }, query) {
        try {
          const response = await axios.get("https://tilia.rrota.org/api/RoadSafety/GetAll");
          const results = response.data.filter((item) => {
            return item.name.toLowerCase().includes(query.toLowerCase());
          });
          commit("setRoadSafetyTypeResults", results);
        } catch (error) {
          console.error("Error searching Health type list", error);
          throw error;
        }
      },
      async searchSubstanceType({ commit }, query) {
        try {
          const response = await axios.get("https://tilia.rrota.org/api/OtherSubstanceInputs/GetAll");
          const results = response.data.filter((item) => {
            return item.name.toLowerCase().includes(query.toLowerCase());
          });
          commit("setSubstanceTypeResults", results);
        } catch (error) {
          console.error("Error searching Health type list", error);
          throw error;
        }
      },
      async searchBeetleType({ commit }, query) {
        try {
          const response = await axios.get("https://tilia.rrota.org/api/Beetle/GetAll");
          const results = response.data.filter((item) => {
            return item.name.toLowerCase().includes(query.toLowerCase());
          });
          commit("setBeetleTypeResults", results);
        } catch (error) {
          console.error("Error searching Beetle type list", error);
          throw error;
        }
      },
      async searchInsectType({ commit }, query) {
        try {
          const response = await axios.get("https://tilia.rrota.org/api/InsectType/GetAll");
          const results = response.data.filter((item) => {
            return item.name.toLowerCase().includes(query.toLowerCase());
          });
          commit("setInsectTypeResults", results);
        } catch (error) {
          console.error("Error searching Beetle type list", error);
          throw error;
        }
      },
       async searchBirdType({ commit }, query) {
        try {
          const response = await axios.get("https://tilia.rrota.org/api/Bird/GetAll");
          const results = response.data.filter((item) => {
            return item.name.toLowerCase().includes(query.toLowerCase());
          });
          commit("setBirdTypeResults", results);
        } catch (error) {
          console.error("Error searching Beetle type list", error);
          throw error;
        }
      },
      async searchMushroomType({ commit }, query) {
        try {
          const response = await axios.get("https://tilia.rrota.org/api/MushroomType/GetAll");
          const results = response.data.filter((item) => {
            return item.name.toLowerCase().includes(query.toLowerCase());
          });
          commit("setMushroomTypeResults", results);
        } catch (error) {
          console.error("Error searching Beetle type list", error);
          throw error;
        }
      },
      async searchMammalType({ commit }, query) {
        try {
          const response = await axios.get("https://tilia.rrota.org/api/Mammals/GetAll");
          const results = response.data.filter((item) => {
            return item.name.toLowerCase().includes(query.toLowerCase());
          });
          commit("setMammalTypeResults", results);
        } catch (error) {
          console.error("Error searching Beetle type list", error);
          throw error;
        }
      },
      async searchLocationType({ commit }, query) {
        try {
          const response = await axios.get("https://tilia.rrota.org/api/Location/GetAll");
          const results = response.data.filter((item) => {
            return item.name.toLowerCase().includes(query.toLowerCase());
          });
          commit("setLocationTypeResults", results);
        } catch (error) {
          console.error("Error searching Beetle type list", error);
          throw error;
        }
      },
      async InventarType({ commit }, query) {
        try {
          const response = await axios.get("https://tilia.rrota.org/api/Inventar/GetAll/{year}");
          const results = response.data.filter((item) => {
            return item.name.toLowerCase().includes(query.toLowerCase());
          });
          commit("setInventarResults", results);
        } catch (error) {
          console.error("Error searching Beetle type list", error);
          throw error;
        }
      },
      async searchWorkType({ commit }, query) {
        try {
          const response = await axios.get("https://tilia.rrota.org/api/WorkType/GetAll");
          const results = response.data.filter((item) => {
            return item.name.toLowerCase().includes(query.toLowerCase());
          });
          commit("setWorkTypeResults", results);
        } catch (error) {
          console.error("Error searching Health type list", error);
          throw error;
        }
      },
  },
  getters: {
    getBaumartlisteResults(state) {
      return state.baumartlisteResults;
    },
    getCoverageTypeResults(state) {
      return state.coverageTypeResults;
    },
    getVegetationTypeResults(state) {
      return state.vegetationTypeResults;
    },
    getArachnidTypeResults(state) {
      return state.arachnidTypeResults;
    },
    getHealthTypeResults(state) {
      return state.healthTypeResults;
    },
    getParasitTypeResults(state) {
      return state.parasitTypeResults;
    },
    getRoadSafetyTypeResults(state) {
      return state.roadSafetyTypeResults;
    },
    getSubstanceTypeResults(state) {
      return state.substanceTypeResults;
    },
    getBeetleTypeResults(state) {
      return state.beetleTypeResults;
    },
    getInsectTypeResults(state) {
      return state.insectTypeResults;
    },
    getBirdTypeResults(state) {
      return state.birdTypeResults;
    },
    getMushroomTypeResults(state) {
      return state.mushroomTypeResults;
    },
    getMammalTypeResults(state) {
      return state.mammalTypeResults;
    },
    getLocationTypeResults(state) {
      return state.locationTypeResults;
    },
    getInventarResults(state) {
      return state.InventarResults;
    },
    getWorkTypeResults(state) {
      return state.workTypeResults;
    },
   
    // Add other getters here
  },
};

export default searchStore;
