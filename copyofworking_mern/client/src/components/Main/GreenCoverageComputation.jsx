import React, { useState, useEffect } from "react";
import { Upload, Button, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
// import Chart from "chart.js";
// import { Chart } from "react-chartjs-2";
import { Bar, getDatasetAtEvent } from 'react-chartjs-2';
import { useRef } from 'react';
import Chart from 'react-apexcharts';

function GreenCoverageComputation() {
    const [imageData1, setImageData1] = useState(null);
    const [imageData2, setImageData2] = useState(null);
    const [graphdata, setGraphdata] = useState(null);
    //   const [greenCoveragePercentage, setGreenCoveragePercentage] = useState(null);
    const [greenCoveragePercentage, setGreenCoveragePercentage] = useState(null);
    var options;
    
    function createHistogramData(greenPixels1, greenPixels2) {
        const binSize = 10;
        const maxBin = 100;

        const bins = Array.from({ length: maxBin / binSize }, (_, i) => i * binSize);
        const binCounts1 = Array.from({ length: maxBin / binSize }, () => 0);
        const binCounts2 = Array.from({ length: maxBin / binSize }, () => 0);

        greenPixels1.forEach((value) => {
            const binIndex = Math.floor(value / binSize);
            binCounts1[binIndex]++;
        });

        greenPixels2.forEach((value) => {
            const binIndex = Math.floor(value / binSize);
            binCounts2[binIndex]++;
        });


        const data = {
            labels: bins.map((bin) => `${bin}-${bin + binSize}`),
            datasets: [
                {
                    label: 'Image 1',
                    data: binCounts1,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Image 2',
                    data: binCounts2,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                },
            ],
        };

        return data;
    }

    function computeGreenCoveragePercentage(imageData) {
        const threshold = 100; // Adjust this threshold value based on your requirements
        let greenPixels = 0;
        let totalPixels = 0;

        // Loop through each pixel in the image
        for (let i = 0; i < imageData.length; i += 4) {
            const red = imageData[i];
            const green = imageData[i + 1];
            const blue = imageData[i + 2];

            // Calculate the average intensity of RGB values
            const intensity = (red + green + blue) / 3;

            if (intensity > threshold) {
                greenPixels++;
            }
            totalPixels++;
        }

        // Calculate the green coverage percentage
        const greenCoveragePercentage = (greenPixels / totalPixels) * 100;
        return greenCoveragePercentage.toFixed(2); // Round to 2 decimal places
    }


    const handleImageUpload = (file, setImageData) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                setImageData(imageData);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };


    const handleCalculate = () => {

        if (imageData1 && imageData2) {
            const differenceImageData = new Uint8ClampedArray(imageData1.length);
            for (let i = 0; i < imageData1.length; i += 4) {
                for (let j = i; j < i + 3; j++) {
                    differenceImageData[j] = Math.abs(imageData1[j] - imageData2[j]);
                }
                differenceImageData[i + 3] = 255; // Set alpha channel to opaque
            }
            // Perform image computation and update the green coverage percentage
            const percentage = computeGreenCoveragePercentage(differenceImageData);
            setGreenCoveragePercentage(percentage);
            // Render statistical graphs
            // const data = createHistogramData(imageData1, imageData2)
            // console.log(data);
            // setGraphdata(data)
            // options = {
            //     chart: {
            //         type: 'bar',
            //     },
            //     xaxis: {
            //         categories: graphdata.labels,
            //     },
            //     yaxis: {
            //         title: {
            //             text: 'Count',
            //         },
            //     },
            // };

            //   renderStatisticalGraphs(percentage);
        }
    };

    return (
        <div>
            {/* <Title level={2}>Green Coverage Computation</Title> */}
            <div>
                <Upload
                    beforeUpload={(file) => false}
                    onChange={(info) => handleImageUpload(info.file, setImageData1)}
                >
                    <Button icon={<UploadOutlined />}>Upload Image 1</Button>
                </Upload>
            </div>
            <div>
                <Upload
                    beforeUpload={(file) => false}
                    onChange={(info) => handleImageUpload(info.file, setImageData2)}
                >
                    <Button icon={<UploadOutlined />}>Upload Image 2</Button>
                </Upload>
            </div>
            <div>
                <Button type="primary" onClick={handleCalculate}>
                    Calculate
                </Button>
            </div>
            <div>
                {greenCoveragePercentage !== null && (
                    <>
                        <h3>Green Coverage Percentage: {greenCoveragePercentage}%</h3>
                        {/* <h2>Green Coverage Histogram</h2>
                        <Chart
                            options={options}
                            series={graphdata}
                            type="bar"
                            width="100%"
                            height="400px"
                        /> */}


                        {/* <div>
              <canvas id="barChart" width="400" height="200"></canvas>
            </div>
            <div>
              <canvas id="lineChart" width="400" height="200"></canvas>
            </div> */}
                    </>
                )}
            </div>
        </div>
    );
}

export default GreenCoverageComputation;
