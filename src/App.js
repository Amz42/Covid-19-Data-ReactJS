import React, { Component } from 'react';
import SelectCountry from './components/SelectCountry';
import Title from './components/Title';
import Chart from './components/Chart';
import Loader from './components/Loader';
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
      BACKEND: "https://covid19-data-analysis.herokuapp.com",//"http://localhost:8000",
      agedata: undefined,
      zone_data: undefined,
      prediction: undefined,
    }
  }

  componentDidMount(){
    this.getData();
    this.getCountries();
    this.getIndiaStatus();
    this.getAgeDeatils();
    this.getZoneData();
    this.getPredictionData();
  }

  getPredictionData = async () =>{
    var myHeaders = new Headers();
    var requestOptions = {method: 'GET',headers: myHeaders,redirect: 'follow'};

    fetch(this.state.BACKEND+"/api/india_prediction", requestOptions)
    .then(response => response.text())
    .then(result =>{ 
      this.setState({prediction: JSON.parse(result)});
      this.PlotPredictionChart();
    })
    .catch(error => console.log('error', error));
  }

  getZoneData = async () => {
    var myHeaders = new Headers();
    var requestOptions = {method: 'GET',headers: myHeaders,redirect: 'follow'};

    fetch(this.state.BACKEND+"/api/zone", requestOptions)
    .then(response => response.text())
    .then(result =>{ 
      this.setState({zone_data: JSON.parse(result)});
      this.PlotZoneChart();
    })
    .catch(error => console.log('error', error));
  }

  getAgeDeatils = async () => {
    var myHeaders = new Headers();
    //myHeaders.append("Cookie", "csrftoken=FVHUXRMkIoNDNWTAUEnPvjbcApCmu15gib2KuuvC6EoAMndxxyS7wqgf8JwTjSxF");
    var requestOptions = {method: 'GET',headers: myHeaders,redirect: 'follow'};

    fetch(this.state.BACKEND+"/api/age-group", requestOptions)
    .then(response => response.text())
    .then(result =>{ 
      this.setState({agedata: JSON.parse(result)});
      this.PlotAgePieChart();
    })
    .catch(error => console.log('error', error));
  }

  PlotPredictionChart = () =>{
    let data = this.state.prediction;
    let p_confirmed = data.Predicted_Confirmed;
    //let p_death = data.Predicted_Deaths;
    let dates = data.Date;

    for(let i=0;i<dates.length;i++){
      let d = dates[i].split("T")[0].split("-");
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
      dates[i] = month+" "+d[2];
    }
    
    Highcharts.chart('india-prediction', {
      chart:{
        type: "spline",
        backgroundColor: "rgba(255,255,255,0.9)",
        color: "black",
        font: 'bold',
      },
      title: {
        text: 'Covid-19 Confirmed Cases Prediction India using Machine Learning',
        font: 'bold',
      },
      subtitle: {
        text: "These predictions are based on the live data from api & are predicted using Polynomial Regression."
      },
      yAxis: {
        title: {text: 'Number of People'}
      },
      xAxis: {
        categories: dates,
        title: {text: '<b>Dates (Year: 2020-21)</b>'}
      },
      // legend: {
      //   layout: 'vertical',
      //   align: 'right',
      //   verticalAlign: 'top'
      // },
      plotOptions: {
        series: {
          label: {connectorAllowed: false},
          pointStart: 1
        }
      },
      colors : ["red", "black"],
      series:[{
        name: 'Predicted Confirmed',
        data: p_confirmed
      } //,{name: 'Predicted Deaths',data: p_death}
      ],
      responsive: {
          rules: [{
            condition: {maxWidth: 500},
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

  }

  PlotZoneChart = () => {
    let data = this.state.zone_data;
    let zone_states = data.State;
    let Red = data.Red;
    let Orange = data.Orange;
    let Green = data.Green;

    Highcharts.chart('india-zones-barchart', {
      chart: {
        type: 'column',
        backgroundColor: "rgba(255,255,255,0.9)",
        color: "black",
        font: 'bold',
      },
      title: {
        text: 'Zones in Each State in India'
      },
      xAxis: {
        categories: zone_states
      },
      yAxis: {
        min: 0,
        title: {
          text: 'No. of Zones'
        },
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: ( // theme
              Highcharts.defaultOptions.title.style &&
              Highcharts.defaultOptions.title.style.color
            ) || 'gray'
          }
        }
      },
      legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor:
          Highcharts.defaultOptions.legend.backgroundColor || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      colors: ['red','green','orange'],
      series: [ {name:'Red',data:Red}, {name:'Green',data:Green}, {name: 'Orange',data: Orange} ]
    });
  }

  PlotAgePieChart = () => {
    let agegroups = this.state.agedata.AgeGroup;
    let perc = this.state.agedata.Percentage;
    let data = [];
    //let explode = ['false','false','false','false','false','false','false','false','false','false'];

    for(let i=0;i<perc.length;i++){
      let obj = {};
      obj.name = agegroups[i];
      if(i!==9) obj.name += ' years';
      obj.y = perc[i];
      //obj.sliced = explode[i];
      data = [...data,obj];
    }

    Highcharts.chart('age-group-india', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        backgroundColor: "rgba(255,255,255,0.87)",
        color: "black",
        font: 'bold',
      },
      title: {text: 'Covid-19 Cases India Age-wise Distribution'},
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {valueSuffix: '%'}
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        name: 'Percentage',
        colorByPoint: true,
        data: data
      }]
    });

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
    //console.clear();

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
    //console.clear();
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
            <div className="col-lg-8 col-xs-12 col-md-10 col-sm-12 mx-auto">
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
            <div className="col-lg-4">
              <div className="" align="center" id="india-heading">
                <h2 id="india-heading"> India Live Status</h2>
                {
                  this.state.IndiaData &&
                  <table className="mt-1" align="center">
                    <tbody>
                      <tr>
                        {/* Confirmed Cases */}
                        <td>
                          <div className="card text-white bg-danger mb-1 mr-1" style={{ maxWidth: "18rem", }} >
                            <div className="card-header"> Confirmed </div>
                            <div className="card-body">
                              <h5 className="card-title mt-1" align="center"> {this.state.IndiaData.totalCases} </h5>
                            </div>
                          </div>
                        </td>
                        {/* Active Cases */}
                        <td>
                          <div className="card text-white bg-warning mb-1 mr-1" style={{ maxWidth: "18rem", }} >
                            <div className="card-header"> Active </div>
                            <div className="card-body">
                              <h5 className="card-title mt-1" align="center"> {this.state.IndiaData.activeCases} </h5>
                            </div>
                          </div>
                        </td>
                        {/* Recovered Cases */}
                        <td>
                          <div className="card text-white bg-success mb-1 mr-1" style={{ maxWidth: "18rem", }} >
                            <div className="card-header"> Recovered </div>
                            <div className="card-body">
                              <h5 className="card-title mt-1" align="center"> {this.state.IndiaData.recovered} </h5>
                            </div>
                          </div>
                        </td>
                        {/* Death Cases */}
                        <td>
                          <div className="card text-white bg-dark mb-1" style={{ maxWidth: "18rem", }} >
                            <div className="card-header"> Deaths </div>
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
              
              {/* Age-Group-PieChart */}
              <div id="age-group-india">
                <Loader />
              </div>
            </div>

          </div>

        </div>

        <hr className="hr"/>

        {/* Indian States Data */}
        <div className="container-fluid">
          <div className="row">    
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-3" id="india-states-barchart">
              <Loader />
            </div>
          </div>
        </div>

        <hr className="hr"/>

        {/* Indian Zones Data */}
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-3" id="india-zones-barchart">
              <Loader />
            </div>
          </div>
        </div>

        <hr className="hr"/>

        {/* Predicted Indian Data */}
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mb-3" id="india-prediction">
              <Loader />
            </div>
          </div>
        </div>

      </React.Fragment>
    );
  }
}

export default App;