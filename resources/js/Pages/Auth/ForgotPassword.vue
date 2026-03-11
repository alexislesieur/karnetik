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
                <h2 class="text-lg font-bold text-slate-100 mb-2">Mot de passe oublié</h2>
                <p class="text-slate-500 text-sm mb-6">
                    Renseignez votre email et nous vous enverrons un lien de réinitialisation.
                </p>

                <!-- Message de succès -->
                <div v-if="props.status" class="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p class="text-green-400 text-sm">{{ props.status }}</p>
                </div>

                <form @submit.prevent="submit" class="space-y-4">

                    <!-- Email -->
                    <div>
                        <label class="block text-sm font-medium text-slate-400 mb-1.5">
                            Adresse email
                        </label>
                        <input
                            v-model="form.email"
                            type="email"
                            autocomplete="email"
                            required
                            class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                            :class="{ 'border-red-500': form.errors.email }"
                            placeholder="vous@exemple.fr"
                        />
                        <p v-if="form.errors.email" class="text-red-400 text-xs mt-1">{{ form.errors.email }}</p>
                    </div>

                    <!-- Bouton -->
                    <button
                        type="submit"
                        :disabled="form.processing"
                        class="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-4 py-3 text-sm transition shadow-lg shadow-blue-600/20"
                    >
                        {{ form.processing ? 'Envoi...' : 'Envoyer le lien' }}
                    </button>

                </form>
            </div>

            <!-- Retour connexion -->
            <p class="text-center text-slate-500 text-sm mt-6">
                <Link href="/login" class="text-blue-400 hover:text-blue-300 transition font-medium">
                    ← Retour à la connexion
                </Link>
            </p>

        </div>
    </div>
</template>

<script setup>
import { Link, useForm } from '@inertiajs/vue3'

const props = defineProps({
    status: String,
})

const form = useForm({
    email: '',
})

const submit = () => {
    form.post('/forgot-password')
}
</script>