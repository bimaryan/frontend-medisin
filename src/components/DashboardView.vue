<script setup>
import { ref } from 'vue'
import logo from '../assets/logo.png'
import TambahPasienModal from './TambahPasienModal.vue'
import BuatKunjunganModal from './BuatKunjunganModal.vue'

defineProps({
  pasien: { type: Array, required: true },
  user: { type: Object, default: null },
  error: { type: String, default: '' },
  cariPasien: { type: Function, required: true },
  tambahPasien: { type: Function, required: true },
  buatKunjungan: { type: Function, required: true },
})

const emit = defineEmits(['dismiss-error', 'logout'])

const showTambah = ref(false)
const showKunjungan = ref(false)
</script>

<template>
  <div class="flex min-h-screen justify-center bg-medisin-blue p-12">
    <div class="w-full max-w-5xl rounded-[28px] bg-white p-10 shadow-2xl">
      <img :src="logo" alt="Medisin" class="mx-auto mb-10 w-48" />

      <div class="mb-3 flex items-center gap-4">
        <button
          class="rounded-full bg-medisin-blue px-6 py-2.5 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-medisin-blue-dark"
          @click="showTambah = true"
        >
          TAMBAH PASIEN
        </button>
        <button
          class="rounded-full bg-medisin-green px-6 py-2.5 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-medisin-green-dark"
          @click="showKunjungan = true"
        >
          BUAT KUNJUNGAN
        </button>
        <button
          class="ml-auto text-xs font-medium text-neutral-400 underline hover:text-neutral-600"
          @click="emit('logout')"
        >
          Logout
        </button>
      </div>

      <div
        v-if="error"
        class="mb-3 flex items-start justify-between rounded-lg bg-red-50 px-4 py-2.5 text-xs text-red-700"
      >
        <span>{{ error }}</span>
        <button class="ml-4 font-bold" @click="emit('dismiss-error')">✕</button>
      </div>

      <table class="w-full border-collapse text-center text-[13px]">
        <thead>
          <tr>
            <th class="border border-neutral-400 bg-medisin-gray px-2 py-1.5 font-semibold">NO</th>
            <th class="border border-neutral-400 bg-medisin-gray px-2 py-1.5 font-semibold">NO REKAM MEDIK</th>
            <th class="border border-neutral-400 bg-medisin-gray px-2 py-1.5 font-semibold">NAMA PASIEN</th>
            <th class="border border-neutral-400 bg-medisin-gray px-2 py-1.5 font-semibold">NIK</th>
            <th class="border border-neutral-400 bg-medisin-gray px-2 py-1.5 font-semibold">ALAMAT</th>
            <th class="border border-neutral-400 bg-medisin-gray px-2 py-1.5 font-semibold">JML KUNJUNGAN</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, i) in pasien" :key="p.id ?? p.no_rekam_medik">
            <td class="border border-neutral-400 px-2 py-1.5">{{ i + 1 }}</td>
            <td class="border border-neutral-400 px-2 py-1.5">{{ p.no_rekam_medik }}</td>
            <td class="border border-neutral-400 px-2 py-1.5">{{ p.nama_pasien }}</td>
            <td class="border border-neutral-400 px-2 py-1.5">{{ p.nik }}</td>
            <td class="border border-neutral-400 px-2 py-1.5">{{ p.alamat }}</td>
            <td class="border border-neutral-400 px-2 py-1.5">{{ p.jml_kunjungan }}</td>
          </tr>
          <tr v-if="pasien.length === 0">
            <td colspan="6" class="border border-neutral-400 px-2 py-1.5">
              Belum ada data pasien
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <TambahPasienModal
      v-if="showTambah"
      :simpan="tambahPasien"
      @close="showTambah = false"
    />

    <BuatKunjunganModal
      v-if="showKunjungan"
      :cari-pasien="cariPasien"
      :buat="buatKunjungan"
      @close="showKunjungan = false"
    />
  </div>
</template>
