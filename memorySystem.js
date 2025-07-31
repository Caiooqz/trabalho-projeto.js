
//Sistema de dados em memória
let products = [
    { id: 1, code: '1', description: 'Notebook Dell Inspiron 15', stock: 100, value: 2500, category: 'Categoria A'},
    { id: 2, code: '2', description: 'Mouse Logitech G PRO X', stock: 100, value: 800, category: 'Categoria A'},
    { id: 3, code: '3', description: 'Teclado Mecânico Corsair K95', stock: 100, value: 1000, category: 'Categoria B'}
];

let nextId = 4;
let editingProduct = null;

//Sistema de Login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    //Simulação de login (aceita qualquer email e senha)
    if (email && password) {
        alert('Login bem-sucedido!');
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboardScreen').style.display = 'block';
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});

//Sistema de Logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    document.getElementById('dashboardScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
});

//Navegação
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        const section = this.getAttribute('data-section');
        switchSection(section);

        //Update active link
        document.querySelectionAll('nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

function switchSection(section) {
    //Hide all sections
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('productsSection').style.display = 'none';
    document.getElementById('productFormSection').style.display = 'none';

    //Show the selected section
    if (section === 'dashboard') {
        document.getElementById('dashboardSection').style.display = 'block';
        updateDashboard();
    } else if (section === 'products') {
        document.getElementById('productsSection').style.display = 'block';
        updateProductTable();
    }
}

//Dashboard Updates
function updateDashboard() {
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const categoryAStock = products.filter(p => p.category === 'Categoria A').reduce((sum, p) => sum + p.stock, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.stock * p.value), 0);
    const totalProducts = products.length;
    
    document.getElementById('totalStock').textContent = totalStock;
    document.getElementById('categoryAStock').textContent = categoryAStock;
    document.getElementById('totalValue').textContent = `R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    document.getElementById('totalProducts').textContent = totalProducts;
}

//Product table updates 
function updateProductTable() {
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.code}</td>
            <td>${product.description}</td>
            <td>${product.stock}</td>
            <td>R$ ${product.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            <td>${product.category}</td>
            <td>
                <div class="action-menu">
                    <button class="action-btn" onclick="toggleActionMenu(this)">⋮</button>
                    <div class="action-dropdown">
                        <a class="dropdown-item" onclick="editProduct(${product.id})">✏️ Editar</a>
                        <a class="dropdown-item" onclick="deleteProduct(${product.id})">🗑️ Excluir</a>
                        <a class="dropdown-item">👁️ Vender</a>
                        <a class="dropdown-item">🛒 Comprar</a>
                    </div>
                </div>
            </td>
         `;
        tbody.appendChild(row);
    });
}

// Action menu toggle
function toggleActionMenu(button) {
    const dropdown = button.nextElementSibling;

    // Close other dropdowns
    document.querySelectorAll('.action-dropdown').forEach(d => {
        if (d !== dropdown) d.classList.remove('show');
    });

    dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.action-menu')) {
        document.querySelectorAll('.action-dropdown').forEach(d => d.classList.remove('show'));
    }
});

// Product form handling
document.getElementById('addProductBtn').addEventListener('click', function() {
    editingProduct = null;
    document.getElementById('formTitle').textContent = 'Cadastro de Produto';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    switchSection('form');
    document.getElementById('productFormSection').style.display = 'block';
    document.getElementById('productsSection').style.display = 'none';
});

document.getElementById('cancelBtn').addEventListener('click', function() {
    switchSection('products');
});

document.getElementById('productForm').addEventListener('submit', function(e) {
    e.proventDefault();

    const formData = {
        code: document.getElementById('productCode').value,
        description: document.getElementById('productDescription').value,
        stock: parseInt(document.getElementById('productStock').value),
        value: parseFloat(document.getElementById('productValue').value.replace(/[^\d,]/g, '').replace(',', '.')),
        category: document.getElementById('productCategory').value
    };

    if (editingProduct) {
        // Update existing product
        const index = products.findIndex(p => p.id === editingProduct.id);
        products[index] = { ...products[index], ...formData };
    } else {
        // Add new product
        products.push({ id: nextId++, ...formData });
    }

    switchSection('prducts');
    updateDashboard();
});

//Product actions
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        editingProduct = id;
        document.getElementById('formTitle').textContent = 'Editar Produto';
        document.getElementById('productId').value = product.id;
        document.getElementById('productCode').value = product.code;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productValue').value = product.value.toFixed(2).replace('.', ',');
        document.getElementById('productCategory').value = product.category;
                
        switchSection('form');
        document.getElementById('productFormSection').style.display = 'block';
        document.getElementById('productsSection').style.display = 'none';
    }
    
}

//Format currency input
document.getElementById('productValue').addEventListener('input', function() {
    let value = e.target.value.replace(/\D/g, '');
    value = (value / 100).toFixed(2);
    value = value.replace('.', ',');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    e.target.value = value;
});

//Inicialização do sistema
updateDashboard();
updateProductTable();
