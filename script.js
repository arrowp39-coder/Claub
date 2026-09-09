// ---- Notice toast ----
function showNotice(message){
  const n = document.getElementById('notice');
  n.textContent = message;
  n.classList.add('show');
  clearTimeout(window.__noticeTimer);
  window.__noticeTimer = setTimeout(()=>n.classList.remove('show'), 3200);
}

// ---- Product data ----
// Edit this array to add, remove, or update accounts for sale.
const LISTINGS = [
  { id:'ff-01', title:'Grandmaster Account', level:62, rank:'Grandmaster', diamonds:1200, skins:34, price:45, status:'available' },
  { id:'ff-02', title:'Heroic Starter Account', level:38, rank:'Heroic', diamonds:300,  skins:9,  price:18, status:'available' },
  { id:'ff-03', title:'Elite Bundle Account',  level:71, rank:'Grandmaster', diamonds:4500, skins:61, price:95, status:'available' },
  { id:'ff-04', title:'Platinum Value Account',level:45, rank:'Platinum', diamonds:600,  skins:14, price:25, status:'available' },
  { id:'ff-05', title:'Diamond Collector Account',level:55, rank:'Diamond', diamonds:2100, skins:40, price:60, status:'sold' },
  { id:'ff-06', title:'Rookie Account',        level:22, rank:'Gold',     diamonds:80,   skins:4,  price:9,  status:'available' },
];

let listingsOpen = false;

function toggleListings(){
  const panel = document.getElementById('listings');
  const btn = document.getElementById('toggle-ff');
  listingsOpen = !listingsOpen;
  panel.hidden = !listingsOpen;
  btn.textContent = listingsOpen ? 'Hide Products ↑' : 'View Products →';
  if(listingsOpen){
    renderListings();
    panel.scrollIntoView({behavior:'smooth', block:'start'});
  }
}

function renderListings(){
  const grid = document.getElementById('listing-grid');
  const countEl = document.getElementById('listing-count');
  const sort = document.getElementById('sort-select').value;

  const sorted = [...LISTINGS].sort((a,b)=>{
    if(sort === 'price-asc') return a.price - b.price;
    if(sort === 'price-desc') return b.price - a.price;
    if(sort === 'level-desc') return b.level - a.level;
    return 0;
  });

  const available = sorted.filter(l => l.status === 'available').length;
  countEl.textContent = `(${available} available)`;

  grid.innerHTML = sorted.map(l => `
    <div class="listing-card ${l.status === 'sold' ? 'is-sold' : ''}">
      <div class="listing-top">
        <span class="tag ${l.status === 'sold' ? 'muted' : ''}">${l.status === 'sold' ? 'SOLD' : 'AVAILABLE'}</span>
        <span class="listing-price">$${l.price}</span>
      </div>
      <h4>${l.title}</h4>
      <ul class="listing-specs">
        <li><span>Level</span><strong>${l.level}</strong></li>
        <li><span>Rank</span><strong>${l.rank}</strong></li>
        <li><span>Diamonds</span><strong>${l.diamonds.toLocaleString()}</strong></li>
        <li><span>Skins</span><strong>${l.skins}</strong></li>
      </ul>
      <button class="btn ${l.status === 'sold' ? 'ghost disabled' : 'primary'}" style="width:100%;justify-content:center;display:flex"
        ${l.status === 'sold' ? 'disabled' : `onclick="openOrderModal('${l.id}')"`}>
        ${l.status === 'sold' ? 'Sold Out' : 'Buy Now'}
      </button>
    </div>
  `).join('');
}

// ---- Order modal ----
let activeListing = null;

function openOrderModal(id){
  activeListing = LISTINGS.find(l => l.id === id);
  if(!activeListing) return;

  document.getElementById('modal-title').textContent = activeListing.title;
  document.getElementById('modal-summary').innerHTML = `
    <div class="listing-specs modal-specs">
      <span>Level ${activeListing.level}</span>
      <span>${activeListing.rank}</span>
      <span>${activeListing.diamonds.toLocaleString()} diamonds</span>
      <span>${activeListing.skins} skins</span>
      <span class="listing-price">$${activeListing.price}</span>
    </div>
  `;
  document.getElementById('buyer-contact').value = '';
  document.getElementById('buyer-note').value = '';
  document.getElementById('order-modal').hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeOrderModal(){
  document.getElementById('order-modal').hidden = true;
  document.body.style.overflow = '';
  activeListing = null;
}

async function submitOrder(event){
  event.preventDefault();
  if(!activeListing) return;

  const contact = document.getElementById('buyer-contact').value.trim();
  const note = document.getElementById('buyer-note').value.trim();

  const orderText =
`ZEROX STORE Order Request
Item: ${activeListing.title} (${activeListing.id})
Level: ${activeListing.level} | Rank: ${activeListing.rank}
Diamonds: ${activeListing.diamonds} | Skins: ${activeListing.skins}
Price: $${activeListing.price}
Buyer contact: ${contact}
${note ? 'Note: ' + note : ''}`;

  try{
    await navigator.clipboard.writeText(orderText);
    showNotice('Order details copied — paste them into Discord to finish up.');
  }catch(err){
    showNotice('Could not copy automatically — please note the order details shown.');
  }

  window.open('https://discord.com/', '_blank', 'noopener');
  closeOrderModal();
}

// Close modal on Escape or backdrop click
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeOrderModal();
});
document.addEventListener('click', (e) => {
  if(e.target && e.target.id === 'order-modal') closeOrderModal();
});
