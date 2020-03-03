import React from "react";
// @material-ui/core
import { makeStyles, withStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
//icon used for the weather card
import BrightnessLowIcon from '@material-ui/icons/BrightnessLow';
// axios for API calls
import axios from "axios";
// Modal.js for the random images
import Modal from "components/Modal/Modal.js";


//OpenWeatherMap API call information
const API_URL       = 'http://api.openweathermap.org/data/2.5/weather';
const API_KEY       = 'a79b1e3e7a5f57296124607b1ce7c5b6';
const LOCATION_CODE = '4809537';
const UNITS = 'imperial';
const FULL_API_URL  = `${API_URL}?id=${LOCATION_CODE}&units=${UNITS}&appid=${API_KEY}`;

//AlphaVantage API call information
const STOCK_URL = 'https://www.alphavantage.co/';
const STOCK_API_KEY = 'URF6AY9EKMBO6WLC';
const FULL_APPLE_STOCK_URL = `${STOCK_URL}query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=${STOCK_API_KEY}`;
const FULL_MSFT_STOCK_URL = `${STOCK_URL}query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=${STOCK_API_KEY}`;
const FULL_AMZN_STOCK_URL = `${STOCK_URL}query?function=GLOBAL_QUOTE&symbol=AMZN&apikey=${STOCK_API_KEY}`;

//Unsplash API call information
// https://api.unsplash.com/photos/random?client_id=6u25Jq7M5X6FfEHwONPKNaFRy4HtRIzpYRy6x8h_3wM&count=5
const IMAGE_URL = 'https://api.unsplash.com/photos/random';
const IMAGE_API = '6u25Jq7M5X6FfEHwONPKNaFRy4HtRIzpYRy6x8h_3wM';
// image count 
const IMAGE_COUNT = '5';
const FULL_IMAGE_URL = `${IMAGE_URL}?client_id=${IMAGE_API}&count=${IMAGE_COUNT}`;
const RANDOM_URL = 'https://source.unsplash.com/random';


const useStyles = makeStyles(styles);

class Dashboard extends React.Component {

//declare functions
  componentDidMount() {
    this.getweatherresults();
    this.getstockresults();
    this.getrandomimages();
  }

  //constructors for state variables
  constructor(props)
  {
    super(props);
    this.state = {temp: "n/a",
                  lowtemp: "n/a",
                  hightemp: "n/a",
                  weatherdesc: "n/a",
                  cityname: "n/a",  
                  AAPLsymbol: "n/a", MSFTsymbol: "n/a", AMZNsymbol: "n/a",
                  AAPLprice: "n/a", MSFTprice: "n/a", AMZNprice: "n/a",
                   images: []
            };
  }

//weather API function
getweatherresults()
{
  axios
  .get(FULL_API_URL)
  .then(result => 
    {
      //populates the state variables with API data
      this.setState({temp: result.data.main.temp});
      this.setState({lowtemp: result.data.main.temp_min});
      this.setState({hightemp: result.data.main.temp_max});
      this.setState({weatherdesc: result.data.weather[0].description});
      this.setState({cityname: result.data.name});
    });
  }

  //AlphaVantage API function
getstockresults()
{ 
  //Appl Stock API call
  axios
  .get(FULL_APPLE_STOCK_URL)
  .then(aaplresult => 
    { 
      //populates the state variables with API data
      //had to break the JSON data into brackets to account for spaces
       this.setState({AAPLsymbol: aaplresult.data["Global Quote"]["01. symbol"]});
       this.setState({AAPLprice: aaplresult.data["Global Quote"]["05. price"]});
    });

    //Microsoft stock API call
   axios
  .get(FULL_MSFT_STOCK_URL)
  .then(msftresult => 
    {
      //populates the state variables with API data
      //had to break the JSON data into brackets to account for spaces
      this.setState({MSFTsymbol: msftresult.data["Global Quote"]["01. symbol"]});
       this.setState({MSFTprice: msftresult.data["Global Quote"]["05. price"]});
    });

  //Amazon stock API call
  axios
  .get(FULL_AMZN_STOCK_URL)
  .then(amznresult => 
    {
      //populates the state variables with API data
      //had to break the JSON data into brackets to account for spaces
      this.setState({AMZNsymbol: amznresult.data["Global Quote"]["01. symbol"]});
      this.setState({AMZNprice: amznresult.data["Global Quote"]["05. price"]});
    }); 
  }
  getrandomimages()
  {
    axios
    .get(FULL_IMAGE_URL)
    .then(imageresult =>
      {
       const images = imageresult.data;
        this.setState({images});
      });

  }

  render()
  
{
  const {classes} = this.props;
  const temperature = Math.round(this.state.temp);
  return (
    <div>
      <GridContainer>        
        <GridItem xs={12} sm={6} md={3}>
        {
          // card for weather output
        }
          <Card>
          <CardHeader color="warning" icon>
              <CardIcon color="warning">
              <BrightnessLowIcon/>
              </CardIcon>              
            </CardHeader>
            <CardBody>          
              <p>{this.state.cityname} Weather</p>
              <h3 className={classes.cardTitle}> {temperature}F              
              </h3>
              <p>Forecast: {this.state.weatherdesc}</p>
              </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={15} sm={15} md={8}>
        {
          // card for populating a table with stock API data
        }
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Stocks</h4>
              <p className={classes.cardCategoryWhite}>
                Stock info from <a href = "https://www.alphavantage.co/">AlphaVantage</a>
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={["Stock", "Symbol", "Price"]}
                tableData={[
                  ["Apple", this.state.AAPLsymbol, this.state.AAPLprice],
                  ["Microsoft", this.state.MSFTsymbol, this.state.MSFTprice],
                  ["Amazon", this.state.AMZNsymbol, this.state.AMZNprice]
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      { 
      // container for the 5 random images, calling Modal to populate the random image
      // map goes through the images array and calls Modal for each value
      // gets the urls.small 
      }
      <GridContainer>
        {this.state.images.map(image => <Modal imageurl = {image.urls.regular} />)}
      </GridContainer>
    </div>
  );
}
}
export default withStyles(styles)(Dashboard);
