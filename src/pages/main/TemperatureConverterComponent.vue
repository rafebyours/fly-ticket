<template>
  <div class="bg-white h-full flex flex-col items-center p-4">
    <div class="text-center mb-6">
      <h2 class="text-lg font-bold text-center">Temperature Converter</h2>
    </div>

    <!-- Temperature Input Sections with Text Boxes -->
    <div
      class="bg-white rounded-lg w-full max-w-sm shadow-md p-4 mb-4 flex flex-col items-center"
      v-for="(temp, index) in temperatures"
      :key="index"
    >
      <div class="flex flex-col items-center mb-4">
        <div class="text-green-500 mb-2">
          <i :class="temp.icon"></i> <!-- Placeholder for icons -->
        </div>
        <div class="text-lg font-semibold mb-2">{{ temp.label }}</div>
      </div>
      <div class="flex items-center">
        <input
          type="number"
          class="text-2xl font-bold border-b-2 border-gray-300 focus:outline-none focus:border-green-500 w-24 text-right"
          v-model.number="temp.value"
          @input="updateTemperatures(index)"
        />
        <span class="text-lg font-semibold ml-2">{{ temp.unit }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lastUpdated: new Date().toLocaleDateString(),
      temperatures: [
        {
          label: 'Celsius',
          value: 25,
          unit: '°C',
          icon: 'fas fa-thermometer-half',
        },
        {
          label: 'Kelvin',
          value: 298.15,
          unit: 'K',
          icon: 'fas fa-temperature-low',
        },
        {
          label: 'Fahrenheit',
          value: 77,
          unit: '°F',
          icon: 'fas fa-temperature-high',
        },
      ],
    };
  },
  methods: {
    updateTemperatures(index) {
      let celsius;

      // Determine which temperature was changed and calculate Celsius
      if (index === 0) {
        // Celsius changed
        celsius = this.temperatures[0].value;
      } else if (index === 1) {
        // Kelvin changed
        celsius = this.temperatures[1].value - 273.15;
      } else {
        // Fahrenheit changed
        celsius = (this.temperatures[2].value - 32) * (5 / 9);
      }

      // Update all temperatures based on the Celsius value
      this.temperatures[0].value = parseFloat(celsius.toFixed(2));
      this.temperatures[1].value = parseFloat((celsius + 273.15).toFixed(2));
      this.temperatures[2].value = parseFloat((celsius * (9 / 5) + 32).toFixed(2));

      // Update the last updated timestamp
      this.lastUpdated = new Date().toLocaleTimeString();
    },
  },
};
</script>

<style scoped>
/* Custom styles for the text box */
input[type="number"] {
  width: 100px;
  text-align: right;
}
</style>
