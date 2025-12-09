# Frontend Architecture Patterns

**When to read**: Understanding component structure, NgRx flow, dependency injection
**Context weight**: Essential (Tier 1) - Read after project-structure.md

**Primary Pattern**: Feature-based + Standalone Components + NgRx State Management

## Directory Structure

**Core**: Global services, guards, interceptors, global store
**Features**: Self-contained modules (components, pages, models, services, store)
**Shared**: Reusable UI components, directives, utilities
**Layout**: Application shell (header, sidebar, main layout)

## Component Patterns

### 🚨 MANDATORY Template Rules

**ALL components MUST use separate HTML template files**

- ✅ ALWAYS: `templateUrl: './component.component.html'`
- ❌ NEVER: `template: '...'` (inline templates)

### Component Types

**Smart Components**: Connected to NgRx store, handle business logic
**Dumb Components**: Pure UI, receive data via @Input(), emit via @Output()
**Layout Components**: Shell structure and navigation
**Shared Components**: Reusable UI elements

### Component Structure Examples

```typescript
// Smart Component (Container)
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, ButtonComponent, CardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private store = inject(Store); // ✅ MANDATORY: Use inject()
  private router = inject(Router); // ❌ NEVER: constructor injection
  private entityService = inject(EntityService);

  // State selectors
  entities$ = this.store.select(EntitySelectors.selectAllEntities);
  loading$ = this.store.select(EntitySelectors.selectLoading);
  error$ = this.store.select(EntitySelectors.selectError);

  ngOnInit() {
    this.store.dispatch(EntityActions.loadEntities());
  }

  onCreateEntity(data: CreateEntityRequest) {
    this.store.dispatch(EntityActions.createEntity({ data }));
  }

  onEditEntity(id: string) {
    this.router.navigate(['/entities', id, 'edit']);
  }
}

// Dumb Component (Presentational)
@Component({
  selector: 'app-entity-card',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './entity-card.component.html', // ✅ MANDATORY: Always use separate HTML file
  styleUrl: './entity-card.component.scss',
})
export class EntityCardComponent {
  @Input({ required: true }) entity!: EntityDto;
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  onEdit() {
    this.edit.emit(this.entity.id);
  }

  onDelete() {
    this.delete.emit(this.entity.id);
  }
}

// Shared Component with ControlValueAccessor
@Component({
  selector: 'app-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.component.html', // ✅ MANDATORY: Always use separate HTML file
  styleUrl: './input.component.scss',
})
export class InputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() type: string = 'text';
  @Input() placeholder?: string;
  @Input() errorMessage?: string;

  value: string = '';
  disabled: boolean = false;
  hasError: boolean = false;
  inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
```

## NgRx State Architecture

### State Organization

**Global State**: User, theme, loading, router
**Feature State**: Feature-specific slices with providers
**Component State**: Local UI state only

### 🚨 MANDATORY Flow

**All user actions MUST go through NgRx**

**Flow**: Component → Action → Effect → Service → Success/Error Action → State Update

```typescript
// Actions (entities.actions.ts)
export const EntityActions = createActionGroup({
  source: 'Entity',
  events: {
    'Load Entities': emptyProps(),
    'Load Entities Success': props<{ entities: EntityDto[] }>(),
    'Load Entities Failure': props<{ error: string }>(),
    'Create Entity': props<{ data: CreateEntityRequest }>(),
    'Create Entity Success': props<{ entity: EntityDto }>(),
    'Create Entity Failure': props<{ error: string }>(),
    'Update Entity': props<{ id: string; data: UpdateEntityRequest }>(),
    'Update Entity Success': props<{ entity: EntityDto }>(),
    'Delete Entity': props<{ id: string }>(),
    'Delete Entity Success': props<{ id: string }>(),
  },
});

// State Interface
export interface EntityState {
  entities: EntityDto[];
  loading: boolean;
  error: string | null;
  selectedEntityId: string | null;
}

export const initialEntityState: EntityState = {
  entities: [],
  loading: false,
  error: null,
  selectedEntityId: null,
};

// Reducer (entities.reducer.ts)
export const entityReducer = createReducer(
  initialEntityState,
  on(EntityActions.loadEntities, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(EntityActions.loadEntitiesSuccess, (state, { entities }) => ({
    ...state,
    entities,
    loading: false,
    error: null,
  })),
  on(EntityActions.loadEntitiesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(EntityActions.createEntitySuccess, (state, { entity }) => ({
    ...state,
    entities: [...state.entities, entity],
    loading: false,
  })),
  on(EntityActions.updateEntitySuccess, (state, { entity }) => ({
    ...state,
    entities: state.entities.map((e) => (e.id === entity.id ? entity : e)),
    loading: false,
  })),
  on(EntityActions.deleteEntitySuccess, (state, { id }) => ({
    ...state,
    entities: state.entities.filter((e) => e.id !== id),
    loading: false,
  })),
);

// Effects (entities.effects.ts)
@Injectable()
export class EntityEffects {
  private actions$ = inject(Actions);
  private entityService = inject(EntityService);
  private notificationService = inject(NotificationService);

  loadEntities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntityActions.loadEntities),
      switchMap(() =>
        this.entityService.getEntities().pipe(
          map((entities) => EntityActions.loadEntitiesSuccess({ entities })),
          catchError((error) => {
            console.error('Load entities failed:', error);
            return of(
              EntityActions.loadEntitiesFailure({
                error: 'Failed to load entities',
              }),
            );
          }),
        ),
      ),
    ),
  );

  createEntity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntityActions.createEntity),
      switchMap(({ data }) =>
        this.entityService.createEntity(data).pipe(
          map((entity) => {
            this.notificationService.showSuccess('Entity created successfully');
            return EntityActions.createEntitySuccess({ entity });
          }),
          catchError((error) => {
            this.notificationService.showError('Failed to create entity');
            return of(
              EntityActions.createEntityFailure({
                error: error.message || 'Unknown error',
              }),
            );
          }),
        ),
      ),
    ),
  );

  updateEntity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EntityActions.updateEntity),
      switchMap(({ id, data }) =>
        this.entityService.updateEntity(id, data).pipe(
          map((entity) => {
            this.notificationService.showSuccess('Entity updated successfully');
            return EntityActions.updateEntitySuccess({ entity });
          }),
          catchError((error) => {
            this.notificationService.showError('Failed to update entity');
            return of(
              EntityActions.createEntityFailure({
                error: error.message || 'Unknown error',
              }),
            );
          }),
        ),
      ),
    ),
  );
}

// Selectors (entities.selectors.ts)
export const selectEntityState = createFeatureSelector<EntityState>('entities');

export const EntitySelectors = {
  selectAllEntities: createSelector(selectEntityState, (state) => state.entities),
  selectLoading: createSelector(selectEntityState, (state) => state.loading),
  selectError: createSelector(selectEntityState, (state) => state.error),
  selectSelectedEntityId: createSelector(selectEntityState, (state) => state.selectedEntityId),
  selectEntityById: (id: string) =>
    createSelector(selectEntityState, (state) => state.entities.find((entity) => entity.id === id)),
  selectEntitiesByStatus: (status: EntityStatus) =>
    createSelector(selectEntityState, (state) =>
      state.entities.filter((entity) => entity.status === status),
    ),
};

// Component Usage
@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html', // ✅ MANDATORY: Always use separate HTML file
  styleUrl: './entity-list.component.scss',
})
export class EntityListComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  entities$ = this.store.select(EntitySelectors.selectAllEntities);
  loading$ = this.store.select(EntitySelectors.selectLoading);
  error$ = this.store.select(EntitySelectors.selectError);

  ngOnInit() {
    this.store.dispatch(EntityActions.loadEntities());
  }

  onCreateEntity() {
    this.router.navigate(['/entities/create']);
  }

  onEditEntity(id: string) {
    this.router.navigate(['/entities', id, 'edit']);
  }

  onDeleteEntity(id: string) {
    if (confirm('Are you sure you want to delete this entity?')) {
      this.store.dispatch(EntityActions.deleteEntity({ id }));
    }
  }

  trackByEntityId(index: number, entity: EntityDto): string {
    return entity.id;
  }
}
```

## Configuration Patterns

```typescript
// app.config.ts - Application configuration
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    ...CORE_PROVIDERS,
    ...SHARED_PROVIDERS,
    ...FEATURE_PROVIDERS,
  ],
};

// core.config.ts - Core providers
export const CORE_PROVIDERS = [
  provideHttpClient(withInterceptorsFromDi()),
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  provideStore(),
  provideEffects(),
  provideRouterStore(),
  ...ROOT_STORE_PROVIDERS,
  ...(isDevMode() ? [provideStoreDevtools()] : []),
];

// shared.config.ts - Shared providers
export const SHARED_PROVIDERS = [
  // Shared services
  NotificationService,
  ImageService,
  // Modal effects
  provideEffects(ModalEffects),
];

// feature.config.ts - Feature providers
export const ENTITY_FEATURE_PROVIDERS = [
  provideState('entities', entityReducer),
  provideEffects(EntityEffects),
  // Feature-specific services
  EntityService,
];

// Feature routes with providers
export const entityRoutes: Routes = [
  {
    path: '',
    component: EntityListComponent,
    providers: [...ENTITY_FEATURE_PROVIDERS],
  },
  {
    path: 'create',
    component: EntityCreateComponent,
    providers: [...ENTITY_FEATURE_PROVIDERS],
  },
  {
    path: ':id/edit',
    component: EntityEditComponent,
    providers: [...ENTITY_FEATURE_PROVIDERS],
  },
];
```

## Routing Patterns

```typescript
// app.routes.ts - Main routing configuration
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
      },
      {
        path: 'entities',
        loadChildren: () =>
          import('./features/entities/entities.routes').then((m) => m.entityRoutes),
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'manager'] },
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./features/profile/profile.routes').then((m) => m.profileRoutes),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

// Auth Guard
@Injectable()
export class AuthGuard implements CanActivate {
  private store = inject(Store);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.store.select(AuthSelectors.selectIsAuthenticated).pipe(
      map((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/auth/login']);
          return false;
        }
        return true;
      }),
    );
  }
}

// Role Guard
@Injectable()
export class RoleGuard implements CanActivate {
  private store = inject(Store);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const requiredRoles = route.data['roles'] as string[];

    return this.store.select(AuthSelectors.selectUserRoles).pipe(
      map((userRoles) => {
        const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));
        if (!hasRequiredRole) {
          this.router.navigate(['/unauthorized']);
          return false;
        }
        return true;
      }),
    );
  }
}
```

## Component Communication

### Parent → Child Communication

```typescript
// Parent Component
@Component({
  templateUrl: './parent.component.html', // ✅ MANDATORY: Always use separate HTML file
  styleUrl: './parent.component.scss',
})
export class ParentComponent {
  selectedUser: User = { id: '1', name: 'John Doe', email: 'john@example.com' };
  canEdit = true;
  cardDisplayMode: 'compact' | 'detailed' = 'detailed';
}

// Child Component
@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html', // ✅ MANDATORY: Always use separate HTML file
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  @Input({ required: true }) user!: User;
  @Input() isEditable: boolean = false;
  @Input() displayMode: 'compact' | 'detailed' = 'compact';
}
```

### Child → Parent Communication

```typescript
// Child Component
@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html', // ✅ MANDATORY: Always use separate HTML file
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
  @Output() searchChange = new EventEmitter<string>();
  @Output() searchSubmit = new EventEmitter<string>();

  searchTerm: string = '';

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.searchChange.emit(this.searchTerm);
  }

  onSubmit() {
    this.searchSubmit.emit(this.searchTerm);
  }
}

// Parent Component
@Component({
  templateUrl: './parent.component.html', // ✅ MANDATORY: Always use separate HTML file
  styleUrl: './parent.component.scss',
})
export class ParentComponent {
  filteredResults: any[] = [];

  onSearchChange(searchTerm: string) {
    // Filter results as user types
    this.filteredResults = this.allResults.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  onSearchSubmit(searchTerm: string) {
    // Perform search action
    this.store.dispatch(SearchActions.performSearch({ query: searchTerm }));
  }
}
```

### Sibling/Cross-Feature Communication via NgRx

```typescript
// Component A dispatches action
componentA() {
  this.store.dispatch(SharedActions.updateSelectedItem({ item }));
}

// Component B reacts to state change
componentB() {
  selectedItem$ = this.store.select(SharedSelectors.selectSelectedItem);
}

// Service for complex component interactions
@Injectable({ providedIn: 'root' })
export class ComponentCommunicationService {
  private store = inject(Store);

  selectItem(item: any) {
    this.store.dispatch(SharedActions.selectItem({ item }));
  }

  clearSelection() {
    this.store.dispatch(SharedActions.clearSelection());
  }

  getSelectedItem$() {
    return this.store.select(SharedSelectors.selectSelectedItem);
  }
}
```

## Error Handling

```typescript
// Error Interceptor
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred';

        switch (error.status) {
          case 400:
            errorMessage = 'Bad request. Please check your input.';
            break;
          case 401:
            errorMessage = 'You are not authorized. Please log in.';
            this.authService.logout();
            this.router.navigate(['/auth/login']);
            break;
          case 403:
            errorMessage = 'You do not have permission to perform this action.';
            break;
          case 404:
            errorMessage = 'The requested resource was not found.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
        }

        this.notificationService.showError(errorMessage);
        return throwError(() => error);
      }),
    );
  }
}

// Component Error Handling
@Component({
  templateUrl: './component-with-error-handling.component.html', // ✅ MANDATORY: Always use separate HTML file
  styleUrl: './component-with-error-handling.component.scss',
})
export class ComponentWithErrorHandling {
  private store = inject(Store);

  error$ = this.store.select(FeatureSelectors.selectError);
  loading$ = this.store.select(FeatureSelectors.selectLoading);

  async performAction() {
    try {
      this.store.dispatch(FeatureActions.startAction());
      const result = await this.someAsyncOperation();
      this.store.dispatch(FeatureActions.actionSuccess({ result }));
    } catch (error) {
      console.error('Action failed:', error);
      this.store.dispatch(
        FeatureActions.actionFailure({
          error: error instanceof Error ? error.message : 'Unknown error',
        }),
      );
    }
  }

  clearError() {
    this.store.dispatch(FeatureActions.clearError());
  }

  private async someAsyncOperation(): Promise<any> {
    // Async operation that might fail
    return new Promise((resolve, reject) => {
      // Implementation
    });
  }
}

// Global Error Handler
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private notificationService = inject(NotificationService);

  handleError(error: Error): void {
    console.error('Global error caught:', error);

    // Don't show notification for HTTP errors (handled by interceptor)
    if (!(error instanceof HttpErrorResponse)) {
      this.notificationService.showError('An unexpected error occurred');
    }

    // Could send to logging service
    // this.loggingService.logError(error);
  }
}
```

## Performance Optimization

```typescript
// OnPush Change Detection
@Component({
  selector: 'app-optimized-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './optimized-list.component.html', // ✅ MANDATORY: Always use separate HTML file
  styleUrl: './optimized-list.component.scss',
})
export class OptimizedListComponent {
  @Input() items: Item[] = [];

  // TrackBy function for ngFor optimization
  trackByItemId(index: number, item: Item): string {
    return item.id;
  }
}

// Pure Pipe for expensive operations
@Pipe({ name: 'expensiveFilter', pure: true })
export class ExpensiveFilterPipe implements PipeTransform {
  transform(items: Item[], filter: string): Item[] {
    if (!filter) return items;

    // Expensive filtering logic
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.description.toLowerCase().includes(filter.toLowerCase()),
    );
  }
}

// Lazy Loading with Preloading
@Injectable()
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Only preload routes marked for preloading
    if (route.data?.['preload']) {
      return load();
    }
    return of(null);
  }
}

// Virtual Scrolling for large lists
@Component({
  templateUrl: './virtual-scroll-list.component.html', // ✅ MANDATORY: Always use separate HTML file
  styleUrl: './virtual-scroll-list.component.scss',
})
export class VirtualScrollListComponent {
  @Input() items: Item[] = [];

  trackByItemId(index: number, item: Item): string {
    return item.id;
  }
}
```

## Form Handling Examples

```typescript
// Reactive Form with Validation
@Component({
  selector: 'app-entity-form',
  templateUrl: './entity-form.component.html', // ✅ MANDATORY: Always use separate HTML file
  styleUrl: './entity-form.component.scss',
})
export class EntityFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);

  @Input() entityId?: string;

  isEdit = false;
  loading$ = this.store.select(EntitySelectors.selectLoading);

  entityForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    description: ['', Validators.maxLength(500)],
  });

  ngOnInit() {
    if (this.entityId) {
      this.isEdit = true;
      this.loadEntity();
    }
  }

  private loadEntity() {
    this.store
      .select(EntitySelectors.selectEntityById(this.entityId!))
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity) => {
        if (entity) {
          this.entityForm.patchValue(entity);
        }
      });
  }

  onSubmit() {
    if (this.entityForm.valid) {
      const formValue = this.entityForm.value;

      if (this.isEdit) {
        this.store.dispatch(
          EntityActions.updateEntity({
            id: this.entityId!,
            data: formValue,
          }),
        );
      } else {
        this.store.dispatch(EntityActions.createEntity({ data: formValue }));
      }

      // Navigate back after successful submission
      this.store
        .select(EntitySelectors.selectLoading)
        .pipe(
          filter((loading) => !loading),
          take(1),
          takeUntil(this.destroy$),
        )
        .subscribe(() => {
          this.router.navigate(['/entities']);
        });
    }
  }

  onCancel() {
    this.router.navigate(['/entities']);
  }

  getErrorMessage(controlName: string): string {
    const control = this.entityForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${controlName} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['maxlength']) {
        return `${controlName} must not exceed ${control.errors['maxlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  private destroy$ = new Subject<void>();

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

**Next**: Read `frontend/state-management.md` for detailed NgRx patterns
**Related**: `shared/integration.md` for API communication
