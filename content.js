// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "print") {
    const article = document.querySelector("article") || document.querySelector(".post-content");
    if (!article) {
      sendResponse({success: false});
      return;
    }
    
    // Save original content
    const originalContent = document.body.innerHTML;
    
    // Format for print
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
    
    // Print
    window.print();
    
    // Restore
    document.body.innerHTML = originalContent;
    sendResponse({success: true});
  }
  return true;
});

