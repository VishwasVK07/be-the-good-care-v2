// 1. Connect to Supabase (paste your own values between the quotes)
const SUPABASE_URL = "https://vyyunthmzdpzveizboxz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_k7RCfRLbY5qKUmW33H62iA_L-3UWpHh";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Find the elements we need on the page
const form = document.getElementById("survey-form");
const message = document.getElementById("form-message");
const providerSelect = document.getElementById("provider");

// 3. Load the provider list from the database into the dropdown
async function loadProviders() {
  const { data, error } = await db
    .from("providers")
    .select("id, name, role")
    .order("name");

  if (error) {
    console.error(error);
    message.textContent = "Could not load providers. Please refresh the page.";
    return;
  }

  data.forEach(function (provider) {
    const option = document.createElement("option");
    option.value = provider.id;
    option.textContent = provider.role + " " + provider.name;
    providerSelect.appendChild(option);
  });
}

loadProviders();

// 4. Save the response when the form is submitted
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  message.textContent = "";

  const surveyResponse = {
    provider_id: Number(form.provider_id.value),
    rating: Number(form.rating.value),
    comments: form.comments.value.trim()
  };

  const { error } = await db.from("responses").insert(surveyResponse);

  if (error) {
    console.error(error);
    message.textContent = "Sorry, something went wrong. Please try again.";
  } else {
    message.textContent = "Thank you! Your feedback was submitted.";
    form.reset();
  }

  submitButton.disabled = false;
});