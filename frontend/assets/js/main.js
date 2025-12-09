const WA_PHONE = "6281234567890"; // REPLACE WITH EARNEST APPAREL WA NUMBER

// --- CONFIGURATION ---
// Gunakan logika ini:
// Jika dibuka di localhost, pakai http://localhost:5000
// Jika dibuka di Vercel, pakai relative path /api/products
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api/products'
    : '/api/products'; 

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
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Gagal mengambil data dari server');
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

async function renderProductGrid() {
    const grid = document.getElementById('product-grid');
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
            // Perhatikan penggunaan item.id (MongoDB ID)
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
    
    const details = item.details || { material: '-', color: '-', size: '-' };

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

async function renderAdminProductTable() {
    const tbody = document.querySelector('#admin-product-table tbody');
    if(!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
    
    const products = await getProducts();
    tbody.innerHTML = '';
    
    products.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id.substring(0, 8)}...</td>
            <td><img src="${item.image}" style="width:50px; height:50px; object-fit:cover;"></td>
            <td>${item.title}</td>
            <td>${item.category}</td>
            <td>
                <button class="btn-danger" onclick="deleteProduct('${item.id}')">Hapus</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function initAddProductForm() {
    const form = document.getElementById('add-product-form');
    if(!form) return;

    form.addEventListener('submit', async (e) => {
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
                    form.reset();
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

window.deleteProduct = async function(id) {
    if(confirm('Yakin ingin menghapus produk ini?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
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

function initLoginForm() {
    const form = document.getElementById('login-form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('username').value;
            const p = document.getElementById('password').value;
            if (u === 'admin' && p === 'admin123') {
                window.location.href = 'admin-dashboard.html';
            } else {
                alert('Login Gagal');
            }
        });
    }
}
