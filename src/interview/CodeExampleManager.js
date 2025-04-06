export class CodeExampleManager {
  constructor() {
    this.loadHighlightJs();
  }

  loadHighlightJs() {
    // Check if highlight.js is already loaded
    if (window.hljs) return;

    // Load highlight.js and a nice theme
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js';
    script.onload = () => {
      // Load multiple languages
      Promise.all([
        this.loadLanguage('javascript'),
        this.loadLanguage('typescript'),
        this.loadLanguage('python'),
        this.loadLanguage('java'),
        this.loadLanguage('csharp'),
        this.loadLanguage('go'),
      ]).then(() => {
        // Load a professional theme
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href =
          'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/atom-one-dark.min.css';
        document.head.appendChild(link);

        // Add code font
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href =
          'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap';
        document.head.appendChild(fontLink);

        // Initialize highlighting on existing code blocks
        window.hljs.highlightAll();

        // Add custom styles for code blocks
        this.addCodeBlockStyles();
      });
    };
    document.head.appendChild(script);
  }

  loadLanguage(language) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/languages/${language}.min.js`;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  highlightCode(element) {
    if (window.hljs && element) {
      window.hljs.highlightElement(element);
    }
  }

  addCodeBlockStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      code.hljs {
        padding: 1.25rem;
        border-radius: 0.5rem;
        font-family: 'Fira Code', monospace;
        font-size: 0.9rem;
        line-height: 1.5;
        counter-reset: line;
      }
      
      /* Line numbers for code blocks */
      .hljs-ln {
        padding: 0.5rem 0;
      }
      
      .hljs-ln td.hljs-ln-numbers {
        user-select: none;
        text-align: right;
        color: #606060;
        border-right: 1px solid #404040;
        vertical-align: top;
        padding-right: 0.75rem;
        padding-left: 0.5rem;
      }
      
      .hljs-ln td.hljs-ln-code {
        padding-left: 1rem;
      }
      
      /* Code comment enhancements */
      .hljs-comment, .hljs-quote {
        color: #6a9955;
        font-style: italic;
      }
      
      /* Keywords, functions, etc. */
      .hljs-keyword, .hljs-selector-tag, .hljs-built_in, .hljs-name, .hljs-tag {
        color: #569CD6;
      }
      
      /* Variables, attributes */
      .hljs-variable, .hljs-template-variable, .hljs-attr {
        color: #9CDCFE;
      }
      
      /* Strings */
      .hljs-string, .hljs-literal, .hljs-template-tag, .hljs-template-variable {
        color: #CE9178;
      }
      
      /* Numbers, boolean */
      .hljs-number, .hljs-attribute, .hljs-addition, .hljs-boolean {
        color: #B5CEA8;
      }
      
      /* Class names, types */
      .hljs-title, .hljs-section, .hljs-selector-id, .hljs-selector-class, .hljs-type, .hljs-params {
        color: #4EC9B0;
      }
    `;
    document.head.appendChild(styleEl);
  }

  createInteractiveCodeBlock(code, language = 'javascript', editable = false) {
    const container = document.createElement('div');
    container.className = 'code-block-container';

    // Language indicator
    const langIndicator = document.createElement('div');
    langIndicator.className =
      'absolute top-0 right-0 px-3 py-1 text-xs font-mono bg-gray-800 text-gray-300 rounded-bl-md';
    langIndicator.textContent = language;
    container.appendChild(langIndicator);

    const codeElement = document.createElement('pre');
    codeElement.innerHTML = `<code class="${language}">${this.escapeHtml(code)}</code>`;

    container.appendChild(codeElement);

    if (editable) {
      const editButton = document.createElement('button');
      editButton.className =
        'edit-code-btn absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded text-xs flex items-center';
      editButton.innerHTML = '<i class="fas fa-edit mr-1"></i> Edit';

      editButton.addEventListener('click', () => {
        const codeBlock = codeElement.querySelector('code');
        const currentCode = codeBlock.textContent;

        // Replace with textarea
        const textarea = document.createElement('textarea');
        textarea.className =
          'w-full h-64 p-4 font-mono text-sm border border-gray-300 rounded bg-gray-800 text-gray-100';
        textarea.value = currentCode;

        codeElement.style.display = 'none';
        container.insertBefore(textarea, codeElement);
        editButton.style.display = 'none';

        // Add save button
        const saveButton = document.createElement('button');
        saveButton.className =
          'save-code-btn absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center';
        saveButton.innerHTML = '<i class="fas fa-save mr-1"></i> Save';

        saveButton.addEventListener('click', () => {
          codeBlock.textContent = textarea.value;
          this.highlightCode(codeBlock);

          // Restore view
          textarea.remove();
          codeElement.style.display = '';
          editButton.style.display = '';
          saveButton.remove();
        });

        container.appendChild(saveButton);
      });

      container.appendChild(editButton);
    }

    // Add copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-btn';
    copyButton.innerHTML = '<i class="far fa-copy"></i>';

    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(code).then(() => {
        // Show copied status
        const originalHTML = copyButton.innerHTML;
        copyButton.innerHTML = '<i class="fas fa-check"></i>';

        setTimeout(() => {
          copyButton.innerHTML = originalHTML;
        }, 1500);
      });
    });

    container.appendChild(copyButton);

    return container;
  }

  escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
