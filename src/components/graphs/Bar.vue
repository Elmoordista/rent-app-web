<template>
  <div style="width: 100%;">
    <apexchart
      :type="chartType"
      height="400"
      :width="'100%'"
      :options="chartOptions"
      :series="series"
    />
  </div>

</template>

<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  components: { apexchart: VueApexCharts },
  data() {
    return {
      chartType: 'bar',  // changed from 'bar' to 'line'
      series: [{
        name: 'Sales',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 80, 90, 100]
      }],
      chartOptions: {
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          categories: ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12'],
          labels: {
            rotate: -45,         // 👈 rotate labels diagonally (negative is upward)
            style: {
              fontSize: '12px'
            }
          }
        }
      }
    }
  }
}
</script>
