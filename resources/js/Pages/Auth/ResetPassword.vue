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
                <h2 class="text-lg font-bold text-slate-100 mb-2">Nouveau mot de passe</h2>
                <p class="text-slate-500 text-sm mb-6">
                    Choisissez un nouveau mot de passe pour votre compte.
                </p>

                <form @submit.prevent="submit" class="space-y-4">

                    <!-- Email (caché) -->
                    <input type="hidden" v-model="form.email" />
                    <input type="hidden" v-model="form.token" />

                    <!-- Mot de passe -->
                    <div>
                        <label class="block text-sm font-medium text-slate-400 mb-1.5">
                            Nouveau mot de passe
                        </label>
                        <input
                            v-model="form.password"
                            type="password"
                            autocomplete="new-password"
                            required
                            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                            :class="{ 'border-red-500': form.errors.password }"
                            placeholder="••••••••"
                        />
                        <p v-if="form.errors.password" class="text-red-400 text-xs mt-1">{{ form.errors.password }}</p>
                    </div>

                    <!-- Confirmation -->
                    <div>
                        <label class="block text-sm font-medium text-slate-400 mb-1.5">
                            Confirmer le mot de passe
                        </label>
                        <input
                            v-model="form.password_confirmation"
                            type="password"
                            autocomplete="new-password"
                            required
                            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                            placeholder="••••••••"
                        />
                    </div>

                    <!-- Bouton -->
                    <button
                        type="submit"
                        :disabled="form.processing"
                        class="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-4 py-3 text-sm transition shadow-lg shadow-blue-600/20"
                    >
                        {{ form.processing ? 'Réinitialisation...' : 'Réinitialiser le mot de passe' }}
                    </button>

                </form>
            </div>

        </div>
    </div>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3'

const props = defineProps({
    token: String,
    email: String,
})

const form = useForm({
    token: props.token,
    email: props.email,
    password: '',
    password_confirmation: '',
})

const submit = () => {
    form.post('/reset-password', {
        onFinish: () => form.reset('password', 'password_confirmation'),
    })
}
</script>