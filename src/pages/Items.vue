<template>
  <v-card class="ma-5 pa-3">
    <div class="d-flex justify-space-around align-center">
      <v-card-title style="width: 100%;">Items</v-card-title>
      <div class="d-flex align-items-center" style="padding: 10px; gap:10px">
         <v-select
          :items="categories"
          v-model="query.category"
          outlined
          rounded
          hide-details
          dense
          clearable
          @change="handleSearchRecord()"
          required
          style="text-transform: capitalize; width: 230px;"
          label="Category"
        ></v-select>
        <v-select
          :items="status_option"
          v-model="query.status"
          outlined
          rounded
          hide-details
          dense
          @change="handleSearchRecord()"
          required
          style="text-transform: capitalize; width: 230px;"
          label="Status"
        ></v-select>
        <v-text-field
            name="Item Nam"
            label="Item Name"
            rounded
            v-model="query.search"
            @change="handleSearchRecord()"
            background-color=""
            outlined
            style="width: 230px;"
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
        :items="items.data"
        :server-items-length="items.total"
        :page="items.current_page"
        :loading="tableLoading"
        :items-per-page="items.per_page"
        item-key="id"
      >

        <template v-slot:item.image="{ item }">
          <v-img 
            style="cursor: pointer;"
            type="rounded"
            max-width="50"
            :src="!item.has_sizes_color_options && item.images.length > 0 ? item.images[0].image_url : item.variations.length > 0 ? item.variations[0].image_url : ''" 
            @click="handleShowImages(item)" 
          />
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip :color="item.status === 'active' ? 'green' : 'red'" dark style="text-transform: capitalize;">
            {{ item.status }}
          </v-chip>
        </template> 
        <template v-slot:item.price_per_day="{ item }">
            ₱ {{ item.price_per_day }}
        </template>

         <template v-slot:item.total_reviews="{ item }">
          <div class="d-flex">
            <v-chip color="blue" dark @click="handleShowReviews(item)">
              {{ item.reviews_count }}
            </v-chip>
          </div>
        </template>

        <template v-slot:item.on_rent_qty="{ item }">
           {{ item.available >  item.available_quantity ? item.available - item.available_quantity  : 'N/A' }}
        </template>


         <template v-slot:item.category="{ item }">
           {{ item.category ? item.category.name : 'N/A' }}
        </template>

         <template v-slot:item.owner="{ item }">
           {{ item.owner ? item.owner.full_name : 'N/A' }}
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

    <Items :show_modal="show_modal" @closeModal="handleCloModal" :categories="categories" :item_selected="edit_item" @fetchRecords="handleGetItems"/>
    <vue-easy-lightbox
      :visible="visible"
      :imgs="images"
      :index="currentIndex"
      @hide="visible = false"
    />
    <v-dialog
      v-model="show_reviews"
      max-width="600"
      persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>
            Reviews ({{ item_selected && item_selected.reviews_count ? item_selected.reviews_count : 0 }})
          </span>
          <v-rating :value="item_selected && item_selected.reviews_avg_rating ? item_selected.reviews_avg_rating : 0" color="yellow darken-3" dense readonly></v-rating>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div  class="mb-3" v-for="(review, index) in reviews" :key="index">
            <v-list-item @click="fullReview = review; showFullReview = true" style="cursor: pointer;">
              <v-list-item-avatar>
                <v-icon size="40">mdi-account-circle</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ review.user.full_name }}</v-list-item-title>
                <v-list-item-subtitle>{{ review.comment }} </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-rating :value="review.rating" color="yellow darken-3" dense readonly></v-rating>
              </v-list-item-action>
            </v-list-item>
            <v-divider></v-divider>
          </div>
          <div v-if="reviews.length == 0" class="text-center no-reviews mt-4">
            No Reviews Yet.
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="show_reviews = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showFullReview" max-width="600">
        <v-card>
          <v-card-title>
            <v-icon left color="primary">mdi-account-circle</v-icon>
            <span class="text-h6">{{ fullReview && fullReview.user.full_name }}</span>
            <v-spacer></v-spacer>
            <v-rating :value="fullReview && fullReview.rating" color="yellow darken-3" dense readonly />
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <p class="text-body-1 mt-4">{{ fullReview && fullReview.comment }} </p>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="showFullReview = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-card>
</template>

<script>
import Items from '../components/modals/Items.vue'
import VueEasyLightbox from 'vue-easy-lightbox'
export default {
  components: {
    Items,
    VueEasyLightbox
  },
  data() {
    return {
      status_option: ['all','active', 'inactive'],
      status: 'all',
      show_modal: false,
      visible: false,
      tableLoading : false,
      showFullReview: false,
      fullReview: null,
      images: [],
      currentIndex: 0,
      categories: [],
      items: [],
      current_page: 1,
      edit_item:null,
      show_reviews:null,
      search:null,
      query:{
        search:'',
        status:'all',
        category:'',
      },
      headers: [
        { text: 'Image', value: 'image' },
        { text: 'Name', value: 'name' },
        { text: 'Category', value: 'category' },
        { text: 'Owner', value: 'owner' },
        { text: 'Available', value: 'available' },
        { text: 'On Rent Qty', value: 'on_rent_qty' },
        { text: 'Rent Per Day', value: 'price_per_day' },
        { text: 'Status', value: 'status' },
        { text: 'Total Reviews', value: 'total_reviews' },
        { text: 'Action', value: 'action' },
      ],
      reviews : [],
      item_selected : null,
    }
  },
  mounted(){
    this.handleGetCatoregories();
    this.handleGetItems();
  },
  methods: {
      handleShowReviews(item){
        this.$notiflix.Loading.arrows();
        this.axios.get(`/items/get-reviews/${item.id}`).then((res)=>{
          this.reviews = res.data.data;
          this.item_selected = res.data.item;
          this.show_reviews = true;

        }).catch((error)=>{
            console.log(error,'error')
        }).finally(()=>{
            this.$notiflix.Loading.remove();
        })
      },
      handleShowImages(item) {
       var imageList = [];
       if(item.has_sizes_color_options){
          imageList = item.variations.map((itemx)=>{
            return itemx.image_url;
          });
          this.images = imageList
          this.currentIndex = 0
          this.visible = true
          return;
       }
       else{
         imageList = item.images.map((itemx)=>{
           return itemx.image_url;
         });
       }
        this.images = imageList
        this.currentIndex = 0
        this.visible = true
      },
      handleSearchRecord(){
        this.handleGetItems()
      },  
      handleCloModal(){
        this.show_modal = false;
        this.edit_item = null;
      },  
      handleEdit(item){
        const edit_item = {...item};
        this.edit_item = edit_item;
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
        this.axios.delete(`/items/${item.id}`).then((res)=>{
            if(res.status){
              this.$awn.success(`Items Deleted Successfully`);
              this.handleGetItems();
            }
        }).catch((error)=>{
            console.log(error,'error')
        }).finally(()=>{
            this.submitLoading = false;
            this.$notiflix.Loading.remove();
        })
      },
      handleGetItems () {
        this.tableLoading = true;
        this.axios.get('/items', {
          params: {
            page: this.current_page,
            search: this.query.search || '',
            status: this.query.status || '',
            category: this.query.category || ''
          }
        })
        .then((res)=>{
            if(res.status){
             this.items = res.data.data;
            }
        }).catch((error)=>{
            console.log(error,'error')
        }).finally(()=>{
            this.tableLoading = false;
            this.$notiflix.Loading.remove();
        })
      },
      handleGetCatoregories () {
        this.$notiflix.Loading.arrows();
        this.submitLoading = true;
        this.axios.get(`/category?all=true`).then((res)=>{
            if(res.status){
              this.categories = res.data.data.map((item)=>{
                return {
                  value:item.id,
                  text:item.name
                }
              });
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
