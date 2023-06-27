const file_input = document.querySelector(".file-input");
const filter_options = document.querySelectorAll(".filter button");
const filter_name = document.querySelector(".filter-info .name");
const filter_value = document.querySelector(".filter-info .value");
const filter_slider = document.querySelector(".slider input");
const rotate_options = document.querySelectorAll(".rotate button");
const preview_img = document.querySelector(".preview-img img");
const reset_filter_button = document.querySelector(".reset-filter");
const choose_img_button = document.querySelector(".choose-img");
const save_img_button = document.querySelector(".save-img");

let brightness = "100";
let saturation = "100";
let inversion = "0";
let grayscale = "0";
let rotate = 0;
let flip_horizontal = 1;
let flip_vertical = 1;

const load_image = () => {
  let file = file_input.files[0];
  if (!file) return;
  preview_img.src = URL.createObjectURL(file);
  preview_img.addEventListener("load", () => {
    reset_filter_button.click();
    document.querySelector(".container").classList.remove("disable");
  });
};
const apply_filter = () => {
  preview_img.style.transform = `rotate(${rotate}deg) scale(${flip_horizontal}, ${flip_vertical})`;
  preview_img.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};

filter_options.forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    option.classList.add("active");
    filter_name.innerText = option.innerText;

    if (option.id === "brightness") {
      filter_slider.max = "200";
      filter_slider.value = brightness;
      filter_value.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filter_slider.max = "200";
      filter_slider.value = saturation;
      filter_value.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filter_slider.max = "100";
      filter_slider.value = inversion;
      filter_value.innerText = `${inversion}%`;
    } else {
      filter_slider.max = "100";
      filter_slider.value = grayscale;
      filter_value.innerText = `${grayscale}%`;
    }
  });
});

const update_filter = () => {
  filter_value.innerText = `${filter_slider.value}%`;
  const selected_filter = document.querySelector(".filter .active");

  if (selected_filter.id === "brightness") {
    brightness = filter_slider.value;
  } else if (selected_filter.id === "saturation") {
    saturation = filter_slider.value;
  } else if (selected_filter.id === "inversion") {
    inversion = filter_slider.value;
  } else {
    grayscale = filter_slider.value;
  }
  apply_filter();
};

rotate_options.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90;
    } else if (option.id === "right") {
      rotate += 90;
    } else if (option.id === "horizontal") {
      flip_horizontal = flip_horizontal === 1 ? -1 : 1;
    } else {
      flip_vertical = flip_vertical === 1 ? -1 : 1;
    }
    apply_filter();
  });
});

const reset_filter = () => {
  brightness = "100";
  saturation = "100";
  inversion = "0";
  grayscale = "0";
  rotate = 0;
  flip_horizontal = 1;
  flip_vertical = 1;
  filter_options[0].click();
  apply_filter();
};
const save_image = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = preview_img.naturalWidth;
  canvas.height = preview_img.naturalHeight;

  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotate !== 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.scale(flip_horizontal, flip_vertical);
  ctx.drawImage(
    preview_img,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  const link = document.createElement("a");
  link.download = "image.jpg";
  link.href = canvas.toDataURL();
  link.click();
};

filter_slider.addEventListener("input", update_filter);
reset_filter_button.addEventListener("click", reset_filter);
save_img_button.addEventListener("click", save_image);
file_input.addEventListener("change", load_image);
choose_img_button.addEventListener("click", () => file_input.click());
