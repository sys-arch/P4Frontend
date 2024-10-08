import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [provideHttpClient(), ...(appConfig.providers || [])] // Asegúrate de que `provideHttpClient` esté al principio
})
  .catch((err) => console.error(err));
