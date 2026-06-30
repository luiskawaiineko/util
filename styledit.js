(function() {
  let el = null, tt = null, mx = 0, my = 0, mode = 'clases'; // Estado global

  const clean = () => { if (tt) { tt.remove(); tt = null; } };

  const init = (target, x, y) => {
    // Si ya estamos editando este elemento, alternamos el modo
    if (el === target) {
      mode = (mode === 'clases') ? 'estilos' : 'clases';
    } else {
      // Si seleccionamos uno nuevo, reiniciamos a modo clases
      el = target;
      mode = 'clases';
    }

    clean();
    
    tt = document.createElement('div');
    Object.assign(tt.style, {
      position: 'fixed', top: `${y + 12}px`, left: `${x + 12}px`,
      background: '#fff', color: '#333', border: '2px solid #001391',
      borderRadius: '6px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      padding: '12px', zIndex: '2050', minWidth: '200px',
      fontFamily: 'sans-serif', fontSize: '14px'
    });

    tt.innerHTML = `<div style="font-weight:bold;margin-bottom:6px;color:#001391">
      ${el.tagName.toLowerCase()} <span style="font-size:12px; font-weight:normal; color:#555">(${mode})</span>:
    </div>`;
    
    const container = document.createElement('div');
    container.contentEditable = 'true';
    Object.assign(container.style, { 
      border: '1px dashed #ccc', padding: '5px', minHeight: '20px', outline: 'none' 
    });

    if (mode === 'clases') {
      container.textContent = Array.from(el.classList).join(' ');
    } else {
      container.textContent = el.getAttribute('style') || '';
    }

    tt.appendChild(container);
    (el.closest('.modal.show') || document.querySelector('.modal.show') || document.body).appendChild(tt);
    
    setTimeout(() => container.focus(), 50);

    container.addEventListener('input', () => {
      if (mode === 'clases') {
        el.className = container.textContent.trim();
      } else {
        el.setAttribute('style', container.textContent.trim());
      }
    });

    container.addEventListener('keydown', (k) => { if (k.key === 'Escape') { clean(); el = null; } });
  };

  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, true);

  document.addEventListener('click', (e) => {
    if (e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      init(e.target, e.clientX, e.clientY);
    } else if (tt && !tt.contains(e.target)) {
      clean();
      el = null;
    }
  }, true);

  document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.key === 'ArrowUp') {
      e.preventDefault();
      let p = el ? el.parentElement : document.elementFromPoint(mx, my);
      if (p) init(p, mx, my);
    }
  }, true);
})();
