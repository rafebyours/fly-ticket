<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-white">
    <h2 class="text-lg font-blackExtended text-gray-800 mt-4">Ticket Details</h2>
    <!-- Ticket Container -->
    <div class="w-80 bg-white rounded-2xl overflow-hidden mt-6 mb-6 shadow-xl">
      <!-- Ticket Image and Title -->
      <div class="relative">
        <img
          :src="
            selectedCard.image ||
            'https://via.placeholder.com/400x200?text=Concert+Image'
          "
          class="w-full h-40 object-cover"
        />
        <div
          class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <h2 class="text-white text-lg text-center font-blackExtended">
            {{ selectedCard.title || "Concert Title" }}
          </h2>
        </div>
      </div>

      <!-- Event Details Section -->
      <div class="px-6 py-4">
        <div class="flex justify-between text-gray-700 mb-3">
          <div>
            <p class="text-xs font-bold">Name</p>
            <p class="text-sm">{{ reservationSummary.name || "N/A" }}</p>
          </div>
          <div>
            <p class="text-xs font-medium">Ticket Total</p>
            <p class="text-sm">{{ reservationSummary.people || "N/A" }}</p>
          </div>
        </div>
        <div class="flex justify-between text-gray-700">
          <div>
            <p class="text-xs font-medium">Location</p>
            <p class="text-sm">{{ selectedCard.location || "N/A" }} {{ selectedCard.city || "N/A" }}</p>
            <br>
            <p class="text-xs font-medium">Date</p>
            <p class="text-sm">{{ selectedCard.date || "N/A" }}</p>
            <p class="text-xs font-medium">Time</p>
            <p class="text-sm">{{ selectedCard.time || "N/A" }}</p>
          </div>
        </div>
      </div>

      <!-- Barcode Section -->
      <div class="px-6 py-4 flex justify-center bg-gray-100">
        <img
          src="https://i.pinimg.com/736x/ef/02/9b/ef029b177618ee0dbf95033a08ac0f53.jpg"
          alt="Barcode"
          class="w-full max-w-xs object-contain"
        />
      </div>

      <!-- User and Payment Section -->
      <div class="px-6 py-4 text-gray-700">
        <p class="text-sm">
          <strong>Total Price:</strong>
          {{ formatCurrency(reservationSummary.totalPrice) }}
        </p>
        <p class="text-sm">
          <strong>Tax (5%):</strong>
          {{ formatCurrency(reservationSummary.taxAmount) }}
        </p>
        <p class="text-sm">
          <strong>Grand Total:</strong>
          {{ formatCurrency(reservationSummary.grandTotal) }}
        </p>
      </div>

      <!-- View My Ticket Button -->
      <div class="px-6 py-4">
        <transition name="fade">
          <button
            v-if="showPaymentButtons"
            @click="viewTicket"
            class="w-full bg-green-500 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition"
          >
            See My Tickets
          </button>
        </transition>
      </div>

      <!-- Modal Payment Confirmation -->
      <transition name="modal-fade">
        <div
          v-if="showModal"
          class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">
              Payment Successful!
            </h3>
            <p class="text-gray-600 mb-6">
              Your booking is confirmed. Please proceed with payment to complete
              the transaction.
            </p>
            <button
              @click="closeModal"
              class="w-full bg-green-500 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "TicketPage",
  data() {
    return {
      transactionData:
        JSON.parse(localStorage.getItem("reservationData")) || {},
      selectedCard: JSON.parse(localStorage.getItem("selectedCard")) || {},
      reservationSummary:
        JSON.parse(localStorage.getItem("reservationData"))
          ?.reservationSummary || {},
      showModal: true,
      showPaymentButtons: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.showModal = false;
      this.showPaymentButtons = true;
    }, 4000);
  },
  methods: {
    formatCurrency(value) {
      return value
        ? value.toLocaleString("id-ID", { style: "currency", currency: "IDR" })
        : "Rp 0";
    },
    goHome() {
      this.$router.push("/home");
    },
    confirmPayment() {
      let updatedTransactionData = JSON.parse(
        localStorage.getItem("reservationData")
      );
      if (updatedTransactionData) {
        updatedTransactionData.status = "Lunas";
        localStorage.setItem(
          "reservationData",
          JSON.stringify(updatedTransactionData)
        );
      }
      alert("Payment has been confirmed!");
      this.showPaymentButtons = false;
    },
    cancelPayment() {
      alert("Payment cancelled.");
      this.showPaymentButtons = false;
    },
    viewTicket() {
      this.$router.push("/myticket"); // Adjust route as necessary for your ticket page
    },
    closeModal() {
      this.showModal = false; // Close the modal when the OK button is clicked
    },
  },
};
</script>

<style scoped>
.fixed.inset-0 {
  background-color: rgba(0, 0, 0, 0.5);
}

button {
  transition: background-color 0.3s ease;
}

/* Fade transition for modal and buttons */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s;
}
.modal-fade-enter, 
.modal-fade-leave-to {
  opacity: 0;
}

/* Fade transition for button */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, 
.fade-leave-to {
  opacity: 0;
}
</style>
