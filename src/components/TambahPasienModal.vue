<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  simpan: { type: Function, required: true },
})

const emit = defineEmits(['close'])

const nama = ref('')
const nik = ref('')
const alamat = ref('')
const loading = ref(false)
const error = ref('')
const fieldErrors = ref({})

const touched = ref(false)

const namaError = computed(() =>
  touched.value && nama.value.trim().length > 0 && nama.value.trim().length < 2
    ? 'Nama pasien minimal 2 karakter.'
    : ''
)

const nikError = computed(() => {
  if (!touched.value) return ''
  const v = nik.value.trim()
  if (v === '') return ''
  if (!/^[0-9]+$/.test(v)) return 'NIK harus berupa angka.'
  if (v.length < 10 || v.length > 20) return 'NIK harus 10-20 digit angka.'
  return ''
})

const alamatError = computed(() =>
  touched.value && alamat.value.trim().length > 0 && alamat.value.trim().length < 3
    ? 'Alamat minimal 3 karakter.'
    : ''
)

const isValid = computed(
  () =>
    nama.value.trim().length >= 2 &&
    /^[0-9]{10,20}$/.test(nik.value.trim()) &&
    alamat.value.trim().length >= 3
)

async function submit() {
  touched.value = true
  error.value = ''
  fieldErrors.value = {}

  if (!isValid.value) {
    error.value = 'Periksa kembali isian yang belum valid.'
    return
  }

  loading.value = true
  try {
    await props.simpan({
      nama_pasien: nama.value.trim(),
      nik: nik.value.trim(),
      alamat: alamat.value.trim(),
    })
    emit('close')
  } catch (e) {
    fieldErrors.value = e.errors ?? {}
    error.value = e.errors
      ? Object.values(e.errors).flat().join(' ')
      : e.message
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

      <h2 class="mb-2 text-center text-lg font-bold tracking-wide">TAMBAH PASIEN</h2>
      <p class="mb-6 text-center text-[11px] text-neutral-400">
        No. Rekam Medik dibuat otomatis (RM0001, RM0002, ...)
      </p>

      <form class="flex flex-col gap-3.5" @submit.prevent="submit">
        <div>
          <label class="mb-1 block text-xs font-semibold text-neutral-700">Nama Pasien</label>
          <input
            v-model="nama"
            type="text"
            placeholder="Nama Pasien"
            class="w-full rounded border border-neutral-700 px-3 py-2 text-xs outline-none placeholder-neutral-400 focus:border-medisin-blue"
          />
          <p v-if="namaError" class="mt-1 text-[11px] text-red-600">{{ namaError }}</p>
          <p v-else-if="fieldErrors.nama_pasien" class="mt-1 text-[11px] text-red-600">
            {{ fieldErrors.nama_pasien[0] }}
          </p>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-neutral-700">NIK</label>
          <input
            v-model="nik"
            type="text"
            inputmode="numeric"
            placeholder="NIK (10-20 digit angka)"
            class="w-full rounded border border-neutral-700 px-3 py-2 text-xs outline-none placeholder-neutral-400 focus:border-medisin-blue"
          />
          <p v-if="nikError" class="mt-1 text-[11px] text-red-600">{{ nikError }}</p>
          <p v-else-if="fieldErrors.nik" class="mt-1 text-[11px] text-red-600">
            {{ fieldErrors.nik[0] }}
          </p>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-neutral-700">Alamat</label>
          <textarea
            v-model="alamat"
            placeholder="Alamat"
            class="h-24 w-full resize-none rounded border border-neutral-700 px-3 py-2 text-xs outline-none placeholder-neutral-400 focus:border-medisin-blue"
          ></textarea>
          <p v-if="alamatError" class="mt-1 text-[11px] text-red-600">{{ alamatError }}</p>
          <p v-else-if="fieldErrors.alamat" class="mt-1 text-[11px] text-red-600">
            {{ fieldErrors.alamat[0] }}
          </p>
        </div>

        <p v-if="error" class="text-xs text-red-600">{{ error }}</p>

        <div class="mt-2 flex justify-center">
          <button
            type="submit"
            :disabled="loading || !isValid"
            class="w-3/5 rounded-full bg-medisin-blue py-2 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-medisin-blue-dark disabled:opacity-60"
          >
            {{ loading ? 'MENYIMPAN...' : 'SIMPAN' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
