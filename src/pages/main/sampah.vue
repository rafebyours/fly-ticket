<template>
    <MainLayout>
        <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <div class="transactions-list">
        <div v-for="transaction in filteredTransactions" :key="transaction.date" class="transaction-card">
          <!-- Menampilkan data dari selectedCard di setiap transaction -->
          <p><strong>Judul Acara:</strong> {{ transaction.selectedCard.title }}</p>
          <p><strong>Tanggal Acara:</strong> {{ transaction.selectedCard.date }}</p>
          <p><strong>Lokasi:</strong> {{ transaction.selectedCard.location }}</p>
          <!-- Informasi transaksi -->
          <p><strong>Tanggal Transaksi:</strong> {{ transaction.selectedCard.date }}</p>
          <p><strong>Total:</strong> {{ transaction.grandTotal }}</p>

        </div>
      </div>
    </transition>
    </MainLayout>
  </template>
  
  <script setup>
  import MainLayout from "@/layouts/MainLayout.vue";
  import { ref, computed, onMounted } from "vue";
  
  const transactions = ref([]);
  const userName = ref(localStorage.getItem("name")); // Ambil name dari localStorage
  
  // Ambil data dari localStorage dan filter transaksi berdasarkan name
  onMounted(() => {
  const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.value = storedTransactions;
});

  
  const filteredTransactions = computed(() => {
    return transactions.value.filter(transaction => 
      transaction.reservationSummary?.name === userName.value
    );
  });
  </script>
  
  <style lang="scss" scoped>
  .transactions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .transaction-card {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  </style>
  