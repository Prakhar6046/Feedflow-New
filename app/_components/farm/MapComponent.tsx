import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// Fix Leaflet icon issues
const iconDefault: any = L.Icon.Default;
delete iconDefault.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom hook to center the map
function LocationMarker({
  setSelectedPosition,
}: {
  setSelectedPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      setSelectedPosition([lat, lng]);
    },
  });
  return null;
}

const SetMapView = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();
  if (position) {
    map.setView(position);
  }
  return null;
};

const MapComponent = ({
  setAddressInformation,
  setSearchedAddress,
  setAltitude,
}: any) => {
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [locationData, setLocationData] = useState<any | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Detect if code is running on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to handle location search with Nominatim and fallback to Google Maps
  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      // First attempt: Nominatim API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&addressdetails=1&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        // Nominatim found the location
        const { lat, lon, address } = data[0];

        const newPosition: [number, number] = [
          parseFloat(lat),
          parseFloat(lon),
        ];
        setSelectedPosition(newPosition);
        setAddressInformation(address);

        const formattedAddress = {
          address: address.road || "",
          city: address.city || address.town || "",
          state: address.state || "",
          postcode: address.postcode || "",
          country: address.country || "",
        };
        setLocationData(formattedAddress);
      } else {
        // Fallback to Google Maps Geocoding API
        await fetchGoogleMapsGeocode(searchQuery);
      }
    } catch (error) {
      console.error("Error fetching location data from Nominatim:", error);
      // Fallback to Google Maps Geocoding API
      await fetchGoogleMapsGeocode(searchQuery);
    }
  };

  // Function to fetch data from Google Maps Geocoding API
  const fetchGoogleMapsGeocode = async (query: string) => {
    try {
      const googleMapsResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          query
        )}&key=AIzaSyDKvMKD1DyMdxR7VgqjO428--aBf9wpkxw`
      );
      const googleData = await googleMapsResponse.json();

      if (googleData.status === "OK") {
        const result = googleData.results[0];
        const { lat, lng } = result.geometry.location;
        const newPosition: [number, number] = [lat, lng];
        setSelectedPosition(newPosition);
        const addressComponents = result.address_components;
        const formattedAddress = formatGoogleAddress(
          addressComponents,
          result.formatted_address
        );

        setLocationData(formattedAddress);
        setAddressInformation(formattedAddress);
        if (lat && lng) {
          const getAltitude = await fetch(
            `/api/farm/altitude?lat=${lat}&lng=${lng}`
          );
          const altitude = await getAltitude.json();
          setAltitude(altitude?.results[0].resolution);
          console.log(altitude?.results[0].resolution);
        }
        console.log("Google Maps Geocode Data:", formattedAddress);
      } else {
        alert("Location not found.");
      }
    } catch (error) {
      console.error("Error fetching data from Google Maps API:", error);
      alert("An error occurred while fetching location data.");
    }
  };

  // Helper function to format Google Maps address components
  const formatGoogleAddress = (components: any, completeAddress: any) => {
    let address = "";
    let city = "";
    let state = "";
    let postcode = "";
    let country = "";

    components.forEach((component: any) => {
      if (
        component.types.includes("street_address") ||
        component.types.includes("route")
      ) {
        address = completeAddress;
      } else if (component.types.includes("locality")) {
        city = component.long_name;
      } else if (component.types.includes("administrative_area_level_1")) {
        state = component.long_name;
      } else if (component.types.includes("postal_code")) {
        postcode = component.long_name;
      } else if (component.types.includes("country")) {
        country = component.long_name;
      }
    });
    address = completeAddress;
    return { address, city, state, postcode, country };
  };

  if (!isClient) return null; // Prevent rendering on the server side
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
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchedAddress(e.target.value);
              }}
              placeholder="Search for a location"
              style={{
                padding: "8px",
                width: "300px",
                borderRadius: "4px",
                border: "1px solid #ccc",
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
              onClick={() => setOpenDialog(false)}
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

          <div style={{ height: "400px" }}>
            <MapContainer
              center={selectedPosition || [51.505, -0.09]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {selectedPosition && (
                <Marker position={selectedPosition}></Marker>
              )}
              <LocationMarker setSelectedPosition={setSelectedPosition} />
              <SetMapView position={selectedPosition} />
            </MapContainer>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MapComponent;
