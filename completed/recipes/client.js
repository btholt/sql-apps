const templateResult = ({ recipe_id, title, url }) => `
  <a class="result-link" href="detail?id=${recipe_id}">
    <li class="ingredient-result">
      <div class="result-text">${recipe_id} — ${title}</div>
      <div class="result-labels">
        <div 
          class="label-result label-mini-image" 
          style="background-image:url('/images/food/${
            url ? url : "default.jpg"
          }')"
        ></div>
      </div>
    </li>
  </a>`;

const requestFromAPI = async () => {
  let url = new URL(
    window.location.protocol +
      window.location.host +
      "/completed/recipes/search"
  );

  const res = await fetch(url.toString());
  const { rows } = await res.json();

  return rows;
};

function populateResult(elId, results, templateFn) {
  let rowsHtml = "";
  for (let i = 0; i < results.length; i++) {
    rowsHtml += templateFn(results[i]);
  }
  document.getElementById(elId).innerHTML = rowsHtml;
}

async function init() {
  const rows = await requestFromAPI();
  console.log("rows", rows);
  populateResult("search-results", rows, templateResult);
}

init();
