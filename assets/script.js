let db = null;

async function loadContentByParams(params) {
  const contentBox = document.getElementById('content');

  if (!params || [...params].length === 0) {
    history.pushState({}, '', './');
    contentBox.innerHTML = 'Ini adalah halaman beranda.';
    return;
  }

  // Ambil parameter pertama, misalnya: ?p=content1 atau ?b=blog1
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

async function init() {
  const res = await fetch('./database.json');
  db = await res.json();

  const sidebar = document.getElementById('sidebar');
  db.sidebar.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<i class="bi ${item.icon}"></i> <span>${item.text}</span>`;
    li.addEventListener('click', () => {
      if (!item.parameter) {
        // Beranda
        loadContentByParams(new URLSearchParams());
      } else {
        const params = new URLSearchParams();
        params.set(item.parameter, item.url);
        loadContentByParams(params);
      }
    });
    sidebar.appendChild(li);
  });

  // Load konten dari URL saat pertama kali
  const currentParams = new URLSearchParams(window.location.search);
  loadContentByParams(currentParams);
}

// Tangani tombol kembali/maju browser
window.addEventListener('popstate', () => {
  const currentParams = new URLSearchParams(window.location.search);
  loadContentByParams(currentParams);
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
