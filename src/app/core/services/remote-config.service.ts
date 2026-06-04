import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FirebaseApp } from '@angular/fire/app';
import { fetchAndActivate, getRemoteConfig, getValue } from 'firebase/remote-config';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RemoteConfigService {
  private readonly firebaseApp = inject(FirebaseApp);

  private readonly _showTaskStats$ = new BehaviorSubject<boolean>(
    environment.remoteConfigDefaults.show_task_stats
  );

  readonly showTaskStats$ = this._showTaskStats$.asObservable();

  async initialize(): Promise<void> {
    try {
      const remoteConfig = getRemoteConfig(this.firebaseApp);

      remoteConfig.settings = {
        minimumFetchIntervalMillis: environment.production ? 3600000 : 0,
        fetchTimeoutMillis: 60000,
      };

      remoteConfig.defaultConfig = environment.remoteConfigDefaults;

      const activated = await fetchAndActivate(remoteConfig);
      console.log('[RemoteConfig] fetchAndActivate:', activated);

      const showStats = getValue(remoteConfig, 'show_task_stats').asBoolean();
      console.log('[RemoteConfig] show_task_stats:', showStats);

      this._showTaskStats$.next(showStats);
    } catch (error) {
      console.error('[RemoteConfig] Error:', error);
    }
  }
}
