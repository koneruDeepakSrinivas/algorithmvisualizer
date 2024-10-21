import React, { useState } from 'react';
import * as d3 from 'd3';
import './App.css'; // Import the CSS file

const App = () => {
  const [array, setArray] = useState([]);
  const [algorithm, setAlgorithm] = useState('bubbleSort');

  const generateArray = () => {
    const newArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100));
    setArray(newArray);
    drawBars(newArray);
  };

  // Bubble Sort Algorithm
  const bubbleSort = async () => {
    const arr = [...array];
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        highlightBars(j, j + 1); // Highlight the current bars

        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }

        drawBars(arr);
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay for visualization
        resetBars(j, j + 1); // Reset the bar color
      }
    }
  };

  // Insertion Sort Algorithm
  const insertionSort = async () => {
    const arr = [...array];
    const n = arr.length;
    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;

      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        drawBars(arr);
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay for visualization
        j--;
      }
      arr[j + 1] = key;
      drawBars(arr);
    }
  };

  // Quick Sort Algorithm
  const quickSort = async (arr, low, high) => {
    if (low < high) {
      const pi = await partition(arr, low, high);
      await quickSort(arr, low, pi - 1);
      await quickSort(arr, pi + 1, high);
    }
  };

  const partition = async (arr, low, high) => {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      highlightBars(j, high); // Highlight the current and pivot bars

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        drawBars(arr);
        await new Promise(resolve => setTimeout(resolve, 100)); // Delay for visualization
      }
      resetBars(j, high); // Reset the bar color
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    drawBars(arr);
    return i + 1;
  };

  const sortArray = async () => {
    if (algorithm === 'bubbleSort') {
      await bubbleSort();
    } else if (algorithm === 'insertionSort') {
      await insertionSort();
    } else if (algorithm === 'quickSort') {
      await quickSort(array, 0, array.length - 1);
    }
  };

  const drawBars = (data) => {
    d3.select("#chart").selectAll("*").remove(); // Clear previous bars
  
    const width = 40;
    const height = 300;
    const x = d3.scaleBand().domain(data.map((_, i) => i)).range([0, data.length * width]).padding(0.1);
    const y = d3.scaleLinear().domain([0, d3.max(data)]).range([height, 0]);
  
    // Remove the 'bars' assignment
    d3.select("#chart")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => x(i))
      .attr("y", d => y(d))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d))
      .attr("fill", "#4caf50") // Initial bar color
      .attr("id", (d, i) => `bar-${i}`);
  };
  
  const highlightBars = (index1, index2) => {
    d3.select(`#bar-${index1}`).style("fill", "#ff9800"); // Highlight color
    d3.select(`#bar-${index2}`).style("fill", "#ff9800"); // Highlight color
  };

  const resetBars = (index1, index2) => {
    d3.select(`#bar-${index1}`).style("fill", "#4caf50");
    d3.select(`#bar-${index2}`).style("fill", "#4caf50");
  };

  return (
    <div className="app-container">
      <h1>DSA Visualizer</h1>
      <button onClick={generateArray}>Generate Array</button>
      <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} className="dropdown">
        <option value="bubbleSort">Bubble Sort</option>
        <option value="insertionSort">Insertion Sort</option>
        <option value="quickSort">Quick Sort</option>
      </select>
      <button onClick={sortArray} disabled={array.length === 0}>Start Sorting</button>
      <svg id="chart" width="800" height="300"></svg>
    </div>
  );
};

export default App;
