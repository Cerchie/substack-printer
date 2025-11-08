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
                
                const content = article.cloneNode(true);
                
                // Remove social interaction elements
                const elementsToRemove = content.querySelectorAll([
                    '.subscription-widget-wrap',
                    '.social-section',
                    '.like-button',
                    '.share-button',
                    '.comment-button',
                    '.post-ufi',
                    '.buttons',
                    '.post-footer',
                    '.post-meta',
                    '.post-engagement',
                    '.engagement-buttons',
                    '.subscribe-footer',
                    '.post-meta-bar',
                    '.post-meta-actions'
                ].join(','));
                
                elementsToRemove.forEach(el => el.remove());
                
                document.body.innerHTML = '';
                document.body.appendChild(content);
                
                const style = document.createElement('style');
                style.textContent = `
                  @media print {
                    @page {
                      margin: 0;
                      size: auto;
                    }
                    
                    body {
                      margin: 40px auto;
                      padding: 0;
                      font-family: Garamond, "EB Garamond", "Times New Roman", serif;
                      line-height: 1.6;
                      color: #111827;
                      outline: 1px solid #000;
                      width: calc(100% - 80px);
                      max-width: 800px;
                      box-sizing: border-box;
                      overflow: hidden;
                    }

                    article {
                      padding: 40px;
                      width: 100%;
                      box-sizing: border-box;
                      overflow: hidden;
                    }

                    h1, h2, h3 {
                      font-family: "JetBrains Mono", "Fira Code", Menlo, Monaco, "Courier New", monospace;
                      font-weight: 600;
                      margin: 2rem -40px;
                      outline: 1px solid #000;
                      padding: 12px 40px;
                      width: calc(100% + 80px);
                      box-sizing: border-box;
                    }

                    img {
                      display: block;
                      max-width: 100%;
                      height: auto;
                      margin: 2rem 0;
                      outline: 1px solid #000;
                    }

                    p {
                      orphans: 3;
                      widows: 3;
                      margin-bottom: 1.5rem;
                      font-size: 16px;
                    }

                    h1 { font-size: 2.5rem; }
                    h2 { font-size: 2rem; }
                    h3 { font-size: 1.5rem; }

                    a {
                      color: #111827;
                      text-decoration: none;
                      border-bottom: 1px solid #000;
                    }

                    blockquote {
                      margin: 2rem -40px;
                      padding: 1rem 40px;
                      outline: 1px solid #000;
                      font-style: italic;
                      box-sizing: border-box;
                    }
                  }
                `;
                document.head.appendChild(style);
                
                window.print();
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

