<template>
  <h2 class="text-lg font-bold mb-4 text-center">BMI Calculator</h2>
  
  <!-- Gender Selection -->
  <div class="flex justify-center space-x-2 mb-4">
    <button
      class="btn text-green-500"
      :class="gender === 'male' ? 'bg-green-500 text-white' : 'btn-outline border-green-500'"
      @click="gender = 'male'"
    >
      Male
      <i class="fa fa-mars"></i>
    </button>
    <button
      class="btn text-green-500"
      :class="gender === 'female' ? 'bg-green-500 text-white' : 'btn-outline border-green-500'"
      @click="gender = 'female'"
    >
      Female
      <i class="fa fa-venus"></i>
    </button>
  </div>

  <!-- Height Input -->
  <div class="form-control">
    <label class="label">
      <span class="label-text">Height (cm)</span>
    </label>
    <input
      type="range"
      v-model="height"
      min="100"
      max="250"
      @input="updateSlider"
    />
    <div class="text-center mt-2 font-bold">{{ height }} cm</div>
  </div>

  <!-- Weight Input -->
  <div class="form-control">        
    <label class="label">
      <span class="label-text">Weight (kg)</span>
    </label>
    <input
      type="range"
      v-model="weight"
      min="30"
      max="200"
      @input="updateSlider"
    />
    <div class="text-center mt-2 font-bold">{{ weight }} kg</div>
  </div>

  <!-- Calculate Button -->
  <button
    @click="calculateBMI"
    class="w-full bg-green-500 text-white py-2 mt-4 rounded hover:bg-green-600 transition"
  >
    Calculate BMI
  </button>

  <!-- BMI Result -->
  <div v-if="bmi" class="text-center mt-4">
    <p>Your BMI: <span class="font-bold">{{ bmi.toFixed(2) }}</span></p>
    <p>Status: 
      <span :class="bmiStatusClass">{{ bmiStatus }}</span>
    </p>
  </div>

<!-- Snackbar -->
<div v-if="snackBarVisible" :class="snackBarClass" class="fixed bottom-9 mb-10 left-1/2 transform -translate-x-1/2 text-white p-4 rounded shadow-lg w-4/5 sm:w-3/5">
  {{ snackBarMessage }}
</div>

</template>


<script>
export default {
  data() {
    return {
      gender: 'male',
      height: 170, // Default height in cm
      weight: 70,  // Default weight in kg
      bmi: null,
      bmiStatus: '',
      snackBarVisible: false,
      snackBarMessage: '',
      snackBarClass: 'bg-green-500', // Default color for snackbar
    };
  },
  methods: {
    calculateBMI() {
      // Calculate BMI
      const heightInMeters = this.height / 100;
      this.bmi = this.weight / (heightInMeters * heightInMeters);

      // Determine BMI status
      if (this.gender === 'male') {
        this.bmiStatus = this.getBmiStatusForMale(this.bmi);
      } else if (this.gender === 'female') {
        this.bmiStatus = this.getBmiStatusForFemale(this.bmi);
      } else {
        this.bmiStatus = this.getBmiStatus(this.bmi); // General BMI status
      }

      // Show Snackbar with the BMI status message
      this.showSnackBar(this.bmiStatus);
    },
    
    getBmiStatusForMale(bmi) {
      if (bmi < 18.5) return 'Underweight';
      if (bmi >= 18.5 && bmi < 24.9) return 'Normal';
      if (bmi >= 25 && bmi < 29.9) return 'Overweight';
      if (bmi >= 30 && bmi < 34.9) return 'Obese';
      return 'Severely Obese';
    },
    getBmiStatusForFemale(bmi) {
      if (bmi < 18.5) return 'Underweight';
      if (bmi >= 18.5 && bmi < 24.9) return 'Normal';
      if (bmi >= 25 && bmi < 29.9) return 'Overweight';
      if (bmi >= 30 && bmi < 34.9) return 'Obese';
      return 'Severely Obese';
    },
    getBmiStatus(bmi) {
      if (bmi < 18.5) return 'Underweight';
      if (bmi >= 18.5 && bmi < 24.9) return 'Normal';
      if (bmi >= 25 && bmi < 29.9) return 'Overweight';
      if (bmi >= 30 && bmi < 34.9) return 'Obese';
      return 'Severely Obese';
    },

    showSnackBar(status) {
      // Set the snackbar message and background color based on BMI status
      this.snackBarMessage = `Your BMI status is: ${status}`;
      this.snackBarClass = this.getSnackBarColor(status); // Get the color for snackbar
      this.snackBarVisible = true;

      // Hide snackbar after 3 seconds
      setTimeout(() => {
        this.snackBarVisible = false;
      }, 3000);
    },

    getSnackBarColor(status) {
      // Return corresponding color for the snackbar based on BMI status
      if (status === 'Underweight') return 'bg-blue-500';
      if (status === 'Normal') return 'bg-green-500';
      if (status === 'Overweight') return 'bg-yellow-500';
      if (status === 'Obese') return 'bg-orange-500';
      return 'bg-red-500'; // Severely Obese
    },

    updateSlider(event) {
      const value = event.target.value;
      const min = event.target.min;
      const max = event.target.max;
      const percent = ((value - min) / (max - min)) * 100;
      event.target.style.setProperty("--value-percent", `${percent}%`);
    },
  },
  computed: {
    bmiStatusClass() {
      if (this.bmiStatus === 'Underweight') return 'text-blue-500';
      if (this.bmiStatus === 'Normal') return 'text-green-500';
      if (this.bmiStatus === 'Overweight') return 'text-yellow-500';
      if (this.bmiStatus === 'Obese') return 'text-orange-500';
      return 'text-red-500'; // Severely Obese
    }
  }
};
</script>


<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 5px;
  outline: none;
  background: linear-gradient(
    to right,
    green 0%,
    green var(--value-percent),
    white var(--value-percent),
    white 100%
  );
  border: 1px solid rgba(0, 128, 0, 0.6); /* Border tipis berwarna hijau */
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: green;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid rgba(0, 128, 0, 0.6); /* Border tipis pada thumb berwarna hijau */
}
</style>
