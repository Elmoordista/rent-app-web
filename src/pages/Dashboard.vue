<template>
  <div>
    <div class="mb-4 mx-4 mt-4">
        <Reports 
          :total_earnings="total_earnings" 
          :active_renters="total_users" 
          :available_items="available_items" 
          :total_rentals="total_rentals" 
        />
    </div>  
    <div class="mb-4 mx-4 rental-dashboard pa-6" style="background: #f5f6f8;">
        <template>
              <div class="mb-4">
                  <v-row>
                    <v-col cols="12">
                      <h2 class="font-weight-bold mb-1">Timeframe Overview</h2>
                      <p class="subtitle-1 grey--text">
                        Summarizes income and rental activity within the selected date range.
                      </p>
                    </v-col>
                  </v-row>
              </div>
              <div class="chart-container">
                <div class="d-flex justify-md-space-between align-items-center">
                  <h3 class="ma-0" style="color: black;">Total : {{ total }}</h3>
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
                </div>
              <!-- Chart -->
                <Bar :data="data" :categories="categories" />
              </div>
        </template>
    </div>
  </div>
</template>

<script>
  import Bar from '../components/graphs/Bar.vue'
  import Reports from '../components/report/index.vue'
  export default {
    components: {
      Bar,
      Reports,
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
      available_items: 0,
      total_rentals: 0,
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
                this.available_items = res.data.available_items;
                this.total_rentals = res.data.total_rentals;
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
  .chart-container{
    max-width: 100%;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
  }
</style>