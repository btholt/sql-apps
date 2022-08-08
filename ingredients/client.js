const templateRow = ({
  id,
  image,
  title,
  type,
}) => `<div data-id="${id}" class="swiper-slide" style="background-image: url('/images/food/${image}')">
  <div class="label-image label-${type}"></div>
  <div class="ingredient-title">${title}</div>
</div>`;

const templateResult = ({
  id,
  title,
  type,
  image,
}) => `<li class="ingredient-result">
  <div class="result-text">${id} — ${title}</div>
  <div class="result-labels">
    <div 
      class="label-result label-mini-image" 
      style="background-image:url('/images/food/${image}')"
    ></div>
    <div class="label-result label-${type}"></div>
    <button data-id="${id}" type="submit" class="label-result label-remove"></button>
  </div>
</li>`;

const requestFromAPI = async (type, term = "", page = 0) => {
  let url = new URL(
    window.location.protocol + window.location.host + "/ingredients/search"
  );
  if (type) {
    url = new URL(
      window.location.protocol + window.location.host + "/ingredients/type"
    );
    url.searchParams.append("type", type);
  } else {
    url.searchParams.append("term", term);
    url.searchParams.append("page", page);
  }
  const res = await fetch(url.toString());
  const { rows } = await res.json();

  return rows;
};

const deleteFromAPI = async (id) => {
  const url = new URL(
    window.location.protocol + window.location.host + "/ingredients/delete"
  );
  const res = fetch(url.toString(), {
    method: "DELETE",
    body: JSON.stringify({ id }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

function populateResult(elId, results, templateFn) {
  let rowsHtml = "";
  for (let i = 0; i < results.length; i++) {
    rowsHtml += templateFn(results[i]);
  }
  document.getElementById(elId).innerHTML = rowsHtml;
}

const prev = document.getElementById("prev-button");
const next = document.getElementById("next-button");
function togglePaginationButtons(page, count) {
  console.log(page, count);
  if (page === 0) {
    prev.setAttribute("disabled", "");
    next.removeAttribute("disabled");
  } else if ((page + 1) * 5 >= +count) {
    prev.removeAttribute("disabled");
    next.setAttribute("disabled", "");
  } else {
    prev.removeAttribute("disabled");
    next.removeAttribute("disabled");
  }
}

async function init() {
  let page = 0;

  const fruit = await requestFromAPI("fruit");
  populateResult("swiper-fruit", fruit, templateRow);
  const vegetable = await requestFromAPI("vegetable");
  populateResult("swiper-vegetable", vegetable, templateRow);
  const meat = await requestFromAPI("meat");
  populateResult("swiper-meat", meat, templateRow);
  const other = await requestFromAPI("other");
  populateResult("swiper-other", other, templateRow);
  const searchResults = await requestFromAPI();
  populateResult("search-results", searchResults, templateResult);
  togglePaginationButtons(page, searchResults[0].total_count);

  const formElem = document.getElementById("search");
  formElem.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.getElementById("search-results").innerHTML = "";
    const formData = new FormData(formElem);
    page = 0;
    const searchResults = await requestFromAPI(void 0, formData.get("term"));
    populateResult("search-results", searchResults, templateResult);
    togglePaginationButtons(page, searchResults[0].total_count);
  });

  const resultsForm = document.getElementById("ingredient-deletion");
  resultsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = +e.submitter.dataset.id;
    await deleteFromAPI(id);
    const term = document.getElementById("search-term").value;
    const searchResults = await requestFromAPI(void 0, term, page);
    populateResult("search-results", searchResults, templateResult);
    togglePaginationButtons(page, searchResults[0].total_count);
  });

  document
    .getElementById("pagination")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const action = e.submitter.dataset.action;
      let searchResults;
      if (action === "prev") {
        page--;
      } else {
        page++;
      }
      const term = document.getElementById("search-term").value;
      searchResults = await requestFromAPI(void 0, term, page);

      populateResult("search-results", searchResults, templateResult);
      togglePaginationButtons(page, searchResults[0].total_count);
    });

  new Swiper(".swiper", {
    loop: true,
    slidesPerView: 5,
    spaceBetween: 20,
    slidesPerGroup: 5,

    pagination: {
      el: ".swiper-pagination",
    },

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}

init();
