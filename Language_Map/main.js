(function() {
    const languageToInfo = {
      "English": { city: "New Delhi", coords: [77.2090, 28.6139] },
      "Telugu": { city: "Hyderabad",   coords: [78.4867, 17.3850] },
      "Gujarati": { city: "Ahmedabad",  coords: [72.5714, 23.0225] }
    };
  
    const languageColors = {
      "English": "#e41a1c", 
      "Telugu": "#377eb8",  
      "Gujarati": "#4daf4a" 
    };
  
    function getTenseNodes() {
      return linguisticData[0].children;
    }
  
    function populateTenseDropdown() {
      const tenseSelect = d3.select("#tenseSelect");
      getTenseNodes().forEach(node => {
        tenseSelect.append("option")
          .attr("value", node.name)
          .text(node.name);
      });
    }
  
    function getTenseNode(tenseName) {
      return getTenseNodes().find(node => node.name === tenseName);
    }
  
    function populateFeatureDropdown(tenseNode) {
      const featureSelect = d3.select("#featureSelect");
      featureSelect.selectAll("option").remove();
      if (tenseNode.children && tenseNode.children.length > 0) {
        tenseNode.children.forEach(feature => {
          if (feature.examples && feature.examples.length > 0) {
            featureSelect.append("option")
              .attr("value", feature.name)
              .text(feature.name);
          }
        });
      }
    }
  
    function getFeatureNode(tenseNode, featureName) {
      if (tenseNode.children && tenseNode.children.length > 0) {
        return tenseNode.children.find(feature => feature.name === featureName);
      }
      return null;
    }
  
    function updateMarkdownList(featureNode) {
      const container = d3.select("#markdownList");
      container.html("");
      if (!featureNode || !featureNode.examples) {
        container.html("<p>No examples available.</p>");
        return;
      }
      let markdown = "<ul>";
      featureNode.examples.forEach(example => {
        markdown += `<li>**${example.language}**: ${example.description}</li>`;
      });
      markdown += "</ul>";
      container.html(markdown);
    }
  
    const svg = d3.select("svg");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
  
    const projection = d3.geoMercator()
                         .center([78.9629, 20.5937])
                         .scale(1000)
                         .translate([width / 2, height / 2]);
    const path = d3.geoPath().projection(projection);
  
    function drawLegend() {
      svg.selectAll(".legend").remove();
      const legend = svg.append("g")
                        .attr("class", "legend")
                        .attr("transform", "translate(20,20)");
      Object.keys(languageColors).forEach((lang, i) => {
        const legendRow = legend.append("g")
                                .attr("transform", `translate(0, ${i * 20})`);
        legendRow.append("rect")
                 .attr("width", 18)
                 .attr("height", 18)
                 .attr("fill", languageColors[lang]);
        legendRow.append("text")
                 .attr("x", 24)
                 .attr("y", 14)
                 .text(lang);
      });
    }
  
    function updateMarkers(featureNode) {
      svg.selectAll(".marker").remove();
      svg.selectAll(".label").remove();
  
      if (!featureNode) return;
  
      const languages = Array.from(new Set(featureNode.examples.map(d => d.language)));
      const markersData = languages.map(lang => ({
        language: lang,
        info: languageToInfo[lang]
      }));
  
      svg.selectAll(".marker")
         .data(markersData)
         .enter()
         .append("circle")
         .attr("class", "marker")
         .attr("r", 5)
         .attr("transform", d => {
           const [x, y] = projection(d.info.coords);
           return `translate(${x}, ${y})`;
         })
         .attr("fill", d => languageColors[d.language] || "#000");
  
      svg.selectAll(".label")
         .data(markersData)
         .enter()
         .append("text")
         .attr("class", "label")
         .attr("x", d => projection(d.info.coords)[0] + 8)
         .attr("y", d => projection(d.info.coords)[1] + 4)
         .text(d => `${d.info.city}`);
    }
  
    function updateVisualization() {
      const tenseName = d3.select("#tenseSelect").property("value");
      const featureName = d3.select("#featureSelect").property("value");
      const tenseNode = getTenseNode(tenseName);
      const featureNode = getFeatureNode(tenseNode, featureName);
      updateMarkers(featureNode);
      updateMarkdownList(featureNode);
    }
  
    populateTenseDropdown();
  
    d3.select("#tenseSelect").on("change", function() {
      const tenseName = d3.select(this).property("value");
      const tenseNode = getTenseNode(tenseName);
      populateFeatureDropdown(tenseNode);
      updateVisualization();
    });
  
    d3.select("#featureSelect").on("change", function() {
      updateVisualization();
    });
  
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(worldData => {
      const countries = topojson.feature(worldData, worldData.objects.countries).features;
      const india = countries.filter(d => +d.id === 356);
      svg.selectAll("path")
         .data(india)
         .enter()
         .append("path")
         .attr("d", path)
         .attr("class", "country");
  
      drawLegend();
  
      const defaultTense = d3.select("#tenseSelect").property("value");
      const tenseNode = getTenseNode(defaultTense);
      populateFeatureDropdown(tenseNode);
  
      updateVisualization();
    });

  })();
  