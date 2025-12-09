// --- CONFIGURATION ---
const WA_PHONE = "6281234567890"; // REPLACE WITH EARNEST APPAREL WA NUMBER

// --- CONFIGURATION ---
const API_URL = '/api/products'; // Endpoint Node.js kita

// --- FIREBASE CONFIGURATION ---
// Ganti dengan config asli dari Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyD...",
    authDomain: "earnest-apparel.firebaseapp.com",
    projectId: "earnest-apparel",
    storageBucket: "earnest-apparel.appspot.com",
    messagingSenderId: "...",
    appId: "..."
};

// Initialize Firebase (Cek apakah script firebase sudah dimuat di HTML)
let db;
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase Connected");
} else {
    console.log("Running in Local Mode (No Firebase)");
}

// Ubah mode ke 'FIREBASE' jika script sudah dipasang
const DB_MODE = (typeof firebase !== 'undefined') ? 'FIREBASE' : 'LOCAL'; 

// --- DEFAULT PRODUCTS DATA (Initial Data) ---
const defaultProducts = [
    {
        id: 101,
        title: "Kemeja PDH / PDL",
        category: "PDH",
        description: "Cocok untuk organisasi, himpunan, atau seragam kantor. Bahan American Drill.",
        image: "https://via.placeholder.com/400x300?text=PDH+Kemeja",
        details: { material: "American Drill", color: "Custom (Bebas)", size: "S - 5XL" }
    },
    {
        id: 102,
        title: "Jersey Full Printing",
        category: "Jersey",
        description: "Untuk tim futsal, e-sport, voli. Bahan Dryfit Milano anti luntur.",
        image: "https://via.placeholder.com/400x300?text=Jersey+Full+Print",
        details: { material: "Dryfit Milano/Benzema", color: "Full Color Sublim", size: "XS - 4XL" }
    },
    {
        id: 103,
        title: "Polo Shirt",
        category: "Polo",
        description: "Kaos berkerah semi-formal. Bahan Lacoste CVC.",
        image: "https://via.placeholder.com/400x300?text=Polo+Shirt",
        details: { material: "Lacoste CVC 24s", color: "Hitam, Putih, Navy, Maroon", size: "S - 3XL" }
    },
    {
        id: 104,
        title: "Jaket & Hoodie",
        category: "Jaket",
        description: "Bomber, Parka, Varsity. Bahan Taslan/Fleece.",
        image: "https://via.placeholder.com/400x300?text=Jaket+Bomber",
        details: { material: "Taslan Waterproof / Fleece", color: "Custom", size: "S - XXL" }
    }
];

// --- produk DATA ---
const produk = [
    {
        id: 1,
        title: "PDH Kemeja Organisasi",
        category: "PDH",
        description: "Kemeja PDH elegan untuk organisasi mahasiswa dengan bordir komputer presisi.",
        variations: {
            bahan: "American Drill",
            warna: "Navy Blue & White",
            metode: "Bordir Komputer"
        },
        images: ["https://via.placeholder.com/800x600?text=PDH+Front", "https://via.placeholder.com/800x600?text=PDH+Detail"],
        notes: "Minimal order 12 pcs."
    },
    {
        id: 2,
        title: "Jersey Futsal Full Print",
        category: "Jersey",
        description: "Jersey dry-fit nyaman dengan desain custom full sublimation.",
        variations: {
            bahan: "Dry-Fit Milano",
            warna: "Custom Gradient Red",
            metode: "Sublimation Printing"
        },
        images: ["https://via.placeholder.com/800x600?text=Jersey+Front", "https://via.placeholder.com/800x600?text=Jersey+Back"],
        notes: "Desain bebas, pengerjaan 7-10 hari."
    },
    {
        id: 3,
        title: "Jaket Bomber Komunitas",
        category: "Jaket",
        description: "Jaket bomber waterproof dengan inner furing quilting yang hangat.",
        variations: {
            bahan: "Taslan Waterproof",
            warna: "Army Green",
            metode: "Bordir Emblem"
        },
        images: ["https://via.placeholder.com/800x600?text=Bomber+Jacket"],
        notes: "Tersedia ukuran S - 4XL."
    },
    {
        id: 4,
        title: "Polo Shirt Event",
        category: "Polo",
        description: "Kaos kerah lacoste cotton untuk panitia event.",
        variations: {
            bahan: "Lacoste CVC",
            warna: "Hitam",
            metode: "Bordir Dada Kiri"
        },
        images: ["https://via.placeholder.com/800x600?text=Polo+Shirt"],
        notes: "Nyaman dan menyerap keringat."
    },
    {
        id: 5,
        title: "Lanyard ID Card",
        category: "Lanyard",
        description: "Tali ID Card printing 2 sisi dengan stopper.",
        variations: {
            bahan: "Tissue Polyester",
            warna: "Full Color",
            metode: "Digital Printing"
        },
        images: ["https://via.placeholder.com/800x600?text=Lanyard"],
        notes: "Lebar 2cm, kait besi."
    }
];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    buildNavbarActiveState();
    initMobileMenu();
    initFloatingWA();
    
    // Portfolio Page Logic
    if (document.getElementById('portfolio-grid')) {
        renderPortfolioGrid('All');
        initFilterButtons();
    }

    // Product Page Logic
    if (document.getElementById('product-grid')) {
        renderProductGrid();
    }

    // Admin Dashboard Logic
    if (document.getElementById('admin-product-table')) {
        checkAuth(); // Protect page
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
            link.setAttribute('aria-current', 'page');
        }
    });
}

function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav-links');
    
    if(toggle) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const expanded = nav.classList.contains('active');
            toggle.setAttribute('aria-expanded', expanded);
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

// --- PRODUCT LOGIC (ASYNC REFACTOR) ---

async function getProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("Gagal mengambil data:", error);
        return [];
    }
}

// Fungsi saveProducts tidak lagi dipakai langsung untuk menyimpan seluruh array,
// karena kita menggunakan POST dan DELETE ke API.
// Namun kita biarkan kosong atau hapus agar tidak error jika ada yang memanggil.
async function saveProducts(products) {
    console.warn("saveProducts deprecated in Node.js mode. Use API calls.");
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
            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="card-img">
                <div class="card-body">
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-text">${item.description}</p>
                    <span class="badge" style="margin-bottom:10px; display:inline-block;">${item.category}</span>
                    <button class="btn btn-outline" onclick="openProductModal(${item.id})">
                        Lihat Detail
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        grid.innerHTML = '<p style="text-align:center; color:red;">Gagal memuat produk.</p>';
    }
}

// New Function: Open Product Modal
window.openProductModal = function(productId) {
    const products = getProducts();
    const item = products.find(p => p.id === productId);
    if (!item) return;

    const modal = document.getElementById('product-modal');
    const content = modal.querySelector('.modal-content');
    
    // Handle missing details for old data
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
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
};

window.closeProductModal = function() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
};

// Close Product Modal on ESC or Click Outside
document.getElementById('product-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'product-modal') closeProductModal();
});

// --- ADMIN LOGIC ---

function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

function initLoginForm() {
    const form = document.getElementById('login-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('username').value;
        const p = document.getElementById('password').value;

        // DUMMY CREDENTIALS
        if (u === 'admin' && p === 'admin123') {
            sessionStorage.setItem('admin_logged_in', 'true');
            window.location.href = 'admin-dashboard.html';
        } else {
            alert('Username atau Password salah!');
        }
    });
}

function logout() {
    sessionStorage.removeItem('admin_logged_in');
    window.location.href = 'login.html';
}

async function renderAdminProductTable() {
    const tbody = document.querySelector('#admin-product-table tbody');
    tbody.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';
    
    const products = await getProducts();
    tbody.innerHTML = '';
    
    products.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id}</td>
            <td><img src="${item.image}" style="width:50px; height:50px; object-fit:cover;"></td>
            <td>${item.title}</td>
            <td>${item.category}</td>
            <td>
                <button class="btn-danger" onclick="deleteProduct(${item.id})">Hapus</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function initAddProductForm() {
    const form = document.getElementById('add-product-form');
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
                // KIRIM KE NODE.JS SERVER
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newProduct)
                });

                if (response.ok) {
                    form.reset();
                    renderAdminProductTable();
                    alert('Produk berhasil ditambahkan!');
                } else {
                    alert('Gagal menyimpan ke server.');
                }
            } catch (error) {
                console.error(error);
                alert('Terjadi kesalahan koneksi.');
            }
        };

        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                sendData(event.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            sendData("https://via.placeholder.com/400x300?text=No+Image");
        }
    });
}

window.deleteProduct = async function(id) {
    if(confirm('Yakin ingin menghapus produk ini?')) {
        try {
            // REQUEST DELETE KE NODE.JS SERVER
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                renderAdminProductTable();
            } else {
                alert('Gagal menghapus produk.');
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan koneksi.');
        }
    }
};

// --- produk LOGIC ---

function renderprodukGrid(category) {
    const grid = document.getElementById('produk-grid');
    grid.innerHTML = ''; // Clear existing

    const filteredItems = category === 'All' 
        ? produk 
        : produk.filter(item => item.category === category);

    filteredItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${item.images[0]}" alt="${item.title}" class="card-img" loading="lazy">
            <div class="card-body">
                <span style="color: #666; font-size: 0.8rem; text-transform: uppercase;">${item.category}</span>
                <h3 class="card-title">${item.title}</h3>
                <p class="card-text">${item.description.substring(0, 60)}...</p>
                <button class="btn btn-outline" onclick="openModal(${item.id})">View Details</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function initFilterButtons() {
    const container = document.getElementById('produk-filters');
    if (!container) return;

    // Get unique categories
    const categories = ['All', ...new Set(produk.map(item => item.category))];

    container.innerHTML = categories.map(cat => 
        `<button class="filter-btn ${cat === 'All' ? 'active' : ''}" data-category="${cat}">${cat}</button>`
    ).join('');

    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Render grid
            renderprodukGrid(e.target.dataset.category);
        }
    });
}

// --- MODAL LOGIC ---

window.openModal = function(itemId) {
    const item = produk.find(p => p.id === itemId);
    if (!item) return;

    const modal = document.getElementById('produk-modal');
    const content = modal.querySelector('.modal-content');
    
    // Build Variations List
    let variationsHtml = '';
    for (const [key, value] of Object.entries(item.variations)) {
        variationsHtml += `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}`;
    }

    content.innerHTML = `
        <button class="modal-close" onclick="closeModal()" aria-label="Close modal">&times;</button>
        <div class="modal-gallery">
            <img src="${item.images[0]}" alt="${item.title}">
        </div>
        <div class="modal-details">
            <span style="background: #eee; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">${item.category}</span>
            <h2>${item.title}</h2>
            <p>${item.description}</p>
            <div class="modal-meta">
                ${variationsHtml}
                <strong>Notes:</strong> ${item.notes}
            </div>
            <button class="btn" onclick="openWhatsAppForInquiry(${item.id})">
                <i class="fab fa-whatsapp"></i> Inquire via WhatsApp
            </button>
        </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    
    // Trap focus logic could go here
    content.querySelector('.modal-close').focus();
};

window.closeModal = function() {
    const modal = document.getElementById('produk-modal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
};

// Close on ESC or click outside
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});
document.getElementById('produk-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'produk-modal') closeModal();
});

window.openWhatsAppForInquiry = function(itemId) {
    // Check if itemId is an object (from product page) or ID (from produk)
    let title, category;

    if (typeof itemId === 'object') {
        // Called from Product page directly
        title = itemId.title;
        category = itemId.category;
    } else {
        // Called from produk ID
        const item = produk.find(p => p.id === itemId);
        if (!item) return;
        title = item.title;
        category = item.category;
    }

    const msg = `Halo Earnest Apparel, I would like to inquire about:\n\n• Item: ${title}\n• Category: ${category}\n\nPlease share pricing & lead time.`;
    window.open(`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
};
