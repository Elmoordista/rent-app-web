<template>
  <v-card class="ma-4">
    <v-card-title>Booking Records</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="bookings"
        item-key="id"
      >
        <template v-slot:item.status="{ item }">
          <v-chip :color="item.status === 'Confirmed' ? 'green' : 'orange'" dark>
            {{ item.status }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      bookings: [
        {
          id: 1,
          item: 'Toyota Vios',
          user: 'John Doe',
          email: 'john@example.com',
          startDate: '2025-06-25',
          endDate: '2025-06-28',
          status: 'Confirmed'
        },
        {
          id: 2,
          item: 'Office Chair - Ergonomic',
          user: 'Jane Smith',
          email: 'jane@example.com',
          startDate: '2025-06-24',
          endDate: '2025-06-30',
          status: 'Pending'
        },
        {
          id: 3,
          item: 'HD Projector',
          user: 'Carlos Reyes',
          email: 'carlos@techrentals.com',
          startDate: '2025-06-20',
          endDate: '2025-06-22',
          status: 'Confirmed'
        }
      ],
      headers: [
        { text: 'Item Name', value: 'item' },
        { text: 'User', value: 'user' },
        { text: 'Email', value: 'email' },
        { text: 'Start Date', value: 'startDate' },
        { text: 'End Date', value: 'endDate' },
        { text: 'Status', value: 'status' }
      ]
    };
  }
};
</script>
