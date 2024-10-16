import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "./TopHeader.css";

function TopHeader({
  setSelectedLocation,
  selectedLocation,
  handleLocationChange,
}) {
  const { user: loginUser } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.userProfile);
  const { locations } = useSelector((state) => state.location);

  // Find the logged-in user details from the users array
  const userDetails = users.find((user) => user.user.id === loginUser?.id);

  // Extract the preferred location ID from the logged-in user profile
  const preferredLocationId = userDetails?.profile?.preferred_location;

  // Get the current route path using useLocation
  const locationPath = useLocation().pathname;

  // Filter locations based on the route (logic can be customized)
  const filteredLocations = locations.filter((location) => {
    // Example logic: Filter based on route name
    return true; // Keep all locations for this example
  });

  // Find the location name based on the preferred location ID
  const locationName = filteredLocations.find(
    (l) => l.id === preferredLocationId
  );

  useEffect(() => {
    if (preferredLocationId) {
      setSelectedLocation(preferredLocationId); // Set the default selected location
    }
  }, [preferredLocationId, setSelectedLocation]);

  const pathHeadings = {
    "/about": "Dashboard",
    "/service": "Dashboard",
    "/location": "Locations",
    "/users": "Users",
    "/customers": "Customers",
    "/products": "Products",
    "/services": "Services",
    "/allcustomers": "Customers Report",
    "/topcustomers": "Top Customers",
    "/productreport": "Product Report",
    "/purchasereport": "Service Sale Report",
    "/serviceused": "Service Usage Report",
  };

  const heading = pathHeadings[locationPath] || "";

  // Check if select should be hidden based on route
  const hideSelect = [
    "/users",
    "/location",
    "/customers",
    "/products",
    "/services",
    "/allcustomers",
    "/topcustomers",
    "/productreport",
    "/purchasereport",
    "/serviceused",
    "/",
  ].includes(locationPath);

  return (
    <header className="top-header">
  <div className="top-header-left">
    {heading && <h2 className="page-heading">{heading}</h2>}
    
    <select
      value={selectedLocation}
      onChange={handleLocationChange}
      className="location-select"
      style={{
        visibility: hideSelect ? "hidden" : "visible", // Keep space but hide
        height: hideSelect ? 0 : "auto", // Set height to 0 if hidden
        width: hideSelect ? 0 : "auto", // Set width to 0 if hidden
        padding: hideSelect ? 0 : "initial", // Remove padding when hidden
      }}
    >
      <option value={0}>All</option>
      {filteredLocations.map((location) => (
        <option value={location.id}>{location?.name}</option>
      ))}
    </select>
  </div>

  {locationPath !== "/" && (
    <div className="login-details">
      <FaUserCircle
        size={28}
        style={{ marginLeft: "20px", marginRight: "5px" }}
      />
      <span className="topheadname">
        {loginUser?.name
          ? loginUser.name.charAt(0).toUpperCase() +
            loginUser.name.slice(1).toLowerCase()
          : "User"}{" "}
        (<span>{locationName?.name}</span>)
      </span>
    </div>
  )}
</header>

  );
}

export default TopHeader;
