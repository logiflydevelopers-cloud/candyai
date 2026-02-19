import React from "react";
import Home from "../Home";
import "./Legal.css";

function ComplaintPolicy({ sidebarOpen }) {
    return (
        <Home sidebarOpen={sidebarOpen}>
            <div className="legal-content">

                <h1 className="legal-title">Complaint Policy</h1>

                <p className="legal-date">
                    <strong>Date of Revision:</strong> August 01, 2025
                </p>

                <p>
                    At EverAI Limited we value our users and strive to provide a positive experience. We understand that concerns or complaints may arise from time to time, and we are committed to addressing them promptly and effectively. This Complaint Policy outlines the process for users to file complaints regarding any issues encountered while using our platform.
                </p>

                <p>
                    Candy.ai and/or any of our online channels, affiliated websites to which you may be redirected from candy.ai, platforms, products or services, including all content contained therein are referred to herein as “Services.”
                </p>

                <h2>1. Customer Support</h2>

                <p>
                    We have a dedicated support team to assist our users with any concerns or complaints.
                </p>

                <p>
                    Our support team is committed to providing prompt and effective assistance. Users can contact our support team should they come across any issues or have inquiries regarding our Services.
                </p>
                <p>
                    All inquiries are managed by our support team with professionalism, confidentiality, and impartiality. We are committed to addressing our users’ concerns promptly and to the best of our abilities.
                </p>


                <h2>2. Submitting a Complaint</h2>

                <p>
                    Users who wish to file a complaint can do so by contacting our customer support team through support@candymail.ai, or via the “Contact Us” area in the Services.
                </p>

                <h2>3. Information to Include in the Complaint</h2>

                <p>
                    When submitting a complaint, users are encouraged to provide the following details to help us investigate and address the issue promptly:
                </p>

                <p>
                    (a) User’s full name and e-mail;
                </p>
                <p>
                    (b) Description of the complaint, including relevant details such as the date and time of the incident;
                </p>
                <p>
                    (c) Any supporting documentation or screenshots, if applicable.
                </p>

                <h2>4. Documentation of Complaint Review Process</h2>

                <p>
                    (a) Receipt and Acknowledgment: Upon receiving a complaint, we will acknowledge receipt within 24 hours. This acknowledgment will include a reference number for the complaint and the name of the person handling the complaint.
                </p>

                <p>
                    (b) Investigation: Each complaint will be thoroughly investigated. This involves reviewing the complaint details, gathering relevant information, and, if necessary, contacting the complainant for additional information or clarification.
                </p>

                <p>
                    (c) Decision-Making: The decision-making process will be carried out by a designated Complaints Officer or a relevant team, depending on the nature of the complaint. This process will include an evaluation of the information gathered and the application of relevant policies or legal requirements to reach a fair conclusion.
                </p>
                <p>
                    (d) Documentation: Every step of the complaint review process, from receipt to resolution, will be fully documented. This documentation will include dates, actions taken, communications with the complainant, and the rationale behind the decision made.
                </p>

                <h2>5. Duration of Each Step</h2>

                <p>
                    (a) Overall Resolution Timeline: The entire resolution process, from the receipt of the complaint to the communication of the outcome to the complainant, will not exceed 7 calendar days.
                </p>
                <p>
                    (b) Immediate Action on Illegal Content
                    1. Detection: If a complaint pertains to illegal content, particularly that flagged by keywords on our list of blocked/prohibited words, it will be immediately escalated.

                    2. Removal: Illegal content will be removed immediately once identified and reviewed. The corresponding team ensures that illegal content is addressed as soon as
                </p>
                <p>
                    (c) Updates: Complainants will be updated regularly about the status of their complaint. If the resolution process is expected to take longer than the stipulated timeframe, the complainant will be informed of the delay and the reasons for it.
                </p>

                <h2>6. Escalation</h2>
                <p>
                    If a user is dissatisfied with the resolution provided, they may request further escalation. In this case, users can notify our support team within a reasonable timeframe, providing clear reasons for their dissatisfaction with the initial resolution.
                </p>
                <p>
                    The case will be reviewed by individuals or teams not initially involved in the complaint resolution process. They will reassess the complaint and reconsider the previous decision. The user will be notified of the outcome of the escalation within a reasonable timeframe.
                </p>

                <h2>7. Chargebacks</h2>
                <p>
                    In the effort to uphold the integrity of transactions, our payment processing team commits to thoroughly investigating any disputed charges. Customers found to be engaging in wrongful chargeback practices risk being placed on a blacklist, which may impact their ability to participate in future services. We stress the importance of reaching out to our Customer Support Center for any uncertainties or concerns over charges to avert unfounded disputes.
                </p>

                <h2>8. Fraud Mitigation</h2>
                <p>
                    Our goal is to provide secure, reliable payment processing for our customers in compliance with payment card industry standards. To prevent unauthorized transactions, we implement a number of customer verification measures and promptly review and investigate any fraudulent activity.
                </p>
            </div>
        </Home>
    );
}

export default ComplaintPolicy;
