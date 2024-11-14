<template>
  <MainLayout>
    <transition
      name="fade"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <div
        v-if="isVisible"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full px-4 items-start overflow-auto"
        key="home-content"
      >
      <div class="flex flex-col">
  <h1 class="text-1xl font-blackExtended mt-3">
    Hello, <span class="bg-green-500 text-white px-2 py-1 rounded">{{ username }} !</span>
  </h1>
  
  <h2 class="text-2xl font-blackExtended mt-5">Upcoming Event</h2>
</div>


       
      </div>
    </transition>



    <div class="flex overflow-x-auto p-4 ga">
      <div class="flex gap-4">
        <!-- Render Cards Dynamically -->
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="card w-60 bg-base-100 image-full shadow-xl mt-2 flex-shrink-0 mb-4"
          @click="saveCardData(card)"
        >
          <figure class="w-full h-full relative">
            <img :src="card.image" alt="Concert" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black opacity-40"></div>
          </figure>
          <div class="card-body relative z-10">
            <h2 class="card-title logo-size">
              <img :src=card.logo alt="Logo" />
            </h2>
            <h2 class="card-title font-sans2 text-white">{{ card.title }}</h2>
            <p class="font-sans text-white custom-shadow">
              {{ card.date }} <br>
              {{ card.location }} <br>
              <span v-if="isLongText(card.title)">... <a href="#" class="text-blue-500">lihat semuanya</a></span>
            </p>
            <div class="card-actions justify-end">
              <button class="btn glass font-sans text-white custom-shadow">Beli Tiket</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <!-- Moved the Lorem Ipsum text here -->
    <div class="text-center mt-4">
      <h2 class="text-2xl font-blackExtended mt-5">Near Bandung</h2>
    </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full mt-4">
          <!-- Render Cards Dynamically -->
          <div
            v-for="(card, index) in filteredCards"
            :key="index"
            class="card w-full bg-base-100 image-full mt-1 mb-4 p-4"
            @click="saveCardData(card)"
          >
            <figure class="w-full h-full relative">
              <img :src="card.image" alt="Concert" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black opacity-40"></div>
            </figure>
            <div class="card-body relative z-10">
              <h2 class="card-title logo-size">
                <img :src="card.logo" alt="Logo" />
              </h2>
              <h2 class="card-title font-sans2 text-white">{{ card.title }}</h2>
              <p class="font-sans text-white custom-shadow">
                {{ card.date }} <br />
                {{ card.location }} <br />
                <span v-if="isLongText(card.description)">
                  ... <a href="#" class="text-blue-500">See More</a>
                </span>
              </p>
              <div class="card-actions justify-end">
                <button class="btn glass font-sans text-white custom-shadow">Buy Tickets</button>
              </div>
            </div>
          </div>
        </div>

      
    

    
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/layouts/MainLayout.vue";
import { ref, onMounted, computed } from "vue";
import { useRouter } from 'vue-router';


import Synchronize from "@/image/logo/Synchronize.png";
import Pestapora from "@/image/logo/Pestapora.png";
import WeTheFest from "@/image/logo/wtf.png";
import MalamMendengar from "@/image/logo/Malam.png";
import FlowerCity from "@/image/logo/flowercity.png";
import Kickfest from "@/image/logo/Kickfest.png";
import SunsetdiKebunBali from "@/image/logo/sunsetBali.png";

const router = useRouter();

// Array of card data with added province field
const cards = [
  {
    title: "Synchronize Fest",
    image: "https://eventguide.id/wp-content/uploads/2024/05/IMG-20230727-WA0112.jpg",
    logo: Synchronize,
    date: "2024-09-24",
    time: "18:00", // Added time
    city: "Jakarta",
    province: "DKI Jakarta",
    location: "Gambir Expo Kemayoran, Jakarta",
    price: 250000,
    description: "Gambir Expo Kemayoran, Jakarta 2, 3, 4 Oktober 2024",
  },
  {
    title: "Pestapora",
    image: "https://imgsrv2.voi.id/LmMp5b-2bB_rMXc9vjheoJ2cSIdqsA_mcwg8_kr10uI/auto/1200/675/sm/1/bG9jYWw6Ly8vcHVibGlzaGVycy80MTg1MzAvMjAyNDA5MjIxMTE2LW1haW4uanBlZw.jpg",
    logo: Pestapora,
    date: "2024-09-09",
    time: "16:00", // Added time
    city: "Jakarta",
    province: "DKI Jakarta",
    location: "Gambir Expo dan Hall D2 Jiexpo, Kemayoran",
    price: 200000,
    description: "Gambir Expo dan Hall D2 Jiexpo, Kemayoran, Jakarta 20, 21, 22 September 2024",
  },
  {
    title: "We The Fest 2024",
    image: "https://blog.metamata.id/wp-content/uploads/2022/09/Foto-1-We-The-Fest-2022.jpg",
    logo: WeTheFest,
    date: "2024-09-11",
    time: "15:00", // Added time
    city: "Jakarta",
    province: "DKI Jakarta",
    location: "Gambir Expo Kemayoran",
    price: 500000,
    description: "Gambir Expo Kemayoran, Jakarta 19–21 Juli 2024",
  },
  {
    title: "Nadin Amizah : Malam Mendengar",
    image: "https://asset-2.tstatic.net/style/foto/bank/images/5-postingan-Nadin-Amizah-sebelum-showcase-Malam-Mendengar-ingin-ubah-persona-ibu-perinya.jpg",
    logo: MalamMendengar,
    date: "2024-10-23",
    time: "20:00", // Added time
    city: "Jakarta",
    province: "DKI Jakarta",
    location: "GOR Soemantri Brodjonegoro",
    price: 500000,
    description: "Penampilan Orchestra Kecil Lagu-lagu Nadin Amizah",
  },
  {
    title: "Flower City Fest 2024",
    image: "https://static.promediateknologi.id/crop/0x106:1069x770/750x500/webp/photo/p1/100/2024/06/28/Snapinstaapp_448841405_18275475343226596_926220040501372653_n_1024-3146847166.jpg",
    logo: FlowerCity,
    date: "2024-12-15",
    time: "17:00", // Added time
    city: "Bandung",
    province: "Jawa Barat",
    location: "Bandung Creative Hub",
    price: 200000,
    description: "A celebration of diverse music genres in the heart of Bandung.",
  },
  {
    title: "Kicfest Bandung 2024",
    image: "https://cdn.rri.co.id/berita/Cirebon/o/1730366857377-kickfest24/q8ozx8u28xxldir.png",
    logo: Kickfest,
    date: "2024-11-03",
    time: "16:30", // Added time
    city: "Bandung",
    province: "Jawa Barat",
    location: "PPI Pussenif Bandung",
    price: 100000,
    description: "A festival dedicated to indie music fans and underground artists.",
  },
  {
    title: "Sunset di Kebun Bali 2024",
    image: "https://www.konsermusikbali.com/wp-content/uploads/2024/01/Sunset-di-Kebun-2024-Bali-25-26-Maret-2024.jpg",
    logo: SunsetdiKebunBali,
    date: "2024-05-25",
    time: "17:00", // Added time
    city: "Tabanan",
    province: "Bali",
    location: "Kebun Raya Bali",
    price: 100000,
    description: "A festival dedicated to indie music fans and underground artists.",
  }
];






// Filter cards to only show those in Bandung
const filteredCards = computed(() => {
  return cards.filter(card => card.city === 'Bandung');
});

const showFilterModal = ref(false);

// Filter action
const applyFilters = () => {
  // Implementasi logika filter
  showFilterModal.value = false;
};

const saveCardData = (cardData) => {
  localStorage.setItem("selectedCard", JSON.stringify(cardData));
  router.push("/concerts"); // Navigasi ke halaman detail konser
};


const isVisible = ref(false);

onMounted(() => {
  isVisible.value = true;
});

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

// get data from local storage
const username = ref(localStorage.getItem("loggedInUser"));
const password = ref(localStorage.getItem("password"));
const name = ref(localStorage.getItem("name"));

// Function to check if the text is too long
const isLongText = (text) => {
  return text.length > 20; // adjust the limit as needed
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.card-fixed-size {
  width: 250px;
  height: 250px;
  flex-shrink: 0;
}
.logo-size img {
  max-width: 100px; /* Adjust max logo size */
  max-height: 40px; /* Adjust max logo size */
  height: auto; /* Maintain aspect ratio */
}
</style>