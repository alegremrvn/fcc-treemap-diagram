let colors = [
  "#8B4513",
  "#6495ED",
  "#B0C4DE",
  "#20B2AA",
  "#A0522D",
  "#BDB76B",
  "#DDA0DD",
  "#FFFF00",
  "#9932CC",
  "#F0FFF0",
  "#F0FFFF",
  "#EEE8AA",
  "#E0FFFF",
  "#FF1493",
  "#AFEEEE",
  "#32CD32",
  "#FFE4C4",
  "#556B2F"
]
const height = 600
const width = 970
const svgArea = height * width

let body = d3
  .select('body')

body
  .append('h1')
  .attr('id', 'title')
  .text('Video Game Sales')

body
  .append('h2')
  .attr('id', 'description')
  .text('Top 100 Most Sold Video Games Grouped by Platform')

let svg = d3
  .select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('background-color', 'lightgray')

let legend = body
  .append('svg')
  .attr('id', 'legend')
  .attr('width', 100)
  .attr('height', 100)

let colorScale = d3
  .scaleThreshold()
  .domain([3, 12, 21, 30, 39, 48, 57, 66])
  .range(d3.schemeGreens[9])

legend
  .selectAll('rect')
  .data([3, 12, 21, 30, 39, 48, 57, 66])
  .enter()
  .append('rect')
  .attr('width', 10)
  .attr('height', 10)
  .attr('x', (d, i) => i * 10)
  .attr('y', 10)
  .attr('class', 'legend-item')
  .style('fill', (d) => colorScale(d))

const handleMouseleave = function (event) {
  d3.selectAll("#tooltip")
    .remove()
}

const handleMouseover = function (event) {
  d3.select(this)
    .on("mouseleave", handleMouseleave)

  const thisX = d3.select(this)
    .attr("x")

  const thisValue = d3.select(this)
    .attr("data-value")

  svg.append("text")
    .attr("x", thisX)
    .attr("y", 10)
    .attr("id", "tooltip")
    .attr("data-value", thisValue)
    .text(thisValue)
}


Promise.all([
  d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')
]).then(function (data) {
  const root = d3.hierarchy(data[0])
  root.count()

  let treemap = d3.treemap()
    .size([width, height])
    .padding(2)

  let nodes = treemap(root
    .sum(function (d) { return d.value; })
    .sort(function (a, b) { return b.height - a.height || b.value - a.value; }))
    .descendants()

  nodes = nodes.slice(19, 119)

  let categories = []
  for (let i = 0; i < 18; i++) {
    categories.push(data[0].children[i].name)
  }
  
  let categoryColorHash = {}
  for (let i in categories) {
    categoryColorHash[categories[i]] = colors[i]
  }

  svg
    .selectAll('rect')
    .data(nodes)
    .enter()
    .append('rect')
    .attr('class', 'tile')
    .attr('x', 0)
    .attr('y', 10)
    .attr('width', 20)
    .attr('height', 20)
    .attr('data-name', d => d.data.name)
    .attr('data-category', d => d.data.category)
    .attr('data-value', d => d.data.value)
    .style('fill', d => categoryColorHash[d.data.category])
    .on('mouseover', handleMouseover)

})
