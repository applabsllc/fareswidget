import React, {useState, useEffect} from 'react';
import './Fareswidget.css';
import logo from './logo.png';

const Fareswidget = () => {
	
//general variables
 const [fares, setFares] = useState([]);
 const [faresLoaded, setFaresLoaded] = useState(false);
 const [helperTexts, setHelperTexts] = useState({});
 const [helperText, setHelperText] = useState('');
 const [rideTotal, setRideTotal] = useState(0.00);

//user options
 const [fromZone, setFromZone] = useState('');
 const [whenRiding, setWhenRiding] = useState('weekday');
 const [wherePurchased, setWherePurchased] = useState('advance_purchase');
 const [ridesNeeded, setRidesNeeded] = useState(1);
 
//useEffect

 useEffect(() => {
	 //fetch from source
	fetch('http://www.applabsllc.com/fares.php')
    .then((response) => response.json())
    .then((jsonData) => {
		//save retrieved data
		setFares(jsonData);
		//set helper texts
		setHelperTexts(jsonData.info);
		setHelperText(jsonData.info[whenRiding]);
		//set zone
		setFromZone(jsonData.zones[0].zone);
		//set loaded
		setFaresLoaded(true);
    })
    .catch((error) => console.error(error));
 }, []);
 
 //update total and set helper text on change
 useEffect(() => {
	 setHelperText(helperTexts[whenRiding]);
	 updateTotal();
 }, [fromZone, whenRiding, wherePurchased, ridesNeeded]);
 
 const updateTotal = () => {
	if(faresLoaded){
	
	 
	let zone = (fares.zones.filter((zone) => zone.zone == fromZone))[0];
	let fare = (zone.fares.filter((fare) => fare.type == whenRiding && fare.purchase == wherePurchased))[0];
	let totalFare = 0.00;
	
	
		//determine cost for combination
		if(fare.type == "anytime" && fare.purchase == "advance_purchase" && fare.trips == 10){
						
			alert("This type of fare is discounted and requires a bulk purchase of 10 rides");
			//force rides to 10 if not 10
			if(ridesNeeded != 10)
			setRidesNeeded(10);
		
			totalFare = fare.price;
		}else{
			totalFare = ridesNeeded * fare.price;
		}
		
		//update cost to layout
		setRideTotal(totalFare.toFixed(2));
		
	}
 }
 
 
  return (
	<div className="widgetWrapper">
		<div className="widgetHeader">
			<div className="blocky">
				<img src={logo} className="ridesLogo" />
			</div>
			<div className="blocky headerTitle">
				Regional Rail Rates
			</div>
		</div>
		<div className="widgetContent">
			<div className="title">Where are you going?</div>
			
			<select id="fromZone" className="niceInput" onChange={(e) => setFromZone(e.target.value)} >
				{!faresLoaded? <option>Loading...</option> : 
				fares.zones.map((zone) => 
					<option value={zone.zone}>{zone.name}</option>
				)}
			</select>
		</div>
		<div className="widgetContent">
			<div className="title">When are you riding?</div>
			
			<select id="whenRiding" className="niceInput" onChange={(e) => setWhenRiding(e.target.value)} >
				<option value="weekday">Weekday</option>
				<option value="evening_weekend">Evening/Weekend</option>
				<option value="anytime">Anytime</option>
			</select>
			
			<div className="helperText" id="helperText">
				{helperText}
			</div>
			
		</div>
		<div className="widgetContent">
			<div className="title">Where will you purchase the fare?</div>
			<center>
				<div className="radioWrapper">
					<input type="radio" id="kiosk" name="wherePurchased" value="advance_purchase" onChange={(e) => setWherePurchased(e.target.value)}  checked={wherePurchased == "advance_purchase"} />
					Station Kiosk
					<br />
					<input type="radio" id="onboard" name="wherePurchased" value="onboard_purchase" onChange={(e) => setWherePurchased(e.target.value)} checked={wherePurchased == "onboard_purchase"} />
					Onboard
				</div>
			</center>
		</div>
		<div className="widgetContent">
			<div className="title">How many rides will you need?</div>
			<input type="number" className="niceInput shorterInput centeredInput" value={ridesNeeded} min="0" id="ridesNeeded" onChange={(e) => setRidesNeeded(e.target.value)} />
		</div>
		<div className="widgetContent result">
			<h4>Your fare will cost:</h4>
			<h3 id="rideTotal">$ {rideTotal}</h3>
		</div>
	</div>
  );
}

export default Fareswidget;
