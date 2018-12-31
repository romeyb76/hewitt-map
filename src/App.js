import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import Sidebar from "./components/Sidebar";

class App extends Component {
  /*state = {
    venues: [],
    markers: [],
    query: ""
  };*/
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      venues: []
    };
  }

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
      });
  };

  loadMap = () => {
    loadScript(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyBzIIxexz8vA1DDmjY9vLLIeIJOX2uBCP4&callback=initMap"
    );
    window.initMap = this.initMap;
  };

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 31.462391, lng: -97.195839 },
      zoom: 14
    });

    // Create An InfoWindow
    const infowindow = new window.google.maps.InfoWindow();

    // Display dynamic markers
    this.state.venues.map(myVenue => {
      const contentString = `${myVenue.venue.name}`;

      const marker = new window.google.maps.Marker({
        position: {
          lat: myVenue.venue.location.lat,
          lng: myVenue.venue.location.lng
        },
        map: map,
        title: myVenue.venue.name
        //animation: google.maps.Animation.DROP
      });
      this.markers.push(marker);
      // Enables marker clicks
      marker.addListener("click", () => {
        // Change InfoWindow Content
        infowindow.setContent(contentString);

        // Opens an InfoWindow
        infowindow.open(map, marker);

        // Makes a marker bounce
        /*toggleBounce = () => {
          if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
          } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
          }
        };*/
      });
    });

    var request = {
      location: Hewitt
    };

    const service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);

    callback = (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
          var place = results[i];
          createMarker(results[i]);
        }
      }
    };
  }; // End initMap
  handleMarkerClick = marker => {
    this.closeMarkers();
    marker.isOpen = true;
    this.setState({ markers: Object.assign(this.state.markers, marker) });
    const venue = this.state.venues.find(venue => venue.id === marker.id);
  };
  clickListItem = venue => {
    //const marker = this.state.markers.find(marker.id === venue.id);
    console.log(venue);
  };
  /*filterMarkers = query => {
    this.markers.forEach(marker => {
      marker.name.toLowerCase().includes(query.toLowerCase()) === true
        ? marker.setVisible(true)
        : marker.setVisible(false);
    });
    this.setState({ query });console.log(query);
};*/

  render() {
    return (
      <main>
        <div id="map" />
        <div>
          <input
            type="text"
            value={this.state.query}
            onChange={e => {
              this.filterMarkers(e.target.value);
            }}
          />
        </div>
        <Sidebar {...this.state} clickListItem={this.clickListItem} />
      </main>
    );
  }
}

function loadScript(url) {
  var index = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default App;
