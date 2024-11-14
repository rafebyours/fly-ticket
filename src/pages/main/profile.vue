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
        class="flex flex-col h-[calc(100vh-160px)] w-screen justify-between items-center bg-slate-50"
        key="home-content"
      >
        <div
          class="fixed bg-secondary h-[calc(70vh-160px)] w-full justify-between items-center z-10 rounded-lg"
        ></div>
        <h1 class="text-2xl font-sans2 z-10 mt-3">Halaman Profil</h1>
        <p class="text font-sans z-10 mb-4">Informasi Profil</p>

        <!-- Foto Profil -->
        <div class="avatar">
          <div
            class="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2 justify-center items-center z-20"
          >
            <img
              :src="profileImage || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'"
            />
          </div>
        </div>

        <h1 class="text-2xl font-blackExtended z-10 mb-4">{{ username }}</h1>

        <!-- Tombol Edit Profil -->
        <div
          class="rounded-lg bg-white h-[600px] w-[350px] shadow-lg z-20 p-7 pt-2 min-h-[700px]"
        >
          <!-- Form Fields -->
          <label class="form-control w-600px max-w-xs">
            <div class="label">
              <span class="label-text">Name</span>
            </div>
            <label class="input input-bordered flex items-center gap-2">
              <input
                type="text"
                class="grow"
                placeholder="Name"
                v-model="name"
                :disabled="isDisabled"
                :class="{'bg-gray-200': isDisabled}"
              />
            </label>
          </label>

          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Username</span>
            </div>
            <label class="input input-bordered flex items-center gap-2" >
              <input
                type="text"
                class="grow"
                placeholder="Username"
                v-model="username"
                :disabled="isDisabled"
              />
            </label>
          </label>

          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Email</span>
            </div>
            <label class="input input-bordered flex items-center gap-2">
              <input
                type="text"
                class="grow"
                placeholder="Email"
                v-model="email"
                :disabled="isDisabled"
              />
            </label>
          </label>

          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Password</span>
            </div>
            <label class="input input-bordered flex items-center gap-2">
              <input
                type="password"
                class="grow"
                placeholder="Password"
                v-model="password"
                :disabled="isDisabled"
              />
            </label>
          </label>

          <!-- Input untuk Upload Foto Profil -->
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Upload Foto Profil</span>
            </div>
            <label class="input input-bordered flex items-center gap-2 overflow-hidden text-ellipsis">
              <input
                type="file"
                @change="handleFileUpload"
                :disabled="isDisabled"
              />
            </label>
          </label>

          <div class="flex flex-col justify-end items-center p-4">
            <!-- Edit Profil Button -->
            <button
              @click="editProfile"
              class="btn flex bg-black text-white px-4 py-2 rounded-md hover:bg-black mb-4"
            >
              Edit Profil
            </button>

            <!-- Save Button -->
            <button
              v-if="!isDisabled"
              @click="saveProfile"
              class="btn flex bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mb-4"
            >
              Save Profile
            </button>

            <!-- Logout Button -->
            <button
              @click="logout"
              class="btn flex bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </transition>

    
    <transition name="fade">
    <div v-if="showModal" class="modal modal-open bg-white bg-opacity-100">
      <div class="modal-box bg-white text-center">
        <!-- Ikon Centang -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-green-500 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>

        <!-- Teks -->
        <h3 class="font-bold text-lg">Profil berhasil disimpan!</h3>
        <p class="py-4">Profil Anda berhasil diperbarui.</p>
        
        <!-- Tombol Tutup -->
        <div class="modal-action">
          <button @click="showModal = false" class="btn bg-green-500 text-white hover:bg-green-600">Ok</button>
        </div>
      </div>
    </div>
  </transition>
  </MainLayout>
</template>

<script setup>
import MainLayout from "@/layouts/MainLayout.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isVisible = ref(false);
const isDisabled = ref(true); // Form default disabled
const activeButton = ref("home");
const showModal = ref(false); // State untuk modal

// Data profil
const username = ref("");
const password = ref("");
const email = ref("");
const name = ref("");
const profileImage = ref("");

// Fungsi untuk memuat data akun yang sedang login
const loadProfile = () => {
  const currentUsername = localStorage.getItem("currentUsername"); // Asumsikan username pengguna yang sedang login disimpan di localStorage
  const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");

  // Cari akun yang cocok dengan username yang sedang login
  const account = accounts.find(acc => acc.username === currentUsername);
  if (account) {
    username.value = account.username;
    password.value = account.password;
    email.value = account.email;
    name.value = account.name;
    profileImage.value = account.profileImage || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
  }
};

onMounted(() => {
  isVisible.value = true;

  const loggedInUsername = localStorage.getItem("loggedInUser");
  const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
  const currentUser = accounts.find((account) => account.username === loggedInUsername);

  if (currentUser) {
    username.value = currentUser.username;
    password.value = currentUser.password;
    email.value = currentUser.email;
    name.value = currentUser.name;
    profileImage.value = currentUser.profileImage || ""; // Pastikan gambar profil ada
  }
});


// Fungsi untuk mengubah status form menjadi editable
const editProfile = () => {
  isDisabled.value = !isDisabled.value;
};

// Fungsi untuk menangani upload foto
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      profileImage.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

// Fungsi untuk menyimpan profil setelah edit
const saveProfile = () => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");

  // Update akun yang sesuai dengan username saat ini
  const accountIndex = accounts.findIndex(acc => acc.username === loggedInUser);
if (accountIndex !== -1) {
  // Update account details
  accounts[accountIndex] = {
    ...accounts[accountIndex],
    username: username.value,
    password: password.value,
    email: email.value,
    name: name.value,
    profileImage: profileImage.value
  };

  // Save updated accounts array to localStorage
  localStorage.setItem("accounts", JSON.stringify(accounts));

  // Update loggedInUser in localStorage with just the username
  localStorage.setItem("loggedInUser", username.value);
}


  // Tampilkan modal dan atur timer untuk menutupnya
  showModal.value = true;
  setTimeout(() => {
    showModal.value = false;
  }, 3000); // Modal akan tertutup setelah 3 detik

  isDisabled.value = true; // Disable form setelah menyimpan
};

// Fungsi logout untuk menjaga data accounts tetap ada
const logout = () => {
  activeButton.value = "home";
  localStorage.setItem("activeButton", "home");

  const accountsData = localStorage.getItem("accounts");
  const transactionsData = localStorage.getItem("transactions");

  localStorage.clear();

  if (accountsData) {
    localStorage.setItem("accounts", accountsData);
  }
  if (transactionsData) {
    localStorage.setItem("transactions", transactionsData);
  }

  router.push("/index");
};

// Fungsi animasi transisi
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


<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.modal-box {
  background-color: #ffffff !important; /* Pastikan modal memiliki latar belakang putih */
}

.modal-action .btn {
  background-color: #22c55e !important; /* Warna hijau untuk tombol */
  color: #ffffff !important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>