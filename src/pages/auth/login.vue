<script setup>
import { ref, provide, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const password = ref("");
const isUsernameEmpty = ref(false);
const isPasswordEmpty = ref(false);
const isInvalidCredentials = ref(false);
const snackbarVisible = ref(false);
const snackbarMessage = ref("");
const snackbarColor = ref(""); // Warna snackbar

// Kontrol visibilitas untuk memicu transisi
const isVisible = ref(false);
onMounted(() => {
  isVisible.value = true;
});

// Provide username dan password untuk komponen anak
provide("username", username);
provide("password", password);

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

let showPassword = ref(false);

// Fungsi untuk menampilkan snackbar dengan pesan dan warna
const showSnackbar = (message, color) => {
  snackbarMessage.value = message;
  snackbarColor.value = color; // Set warna snackbar
  snackbarVisible.value = true;
  setTimeout(() => {
    snackbarVisible.value = false;
  }, 3000); // Sembunyikan snackbar setelah 3 detik
};

// Fungsi login untuk validasi terhadap localStorage
const login = () => {
  // Reset state validasi
  isUsernameEmpty.value = !username.value;
  isPasswordEmpty.value = !password.value;

  // Reset flag kredensial tidak valid
  isInvalidCredentials.value = false;

  if (!isUsernameEmpty.value && !isPasswordEmpty.value) {
    // Ambil data akun yang disimpan di localStorage dan parsing sebagai JSON array
    const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

    // Debugging: log nilai yang dimasukkan
    console.log("Username yang dimasukkan:", username.value);
    console.log("Password yang dimasukkan:", password.value);
    console.log("Daftar akun yang disimpan:", accounts);

    // Cari akun yang cocok dalam array accounts
    const account = accounts.find(
      (acc) => acc.username === username.value && acc.password === password.value
    );

    // Cek apakah akun ditemukan
    if (account) {
      // Simpan username yang berhasil login ke localStorage
      localStorage.setItem("loggedInUser", account.username);

      // Login berhasil, arahkan ke halaman home
      showSnackbar("Login berhasil!", "green"); // Gunakan warna hijau untuk pesan sukses
      setTimeout(() => {
        router.push("/home");
      }, 2000); // Delay navigasi selama 2 detik
    } else {
      // Jika tidak cocok, tampilkan pesan kesalahan (snackbar)
      isInvalidCredentials.value = true;
      showSnackbar("Username atau password salah", "red"); // Gunakan warna merah untuk pesan kesalahan
    }
  }
};


</script>

<template>
  <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
    <main v-if="isVisible" class="p-10 w-full flex justify-center items-center h-screen">
      <div class="w-full max-w-xs">
        <div class="flex items-center mb-5">
          <button @click="$router.push('/')" class="btn flex items-center mr-3">
            <i class="fas fa-arrow-left"></i>
          </button>
          <h1 class="text-2xl font-sans2">Login</h1>
        </div>

        <label class="form-control w-full max-w-xs mt-3">
          <div class="label">
            <span class="label-text">Username</span>
          </div>
          <label :class="[ 'input input-bordered flex items-center gap-2', isUsernameEmpty || isInvalidCredentials ? 'border-red-500' : '' ]">
            <i class="fas fa-user-circle opacity-70"></i>
            <input v-model="username" type="text" class="grow" placeholder="Username" required />
          </label>
          <span v-if="isUsernameEmpty" class="text-red-500 text-sm mt-1">Username is required</span>
          <span v-if="isInvalidCredentials" class="text-red-500 text-sm mt-1">Invalid username or password</span>
        </label>

        <label class="form-control w-full max-w-xs mt-3">
          <div class="label">
            <span class="label-text">Password</span>
          </div>
          <label :class="[ 'input input-bordered flex items-center gap-2', isPasswordEmpty || isInvalidCredentials ? 'border-red-500' : '' ]">
            <i class="fas fa-lock opacity-70"></i>
            <input v-model="password" :type="showPassword ? 'text' : 'password'" class="grow" placeholder="Password" required />
          </label>
          <span v-if="isPasswordEmpty" class="text-red-500 text-sm mt-1">Password is required</span>
          <span v-if="isInvalidCredentials" class="text-red-500 text-sm mt-1">Invalid username or password</span>

          <div class="flex items-center mt-2">
            <input type="checkbox" id="showPassword" class="form-checkbox mr-2 checkbox border-black [--chkbg:black] [--chkfg:#B0FFA3] checked:border-indigo-800" v-model="showPassword" />
            <label for="showPassword" class="label-text cursor-pointer">Show Password</label>
          </div>
        </label>

        <div class="text-sm mt-3">
          Don't have an account? 
          <a class="link" @click="$router.push('/register')">Register</a>
        </div>
        <div class="flex justify-end mt-5">
          <button class="btn bg-secondary" @click="login">Login</button>
        </div>

        <!-- Snackbar untuk pesan kesalahan -->
        <div v-if="snackbarVisible" :style="{ backgroundColor: snackbarColor }" class="snackbar">
          <p>{{ snackbarMessage }}</p>
        </div>
      </div>
    </main>
  </transition>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
.border-red-500 {
  border-color: #f56565;
}
.text-red-500 {
  color: #f56565;
}

/* Snackbar styles */
.snackbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  padding: 12px 30px;
  border-radius: 5px;
  font-size: 14px;
}
</style>
