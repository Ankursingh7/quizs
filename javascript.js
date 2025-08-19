document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("pdfFile");
  if (!fileInput.files.length) return;

  const formData = new FormData();
  formData.append("pdf", fileInput.files[0]);

  document.getElementById("loading").style.display = "block";
  document.getElementById("result").innerHTML = "";

  try {
    const res = await fetch("/.netlify/functions/generate", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    document.getElementById("loading").style.display = "none";

    if (data.questions) {
      data.questions.forEach((q, idx) => {
        const div = document.createElement("div");
        div.className = "question";
        div.innerHTML = `<b>Q${idx + 1}:</b> ${q.question}<br>
                         ${q.type === "mcq" ? q.choices.join("<br>") : ""}<br>
                         <i>Answer:</i> ${q.answer}`;
        document.getElementById("result").appendChild(div);
      });
    } else {
      document.getElementById("result").innerText = data.error || "No questions generated.";
    }
  } catch (err) {
    document.getElementById("loading").style.display = "none";
    document.getElementById("result").innerText = "⚠️ Error generating quiz.";
  }
});
