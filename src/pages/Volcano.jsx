// functions for page showing data for individual volcano data defined here
// CSS defined in App.css

import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Map, Marker } from "pigeon-maps";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'

// setup chart used to show population data
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)
const API_URL = `http://4.237.58.241:3000`;

export default function Volcano() {
  const navigate = useNavigate(); 
  const [volcanoData, setVolcanoData] = useState(null); // set individual volcano data to be shown 
  const [searchParams] = useSearchParams(); // used to get data from volcanoes search page then use to set ID (next line)
  const id = searchParams.get("id");  
  const token = sessionStorage.getItem("token");  // retrieve token from server if use has it
  const [headerData, setHeaderData] = useState(null); // set headerData sent to server based on whether user has token or not
  const [error, setError] = useState(false); // set error message 

  // check if user has token from server
  const checkToken = () => {

    // if user has token data, then header will be sent containing token so user can see population data
    if (token !== null) {
      setHeaderData({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      });
      return;
    }
    else {
      setHeaderData({ "Content-Type": "application/json" });
    }
  };

  // check if user has token upon loading up page
  useEffect(() => {
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // attempt to load data upon loading page
  useEffect(() => {

    // headerData has been processed, then attempt will be made to retrieve data from server
    if (headerData !== null) {
      fetch(`${API_URL}/volcano/${id}`, {
        method: "GET",
        headers: headerData
      })
        .then(res => {
          console.log(res);
          return res.json();
        })
        .then(volcano => {
          console.log(volcano);
          // format retrieved data so it can be used on web page
          return {
            name: volcano.name,
            country: volcano.country,
            region: volcano.region,
            subregion: volcano.subregion,
            last_eruption: volcano.last_eruption,
            summit: volcano.summit,
            elevation: volcano.elevation,
            latitude: volcano.latitude,
            longitude: volcano.longitude,
            population_5km: volcano.population_5km,
            population_10km: volcano.population_10km,
            population_30km: volcano.population_30km,
            population_100km: volcano.population_100km
          };
        })
        .then(volcano => setVolcanoData(volcano))
        .catch((error) => {
          console.log(error.message);
          setError(true);
        })
    }
  }, [headerData, id]);

  // setting population data for chart
  const data = {
    labels: ['5 km', '10 km', '30 km', '100 km'],
    datasets: [
      {
        label: 'Population',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        // if data has been loaded, then it will display
        data: [
          volcanoData ? volcanoData.population_5km : null,
          volcanoData ? volcanoData.population_10km : null,
          volcanoData ? volcanoData.population_30km : null,
          volcanoData ? volcanoData.population_100km : null
        ]
      }
    ]
  };

  // format table features such as axes titles
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Population'
      }
    },
    scales: {
      x: {
        type: 'category', // specify the scale type as category
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    }
  };

  // Render bar graph
  const renderBarGraph = () => {
    // render bar graph if user has a token
    if (token !== null) {
      return <Bar data={data} options={options} />;
    } else {
      // otherwise show message informing user to sign in
      return <p>Login to access exclusive data</p>;
    }
  }

  // if an error is found while trying to fetch data, the page will inform the user of this
  if (error) {
    return <p>Please sign in again. Your token has probably expired, or there is a server side error.</p>;
  }
  else {
    return (
      <div className="container">
        <div className="volcano-info">

          {/*this container contains all volcanic data except for map. This is so the map can be shown next to volcanic data*/}
          <div className="volcano-data">
            {/*show volcano name as main header if it has loaded. If not, then it will show loading message */}
            <h1>{volcanoData ? volcanoData.name : 'Loading...'}</h1>

            {/*show volcano data if it has loaded */}
            {volcanoData ? (
              <p>
                <strong>Country:</strong> {volcanoData.country} <br />
                <strong>Region:</strong> {volcanoData.region} <br />
                <strong>Subregion:</strong> {volcanoData.subregion}<br />
                <strong>Last eruption:</strong> {volcanoData.last_eruption} <br />
                <strong>Summit:</strong> {volcanoData.summit} <br />
                <strong>Elevation:</strong> {volcanoData.elevation} <br />
                <strong>Latitude:</strong> {volcanoData.latitude} <br />
                <strong>Longitude:</strong> {volcanoData.longitude}
              </p>
            ) : (
              <p>Loading...</p>
            )}

            {/* bar graph and back button are placed close to each other, hence they are in same div */}
            <div className="bar-graph">
              {renderBarGraph()}
              <button
                onClick={() => navigate("/volcanoes")}
              >
                Back
              </button>
            </div>
          </div>

          {/*map of volcano shown to the right of above volcano data content */}
          <div
            className="map"
            style={{ height: "100px", width: "480px" }}>

            {/*volcano data only shown if it has loaded */}
            {volcanoData ? (
              <Map height={400} defaultCenter={[parseFloat(volcanoData.latitude), parseFloat(volcanoData.longitude)]} defaultZoom={4}>
                <Marker width={50} anchor={[parseFloat(volcanoData.latitude), parseFloat(volcanoData.longitude)]} />
              </Map>
            ) : <p>Loading data</p>}
          </div>
        </div>
      </div>
    );
  }
}