import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'onboarding', loadChildren: './pages/onboarding/onboarding.module#OnboardingPageModule' },
  { path: 'start', loadChildren: './pages/start/start.module#StartPageModule' },
  { path: 'signin-up', loadChildren: './pages/signin-up/signin-up.module#SigninUpPageModule' },
  { path: 'forgot-password', loadChildren: './pages/authentication/forgot-password/forgot-password.module#ForgotPasswordPageModule' },
  { path: 'signup-success', loadChildren: './pages/authentication/signup-success/signup-success.module#SignupSuccessPageModule' },
  { path: 'buddy-message', loadChildren: './pages/tab-messages/buddy-message/buddy-message.module#BuddyMessagePageModule' },
  { path: 'add-new-share', loadChildren: './pages/tab-share/add-new-share/add-new-share.module#AddNewSharePageModule' },
  { path: 'view-profile', loadChildren: './pages/tab-people/view-profile/view-profile.module#ViewProfilePageModule' },
  { path: 'video-modal', loadChildren: './pages/modal/video-modal/video-modal.module#VideoModalPageModule' },
  { path: 'delete-account', loadChildren: './pages/tab-profile/delete-account/delete-account.module#DeleteAccountPageModule' },
  { path: 'logout', loadChildren: './pages/tab-profile/logout/logout.module#LogoutPageModule' },
  { path: 'photo-view-modal', loadChildren: './pages/modal/photo-view-modal/photo-view-modal.module#PhotoViewModalPageModule' },
  { path: 'details', loadChildren: './pages/tab-news/details/details.module#DetailsPageModule' },

  { path: 'my-profile', loadChildren: './pages/tab-profile/my-profile/my-profile.module#MyProfilePageModule' },
  { path: 'my-network', loadChildren: './pages/tab-profile/my-network/my-network.module#MyNetworkPageModule' },
  { path: 'my-credentials', loadChildren: './pages/tab-profile/my-credentials/my-credentials.module#MyCredentialsPageModule' },
  { path: 'language', loadChildren: './pages/tab-profile/language/language.module#LanguagePageModule' },
  { path: 'share-feedback', loadChildren: './pages/tab-profile/share-feedback/share-feedback.module#ShareFeedbackPageModule' },
  { path: 'report-abuse', loadChildren: './pages/tab-profile/report-abuse/report-abuse.module#ReportAbusePageModule' },
  { path: 'terms-conditions', loadChildren: './pages/tab-profile/terms-conditions/terms-conditions.module#TermsConditionsPageModule' },
  { path: 'privacy-policy', loadChildren: './pages/tab-profile/privacy-policy/privacy-policy.module#PrivacyPolicyPageModule' },
  { path: 'about-us', loadChildren: './pages/tab-profile/about-us/about-us.module#AboutUsPageModule' },
  { path: 'license', loadChildren: './pages/tab-profile/license/license.module#LicensePageModule' },
  { path: 'report-news', loadChildren: './pages/tab-news/report-news/report-news.module#ReportNewsPageModule' },
  { path: 'share-news', loadChildren: './pages/tab-news/share-news/share-news.module#ShareNewsPageModule' },
  { path: 'authentication', loadChildren: './pages/authentication/authentication.module#AuthenticationPageModule' },
  { path: 'login', loadChildren: './pages/authentication/login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './pages/authentication/signup/signup.module#SignupPageModule' },
];
@NgModule({
  imports: [
    // RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
