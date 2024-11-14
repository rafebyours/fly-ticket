<template>
  <MainLayout>
    <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="back-button">
            <button @click="$router.push('/home')">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="title font-sans2">My Tickets</div>
        </div>

        <!-- Payment Section -->
        <div class="payment-section">
          <div class="payment-title font-sans">List Ticket</div>
          <div class="tickets-section">
            <!-- Loop through each filtered transaction -->
            <div v-for="transaction in filteredTransactions" :key="transaction.date" class="ticket-info">
              <div class="ticket-details">
                <h2 class="text-1xl font-blackExtended mt-3">
                  <span class="bg-green-100 px-2 py-1 rounded">{{ transaction.selectedCard.title }}</span>
                </h2>
                <p>{{ transaction.selectedCard.location }}</p>
                <p>{{ transaction.selectedCard.date }} {{ transaction.selectedCard.time }}</p>
                <p>Total Ticket : {{ transaction.reservationSummary.people }}</p>
                <p>Total: Rp. {{ formatPrice(transaction.grandTotal) }}</p>
              </div>
              <!-- Button to view details, aligned to the right and bottom -->
              <div class="details-button">
                <button @click="$router.push({ name: 'TicketDetails', params: { id: transaction.id } })" class="view-details-button">
                  Lihat Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/layouts/MainLayout.vue";
import { ref, computed, onMounted } from "vue";

const transactions = ref([]);
const userName = ref(localStorage.getItem("loggedInUser")); // Get name from localStorage
const totalPrice = ref(0); // Total ticket price

// Fetch data from localStorage and filter transactions based on user name
onMounted(() => {
  const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.value = storedTransactions;

  // Calculate the total ticket price
  totalPrice.value = storedTransactions.reduce((total, transaction) => total + transaction.grandTotal, 0);
});

// Filter transactions by user name
const filteredTransactions = computed(() => {
  return transactions.value.filter(transaction => 
    transaction.reservationSummary?.username === userName.value
  );
});

const formatPrice = (price) => new Intl.NumberFormat("id-ID").format(price);

// Function to view transaction details
const viewDetails = (transaction) => {
  alert(`Melihat detail untuk: ${transaction.selectedCard.title}`);
};

// Transition Hooks
const beforeEnter = (el) => {
  el.style.opacity = 0;
};

const enter = (el, done) => {
  el.offsetHeight; // trigger reflow
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

<style scoped>
.container {
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.back-button {
  cursor: pointer;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.payment-section {
  margin-top: 20px;
}

.payment-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.tickets-section {
  margin-top: 10px;
}

.ticket-info {
  display: flex;
  flex-direction: column; /* Stack items vertically */
  position: relative;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.ticket-details {
  flex: 1;
}

.details-button {
  margin-top: auto; /* Pushes the button to the bottom */
  display: flex;
  justify-content: flex-end; /* Align button to the right */
  align-items: flex-end; /* Ensure button is aligned to the bottom */
}

.view-details-button {
  background-color: black;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease; /* Smooth transition */
}

.view-details-button:hover {
  background-color: #555; /* New hover color */
  transform: translateY(-2px); /* Slight lift effect on hover */
}


.total-price {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
}

/* Transition Styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
