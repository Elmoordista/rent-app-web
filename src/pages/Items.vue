<template>
  <v-card class="ma-4">
    <v-card-title>Rental Items</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        item-key="id"
      >
        <!-- Clickable image -->
        <template v-slot:item.image="{ item }">
          <v-avatar size="40" class="cursor-pointer" @click="previewImage(item.image)">
            <img :src="item.image" alt="item" />
          </v-avatar>
        </template>

        <!-- Status Chip -->
        <template v-slot:item.status="{ item }">
          <v-chip :color="item.status === 'Available' ? 'green' : 'red'" dark>
            {{ item.status }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card-text>

    <!-- Image Preview Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-img :src="selectedImage" aspect-ratio="1.5" contain></v-img>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      selectedImage: '',
      items: [
        {
          id: 1,
          name: 'Toyota Vios',
          category: 'Cars',
          price: 1500,
          status: 'Available',
          owner: 'John Doe',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMjtv_y0RR_pg76EiQypXRHnsQeRqcLUD8DA&s' // your base64 here
        },
        {
          id: 2,
          name: 'Office Chair - Ergonomic',
          category: 'Chairs',
          price: 100,
          status: 'Rented',
          owner: 'Furniture Hub',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJEj9F9Dyc6_TuUobnUxGcEJhbAufbJJ8mCg&s'
        },
        {
          id: 3,
          name: 'Samsung Refrigerator',
          category: 'Appliances',
          price: 350,
          status: 'Available',
          owner: 'Appliance Rentals PH',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT82B0cz_xgfqIYhUqsS5VPKMDRbr9oNg6S8w&s'
        },
        {
          id: 4,
          name: 'HD Projector',
          category: 'Electronics',
          price: 500,
          status: 'Available',
          owner: 'Tech Rentals',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWdQqPGJsA92rW3kJSQXvHdLOHfpGRwarFWw&s'
        },
        {
          id: 5,
          name: 'Camping Tent - 4 Person',
          category: 'Tents',
          price: 200,
          status: 'Rented',
          owner: 'John Doe',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-hGYKidzYB791nQ32cvl3GYZXiWmMRTcN9Q&s'
        }
      ],
      headers: [
        { text: 'Image', value: 'image', sortable: false },
        { text: 'Item Name', value: 'name' },
        { text: 'Category', value: 'category' },
        { text: 'Price (₱)', value: 'price' },
        { text: 'Status', value: 'status' },
        { text: 'Owner', value: 'owner' }
      ]
    };
  },
  methods: {
    previewImage(imageUrl) {
      this.selectedImage = imageUrl;
      this.dialog = true;
    }
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
