async function summarizeGithub() {
    const githubUrl = document.getElementById('githubInput').value;
    const outputDiv = document.getElementById('repoOutput');
    outputDiv.innerHTML = 'Loading... 🔄';


    outputDiv.innerHTML = `
      <div class="flex justify-center items-center h-48">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple"></div>
      </div>
    `;
  
    try {
      const response = await fetch('/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUrl })
      });
  
      const data = await response.json();
      console.log(data);
  
      let filesHtml = '';
      if (data.files && Array.isArray(data.files)) {
        filesHtml = data.files.map(file => `
          <div class="border rounded p-3 my-2">
            <a href="${file.url}" target="_blank" class="text-blue-500 underline font-semibold">${file.filename}</a>
            <p class="text-sm mt-1">${file.description}</p>
          </div>
        `).join('');
      }
  
      outputDiv.innerHTML = `
        <div class="mb-4">
          <strong>👤 Author:</strong> <a href="${data.author.url}" target="_blank" class="text-blue-500 underline">${data.author.name}</a>
        </div>
        <div class="mb-4"><strong>📅 Created:</strong> ${data.date}</div>
        <div class="mb-4"><strong>📂 Type:</strong> ${data.type}</div>
        <div class="mb-4"><strong>📝 Summary:</strong> ${data.summary}</div>
        <div class="mb-4"><strong>🛠️ Languages:</strong> ${data.languages}</div>
        <div class="mb-6">
          <strong>📄 Important Files:</strong>
          ${filesHtml}
        </div>
        <div class="mb-4"><strong>🧩 Flow of Code:</strong> <p class="mt-2">${data.flow}</p></div>
      `;
    } catch (error) {
      outputDiv.innerHTML = '❌ Error fetching repo details ';
      console.error(error);
    }
  }
  
  function toggleTheme() {
    const body = document.body;
    const repoOutput = document.getElementById('repoOutput');
    const codeOutput = document.getElementById('codeOutput');
  
    if (body.classList.contains('dark')) {
      // Switch to light mode
      body.classList.remove('dark');
      body.classList.add('light');
      body.classList.replace('bg-gray-900', 'bg-gradient-to-b');
      body.classList.replace('text-white', 'text-black');
  
      // Light theme adjustments for output sections
      repoOutput.classList.remove('text-white');
      repoOutput.classList.add('text-black');
      codeOutput.classList.remove('text-white');
      codeOutput.classList.add('text-black');
    } else {
      // Switch to dark mode
      body.classList.remove('light');
      body.classList.add('dark');
      body.classList.replace('bg-gradient-to-b', 'bg-gray-900');
      body.classList.replace('text-black', 'text-white');
  
      // Dark theme adjustments for output sections
      repoOutput.classList.remove('text-black');
      repoOutput.classList.add('text-white');
      codeOutput.classList.remove('text-black');
      codeOutput.classList.add('text-white');
    }
  }
  
  


  async function analyzeCode() {
    const codeText = document.getElementById('codeInput').value;
    const outputDiv = document.getElementById('codeOutput');
  
    // ✨ Show loading spinner immediately
    outputDiv.innerHTML = `
      <div class="flex justify-center items-center h-48">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    `;
  
    try {
      const response = await fetch('/analyze-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeText })
      });
  
      const data = await response.json();
      console.log(data);
  
      let segmentsHtml = '';
      if (data.segments && Array.isArray(data.segments)) {
        segmentsHtml = data.segments.map(seg => `
          <div class="border rounded p-3 my-2">
            <strong>${seg.part}:</strong>
            <p class="text-sm mt-1">${seg.description}</p>
          </div>
        `).join('');
      }
  
      outputDiv.innerHTML = `
        <div class="mb-4"><strong>📄 Language:</strong> ${data.language}</div>
        <div class="mb-4"><strong>📂 Code Type:</strong> ${data.type}</div>
        <div class="mb-6">
          <strong>🧩 Breakdown:</strong>
          ${segmentsHtml}
        </div>
        <div class="mb-4"><strong>🔁 Flow of Code:</strong> <p class="mt-2">${data.flow}</p></div>
        <div class="mb-4"><strong>⏱️ Time Complexity:</strong> ${data.time_complexity}</div>
        <div class="mb-4"><strong>💾 Space Complexity:</strong> ${data.space_complexity}</div>
      `;
    } catch (error) {
      outputDiv.innerHTML = '❌ Error analyzing code.';
      console.error(error);
    }
  }
  