import { uploadExams } from './api/UploadExams.js';
import { DELETE_ICON, SEND_FILES_ICONS, UPLOAD_ICON } from './icons/icons.js';
import {
  applyThemeAttributes,
  parseThemeAttribute,
} from './scripts/ComponentProps.js';

class DaaiUpload extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });
    this.modeApi = 'dev';
    this.apiKey = '';
    this.files = [];
    this.loading = 'false';

    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: sans-serif;
        }

        .container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 10px;
        }

        .recorder-box {
          color: var(--text-badge-color, #475569);
          display: flex;
          gap:6px;
          align-items: center;
          justify-content: center;
          flex-direction: row;
          padding: 12px;
          border: 3px solid;
          border-radius: 30px;
          background-color: #ffffff;
          height: 60px;
          max-width: 450px;
          font-family: "Inter", sans-serif;
          font-weight: 600;
          position: relative;
          transition: background-color 0.3s, border-color 0.3s;
          @media (max-width: 600px) {
            flex-direction: column;
            height: 170px;
            max-width: 250px;
        }

        .recorder-box.dragging {
          background-color: #e0f7fa;
          border-color: #007c91;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap:4px;
        }

        .upload {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          height: 50px;
          width:259px;
          border: 2px dashed var(--text-badge-color, #475569);
          border-radius: 4px;
          font-size:12px;
          color:#475569;
          font-size:12px;
          @media (max-width: 600px) {
             height: 50px;
              width:240px;
            }
        }
        input[type="file"] {
          display: none;
        }

        button {
          border-radius: 8px;
          font-size: 15px;
          cursor: pointer;
          background-color: transparent;
          color: #009CB1;
          transition: transform 0.15s ease-in-out;
          font-weight: 600
        }

        button:hover {
          transform: scale(1.05);
        }

        ul {
          list-style: none;
          padding: 0;
          margin-top: 10px;
          max-height: 100px;
          overflow-y: auto;
          width: 95%;
           @media (max-width: 600px) {
                width: 90%;
            }
        }

        li {
          display: flex;
          justify-content: space-around;
          align-items:center;
          font-size:12px;
          width: 100%;
        }

        .error {
          color: red;
          font-size: 12px;
          z-index: 9999999;
        }

        .files {
          display: flex;
          flex-direction: column;
        }

        .upload-button {
          border: none !important;
          color:#475569;
          font-size:12px;
          height:60px;
          color:#ffff;
          border: 3px solid #009CB1;
          background-color: var(--button-upload-color, #d3d3d3);
          @media (max-width: 600px) {
            height:50px;
            width: 70px;
          }
        }
        .buttons-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap:8px;
        }
        .delete-button {
          cursor: pointer;
          color: red;
          background: none;
          border: none;
          font-size: 14px;
          margin-left: 10px;
        }

        .rules-text{
          color:#475569;
          font-size:12px;
        }

        .finish-upload-button {
          background-color: var(--button-send-files, #009CB1);
          height:60px;
          color:#ffff;
          border: none;
          @media (max-width: 600px) {
            height:50px;
            width: 70px;
          }
        }
      </style>

      <div class="container">
        <div class='recorder-box'  id="dropZone">
          <div class="header-content">
            <p>Exames</p>
            </div>
            <span class="upload">
            <span class="error" id="error"></span>
              <input type="file" id="fileInput" multiple placeholder=''/>
              <ul class="files" id="fileList">Apenas PDF, PNG e JPEG até 10 MB</ul>
          </span>
        <div class='buttons-container'>
        <button id="uploadButton" class='upload-button' title='Apenas PDF, PNG e JPEG até 10 MB'>
          <img src=${UPLOAD_ICON} alt='upload-icon'/>
        </button>
        <button class='finish-upload-button' id='finishUploadButton'>
          <img src=${SEND_FILES_ICONS} alt='upload-icon'
            disabled=${this.files}
          />
        </button>
        </div>
      </div>
      </div>
      <div>
      </div>
    `;

    this.fileInput = shadow.querySelector('#fileInput');
    this.fileList = shadow.querySelector('#fileList');
    this.uploadButton = shadow.querySelector('#uploadButton');
    this.dropZone = shadow.querySelector('#dropZone');
    this.errorMessage = shadow.querySelector('#error');

    this.uploadButton.addEventListener('click', () => this.fileInput.click());
    this.fileInput.addEventListener('change', (event) =>
      this.handleFiles(event.target.files)
    );
    this.addDragAndDropEvents();

    this.finishUploadButton = shadow.querySelector('.finish-upload-button');
    this.finishUploadButton.addEventListener('click', () =>
      this.finalizeUpload()
    );
  }

  handleFiles(newFiles) {
    const validFiles = Array.from(newFiles).filter(this.isValidFile);
    const invalidFiles = Array.from(newFiles).filter(
      (file) => !this.isValidFile(file)
    );

    if (invalidFiles.length > 0) {
      this.showError('Arquivos inválidos.');
    } else {
      this.clearError();
      this.files = [...this.files, ...validFiles];
      this.renderFileList();
    }
  }

  static get observedAttributes() {
    return ['theme', 'onSuccess', 'onError', 'apiKey', 'modeApi'];
  }

  connectedCallback() {
    const successAttr = this.getAttribute('onSuccess');
    const errorAttr = this.getAttribute('onError');
    if (successAttr && typeof window[successAttr] === 'function') {
      this.onSuccess = window[successAttr].bind(this);
    }
    if (errorAttr && typeof window[errorAttr] === 'function') {
      this.onError = window[errorAttr].bind(this);
    }
    const defaultTheme = {
      buttonSendFiles: '#009CB1',
      buttonSearchFiles: '#637381',
      borderColor: '#009CB1',
      textBadgeColor: '#637381',
    };

    const themeAttr = this.getAttribute('theme');
    if (themeAttr) {
      this.theme = { ...defaultTheme, ...parseThemeAttribute(themeAttr) };
    } else {
      this.theme = defaultTheme;
    }
    applyThemeAttributes(this.theme, this);
    this.apiKey = this.getAttribute('apikey');
    this.modeApi = this.getAttribute('modeApi');
    this.onSuccess = this.getAttribute('onSuccess')
      ? new Function('return ' + this.getAttribute('onSuccess'))()
      : null;

    this.onError = this.getAttribute('onError')
      ? new Function('return ' + this.getAttribute('onError'))()
      : null;
  }

  isValidFile(file) {
    const validTypes = ['application/pdf', 'image/*'];
    return validTypes.some((type) => {
      if (type === 'image/*') {
        return file.type.startsWith('image/');
      }
      return file.type === type;
    });
  }

  renderFileList() {
    this.fileList.innerHTML = '';
    if (this.files.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'Apenas PDF, PNG e JPEG até 10 MB';
      this.fileList.appendChild(li);
    }
    if (this.files.length > 0) {
      this.files.forEach((file, index) => {
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(` ${file.name}`));
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = `<img src="${DELETE_ICON}" alt="delete-icon"/>`;
        deleteButton.addEventListener('click', () => this.deleteFile(index));

        li.appendChild(deleteButton);
        this.fileList.appendChild(li);
      });
    }
  }

  deleteFile(index) {
    this.files.splice(index, 1);
    this.renderFileList();
  }

  showError(message) {
    this.errorMessage.textContent = message;
    setTimeout(() => {
      this.clearError();
    }, 3000);
  }

  clearError() {
    this.errorMessage.textContent = '';
  }

  addDragAndDropEvents() {
    this.dropZone.addEventListener('dragover', (event) => {
      event.preventDefault();
      this.dropZone.classList.add('dragging');
    });

    this.dropZone.addEventListener('dragleave', () => {
      this.dropZone.classList.remove('dragging');
    });

    this.dropZone.addEventListener('drop', (event) => {
      event.preventDefault();
      this.dropZone.classList.remove('dragging');
      const files = event.dataTransfer.files;
      this.handleFiles(files);
    });
  }

  async finalizeUpload() {
    if (!this.files.length) {
      return this.showError('Nenhum arquivo selecionado para upload.');
    }

    this.fileList.innerHTML = '<span>Processando arquivos...</span>';

    try {
      await Promise.all(
        this.files.map((file) =>
          uploadExams(file, this.apiKey, this.onSuccess, this.onError)
        )
      );
    } catch (error) {
      this.showError('Erro ao salvar os arquivos. Tente novamente.');
    } finally {
      this.fileList.innerHTML =
        '<span>Upload concluído, insira novos arquivos</span>';
      this.files = [];
      this.uploadButton.style.display = 'block';
    }
  }
}
customElements.define('daai-upload', DaaiUpload);
