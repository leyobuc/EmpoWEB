document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const closeBtn = document.querySelector('.sidebar-close');
    const menuItems = document.querySelectorAll('.menu-list ul li a');

    function toggleSidebar() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }

    toggleBtn?.addEventListener('click', toggleSidebar);
    
    closeBtn?.addEventListener('click', toggleSidebar);
    overlay?.addEventListener('click', toggleSidebar);

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            toggleSidebar();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });

    function preventScroll(e) {
        if (sidebar.classList.contains('active')) {
            e.preventDefault();
        }
    }

    let touchStartX = 0;
    let touchEndX = 0;

    sidebar.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sidebar.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 100;
        const swipeDistance = touchEndX - touchStartX;
        
        if (swipeDistance > swipeThreshold) {
            if (sidebar.classList.contains('active')) {
                toggleSidebar();
            }
        }
    }
});
