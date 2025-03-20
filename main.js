document.addEventListener('DOMContentLoaded', () => {
  try {
    initTheme();
    initNavigation();
    initSearch();
    initCollapsible();
    initScrollHandlers();
  } catch (error) {
    console.error('Initialization error:', error);
  }
});

function initSearch() {
  const searchField = document.getElementById('searchField');
  if (!searchField) return;

  let searchTimeout;
  const debounceSearch = (callback, delay = 300) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(callback, delay);
  };


  const searchObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        highlightElement(entry.target);
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '-50px'
  });

  function searchContent(searchTerm) {
    try {
      const searchableElements = document.querySelectorAll('[data-searchable]');
      const normalizedTerm = searchTerm.toLowerCase().trim();
      
      let found = false;
      
      searchableElements.forEach(element => {
        if (!found && element.textContent.toLowerCase().includes(normalizedTerm)) {
          found = true;
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          searchObserver.observe(element);
        }
      });
      
      if (!found) {
        showMessage('No results found');
      }
    } catch (error) {
      console.error('Search error:', error);
      showMessage('Search error occurred');
    }
  }

  function highlightElement(element) {
    element.style.transition = 'all 0.3s ease';
    element.style.backgroundColor = 'var(--primary-light)';
    element.style.color = 'white';
    
    setTimeout(() => {
      element.style.backgroundColor = '';
      element.style.color = '';
    }, 2000);
  }

  function showMessage(text) {
    const existingMessage = document.querySelector('.search-message');
    if (existingMessage) existingMessage.remove();
    
    const message = document.createElement('div');
    message.className = 'search-message';
    message.textContent = text;
    document.body.appendChild(message);
    
    setTimeout(() => {
      if (message.parentNode) {
        message.remove();
      }
    }, 2000);
  }

  if (searchField) {
    searchField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        debounceSearch(() => {
          const searchTerm = searchField.value.trim();
          if (searchTerm) {
            searchContent(searchTerm);
            hideSearchInput();
            searchField.value = '';
          }
        });
      }
    });
  }

  return () => {
    searchObserver.disconnect();
    clearTimeout(searchTimeout);
  };
}

function initScrollHandlers() {
  let ticking = false;
  const backToTopBtn = document.getElementById('backToTop');
  
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        backToTopBtn.classList.toggle('visible', window.scrollY > 300);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}