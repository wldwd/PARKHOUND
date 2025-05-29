/* 
Popup content generator for dog park information display.
Creates formatted HTML with park details and interactive elements.
*/

// Ensure URLs have proper format for external links
const formatUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return "https://" + url;
};

export const getPopupHtml = (
  parkName, // Name of the dog park
  address, // Street address
  description, // Park description / features (as provided by LGA)
  lgaType, // Local government type (e.g. "City of")
  lgaName, // Local government area name
  telephone, // Main local government contact phone number
  emailAddress, // Main local government email address
  website, // local government website
  enclosed, // whether a park is fenced
  coordinates //Lat,lon string for directions
) => {
  const fullLGA = `${lgaType} ${lgaName}`;
  const enclosedText = enclosed ? "Enclosed ✅" : "Not enclosed";
  return `
      <div class="popup-title">${parkName}</div> 
      <p><strong>Address:</strong> ${address}</p>
      <p>${description}</p>
      <p>${enclosedText}</p>
      <p><strong>Local Government:</strong> ${fullLGA}</p>
      <p><strong>Phone:</strong> ${telephone}</p>
      <p><strong>Email:</strong> ${emailAddress}</p>
      <p><strong>Website:</strong> <a href="${formatUrl(
        website
      )}" target="_blank">${website}</a></p>
      <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        coordinates
      )}', '_blank')" style="background: #6600cc; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">Get Directions <i class= 'fas fa-paw'></i>
    </button>
    `;
};
