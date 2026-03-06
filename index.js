let prods = JSON.parse(localStorage.getItem('h_p')) || [];
let trans = JSON.parse(localStorage.getItem('h_t')) || [];
let mode = "";

function showSection(id) {
    document.querySelectorAll('.admin-panel').forEach(s => s.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    renderInv();
    renderRep();
}

function addItem() {
    const n = document.getElementById('pName').value;
    const p = document.getElementById('pPrice').value;
    const q = parseInt(document.getElementById('pQty').value);
    if(n && p && q) {
        prods.push({n, p, q});
        update();
    }
}

function renderInv() {
    const b = document.getElementById('invBody');
    b.innerHTML = prods.map((x, i) => `<tr><td>${x.n}</td><td>${x.p}</td><td>${x.q}</td><td><button onclick="prods.splice(${i},1);update()">X</button></td></tr>`).join('');
}

function setOp(m) {
    mode = m;
    document.getElementById('opForm').style.display = 'block';
    document.getElementById('opTitle').innerText = m == 'sell' ? 'فاتورة بيع' : 'إذن شراء';
    const s = document.getElementById('prodSelector');
    s.innerHTML = prods.map((x, i) => `<div>${x.n} <input type="number" class="q-in" data-i="${i}" placeholder="العدد" style="width:50px;"></div>`).join('');
}

function checkPay() {
    document.getElementById('debtBox').style.display = document.getElementById('payType').value == 'debt' ? 'block' : 'none';
}

function confirmOp() {
    const name = document.getElementById('partyName').value;
    let total = 0;
    let items = [];
    document.querySelectorAll('.q-in').forEach(input => {
        const v = parseInt(input.value);
        if(v > 0) {
            const i = input.dataset.i;
            items.push(`${prods[i].n}(${v})`);
            total += prods[i].p * v;
            prods[i].q = mode == 'sell' ? prods[i].q - v : prods[i].q + v;
        }
    });
    const paid = document.getElementById('paidAmt').value || total;
    trans.push({
        d: new Date().toLocaleString('ar-EG'),
        t: mode == 'sell' ? 'بيع' : 'شراء',
        p: name,
        i: items.join(', '),
        tot: total,
        s: document.getElementById('payType').value == 'debt' ? `آجل (باقي:${total-paid})` : 'كاش'
    });
    localStorage.setItem('h_t', JSON.stringify(trans));
    update();
    alert("تم الحفظ بنجاح!");
}

function renderRep() {
    const b = document.getElementById('repBody');
    b.innerHTML = trans.map(x => `<tr><td>${x.d}</td><td>${x.t}</td><td>${x.p}</td><td>${x.i}</td><td>${x.tot}</td><td>${x.s}</td></tr>`).join('');
}

function update() {
    localStorage.setItem('h_p', JSON.stringify(prods));
    renderInv();
    renderRep();
}

function downloadExcel() {
    window.print(); // أسهل طريقة للموبايل لحفظ الصفحة PDF أو طباعتها
}
