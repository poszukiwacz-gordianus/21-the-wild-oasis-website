"use client";

import CookieConsent from "react-cookie-consent";

export default function Cookies() {
  return (
    <CookieConsent
      style={{ background: "#1B2631" }}
      buttonStyle={{ background: "#B78343", fontSize: "13px" }}
      overlay={true}
    >
      This website uses cookies to enhance the user experience.
    </CookieConsent>
  );
}
