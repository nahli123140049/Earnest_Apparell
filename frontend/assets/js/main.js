const WA_PHONE = "6285179721744"; // REPLACE WITH EARNEST APPAREL WA NUMBER 

// --- CONFIGURATION ---
// Fix API_URL: Pastikan mengarah ke port 5000 jika di localhost
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
    ? 'http://localhost:5000/api' 
    : '/api'; 

// Variabel Global untuk menyimpan data produk
window.currentProducts = [];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    buildNavbarActiveState();
    initMobileMenu();
    initFloatingWA();
    
    // Product Page Logic
    if (document.getElementById('product-grid')) {
        renderProductGrid();
    }

    // Admin Dashboard Logic
    if (document.getElementById('admin-product-table')) {
        renderAdminProductTable();
        initAddProductForm();
        initEditProductForm(); // Pastikan fungsi ini dipanggil
        initCMSForms();
    }

    // Login Page Logic
    if (document.getElementById('login-form')) {
        initLoginForm();
    }
});

// --- FUNCTIONS ---

function buildNavbarActiveState() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-links');
    if(toggle) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
}

function initFloatingWA() {
    const btn = document.querySelector('.floating-wa');
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const msg = "Halo Earnest Apparel, saya ingin bertanya mengenai produk anda.";
            window.open(`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
        });
    }
}

// --- PRODUCT LOGIC (API FETCH) ---

async function getProducts() {
    try {
        // PERBAIKAN: Tambahkan '/products' karena API_URL sekarang adalah base path
        // Tambahkan timestamp agar data selalu fresh (tidak cache)
        const response = await fetch(`${API_URL}/products?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error('Gagal mengambil data dari server');
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

async function renderProductGrid() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = '<p style="text-align:center; width:100%;">Loading products...</p>';
    
    try {
        const products = await getProducts();
        grid.innerHTML = '';
        
        if (products.length === 0) {
            grid.innerHTML = '<p style="text-align:center; width:100%;">Belum ada produk.</p>';
            return;
        }

        products.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="card-img">
                <div class="card-body">
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-text">${item.description}</p>
                    <span class="badge" style="margin-bottom:10px; display:inline-block;">${item.category}</span>
                    <button class="btn btn-outline" onclick="openProductModal('${item.id}')">
                        Lihat Detail
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        grid.innerHTML = '<p style="text-align:center; color:red;">Gagal memuat produk. Pastikan Backend jalan.</p>';
    }
}

window.openProductModal = async function(productId) {
    const products = await getProducts();
    const item = products.find(p => p.id === productId);
    if (!item) return;

    const modal = document.getElementById('product-modal');
    const content = modal.querySelector('.modal-content');
    
    const details = item.details || { material: '-', color: '-', size: '-', embroidery: '-' };

    content.innerHTML = `
        <button class="modal-close" onclick="closeProductModal()" aria-label="Close modal">&times;</button>
        <div class="modal-gallery">
            <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="modal-details">
            <span style="background: #eee; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">${item.category}</span>
            <h2>${item.title}</h2>
            <p style="margin-bottom: 20px;">${item.description}</p>
            
            <div class="modal-meta" style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin-bottom:10px; color:var(--primary-color);">Spesifikasi:</h4>
                <p><strong>Bahan:</strong> ${details.material}</p>
                <p><strong>Warna:</strong> ${details.color}</p>
                <p><strong>Ukuran:</strong> ${details.size}</p>
                <p><strong>Jenis Bordir/Sablon:</strong> ${details.embroidery || '-'}</p>
            </div>

            <button class="btn" style="width: 100%;" onclick="openWhatsAppForInquiry({title: '${item.title}', category: '${item.category}'})">
                <i class="fab fa-whatsapp"></i> Tanya via WhatsApp
            </button>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.closeProductModal = function() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
};

window.openWhatsAppForInquiry = function(item) {
    const msg = `Halo Earnest Apparel, saya ingin bertanya tentang produk: ${item.title} (${item.category})`;
    window.open(`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
};

// --- ADMIN LOGIC ---

// --- ADMIN: RENDER TABLE ---
async function renderAdminProductTable() {
    const tbody = document.querySelector('#admin-product-table tbody');
    if(!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
    
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error(`Server Error: ${response.status} ${response.statusText}`);
        }
        
        window.currentProducts = await response.json(); 
        tbody.innerHTML = '';
        
        if (window.currentProducts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Belum ada produk.</td></tr>';
            return;
        }

        window.currentProducts.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${item.image}" style="width:50px; height:50px; object-fit:cover;"></td>
                <td>${item.title}</td>
                <td>${item.category}</td>
                <td>
                    <button class="btn-outline" style="padding:5px 10px; font-size:0.8rem; margin-right:5px; cursor:pointer;" onclick="openEditModal('${item.id}')">Edit</button>
                    <button class="btn-danger" style="padding:5px 10px; font-size:0.8rem; cursor:pointer;" onclick="deleteProduct('${item.id}')">Hapus</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { 
        console.error("Gagal memuat data:", e); 
        tbody.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">Gagal memuat data: ${e.message}<br>Pastikan Backend berjalan (npm start).</td></tr>`;
    }
}

// --- ADMIN: EDIT PRODUCT LOGIC ---
window.openEditModal = function(id) {
    const item = window.currentProducts.find(p => p.id === id);
    if (!item) {
        alert("Data produk tidak ditemukan di memori browser. Coba refresh.");
        return;
    }

    const details = item.details || {};
    
    document.getElementById('edit_id').value = item.id;
    document.getElementById('edit_title').value = item.title;
    document.getElementById('edit_category').value = item.category;
    document.getElementById('edit_material').value = details.material || '';
    document.getElementById('edit_color').value = details.color || '';
    document.getElementById('edit_size').value = details.size || '';
    
    // Handle field embroidery jika ada
    const editEmbroidery = document.getElementById('edit_embroidery');
    if(editEmbroidery) editEmbroidery.value = details.embroidery || '';

    document.getElementById('edit_desc').value = item.description;
    document.getElementById('edit_current_image').value = item.image;
    document.getElementById('edit_image_file').value = '';

    document.getElementById('edit-product-modal').classList.add('active');
};

window.closeEditModal = function() {
    document.getElementById('edit-product-modal').classList.remove('active');
};

function initEditProductForm() {
    const form = document.getElementById('edit-product-form');
    if(!form) return;

    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    newForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = newForm.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        btn.innerText = "Menyimpan...";
        btn.disabled = true;

        const id = document.getElementById('edit_id').value;
        const fileInput = document.getElementById('edit_image_file');
        let imgUrl = document.getElementById('edit_current_image').value;

        if (fileInput.files[0]) {
            try { 
                imgUrl = await compressImage(fileInput.files[0], 800, 0.7); 
            } catch (err) { 
                alert("Gagal proses gambar."); 
                btn.innerText = originalText;
                btn.disabled = false;
                return; 
            }
        }

        const editEmbroidery = document.getElementById('edit_embroidery');
        const embroideryVal = editEmbroidery ? editEmbroidery.value : "-";

        const updatedData = {
            title: document.getElementById('edit_title').value,
            category: document.getElementById('edit_category').value,
            description: document.getElementById('edit_desc').value,
            image: imgUrl,
            details: {
                material: document.getElementById('edit_material').value,
                color: document.getElementById('edit_color').value,
                size: document.getElementById('edit_size').value,
                embroidery: embroideryVal
            }
        };

        try {
            const res = await fetch(`${API_URL}/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (res.ok) {
                alert('Produk berhasil diupdate!');
                closeEditModal();
                renderAdminProductTable();
            } else {
                alert('Gagal update produk.');
            }
        } catch (e) { 
            console.error(e);
            alert('Error koneksi.'); 
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
}

async function initCMSForms() {
    // Hanya untuk halaman admin-dashboard.html
    if (window.location.pathname.split('/').pop() !== 'admin-dashboard.html') return;

    // --- ADD PRODUCT FORM ---
    const addForm = document.getElementById('add-product-form');
    if(addForm) {
        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const title = document.getElementById('p_title').value;
            const category = document.getElementById('p_category').value;
            const desc = document.getElementById('p_desc').value;
            const material = document.getElementById('p_material').value || "-";
            const color = document.getElementById('p_color').value || "-";
            const size = document.getElementById('p_size').value || "-";
            const fileInput = document.getElementById('p_image_file');
            const file = fileInput.files[0];

            const sendData = async (imgUrl) => {
                const newProduct = {
                    title: title,
                    category: category,
                    description: desc,
                    image: imgUrl,
                    details: { material, color, size }
                };

                try {
                    const response = await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newProduct)
                    });

                    if (response.ok) {
                        addForm.reset();
                        renderAdminProductTable();
                        alert('Produk berhasil disimpan ke Database!');
                    } else {
                        alert('Gagal menyimpan ke server.');
                    }
                } catch (error) {
                    console.error(error);
                    alert('Terjadi kesalahan koneksi ke Backend.');
                }
            };

            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) { sendData(event.target.result); };
                reader.readAsDataURL(file);
            } else {
                sendData("https://via.placeholder.com/400x300?text=No+Image");
            }
        });
    }
}

window.deleteProduct = async function(id) {
    if(confirm('Yakin ingin menghapus produk ini?')) {
        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                renderAdminProductTable();
            }
        } catch (error) {
            console.error(error);
        }
    }
};

// --- AUTH LOGIC ---
window.logout = function() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        // Redirect ke halaman login
        window.location.href = 'login.html';
    }
};

function initLoginForm() {
    const form = document.getElementById('login-form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;
            if (u === 'admin' && p === 'admin123') {
                // Opsional: Simpan status login jika ingin proteksi halaman
                // localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'admin-dashboard.html';
            } else {
                alert('Login Gagal');
            }
        });
    }
}
