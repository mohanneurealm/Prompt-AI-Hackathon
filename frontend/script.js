function toggleTheme() {
  console.log("Toggle clicked ✅");
  document.body.classList.toggle("dark");
}

function analyzeJiraData() {
  const input = document.getElementById("jiraJsonInput").value;
  const output = document.getElementById("jiraOutput");

  try {
    const json = JSON.parse(input);

    output.innerHTML = `<p class="text-lg font-semibold">🔄 Sending data to Gemini API...</p>
                        <pre class="text-sm bg-black/10 p-4 rounded overflow-x-auto">${JSON.stringify(json, null, 2)}</pre>`;
    
    setTimeout(() => {
      output.innerHTML += `<div class="mt-6">
        <p class="font-semibold">✅ Analysis:</p>
        <ul class="list-disc pl-5">
          <li>Priority: High</li>
          <li>Component: Authentication Module</li>
          <li>Summary: The issue relates to login failures due to token expiration.</li>
          <li>Recommendation: Increase token timeout or implement auto-refresh.</li>
        </ul>
      </div>`;
    }, 1500);

  } catch (e) {
    output.innerHTML = `<p class="text-red-600 font-semibold">❌ Invalid JSON. Please check your input.</p>`;
  }
}
