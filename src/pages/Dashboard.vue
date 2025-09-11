<template>
  <div>
    <div class="d-flex align-center" style="gap: 10px; padding: 15px;">
      <v-card width="50%" style="height: 50vh;">
        <v-card-title class="card-title">
            <div>
              <v-icon class="mr-2">mdi-home</v-icon>
              Rent Statistics
            </div>
        </v-card-title>
        <v-card-text>
         <div class="d-flex flex-wrap rent-statistics-wrapper" style="flex: wrap;">
           <v-card style=" width: 30%;background-color: green;">
            <v-card-title>
             Completed
            </v-card-title>
            <v-card-text>
              <div class="d-flex align-center" style="gap: 10px;">
                <v-icon>mdi-flag-checkered</v-icon>
                <h2>{{ status_booking.completed }}</h2>
              </div>
            </v-card-text>
          </v-card>
           <v-card style=" width: 30%;background-color: blue;">
            <v-card-title>
             Confirmed
            </v-card-title>
            <v-card-text>
              <div class="d-flex align-center" style="gap: 10px;">
                <v-icon>mdi-check-circle-outline</v-icon>
                <h2>{{ status_booking.confirmed }}</h2>
              </div>
            </v-card-text>
          </v-card>
           <v-card style=" width: 30%;background-color: red;">
            <v-card-title >
             Cancelled
            </v-card-title>
            <v-card-text>
              <div class="d-flex align-center" style="gap: 10px;">
                <v-icon>mdi-close-circle-outline</v-icon>
                <h2>{{ status_booking.cancelled }}</h2>
              </div>
            </v-card-text>
          </v-card>
           <v-card style=" width: 30%;background-color: orange;">
            <v-card-title>
             Pending
            </v-card-title>
            <v-card-text>
              <div class="d-flex align-center" style="gap: 10px;">
                <v-icon>mdi-clock-outline</v-icon>
                <h2>{{ status_booking.pending }}</h2>
              </div>
            </v-card-text>
          </v-card>
         </div>
        </v-card-text>
      </v-card>
      <v-card width="50%" style="height: 50vh;">
        <v-card-title class="card-title">
          <div>
              <v-icon class="mr-2">mdi-chart-line</v-icon>
              Site Statistics
          </div>
        </v-card-title>
        <v-card-text>
         <div class="d-flex flex-wrap rent-statistics-wrapper">
           <v-card style="width: 40%; background-color: gray;">
            <v-card-title>
             Total Users
            </v-card-title>
            <v-card-text>
              <div class="d-flex align-center" style="gap: 10px;">
                <v-icon>mdi-account-multiple</v-icon>
                <h2>{{ total_users }}</h2>
              </div>
            </v-card-text>
          </v-card>
           <v-card style="width: 40%; background-color: gray;">
            <v-card-title>
              Total Items
            </v-card-title>
            <v-card-text>
              <div class="d-flex align-center" style="gap: 10px;">
                <v-icon>mdi-cube-outline</v-icon>
                <h2>{{ total_items }}</h2>
              </div>
            </v-card-text>
          </v-card>
           <v-card style="width: 40%; background-color: gray;">
            <v-card-title>
             Total Earnings
            </v-card-title>
            <v-card-text>
              <div class="d-flex align-center" style="gap: 10px;">
                <h2>₱ {{ handleAddCommas(total_earnings) }}</h2>
              </div>
            </v-card-text>
          </v-card>
         </div>
        </v-card-text>
      </v-card>
    </div>
    <div class="mb-4 mx-4">
        <template>
          <v-card>
            <v-card-title class="d-flex justify-space-between align-center card-title">
              <div>
                <v-icon class="mr-2">mdi-chart-bar</v-icon>
                Rent Statistics
              </div>
            </v-card-title>

            <v-card-text class="d-flex flex-row flex-wrap justify-space-between align-center" style="gap: 20px;">
              <!-- Filter Controls -->
                <!-- Filter Type -->
               <h2 style="color: black;">Total : {{ total }}</h2>
               <div class="d-flex flex-wrap" style="gap: 20px;">
                <div class="d-flex align-center mb-4" style="gap: 10px; min-width: 200px;">
                  <label >Filter by:</label>
                  <v-select
                    v-model="filterType"
                    :items="['Day', 'Date Range', 'Monthly', 'Yearly']"
                    dense
                    outlined
                    hide-details
                    style="max-width: 150px;"
                  />
                </div>
                <div class="d-flex flex-wrap align-center mb-4" style="gap: 15px;">
                  
                  <!-- Day -->
                  <v-menu
                    v-if="filterType === 'Day'"
                    v-model="menuDay"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="day"
                        label="Select Day"
                        prepend-icon="mdi-calendar"
                        readonly
                        dense
                        outlined
                        v-bind="attrs"
                        v-on="on"
                        hide-details
                        style="max-width: 300px;"
                      />
                    </template>
                    <v-date-picker
                      v-model="day"
                      @input="menuDay = false; applyFilter()"
                    />
                  </v-menu>

                  <!-- Date Range -->
                 
                  <v-menu
                    v-if="filterType === 'Date Range'"
                    v-model="menuFrom"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateFrom"
                        label="From"
                        prepend-icon="mdi-calendar"
                        readonly
                        dense
                        outlined
                        v-bind="attrs"
                        v-on="on"
                        hide-details
                        style="max-width: 300px;"
                      />
                    </template>
                    <v-date-picker
                      v-model="dateFrom"
                      @input="menuFrom = false; applyFilter()"
                    />
                  </v-menu>
                   <v-menu
                    v-if="filterType === 'Date Range'"
                    v-model="menuTo"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateTo"
                        label="To"
                        prepend-icon="mdi-calendar"
                        readonly
                        dense
                        outlined
                        v-bind="attrs"
                        v-on="on"
                        hide-details
                        style="max-width: 200px;"
                      />
                    </template>
                    <v-date-picker
                      v-model="dateTo"
                      @input="menuTo = false; applyFilter()"
                    />
                  </v-menu>

                  <!-- Monthly -->
                  <v-menu
                    v-if="filterType === 'Monthly'"
                    v-model="menuMonth"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="month"
                        label="Select Month"
                        prepend-icon="mdi-calendar-month"
                        readonly
                        dense
                        outlined
                        v-bind="attrs"
                        v-on="on"
                        hide-details
                        style="max-width: 200px;"
                      />
                    </template>
                    <v-date-picker
                      v-model="month"
                      type="month"
                      @input="menuMonth = false; applyFilter()"
                    />
                  </v-menu>

                  <!-- Yearly -->
                  <v-select
                    v-if="filterType === 'Yearly'"
                    v-model="year"
                    :items="years"
                    label="Select Year"
                    dense
                    outlined
                    hide-details
                    style="max-width: 200px;"
                    @change="applyFilter"
                  />
                </div>
                <div>
                  <v-btn color="primary" @click="handleSearch">Search</v-btn>
                </div>
              </div>
              <!-- Chart -->
              <Bar :data="data" :categories="categories" />
            </v-card-text>
          </v-card>
        </template>
    </div>
  </div>
</template>

<script>
  import Bar from '../components/graphs/Bar.vue'
  export default {
    components: {
      Bar,
    },
    data: () => ({
      filterType: "Date Range", // default
      menuDay: false,
      menuFrom: false,
      menuTo: false,
      menuMonth: false,
      total: 0,
      // Day
      day: new Date().toISOString().substr(0, 10),
      // Date Range
      dateFrom: new Date().toISOString().substr(0, 10),
      dateTo: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
      // Month
      month: new Date().toISOString().substr(0, 7),
      // Year
      year: new Date().getFullYear(),
      years: Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i),

      categories: [], 
      data: [],

      total_items: 0,
      total_users: 0,
      total_earnings: 0,
      status_booking: {
        completed: 0,
        confirmed: 0,
        cancelled: 0,
        pending: 0
      },
    }),
  computed: {
    computedDateFormatted () {
      return this.formatDate(this.date)
    },
  },
  mounted() {
      this.handleSearch()
  },
  methods: {
    handleAddCommas(number) {
      if (!number && number !== 0) return 0;
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    handleSearch () {
        this.$notiflix.Loading.arrows();
        this.submitLoading = true;
        this.axios.post(`/booking/get-filtered-bookings`, {
            filterType: this.filterType,
            day: this.day,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
            month: this.month,
            year: this.year
        }).then((res)=>{
            if(res.data.success){
                this.categories = res.data.categories;
                this.total = res.data.total;
                this.data = res.data.data;
                this.total_items = res.data.items;
                this.total_users = res.data.users;
                this.total_earnings = res.data.total_earnings;
                this.status_booking = res.data.status_bookings;
            }
        }).catch((error)=>{
            console.log(error,'error')
        }).finally(()=>{
            this.submitLoading = false;
            this.$notiflix.Loading.remove();
        })
    },
    trys(e){
      this.$awn.info('This is an info message!')
      console.log(e)
    },
  },
  }
</script>

<style>
  .rent-statistics-wrapper {
    gap: 20px;
  }
  .rent-statistics-wrapper * {
    color: #fff !important;
  }
  .card-title  {
    background: #212121;
    margin-bottom: 15px;
  }
  .card-title  *{
    color: #fff !important;
  }
</style>