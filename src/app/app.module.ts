import { MaterialModule } from './material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { configf } from './models/config';
import { EventTypes, OidcConfigService, LogLevel, PublicEventsService, AuthModule} from 'angular-auth-oidc-client';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map,switchMap } from 'rxjs/operators';
import { APP_INITIALIZER } from '@angular/core';
import { BaseComponent } from './base/base.component';
import { CreatehttkmodelComponent } from './createhttkmodel/createhttkmodel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParameterlistComponent } from './base/components/parameterlist/parameterlist.component';
import { ParameterstepsComponent } from './base/components/parametersteps/parametersteps.component';
import { ErrorDialogComponent } from './dialogs/error-dialog/error-dialog.component';
import { PredictedComponent } from './base/predicted/predicted/predicted.component';
import { FeatureApiService } from './jaqpot-client/api/feature.service';
import { HttkmodelsComponent } from './httkmodels/httkmodels.component';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { PbpkPredictedComponent } from './base/pbpk-predicted/pbpk-predicted.component';
import { ChooseXYComponent } from './dialogs/choose-x-y/choose-x-y.component';
import { MultiLineComponent } from './d3/multi-line/multi-line.component';




@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    CreatehttkmodelComponent,
    ParameterlistComponent,
    ParameterstepsComponent,
    ErrorDialogComponent,
    PredictedComponent,
    HttkmodelsComponent,
    ConfirmationDialogComponent,
    PbpkPredictedComponent,
    ChooseXYComponent,
    MultiLineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    FormsModule,
    HttpClientModule,
    AuthModule.forRoot(),
    MaterialModule
  ],
  providers: [ OidcConfigService,FeatureApiService,
    {
        provide: APP_INITIALIZER,
        useFactory: configureAuth,
        deps: [OidcConfigService, HttpClient],
        multi: true,
    },],
  entryComponents:[ChooseXYComponent, ConfirmationDialogComponent, ErrorDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }


export function configureAuth(oidcConfigService: OidcConfigService, httpClient: HttpClient) {
  const setupAction$ = httpClient.get<any>(`/assets/conf.json`).pipe(
    map((customConfig:configf) => {
        return {
            stsServer: customConfig.stsServer,
            redirectUrl: customConfig.redirect_url,
            clientId: customConfig.client_id,
            responseType: customConfig.response_type,
            scope: customConfig.scope,
            silentRenewUrl: customConfig.silent_redirect_url,
            logLevel: LogLevel.Error, // LogLevel.Debug,
            maxIdTokenIatOffsetAllowedInSeconds: 60,
            historyCleanupOff: true,
            autoUserinfo: false,
            storage: localStorage
        };
    }),
    switchMap((config) => oidcConfigService.withConfig(config))
);

return () => setupAction$.toPromise();
}