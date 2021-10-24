let canvas, barWidth, actualWidth, barHeight, actualHeight, test;
let dataset = [];
let width = 500;
let height = 300;
let barsNumber = 20;
let padding = 3;
let sortOrder = true;
makeList();

d3.select("#width").on("input", function () {
  width = this.value;
  actualWidth = d3.min([width, window.innerWidth]);
});

d3.select("#height").on("input", function () {
  height = this.value;
  actualHeight = d3.min([height, window.innerHeight]);
});

d3.select("#barsNumber").on("input", function () {
  barsNumber = this.value;
});

function pickNumbers() {
  let firstKey = dataset.length == 0 ? 0 : dataset[0].key;
  dataset = [];
  for (let i = firstKey; i < firstKey + barsNumber; i++) {
    dataset.push({
      key: i,
      value: Math.floor(Math.random() * height),
    });
  }
}

function makeList() {
  pickNumbers();

  canvas = d3
    .select("body")
    .append("svg")
    .attr("class", "canvas")
    .attr("width", width)
    .attr("height", height);

  barWidth = width / barsNumber;

  canvas
    .selectAll("rect")
    .data(dataset, (d) => d.key)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * barWidth)
    .attr("y", (d) => height - d.value)
    .attr("width", barWidth - padding)
    .attr("height", (d) => d.value)
    .attr("fill", function (d) {
      return `rgb(0, 0, ${Math.round(d.value)})`;
    });

  canvas
    .selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text((d) => d.value)
    .attr("x", (d, i) => i * barWidth + (barWidth - padding) / 2)
    .attr("y", (d) => height - d.value + 20)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", barWidth / 2 + "px")
    .attr("font-family", "sans-serif");
}

function newList() {
  actualWidth = d3.min([width, window.innerWidth]);
  actualHeight = d3.min([height, window.innerHeight]);
  pickNumbers();
  updateChart();
}

function updateChart() {
  barWidth = actualWidth / barsNumber;

  let updateTransition = d3.transition().duration(500);

  canvas.attr("width", actualWidth).attr("height", actualHeight);

  let rects = canvas.selectAll("rect").data(dataset, (d) => d.key);

  rects
    .exit()
    .transition()
    .attr("x", (d, i) => i * barWidth)
    .attr("y", actualHeight)
    .remove();

  rects
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * barWidth)
    .attr("y", actualHeight)
    .merge(rects)
    .transition(updateTransition)
    .attr("x", (d, i) => i * barWidth)
    .attr("y", (d) => actualHeight - d.value)
    .attr("width", barWidth - padding)
    .attr("height", (d) => d.value)
    .attr("fill", function (d) {
      return `rgb(0, 0, ${Math.round(d.value)})`;
    });

  rects.on("mouseover", function () {
    let rect = d3.select(this);
    let xPosition = parseFloat(rect.attr("x")) + barWidth / 2;
    let yPosition = parseFloat(rect.attr("y")) - fontSize;
    let value = rect.data()[0].value;
    d3.select("#tooltip")
      .style("left", xPosition + "px")
      .style("top", yPosition + "px")
      .classed("hidden", false);
    d3.select("#value").text(value);
  });

  rects.on("mouseout", function () {
    d3.select("#tooltip").classed("hidden", true);
  });

  rects.append("title").text((d) => d.value);

  let text = canvas.selectAll("text").data(dataset, (d) => d.key);

  let fontSize = barWidth / 2;

  text
    .transition(updateTransition)
    .text((d) => d.value)
    .attr("x", (d, i) => i * barWidth + (barWidth - padding) / 2)
    .attr("y", (d) => height - d.value + fontSize)
    .attr("font-size", fontSize + "px");

  text
    .enter()
    .append("text")
    .text((d) => d.value)
    .attr("x", (d, i) => i * barWidth + (barWidth - padding) / 2)
    .attr("y", (d) => height)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", fontSize + "px")
    .attr("font-family", "sans-serif")
    .transition(updateTransition)
    .attr("y", (d) => height - d.value + fontSize);

  text
    .exit()
    .transition(updateTransition)
    .attr("x", (d, i) => i * barWidth + (barWidth - padding) / 2)
    .attr("y", height + fontSize)
    .remove();
}

function shiftValues() {
  let lastKey = dataset[dataset.length - 1].key;
  dataset.push({
    key: lastKey + 1,
    // value: Math.floor(Math.random() * height),
    value: dataset[0].value,
  });
  dataset = dataset.slice(1);
  updateChart();
}

function sortBars() {
  if (sortOrder) {
    dataset = dataset.sort((a, b) => a.value - b.value);
  } else {
    dataset = dataset.sort((a, b) => b.value - a.value);
  }

  sortOrder = !sortOrder;
  updateChart();
}
