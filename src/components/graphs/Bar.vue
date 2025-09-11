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
  props: {
    data: {
      type: Array,
      default: () => []
    },
    categories: {
      type: Array,
      default: () => []
    }
  },
  components: { apexchart: VueApexCharts },
  data() {
    return {
      chartType: 'bar',
      series: [
        {
          name: 'Sales',
          data: []
        }
      ],
      chartOptions: {
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          categories: [],
          labels: {
            rotate: -45,
            style: {
              fontSize: '12px'
            }
          }
        }
      }
    }
  },
  watch: {
    data(newData) {
      this.series = [
        {
          name: 'Sales',
          data: newData
        }
      ]
    },
    categories(newCategories) {
      // ✅ replace whole object reference so Vue detects change
      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          ...this.chartOptions.xaxis,
          categories: newCategories
        }
      }
    }
  }
}
</script>
