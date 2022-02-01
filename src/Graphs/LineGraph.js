import numeral from "numeral";
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";


const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, caseType = 'cases', country = 'worldwide') => {
  let chartData = [];
  let points = null;
  if (country === 'worldwide'){
    points = data[caseType];
  } else {
    const jsonKeyForData = 'timeline';
    points = data[jsonKeyForData][caseType];
  }
  for (const point in points) {
    chartData.push({
      x: point,
      y: points[point],
    });
  }
  return chartData;
};

const LineColour = {
  cases: {
    backgroundColor : "rgba(204, 16, 52, 0.5)",
    borderColor : "#CC1034",
  },
  deaths: {
    backgroundColor : "rgba(199, 197, 197, 0.5)",
    borderColor : "#360301",
  },
  recovered: {
    backgroundColor : "rgba(225, 245, 228, 0.5)",
    borderColor : "#05f525",
  },
};

function LineGraph(props) {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const country = props.country === 'worldwide' ? 'all' : props.country;
      await fetch(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=120`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const chartData = buildChartData(data, props.caseType, props.country);
          setData(chartData);
        });
    };

    fetchData();
  },[props.caseType, props.country]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: LineColour[props.caseType].backgroundColor,
                borderColor: LineColour[props.caseType].borderColor,
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;
