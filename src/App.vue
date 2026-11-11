<script setup>
import { ref, onMounted } from 'vue'
import LoginView from './components/LoginView.vue'
import DashboardView from './components/DashboardView.vue'
import { api } from './services/api.js'

const TOKEN_KEY = 'medisin_token'

const token = ref(localStorage.getItem(TOKEN_KEY) ?? '')
const user = ref(null)
const pasien = ref([])
const error = ref('')

onMounted(async () => {
  if (!token.value) return
  try {
    const res = await api.me(token.value)
    user.value = res.data
    await loadPasien()
  } catch {
    clearSession()
  }
})

function clearSession() {
  token.value = ''
  user.value = null
  pasien.value = []
  localStorage.removeItem(TOKEN_KEY)
}

async function loadPasien() {
  const res = await api.getPasien(token.value)
  pasien.value = res.data
}

async function login(payload) {
  error.value = ''
  try {
    const res = await api.login(payload)
    token.value = res.data.token
    user.value = res.data.user
    localStorage.setItem(TOKEN_KEY, token.value)
    await loadPasien()
  } catch (e) {
    error.value = e.message
  }
}

async function logout() {
  try {
    await api.logout(token.value)
  } finally {
    clearSession()
  }
}

async function tambahPasien(data) {
  error.value = ''
  try {
    const res = await api.createPasien(token.value, data)
    pasien.value.push(res.data)
  } catch (e) {
    error.value = e.message
    throw e
  }
}

async function cariPasien(noRm) {
  const res = await api.searchPasien(token.value, noRm)
  return res.data
}

async function buatKunjungan(p) {
  error.value = ''
  try {
    await api.createKunjungan(token.value, { no_rekam_medik: p.no_rekam_medik })
    await loadPasien()
  } catch (e) {
    error.value = e.message
    throw e
  }
}
</script>

<template>
  <LoginView v-if="!token" :error="error" @login="login" />
  <DashboardView
    v-else
    :pasien="pasien"
    :user="user"
    :error="error"
    :cari-pasien="cariPasien"
    :tambah-pasien="tambahPasien"
    :buat-kunjungan="buatKunjungan"
    @dismiss-error="error = ''"
    @logout="logout"
  />
</template>
