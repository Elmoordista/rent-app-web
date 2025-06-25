<template>
  <v-card class="ma-4">
    <v-card-title>Rental Categories</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="categories"
        item-key="id"
      ></v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      categories: [
        {
          id: 1,
          name: 'Cars',
          description: 'Vehicles available for short or long-term rental.',
          status: 'Active',
          owner: 'Admin'
        },
        {
          id: 2,
          name: 'Chairs',
          description: 'Chairs for events, meetings, or home use.',
          status: 'Active',
          owner: 'John Doe'
        },
        {
          id: 3,
          name: 'Appliances',
          description: 'Rentable kitchen or home appliances.',
          status: 'Inactive',
          owner: 'Jane Smith'
        },
        {
          id: 4,
          name: 'Tents',
          description: 'Outdoor tents for camping or events.',
          status: 'Active',
          owner: 'Admin'
        },
        {
          id: 5,
          name: 'Projectors',
          description: 'Multimedia equipment for presentations.',
          status: 'Active',
          owner: 'Event Rentals Inc.'
        }
      ],
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Status', value: 'status' },
        { text: 'Owner', value: 'owner' }
      ]
    }
  }
}
</script>
