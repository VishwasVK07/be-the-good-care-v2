// 1. Find the elements we need on the page
const form = document.getElementById("survey-form");
const message = document.getElementById("form-message");

// 2. Run this code whenever the form is submitted
form.addEventListener("submit", function (event) {
  // Stop the browser from reloading the page
  event.preventDefault();

  // 3. Read the answers, using each field's name
  const surveyResponse = {
    provider_id: form.provider_id.value,
    rating: Number(form.rating.value),
    comments: form.comments.value.trim()
  };

  // 4. For now, just show the data in the browser console
  console.log("Survey response:", surveyResponse);

  // 5. Tell the patient it worked, then clear the form
  message.textContent = "Thank you! Your feedback was submitted.";
  form.reset();
});