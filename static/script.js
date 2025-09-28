const sidePanel = document.getElementById('side-panel');
const hamburger = document.getElementById('hamburger');
const closeBtn = document.getElementById('close-btn');
const unitContent = document.getElementById('unit-content');

// Toggle side panel
hamburger.addEventListener('click', () => {
  sidePanel.classList.toggle('open');
});

closeBtn.addEventListener('click', () => {
  sidePanel.classList.remove('open');
});

// Load unit content dynamically (Flask backend serves /units/<unit>.html)
document.querySelectorAll('.menu-link[data-unit]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const unitId = link.getAttribute('data-unit');
    const unitFile = `/units/${unitId}`;

    fetch(unitFile)
      .then(response => {
        if (!response.ok) throw new Error("Unit not found");
        return response.text();
      })
      .then(html => {
        unitContent.innerHTML = html;
        sidePanel.classList.remove('open');
        initDropdowns();
        unitContent.scrollIntoView({ behavior: 'smooth' });
      })
      .catch(err => {
        unitContent.innerHTML = "<p style='color:red;'>Content not found.</p>";
      });
  });
});

// Initialize dropdowns with smooth animation and dynamic file loading
function initDropdowns() {
  const dropdowns = unitContent.querySelectorAll('.dropdown');

  dropdowns.forEach(drop => {
    drop.addEventListener('click', async () => {
      const content = drop.nextElementSibling;
      const file = drop.getAttribute('data-file');

      // Load lesson file only once
      if (file && !content.dataset.loaded) {
        try {
          const res = await fetch(file);
          content.innerHTML = await res.text();
          content.dataset.loaded = "true";
        } catch (err) {
          content.innerHTML = "<p style='color:red;'>Error loading lesson.</p>";
        }
      }

      // Toggle dropdown state
      drop.classList.toggle('active');

      if (content.classList.contains('open')) {
        // closing
        content.style.maxHeight = content.scrollHeight + "px"; // set to current height
        setTimeout(() => {
          content.style.maxHeight = "0";
          content.style.opacity = "0";
        }, 10);
        content.classList.remove('open');
      } else {
        // opening
        content.classList.add('open');
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.opacity = "1";
      }
    });
  });
}
