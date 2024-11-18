export async function uploadExams(
  context,
  file,
  apiKey,
  onSuccess,
  onError,
  modeApi
) {
  const url =
    modeApi === 'dev'
      ? 'https://apim.doctorassistant.ai/api/sandbox/exams'
      : 'https://apim.doctorassistant.ai/api/production/exams';

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-daai-api-key': apiKey,
      },
      body: formData,
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      if (typeof onSuccess === 'function') {
        onSuccess(jsonResponse);
      }
    }
  } catch (error) {
    context.fileList.innerHTML =
      '<span>Erro ao enviar os arquivos. Tente novamente.</span>';
    if (typeof onError === 'function') {
      onError('Erro na requisição', error);
    }
    console.error('Erro ao enviar o arquivo:', error);
  }
}
