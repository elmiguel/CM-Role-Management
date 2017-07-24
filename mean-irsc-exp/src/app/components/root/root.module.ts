import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpModule, JsonpModule } from '@angular/http'
import { RouterModule, Routes } from '@angular/router'
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common'
import { RootComponent } from './root.component'
// import { PageModule } from './page/page.module'
// import { NavComponent } from './nav/nav.component'
// import { FooterComponent } from './footer/footer.component'
// import { SiteSearchService } from './site-search.service'
// import { SearchResultsResolver } from './page/search-results/search-results-resolver.service';
// import { WindowRefService } from './window-ref.service'
// const appRoutes: Routes = [{ path: '', component: PageModule, pathMatch: 'full' }]

@NgModule({
  declarations: [
    RootComponent,
    // NavComponent,
    // FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    // RouterModule.forRoot(appRoutes),
    // PageModule
  ],
  providers: [
    // WindowRefService,
    // SiteSearchService,
    // SearchResultsResolver
  ],
  bootstrap: [RootComponent]
})
export class RootModule { }
