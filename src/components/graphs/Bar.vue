<template>
  <apexchart
    :type="chartType"
    height="350"
    :options="chartOptions"
    :series="series"
  />
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
        data: [30, 40, 35, 50, 49, 60, 70, 91]
      }],
      chartOptions: {
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
        }
      }
    }
  }
}
</script>
