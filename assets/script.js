let db = null;

async function loadContentByParams(params) {
  const contentBox = document.getElementById('content');

  if (!params || [...params].length === 0) {
    history.pushState({}, '', './');
    contentBox.innerHTML = 'Ini adalah halaman beranda.';
    return;
  }

  const [paramKey, paramValue] = params.entries().next().value;
  const dir = db.content[paramKey];

  if (!dir || !paramValue) {
    contentBox.textContent = 'Konten tidak ditemukan.';
    return;
  }

  const filePath = `./${dir}/${paramValue}.html`;

  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error();
    const html = await res.text();
    contentBox.innerHTML = html;
    history.pushState({}, '', `?${paramKey}=${paramValue}`);
  } catch (e) {
    contentBox.textContent = 'Gagal memuat konten.';
  }
}

function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  const items = db.sidebar;

  const parentMap = {};
  const childrenMap = {};

  // Pisahkan item dengan dan tanpa parent
  items.forEach(item => {
    if (item.parent) {
      if (!childrenMap[item.parent]) childrenMap[item.parent] = [];
      childrenMap[item.parent].push(item);
    } else {
      const id = item.id || Math.random().toString(36).substring(2);
      parentMap[id] = item;
    }
  });

  // Render sidebar menu
  Object.entries(parentMap).forEach(([id, item]) => {
    const li = document.createElement('li');
    li.classList.add('menu-item');
    li.innerHTML = `<i class=\"bi ${item.icon}\"></i> <span>${item.text}</span>`;

    if (item.static && childrenMap[id]) {
      // Expand/collapse button
      const expandBtn = document.createElement('span');
      expandBtn.classList.add('expand-btn');
      expandBtn.innerHTML = '<i class="bi bi-chevron-down"></i>';
    li.appendChild(expandBtn);

    // Bungkus parent dan submenu dalam satu container agar submenu selalu di bawah parent
    const menuContainer = document.createElement('div');
    menuContainer.classList.add('menu-parent-container');
    menuContainer.appendChild(li);

    const submenu = document.createElement('ul');
    submenu.classList.add('submenu');
    submenu.style.maxHeight = '0';
    submenu.style.overflow = 'hidden';
    submenu.style.transition = 'max-height 0.3s cubic-bezier(0.4,0,0.2,1)';

    childrenMap[id].forEach(child => {
      const subLi = document.createElement('li');
      subLi.innerHTML = `<i class="bi ${child.icon}"></i> <span>${child.text}</span>`;
      subLi.addEventListener('click', (e) => {
        e.stopPropagation();
        const params = new URLSearchParams();
        if (child.parameter) params.set(child.parameter, child.url);
        loadContentByParams(params);
      });
      submenu.appendChild(subLi);
    });

    menuContainer.appendChild(submenu);

    let expanded = false;
    function toggleSubmenu() {
      expanded = !expanded;
      if (expanded) {
        submenu.style.maxHeight = submenu.scrollHeight + 'px';
        expandBtn.innerHTML = '<i class="bi bi-chevron-up"></i>';
        li.classList.add('expanded');
      } else {
        submenu.style.maxHeight = '0';
        expandBtn.innerHTML = '<i class="bi bi-chevron-down"></i>';
        li.classList.remove('expanded');
      }
    }
    // Parent dan caret bisa di klik
    li.addEventListener('click', (e) => {
      if (e.target === li || e.target === expandBtn || e.target.closest('.expand-btn')) {
        toggleSubmenu();
      }
    });
    expandBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSubmenu();
    });
    sidebar.appendChild(menuContainer);
  } else {
    li.addEventListener('click', () => {
      const params = new URLSearchParams();
      if (item.parameter) params.set(item.parameter, item.url);
      loadContentByParams(params);
    });
    sidebar.appendChild(li);
  }
  });
}

async function init() {
  const res = await fetch('./database.json');
  db = await res.json();

  renderSidebar();

  const currentParams = new URLSearchParams(window.location.search);
  loadContentByParams(currentParams);
}

window.addEventListener('popstate', () => {
  const currentParams = new URLSearchParams(window.location.search);
  loadContentByParams(currentParams);
});

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleSidebar');
  const app = document.getElementById('app');

  toggleBtn.addEventListener('click', () => {
    app.classList.toggle('sidebar-hidden');
  });

  init();
});
