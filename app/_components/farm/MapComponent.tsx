import { useState, useEffect, useCallback, useRef } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Libraries,
} from '@react-google-maps/api';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List'; // For suggestions
import ListItem from '@mui/material/ListItem'; // For individual suggestion
import ListItemButton from '@mui/material/ListItemButton'; // For clickable suggestion
import Paper from '@mui/material/Paper'; // For suggestions container
import toast from 'react-hot-toast';

// Define map container style
const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

// Default center position (e.g., London)
const defaultCenter = {
  lat: 51.505,
  lng: -0.09,
};

// Libraries to load
const libraries: Libraries = ['places'];
export type AddressInfo = {
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  address2: string;
};
interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface FormattedAddress {
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  address2: string;
}

type MapComponentProps = {
  setAddressInformation: (val: AddressInfo | null) => void;
  setSearchedAddress?: (val: string) => void;
  setUseAddress: (val: boolean) => void;
  setAltitude: (val: string) => void;
  isCalAltitude: boolean;
  clearErrors?: (field: any) => void;
  setLng?: (val: string) => void;
  setLat?: (val: string) => void;
  token?: string;
};
const MapComponent = ({
  setAddressInformation,
  setSearchedAddress,
  setUseAddress,
  setAltitude,
  isCalAltitude,
  clearErrors,
  setLng,
  setLat,
}: MapComponentProps) => {
  const [selectedPosition, setSelectedPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationData, setLocationData] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  // **Added**: State for autocomplete suggestions
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);

  // Reference for the autocomplete service
  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null);

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDKvMKD1DyMdxR7VgqjO428--aBf9wpkxw',
    libraries,
  });

  // Initialize AutocompleteService once the script is loaded
  useEffect(() => {
    if (isLoaded && !autocompleteServiceRef.current) {
      autocompleteServiceRef.current =
        new window.google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  // **Added**: Function to fetch suggestions
  const fetchSuggestions = (input: string) => {
    if (!autocompleteServiceRef.current || input.length === 0) {
      setSuggestions([]);
      return;
    }

    const request: google.maps.places.AutocompletionRequest = {
      input,
    };

    autocompleteServiceRef.current.getPlacePredictions(
      request,
      (predictions, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      },
    );
  };

  // Handle map click to place marker and fetch address
  const onMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;

      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const newPosition: { lat: number; lng: number } = { lat, lng };

      setSelectedPosition(newPosition);
      setInfoWindowOpen(true);
      fetchReverseGeocode(lat, lng);
    },
    [isCalAltitude],
  );

  // Function to perform reverse geocoding using Google Maps Geocoding API
  const fetchReverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDKvMKD1DyMdxR7VgqjO428--aBf9wpkxw`,
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        if (isCalAltitude && data.results[0].geometry) {
          const altitudeResponse = await fetch(
            `/api/farm/altitude?lat=${data.results[0].geometry.location.lat}&lng=${data.results[0].geometry.location.lng}`,
            {
              method: 'GET',
            },
          );
          const res = await altitudeResponse.json();
          clearErrors?.('farmAltitude');
          clearErrors?.('lat');
          clearErrors?.('lng');
          setAltitude(String(res?.results[0]?.elevation));
          setLat?.(String(res?.results[0]?.location.lat));
          setLng?.(String(res?.results[0]?.location.lng));
        }
        const address = data.results[0].formatted_address;
        setLocationData(address);
        const formattedAddress = formatGoogleAddress(
          data.results[0].address_components,
          data.results[0].formatted_address,
        );
        setAddressInformation(formattedAddress);
      } else {
        setAddressInformation(null);
        setLocationData('Address not found.');
        toast.error('Address not found for the selected location.');
      }
    } catch (error) {
      console.error('Error performing reverse geocoding:', error);
    }
  };

  // Function to handle location search using Google Places API
  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          searchQuery,
        )}&key=AIzaSyDKvMKD1DyMdxR7VgqjO428--aBf9wpkxw`,
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        if (isCalAltitude && data.results[0].geometry) {
          const altitudeResponse = await fetch(
            `/api/farm/altitude?lat=${data.results[0].geometry.location.lat}&lng=${data.results[0].geometry.location.lng}`,
            {
              method: 'GET',
            },
          );
          const res = await altitudeResponse.json();
          clearErrors?.('farmAltitude');
          clearErrors?.('lat');
          clearErrors?.('lng');
          setAltitude(String(res?.results[0]?.elevation));
          setLat?.(String(res?.results[0]?.location.lat));
          setLng?.(String(res?.results[0]?.location.lng));
        }
        const { lat, lng } = data.results[0].geometry.location;
        const newPosition: { lat: number; lng: number } = { lat, lng };
        setSelectedPosition(newPosition);
        const formattedAddress = formatGoogleAddress(
          data.results[0].address_components,
          data.results[0].formatted_address,
        );
        setAddressInformation(formattedAddress);
        // setAddressInformation(data.results[0].formatted_address);
        setLocationData(data.results[0].formatted_address);
      } else {
        alert('Location not found.');
      }
    } catch (error) {
      console.error(
        'Error fetching location data from Google Geocoding API:',
        error,
      );
    }
  };

  const formatGoogleAddress = (
    components: AddressComponent[],
    completeAddress: string,
  ): FormattedAddress => {
    let address = '';
    let address2 = '';
    let city = '';
    let state = '';
    let postcode = '';
    let country = '';

    components.forEach((component) => {
      if (component.types.includes('premise')) {
        address = component.long_name;
      } else if (component.types.includes('street_number')) {
        address = address || component.long_name;
      } else if (component.types.includes('route')) {
        address = address
          ? `${address} ${component.long_name}`
          : component.long_name;
      } else if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (component.types.includes('administrative_area_level_1')) {
        state = component.long_name;
      } else if (component.types.includes('postal_code')) {
        postcode = component.long_name;
      } else if (component.types.includes('country')) {
        country = component.long_name;
      } else if (
        component.types.includes('neighborhood') ||
        component.types.includes('sublocality')
      ) {
        address2 = address2
          ? `${address2}, ${component.long_name}`
          : component.long_name;
      }
    });

    if (!address) {
      address = completeAddress;
    }

    address2 = address2.trim().replace(/,$/, '');

    return { address, city, state, postcode, country, address2 };
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div style={{ position: 'relative' }}>
      {/* <-- Added relative positioning for suggestions dropdown */}
      <Button
        type="button"
        onClick={() => setOpenDialog(true)}
        variant="contained"
        sx={{
          background: '#fff',
          fontWeight: 600,
          padding: '6px 16px',
          width: 'fit-content',
          textTransform: 'capitalize',
          borderRadius: '8px',
          color: '#06A19B',
          border: '1px solid #06A19B',
          boxShadow: 'none',
        }}
      >
        Use Coordinates
      </Button>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>Map</DialogTitle>
        <DialogContent>
          <div
            style={{
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              position: 'relative', // <-- Added for positioning the dropdown
              width: '100%',
            }}
          >
            <TextField
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchedAddress?.(e.target.value);
                fetchSuggestions(e.target.value); // **Added**: Fetch suggestions on input change
              }}
              placeholder="Search for a location"
              variant="outlined"
              size="small"
              style={{
                padding: '8px',
                width: '300px',
                borderRadius: '4px',
                marginRight: '10px',
              }}
            />
            <Button
              onClick={handleSearch}
              variant="contained"
              sx={{
                background: '#06A19B',
                color: '#fff',
                borderRadius: '4px',
              }}
            >
              Search
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={() => {
                setOpenDialog(false);
                setUseAddress(true);
              }}
              sx={{
                background: '#06A19B',
                fontWeight: 600,
                padding: '6px 16px',
                width: 'fit-content',
                textTransform: 'capitalize',
                borderRadius: '8px',
                boxShadow: 'none',
                border: '1px solid #06A19B',
                marginLeft: '10px',
              }}
            >
              Use Address
            </Button>

            {/* **Moved** the suggestions dropdown inside the relative parent */}
            {suggestions.length > 0 && (
              <Paper
                style={{
                  position: 'absolute',
                  top: '100%', // Position right below the input field
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  backgroundColor: '#fff', // Ensure background is white
                  border: '1px solid #ccc', // Add a subtle border
                  borderTop: 'none', // Remove top border to connect with input
                }}
              >
                <List>
                  {suggestions.map((suggestion) => (
                    <ListItem key={suggestion.place_id} disablePadding>
                      <ListItemButton
                        onClick={async () => {
                          // **Added**: Handle suggestion selection
                          setSearchQuery(suggestion.description);
                          setSearchedAddress?.(suggestion.description);
                          setSuggestions([]); // Clear suggestions

                          // Fetch place details to get lat and lng
                          const geocoder = new window.google.maps.Geocoder();
                          geocoder.geocode(
                            { placeId: suggestion.place_id },
                            (results, status) => {
                              if (
                                status === 'OK' &&
                                results &&
                                results[0].geometry
                              ) {
                                const { lat, lng } =
                                  results[0].geometry.location;
                                const newPosition: {
                                  lat: number;
                                  lng: number;
                                } = {
                                  lat: lat(),
                                  lng: lng(),
                                };
                                setSelectedPosition(newPosition);
                                setLocationData(results[0].formatted_address);
                                setInfoWindowOpen(true);
                                setAddressInformation(
                                  formatGoogleAddress(
                                    results[0].address_components,
                                    results[0].formatted_address,
                                  ),
                                );

                                // Optionally, fetch altitude if required
                                if (
                                  isCalAltitude &&
                                  results[0].geometry.location
                                ) {
                                  fetch(
                                    `/api/farm/altitude?lat=${results[0].geometry.location.lat()}&lng=${results[0].geometry.location.lng()}`,
                                    {
                                      method: 'GET',
                                    },
                                  )
                                    .then((altitudeRes) => altitudeRes.json())
                                    .then((altitudeData) => {
                                      clearErrors?.('farmAltitude');
                                      clearErrors?.('lat');
                                      clearErrors?.('lng');
                                      setAltitude(
                                        String(
                                          altitudeData?.results[0]?.elevation,
                                        ),
                                      );
                                      setLat?.(
                                        String(
                                          altitudeData?.results[0]?.location
                                            .lat,
                                        ),
                                      );
                                      setLng?.(
                                        String(
                                          altitudeData?.results[0]?.location
                                            .lng,
                                        ),
                                      );
                                    })
                                    .catch((error) => {
                                      console.error(
                                        'Error fetching altitude:',
                                        error,
                                      );
                                    });
                                }
                              } else {
                                alert('Location details not found.');
                              }
                            },
                          );
                        }}
                      >
                        {suggestion.description}
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
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
