<template>
  <div class="page-list">
    <h6 class="firstSection">Benutzer</h6>
    <ul id="items">
      <li
        v-for="(page, index) in pages"
        :key="page.id"
        :class="{ lastItem: index === pages.length - 1 }"
      >
        <router-link :to="page.url" class="list-item">
          <span class="list-item-title">{{ page.description }}</span>
          <span class="list-item-link">></span>
        </router-link>
      </li>
    </ul>

    <h6 class="secondSection">Stammdaten-Technische Daten</h6>
    <ul id="stamdatten">
      <li
        v-for="(data, index) in stamdatten"
        :key="data.id"
        :class="{ lastItem: index === stamdatten.length - 1 }"
      >
        <router-link :to="data.url" @click.prevent="" class="list-item">
          <span class="list-item-title">{{ data.description }}</span>
          <span class="list-item-link">></span>
        </router-link>
      </li>
    </ul>

    <h6 class="thirdSection">Pflegeplan</h6>
    <ul id="pflege">
      <li
        v-for="(pflege, index) in pflegen"
        :key="pflege.id"
        :class="{ lastItem: index === pflegen.length - 1 }"
      >
        <router-link :to="pflege.url" class="list-item">
          <span class="list-item-title">{{ pflege.description }}</span>
          <span class="list-item-link">></span>
        </router-link>
      </li>
    </ul>

    <h6 class="fourthSection">Baumkontrolle</h6>
    <ul id="baum">
      <li
        v-for="(baum, index) in baums"
        :key="baum.id"
        :class="{ lastItem: index === baums.length - 1 }"
      >
        <router-link :to="baum.url" class="list-item">
          <span class="list-item-title">{{ baum.description }}</span>
          <span class="list-item-link">></span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pages: [
        {
          id: 1,
          name: "Benutzerliste",
          url: "management/Benutzerliste",
          description: "Benutzerliste"
        }
      ],
      stamdatten: [
        {
          id: 2,
          url: "management/Baumart",
          description: "Baumart"
        },
        {
          id: 3,
          url: "management/Bedeckung",
          description: "Bedeckung"
        },
        {
          id: 4,
          url: "management/Bewuchs",
          description: "Bewuchs"
        },
        {
          id: 5,
          name:"Spinnentiere",
          url: "management/Spinnentiere",
          description: "Spinnentiere"
        },
        {
          id: 6,
          name:"Gesundheit",
          url: "management/Health",
          description: "Gesundheit"
        },
        {
          id: 7,
          name:"Parasit",
          url: "management/Parasit",
          description: "Parasit"
        },
        {
          id: 8,
          name:"Verkehrssicherheit",
          url: "management/RoadSafety",
          description: "Verkehrssicherheit"
        }
      ],
      pflegen: [
        {
          id: 9,
          name:"Massnahme",
          url: "management/Massnahme",
          description: "Massnahme"
        },
        {
          id: 10,
          name:"Material Liste",
          url: "management/MaterialListe",
          description: "Material liste"
        },
        
      ],

      baums: [
        {
          id: 11,
          url: "management/WeitereStofeintrage",
          description: "Weitere Stofeinträge "
        },
         {
          id: 12,
          name:"Kaferliste",
          url: "management/Kafer",
          description: "Käfer"
        },
        {
          id: 13,
          name:"Insekten",
          url: "management/Insekten",
          description: "Insekten"
        },
        {
          id: 14,
          name:"Vogel",
          url: "management/Vogel",
          description: "Vögel"
        },
        {
          id: 15,
          url: "management/HolzzersetzendePilze",
          description: "Holzzersetzende Pilze"
        },
        {
          id: 16,
          url: "management/Saugetiere",
          description: "Säugetiere"
        },
        {
          id: 17,
          url: "management/StandortSozialgefuge",
          description: "Standort/Sozialgefüge"
        }
      ]
    };
  }
};
</script>

<style>
.page-list {
  width: 65%;
  margin: 0 auto;
}
h6 {
  font-size: 20px;
  width: 88%;
  margin: 0 auto;
  border-bottom: 1px solid rgb(255, 255, 255);
  border-width: 1px;
}

li {
  margin: 0 auto;
  list-style-type: none;
  width: 88%;
  padding: 9.3px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.199);
  font-size: 16px;
  float: center;
}
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 0;
  color: white;
}
.lastItem {
  border-bottom: none;
}
.list-item-title {
  display: inline-block;
  color: white;
}
.list-item-link {
  display: flex;
  color: green;
  float: right;
  margin: 2.0px;
}
</style>
