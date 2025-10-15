
    // SCRIPT PER LA SINOSSI
const mainTitle = document.getElementById('main-title');
const synopsisSection = document.getElementById('synopsis-section');

if (mainTitle && synopsisSection) {
  mainTitle.addEventListener('click', () => {
    // Mostra/nasconde la sinossi
    synopsisSection.classList.toggle('visible');
    // AGGIUNTA: Aggiunge/rimuove la classe 'active' dal titolo
    mainTitle.classList.toggle('active');
  });
}

    // SCRIPT PER IL TOGGLE DELLA DESCRIZIONE
    const headers = document.querySelectorAll('.card-header');
    headers.forEach(header => {
      header.addEventListener('click', () => {
        const description = header.nextElementSibling;
        description.classList.toggle('visible');
      });
    });

    // SCRIPT PER IL FORM DI CONTRIBUTO
    document.getElementById('contribute-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
    
      const submitBtn = e.target.querySelector('.submit-btn');
      const messageDiv = document.getElementById('form-message');
    
      submitBtn.disabled = true;
      submitBtn.textContent = 'Invio in corso...';
      messageDiv.style.display = 'block';
    
      const imageUrl = document.getElementById('image-url').value.trim();
    
      const formData = {
        titolo: document.getElementById('title').value,
        descrizione: document.getElementById('description').value,
        categoria: document.getElementById('category').value,
      };
    
      if (imageUrl) {
        formData.Image = [{ url: imageUrl }];
      }
    
      try {
        const response = await fetch(`https://api.airtable.com/v0/${import.meta.env.PUBLIC_AIRTABLE_BASE_ID}/${import.meta.env.PUBLIC_AIRTABLE_TABLE_NAME}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.PUBLIC_AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            records: [{ fields: formData }]
          })
        });
      
        const responseData = await response.json();
      
        if (response.ok) {
          messageDiv.textContent = '✅ Contributo inviato con successo! Ricarica la pagina per vederlo.';
          messageDiv.className = 'form-message success';
          e.target.reset();
        } else {
          messageDiv.textContent = `❌ Errore: ${responseData.error?.message || 'Errore sconosciuto'}`;
          messageDiv.className = 'form-message error';
        }
      } catch (error) {
        messageDiv.textContent = '❌ Errore durante l\'invio. Riprova.';
        messageDiv.className = 'form-message error';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Invia contributo';
      }
    });
