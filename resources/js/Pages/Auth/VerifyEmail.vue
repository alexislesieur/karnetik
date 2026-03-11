<template>
    <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div class="w-full max-w-md">

            <!-- Logo -->
            <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-600/30">
                    <span class="text-white font-black text-4xl">K</span>
                </div>
                <h1 class="text-2xl font-black text-slate-100 tracking-tight">KARNETIK</h1>
                <p class="text-slate-500 text-sm mt-1">Votre carnet d'entretien digital</p>
            </div>

            <!-- Carte -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-8">

                <!-- Icône -->
                <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-600/20 mb-4">
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>

                <h2 class="text-lg font-bold text-slate-100 mb-2">Vérifiez votre email</h2>
                <p class="text-slate-500 text-sm mb-6">
                    Un lien de vérification a été envoyé à votre adresse email. Cliquez sur ce lien pour activer votre compte.
                </p>

                <!-- Message de succès -->
                <div v-if="props.status === 'verification-link-sent'" class="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p class="text-green-400 text-sm">Un nouveau lien de vérification a été envoyé.</p>
                </div>

                <div class="flex flex-col gap-3">

                    <!-- Renvoyer -->
                    <form @submit.prevent="resend">
                        <button
                            type="submit"
                            :disabled="resendForm.processing"
                            class="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-4 py-3 text-sm transition shadow-lg shadow-blue-600/20"
                        >
                            {{ resendForm.processing ? 'Envoi...' : 'Renvoyer le lien' }}
                        </button>
                    </form>

                    <!-- Déconnexion -->
                    <form @submit.prevent="logout">
                        <button
                            type="submit"
                            class="w-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-300 font-medium rounded-xl px-4 py-3 text-sm transition"
                        >
                            Se déconnecter
                        </button>
                    </form>

                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3'

const props = defineProps({
    status: String,
})

const resendForm = useForm({})
const resend = () => {
    resendForm.post('/email/verification-notification')
}

const logoutForm = useForm({})
const logout = () => {
    logoutForm.post('/logout')
}
</script>