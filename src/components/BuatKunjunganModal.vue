<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  cariPasien: { type: Function, required: true },
  buat: { type: Function, required: true },
})

const emit = defineEmits(['close'])

const noRm = ref('')
const hasil = ref(null)
const notFound = ref(false)
const searching = ref(false)
const loading = ref(false)
const error = ref('')

let debounceTimer = null

watch(noRm, (v) => {
  clearTimeout(debounceTimer)
  const rm = v.trim().toUpperCase()

  hasil.value = null
  notFound.value = false
  error.value = ''

  if (!/^RM\d{1,}$/.test(rm)) return

  debounceTimer = setTimeout(cari, 400)
})

async function cari() {
  const rm = noRm.value.trim().toUpperCase()
  if (!/^RM\d{1,}$/.test(rm)) return

  searching.value = true
  try {
    hasil.value = await props.cariPasien(rm)
    notFound.value = !hasil.value
  } catch (e) {
    notFound.value = e.status === 404
    if (!notFound.value) error.value = e.message
  } finally {
    searching.value = false
  }
}

async function buatKunjungan() {
  if (!hasil.value) return
  error.value = ''
  loading.value = true
  try {
    await props.buat(hasil.value)
    emit('close')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center p-4" @click.self="emit('close')">
    <div
      class="relative w-full max-w-md rounded-2xl border border-neutral-700 bg-white p-9 shadow-[4px_4px_10px_rgba(0,0,0,0.35)]"
    >
      <button
        class="absolute top-3 right-4 text-lg leading-none text-neutral-800 hover:text-black"
        aria-label="Tutup"
        @click="emit('close')"
      >
        ✕
      </button>

      <h2 class="mb-7 text-center text-lg font-bold tracking-wide">BUAT KUNJUNGAN</h2>

      <section class="flex flex-col gap-2">
        <label class="text-sm font-bold">Cari Pasien</label>
        <input
          v-model="noRm"
          type="text"
          placeholder="No Rekam Medik (contoh: RM0001)"
          class="rounded border border-neutral-700 px-3 py-2 text-xs uppercase outline-none placeholder-neutral-400 focus:border-medisin-blue"
        />
        <p v-if="notFound" class="text-xs text-red-600">
          Pasien dengan No Rekam Medik tersebut tidak ditemukan.
        </p>
      </section>

      <hr class="my-5 border-neutral-700" />

      <section class="flex flex-col gap-2.5">
        <label class="text-sm font-bold">Data Pasien</label>

        <div
          v-if="searching"
          class="rounded-lg bg-neutral-50 px-4 py-4 text-xs text-neutral-400"
        >
          Mencari data pasien...
        </div>

        <div
          v-else-if="hasil"
          class="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs"
        >
          <dl class="grid grid-cols-[90px_1fr] gap-x-3 gap-y-2">
            <dt class="font-semibold text-neutral-500">Nama</dt>
            <dd class="text-neutral-800">{{ hasil.nama_pasien }}</dd>
            <dt class="font-semibold text-neutral-500">NIK</dt>
            <dd class="text-neutral-800">{{ hasil.nik }}</dd>
            <dt class="font-semibold text-neutral-500">Alamat</dt>
            <dd class="text-neutral-800">{{ hasil.alamat }}</dd>
            <dt class="font-semibold text-neutral-500">Kunjungan</dt>
            <dd class="text-neutral-800">{{ hasil.jml_kunjungan }} kali</dd>
          </dl>
        </div>

        <div
          v-else
          class="rounded-lg bg-neutral-50 px-4 py-4 text-xs text-neutral-400"
        >
          Data pasien akan muncul di sini setelah No Rekam Medik ditemukan.
        </div>
      </section>

      <p v-if="error" class="mt-3 text-xs text-red-600">{{ error }}</p>

      <div class="mt-6 flex justify-center">
        <button
          :disabled="!hasil || loading"
          class="w-3/5 rounded-full bg-medisin-blue py-2 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-medisin-blue-dark disabled:opacity-60"
          @click="buatKunjungan"
        >
          {{ loading ? 'MEMPROSES...' : 'BUAT KUNJUNGAN' }}
        </button>
      </div>
    </div>
  </div>
</template>
