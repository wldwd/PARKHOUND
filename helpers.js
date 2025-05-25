export const getPopupHtml = (
  parkName,
  address,
  description,
  lgaType,
  lgaName,
  telephone,
  emailAddress,
  website,
  enclosed
) => {
  const fullLGA = `${lgaType} ${lgaName}`; // "City of Canning"
  const enclosedText = enclosed === null ? "Not enclosed" : "Enclosed ✅";
  return `
      <div class="popup-title">${parkName}</div> 
      <p><strong>Address:</strong> ${address}</p>
      <p>${description}</p>
      <p>${enclosedText}</p>
      <p><strong>Local Government:</strong> ${fullLGA}</p>
      <p><strong>Phone:</strong> ${telephone}</p>
      <p><strong>Email:</strong> ${emailAddress}</p>
      <p><strong>Website:</strong> <a href="${website}" target="_blank">${website}</a></p>
    `;
};
