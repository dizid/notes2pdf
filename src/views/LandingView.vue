<template>
  <div class="min-h-screen bg-white">
    <!-- Nav -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="text-xl font-semibold tracking-tight text-gray-900">sizzle</div>
        <div class="flex items-center gap-4">
          <router-link to="/app" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition">
            Log in
          </router-link>
          <router-link
            to="/app"
            class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            Try Free
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-32 pb-20 px-6">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-5xl md:text-6xl font-normal text-gray-900 leading-tight mb-6">
          Turn content into stunning pages
          <span class="text-gray-400">in 60 seconds</span>
        </h1>
        <p class="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Paste your website URL, let AI extract your brand, and get a beautiful shareable page instantly.
        </p>

        <!-- CTA -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <router-link
            to="/app"
            class="bg-gray-900 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition shadow-lg shadow-gray-900/20"
          >
            Start Creating — Free
          </router-link>
          <span class="text-gray-500 text-sm">No account required</span>
        </div>

        <!-- 3-step flow -->
        <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 font-medium">1</span>
            <span>Paste URL or content</span>
          </div>
          <svg class="w-4 h-4 text-gray-300 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 font-medium">2</span>
            <span>AI designs it</span>
          </div>
          <svg class="w-4 h-4 text-gray-300 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 font-medium">3</span>
            <span>Share instantly</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo placeholder -->
    <section class="py-12 px-6 bg-gray-50">
      <div class="max-w-5xl mx-auto">
        <div class="bg-white rounded-2xl shadow-2xl shadow-gray-900/10 overflow-hidden border border-gray-200">
          <div class="bg-gray-100 px-4 py-3 flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-red-400"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div class="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div class="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div class="text-center text-gray-400">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm font-medium">Demo video coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-20 px-6">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-normal text-center text-gray-900 mb-16">
          What makes sizzle different
        </h2>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">AI Brand Extraction</h3>
            <p class="text-gray-600 text-sm">
              Paste any website URL. We extract colors, fonts, and mood automatically.
            </p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Beautiful Templates</h3>
            <p class="text-gray-600 text-sm">
              Curated designs that make your content look professional instantly.
            </p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Instant Sharing</h3>
            <p class="text-gray-600 text-sm">
              One click to get a shareable link. No signup, no friction.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing preview -->
    <section class="py-20 px-6 bg-gray-50">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl font-normal text-gray-900 mb-4">Simple pricing</h2>
        <p class="text-gray-600 mb-12">Start free, upgrade when you need more.</p>

        <div class="grid md:grid-cols-2 gap-6">
          <!-- Free -->
          <div class="bg-white rounded-2xl p-8 border border-gray-200 text-left">
            <div class="text-sm font-medium text-gray-500 mb-2">Free</div>
            <div class="text-4xl font-semibold text-gray-900 mb-4">$0</div>
            <ul class="space-y-3 text-sm text-gray-600 mb-8">
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                3 shares per month
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                All templates
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                AI brand extraction
              </li>
            </ul>
            <router-link
              to="/app"
              class="block w-full text-center py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Get Started
            </router-link>
          </div>

          <!-- Pro -->
          <div class="bg-gray-900 rounded-2xl p-8 text-left relative overflow-hidden">
            <div class="absolute top-4 right-4 bg-amber-400 text-amber-900 text-xs font-semibold px-2 py-1 rounded">
              Popular
            </div>
            <div class="text-sm font-medium text-gray-400 mb-2">Pro</div>
            <div class="text-4xl font-semibold text-white mb-4">$9<span class="text-lg text-gray-400">/mo</span></div>
            <ul class="space-y-3 text-sm text-gray-300 mb-8">
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Unlimited shares
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Priority support
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                No watermark
              </li>
            </ul>
            <button
              class="block w-full text-center py-3 rounded-lg bg-white text-gray-900 font-medium hover:bg-gray-100 transition"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-20 px-6">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl font-normal text-gray-900 mb-4">
          Ready to create something beautiful?
        </h2>
        <p class="text-gray-600 mb-8">
          Join creators who are sharing stunning pages in seconds.
        </p>
        <router-link
          to="/app"
          class="inline-block bg-gray-900 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition shadow-lg shadow-gray-900/20"
        >
          Start Creating — Free
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 px-6 border-t border-gray-100">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="text-sm text-gray-500">
          Made with care by <a href="https://dizid.com" class="text-gray-700 hover:text-gray-900">dizid.com</a>
        </div>
        <div class="flex items-center gap-6 text-sm text-gray-500">
          <router-link to="/app" class="hover:text-gray-900">App</router-link>
          <router-link to="/privacy" class="hover:text-gray-900">Privacy</router-link>
          <router-link to="/terms" class="hover:text-gray-900">Terms</router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Landing page - no logic needed for now
</script>
