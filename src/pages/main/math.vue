<template>
  <MainLayout>
    <transition
      name="fade"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <div class="w-full p-5 bg-gray-100 min-h-screen">
        <div class="text-lg font-blackExtended mt-5 text-gray-800">
          Mathematics Operations
        </div>

        <!-- Category Selection -->
        <section class="flex gap-4 mt-5 overflow-auto">
          <div
            v-for="category in categories"
            :key="category"
            :class="category === active ? activeClass : baseClass"
            class="items-center rounded-full w-max px-6 py-2 cursor-pointer"
            @click="setActiveCategory(category)"
          >
            {{ category }}
          </div>
        </section>

        <!-- Content Section -->
        <div class="mt-10 bg-white p-5 rounded shadow">
          <div v-if="active === ''">
            <h2 class="text-md font-semibold mb-2">
              Select a category to view content.
            </h2>
          </div>
          <div v-else-if="active === 'Math Calculator'">
            <CalculatorComponent />
          </div>
          <div v-else-if="active === 'BMI Calculator'">
            <BMICalculatorComponent />
          </div>
          <div v-else-if="active === 'Temperature Converter'">
            <TemperatureConverterComponent />
          </div>
          <div v-else-if="active === 'Currency Converter'">
            <CurrencyConverterComponent />
          </div>
        </div>
      </div>
    </transition>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/layouts/MainLayout.vue";
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';

import CalculatorComponent from "@/pages/main/CalculatorComponent.vue";
import BMICalculatorComponent from "@/pages/main/BMICalculatorComponent.vue";
import TemperatureConverterComponent from "@/pages/main/TemperatureConverterComponent.vue";
import CurrencyConverterComponent from "@/pages/main/CurrencyConverterComponent.vue";

const categories = [
  "Math Calculator",
  "BMI Calculator",
  "Temperature Converter",
  "Currency Converter",
];
const active = ref("");
const activeClass = "bg-primary text-white";
const baseClass = "border-2 border-primary text-primary";

// Function to set active category
function setActiveCategory(category) {
  active.value = category;
}
</script>

<style lang="scss" scoped>
.bg-primary {
  background-color: #22c55e;
}
.text-primary {
  color: black;
}
</style>
