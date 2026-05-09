import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="min-h-screen bg-white">
      <section class="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="text-center">
            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight">
              About <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PaisaAds</span>
            </h1>
            <div class="mt-8 max-w-3xl mx-auto">
              <p class="text-xl sm:text-2xl text-gray-600 leading-relaxed font-light">Your trusted platform for buying, selling, and discovering amazing deals.</p>
              <p class="mt-4 text-lg text-gray-500 leading-relaxed">We connect communities through classified advertisements, making commerce simple and accessible for everyone.</p>
            </div>
          </div>
        </div>
      </section>
      <section class="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-4">Our Purpose</h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">Driven by a clear mission and vision to transform how people connect and trade</p>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div class="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8">
              <div class="flex items-center gap-4 mb-4"><div class="p-3 bg-blue-600 rounded-xl shadow-lg"><svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></div><h3 class="text-2xl font-bold text-gray-900">Our Mission</h3></div>
              <p class="text-gray-700 leading-relaxed text-lg">To create the most user-friendly and secure marketplace where individuals and businesses can easily connect, trade, and grow their communities through classified advertisements.</p>
            </div>
            <div class="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8">
              <div class="flex items-center gap-4 mb-4"><div class="p-3 bg-green-600 rounded-xl shadow-lg"><svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></div><h3 class="text-2xl font-bold text-gray-900">Our Vision</h3></div>
              <p class="text-gray-700 leading-relaxed text-lg">To become the leading classified ads platform that empowers millions of users to discover opportunities, build connections, and achieve their buying and selling goals with ease.</p>
            </div>
          </div>
        </div>
      </section>
      <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900">Our Core Values</h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto mt-4">The principles that guide everything we do and shape our platform's future</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white rounded-xl p-8 text-center">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6"><svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></div>
              <h3 class="text-xl font-bold text-gray-900 mb-4">Trust & Security</h3>
              <p class="text-gray-600 leading-relaxed">We prioritize user safety with robust verification systems and secure transactions, ensuring peace of mind for every interaction.</p>
            </div>
            <div class="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white rounded-xl p-8 text-center">
              <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6"><svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg></div>
              <h3 class="text-xl font-bold text-gray-900 mb-4">Community First</h3>
              <p class="text-gray-600 leading-relaxed">Building strong local communities through meaningful connections and interactions that benefit everyone involved.</p>
            </div>
            <div class="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white rounded-xl p-8 text-center">
              <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6"><svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div>
              <h3 class="text-xl font-bold text-gray-900 mb-4">Innovation</h3>
              <p class="text-gray-600 leading-relaxed">Continuously improving our platform with cutting-edge features and technology to enhance user experience.</p>
            </div>
          </div>
        </div>
      </section>
      <section class="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div class="max-w-4xl mx-auto text-center">
          <div class="relative bg-white/10 backdrop-blur-sm rounded-3xl p-12 sm:p-16">
            <h2 class="text-4xl sm:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p class="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">Join PaisaAds today and discover a world of opportunities right at your fingertips.</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a routerLink="/search" class="group bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2">Browse Ads <svg class="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></a>
              <a routerLink="/dashboard/post-ad/line-ad" class="group bg-transparent hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold border-2 border-white/30 hover:border-white/50 transition-all duration-300 flex items-center gap-2">Post Your Ad <svg class="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></a>
            </div>
          </div>
        </div>
      </section>
      <div class="pb-16"></div>
    </div>
  `,
  imports: [RouterLink],
})
export class AboutComponent {}
