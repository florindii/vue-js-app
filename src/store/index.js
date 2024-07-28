import Vuex from 'vuex'
import Vue from 'vue'
import largeSidebar from './modules/largeSidebar'
import compactSidebar from './modules/compactSidebar'
import chat from './modules/chat'
import themeConfig from './modules/themeConfig'
import authData from './modules/authData'
import invoice from './modules/invoice'
import cart from './modules/cart'
import verticalSidebar from './modules/verticalSidebar'
import scrumboard from './modules/scrumboard'
import baumart from "./modules/baumart"
import insect from "./modules/insect"
import mushroom from "./modules/mushroom"
import workType from "./modules/workType"
import vegetation from "./modules/vegetation"
import inventar from './modules/inventar'
import user from "./modules/user"
import bird from "./modules/bird"
import beetle from "./modules/beetle"
import arachnid from "./modules/arachnid"
import mammal from "./modules/mammal"
import substance from "./modules/substance"
import location from "./modules/location"
import coverage from "./modules/coverage"
import health from "./modules/health"
import parasit from "./modules/parasit"
import roadSafety from "./modules/roadSafety"
import search from "./modules/search"
import treeCoordinates from "./modules/treeCoordinates"
import viewTreeIdViewAreaId from './modules/viewTreeIdViewAreaId'
import selectedItemsToViewOnMap from './modules/selectedItemsToViewOnMap'
import treeTableData from './modules/treeTableData'
import searchKeyword from './modules/searchKeyword'
import createSqlTable from './modules/createSqlTable'
// Load Vuex
Vue.use(Vuex)

// Create store
export default new Vuex.Store({
  modules: {
    largeSidebar,
    compactSidebar,
    chat,
    themeConfig,
    authData,
    invoice,
    cart,
    verticalSidebar,
    scrumboard,
    baumart,
    insect,
    mushroom,
    workType,
    vegetation,
    inventar,
    user,
    bird,
    beetle,
    arachnid,
    mammal,
    substance,
    location,
    coverage,
    health,
    parasit,
    roadSafety,
    search,
    treeCoordinates,
    searchKeyword,
    viewTreeIdViewAreaId,
    selectedItemsToViewOnMap,
    treeTableData
  },
})
