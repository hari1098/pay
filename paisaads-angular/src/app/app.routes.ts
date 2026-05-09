import { Routes } from '@angular/router';
import { authGuard, adminGuard, userGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  // Public routes
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'search', loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent) },
  { path: 'search/results', loadComponent: () => import('./pages/search-results/search-results.component').then(m => m.SearchResultsComponent) },
  { path: 'about-us', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'faq', loadComponent: () => import('./pages/faq/faq.component').then(m => m.FaqComponent) },
  { path: 'privacy-policy', loadComponent: () => import('./pages/privacy/privacy.component').then(m => m.PrivacyComponent) },
  { path: 'terms-and-conditions', loadComponent: () => import('./pages/terms/terms.component').then(m => m.TermsComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'verify-otp', loadComponent: () => import('./pages/verify-otp/verify-otp.component').then(m => m.VerifyOtpComponent) },

  // Management login
  { path: 'mgmt', loadComponent: () => import('./pages/admin/mgmt-login/mgmt-login.component').then(m => m.MgmtLoginComponent) },

  // User dashboard
  {
    path: 'dashboard',
    canActivate: [userGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', loadComponent: () => import('./pages/dashboard/overview.component').then(m => m.DashboardOverviewComponent) },
      { path: 'my-ads/line-ads', loadComponent: () => import('./pages/dashboard/my-ads/line/my-ads-line.component').then(m => m.MyAdsLineComponent) },
      { path: 'my-ads/poster-ads', loadComponent: () => import('./pages/dashboard/my-ads/poster-ads/my-ads-poster.component').then(m => m.MyAdsPosterComponent) },
      { path: 'my-ads/video-ads', loadComponent: () => import('./pages/dashboard/my-ads/video-ads/my-ads-video.component').then(m => m.MyAdsVideoComponent) },
      { path: 'post-ad/line-ad', loadComponent: () => import('./pages/dashboard/post-ad/line/post-ad-line.component').then(m => m.PostAdLineComponent) },
      { path: 'post-ad/poster-ad', loadComponent: () => import('./pages/dashboard/post-ad/poster-ad/post-ad-poster.component').then(m => m.PostAdPosterComponent) },
      { path: 'post-ad/video-ad', loadComponent: () => import('./pages/dashboard/post-ad/video-ad/post-ad-video.component').then(m => m.PostAdVideoComponent) },
      { path: 'edit-ad/line-ad/:id', loadComponent: () => import('./pages/dashboard/edit-ad/edit-line-ad.component').then(m => m.EditLineAdComponent) },
      { path: 'edit-ad/poster-ad/:id', loadComponent: () => import('./pages/dashboard/edit-ad/edit-poster-ad.component').then(m => m.EditPosterAdComponent) },
      { path: 'edit-ad/video-ad/:id', loadComponent: () => import('./pages/dashboard/edit-ad/edit-video-ad.component').then(m => m.EditVideoAdComponent) },
      { path: 'view-ad/line-ad/:id', loadComponent: () => import('./pages/dashboard/view-ad/view-line-ad.component').then(m => m.ViewLineAdComponent) },
      { path: 'view-ad/poster-ad/:id', loadComponent: () => import('./pages/dashboard/view-ad/view-poster-ad.component').then(m => m.ViewPosterAdComponent) },
      { path: 'view-ad/video-ad/:id', loadComponent: () => import('./pages/dashboard/view-ad/view-video-ad.component').then(m => m.ViewVideoAdComponent) },
      { path: 'profile', loadComponent: () => import('./pages/dashboard/profile/profile.component').then(m => m.DashboardProfileComponent) },
    ],
  },

  // Admin/Management dashboard
  {
    path: 'mgmt/dashboard',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', loadComponent: () => import('./pages/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'review-ads/line', loadComponent: () => import('./pages/admin/review-ads/review-line-ads.component').then(m => m.ReviewLineAdsComponent) },
      { path: 'review-ads/poster', loadComponent: () => import('./pages/admin/review-ads/review-poster-ads.component').then(m => m.ReviewPosterAdsComponent) },
      { path: 'review-ads/video', loadComponent: () => import('./pages/admin/review-ads/review-video-ads.component').then(m => m.ReviewVideoAdsComponent) },
      { path: 'published-ads/line', loadComponent: () => import('./pages/admin/published-ads/published-line-ads.component').then(m => m.PublishedLineAdsComponent) },
      { path: 'published-ads/poster', loadComponent: () => import('./pages/admin/published-ads/published-poster-ads.component').then(m => m.PublishedPosterAdsComponent) },
      { path: 'published-ads/video', loadComponent: () => import('./pages/admin/published-ads/published-video-ads.component').then(m => m.PublishedVideoAdsComponent) },
      { path: 'ads-on-hold/line', loadComponent: () => import('./pages/admin/ads-on-hold/hold-line-ads.component').then(m => m.HoldLineAdsComponent) },
      { path: 'ads-on-hold/poster', loadComponent: () => import('./pages/admin/ads-on-hold/hold-poster-ads.component').then(m => m.HoldPosterAdsComponent) },
      { path: 'ads-on-hold/video', loadComponent: () => import('./pages/admin/ads-on-hold/hold-video-ads.component').then(m => m.HoldVideoAdsComponent) },
      { path: 'rejected-ads/line', loadComponent: () => import('./pages/admin/rejected-ads/rejected-line-ads.component').then(m => m.RejectedLineAdsComponent) },
      { path: 'rejected-ads/poster', loadComponent: () => import('./pages/admin/rejected-ads/rejected-poster-ads.component').then(m => m.RejectedPosterAdsComponent) },
      { path: 'rejected-ads/video', loadComponent: () => import('./pages/admin/rejected-ads/rejected-video-ads.component').then(m => m.RejectedVideoAdsComponent) },
      { path: 'users', loadComponent: () => import('./pages/admin/users/users.component').then(m => m.UsersComponent) },
      { path: 'users/:id', loadComponent: () => import('./pages/admin/users/user-detail.component').then(m => m.UserDetailComponent) },
      { path: 'categories/add', loadComponent: () => import('./pages/admin/categories/add-category.component').then(m => m.AddCategoryComponent) },
      { path: 'categories/view', loadComponent: () => import('./pages/admin/categories/categories.component').then(m => m.CategoriesComponent) },
      { path: 'reports', loadComponent: () => import('./pages/admin/reports/reports.component').then(m => m.ReportsComponent) },
      { path: 'configurations/ad-pricing', loadComponent: () => import('./pages/admin/configurations/ad-pricing/ad-pricing.component').then(m => m.AdPricingComponent) },
      { path: 'configurations/privacy-policy', loadComponent: () => import('./pages/admin/configurations/privacy-policy-config/privacy-policy-config.component').then(m => m.PrivacyPolicyConfigComponent) },
      { path: 'configurations/search-slogan', loadComponent: () => import('./pages/admin/configurations/search-slogan/search-slogan.component').then(m => m.SearchSloganComponent) },
      { path: 'configurations/faq', loadComponent: () => import('./pages/admin/configurations/faq-config/faq-config.component').then(m => m.FaqConfigComponent) },
      { path: 'configurations/contact-page', loadComponent: () => import('./pages/admin/configurations/contact-page-config/contact-page-config.component').then(m => m.ContactPageConfigComponent) },
      { path: 'configurations/tc', loadComponent: () => import('./pages/admin/configurations/tc-config/tc-config.component').then(m => m.TcConfigComponent) },
      { path: 'profile', loadComponent: () => import('./pages/admin/profile/admin-profile.component').then(m => m.AdminProfileComponent) },
    ],
  },

  { path: '**', redirectTo: '' },
];
