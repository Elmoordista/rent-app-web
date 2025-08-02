<template>
  <div>
    <div class="d-flex align-center" style="gap: 10px; padding: 15px;">
      <v-card width="50%" style="height: 50vh;">
        <v-card-title>
          <v-icon class="mr-2">mdi-home</v-icon>
          Rent Statistics
        </v-card-title>
        <v-card-text>
         <div class="d-flex flex-wrap rent-statistics-wrapper">
           <v-card style="flex: 1; background-color: green;">
            <v-card-title>
             Done
            </v-card-title>
            <v-card-text>
              <div class="d-flex align-center" style="gap: 10px;">
                <v-icon>mdi-check</v-icon>
                <h2>15</h2>
              </div>
            </v-card-text>
          </v-card>
           <v-card style="flex: 1; background-color: blue;">
            <v-card-title>
             Processing
            </v-card-title>
            <v-card-text>
              <div class="d-flex align-center" style="gap: 10px;">
                <v-icon>mdi-cog-sync</v-icon>
                <h2>5</h2>
              </div>
            </v-card-text>
          </v-card>
           <v-card style="flex: 1; background-color: orange;">
            <v-card-title>
             Pending
            </v-card-title>
            <v-card-text>
              <div class="d-flex align-center" style="gap: 10px;">
                <v-icon>mdi-progress-clock</v-icon>
                <h2>10</h2>
              </div>
            </v-card-text>
          </v-card>
         </div>
        </v-card-text>
      </v-card>
      <v-card width="50%" style="height: 50vh;">
        <v-card-title>
          <v-icon class="mr-2">mdi-chart-line</v-icon>
          Site Statistics
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
                <h2>30</h2>
              </div>
            </v-card-text>
          </v-card>
           <v-card style="width: 40%; background-color: gray;">
            <v-card-title>
             Processing
            </v-card-title>
            <v-card-text>
              <div class="d-flex align-center" style="gap: 10px;">
                <v-icon>mdi-key</v-icon>
                <h2>12</h2>
              </div>
            </v-card-text>
          </v-card>
           <v-card style="width: 40%; background-color: gray;">
            <v-card-title>
             Total Earnings
            </v-card-title>
            <v-card-text>
              <div class="d-flex align-center" style="gap: 10px;">
                <h2>₱ 15000</h2>
              </div>
            </v-card-text>
          </v-card>
         </div>
        </v-card-text>
      </v-card>
    </div>
    <div class="mb-4 mx-4">
      <v-card >
        <v-card-title class="d-flex align-center justify-space-between">
          <div style="flex: 1;">
            <v-icon class="mr-2">mdi-chart-bar</v-icon>
            Rent Statistics
          </div>
          <div class="d-flex align-center" style="gap: 10px;">
              <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
                
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateFormatted"
                    label="Date From"
                    persistent-hint
                    style="width: 290px;"
                    prepend-icon="mdi-calendar"
                    v-bind="attrs"
                    @blur="date = parseDate(dateFormatted)"
                    v-on="on"
                    dense
                    hide-details
                    outlined
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  no-title
                  @input="menu1 = false"
                ></v-date-picker>
              </v-menu>
              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateFormatted"
                    label="Date To"
                    persistent-hint
                    style="width: 290px;"
                    prepend-icon="mdi-calendar"
                    readonly
                    hide-details
                    v-bind="attrs"
                    v-on="on"
                    dense
                    outlined
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  no-title
                  @input="menu2 = false"
                ></v-date-picker>
              </v-menu>
          </div>
        </v-card-title>
        <v-card-text>
          <Bar/>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
  import Bar from '../components/graphs/Bar.vue'
  export default {
    components: {
      Bar,
    },
    data: () => vm =>({
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dateFormatted: vm.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),
      menu1: false,
      menu2: false,
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: 1,
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: 1,
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: 7,
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: 8,
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: 16,
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: 0,
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: 2,
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: 45,
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: 22,
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: 6,
        },
      ],
      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' },
      ],
    }),
  computed: {
    computedDateFormatted () {
      return this.formatDate(this.date)
    },
  },
  mounted() {
      // this.$awn.success('Notification is working!')
  },
  methods: {
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
</style>