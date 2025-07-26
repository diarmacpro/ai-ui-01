// Data JSON untuk navbar dan sidebar
const appData = {
  brand: "AdminPanel",
  navbarMenu: [
    { name: "Dashboard", href: "#", active: true, icon: "bi-speedometer2" },
    { name: "Analitik", href: "#", active: false, icon: "bi-graph-up" },
    { name: "Laporan", href: "#", active: false, icon: "bi-file-text" }
  ],
  navbarRight: [
    {
      type: "dropdown",
      icon: "bi-bell",
      badge: 5,
      items: [
        { name: "Pesanan baru masuk", icon: "bi-cart", time: "2 menit lalu", href: "#" },
        { name: "Pembayaran berhasil", icon: "bi-credit-card", time: "5 menit lalu", href: "#" },
        { name: "Update sistem tersedia", icon: "bi-download", time: "1 jam lalu", href: "#" },
        { name: "Lihat semua notifikasi", icon: "bi-bell", href: "#", divider: true }
      ]
    },
    {
      type: "dropdown", 
      icon: "bi-envelope",
      badge: 3,
      items: [
        { name: "Chat dengan admin", icon: "bi-chat", time: "Baru saja", href: "#" },
        { name: "Pesan dari customer", icon: "bi-person", time: "10 menit lalu", href: "#" },
        { name: "Lihat semua pesan", icon: "bi-envelope-open", href: "#", divider: true }
      ]
    },
    {
      type: "search",
      placeholder: "Cari..."
    }
  ],
  sidebarMenu: [
    { 
      name: "Dashboard", 
      icon: "bi-speedometer2", 
      href: "#", 
      active: true 
    },
    { 
      name: "Pengguna", 
      icon: "bi-people", 
      href: "#", 
      active: false,
      badge: "12"
    },
    {
      name: "Produk",
      icon: "bi-box",
      href: "#",
      active: false,
      submenu: [
        { name: "Daftar Produk", href: "#", icon: "bi-list-ul" },
        { name: "Tambah Produk", href: "#", icon: "bi-plus-circle" },
        { name: "Kategori", href: "#", icon: "bi-tags" },
        { name: "Stok", href: "#", icon: "bi-boxes" }
      ]
    },
    { 
      name: "Pesanan", 
      icon: "bi-cart", 
      href: "#", 
      active: false,
      badge: "5"
    },
    {
      name: "Laporan",
      icon: "bi-graph-up",
      href: "#",
      active: false,
      submenu: [
        { name: "Penjualan", href: "#", icon: "bi-currency-dollar" },
        { name: "Keuangan", href: "#", icon: "bi-wallet2" },
        { name: "Inventori", href: "#", icon: "bi-box-seam" }
      ]
    },
    { 
      name: "Keuangan", 
      icon: "bi-wallet2", 
      href: "#", 
      active: false 
    },
    { 
      name: "Pengaturan", 
      icon: "bi-gear", 
      href: "#", 
      active: false 
    },
    { 
      name: "Bantuan", 
      icon: "bi-question-circle", 
      href: "#", 
      active: false 
    }
  ],
  user: {
    name: "John Doe",
    role: "Administrator",
    avatar: "JD",
    email: "john.doe@admin.com"
  },
  profileMenu: [
    { name: "Profil Saya", icon: "bi-person", href: "#" },
    { name: "Pengaturan Akun", icon: "bi-gear", href: "#" },
    { name: "Notifikasi", icon: "bi-bell", href: "#" },
    { name: "Bantuan", icon: "bi-question-circle", href: "#" },
    { name: "Keluar", icon: "bi-box-arrow-right", href: "#", divider: true }
  ]
};

// State management
let sidebarOpen = window.innerWidth > 768;
let activeDropdowns = new Set();

// Render navbar menu
function renderNavbarMenu() {
  const mainMenu = document.getElementById('mainMenu');
  mainMenu.innerHTML = appData.navbarMenu.map(item => 
    `<a href="${item.href}" class="flex items-center gap-2 no-underline text-slate-600 font-medium px-3 py-2 rounded-lg transition-all hover:bg-gray-100 hover:text-slate-800 ${item.active ? 'text-slate-800 bg-gray-100' : ''}" onclick="setActiveNavMenu(this, '${item.name}')">
      <i class="${item.icon} text-sm"></i>
      ${item.name}
    </a>`
  ).join('');
}

// Render navbar right
function renderNavbarRight() {
  const navbarRight = document.getElementById('navbarRight');
  navbarRight.innerHTML = appData.navbarRight.map((item, index) => {
    if (item.type === 'search') {
      return `<div class="relative hidden md:block">
        <input type="text" placeholder="${item.placeholder}" class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
        <i class="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
      </div>`;
    }
    
    const badgeHtml = item.badge ? `<span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center badge-pulse">${item.badge}</span>` : '';
    
    return `<div class="relative">
      <div class="cursor-pointer relative" onclick="toggleNavDropdown(${index})" id="navToggle${index}">
        <span class="text-xl p-2 rounded-lg transition-all duration-200 block hover:bg-gray-100 hover:scale-105 active:scale-95">
          <i class="${item.icon}"></i>
          ${badgeHtml}
        </span>
      </div>
      <ul class="hidden absolute top-full right-0 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[280px] py-2 mt-2 z-50 dropdown-enter" id="navDropdown${index}">
        ${item.items.map(subItem => {
          return `${subItem.divider ? '<li class="border-t border-gray-200 my-2"></li>' : ''}
          <li class="px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50">
            <a href="${subItem.href || '#'}" class="flex items-center justify-between no-underline text-slate-600 hover:text-slate-800">
              <div class="flex items-center gap-3">
                ${subItem.icon ? `<i class="${subItem.icon} text-sm"></i>` : ''}
                <span class="text-sm">${subItem.name}</span>
              </div>
              ${subItem.time ? `<span class="text-xs text-slate-400">${subItem.time}</span>` : ''}
            </a>
          </li>`;
        }).join('')}
      </ul>
    </div>`;
  }).filter(item => item).join('');
}

// Render sidebar menu
function renderSidebarMenu() {
  const sidebarMenu = document.getElementById('sidebarMenu');
  sidebarMenu.innerHTML = appData.sidebarMenu.map((item, index) => {
    const badgeHtml = item.badge ? `<span class="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">${item.badge}</span>` : '';
    
    if (item.submenu) {
      return `
        <div class="mb-2">
          <div class="relative">
            <a href="${item.href}" class="flex items-center px-6 py-3 no-underline text-slate-600 font-medium transition-all hover:bg-gray-50 hover:text-slate-800 rounded-lg mx-3 ${item.active ? 'menu-active' : ''}" onclick="toggleSubmenu(${index}); event.preventDefault();">
              <i class="${item.icon} mr-3 text-lg"></i>
              <span class="flex-1">${item.name}</span>
              ${badgeHtml}
              <i class="bi bi-chevron-down ml-2 text-xs transition-transform duration-200" id="submenuIcon${index}"></i>
            </a>
            <div class="hidden mt-2 ml-3" id="submenu${index}">
              ${item.submenu.map(subItem => 
                `<a href="${subItem.href}" class="flex items-center px-6 py-2 no-underline text-slate-500 text-sm transition-all hover:bg-gray-100 hover:text-slate-800 rounded-lg mx-3 mb-1" onclick="setActiveMenu(this, '${subItem.name}')">
                  <i class="${subItem.icon} mr-3 text-sm"></i>
                  ${subItem.name}
                </a>`
              ).join('')}
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="mb-2">
          <a href="${item.href}" class="flex items-center px-6 py-3 no-underline text-slate-600 font-medium transition-all hover:bg-gray-50 hover:text-slate-800 rounded-lg mx-3 ${item.active ? 'menu-active' : ''}" onclick="setActiveMenu(this, '${item.name}')">
            <i class="${item.icon} mr-3 text-lg"></i>
            <span class="flex-1">${item.name}</span>
            ${badgeHtml}
          </a>
        </div>
      `;
    }
  }).join('');
}

// Render user info
function renderUserInfo() {
  document.getElementById('userName').textContent = appData.user.name;
  document.getElementById('userRole').textContent = appData.user.role;
  document.getElementById('userAvatar').textContent = appData.user.avatar;
  document.getElementById('sidebarUserName').textContent = appData.user.name;
  document.getElementById('sidebarUserRole').textContent = appData.user.role;
}

// Render profile menu
function renderProfileMenu() {
  const profileDropdown = document.getElementById('profileDropdown');
  profileDropdown.innerHTML = appData.profileMenu.map(item => 
    `${item.divider ? '<li class="border-t border-gray-200 my-2"></li>' : ''}
    <li class="px-4 py-2 cursor-pointer transition-colors hover:bg-gray-50">
      <a href="${item.href}" class="flex items-center gap-3 no-underline text-slate-600 hover:text-slate-800 text-sm">
        <i class="${item.icon}"></i>
        ${item.name}
      </a>
    </li>`
  ).join('');
}

// Toggle Sidebar
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const mainContent = document.getElementById('mainContent');
  
  if (window.innerWidth <= 768) {
    // Mobile behavior
    const isOpen = !sidebar.classList.contains('-translate-x-full');
    
    if (isOpen) {
      closeSidebar();
    } else {
      sidebar.classList.remove('-translate-x-full');
      sidebar.classList.add('translate-x-0');
      overlay.classList.remove('hidden');
      overlay.classList.add('block');
      sidebarOpen = true;
    }
  } else {
    // Desktop behavior
    sidebarOpen = !sidebarOpen;
    
    if (sidebarOpen) {
      sidebar.classList.remove('-translate-x-full');
      sidebar.classList.add('translate-x-0');
      mainContent.style.marginLeft = '288px';
    } else {
      sidebar.classList.add('-translate-x-full');
      sidebar.classList.remove('translate-x-0');
      mainContent.style.marginLeft = '0';
    }
  }
}

// Close sidebar for mobile
function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  
  sidebar.classList.add('-translate-x-full');
  sidebar.classList.remove('translate-x-0');
  overlay.classList.add('hidden');
  overlay.classList.remove('block');
  sidebarOpen = false;
}

// Toggle submenu
function toggleSubmenu(index) {
  const submenu = document.getElementById(`submenu${index}`);
  const icon = document.getElementById(`submenuIcon${index}`);
  
  submenu.classList.toggle('hidden');
  submenu.classList.toggle('block');
  icon.style.transform = submenu.classList.contains('block') ? 'rotate(180deg)' : 'rotate(0deg)';
}

// Set active menu
function setActiveMenu(element, menuName) {
  // Remove active from all menu items
  document.querySelectorAll('#sidebarMenu a').forEach(a => {
    a.classList.remove('menu-active');
  });
  
  // Add active to clicked menu
  element.classList.add('menu-active');
  
  // Update main content
  updatePageContent(menuName);
  
  // Close sidebar on mobile after selection
  if (window.innerWidth <= 768) {
    closeSidebar();
  }
}

// Set active nav menu
function setActiveNavMenu(element, menuName) {
  // Remove active from all nav menu items
  document.querySelectorAll('#mainMenu a').forEach(a => {
    a.classList.remove('text-slate-800', 'bg-gray-100');
    a.classList.add('text-slate-600');
  });
  
  // Add active to clicked menu
  element.classList.add('text-slate-800', 'bg-gray-100');
  element.classList.remove('text-slate-600');
  
  // Update main content
  updatePageContent(menuName);
}

// Update page content
function updatePageContent(menuName) {
  const pageTitle = document.getElementById('pageTitle');
  const pageDescription = document.getElementById('pageDescription');
  
  pageTitle.textContent = menuName;
  
  const descriptions = {
    'Dashboard': 'Selamat datang di panel administrasi. Kelola semua aspek sistem Anda dari sini.',
    'Pengguna': 'Kelola akun pengguna, hak akses, dan aktivitas pengguna dalam sistem.',
    'Produk': 'Manajemen produk, kategori, dan inventori untuk toko online Anda.',
    'Pesanan': 'Pantau dan kelola semua pesanan yang masuk dari pelanggan.',
    'Laporan': 'Analisis performa bisnis dengan berbagai laporan dan statistik.',
    'Keuangan': 'Kelola transaksi keuangan, pembayaran, dan laporan keuangan.',
    'Pengaturan': 'Konfigurasi sistem, preferensi, dan pengaturan aplikasi.',
    'Bantuan': 'Dokumentasi, FAQ, dan dukungan teknis untuk pengguna.',
    'Analitik': 'Dashboard analitik dengan insight mendalam tentang performa bisnis.'
  };
  
  pageDescription.textContent = descriptions[menuName] || `Anda sedang berada di halaman ${menuName}.`;
}

// Toggle navbar dropdown
function toggleNavDropdown(index) {
  const dropdown = document.getElementById(`navDropdown${index}`);
  const toggle = document.getElementById(`navToggle${index}`);
  const allDropdowns = document.querySelectorAll('[id^="navDropdown"]');
  
  // Close all other dropdowns
  allDropdowns.forEach((d, i) => {
    if (i !== index && activeDropdowns.has(i)) {
      d.classList.add('hidden');
      d.classList.remove('block');
      activeDropdowns.delete(i);
      
      const otherToggle = document.getElementById(`navToggle${i}`);
      if (otherToggle) {
        otherToggle.querySelector('span').classList.remove('bg-gray-100', 'shadow-sm');
      }
    }
  });
  
  // Toggle current dropdown
  const isHidden = dropdown.classList.contains('hidden');
  dropdown.classList.toggle('hidden');
  dropdown.classList.toggle('block');
  
  if (isHidden) {
    activeDropdowns.add(index);
    toggle.querySelector('span').classList.add('bg-gray-100', 'shadow-sm');
  } else {
    activeDropdowns.delete(index);
    toggle.querySelector('span').classList.remove('bg-gray-100', 'shadow-sm');
  }
}

// Toggle user dropdown
function toggleUserDropdown() {
  const dropdown = document.getElementById('profileDropdown');
  const toggle = document.getElementById('dropdownToggle');
  
  dropdown.classList.toggle('hidden');
  dropdown.classList.toggle('block');
  
  if (dropdown.classList.contains('block')) {
    toggle.innerHTML = '<i class="bi bi-chevron-down text-sm"></i>';
  } else {
    toggle.innerHTML = '<i class="bi bi-chevron-up text-sm"></i>';
  }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
  const dropdowns = document.querySelectorAll('[id^="navDropdown"], #profileDropdown');
  const isClickInside = event.target.closest('[onclick*="toggleNavDropdown"], [onclick*="toggleUserDropdown"]');
  
  if (!isClickInside) {
    dropdowns.forEach(dropdown => {
      dropdown.classList.add('hidden');
      dropdown.classList.remove('block');
    });
    
    // Reset all toggle button states
    activeDropdowns.clear();
    document.querySelectorAll('[id^="navToggle"]').forEach(toggle => {
      const toggleSpan = toggle.querySelector('span');
      if (toggleSpan) {
        toggleSpan.classList.remove('bg-gray-100', 'shadow-sm');
      }
    });
    
    // Reset user dropdown toggle
    const toggle = document.getElementById('dropdownToggle');
    if (toggle) {
      toggle.innerHTML = '<i class="bi bi-chevron-up text-sm"></i>';
    }
  }
});

// Handle window resize
window.addEventListener('resize', function() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const mainContent = document.getElementById('mainContent');
  
  if (window.innerWidth > 768) {
    // Desktop mode
    if (sidebarOpen) {
      sidebar.classList.remove('-translate-x-full');
      sidebar.classList.add('translate-x-0');
      mainContent.style.marginLeft = '288px';
    } else {
      sidebar.classList.add('-translate-x-full');
      sidebar.classList.remove('translate-x-0');
      mainContent.style.marginLeft = '0';
    }
    overlay.classList.add('hidden');
    overlay.classList.remove('block');
  } else {
    // Mobile mode
    mainContent.style.marginLeft = '0';
    if (sidebarOpen && !overlay.classList.contains('hidden')) {
      sidebar.classList.add('translate-x-0');
      sidebar.classList.remove('-translate-x-full');
    } else {
      sidebar.classList.add('-translate-x-full');
      sidebar.classList.remove('translate-x-0');
      sidebarOpen = false;
    }
  }
});

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  renderNavbarMenu();
  renderNavbarRight();
  renderSidebarMenu();
  renderUserInfo();
  renderProfileMenu();
  
  // Set initial sidebar state
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  
  if (window.innerWidth > 768 && sidebarOpen) {
    sidebar.classList.add('translate-x-0');
    sidebar.classList.remove('-translate-x-full');
    mainContent.style.marginLeft = '288px';
  } else {
    sidebar.classList.add('-translate-x-full');
    sidebar.classList.remove('translate-x-0');
    mainContent.style.marginLeft = '0';
    sidebarOpen = false;
  }
  
  // Add smooth loading animation
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '1';
  }, 100);
});