// constant url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Initialize the dashboard 
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names and populate the drop-down selector
    d3.json(url).then((data) => {
        
        // Set a variable for the sample names
        let names = data.names;

        // Add  the samples to dropdown menu
        names.forEach((id) => {

            // Log it
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // Set the first sample from the list
        let sample_one = names[0];

        // Log it
        console.log(sample_one);

        // Build those plots
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
        buildGaugeChart(sample_one);

    });
};

// Populate that metadata stuff
function buildMetadata(sample) {

    // Use D3 
    d3.json(url).then((data) => {

        // Retrieve metadata
        let metadata = data.metadata;

        // Filter 
        let value = metadata.filter(result => result.id == sample);

        // Log it
        console.log(value)

        // Get the first index from the array
        let valueData = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Build that bar chart
function buildBarChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve 
        let sampleInfo = data.samples;

        // Filter 
        let value = sampleInfo.filter(result => result.id == sample);

        // Retrieve first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log it
        console.log(otu_ids,otu_labels,sample_values);

        // Make top ten items go in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Foundation for bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Create layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Plot the bar chart by plotly
        Plotly.newPlot("bar", [trace], layout)
    });
};

//  Builds that bubble chart
function buildBubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sample_info = data.samples;

        // Filter based on the value of the sample
        let value = sample_info.filter(result => result.id == sample);

        // Get the first index from the array
        let value_data = value[0];

        // make those otu_ids, lables, and sample values
        let otu_ids = value_data.otu_ids;
        let otu_labels = value_data.otu_labels;
        let sample_values = value_data.sample_values;

        //  Data to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // create layout
        let layout = {
            title: "OTU ID by Sample Values",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // plot the bubble chart by plotly
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// need to create update dashboard when sample is changed
function optionChanged(value) { 
    console.log(value); 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

// do the initialize function
init();
