const templateRow = (image, index) =>
  `<div data-id="${index}" class="swiper-slide" style="background-image: url('/images/food/${image}')"></div>`;

const templateIngredients = ({
  ingredient_image,
  ingredient_title,
  ingredient_type,
}) => `<div class="swiper-slide" style="background-image: url('/images/food/${ingredient_image}')">
    <div class="label-image label-${ingredient_type}"></div>
    <div class="ingredient-title">${ingredient_title}</div>
  </div>`;

const templateList = ({
  ingredient_title,
  ingredient_type,
  ingredient_image,
}) => `<li class="detail-result ingredient-result">
<div class="result-text">${ingredient_title}</div>
<div class="result-labels">
  <div 
    class="label-result label-mini-image" 
    style="background-image:url('/images/food/${ingredient_image}')"
  ></div>
  <div class="label-result label-${ingredient_type}"></div>
</div>
</li>`;

const requestFromAPI = async () => {
  const queryParams = new URLSearchParams(window.location.search);
  const url = new URL(
    window.location.protocol +
      window.location.host +
      "/recipes/get?id=" +
      queryParams.get("id")
  );

  const res = await fetch(url.toString());
  const obj = await res.json();

  return obj;
};

function populateResult(results, templateFn) {
  let rowsHtml = "";
  for (let i = 0; i < results.length; i++) {
    rowsHtml += templateFn(results[i], i);
  }
  return rowsHtml;
}

async function init() {
  const results = await requestFromAPI();
  const photos = results.photos.filter((photo) => photo !== "default.jpg");

  document.getElementById("swiper-ingredients").innerHTML =
    populateResult(photos, templateRow) +
    populateResult(results.ingredients, templateIngredients);
  document.getElementById("list").innerHTML = populateResult(
    results.ingredients,
    templateList
  );

  document.getElementById("title").innerText = results.title;
  document.getElementById("body").innerHTML = results.body.replace(
    /\\n/g,
    "<br />"
  );
  document.getElementById("hero").style.backgroundImage =
    "url(/images/food/" + results.photos[0] + ")";

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
