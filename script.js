// script.js – Versi Rasmi Stabil (Padan 100% dengan HTML & JSON Terbaru)
// Tarikh: 10-05-2025 | Masa: 20:45 SGT (disesuaikan)
// Jumlah Baris: (mungkin berubah)

let pantunAsal = [];
let pantunList = [];
let currentIndex = 0;

// Muat pantun apabila halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  // Betulkan laluan ke 'data/pantun.json' seperti yang Cikgu minta
  fetch('data/pantun.json')
    .then(response => response.json())
    .then(data => {
      pantunList = data;
      pantunAsal = data; // Salin kekal
      populateDropdown();
      populateFilterGrid();
      displayPantun(pantunList[0]);
    });

  // Tambah fungsi butang
  const btn = document.getElementById("btnSeterusnya");
  if (btn) btn.addEventListener("click", goToTazkirah);
});

// Papar satu pantun
function displayPantun(pantun) {
  document.getElementById('pantun_id').textContent = pantun.pantun_id;

  // Memecah teks pantun menjadi baris-baris
  const barisPantun = pantun.text.split('\n');
  document.getElementById('baris1').textContent = barisPantun[0] || '';
  document.getElementById('baris2').textContent = barisPantun[1] || '';
  document.getElementById('baris3').textContent = barisPantun[2] || '';
  document.getElementById('baris4').textContent = barisPantun[3] || '';

  // Menampilkan makna perkataan (tetap sebagai string)
  const maknaPerkataanElement = document.getElementById('maknaPerkataan');
  if (maknaPerkataanElement) {
    maknaPerkataanElement.textContent = pantun.makna_perkataan || '';
  }

  document.getElementById('tema').textContent = pantun.tema_pantun || "Tiada tema";
  document.getElementById('huraian').textContent = pantun.huraian_maksud_pantun || "Tiada huraian";
  document.getElementById('isu').textContent = pantun.isu_dalam_pantun || "Tiada isu";

  // Karena properti 'maksud_pembayang' dan 'maksud_pantun' tidak ada dalam JSON Anda,
  // kita akan menetapkan nilai default atau Anda bisa menambahkan properti ini ke JSON.
  document.getElementById('maksudPembayang').textContent = "Tiada maksud pembayang";
  document.getElementById('maksudPantun').textContent = "Tiada maksud pantun";
}

// Butang "Seterusnya"
function nextPantun() {
  currentIndex = (currentIndex + 1) % pantunList.length;
  displayPantun(pantunList[currentIndex]);
}

// Dropdown Tema
function populateDropdown() {
  const dropdown = document.getElementById('filter');
  if (!dropdown) return;

  const semuaTema = new Set(pantunAsal.map(p => p.tema_pantun).filter(Boolean));
  semuaTema.forEach(tema => {
    const option = document.createElement('option');
    option.value = tema;
    option.textContent = tema;
    dropdown.appendChild(option);
  });
}

// Tapis ikut dropdown
function filterPantun() {
  const selected = document.getElementById('filter').value;
  if (selected === 'ALL') {
    pantunList = pantunAsal;
    currentIndex = 0;
    displayPantun(pantunList[0]);
  } else {
    const tapis = pantunAsal.filter(p => p.tema_pantun && p.tema_pantun.includes(selected));
    if (tapis.length > 0) {
      pantunList = tapis;
      currentIndex = 0;
      displayPantun(pantunList[0]);
    }
  }
}

// Petak Tema
function populateFilterGrid() {
  const grid = document.getElementById('filterGrid');
  if (!grid) return;

  const filterOptions = ["Perpaduan & Irama Masyarakat", "Kepimpinan & Amanah"]; // Sesuaikan dengan tema di JSON Anda
  filterOptions.forEach(keyword => {
    const btn = document.createElement('button');
    btn.className = 'filterBtn';
    btn.textContent = keyword;
    btn.onclick = () => filterPantunGrid(keyword);
    grid.appendChild(btn);
  });
}

// Tapis ikut petak
function filterPantunGrid(keyword) {
  const hasil = pantunAsal.filter(p =>
    (p.tema_pantun && p.tema_pantun.includes(keyword)) ||
    (p.isu_dalam_pantun && p.isu_dalam_pantun.includes(keyword))
  );
  if (hasil.length > 0) {
    pantunList = hasil;
    currentIndex = 0;
    displayPantun(pantunList[0]);
  }
}

// Simpan ke sessionStorage dan ke tazkirah.html
function goToTazkirah() {
  const pantun = pantunList[currentIndex];
  sessionStorage.setItem("pantun_id", pantun.pantun_id);
  const barisPantun = pantun.text.split('\n');
  sessionStorage.setItem("baris1", barisPantun[0] || '');
  sessionStorage.setItem("baris2", barisPantun[1] || '');
  sessionStorage.setItem("baris3", barisPantun[2] || '');
  sessionStorage.setItem("baris4", barisPantun[3] || '');
  sessionStorage.setItem("maknaPerkataan", pantun.makna_perkataan || "");
  sessionStorage.setItem("tema", pantun.tema_pantun || "");
  sessionStorage.setItem("huraian", pantun.huraian_maksud_pantun || "");
  sessionStorage.setItem("isu", pantun.isu_dalam_pantun || "");
  sessionStorage.setItem("maksudPembayang", "Tiada maksud pembayang"); // Sesuaikan jika ada properti
  sessionStorage.setItem("maksudPantun", "Tiada maksud pantun");     // Sesuaikan jika ada properti
  window.location.href = "tazkirah.html";
}