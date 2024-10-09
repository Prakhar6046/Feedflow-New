import { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";

// Define map container style
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

// Default center position (e.g., London)
const defaultCenter = {
  lat: 51.505,
  lng: -0.09,
};

// Libraries to load
const libraries: any = ["places"];

const MapComponent = ({
  setAddressInformation,
  setSearchedAddress,
  setUseAddress,
  setAltitude,
}: any) => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationData, setLocationData] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDKvMKD1DyMdxR7VgqjO428--aBf9wpkxw",
    libraries,
  });

  // Handle map click to place marker and fetch address
  const onMapClick = useCallback((event: any) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newPosition: any = { lat, lng };
    setSelectedPosition(newPosition);
    setInfoWindowOpen(true);
    fetchReverseGeocode(lat, lng);
  }, []);

  // Function to perform reverse geocoding using Google Maps Geocoding API
  const fetchReverseGeocode = async (lat: any, lng: any) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDKvMKD1DyMdxR7VgqjO428--aBf9wpkxw`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        if (data.results[0].geometry) {
          const response = await fetch(
            `/api/farm/altitude?lat=${data.results[0].geometry.location.lat}&lng=${data.results[0].geometry.location.lng}`
          );
          const res = await response.json();
          setAltitude(res?.results[0]?.resolution);
        }
        const address = data.results[0].formatted_address;
        // setAddressInformation(address);
        setLocationData(address);
        const formattedAddress = formatGoogleAddress(
          data.results[0].address_components,
          data.results[0].formatted_address
        );
        setAddressInformation(formattedAddress);
      } else {
        setAddressInformation(null);
        setLocationData("Address not found.");
        alert("Address not found for the selected location.");
      }
    } catch (error) {
      console.error("Error performing reverse geocoding:", error);
      alert("An error occurred while fetching the address.");
    }
  };

  // Function to handle location search using Google Places API
  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          searchQuery
        )}&key=AIzaSyDKvMKD1DyMdxR7VgqjO428--aBf9wpkxw`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        if (data.results[0].geometry) {
          const response = await fetch(
            `/api/farm/altitude?lat=${data.results[0].geometry.location.lat}&lng=${data.results[0].geometry.location.lng}`
          );
          const res = await response.json();
          setAltitude(res?.results[0]?.resolution);
        }
        const { lat, lng } = data.results[0].geometry.location;
        const newPosition: any = { lat, lng };
        setSelectedPosition(newPosition);
        const formattedAddress = formatGoogleAddress(
          data.results[0].address_components,
          data.results[0].formatted_address
        );
        setAddressInformation(formattedAddress);
        // setAddressInformation(data.results[0].formatted_address);
        setLocationData(data.results[0].formatted_address);
      } else {
        alert("Location not found.");
      }
    } catch (error) {
      console.error(
        "Error fetching location data from Google Geocoding API:",
        error
      );
      alert("An error occurred while fetching location data.");
    }
  };
  const formatGoogleAddress = (components: any, completeAddress: any) => {
    let address = "";
    let address2 = "";
    let city = "";
    let state = "";
    let postcode = "";
    let country = "";

    address = completeAddress;
    components.forEach((component: any) => {
      if (component.types.includes("locality")) {
        city = component.long_name;
      } else if (component.types.includes("administrative_area_level_1")) {
        state = component.long_name;
      } else if (component.types.includes("postal_code")) {
        postcode = component.long_name;
      } else if (component.types.includes("country")) {
        country = component.long_name;
      } else if (
        component.types.includes("neighborhood") ||
        component.types.includes("sublocality")
      ) {
        if (address2) {
          address2 += ", " + component.long_name;
        } else {
          address2 = component.long_name;
        }
      }
    });
    return { address, city, state, postcode, country, address2 };
  };
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div>
      <Button
        type="button"
        onClick={() => setOpenDialog(true)}
        variant="contained"
        sx={{
          background: "#fff",
          fontWeight: 600,
          padding: "6px 16px",
          width: "fit-content",
          textTransform: "capitalize",
          borderRadius: "8px",
          color: "#06A19B",
          border: "1px solid #06A19B",
          boxShadow: "none",
        }}
      >
        Use Coordinates
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>Map</DialogTitle>
        <DialogContent>
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchedAddress(e.target.value);
              }}
              placeholder="Search for a location"
              variant="outlined"
              size="small"
              style={{
                padding: "8px",
                width: "300px",
                borderRadius: "4px",
                marginRight: "10px",
              }}
            />
            <Button
              onClick={handleSearch}
              variant="contained"
              sx={{
                background: "#06A19B",
                color: "#fff",
                borderRadius: "4px",
              }}
            >
              Search
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={() => {
                setOpenDialog(false), setUseAddress(true);
              }}
              sx={{
                background: "#06A19B",
                fontWeight: 600,
                padding: "6px 16px",
                width: "fit-content",
                textTransform: "capitalize",
                borderRadius: "8px",
                boxShadow: "none",
                border: "1px solid #06A19B",
                marginLeft: "10px",
              }}
            >
              Use Address
            </Button>
          </div>

          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={selectedPosition ? 13 : 8}
            center={selectedPosition || defaultCenter}
            onClick={onMapClick}
          >
            {selectedPosition && (
              <Marker
                position={selectedPosition}
                onClick={() => setInfoWindowOpen(true)}
              >
                {infoWindowOpen && locationData && (
                  <InfoWindow
                    position={selectedPosition}
                    onCloseClick={() => setInfoWindowOpen(false)}
                  >
                    <div>
                      <strong>{locationData}</strong>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            )}
          </GoogleMap>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MapComponent;
