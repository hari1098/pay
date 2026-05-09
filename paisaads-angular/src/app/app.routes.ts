import { Routes } from '@angular/router';

export const routes: Routes = [
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
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      { path: '', redirectTo: 'my-ads', pathMatch: 'full' },
      { path: 'my-ads', loadComponent: () => import('./pages/dashboard/my-ads/my-ads.component').then(m => m.MyAdsComponent) },
      { path: 'post-ad', loadComponent: () => import('./pages/dashboard/post-ad/post-ad.component').then(m => m.PostAdComponent) },
      { path: 'profile', loadComponent: () => import('./pages/dashboard/profile/profile.component').then(m => m.ProfileComponent) },
    ],
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    children: [
      { path: '', redirectTo: 'review-ads', pathMatch: 'full' },
      { path: 'review-ads', loadComponent: () => import('./pages/admin/review-ads/review-ads.component').then(m => m.ReviewAdsComponent) },
      { path: 'published-ads', loadComponent: () => import('./pages/admin/published-ads/published-ads.component').then(m => m.PublishedAdsComponent) },
      { path: 'rejected-ads', loadComponent: () => import('./pages/admin/rejected-ads/rejected-ads.component').then(m => m.RejectedAdsComponent) },
      { path: 'users', loadComponent: () => import('./pages/admin/users/users.component').then(m => m.UsersComponent) },
      { path: 'categories', loadComponent: () => import('./pages/admin/categories/categories.component').then(m => m.CategoriesComponent) },
      { path: 'reports', loadComponent: () => import('./pages/admin/reports/reports.component').then(m => m.ReportsComponent) },
      { path: 'configurations', loadComponent: () => import('./pages/admin/configurations/configurations.component').then(m => m.ConfigurationsComponent) },
    ],
  },
  { path: '**', redirectTo: '' },
];
