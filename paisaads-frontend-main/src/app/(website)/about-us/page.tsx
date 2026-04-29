"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Target, Eye, Heart, Shield, Zap, ArrowRight } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight">
              About{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PaisaAds
              </span>
            </h1>
            <div className="mt-8 max-w-3xl mx-auto">
              <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed font-light">
                Your trusted platform for buying, selling, and discovering amazing deals.
              </p>
              <p className="mt-4 text-lg text-gray-500 leading-relaxed">
                We connect communities through classified advertisements, making commerce simple and accessible for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Purpose</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Driven by a clear mission and vision to transform how people connect and trade
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="relative p-8 pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative p-8 pt-0">
                <p className="text-gray-700 leading-relaxed text-lg">
                  To create the most user-friendly and secure marketplace where individuals and businesses 
                  can easily connect, trade, and grow their communities through classified advertisements.
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="relative p-8 pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Eye className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative p-8 pt-0">
                <p className="text-gray-700 leading-relaxed text-lg">
                  To become the leading classified ads platform that empowers millions of users to discover 
                  opportunities, build connections, and achieve their buying and selling goals with ease.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900">Our Core Values</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and shape our platform's future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Shield className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Trust & Security</h3>
                  <p className="text-gray-600 leading-relaxed">
                    We prioritize user safety with robust verification systems and secure transactions, ensuring peace of mind for every interaction.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Community First</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Building strong local communities through meaningful connections and interactions that benefit everyone involved.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="group">
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Zap className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Continuously improving our platform with cutting-edge features and technology to enhance user experience.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the powerful features that make PaisaAds the perfect platform for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group text-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Building2 className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Multiple Ad Types</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Post line ads, poster ads, and video ads to showcase your products and services with maximum impact and engagement.
              </p>
            </div>

            <div className="group text-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Target className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Categories</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Organize and discover ads through our comprehensive category system designed for precise targeting and easy navigation.
              </p>
            </div>

            <div className="group text-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Eye className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Easy Discovery</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Advanced search and filtering tools help you find exactly what you're looking for quickly and efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100">
              <CardHeader className="relative p-8 pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Our Platform</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative p-8 pt-0">
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  PaisaAds is built with modern technology to provide a seamless experience for both buyers and sellers. 
                  Our platform supports various types of advertisements designed for maximum engagement.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Badge className="px-4 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors font-medium">Line Ads</Badge>
                  <Badge className="px-4 py-2 bg-green-100 text-green-800 hover:bg-green-200 transition-colors font-medium">Poster Ads</Badge>
                  <Badge className="px-4 py-2 bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors font-medium">Video Ads</Badge>
                  <Badge className="px-4 py-2 bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors font-medium">Smart Categories</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-teal-50 to-teal-100">
              <CardHeader className="relative p-8 pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Join Our Community</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative p-8 pt-0">
                <p className="text-gray-700 leading-relaxed text-lg mb-4">
                  Whether you're looking to sell items you no longer need, promote your business, 
                  or find great deals in your area, PaisaAds provides the tools and community to help you succeed.
                </p>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Join thousands of users who trust PaisaAds for their buying and selling needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-12 sm:p-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join PaisaAds today and discover a world of opportunities right at your fingertips.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="/search" 
                  className="group bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                >
                  Browse Ads
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
                <a 
                  href="/dashboard/post-ad" 
                  className="group bg-transparent hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold border-2 border-white/30 hover:border-white/50 transition-all duration-300 flex items-center gap-2"
                >
                  Post Your Ad
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
          </div>
        </div>
      </section>

      <div className="pb-16"></div>
    </div>
  );
}