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
          <h2 class="text-2xl font-blackExtended mt-5">Search</h2>
        </div>

        <div class="flex gap-3 items-center w-full mt-4">
          <label class="input input-bordered flex items-center gap-3 grow">
            <input
              type="text"
              v-model="searchQuery"
              class="grow z-50"
              placeholder="Search"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="h-4 w-4 opacity-70"
            >
              <path
                fill-rule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clip-rule="evenodd"
              />
            </svg>
          </label>
          <button @click="showFilterModal = true" class="btn btn-outline">
            Filter
          </button>
        </div>

        <!-- Render Filter Modal -->
        <div
          v-if="showFilterModal"
          class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
        >
          <div class="bg-white p-6 rounded-md w-80 overflow-y-auto">
            <h2 class="text-lg font-semibold mb-4">Filter Options</h2>
            <!-- Province Filter -->
            <label class="block mb-2">Province</label>
            <select
              v-model="selectedProvince"
              class="input input-bordered w-full mb-4"
            >
              <option disabled value="">Select Province</option>
              <option
                v-for="province in provinces"
                :key="province"
                :value="province"
              >
                {{ province }}
              </option>
            </select>

            <!-- City Filter -->
            <label class="block mb-2">City</label>
            <select
              v-model="selectedCity"
              class="input input-bordered w-full mb-4"
              :disabled="!selectedProvince"
            >
              <option disabled value="">Select City</option>
              <option v-for="city in cities" :key="city" :value="city">
                {{ city }}
              </option>
            </select>

            <!-- Date Filter -->
            <!-- Date Range Filter -->
            <label class="block mb-2">Date Range</label>
            <div class="gap-3 mb-4">
              From
              <input
                type="date"
                v-model="startDate"
                class="input input-bordered w-full mb-4"
              />
              To
              <input
                type="date"
                v-model="endDate"
                class="input input-bordered w-full"
              />
            </div>

            <div class="flex justify-between gap-2 mt-4">
              <button
                @click="showFilterModal = false"
                class="btn btn-outline text-white bg-red-500 hover:bg-red-700 hover:text-white"
              >
                Close
              </button>
              <button
                @click="clearFilters"
                class="btn btn-outline text-white bg-orange-500 hover:bg-orange-700 hover:text-white"
              >
                Clear
              </button>
              <button
                @click="applyFilters"
                class="btn btn-outline text-white bg-green-500 hover:bg-green-700 hover:text-white"

              >
                Apply
              </button>
            </div>
          </div>
        </div>

        <!-- Card Grid -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full mt-4"
        >
          <!-- Render Cards Dynamically -->
          <div
            v-for="(card, index) in filteredCards"
            :key="index"
            class="card w-full bg-base-100 image-full shadow-xl mt-2 mb-4"
            @click="saveCardData(card)"
          >
            <figure class="w-full h-full relative">
              <img
                :src="card.image"
                alt="Concert"
                class="w-full h-full object-cover"
              />
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
                <button class="btn glass font-sans text-white custom-shadow">
                  Buy Tickets
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
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { locations } from "@/data/lokasi"; // Import file data.js

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
    image:
      "https://eventguide.id/wp-content/uploads/2024/05/IMG-20230727-WA0112.jpg",
    logo: Synchronize,
    date: "2024-09-24",
    city: "Jakarta",
    province: "DKI Jakarta", // Added province
    location: "Gambir Expo Kemayoran, Jakarta",
    price: 250000,
    description: "Gambir Expo Kemayoran, Jakarta 2, 3, 4 Oktober 2024",
  },
  {
    title: "Pestapora",
    image:
      "https://imgsrv2.voi.id/LmMp5b-2bB_rMXc9vjheoJ2cSIdqsA_mcwg8_kr10uI/auto/1200/675/sm/1/bG9jYWw6Ly8vcHVibGlzaGVycy80MTg1MzAvMjAyNDA5MjIxMTE2LW1haW4uanBlZw.jpg",
    logo: Pestapora,
    date: "2024-09-09",
    city: "Jakarta",
    province: "DKI Jakarta", // Added province
    location: "Gambir Expo dan Hall D2 Jiexpo, Kemayoran",
    price: 200000,
    description:
      "Gambir Expo dan Hall D2 Jiexpo, Kemayoran, Jakarta 20, 21, 22 September 2024",
  },
  {
    title: "We The Fest 2024",
    image:
      "https://blog.metamata.id/wp-content/uploads/2022/09/Foto-1-We-The-Fest-2022.jpg",
    logo: WeTheFest,
    date: "2024-09-11",
    city: "Jakarta",
    province: "DKI Jakarta", // Added province
    location: "Gambir Expo Kemayoran",
    price: 500000,
    description: "Gambir Expo Kemayoran, Jakarta 19–21 Juli 2024",
  },
  {
    title: "Nadin Amizah : Malam Mendengar",
    image:
      "https://asset-2.tstatic.net/style/foto/bank/images/5-postingan-Nadin-Amizah-sebelum-showcase-Malam-Mendengar-ingin-ubah-persona-ibu-perinya.jpg",
    logo: MalamMendengar,
    date: "2024-10-23",
    city: "Jakarta",
    province: "DKI Jakarta", // Added province
    location: "GOR Soemantri Brodjonegoro",
    price: 500000,
    description: "Penampilan Orchestra Kecil Lagu-lagu Nadin Amizah",
  },
  {
    title: "Flower City Fest 2024",
    image:
      "https://static.promediateknologi.id/crop/0x106:1069x770/750x500/webp/photo/p1/100/2024/06/28/Snapinstaapp_448841405_18275475343226596_926220040501372653_n_1024-3146847166.jpg",
    logo: FlowerCity,
    date: "2024-12-15",
    city: "Bandung",
    province: "Jawa Barat", // Added province
    location: "Bandung Creative Hub",
    price: 200000,
    description:
      "A celebration of diverse music genres in the heart of Bandung.",
  },
  {
    title: "Kicfest Bandung 2024",
    image:
      "https://www.infobdg.com/v2/wp-content/uploads/2023/09/IMG_1210.jpeg",
    logo: Kickfest,
    date: "2024-11-03",
    city: "Bandung",
    province: "Jawa Barat", // Added province
    location: "PPI Pussenif Bandung",
    price: 100000,
    description:
      "A festival dedicated to indie music fans and underground artists.",
  },
  {
    title: "Sunset di Kebun Bali 2024",
    image:
      "https://www.konsermusikbali.com/wp-content/uploads/2024/01/Sunset-di-Kebun-2024-Bali-25-26-Maret-2024.jpg",
    logo: SunsetdiKebunBali,
    date: "2024-05-25",
    city: "Tabanan",
    province: "Bali", // Added province
    location: "Kebun Raya Bali",
    price: 100000,
    description:
      "A festival dedicated to indie music fans and underground artists.",
  },
  // Add more cards as needed
];

const selectedProvince = ref("");
const selectedCity = ref("");
const startDate = ref("");
const endDate = ref("");
const searchQuery = ref("");
const showFilterModal = ref(false);

// List of provinces (from your locations data)
const provinces = Object.keys(locations);

// Computed cities based on the selected province
const cities = computed(() => {
  return selectedProvince.value ? locations[selectedProvince.value] : [];
});

// Computed filtered cards based on the filters applied
const filteredCards = computed(() => {
  return cards.filter((card) => {
    const matchesProvince =
      !selectedProvince.value || card.province === selectedProvince.value;
    const matchesCity = !selectedCity.value || card.city === selectedCity.value;
    const matchesDate =
      (!startDate.value || new Date(card.date) >= new Date(startDate.value)) &&
      (!endDate.value || new Date(card.date) <= new Date(endDate.value));
    const matchesSearch =
      !searchQuery.value ||
      card.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesProvince && matchesCity && matchesDate && matchesSearch;
  });
});

const applyFilters = () => {
  showFilterModal.value = false;
};

const clearFilters = () => {
  selectedProvince.value = "";
  selectedCity.value = "";
  startDate.value = "";
  endDate.value = "";
  searchQuery.value = "";
};

const saveCardData = (cardData) => {
  localStorage.setItem("selectedCard", JSON.stringify(cardData));
  router.push("/concerts"); // Navigate to concert detail page
};

const isLongText = (text) => text.length > 20;

const username = ref(localStorage.getItem("username"));
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
  max-width: 100px;
  max-height: 40px;
  height: auto;
}
</style>
