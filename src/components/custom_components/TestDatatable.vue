<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :expanded.sync="expanded"
      item-key="id"
      show-expand
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="text-center">
           <v-icon>mdi-lock-outline</v-icon> {{ item.description }}
        </td>
      </template>

      <template v-slot:item.data-table-expand="{ item, isExpanded }">
        <v-icon>
          {{ isExpanded ? 'mdi-lock-outline' : '' }}
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "Name", value: "name" },
        { text: "Email", value: "email" },
        { text: "Phone", value: "phone" },
        { text: '', value: 'data-table-expand' },
      ],
      items: [
        {
          id: 1,
          name: "John Doe",
          email: "johndoe@example.com",
          phone: "+1 555-123-4567",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          isLocked: false
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "janesmith@example.com",
          phone: "+1 555-987-6543",
          description:
            "Pellentesque vel tincidunt elit. Mauris non dolor id elit efficitur eleifend.",
          isLocked: true
        },
        {
          id: 3,
          name: "Bob Johnson",
          email: "bobjohnson@example.com",
          phone: "+1 555-555-5555",
          description:
            "Nam quis faucibus arcu. Cras congue mauris vitae quam venenatis, nec ultricies dolor dignissim.",
          isLocked: true
        }
      ],
      expanded: []
    };
  },
  mounted() {
    this.expanded = this.items.filter(item => item.isLocked);
  },
  methods: {}
};
</script>
