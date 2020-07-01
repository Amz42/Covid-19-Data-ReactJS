import React, { Component } from 'react';
import SelectCountry from './components/SelectCountry';
import Title from './components/Title';
import Chart from './components/Chart';
import Highcharts from 'highcharts';


class App extends Component{
  constructor(props) {
    super(props)

    this.state = {
      data: undefined,
      countries: undefined,
      selectedCountry: "india",
      loading: true,
      IndiaData: undefined,
    }
  }

  componentDidMount(){
    this.getData();
    this.getCountries();
    this.getIndiaStatus();
  }

  PlotIndiaStatesBarChart = () =>{
    let data = this.state.IndiaData.regionData;
    let states = [];
    let states_confirmed = [];
    let states_recovered = [];
    let states_active = [];
    let states_deaths = [];

    data.map(obj=>{
      states = [...states,obj.region];
      states_confirmed = [...states_confirmed,obj.totalCases];
      states_active = [...states_active,obj.totalInfected];
      states_recovered = [...states_recovered,obj.recovered];
      states_deaths = [...states_deaths,obj.deceased];

      return obj;
    });

    Highcharts.chart('india-states-barchart', {
      chart: {
        type: 'column',
        backgroundColor: "rgba(255,255,255,0.9)",
        color: "black",
        font: 'bold',
      },
      title: {
        text: 'Indian States/UTs Covid Cases'
      },
      subtitle: {
        // text: 'Source: Apify.com/covid-19'
      },
      xAxis: {
        categories: states,
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'No. of Cases'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      colors : ["red", "orange", "green", "black"],
      series: [{
        name: 'Confirmed',
        data: states_confirmed
      }, {
        name: 'Active',
        data: states_active
      }, {
        name: 'Recovered',
        data: states_recovered
      }, {
        name: 'Deaths',
        data: states_deaths
      }]
    });

  }

  getIndiaStatus = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Cookie", "AWSALB=11TYA+navezScrCZAqmwPusvhuuVX1mxhctmZ5IiaazsoCxj8C+oHreGTVsBc629RJdvMttIZqgETHYnmas+KERMOu3FXHCijXaEmbBPIoGz3H+471EFUpL2EDos; AWSALBCORS=11TYA+navezScrCZAqmwPusvhuuVX1mxhctmZ5IiaazsoCxj8C+oHreGTVsBc629RJdvMttIZqgETHYnmas+KERMOu3FXHCijXaEmbBPIoGz3H+471EFUpL2EDos");
    var requestOptions = {method: 'GET',headers: myHeaders,redirect: 'follow'};

    fetch("https://api.apify.com/v2/key-value-stores/toDWvRj1JpTXiM8FF/records/LATEST?disableRedirect=true", requestOptions)
    .then(response => response.text())
    .then(result =>{
      this.setState({IndiaData: JSON.parse(result)});
      this.PlotIndiaStatesBarChart();
    })
    .catch(error => console.log('error', error));

  }

  countrySelector = () => {
    // loader
    this.setState({loading: true});

    let str = document.getElementById("country-selector").value;
    document.getElementById("country-selector").disable=true;
    this.setState({selectedCountry: str});
    this.getData(str);
  }

  getCountries = async () => {
    let requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch(`https://api.covid19api.com/countries`, requestOptions)
      .then(response => response.text())
      .then(result => this.setState({countries: JSON.parse(result)}))
      .catch(error => console.log('error', error));
  }

  DataCleaner = (data) => {
    let l = data.length;
    for(let i=1;i<l-1;i++){
      let x=data[i-1] , y=data[i] , z=data[i+1];
      if( (x<y && y>z && z>x) || (x>y && y<z && z>x)){
        data[i] = Math.floor((x+z)/2);
      }
    }
    return data;
  }

  plotCharts = () =>{
    // loader
    this.setState({loading:false})

    let data = this.state.data;
    let confirmed_cases = [];
    let recovered_cases = [];
    let deceased_cases = [];
    let active_cases = [];
    let dates = [];
    
    
    data.map(obj => {
      confirmed_cases = [...confirmed_cases, obj.Confirmed];
      recovered_cases = [...recovered_cases, obj.Recovered];
      deceased_cases = [...deceased_cases, obj.Deaths];
      active_cases = [...active_cases, obj.Active];
      let d = obj.Date;
      d = d.split("T")[0];
      d = d.split("-");
      let month;
      switch (d[1]){
        case "01": month = "Jan"; break;
        case "02": month = "Feb"; break;
        case "03": month = "Mar"; break;
        case "04": month = "Apr"; break;
        case "05": month = "May"; break;
        case "06": month = "June"; break;
        case "07": month = "July"; break;
        case "08": month = "Aug"; break;
        case "09": month = "Sep"; break;
        case "10": month = "Oct"; break;
        case "11": month = "Nov"; break;
        case "12": month = "Dec"; break;
        default : month = "Jan";
      }
      d = month+" "+d[2];
      dates = [...dates, d];
      return obj;
    });

    confirmed_cases = this.DataCleaner(confirmed_cases);
    recovered_cases = this.DataCleaner(recovered_cases);
    deceased_cases = this.DataCleaner(deceased_cases);
    active_cases = this.DataCleaner(active_cases);

    // console.log("active ", active_cases);
    // console.log("deceased ", deceased_cases);
    // console.log("confirmed ", confirmed_cases);
    // console.log("recovered ", recovered_cases);

    let country = this.state.selectedCountry;
    country = country.charAt(0).toUpperCase() + country.slice(1);

    Highcharts.chart('chart', {
      chart:{
        type: "spline",
        backgroundColor: "rgba(255,255,255,0.9)",
        color: "black",
        font: 'bold',
      },
      title: {
        text: 'Covid-19 Cases: '+country,
        font: 'bold',
      },
      subtitle: {
        // text: 'Source: GetPostMan.com (Covid-19 API)'
      },
      yAxis: {
        title: {
          text: 'Number of People'
        }
      },
      xAxis: {
        categories: dates,
        title: {
          text: '<b>Dates (Year: 2020)</b>'
        }
        // accessibility: {
        //   rangeDescription: 'Range: Jan to May'
        // }
      },
      // legend: {
      //   layout: 'vertical',
      //   align: 'right',
      //   verticalAlign: 'top'
      // },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
          pointStart: 1
        }
      },
      colors : ["red", "green", "black", "orange"],
      series:[{
        name: 'Confirmed',
        data: confirmed_cases
      },{
        name: 'Recovered',
        data: recovered_cases
      },{
        name: 'Deaths',
        data: deceased_cases
      },{
        name: 'Active',
        data: active_cases
      }],

      responsive: {
          rules: [{
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }]
      }
    });
    console.clear();
    // HighCharts Code ends here
  }

  getData = async (country=this.state.selectedCountry) => {
    let requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch(`https://api.covid19api.com/total/country/${country}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        // console.log(result);
        this.setState({data: JSON.parse(result)});
        try{
          document.getElementById("country-selector").disable=false;
        }catch{}
        if(JSON.parse(result) && result!==undefined && result!==""){
          this.plotCharts();
        } 
        // else{this.setState({data_availabel: false});}
      })
      .catch(error => console.log('error', error));
  }
  

  render(){
    console.clear();
    return (
      <React.Fragment>
        <div className="container-fluid">

          {/* Main Page Heading */}
          <div className="row">
            <div className="col-12 mx-auto mt-3">
              <Title title="COVID-19 Data Analysis"/>
            </div>
          </div>


          <div className="row">
            
            {/* All Countries Data */}
            <div className="col-lg-9 col-xs-12 col-md-10 col-sm-12 mx-auto">
              <SelectCountry countries={this.state.countries} countrySelector={this.countrySelector} />

              { !(this.state.data===false) &&
                <Chart id="chart"/>
              }
              { this.state.data===false &&
                  <div className="card bg-light mb-3 mx-auto mt-5 col-lg-6" style={{maxWidth:"18rem"}}>
                    <div className="card-body">
                      <h5 className="card-title" align="center">No Data to Display</h5>
                      <p className="card-text">No data was availabel in our database for your request</p>
                    </div>
                  </div>
              }
            </div>

            {/* India Data */}
            <div className="col-lg-3">
              <div className="" align="center" id="india-heading">
                <h2 id="india-heading"> India Live Status</h2>
                {
                  this.state.IndiaData &&
                  <table className="mt-5" align="center">
                    <tbody>
                      <tr>
                        {/* Confirmed Cases */}
                        <td>
                          <div className="card text-white bg-danger mb-1 mr-1" style={{ maxWidth: "18rem", }} >
                            <div className="card-header"> Confirmed Cases </div>
                            <div className="card-body">
                              <h5 className="card-title mt-1" align="center"> {this.state.IndiaData.totalCases} </h5>
                            </div>
                          </div>
                        </td>
                        {/* Active Cases */}
                        <td>
                          <div className="card text-white bg-warning mb-1" style={{ maxWidth: "18rem", }} >
                            <div className="card-header"> Active Cases </div>
                            <div className="card-body">
                              <h5 className="card-title mt-1" align="center"> {this.state.IndiaData.activeCases} </h5>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        {/* Recovered Cases */}
                        <td>
                          <div className="card text-white bg-success mb-1 mr-1" style={{ maxWidth: "18rem", }} >
                            <div className="card-header"> Total Recovered </div>
                            <div className="card-body">
                              <h5 className="card-title mt-1" align="center"> {this.state.IndiaData.recovered} </h5>
                            </div>
                          </div>
                        </td>
                        {/* Death Cases */}
                        <td>
                          <div className="card text-white bg-dark mb-1" style={{ maxWidth: "18rem", }} >
                            <div className="card-header"> Total Deaths </div>
                            <div className="card-body">
                              <h5 className="card-title mt-1" align="center"> {this.state.IndiaData.deaths} </h5>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                }
              </div>
            </div>

          </div>

        </div>

        {/* Indian States Data */}
        <div className="container-fluid">
          <div className="row">    
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mx-auto mb-3" id="india-states-barchart"></div>
          </div>
        </div>

      </React.Fragment>
    );
  }
}

export default App;