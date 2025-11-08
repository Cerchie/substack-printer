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
                    body {
                      margin: 0;
                      padding: 40px;
                      font-family: "Times New Roman", Times, serif;
                      line-height: 1.6;
                      color: #111827;
                    }
                    img {
                      max-width: 100%;
                      margin: 2rem 0;
                      outline: 1px solid #000;
                      padding: 8px;
                    }
                    p {
                      orphans: 3;
                      widows: 3;
                      margin-bottom: 1.5rem;
                      font-size: 16px;
                    }
                    h1, h2, h3 {
                      font-family: "Times New Roman", Times, serif;
                      font-weight: 700;
                      margin-top: 2.5rem;
                      margin-bottom: 1.5rem;
                      outline: 1px solid #000;
                      padding: 12px;
                    }
                    .article-meta {
                      display: flex;
                      align-items: center;
                      gap: 1rem;
                      margin: 1rem 0;
                    }
                    .article-meta > *:not(:last-child)::after {
                      content: "";
                      display: inline-block;
                      width: 1px;
                      height: 1em;
                      background: #000;
                      margin-left: 1rem;
                      vertical-align: middle;
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
                      margin: 2rem 0;
                      padding: 1rem;
                      outline: 1px solid #000;
                      font-style: italic;
                    }
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

