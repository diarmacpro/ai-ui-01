let db = null;

async function loadContent(pageKey) {
  const contentBox = document.getElementById('content');

  if (!pageKey) {
    history.pushState({}, '', './');
    contentBox.innerHTML = 'Ini adalah halaman beranda.';
    return;
  }

  if (db.content[pageKey]) {
    try {
      const res = await fetch(db.content[pageKey]);
      const html = await res.text();
      contentBox.innerHTML = html;
      history.pushState({}, '', '?p=' + pageKey);
    } catch (e) {
      contentBox.textContent = 'Gagal memuat konten.';
    }
  } else {
    contentBox.textContent = 'Konten tidak ditemukan.';
  }
}

async function init() {
  const res = await fetch('./database.json');
  db = await res.json();

  const sidebar = document.getElementById('sidebar');
  db.sidebar.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<i class="bi ${item.icon}"></i> <span>${item.text}</span>`;
    li.addEventListener('click', () => {
      loadContent(item.url);
    });
    sidebar.appendChild(li);
  });

  const params = new URLSearchParams(window.location.search);
  const initialPage = params.get('p');
  loadContent(initialPage || "");
}

window.addEventListener('popstate', () => {
  const params = new URLSearchParams(window.location.search);
  loadContent(params.get('p') || "");
});

// Sidebar toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleSidebar');
  const app = document.getElementById('app');

  toggleBtn.addEventListener('click', () => {
    app.classList.toggle('sidebar-hidden');
  });

  init();
});
