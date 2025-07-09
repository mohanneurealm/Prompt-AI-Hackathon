async function analyzeJira() {
  const input = document.getElementById('jiraInput').value;
  const outputDiv = document.getElementById('jiraOutput');

  // Show loading spinner
  outputDiv.innerHTML = `
    <div class="flex justify-center items-center h-48">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  `;

  try {
    const json = JSON.parse(input);

    const response = await fetch('/analyze-jira', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket: json })
    });

    const data = await response.json();
    console.log(data);

    let insightsHtml = '';
    if (data.insights && Array.isArray(data.insights)) {
      insightsHtml = data.insights.map(insight => `
        <div class="border rounded p-3 my-2">
          <p class="text-sm">${insight}</p>
        </div>
      `).join('');
    }

    outputDiv.innerHTML = `
      <div class="mb-4"><strong>Summary:</strong> ${data.summary}</div>
      <div class="mb-4"><strong>Type:</strong> ${data.type}</div>
      <div class="mb-4"><strong>Priority:</strong> ${data.priority}</div>
      <div class="mb-4"><strong>Status:</strong> ${data.status}</div>
      <div class="mb-6">
        <strong>Insights:</strong>
        ${insightsHtml}
      </div>
      <div class="mb-4"><strong>Recommendation:</strong> <p class="mt-2">${data.recommendation}</p></div>
    `;
  } catch (error) {
    outputDiv.innerHTML = `
      <div class="text-red-600 font-semibold">Invalid JSON or failed to analyze JIRA ticket.</div>
    `;
    console.error(error);
  }
}