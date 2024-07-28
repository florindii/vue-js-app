export let items = [
  {
    title: "Inventar",
    icon: require("../assets/images/icons/inventar.svg"),
    activeIcon: require("../assets/images/icons/inventar-active.svg"),
    to: "/app/pages/inventar",
    activeWhen: "Inventar,InventarInfo,Inventar bearbeiten,Neues Inventar"
  },
  {
    title: "Baumliste",
    icon: require("../assets/images/icons/baumliste.svg"),
    activeIcon: require("../assets/images/icons/baumliste-active.svg"),
    to: "/app/pages/BaumList",
    activeWhen: "Baumliste,BaumProfil,NeuerBaum,Bearbeiten",
    meta: {
      requiredInventar: true
    }
  },

  {
    title: "Pflegeplan",
    icon: require("../assets/images/icons/pflegeplan.svg"),
    activeIcon: require("../assets/images/icons/pflegeplan-active.svg"),
    to: "/app/pages/tasks",
    activeWhen: "Pflegeplan,TaskProfil,Neue Pflegemassnahme,Pflegemassnahme bearbeiten",
    meta: {
      requiredInventar: true
    }
  },
  {
    title: "Baumkontrolle",
    icon: require("../assets/images/icons/baumkontrolle.svg"),
    activeIcon: require("../assets/images/icons/baumkontrolle-active.svg"),
    to: "/app/pages/BaumkontrolleList",
    activeWhen: "Baumkontrolle,BaumKontrollDetails",
    meta: {
      requiredInventar: true
    }
  },
  {
    title: "Berichte",
    icon: require("../assets/images/icons/berichte.svg"),
    activeIcon: require("../assets/images/icons/berichte-active.svg"),
    to: "/app/pages/BerichteGenerieren",
    activeWhen: "Berichte generieren",
    meta: {
      requiredInventar: true
    }
  },
  {
    title: "Suchen",
    icon: require("../assets/images/icons/suchen.svg"),
    activeIcon: require("../assets/images/icons/suchen-active.svg"),
    to: "/app/pages/GlobalSearch",
    activeWhen: "Suchen"
  },
  {
    title: "Verwaltung",
    icon: require("../assets/images/icons/verwaltung.svg"),
    activeIcon: require("../assets/images/icons/verwaltung-active.svg"),
    to: "/app/pages/management",
    activeWhen: "Verwaltung,Baumartliste,Material Liste,Benutzerliste,Bedeckung,Bewuchs,Spinnentiere,Gesundheit,Parasit,Verkehrssicherheit,Massnahme,Weitere Stoffeinträge,Kafer,Insektenlist,Vogel,Holzzersetzende Pilze,Säugetiere,Standort/Sozialgefüge"
  },
];
