<template>
    <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-600/30">
                <span class="text-white font-black text-4xl">K</span>
            </div>
            <h1 class="text-2xl font-black text-slate-100 tracking-tight mb-2">KARNETIK</h1>
            <p class="text-slate-500 text-sm mb-8">Bienvenue {{ $page.props.auth.user.name }} 👋</p>
            <div class="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2">
                <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span class="text-green-400 font-mono text-sm">Authentification opérationnelle ✓</span>
            </div>
        </div>
    </div>
</template>