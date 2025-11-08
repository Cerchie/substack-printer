// popup.js
document.addEventListener('DOMContentLoaded', () => {
  const printButton = document.getElementById("formatPrint");
  if (printButton) {
    printButton.addEventListener("click", () => {
      chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
        if (tabs[0]?.id) {
          try {
            await chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              function: () => {
                const article = document.querySelector("article") || document.querySelector(".post-content");
                if (!article) return;
                
                const originalContent = document.body.innerHTML;
                const content = article.cloneNode(true);
                document.body.innerHTML = '';
                document.body.appendChild(content);
                
                const style = document.createElement('style');
                style.textContent = `
                  @media print {
                    body { margin: 0; padding: 20px; }
                    img { max-width: 100%; }
                    p { orphans: 3; widows: 3; }
                  }
                `;
                document.head.appendChild(style);
                
                window.print();
                
                // Restore original content
                document.body.innerHTML = originalContent;
              }
            });
          } catch (e) {
            console.error('Print error:', e);
          }
        }
      });
    });
  }
});

