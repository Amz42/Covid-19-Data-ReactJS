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
    }
  }

  componentDidMount(){
    this.getData();
    this.getCountries();
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
        text: 'Source: GetPostMan.com (Covid-19 API)'
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
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top'
      },
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
        <div className="container">
          <div className="row">
            <div className="col-12 mx-auto mt-3">
              <Title title="COVID-19 Data"/>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 col-xs-12 col-md-10 col-sm-12 mx-auto">
              <SelectCountry countries={this.state.countries} countrySelector={this.countrySelector} />
            </div>
          </div>
        </div>


        <div className="container-fluid">
          <div className="row">
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
        </div>
      </React.Fragment>
    );
  }
}

export default App;