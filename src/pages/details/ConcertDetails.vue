<template>
  <MainLayout>
    <transition
      name="slide-right"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <div
        v-if="isVisible"
        class="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-4"
        key="slide-transition"
      >
        <div class="relative">
          <button
            @click="$router.push('/home')"
            class="btn flex items-center top-4 left-4 absolute z-10 text-white bg-black bg-opacity-60"
          >
            <i class="fas fa-arrow-left"></i>
          </button>
          <figure class="w-full h-full relative">
            <img
              :src="cardData.image"
              alt="Concert Image"
              class="w-full h-64 object-cover rounded-lg"
            />
          </figure>
        </div>

        <div class="p-4">
          <h3 class="text-gray-600 text-xs uppercase">Music Concert</h3>
          <h2 class="text-2xl font-bold mt-1">{{ cardData.title }}</h2>
          <div class="mt-2 text-lg text-gray-900 font-semibold">
            Rp. {{ formattedPrice }}
            <span class="text-sm font-normal text-gray-500">/ person</span>
          </div>
          <p class="text-sm text-gray-500">Bills included</p>

          <div class="mt-4 flex items-center space-x-2 text-green-500">
            <i class="fas fa-calendar-alt"></i>
            <p>{{ cardData.date }}</p>
          </div>
          <div class="mt-2 flex items-center space-x-2 text-gray-700">
            <i class="fas fa-map-marker-alt text-green-500"></i>
            <p>{{ cardData.location }}</p>
            <a href="#" class="text-green-500 underline">Direction</a>
          </div>

          <div class="mt-4">
            <h4 class="text-lg font-medium">Event Details</h4>
            <p class="text-gray-600 text-sm mt-2">{{ cardData.description }}</p>
          </div>

          <button
            @click="openModal"
            class="mt-6 w-full bg-green-500 text-white text-lg font-bold py-2 rounded-lg hover:bg-green-600"
          >
            Buy Tickets
          </button>

          <!-- Full-Screen Modal Popup mengikuti ukuran MainLayout -->

        </div>
      </div>
    </transition>
    
  </MainLayout>

  <div
            v-if="showModal"
            class="fixed inset-0 bottom-11 bg-black bg-opacity-50 flex items-end justify-center z-20"
          >
            <div class="relative bg-white max-w-lg w-full rounded-lg p-6">
              <button
                @click="showModal = false"
                class="absolute top-7 right-5 text-gray-500 hover:text-black"
              >
                <i class="fas fa-times"></i>
              </button>
              <h2 class="text-2xl font-bold mb-4">Reservation Details</h2>

              <!-- Form untuk mengisi detail reservasi -->
              <form @submit.prevent="openConfirmationModal">
                <!-- Field Nama -->
                <label
                  class="input input-bordered flex items-center gap-3 w-full mt-4"
                >
                  <input
                    type="text"
                    v-model="formData.username"
                    class="grow"
                    placeholder="Full Name"
                    required
                  />
                </label>

                <!-- Field Nomor Telepon -->
                <label
                  class="input input-bordered flex items-center gap-3 w-full mt-4"
                >
                  <input
                    type="tel"
                    v-model="formData.phone"
                    class="grow"
                    placeholder="Phone Number"
                    required
                  />
                </label>

                <!-- Field Jumlah Orang -->
                <label class="input input-bordered flex items-center gap-3 w-full mt-4">
  <button
    type="button"
    @click="formData.people = Math.max(1, formData.people - 1)"
    class="px-2 py-1 bg-gray-300 text-gray-700 rounded-l"
  >
    -
  </button>
  <input
    type="number"
    v-model.number="formData.people"
    class="grow text-center outline-none"
    placeholder="Number of People"
    min="1"
    required
  />
  <button
    type="button"
    @click="formData.people += 1"
    class="px-2 py-1 bg-gray-300 text-gray-700 rounded-r"
  >
    +
  </button>
</label>


                <div class="mb-4 text-lg font-semibold mt-4">
                  Total Price: Rp. {{ formatPrice(totalPrice) }}
                </div>
                <button
                  type="submit"
                  class="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                >
                  Confirm Reservation
                </button>
              </form>
            </div>
          </div>

          <!-- Confirmation Modal mengikuti ukuran MainLayout -->
          <div
            v-if="showConfirmationModal"
            class="fixed inset-0 bottom-11 bg-black bg-opacity-50 flex items-end justify-center z-20"
          >
            <div class="relative bg-white max-w-lg w-full rounded-lg p-6">
              <button
                @click="showConfirmationModal = false"
                class="absolute top-7 right-5 text-gray-500 hover:text-black"
              >
                <i class="fas fa-times"></i>
              </button>
              <h2 class="text-2xl font-bold mb-4">Order Summary</h2>

              <!-- Isi modal konfirmasi reservasi -->
              <div class="space-y-2 text-gray-700">
                <p><strong>Name:</strong> {{ formData.username }}</p>
                <p><strong>Phone Number:</strong> {{ formData.phone }}</p>
                <p><strong>Number of Persons:</strong> {{ formData.people }}</p>
              </div>
              <hr class="my-4" />
              <div class="flex justify-between text-lg font-semibold">
                <span>Subtotal:</span>
                <span>Rp. {{ formatPrice(totalPrice) }}</span>
              </div>
              <div class="flex justify-between text-lg font-semibold">
                <span>Tax (5%):</span>
                <span>Rp. {{ formatPrice(taxAmount) }}</span>
              </div>
              <div class="flex justify-between text-2xl font-bold">
                <span>Grand Total:</span>
                <span>Rp. {{ formatPrice(grandTotal) }}</span>
              </div>

              <button
                @click="confirmReservation"
                class="w-full bg-green-500 text-white py-2 mt-4 rounded-lg hover:bg-green-600"
              >
                Pay and Reserve
              </button>
            </div>
          </div>
</template>

<script setup>
import MainLayout from "@/layouts/MainLayout.vue";
import { ref, onMounted, computed, nextTick } from "vue";

const isVisible = ref(false);
onMounted(() => {
  nextTick(() => {
    isVisible.value = true;
  });
});

const cardData = ref({});
const showModal = ref(false);
const showConfirmationModal = ref(false);
const formData = ref({
  name: "",
  phone: "",
  people: 1,
  paymentMethod: "",
});

const nameInputRef = ref(null);

const formatPrice = (price) => new Intl.NumberFormat("id-ID").format(price);
const formattedPrice = computed(() => formatPrice(cardData.value.price || 0));
const totalPrice = computed(() => {
  return Number(cardData.value.price || 0) * formData.value.people;
});

// Tax computed as 5% of totalPrice, formatted with thousands separator
const taxAmount = computed(() => {
  return +(totalPrice.value * 0.05).toFixed(2); // Menggunakan unary plus (+) untuk mengkonversi string kembali ke number
});

// Grand Total includes totalPrice and tax without formatting
const grandTotal = computed(() => {
  return Number(totalPrice.value) + Number(taxAmount.value);
});

onMounted(() => {
  const storedData = localStorage.getItem("selectedCard");
  const storedUsername = ref(localStorage.getItem("username"));
  if (storedData) {
    cardData.value = JSON.parse(storedData);
    cardData.value.price = Number(cardData.value.price);
  }
});

const openModal = () => {
  showModal.value = true;
  nextTick(() => nameInputRef.value?.focus());
};

const openConfirmationModal = () => {
  showModal.value = false;
  showConfirmationModal.value = true;
};

const confirmReservation = () => {
  const selectedCardData = JSON.parse(
    localStorage.getItem("selectedCard") || "{}"

    // Navigate to the e-ticket page
  );

  // Save the form data and computed values (like totalPrice and grandTotal) to localStorage

  const reservationSummary = {
    name: formData.value.username,
    phone: formData.value.phone,
    people: formData.value.people,
    totalPrice: totalPrice.value,
    taxAmount: taxAmount.value,
    grandTotal: grandTotal.value,
    username: localStorage.getItem("loggedInUser"), // Menambahkan username dari localStorage
  };

  const combinedData = {
    selectedCard: selectedCardData,
    reservationSummary: reservationSummary,
  };

  // Save combined data to localStorage
  localStorage.setItem("reservationData", JSON.stringify(combinedData));

  // Redirect to the /payment page
  window.location.href = "/payment";
};

const beforeEnter = (el) => {
  el.style.opacity = 0;
  el.style.transform = "translateX(100%)"; // Start from right
};

const enter = (el, done) => {
  el.offsetHeight; // trigger reflow
  el.style.transition = "transform 0.5s ease, opacity 0.5s ease";
  el.style.opacity = 1;
  el.style.transform = "translateX(0)"; // Move to normal position
  done();
};

const leave = (el, done) => {
  el.style.transition = "transform 0.5s ease, opacity 0.5s ease";
  el.style.opacity = 0;
  el.style.transform = "translateX(-100%)"; // Exit to left
  done();
};

const username = ref(localStorage.getItem("username"));
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.fixed.inset-0 {
  animation: slide-up 0.3s ease-out;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
