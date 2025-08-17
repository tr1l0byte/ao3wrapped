chrome.storage.local.get("works", (result) => {
  const works = result.works || [];
  const output = document.getElementById("output");

  output.innerHTML = `
    <p>Fics tracked: ${works.length}</p>
    <p>Total words: ${works.reduce((sum, fic) => sum + fic.wordCount, 0)}</p>
    <ul>
      ${works.map(fic => `<li>${fic.title} by ${fic.author}</li>`).join("")}
    </ul>
  `;
});