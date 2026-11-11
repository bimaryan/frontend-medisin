<script setup>
import { ref, onMounted, watch } from 'vue'
import logo from '../assets/logo.png'
import { api } from '../services/api.js'
import { encryptPayload } from '../services/security.js'

const props = defineProps({
  error: { type: String, default: '' },
})

const emit = defineEmits(['login'])

const username = ref('')
const password = ref('')
const captchaCode = ref('')
const captcha = ref(null)
const captchaLoading = ref(false)

async function loadCaptcha() {
  captchaLoading.value = true
  try {
    const res = await api.captcha()
    captcha.value = res.data
    captchaCode.value = ''
  } finally {
    captchaLoading.value = false
  }
}

onMounted(loadCaptcha)
watch(() => props.error, (v) => {
  if (v) loadCaptcha()
})

async function submit() {
  emit('login', {
    user_name: await encryptPayload(username.value),
    password: await encryptPayload(password.value),
    captcha_code: await encryptPayload(captchaCode.value),
    tokenCaptcha: captcha.value?.tokenCaptcha ?? '',
  })
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-medisin-blue p-4">
    <form
      class="flex w-full max-w-sm flex-col gap-4 rounded-[28px] bg-white p-10 shadow-2xl"
      @submit.prevent="submit"
    >
      <img :src="logo" alt="Medisin" class="mx-auto mb-6 w-36" />
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="rounded-full bg-medisin-gray px-4 py-2.5 text-sm text-neutral-600 placeholder-neutral-500 outline-none"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="rounded-full bg-medisin-gray px-4 py-2.5 text-sm text-neutral-600 placeholder-neutral-500 outline-none"
      />

      <div>
        <div class="flex items-center gap-2">
          <img
            v-if="captcha?.captcha_image"
            :src="captcha.captcha_image"
            alt="Captcha"
            class="h-12 flex-1 rounded object-cover"
            :class="{ 'opacity-40': captchaLoading }"
          />
          <div
            v-else
            class="flex h-12 flex-1 items-center justify-center rounded bg-neutral-100 text-xs text-neutral-400"
          >
            {{ captchaLoading ? 'Memuat...' : 'Captcha tidak tersedia' }}
          </div>
          <button
            type="button"
            title="Refresh captcha"
            class="rounded px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
            @click="loadCaptcha"
          >
            ⟳
          </button>
        </div>
        <input
          v-model="captchaCode"
          type="text"
          placeholder="Masukkan captcha"
          class="mt-2 w-full rounded border border-neutral-700 px-3 py-2 text-xs uppercase outline-none placeholder-neutral-500"
        />
      </div>

      <p v-if="error" class="text-center text-xs font-medium text-red-600">
        {{ error }}
      </p>
      <button
        type="submit"
        class="mx-auto mt-2 w-3/4 rounded-full bg-medisin-blue py-2.5 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-medisin-blue-dark"
      >
        LOGIN
      </button>
    </form>
  </div>
</template>
