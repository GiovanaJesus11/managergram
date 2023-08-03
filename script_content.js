const form = document.getElementById('instagramForm');
const resultDiv = document.getElementById('result');
const aiResponseDiv = document.getElementById('aiResponse');
const downloadButton = document.getElementById('downloadButton');
const loadingDiv = document.getElementById('loading');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const nicho = document.getElementById('nicho').value;
  const audiencia = document.getElementById('audiencia').value;

  // const apiUrl = `https://instagram-data1.p.rapidapi.com/user/info?username=${username}`;

  // console.log('Instagram API URL:', apiUrl);

  // const options = {
  //   method: 'GET',
  //   url: apiUrl,
  //   headers: {
  //     'X-RapidAPI-Key': '45bfe69a1emsh74a89d0e4002ca2p11b709jsna0893fe45e32',
  //     'X-RapidAPI-Host': 'instagram-data1.p.rapidapi.com'
  //   }
  // };

  // console.log('Fazendo requisição à API do Instagram...');
  // try {
  //   const response = await axios.request(options);
  //   const profileData = response.data;
  //   console.log('Resposta da API do Instagram:', profileData);
  //   displayProfileInfo(profileData);

  // Chamada à API da OpenAI
  const prompt = `On the topic of creating a monthly content calendar, given the information of posting 4 times a week, and that I run an Instagram profile about ${nicho} for ${audiencia}, please create a content calendar for the month describing the content for each post with a high-engaging caption and 4 relevant hashtags. Provide all of the information in a table format.`;

  const openaiApiUrl = 'https://api.openai.com/v1/chat/completions';
  const openaiApiOptions = {
    method: 'POST',
    url: openaiApiUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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' 
    },
    data: {
      "model": "gpt-3.5-turbo",
      "messages": [
        {
          "role": "user",
          "content": prompt
        }
      ]
    }
  };

  console.log('Fazendo requisição à API da OpenAI...');
  downloadButton.style.display = 'none';
  loadingDiv.style.display = 'block';

  try {
    const openaiApiResponse = await axios.request(openaiApiOptions);
    const aiResponse = openaiApiResponse.data.choices[0].message.content;
    console.log('Resposta da API da OpenAI:', aiResponse);

    displayAIResponseTable(aiResponse);

    loadingDiv.style.display = 'none';
    downloadButton.style.display = 'block';  

  } catch (error) {
    console.error('Erro ao consultar a API da OpenAI:', error);
    loadingDiv.style.display = 'none';
    downloadButton.style.display = 'block';  
  }
});
 // Arrumando a tabela
function displayAIResponseTable(response) {
  const lines = response.split('\n');
  const headers = lines[0].split('|').map((header) => header.trim());
  const tableRows = lines.slice(2, -2); 
  let tableHTML = '<h2>Content Calendar</h2><table><tr>'; 

  headers.forEach((header) => {
    tableHTML += `<th>${header}</th>`;
  });

  tableRows.forEach((row) => {
    const columns = row.split('|').map((column) => column.trim());
    tableHTML += '<tr>';

    columns.forEach((column) => {
      tableHTML += `<td>${column}</td>`;
    });

    tableHTML += '</tr>';
  });

  tableHTML += '</table>';
  let tableContainer = document.getElementById('tableContainer');
  tableContainer.innerHTML = tableHTML;
}
 // Botão de download
downloadButton.addEventListener('click', () => {
  let tableContainer = document.getElementById('tableContainer');
  let opt = {
    margin: 1,
    filename: 'ContentCalendar.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().from(tableContainer).set(opt).save();
});
