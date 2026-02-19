import React from "react";
import Home from "../Home";
import "./Legal.css";

function ContentRemovalPolicy({ sidebarOpen }) {
  return (
    <Home sidebarOpen={sidebarOpen}>
      <div className="legal-content">

        <h1 className="legal-title">Content Removal Policy</h1>

        <p className="legal-date">
          <strong>Date of Revision:</strong> February 14, 2025
        </p>

        <p>
          At EverAI Limited we strive to maintaining a safe and respectful experience of all our users.
          Our Content Removal Policy outlines our approach to addressing concerns related to content
          that may inadvertently resemble real individuals.
          All content accessible on candy.ai and/or any of our online channels,
          affiliated websites to which you may be redirected from candy.ai,
          platforms, products or services, including all content contained therein (“Services”)
          is generated exclusively through artificial intelligence technology,
          allowing users to create and interact with AI-generated characters.
          Any similarity to actual persons is unintentional and purely coincidental.
        </p>

        <h2>1. Unintentional Resemblance to Actual Persons</h2>
        <p>
          Content on the Services is AI-generated. However, where AI-generated content
          unintentionally resembles actual persons, we are dedicated to promptly
          addressing the issue and/or any concerns.
        </p>

        <h2>2. Content Removal Process</h2>
        <p>
          If a user believes that any content on our Services bears resemblance to them
          or another actual person, they can request its removal by contacting our
          support team at <strong>support@candymail.ai</strong> or directly report
          their concern in the “Contact Us” area in the Services.
          We will thoroughly review the request and take appropriate action
          within a reasonable timeframe.
        </p>

        <h2>3. User Verification</h2>
        <p>
          To ensure the accuracy and legitimacy of content removal requests,
          we may request the user to provide adequate evidence of their identity
          or relationship to the person depicted in the content.
          This verification process is implemented to responsibly handle requests
          and safeguard the rights and interests of all users.
        </p>

        <h2>4. Content Removal</h2>
        <p>
          Upon verification and confirmation of a valid content removal request,
          the specified content will be removed in a timely manner from the Services.
          Our goal is to complete this process promptly while ensuring compliance
          with applicable laws and regulations.
        </p>

        <h2>5. Privacy</h2>
        <p>
          We respect user privacy throughout the entire content removal process.
          All requests are treated strictly confidential, and we do not disclose
          any personal information or details of the requests to any third parties
          without explicit consent, unless required by law.
        </p>

        <h2>6. Contact Information</h2>
        <p>
          If you have any questions or require further clarification regarding our
          Content Removal Policy, please contact us at:
          <strong> support@candymail.ai</strong> or directly in the
          “Contact Us” area of the Services.
          We are committed to addressing concerns in a timely manner and ensuring
          a positive experience for all our users.
        </p>

      </div>
    </Home>
  );
}

export default ContentRemovalPolicy;
