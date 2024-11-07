export function parseThemeAttribute(themeAttr) {
  try {
    return JSON.parse(themeAttr);
  } catch (e) {
    console.error('Erro ao analisar o atributo `theme`:', e);
    return {};
  }
}

export function applyThemeAttributes(themeProp, componentContext) {
  Object.keys(themeProp).forEach((key) => {
    const attributeKey = toKebabCase(key);

    if (!componentContext.hasAttribute(attributeKey)) {
      componentContext.setAttribute(attributeKey, themeProp[key]);
    }

    const attributeToElementMap = {
      'border-color': (value) => {
        const recorderBox =
          componentContext.shadowRoot.querySelector('.recorder-box');
        if (recorderBox) recorderBox.style.borderColor = value;
      },
      'text-badge-color': (value) => {
        componentContext.style.setProperty('--text-badge-color', value);
      },
      'button-send-files': (value) => {
        const finishUploadButton = componentContext.shadowRoot.querySelector(
          '.finish-upload-button'
        );
        if (finishUploadButton)
          finishUploadButton.style.backgroundColor = value;
      },
      'button-search-files': (value) => {
        const uploadButton =
          componentContext.shadowRoot.querySelector('.upload-button');
        if (uploadButton) uploadButton.style.backgroundColor = value;
      },
    };

    if (attributeToElementMap[attributeKey]) {
      attributeToElementMap[attributeKey](themeProp[key]);
    }
  });
}

export function toKebabCase(camelCase) {
  return camelCase.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

export function attributeChangedCallback(name, oldValue, newValue) {
  if (name === 'theme') {
    this.theme = parseThemeAttribute(newValue);
    applyThemeAttributes();
    return;
  }
  const attributeToElementMap = {
    'border-color': (value) => {
      const recorderBox = this.shadowRoot.querySelector('.recorder-box');
      if (recorderBox) recorderBox.style.borderColor = value;
    },
    'text-badge-color': (value) => {
      this.style.setProperty('--text-badge-color', value);
    },
  };
  if (attributeToElementMap[name]) {
    attributeToElementMap[name](newValue);
  }
}
