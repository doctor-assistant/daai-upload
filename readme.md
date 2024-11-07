# Daai Upload

### Sumário

1. [Introdução](#introdução)
2. [Como usar o componente](#uso)
3. [Propriedades para o componente](#propriedades)
4. [Uso do componente via CDN](#uso-do-componente-via-cdn)
5. [Construção do componente](#construção)

## Introdução

O componente é um sistema de integração voltado para empresas de saúde, como clínicas, sistemas de prontuário eletrônico e empresas com soluções próprias. Sua função é realizar o upload de exames, extrair dados com inteligência artificial e retornar um sumário estruturado das informações extraídas do exame.

#### Benefícios

- Automatização de processos dentro da empresa
- Registro do áudio e processamento de entrega de acordo com a necessidade específica
- Facilidade de customização de acordo com a interface da empresa (whitelabel)
- Ganho de produtividade: não há necessidade de utilizar vários sistemas em paralelo

## Uso

### instalação

Para instalar o `Daai upload` no seu projeto, basta rodar no terminal do projeto que você deseja usar o componente.

💻 Execute esse comando:

```bash
npm i @doctorassistant/daai-upload
```

### Como usar após a instalação:

Após instalar o pacote no seu projeto, basta adicionar a tag <daai-upload> no local onde deseja que o componente seja renderizado:

```html
import '@doctorassistant/daai-upload';
<daai-upload apiKey="YOUR_API_KEY"></daai-upload>
```

onde ele for chamado vai ser renderizado nesse modelo:

![readme_component_layout.png](https://raw.githubusercontent.com/doctor-assistant/daai-upload/main/daai_upload.png)

## propriedades

### propriedades de funcionamento

```js
// ⚠️ A propriedade apiKey é obrigatória, sem ela o componente não irá fazer requisições a api
apikey = 'aqui você deve passar a chave da api para realizar as requisições';
```

### Formato metadata

```html
// ⚠️ Essse deve ser o formato
<body>
  <daai-upload apiKey="YOUR_API_KEY"> </daai-upload>
</body>
```

Após a instalação do componente e a sua inclusão no código, será possível customizá-lo passando as props correspondentes. Caso as props não sejam fornecidas, ele utilizará o layout padrão. 🎨

#### 📂 Props que você pode passar para o componente:

```js
theme: {
  border-color,
  text-badge-color,
  button-search-files,
  button-send-files,
}
 onSuccess={}
 onError={}
```

### 🖌️ exemplo de uso da customização:

```html
import '@doctorassistant/daai-upload';

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script>
      function onSuccess(data) {
        console.log(data);
      }
      function onError(data) {
        console.log(data);
      }
    </script>
  </head>
  <body>
    <daai-upload
      apiKey="YOUR_API_KEY"
      theme='{
           "buttonSendFiles": "#0600b1",
            "buttonSearchFiles": "#0600b1",
            "borderColor": "#0600b1",
            "textBadgeColor": "#0600b1"
      }'
      onSuccess="onSuccess"
      onError="onError"
    >
    </daai-upload>
  </body>
</html>
```

### 🔎 definição de cada propriedade:

### 📎 Sugestões:

- As cores podem ser em `hexadecimal`

#### border-color

Essa propriedade altera a cor das `bordas` do componente.

#### text-badge-color

Essa propriedade altera a cor dos textos do componente.

#### button-send-files

Essa propriedade altera a cor do botão de enviar os arquivos.

#### button-search-files

Essa propriedade altera a cor do botão de buscar os arquivos.

#### onSuccess

função de callback que será executada em caso de sucesso

#### onError

função de callback que será executada em caso de erro

## Uso do componente via CDN

Caso a sua aplicação não utilize react, vue.js e angular, você pode optar por usar o nosso componente via CDN.

- exemplo de uso no HTML

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script
      src="https://cdn.jsdelivr.net/npm/@doctorassistant/daai-upload@latest/dist/DaaiUpload.js"
      type="module"
    ></script>
  </head>
  <body>
    <h1>Exemplo de uso do componente via cdn</h1>
    <daai-upload apiKey="YOUR_API_KEY"></daai-upload>
  </body>
</html>
```

### ⚠️ Observações

- Quando passar o daai-upload dentro do body você ainda terá que passar as propriedades obrigatórias citadas acima.
- Não é obrigatório passar a versão, caso o campo fique vazio ele irá pegar a versão mais recente.

```html
Versão mais atualizada
<script
  src="https://cdn.jsdelivr.net/npm/@doctorassistant/daai-upload@latest/dist/DaaiUpload.js"
  type="module"
></script>
Versão especificada
<script
  src="https://cdn.jsdelivr.net/npm/@doctorassistant/daai-upload@X.X.X/dist/DaaiUpload.js"
  type="module"
></script>
```

## construção

### Shadow dom 👻

O **Shadow DOM** é uma parte do **Web Components** que permite encapsular a estrutura, estilo e funcionalidade de um elemento de forma isolada do resto da página. 🔒 Isso significa que o conteúdo do **Shadow DOM** não pode ser afetado por estilos ou scripts externos, criando um "mini DOM" dentro de um componente.
