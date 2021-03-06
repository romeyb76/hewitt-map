import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import Sidebar from "./components/Sidebar";

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      venues: []
    };
  }
  markers = [];
  
  componentDidMount() {
    this.getVenues();
  }

  //Use Foursquare to load the venue locations
  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?";
    const params = {
      client_id: "BTMAGTC2Y5G1IXAKA4VN4QN55R2DSN1105Y1XGHB0WZ5THHR",
      client_secret: "4HOKQ0ON1V1XEHKSUSEABQMNRFZGCGPIKIUIE5JMUMWVRG5W",
      query: "Hewitt",
      near: "Hewitt",
      v: 20181203
    };
    //Load endpoint and parameters
    axios
      .get(endPoint + new URLSearchParams(params))
      .then(response => {
        this.setState(
          {
            venues: response.data.response.groups[0].items
          },
          this.loadMap(),
          (this.markers = [])
        );
      })
      .catch(error => {
        console.log("ERROR! " + error);
		alert("An error has occured.")
      });
  };

  // Source: Google Maps API documentation: https://developers.google.com/maps/documentation/javascript/tutorial
  
  loadMap = () => {
    loadScript(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyBzIIxexz8vA1DDmjY9vLLIeIJOX2uBCP4&callback=initMap"
    );
    window.initMap = this.initMap;
  };

  //Loads map with default location
  
  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 31.462391, lng: -97.195839 },
      zoom: 14
    });

    // Create An InfoWindow
    const infowindow = new window.google.maps.InfoWindow();

    // Display dynamic markers and infoWindow content
	
    this.state.venues.map(myVenue => {
      const contentString = `${myVenue.venue.name}`;

      const marker = new window.google.maps.Marker({
        position: {
          lat: myVenue.venue.location.lat,
          lng: myVenue.venue.location.lng
        },
        map: map,
        title: myVenue.venue.name,
        animation: window.google.maps.Animation.DROP
      });

	  // Opens infoWindow when marker is clicked
	  
      marker.addListener("click", () => {
        // Change InfoWindow Content
        infowindow.setContent(contentString);
        // Opens an InfoWindow
        infowindow.open(map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(() => marker.setAnimation(null), 1000);
      });
	
      this.markers.push(marker); // Makes the markers appear on map
    }); 
	
	// Opens markers when list item is clicked.  Training courtesy of kenjournal
    window.markers = this.markers;
    window.infowindow = infowindow;
    
  }; // End initMap
  updateList = query => {
    // Update the query value and filter the list of locations accordingly
    this.setState({
      selectedIndex: null,
      filtered: this.filterMarkers(this.state.venues, query)
    });
  };

  filterMarkers = query => {
    /*this.venues.filter(venue =>
      venue.title.toLowerCase().includes(query.toLowerCase())
    );*/
    this.markers.forEach(marker => {
      marker.title.toLowerCase().includes(query.toLowerCase()) === true
        ? marker.setVisible(true)
        : marker.setVisible(false);
    });
    this.setState({ query });
  }
 
  // Method that enables the selection of markers by clicking on list item. Training courtesy of kenjournal
  
  clickListItem = venue => {
    //const marker = this.markers.find(m => m.name === venue.name)[0];
    for (let i = 0; i < window.markers.length; i++) {
      if (venue.name === window.markers[i].title) {
        window.infowindow.setContent(venue.name);
        window.infowindow.open(window.map, window.markers[i]);
        window.markers[i].setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(() => window.markers[i].setAnimation(null), 1000);
      }
    }
  };

  render() {
    return (
      <main>
        <div id="map" role="application" aria-label="map"/>
        <div>
          <input
            type="text"
            value={this.state.query}
            onChange={e => {
              this.filterMarkers(e.target.value);
            }}
          />
        </div>

        <Sidebar
          {...this.state}
          showListItems={this.clickListItem}
          filterMarkers={this.updateList}
        />
      </main>
    );
  }
}

// Loads the API script. Training courtesy of Yahya Elharony
function loadScript(url) {
  var index = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default App;
