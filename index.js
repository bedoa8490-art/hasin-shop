// نظام تخزين البيانات (المخزن والعملاء) في ذاكرة المتصفح
let inventory = {}; 
let salesData = JSON.parse(localStorage.getItem('hussein_sales')) || [];

Document.addEventListener('DOMContentLoaded', () => {
    updateAdminTable(); // تحديث جدول الإدارة عند الفتح

    fetch('products.json')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('sections');
            container.innerHTML = '';
            const list = [...data.liquids, ...data.tools];
            
            list.forEach(p => {
                // تسجيل الكمية في النظام (افتراضياً 100 لكل منتج لو مش متحدد)
                inventory[p.name] = 100; 

                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div style="font-size: 50px; margin-bottom: 15px;">✨</div>
                    <h3>${p.name}</h3>
                    <p style="color: red; font-weight: bold;">${p.price} جنيه</p>
                    <div style="margin-bottom:10px; font-size:0.8rem;">المخزن: <span id="stock-${p.name}">100</span></div>
                    <button style="background:red; color:white; border:none; padding:10px; border-radius:5px; cursor:pointer;" 
                            onclick="processOrder('${p.name}', ${p.price})">اطلب الآن</button>
                `;
                container.appendChild(card);
            });
        });
});

// وظيفة معالجة الأوردر وتسجيله (كاش وآجل)
function processOrder(productName, price) {
    const customerName = prompt("اسم الزبون:");
    if (!customerName) return;

    const paid = prompt(`المبلغ المدفوع (سعر المنتج ${price}):`, price);
    const change = price - paid;
    const status = change > 0 ? "آجل" : "كاش";

    // تسجيل البيعة
    const sale = {
        customer: customerName,
        product: productName,
        paid: paid,
        remaining: change,
        date: new Date().toLocaleString('ar-EG')
    };

    salesData.push(sale);
    localStorage.setItem('hussein_sales', JSON.stringify(salesData));

    // تحديث المخزن (وهمي للعرض)
    inventory[productName]--;
    document.getElementById(`stock-${productName}`).innerText = inventory[productName];

    updateAdminTable();
    
    // فتح واتساب للطلب
    const msg = `يا حسين، الزبون ${customerName} محتاج ${productName}. الحساب: ${price}، دفع: ${paid}، الباقي (آجل): ${change}`;
    window.open(`https://wa.me/201234567890?text=${encodeURIComponent(msg)}`);
}

// تحديث جدول الإدارة بالبيانات الجديدة
function updateAdminTable() {
    const tableBody = document.getElementById('adminTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    salesData.forEach(s => {
        const row = `
            <tr>
                <td>${s.customer}</td>
                <td>${s.product}</td>
                <td>${s.paid} ج.م</td>
                <td style="color: ${s.remaining > 0 ? 'red' : 'white'}">${s.remaining} ج.م</td>
                <td>${s.date}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// الوظيفة القديمة للحفاظ على التوافق (القاعدة 3)
function order(name) { 
    window.open(`https://wa.me/201234567890?text=يا حسين محتاج ${name}`); 
}
