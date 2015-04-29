//global variables
var width=450,
	cellSize,
	padding=18;
	
var selectedPros = [];
var SPMData = {};

//loading geojson data	
d3.json("shape_json.json",function(data){
	
	//the features parts
	var features = data.features;
	
	//get all attributes
	var traits = d3.keys(features[0].properties),
		n = traits.length;
	
	//filter numeric attributes
	var traitsIsNum = [];	
	
	for(var i=0;i<n;i++){
		var temp = traits[i];
		if(typeof(data.features[0].properties[temp])==='number'){traitsIsNum.push(temp);}
	};	

	//list numeric attributes for selecting
	for(var i=0;i<traitsIsNum.length;i++){
	var option = document.createElement("option");
	option.text = traitsIsNum[i];
	option.value = traitsIsNum[i];
	document.getElementById("to-include").add(option);
	};
	
	//set clicking-to-add
	$("#to-include option").click(function()
	{
		$(this).toggleClass("scm-highlight");

		if($(this).hasClass("scm-highlight")){
			$(this).attr("selected","selected");
			selectedPros.push($(this).val());
			//console.log(selectedPros);
			}
			
		else{
			$(this).attr("selected",false);
			var temp = selectedPros.indexOf($(this).val());
			if (temp > -1) {
				selectedPros.splice(temp, 1);
			}
			//console.log(selectedPros);
		};	
		drawSPM();
	});

	//save selected attributes separately 	
	function getSPMData(){
		selectedPros.forEach(function(selectedPro){
			SPMData[selectedPro] = [];
			for (var i=0;i<features.length;i++){
				SPMData[selectedPro].push(features[i].properties[selectedPro]);
			}
		})
	};	
	
	function drawSPM(){

		//initialization
		$("#scm-plot").empty();

		getSPMData();
		
		//cell size decreases with the increasing of selected properties
		var selectedNum = selectedPros.length;
			cellSize = 450/selectedNum;		
			
		var x = d3.scale.linear()
			.range([padding/2,cellSize-padding/2]);
			
		var y = d3.scale.linear()
				.range([cellSize-padding/2,padding/2]);
				
		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(5)
			.tickFormat(d3.format("s"));
			
		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(5)
			.tickFormat(d3.format("s"));
			
		var domainByTrait = {};
		
		selectedPros.forEach(function(selectedPro){
			domainByTrait[selectedPro] = [0,d3.max(SPMData[selectedPro])];
			//console.log(domainByTrait[selectedPro]);
		});
			
		var brush = d3.svg.brush()
		  .x(x)
		  .y(y)
		  .on("brushstart", brushstart)
		  .on("brush", brushmove)
		  .on("brushend", brushend);
		
		var svg = d3.select("#scm-plot").append("svg")
			.attr("width",500)
			.attr("height",480)
		.append("g")
			.attr("transform","translate(30,0)");
			
		//add the caption	
		svg.append("text")
			.attr("x",300)
			.attr("y",8)
			.attr("class","scm-text")
			.text("Scatter Plot Matrix");
			
		svg.selectAll(".y.axis")
			.data(selectedPros)
			.enter()
		.append("g")
			.attr("class","y axis")
			.attr("transform",function(d,i){
				return "translate(0," + i*cellSize + ")";
				})
			.each(function(d,i){
				if(i>0){
					yAxis.tickSize(-cellSize * (i)+9);
					y.domain(domainByTrait[d]);
					d3.select(this).call(yAxis);
					}});	
			
		svg.selectAll(".x.axis")
			.data(selectedPros)
		.enter().append("g")
			.attr("class","x axis")
			.attr("transform",function(d,i){ 
				return "translate(" + i*cellSize + "," + selectedNum*cellSize+")";
				})
			.each(function(d,i){
				if(i<selectedNum-1){
					xAxis.tickSize(-cellSize * (selectedNum-i-1)+10);
					x.domain(domainByTrait[d]);
					d3.select(this).call(xAxis);
					}});
		
		svg.selectAll(".x.axis").selectAll("text")
							.attr("transform", function(d) {return "rotate(-20)";  });
		
		//draw cells and circles
		function plot(p) {
			var cell = d3.select(this);

			x.domain(domainByTrait[p.x]);
			y.domain(domainByTrait[p.y]);

			cell.append("rect")
				.attr("class", "frame")
				.attr("x", padding / 2)
				.attr("y", padding / 2)
				.attr("width", cellSize - padding)
				.attr("height", cellSize - padding);

			cell.filter(function(d) { return d.i !== d.j; }).selectAll("circle")
				.data(features)
			  .enter().append("circle")
				.attr("cx", function(d) { return x(d.properties[p.x]); })
				.attr("cy", function(d) { return y(d.properties[p.y]); })
				.attr("r", 3)
				.style("fill","steelblue");
		};
	
		//assign data of cells to c
		function cross(a, b) {
		var c = [], n = a.length, m = b.length, i, j;
		for (i=0;i<n;i++) for (j=i;j<m;j++) c.push({x: a[i], i: i, y: b[j], j: j});
		return c;
		} 
	
		var cell = svg.selectAll(".cell")
			.data(cross(selectedPros,selectedPros))
		.enter().append("g")
			.attr("class","cell")
			.attr("transform",function(d) { 
				return "translate(" + (d.i) * cellSize + "," + (d.j) * cellSize + ")"; 
				})
			.each(plot);

		cell.filter(function(d) { 
			return d.i === d.j; })
		.append("text")
		  .attr("x", padding/2)
		  .attr("y", -1)
		  .attr("dy", ".71em")
		  .text(function(d) { return d.x; });
		  
		cell.filter(function(d) { return d.i === d.j; })
			.each(scmHist);
		
		var brushCell;
	
		// Clear the previously-active brush, if any.
		function brushstart(p) {
			if (brushCell !== this) {
			  d3.select(brushCell).call(brush.clear());
			  x.domain(domainByTrait[p.x]);
			  y.domain(domainByTrait[p.y]);
			  brushCell = this;
			}
		  }
	  
	// Highlight the selected circles.
		function brushmove(p) {
			var e = brush.extent();
			svg.selectAll("circle").classed("hiddenCircle", function(d) {
			  return e[0][0] > d.properties[p.x] || d.properties[p.x] > e[1][0]
				  || e[0][1] > d.properties[p.y] || d.properties[p.y] > e[1][1];
			});
		  }

	  // If the brush is empty, select all circles.
	  function brushend() {
		if (brush.empty()) svg.selectAll(".hiddenCircle").classed("hiddenCircle", false);
	  }
	  
	  //draw histogram
	  function scmHist(p){
		
		var histData = SPMData[p.x];
		
		var maxHeight = cellSize - padding -10;
		
		var bins = 5;
		
		var histogram = d3.layout.histogram()
			.bins(bins)
			(histData)
			
		var histogramLength = histogram.map(function(i) {return i.length});

		var maxValue = d3.max(histogramLength,function(d){return d});
		
		var canvas = d3.select(this);
		
		var bars = canvas.selectAll(".bar")
			.data(histogram)
			.enter()
			.append("g")
			.attr("transform","translate(12,18)");
			
		bars.append("rect")
			.attr("x",function(d,i){return (maxHeight/bins+2)*i;})
			.attr("y",function(d){return (maxHeight-(d.length/maxValue)*maxHeight);})
			.attr("width",function(d){return maxHeight/bins-2;})
			.attr("height",function(d){return (d.length/maxValue)*maxHeight;})
			.attr("fill","steelblue");
			
		bars.append("text")
			.attr("x",function(d,i){return (maxHeight/bins+2)*i + (maxHeight/bins)/2;})
			.attr("y",function(d){return (maxHeight-(d.length/maxValue)*maxHeight-1);})
			.text(function(d,i){return d.length;})
			.attr("text-anchor","middle");
	  }
	
	//cells in diagonal are histograms
	cell.filter(function(d) { return d.i !== d.j; }).call(brush);

	d3.select(self.frameElement).style("height", cellSize * selectedNum + padding + 20 + "px"); 
	};
});