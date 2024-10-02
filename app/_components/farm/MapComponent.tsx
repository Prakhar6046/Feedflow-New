import { useState } from "react";
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
const iconDefault: any = L.Icon.Default; // Type assertion to any
delete iconDefault.prototype._getIconUrl; // Remove the private method
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

// Custom hook for centering the map
const SetMapView = ({ position }: { position: [number, number] | null }) => {
  const map = useMap();

  if (position) {
    map.setView(position); // Center the map on the new position
  }

  return null;
};

const MapComponent = ({ setAddressInformation, setSearchedAddress }: any) => {
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search input
  const [locationData, setLocationData] = useState<any | null>(null); // State for location data
  const [openDialog, setOpenDialog] = useState<boolean>(false); // State to control the dialog

  // Function to handle location search
  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&addressdetails=1&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon, address } = data[0]; // Get latitude, longitude, and address from the first result
        const newPosition: [number, number] = [
          parseFloat(lat),
          parseFloat(lon),
        ];
        setSelectedPosition(newPosition); // Set the selected position
        setAddressInformation(address);
        // Set location data
        const { house_number, road, city, state, postcode, country } = address;
        const formattedAddress = {
          address: house_number ? `${house_number} ${road}` : road || "",
          city: city || "",
          state: state || "",
          postcode: postcode || "",
          country: country || "",
        };
        setLocationData(formattedAddress);

        // Log location data to the console
        console.log("Location Data:", formattedAddress);
      } else {
        alert("Location not found.");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
      alert("An error occurred while fetching location data.");
    }
  };

  return (
    <div>
      {/* Your Existing Button */}
      <Button
        type="button"
        onClick={() => setOpenDialog(true)} // Open the dialog on button click
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

      {/* Map Popup Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>Map</DialogTitle>
        <DialogContent>
          {/* Search Input */}
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value),
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

          {/* Map Display */}
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
                <Marker position={selectedPosition}>
                  {/* Marker to show where the user clicked or searched */}
                </Marker>
              )}
              <LocationMarker setSelectedPosition={setSelectedPosition} />
              <SetMapView position={selectedPosition} />{" "}
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
