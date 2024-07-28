<template>
  <div class="material-list">
    <div v-if="pdfFiles.length === 0" class="empty-state">
      <v-icon class="empty-state-icon">mdi-file-document-outline</v-icon>
      <p class="empty-state-text">Laden Sie Ihr Dokument hier hoch</p>
      <v-btn color="primary" @click="openUploadModal">Dokument hochladen</v-btn>
    </div>
    <div v-else class="table-container">
      <v-col cols="3">
      <v-btn
        block
        height="42px"
        color="#1db954"
        class="download-btn"
        @click="openUploadModal"
      >
        <v-icon >mdi mdi-plus-thick</v-icon>
        Dokumente Hochladen
        </v-btn>
      </v-col>
      
      <v-data-table
        :headers="tableHeaders"
        :items="pdfFiles"
        :search="search"
        class="center-table"
      >
          <template v-slot:item.actions="{ item }">
          <v-icon small class="green--text mr-2" @click="deleteItem(item)">mdi-delete-outline</v-icon>
         
        </template>

        <template v-slot:item.pdf="{ item }">
          <a :href="item.url" target="_blank">{{ item.name }}</a>
        </template>
      </v-data-table>
    </div>

 <v-dialog v-model="modalOpen" max-width="500px">
  <template v-slot:activator="{ on }">
    <div class="add-new-user" @click.prevent="openUploadModal"></div>
  </template>
  <v-card>
    <v-card-title>
      <span class="document-label">Dokument hochladen</span>
    </v-card-title>
    <v-card-text>
      <div class="form-control" style="width: 100%">
        <label for="fileInput-MaterialList" style="height: 24px"></label>
        <div class="coverage-div"></div>
        <input
          ref="documentFilesMaterialList"
          type="file"
          id="fileInput-MaterialList"
          placeholder="Dokument hochladen"
          title="Dokument hochladen"
          @change="handleFileUpload"
        />
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="closeUploadModal">Abbrechen</v-btn>
      <v-btn color="primary" @click="uploadMaterialList">Upload</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

  </div>
</template>

<script>
import jsPDF from 'jspdf';
export default {
  data() {
    return {
      pdfFiles: [],
      modalOpen: false,
      tableHeaders: [
        { text: "PDF", value: "pdf", sortable: false },
        { text:"", value:"actions",sortable:false}
      ],
      search: "",
      pdfFiles: JSON.parse(localStorage.getItem('pdfFiles')) || []
    };
  },
  methods: {
    openUploadModal() {
      this.modalOpen = true;
    },
    closeUploadModal() {
      this.modalOpen = false;
    },
    handleFileUpload(event) {
      const files = event.target.files;
      this.pdfFiles = Array.from(files).map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      }));
    },
    uploadMaterialList() {
      console.log(this.pdfFiles);
      this.modalOpen = false;
    },
    deleteItem(item) {
      this.pdfFiles = this.pdfFiles.filter((pdf) => pdf !== item);
    },
    handleFileUpload(event) {
      const files = event.target.files;
      const newPdfFiles = Array.from(files).map((file)=> ({
          name:file.name,
          url:URL.createObjectURL(file),
      }))
      this.pdfFiles = [...this.pdfFiles,...newPdfFiles];

      localStorage.setItem('pdfFiles',JSON.stringify(this.pdfFiles))

    }     
  },
};
</script>

<style scoped>
.material-list {
  margin-top: 220px;
  text-align: center;
  padding: 40px;
}

.empty-state-icon {
  font-size: 64px;
}

.empty-state-text {
  font-size: 18px;
  margin-bottom: 20px;
}

.empty-state button {
  margin-top: 20px;
}

.table-container {
  margin-top:-250px !important;
}
.download-btn {
  margin-bottom:23px;

}

.center-table {
  margin: 0 auto;
}
.green--text {
  margin-left:-30px !important;


}
</style>