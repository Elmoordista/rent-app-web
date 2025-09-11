<template>
  <div>
    <v-card class="ma-5 pa-3">
      <div class="d-flex justify-space-around align-center">
        <v-card-title style="width: 100%;">Bookings</v-card-title>
        <div class="d-flex align-items-center" style="width: 500px; padding: 10px; gap:10px">
          <v-select
            :items="statuses_filter"
            v-model="status"
            outlined
            rounded
            hide-details
            dense
            placeholder="Filter by Status"
            @change="handleSearchRecord()"
            required
            style="text-transform: capitalize"
            label="Status"
          ></v-select>
        </div>
      </div>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="bookings.data"
          :items-per-page="10"
          :server-items-length="bookings.total"
          :page.sync="page"
          item-key="id"
        >

        <template v-slot:item.status="{ item }">
          <v-autocomplete
            :items="statuses"
            v-model="item.status"
            outlined
            rounded
            hide-details
            dense
            @change="handleChangeStatus(item)"
            required
            class="status-select"
            :style="{
              backgroundColor: getStatusColor(item.status),
              color: '#fff' // optional: make text readable
            }"
          />
        </template>

          <template v-slot:item.user="{ item }">
            <div>
              {{ item.user.full_name ? item.user.full_name : item.user.email }} <br/>
            </div>
          
          </template>

          <template v-slot:item.total_price="{ item }">
            <div>
              ₱ {{ handleChangeMoneyFormat(item.total_price) }} <br/>
            </div>
          
          </template>

          <template v-slot:item.payment_type="{ item }">
            <div  class="payment-mode" :class="item.payment_type === 'gcash' ? 'gcash' : 'cod'">
              {{ item.payment_type }}
            </div>
          </template>

          <template v-slot:item.item_total="{ item }">
            <div>
              <v-btn text small color="primary" @click="selectedOrder = item; showOrderDrawer = true">
                View
              </v-btn>
            </div>
          </template>

          <template v-slot:item.created_at="{ item }">
            <div>
              {{ handleChangeFormat(item.created_at)}}
            </div>
          </template>

           <template v-slot:item.payment_proof="{ item }">
            <v-img
              v-if="item.payments"
              :src="item.payments.proof_of_payment_url"
              @click="handleShowImages([item.payments.proof_of_payment_url])"
              max-width="70"
              max-height="70"
              contain
              style="cursor: pointer;"
            />
            <span v-if="!item.payments">
              ---
            </span>
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

      <!-- Drawer for Order Details -->
      <CategoryModal :show_modal="show_modal" @closeModal="handleCloModal" :item_selected="edit_item" @fetchRecords="handleGetCatoregories"/>
    </v-card>
    <template v-if="selectedOrder">
      <v-navigation-drawer
        v-model="showOrderDrawer"
        right
        absolute
        temporary
        width="500"
      >
        <v-card flat>
          <v-card-title>
            Order #{{ selectedOrder.id }}
            <v-spacer></v-spacer>
            <v-btn icon @click="showOrderDrawer = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>

          <!-- Tabs -->
          <v-tabs v-model="orderTab" dark>
            <v-tab>Order Details</v-tab>
            <v-tab>Items</v-tab>
          </v-tabs>

          <v-tabs-items v-model="orderTab">
            <!-- Items Tab -->
          

            <!-- Order Details Tab -->
          <v-tab-item>
              <v-card-text>
                <v-row dense>
                  <!-- Ordered By -->
                  <v-col cols="12">
                    <v-card outlined rounded="lg" class="pa-3 d-flex align-center">
                      <v-icon color="primary" class="mr-3">mdi-account</v-icon>
                      <div>
                        <div class="text-caption text-grey">Ordered By</div>
                        <div class="text-subtitle-1 font-weight-medium">
                          {{ selectedOrder.user.full_name ? selectedOrder.user.full_name : selectedOrder.user.email }}
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col cols="12">
                    <v-card outlined rounded="lg" class="pa-3 d-flex align-center">
                      <v-icon color="primary" class="mr-3">mdi-phone</v-icon>
                      <div>
                        <div class="text-caption text-grey">Phone Number</div>
                        <div class="text-subtitle-1 font-weight-medium">
                          {{ handleDecodeData(selectedOrder.delivery_info) ? handleDecodeData(selectedOrder.delivery_info).phone : 'N/A' }}
                        </div>
                      </div>
                    </v-card>
                  </v-col>

                  <!-- Address -->
                  <v-col cols="12">
                    <v-card outlined rounded="lg" class="pa-3 d-flex align-center">
                      <v-icon color="deep-orange" class="mr-3">mdi-map-marker</v-icon>
                      <div>
                        <div class="text-caption text-grey">Address</div>
                        <div class="text-subtitle-1 font-weight-medium">
                        {{ handleDecodeData(selectedOrder.delivery_info) ? handleDecodeData(selectedOrder.delivery_info).address : 'N/A' }}
                        </div>
                      </div>
                    </v-card>
                  </v-col>

                  <!-- Booking Date -->
                  <v-col cols="12">
                    <v-card outlined rounded="lg" class="pa-3 d-flex align-center">
                      <v-icon color="indigo" class="mr-3">mdi-calendar</v-icon>
                      <div>
                        <div class="text-caption text-grey">Booking Date</div>
                        <div class="font-weight-medium">
                          From : {{ handleChangeFormat(selectedOrder.start_date) }}
                        </div>
                        <div class="font-weight-medium">
                          To : {{ handleChangeFormat(selectedOrder.end_date) }}
                        </div>
                      </div>
                    </v-card>
                  </v-col>

                  <!-- Status -->
                  <v-col cols="12">
                    <v-card outlined rounded="lg" class="pa-3 d-flex align-center">
                      <v-icon color="green" class="mr-3">mdi-check-circle</v-icon>
                      <div>
                        <div class="text-caption text-grey">Status</div>
                        <v-chip
                          :color="getStatusColor(selectedOrder.status)"
                          dark
                          class="mt-1"
                          label
                        >
                          {{ selectedOrder.status }}
                        </v-chip>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-tab-item>

              <v-tab-item>
              <v-card-text>
                <div v-if="selectedOrder.booking_details.length">
                  <v-list two-line>
                    <v-list-item
                      v-for="(product, index) in selectedOrder.booking_details"
                      :key="index"
                    >
                      <v-img
                        :src="product.item.images[0].image_url"
                        max-width="80"
                        class="mr-3"
                      />
                      <v-list-item-content>
                        <v-list-item-title>{{ product.item.name }}</v-list-item-title>
                        <v-list-item-subtitle>
                          Qty: {{ product.quantity }} × ₱ {{ handleChangeMoneyFormat(product.item.price_per_day) }}
                        </v-list-item-subtitle>
                      </v-list-item-content>

                      <v-list-item-action>
                        <span class="font-weight-bold">
                          ₱ {{ handleChangeMoneyFormat(product.quantity * product.item.price_per_day) }}
                        </span>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>

                  <v-divider class="my-3"></v-divider>
                  <div class="d-flex justify-space-between">
                    <span>Total Days:</span>
                    <strong>{{ handleComputeTotalDays(selectedOrder.start_date, selectedOrder.end_date) }}</strong>
                  </div>
                  <div class="d-flex justify-space-between">
                    <span>Total:</span>
                    <strong>₱ {{ handleChangeMoneyFormat(selectedOrder.total_price) }}</strong>
                  </div>
                </div>
                <div v-else>
                  <em>No items found for this order.</em>
                </div>
              </v-card-text>
            </v-tab-item>

          </v-tabs-items>
        </v-card>
      </v-navigation-drawer>
    </template>
     <vue-easy-lightbox
      :visible="visible"
      :imgs="images"
      :index="currentIndex"
      @hide="visible = false"
    />
  </div>
</template>
<script>
import CategoryModal from '../components/modals/Category.vue'
import moment from 'moment';
import VueEasyLightbox from 'vue-easy-lightbox'
export default {
  components: {
    CategoryModal,
    VueEasyLightbox
  },
  data() {
    return {
      status_option: ['all','active', 'inactive'],
      statuses: ['pending', 'confirmed', 'cancelled', 'completed'],
      statuses_filter: ['all','pending', 'confirmed', 'cancelled', 'completed'],
      status: 'all',
      show_modal: false,
      page: 1,
      pageCount: 0,
      showOrderDrawer: false,
      selectedOrder: null,
      orderTab: null,
      bookings: [],
      images: [],
      currentIndex: 0,
      visible: false,
      edit_item:null,
      search:null,
      headers: [
        { text: 'Id', value: 'id' },
        { text: 'Book By', value: 'user' },
        { text: 'Booking Date', value: 'created_at'},
        { text: 'Payment Type', value: 'payment_type'},
        { text: 'Payment Proof', value: 'payment_proof'},
        { text: 'Order Details', value: 'item_total'},
        { text: 'Total Amount', value: 'total_price' },
        { text: 'Status', value: 'status', width: 200 },
        // { text: 'Action', value: 'action' },
      ]
    }
  },
  mounted(){
    this.handleGetBookings();
  },
  methods: {
      handleComputeTotalDays(startDate, endDate) {
        if (!startDate || !endDate) return 0;
        const start = moment(startDate);
        const end = moment(endDate);
        return end.diff(start, 'days'); // +1 to include the start day
      },
      handleDecodeData(data) {
        if (!data) return null;
        return JSON.parse(data);
      },
      getStatusColor(status) {
        switch (status) {
          case "pending":
            return "#f39c12"; // orange
          case "completed":
            return "#27ae60"; // green
          case "cancelled":
            return "#e74c3c"; // red
          case "confirmed":
            return "blue"; // blue
          default:
            return "#bdc3c7"; // default gray
        }
      },
      handleChangeStatus(item) {
         this.$notiflix.Confirm.show(
              'UPDATE STATUS',
              'Do you want to update the status of this item?',
              'Yes',
              'No',
              () => {
                  this.handleUpdateItem(item)
              },
              () => {
                this.handleGetBookings()
              },
          );
      },
      handleUpdateItem (item) {
        this.$notiflix.Loading.arrows();
        this.axios.put(`/booking/${item.id}`, {status: item.status}).then((res)=>{
            if(res.status){
              this.$awn.success(`Status Updated Successfully`);
              this.handleGetBookings();
            }
        }).catch((error)=>{
            console.log(error,'error')
        }).finally(()=>{
            this.submitLoading = false;
            this.$notiflix.Loading.remove();
        })
      },
      handleShowImages(images) {
        const imageList = images.map((item)=>{
          return item;
        });
        this.images = imageList
        this.currentIndex = 0
        this.visible = true
      },
    // put comma
      handleChangeMoneyFormat(amount) {
        if (amount === null || amount === undefined) {
          return "0"; // or return "" depending on what you want
        }
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      handleChangeFormat(date) {
        return moment(date).format('D MMM YYYY, h:mm A');
      },
      handleSearchRecord(){
        this.handleGetBookings()
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
      handleGetBookings () {
        this.$notiflix.Loading.arrows();
        this.submitLoading = true;
        this.axios.get(`/booking?page=${this.page}&search=${this.search ? this.search: ''}&status=${this.status}`).then((res)=>{
            if(res.status){
              console.log(res.data.data,'bookings')
              this.bookings = res.data;
            }
        }).catch((error)=>{
            console.log(error,'error')
        }).finally(()=>{
            this.submitLoading = false;
            this.$notiflix.Loading.remove();
        })
      }
  },
  watch: {
    page() {
      this.handleGetBookings()
    }
  },
}
</script>

<style>
.status-select  * {
  color: white !important;
  text-transform: capitalize;
}
.payment-mode{
  text-transform: capitalize; 
  border: 1px solid #eee; 
  padding: 5px; border-radius: 50px; 
  text-align: center; 
  width: 80px; 
  color: white;
}
.payment-mode.gcash{
  background-color: #6d76ec; 
}
.payment-mode.cod{
  background-color: #16cbf8; 
}
</style>
