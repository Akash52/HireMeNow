/**
 * Simple router for handling navigation and routing in the application
 */
export class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.defaultRoute = null;
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', (event) => {
      if (event.state && event.state.route) {
        this.navigate(event.state.route, event.state.params, true);
      }
    });
  }

  /**
   * Register a route handler
   * @param {string} route - Route name
   * @param {function} handler - Handler function to be called with params
   */
  register(route, handler) {
    this.routes[route] = handler;
    
    // First registered route becomes the default
    if (!this.defaultRoute) {
      this.defaultRoute = route;
    }
    
    return this;
  }

  /**
   * Set the default route
   * @param {string} route - Default route name
   */
  setDefault(route) {
    if (this.routes[route]) {
      this.defaultRoute = route;
    } else {
      console.error(`Cannot set default route: ${route} is not registered`);
    }
    
    return this;
  }

  /**
   * Navigate to a specific route
   * @param {string} route - Route to navigate to
   * @param {object} params - Parameters to pass to the route handler
   * @param {boolean} skipHistory - Skip adding entry to browser history (for popstate)
   */
  navigate(route, params = {}, skipHistory = false) {
    if (!this.routes[route]) {
      console.error(`Route not found: ${route}`);
      return;
    }
    
    // Call the route handler
    this.routes[route](params);
    this.currentRoute = route;
    
    // Update URL if not triggered by popstate
    if (!skipHistory) {
      // Build query string from params
      const queryParams = new URLSearchParams();
      queryParams.set('route', route);
      
      // Add additional params to query string
      Object.entries(params).forEach(([key, value]) => {
        if (key !== 'route') {
          queryParams.set(key, value);
        }
      });
      
      // Update browser history
      const url = `${window.location.pathname}?${queryParams.toString()}`;
      window.history.pushState({ route, params }, '', url);
    }
    
    return this;
  }

  /**
   * Initialize the router based on URL parameters or default route
   */
  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const route = urlParams.get('route');
    
    // Extract all parameters
    const params = {};
    urlParams.forEach((value, key) => {
      if (key !== 'route') {
        params[key] = value;
      }
    });
    
    // Navigate to specified route or default
    if (route && this.routes[route]) {
      this.navigate(route, params, true);
    } else if (this.defaultRoute) {
      // Handle legacy URL parameters for backward compatibility
      if (urlParams.has('mode')) {
        const mode = urlParams.get('mode');
        if (mode === 'interview') {
          this.navigate('interview', params, true);
          return;
        } else if (mode === 'ebook') {
          const book = urlParams.get('book') || null;
          this.navigate('ebook', { book, ...params }, true);
          return;
        }
      }
      
      this.navigate(this.defaultRoute, params, true);
    }
    
    return this;
  }

  /**
   * Get current route information
   * @returns {object} Current route information
   */
  getCurrentRoute() {
    return {
      name: this.currentRoute,
      isActive: (routeName) => this.currentRoute === routeName
    };
  }
}
