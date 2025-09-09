<template>
  <v-card class="ma-5 pa-3">
    <div class="d-flex justify-space-around align-center">
      <v-card-title style="width: 100%;">Categories</v-card-title>
      <div class="d-flex align-items-center" style="width: 1000px; padding: 10px; gap:10px">
         <v-select
          :items="status_option"
          v-model="status"
          outlined
          rounded
          hide-details
          dense
          @change="handleSearchRecord()"
          required
          style="text-transform: capitalize;"
          label="Status"
        ></v-select>
        <v-text-field
            name="Catagory Nam"
            label="Catagory Name"
            rounded
            v-model="search"
            @change="handleSearchRecord()"
            background-color=""
            outlined
            dense
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
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="categories"
        item-key="id"
      >

        <template v-slot:item.status="{ item }">
          <v-chip :color="item.status === 'active' ? 'green' : 'red'" dark style="text-transform: capitalize;">
            {{ item.status }}
          </v-chip>
        </template>

       
        <template v-slot:item.total_items="{ item }">
          <div class="d-flex">
            <v-chip color="blue" dark>
              {{ item.items_count }}
            </v-chip>
          </div>
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

    <CategoryModal :show_modal="show_modal" @closeModal="handleCloModal" :item_selected="edit_item" @fetchRecords="handleGetCatoregories"/>
  </v-card>
</template>

<script>
import CategoryModal from '../components/modals/Category.vue'
export default {
  components: {
    CategoryModal,
  },
  data() {
    return {
      status_option: ['all','active', 'inactive'],
      status: 'all',
      show_modal: false,
      categories: [],
      edit_item:null,
      search:null,
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Total Items', value: 'total_items' },
        { text: 'Status', value: 'status' },
        { text: 'Action', value: 'action' },
      ]
    }
  },
  mounted(){
    this.handleGetCatoregories();
  },
  methods: {
      handleSearchRecord(){
        this.handleGetCatoregories()
      },  
      handleCloModal(){
        this.show_modal = false;
        this.edit_item = null;
      },  
      handleEdit(item){
        var editItem = item;
        this.edit_item = editItem;
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
        this.axios.delete(`/category/${item.id}`).then((res)=>{
            if(res.status){
              this.$awn.success(`Category Deleted Successfully`);
              this.handleGetCatoregories();
            }
        }).catch((error)=>{
            console.log(error,'error')
        }).finally(()=>{
            this.submitLoading = false;
            this.$notiflix.Loading.remove();
        })
      },
      handleGetCatoregories () {
        this.$notiflix.Loading.arrows();
        this.submitLoading = true;
        this.axios.get(`/category?search=${this.search ? this.search: ''}&status=${this.status}`).then((res)=>{
            if(res.status){
              this.categories = res.data.data.data;
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
