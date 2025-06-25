<template>
  <v-card class="ma-4">
    <v-card-title>User Information</v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="users"
        item-key="email"
      ></v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    users: [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        address: '123 Main St, Cityville',
        phone: '0917-123-4567',
        role: 'Admin'
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        address: '456 Oak St, Townsville',
        phone: '0917-234-5678',
        role: 'User'
      },
      {
        name: 'Mark Lee',
        email: 'mark.lee@example.com',
        address: '789 Pine Ave, Villageville',
        phone: '0917-345-6789',
        role: 'Manager'
      },
      {
        name: 'Alice Santos',
        email: 'alice.santos@example.com',
        address: '321 Palm Blvd, Suburbia',
        phone: '0917-456-7890',
        role: 'Tenant'
      },
      {
        name: 'Bob Reyes',
        email: 'bob.reyes@example.com',
        address: '654 Cedar St, Barangay Uno',
        phone: '0917-567-8901',
        role: 'Owner'
      }
    ],
    headers: [
      { text: 'Email', value: 'email' },
      { text: 'Name', value: 'name' },
      { text: 'Address', value: 'address' },
      { text: 'Phone', value: 'phone' },
      { text: 'Role', value: 'role' }
    ]
  })
}
</script>
