import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';

import * as P from './pages/pages';
import * as C from './components/components';
import { NewGameDialog } from './dialogs/new-game-dialog/new-game-dialog';
import { MaterialModule } from './material/material.module';

class MyErrorHandler implements ErrorHandler {
  static isFirstError = true;
  handleError(error: Error) {
    console.error(error);
    if (MyErrorHandler.isFirstError) { alert(error.message) }
    MyErrorHandler.isFirstError = false;
  }
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    P.HomeComponent,
    C.BoardComponent,
    NewGameDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule
  ],
  providers: [{ provide: ErrorHandler, useClass: MyErrorHandler }],
  bootstrap: [AppComponent]
})
export class AppModule { }
