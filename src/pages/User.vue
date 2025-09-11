<template>
  <v-card class="ma-4 pa-4">
    <div class="d-flex justify-space-around align-center">
      <v-card-title style="width: 100%;">User Information</v-card-title>
      <div style="width: 500px; padding: 10px;">
          <v-text-field
              label="Search"
              rounded
              background-color=""
              outlined
              dense
              v-model="search"
              @keyup.enter="handleSearchRecord"
              @click:clear="handleSearchRecord"
              clearable
              hide-details=""
          ></v-text-field>
      </div>
       <v-btn
            class="mx-2"
            fab
            dark
            @click="show_modal = true"
            small
            color="primary"
          >
            <v-icon dark>
              mdi-plus
          </v-icon>
        </v-btn>
    </div>

    <v-card-text class="pt-3">
      <v-data-table
        :headers="headers"
        :items="users"
        item-key="email"
        cicl
      >

       <template v-slot:item.role="{ item }">
          <span style="text-transform: capitalize;">{{ item.role }}</span>
      </template>
    
      <template v-slot:item.action="{ item }">
          <div class="d-flex">
            <v-btn color="primary" icon small @click="handleEdit(item)">
              <v-icon size="18">mdi-pencil</v-icon>
            </v-btn>
            |
            <template>
              <v-btn color="primary" icon small @click="handleDelete(item)">
                <v-icon size="18" color="red">mdi-delete</v-icon>
              </v-btn> 
            </template>
          </div>
      </template>
    
    
    </v-data-table>
    </v-card-text>
    <UserModal :show_modal="show_modal" @closeModal="show_modal=false" :user_data="edit_user" @handleGetUsers="handleGetUsers"/>
  </v-card>
</template>

<script>
import UserModal from '../components/modals/User.vue'
export default {
  components: {
    UserModal
  },
  data: () => ({
    show_modal: false,
    edit_user:null,
    search:null,
    users: [],
    headers: [
      { text: 'Email', value: 'email' },
      { text: 'Name', value: 'full_name' },
      { text: 'Address', value: 'address' },
      { text: 'Phone', value: 'phone' },
      { text: 'Role', value: 'role' },
      { text: 'Action', value: 'action' }
    ]
  }),
  mounted(){
    this.handleGetUsers();
  },
  methods: {
      handleSearchRecord(){
        this.handleGetUsers()
      },  
      handleCloModal(){
        this.show_modal = false;
        this.edit_user = null;
      },  
      handleEdit(item){
        var editItem = item;
        this.edit_user = editItem;
        this.show_modal = true
      },
      handleDelete(item) {
          this.$notiflix.Confirm.show(
              'DELETE',
              'Do you want to delete this item?',
              'Yes',
              'No',
              () => {
                  this.handleDeleteItem(item)
              },
          );
      },
      handleDeleteItem (item) {
        this.$notiflix.Loading.arrows();
        this.axios.delete(`/user/${item.id}`).then((res)=>{
            if(res.status){
              this.$awn.success(`User Deleted Successfully`);
              this.handleGetUsers();
            }
        }).catch((error)=>{
            console.log(error,'error')
        }).finally(()=>{
            this.submitLoading = false;
            this.$notiflix.Loading.remove();
        })
      },
      handleGetUsers () {
        this.$notiflix.Loading.arrows();
        this.submitLoading = true;
        this.axios.get(`/user?search=${this.search ? this.search: ''}`).then((res)=>{
            if(res.status){
              this.users = res.data.data.data;
            }
        }).catch((error)=>{
            console.log(error,'error')
        }).finally(()=>{
            this.submitLoading = false;
            this.$notiflix.Loading.remove();
        })
      }
  },
}
</script>
