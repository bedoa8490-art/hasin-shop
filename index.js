document.addEventListener('DOMContentLoaded', () => {
    fetch('products.json')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('sections');
            container.innerHTML = '';
            const list = [...data.liquids, ...data.tools];
            list.forEach(p => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div style="font-size: 50px; margin-bottom: 15px;">✨</div>
                    <h3>${p.name}</h3>
                    <p style="color: red; font-weight: bold;">${p.price} جنيه</p>
                    <button style="background:red; color:white; border:none; padding:10px; border-radius:5px; cursor:pointer;" onclick="order('${p.name}')">اطلب الآن</button>
                `;
                container.appendChild(card);
            });
        });
});
function order(name) { window.open(`https://wa.me/201234567890?text=يا حسين محتاج ${name}`); }
