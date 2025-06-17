window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('products-container');

  fetch('/api/products')
    .then(r => r.json())
    .then(products => {
      products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <strong>Price: $${p.price}</strong>
          <a href="/products/${p.slug}" class="button">More Info</a>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => container.textContent = 'Failed to load products');
});