const templateResult = ({
  recipe_id,
  title,
  url,
}) => `<li class="ingredient-result">
  <div class="result-text">${recipe_id} — ${title}</div>
  <div class="result-labels">
    <div 
      class="label-result label-mini-image" 
      style="background-image:url('/images/food/${url}')"
    ></div>
  </div>
</li>`;

const requestFromAPI = async () => {
  let url = new URL(
    window.location.protocol + window.location.host + "/recipes/search"
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
  populateResult("search-results", rows, templateResult);
  console.log("rows", rows);
}

init();
