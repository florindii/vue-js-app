<template>
    <v-dialog v-model="dialogVisibleProp" @click:outside="closeDialog" class="dialog-right-top">
      <!-- Dialog content -->
      <v-btn @click="confirmDialog">Confirm</v-btn>
    </v-dialog>
  </template>
  <template>
    <v-dialog v-model="dialogVisibleProp" @click:outside="closeDialog"  max-width="500px">
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text>{{ message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="success" text @click="confirmDialog">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: ["dialogVisibleProp"], 
    message: {
      type: String,
      required: true
    },
    data() {
      return {
        dialogVisible: false
      };
    },
    methods: {
      closeDialog() {
        this.$emit('closeDialog');
      },
      confirmDialog() {
        // Perform actions when the dialog is confirmed
        // For example, you can emit an event to notify the parent component
        this.$emit('dialogConfirmed');
        
        // You can also close the dialog by setting dialogVisible to false
        this.dialogVisible = false;
      }
    }
  };
  </script>
  
