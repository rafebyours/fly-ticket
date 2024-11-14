<template>
  <MainLayout>
    <!-- Scrollable content -->
    <div class="max-w-md mx-auto bg-white rounded-lg overflow-auto p-4" style="margin-bottom: 6rem;">
      <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
        <div v-if="isVisible">
          <div class="relative">
            <div class="max-w-md mx-auto mt-3 p-6 rounded-lg bg-white shadow-md">
              <h2 class="text-2xl font-blackExtended mb-4">Payment</h2>

              <!-- Payment Methods Section -->
              <div class="collapse collapse-arrow bg-base-200">
                <input type="radio" name="my-accordion-2" @change="setPaymentMethod('credit-card')" />
                <div class="collapse-title text-xl font-medium">Credit Card</div>
                <div class="collapse-content">
                  <div class="space-y-4">
                    <div class="flex items-center border border-blue-500 rounded-lg p-2 cursor-pointer">
                      <input type="radio" name="payment" value="credit-card" class="form-radio mr-2" checked @change="setPaymentMethod('credit-card')" />
                      <label class="flex-1">Credit Card</label>
                    </div>
                  </div>
                  <div class="p-4 bg-blue-100 rounded-lg">
                    <div class="mb-3">
                      <input
                        type="text"
                        placeholder="4678 1234 5678 8910"
                        class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div class="flex space-x-3 mt-2">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        class="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        class="w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="collapse collapse-arrow bg-base">
                <input type="radio" name="my-accordion-2" @change="setPaymentMethod('transfer')" />
                <div class="collapse-title text-xl font-medium">Transfer</div>
                <div class="collapse-content">
                  <div class="form-control">
                    <label class="label cursor-pointer flex items-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/1199px-Bank_Central_Asia.svg.png" alt="BCA Logo" class="w-16 h-8 mr-3 object-contain" />
                      <span class="label-text flex-1">Bank Central Asia (BCA)</span>
                      <input type="radio" name="bank" value="bca" class="radio checked:bg-green-500" @change="setSelectedBank('bca')" />
                    </label>
                  </div>
                  <div class="form-control">
                    <label class="label cursor-pointer flex items-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2e/BRI_2020.svg" alt="BRI Logo" class="w-16 h-8 mr-3 object-contain" />
                      <span class="label-text flex-1">Bank Rakyat Indonesia (BRI)</span>
                      <input type="radio" name="bank" value="BRI" class="radio checked:bg-green-500" @change="setSelectedBank('bri')" />
                    </label>
                  </div>
                  <div class="form-control">
                    <label class="label cursor-pointer flex items-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg" alt="Mandiri Logo" class="w-16 h-8 mr-3 object-contain" />
                      <span class="label-text flex-1">Bank Mandiri</span>
                      <input type="radio" name="bank" value="Bank Mandiri" class="radio checked:bg-green-500" @change="setSelectedBank('mandiri')" />
                    </label>
                  </div>
                  <div class="form-control">
                    <label class="label cursor-pointer flex items-center">
                      <img src="https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/2560px-BNI_logo.svg.png" alt="BNI Logo" class="w-16 h-8 mr-3 object-contain" />
                      <span class="label-text flex-1">Bank Negara Indonesia (BNI)</span>
                      <input type="radio" name="bank" value="BNI" class="radio checked:bg-green-500" @change="setSelectedBank('bni')" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Loading Spinner -->
      <div v-if="loading" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
        <div class="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-white rounded-full"></div>
      </div>

    </div>

    <div class="fixed bottom-12 pb-5 left-0 w-full bg-white p-4 border-t shadow-md">
      <div class="text-right mb-2">
        <p class="text-lg font-sans">Total</p>
        <p class="text-xl font-blackExtended">{{ formatRupiah(grandTotal) }}</p>
      </div>

      <button @click="confirmOrder" class="w-full font-sans py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-black">
        Confirm Order
      </button>

      <!-- Snackbar for Missing Payment Method -->
      <div v-if="showSnackbar" class="snackbar">
        <p>Please select a payment method</p>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/layouts/MainLayout.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isVisible = ref(false);
const grandTotal = ref(0);
const selectedPaymentMethod = ref('');
const selectedBank = ref('');  // State to store the selected bank
const reservationData = ref(null);
const loading = ref(false); // New state for loading
const showSnackbar = ref(false); // New state for snackbar

onMounted(() => {
  isVisible.value = true;

  const storedReservationData = localStorage.getItem('reservationData');
  if (storedReservationData) {
    reservationData.value = JSON.parse(storedReservationData);
    grandTotal.value = reservationData.value.reservationSummary?.grandTotal || 0;
  }
});

const setPaymentMethod = (method) => {
  selectedPaymentMethod.value = method;
};

const setSelectedBank = (bank) => {
  selectedBank.value = bank;  // Update the selected bank
};

const confirmOrder = () => {
  if (!selectedPaymentMethod.value) {
    showSnackbar.value = true;
    setTimeout(() => {
      showSnackbar.value = false;
    }, 3000); // Hide snackbar after 3 seconds
    return;
  }

  // Show loading spinner for 3 seconds
  loading.value = true;

  // Simulate 3 seconds delay before proceeding
  setTimeout(() => {
    // Generate a random ID for the transaction
    const transactionId = 'txn-' + Math.random().toString(36).substr(2, 9);

    const transactionData = {
      id: transactionId,
      reservationSummary: reservationData.value.reservationSummary,
      selectedCard: reservationData.value.selectedCard,
      paymentMethod: selectedPaymentMethod.value,
      bank: selectedBank.value,  // Save selected bank
      grandTotal: grandTotal.value,
      date: new Date().toLocaleString(),
    };

    const existingTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    existingTransactions.push(transactionData);
    localStorage.setItem('transactions', JSON.stringify(existingTransactions));

    // Navigate to the e-ticket page after 3 seconds
    router.push("/eticket");

    // Hide the loading spinner
    loading.value = false;
  }, 3000); // 3 seconds delay
};

const formatRupiah = (value) => {
  return `${value.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).replace(/IDR\s?/, '')}`;
};

const beforeEnter = (el) => {
  el.style.opacity = 0;
};

const enter = (el, done) => {
  el.offsetHeight;
  el.style.transition = "opacity 0.5s";
  el.style.opacity = 1;
  done();
};

const leave = (el, done) => {
  el.style.transition = "opacity 0.5s";
  el.style.opacity = 0;
  done();
};
</script>
