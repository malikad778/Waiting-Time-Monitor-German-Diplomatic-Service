// Injected script to intercept fetch requests to the diplomatic service API

(function() {
  'use strict';
  
  console.log('Injected script loaded for waiting time monitoring');
  
  // Store original fetch function
  const originalFetch = window.fetch;
  
  // Override fetch function
  window.fetch = function(...args) {
    const url = args[0];
    
    // Check if this is a request to the limits endpoint
    if (typeof url === 'string' && 
        url.includes('/application-service/v1/application/') && 
        url.includes('/limits')) {
      
      console.log('Intercepted fetch request to limits endpoint:', url);
      
      // Call original fetch and intercept response
      return originalFetch.apply(this, args)
        .then(response => {
          // Clone response to read it without consuming the original
          const clonedResponse = response.clone();
          
          if (response.ok) {
            clonedResponse.json().then(data => {
              console.log('Intercepted waiting time response:', data);
              
              // Send data to content script
              window.postMessage({
                type: 'WAITING_TIME_RESPONSE',
                data: data,
                url: url
              }, '*');
            }).catch(error => {
              console.error('Error parsing intercepted response:', error);
            });
          }
          
          // Return original response
          return response;
        })
        .catch(error => {
          console.error('Error in intercepted fetch:', error);
          throw error;
        });
    }
    
    // For all other requests, use original fetch
    return originalFetch.apply(this, args);
  };
  
  // Also intercept XMLHttpRequest for completeness
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;
  
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    this._url = url;
    return originalXHROpen.apply(this, [method, url, ...args]);
  };
  
  XMLHttpRequest.prototype.send = function(...args) {
    if (this._url && 
        this._url.includes('/application-service/v1/application/') && 
        this._url.includes('/limits')) {
      
      console.log('Intercepted XHR request to limits endpoint:', this._url);
      
      this.addEventListener('load', function() {
        if (this.status === 200) {
          try {
            const data = JSON.parse(this.responseText);
            console.log('Intercepted XHR waiting time response:', data);
            
            // Send data to content script
            window.postMessage({
              type: 'WAITING_TIME_RESPONSE',
              data: data,
              url: this._url
            }, '*');
          } catch (error) {
            console.error('Error parsing intercepted XHR response:', error);
          }
        }
      });
    }
    
    return originalXHRSend.apply(this, args);
  };
  
  // Listen for explicit fetch trigger requests from the extension (via content script)
  window.addEventListener('message', async (evt) => {
    try {
      if (!evt || !evt.data || evt.source !== window) return;
      if (evt.data.type !== 'TRIGGER_LIMITS_FETCH') return;
      const url = evt.data.url;
      if (typeof url !== 'string') return;
      
      // Perform fetch in page context so cookies/session are included
      const resp = await originalFetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/json, text/plain, */*' }
      });
      if (!resp.ok) return;
      const data = await resp.json();
      // Post back like natural interception
      window.postMessage({
        type: 'WAITING_TIME_RESPONSE',
        data,
        url
      }, '*');
    } catch (e) {
      console.error('Error in TRIGGER_LIMITS_FETCH handler:', e);
    }
  });
  
})();

