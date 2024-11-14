<template>
  <div class="bg-white rounded-lg p-5 mx-auto w-full max-w-md sm:p-8">
    <h2 class="text-lg font-bold mb-4 text-center">Currency Exchange</h2>
    <div class="mb-4 flex items-center">
      <span :class="`fi fi-${getCountryCode(fromCurrency)}`" class="mr-2"></span>
      <label class="block text-sm font-medium mb-1">From:</label>
      <select v-model="fromCurrency" class="w-full border rounded p-2 ml-2">
        <option v-for="currency in currencies" :key="currency" :value="currency">
          {{ currency }}
        </option>
      </select>
    </div>
    <div class="mb-4">
      <input
        type="number"
        v-model.number="amount"
        class="w-full border rounded p-2"
        placeholder="Enter amount"
      />
    </div>
    <div class="mb-4 flex items-center">
      <span :class="`fi fi-${getCountryCode(toCurrency)}`" class="mr-2"></span>
      <label class="block text-sm font-medium mb-1">To:</label>
      <select v-model="toCurrency" class="w-full border rounded p-2 ml-2">
        <option v-for="currency in currencies" :key="currency" :value="currency">
          {{ currency }}
        </option>
      </select>
    </div>
    <button
      @click="convertCurrency"
      class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
    >
      Convert
    </button>
    <div class="mt-4 text-center">
      <p class="text-lg font-semibold" v-if="convertedAmount">
        {{ formattedAmount }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      amount: 1,
      fromCurrency: "USD",
      toCurrency: "EUR",
      currencies: ["USD", "EUR", "GBP", "JPY", "AUD", "IDR", "MYR"],
      convertedAmount: null,
    };
  },
  computed: {
    formattedAmount() {
      if (!this.convertedAmount) return "";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: this.toCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(this.convertedAmount);
    },
  },
  methods: {
    async convertCurrency() {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${this.fromCurrency}`
        );
        const data = await response.json();
        const rate = data.rates[this.toCurrency];
        this.convertedAmount = (this.amount * rate).toFixed(2);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    },
    getCountryCode(currency) {
      const currencyCountryMap = {
        USD: "us",
        EUR: "eu",
        GBP: "gb",
        JPY: "jp",
        AUD: "au",
        IDR: "id",
        MYR: "my",
      };
      return currencyCountryMap[currency] || "un";
    },
  },
};
</script>

<style scoped>
/* Custom styling */
</style>
