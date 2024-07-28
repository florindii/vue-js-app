<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="tableData"
        :items-per-page="50"
        hide-default-footer
    >
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: [
    "headers",
    "tableData",
  ],
  data() {
    return {

    }
  }
}
</script>

<style>

</style>