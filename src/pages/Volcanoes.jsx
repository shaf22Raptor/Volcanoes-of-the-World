// all functions used to display volcano search page defined here
// CSS styling is in App.css

import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';

// ag-grid-react stylesheets
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-balham.css";

const API_URL = `http://4.237.58.241:3000`;

// main function for volcanoes search page
export default function Volcanoes() {
  const [rowData, setRowData] = useState([]); // rowdata for ag-grid table
  const navigate = useNavigate(); // page navigation
  const [countries, setCountries] = useState([]); // used to hold the data of countries available in API
  const [country, setCountry] = useState(); // used to hold country selected to filter data being fetched for volcanoes
  const [distance, setDistance] = useState(); // used to hold distance that user wants to filter volcano data
  
  // columns used in ag-grid table defined
  const columns = [
    { headerName: "ID", field: "id" },
    { headerName: "Name", field: "name" },
    { headerName: "Country", field: "country" },
    { headerName: "Region", field: "region" },
    { headerName: "Subregion", field: "subregion" }
  ];

  // executed as soon as page is loaded to allow user to filter by countries recognised by API
  useEffect(() => {
    fetch(`${API_URL}/countries`)
      .then(res => res.json())
      .then(data =>
        // format data so it can be displayed in search bar for user to choose from
        data.map(country => {
          return {
            value: country,
            label: country
          };
        })
      )
      .then(formattedData => setCountries(formattedData))
      .catch((error) => {
        console.log(error.message);
      })
  }, []);

  // if user chooses a country, then it will immediately send a request to get volcanoes in said country
  useEffect(() => {
    if (country) {
      let request = `${API_URL}/volcanoes?country=${country.value}`;
      // if user also adds a distance filter, URL will change accordingly
      if (country && distance) {
        request = `${API_URL}/volcanoes?country=${country.value}&populatedWithin=${distance.value}`
      }
      fetch(request)
        .then(res => res.json())
        .then(data =>
          // map data so it can be used in ag-grid table
          data.map(volcano => {
            return {
              id: volcano.id,
              name: volcano.name,
              country: volcano.country,
              region: volcano.region,
              subregion: volcano.subregion
            };
          })
        )
        // place retrieved and formatted volcano data into ag-grid theme table
        .then(volcano => setRowData(volcano))
        .catch((error) => {
          console.log(error.message);
        })
    }
  }, [country, distance]); // useEffect is dependent on change of country and distance filters

  return (
    <div className="container">

      {/*div used to store all main page elements in center of screen*/}
      <div
        className="ag-theme-balham"
        style={{ width: "1080px" }}
      >
        <h1>Volcanoes</h1>
        {/*search bar used to filter volcanoes*/}
        <div
          className="volcano-search"
        >
          {/*search bar used to filter by country*/}
          <div className="country-search">
          <p>Select Country:</p>
          {/*if countries have loaded from server then allow user to use search bar*/}
          {countries.length > 0 ? (
            <Select
              className="country-search"
              classNamePrefix="select"
              name="color"
              isClearable={true}
              options={countries}
              onChange={selectedOption => {
                setCountry(selectedOption);
              }}
            />
            //if country data has not loaded, then let user know that the data is loading
          ) : (
            <p>Loading...</p>
          )}
          </div>

          {/*search bar used to filter by distance*/}
          <div className="distance-filter">
          <p>Select with distance from population:</p>
          <Select
            className="distance-filter"
            classNamePrefix="select"
            name="color"
            isClearable={true}
            isSearchable={false}
            options={[
              { value: "5km", label: "5km" },
              { value: "10km", label: "10km" },
              { value: "30km", label: "30km" },
              { value: "100km", label: "100km" }
            ]}
            // user can change distance whenever they wish due to use of useEffect
            onChange={selectedDistance => {
              setDistance(selectedDistance);
            }}
          />
          </div>
        </div>
        <h2>
          {/*number of volcanoes found from search*/}
          {rowData.length} volcanoes found
        </h2>
        {/*table used to show retrieved volcano data*/}
        <AgGridReact
          columnDefs={columns}
          rowData={rowData}
          pagination={true}
          paginationPageSize={7}
          onRowClicked={(row) => navigate(`/volcano?id=${row.data.id}`)}
        />
      </div>
    </div>
  );
}
