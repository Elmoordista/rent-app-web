<template>
  <v-container fluid class="pa-6 rental-dashboard">
    <!-- Title -->
    <v-row>
      <v-col cols="12">
        <h2 class="font-weight-bold mb-1">Rental Dashboard</h2>
        <p class="subtitle-1 grey--text">
          Overview of rental categories, income, and performance summary
        </p>
      </v-col>
      <v-col cols="12" style="text-align: end;">
        <v-btn color="primary" small @click="downloadAsImage" elevation="2">
          <v-icon left>mdi-download</v-icon> Print
        </v-btn>
      </v-col>
    </v-row>

    <div  ref="dashboardContent" class="mt-2">
      <!-- KPI Cards -->
      <v-row dense class="mb-6">
        <v-col cols="12" sm="6" md="3" v-for="kpi in kpis" :key="kpi.label">
          <v-card class="pa-4 text-center" outlined>
            <v-icon large class="mb-2" color="primary">{{ kpi.icon }}</v-icon>
            <div class="caption grey--text">{{ kpi.label }}</div>
            <div class="headline font-weight-bold mt-1">
              {{ kpi.value }}
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts + Table -->
      <v-row dense>
        <!-- Income Chart -->
        <v-col cols="12" md="6">
          <v-card class="pa-4" outlined>
            <h3 class="subtitle-1 font-weight-bold mb-3">Income by Category</h3>
            <canvas id="incomeChart" height="180"></canvas>
          </v-card>
        </v-col>

        <!-- Category Pie Chart -->
        <v-col cols="12" md="6">
          <v-card class="pa-4" outlined>
            <h3 class="subtitle-1 font-weight-bold mb-3">Category Distribution</h3>
            <canvas id="categoryChart" height="180"></canvas>
          </v-card>
        </v-col>

        <!-- Recent Rentals Table -->
        <v-col cols="12" class="mt-6">
          <v-card class="pa-4" outlined>
            <h3 class="subtitle-1 font-weight-bold mb-3">Recent Rentals</h3>
            <v-data-table
              :headers="headers"
              :items="recentRentals"
              hide-default-footer
              class="elevation-1"
            >
              <template v-slot:item.income="{ item }">
                ₱ {{ handleAddCommas(item.income) }}
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import Chart from "chart.js";
import html2canvas from "html2canvas";

export default {
  name: "RentalDashboard",
  props: {
    available_items: {
      type: Number,
      default: 0,
    },
    total_rentals: {
      type: Number,
      default: 0,
    },
    total_earnings: {
      type: Number,
      default: 0,
    },
    active_renters: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      kpis: [
        { label: "Total Rentals", value: 0, icon: "mdi-calendar" },
        { label: "Total Income", value: 0, icon: "mdi-cash" },
        { label: "Active Renters", value: 0, icon: "mdi-account-group" },
        { label: "Available Units", value: 0, icon: "mdi-check-circle" },
      ],
      headers: [
        { text: "Category", value: "category" },
        { text: "Renter", value: "renter" },
        { text: "Item", value: "item_name" },
        { text: "Date", value: "date" },
        { text: "Income", value: "income" },
      ],
      // recentRentals: [
      //   { category: "Vehicle", renter: "XYZ Transport", date: "2025-10-20", income: 8500 },
      //   { category: "Appliances", renter: "Ace Appliances", date: "2025-10-18", income: 5400 },
      //   { category: "Furniture", renter: "Home Comfort", date: "2025-10-15", income: 2900 },
      // ],
      incomeChart: null,
      categoryChart: null,
      recentRentals: []
    };
  },
  methods: {
    formatCurrency(val) {
      return "$" + val.toLocaleString();
    },
    async downloadAsImage() {
      const element = this.$refs.dashboardContent;

      this.$nextTick(async () => {
        const originalCanvas = await html2canvas(element, {
          scale: 2, // higher quality
          useCORS: true,
          backgroundColor: '#ffffff', // white background
        });

        const padding = 40; // pixels of padding
        const paddedCanvas = document.createElement('canvas');
        const ctx = paddedCanvas.getContext('2d');

        // Set new canvas size with padding
        paddedCanvas.width = originalCanvas.width + padding * 2;
        paddedCanvas.height = originalCanvas.height + padding * 2;

        // Fill background white
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);

        // Draw the original canvas with padding offset
        ctx.drawImage(originalCanvas, padding, padding);

        // Convert to image and download
        const link = document.createElement('a');
        link.download = `rental_dashboard_${new Date()
          .toISOString()
          .slice(0, 10)}.png`;
        link.href = paddedCanvas.toDataURL('image/png');
        link.click();
      });
    },
    renderIncomeChart($categories, $incomes, $colors) {
      const ctx = document.getElementById("incomeChart");
      if (this.incomeChart) this.incomeChart.destroy();
      this.incomeChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: $categories || [],
          datasets: [
            {
              label: "Income",
              data: $incomes || [],
              backgroundColor: $colors || []
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            yAxes: [{ ticks: { beginAtZero: true } }],
          },
          legend: { display: false },
        },
      });
    },
    renderCategoryChart($categories, $incomes, $colors) {
      const ctx = document.getElementById("categoryChart");
      if (this.categoryChart) this.categoryChart.destroy();
      this.categoryChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: $categories || [],
          datasets: [
            {
              data: $incomes || [],
              backgroundColor: $colors || [],
            },
          ],
        },
        options: {
          responsive: true,
          legend: { position: "bottom" },
        },
      });
    },
    handleAddCommas(number) {
      if (!number && number !== 0) return 0;
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    handleGetCategoriesReport () {
        this.axios.get(`/booking/get-categories-reports`).then((res)=>{
            if(res.data.success){
                const categories = res.data.categories || [];
                const incomes = res.data.sales || [];
                const colors = res.data.colors || [];
                this.renderIncomeChart(categories, incomes, colors);
                this.renderCategoryChart(categories, incomes, colors);
                this.recentRentals = res.data.recent_bookings.map(booking => ({
                  category: booking.category,
                  renter: booking.rented_by,
                  item_name: booking.item_name,
                  date: booking.created_at,
                  income: booking.total_price
                })) || [];
            }
        }).catch((error)=>{
            console.log(error,'error')
        }).finally(()=>{
        })
    },
  },
  mounted() {
    this.handleGetCategoriesReport();
  },
  watch: {
    available_items() {
      this.kpis[3].value = this.available_items;
    },
    total_rentals() {
      this.kpis[0].value = this.total_rentals;
    },
    total_earnings() {
      this.kpis[1].value = `₱ ${this.handleAddCommas(this.total_earnings)}`;
    },
    active_renters() {
      this.kpis[2].value = this.active_renters;
    },
  },
};
</script>

<style scoped>
.rental-dashboard {
  background: #f5f6f8;
  min-height: 100vh;
}
</style>
