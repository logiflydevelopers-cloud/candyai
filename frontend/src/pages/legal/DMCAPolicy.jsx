import React from "react";
import Home from "../Home";
import "./Legal.css";

function DMCAPolicy({ sidebarOpen }) {
    return (
        <Home sidebarOpen={sidebarOpen}>
            <div className="legal-content">

                <h1 className="legal-title">DMCA Policy</h1>

                <p className="legal-date">
                    <strong>Date of Revision:</strong> August 01, 2025
                </p>

                <p>
                    EverAI Limited values and upholds the intellectual property rights of others, and we are dedicated to adhering to the Digital Millennium Copyright Act (DMCA) and other relevant copyright laws. Our DMCA Policy delineates the steps we take to address notifications of copyright infringement and provides guidance on reaching out to us if you suspect that your copyrighted material has been utilized on our platform without proper authorization.
                </p>

                <p>
                    Candy.ai and/or any of our online channels, affiliated websites to which you may be redirected from candy.ai, platforms, products or services, including all content contained therein are referred to herein as “Services.”
                </p>

                <h2>1. Reporting Copyright Infringement</h2>

                <p>
                    If you believe in good faith that materials transmitted or created through the Services infringe your copyright, you (or your agent) may send us a notice requesting that we remove the material or block access to it. Please provide the following information in writing:
                </p>

                <p>
                    (a) An electronic or physical signature of the owner (or person authorized to act on behalf of the owner) of the copyrighted work;
                </p>
                <p>
                    (b) A description of the copyrighted work that you claim has been infringed upon and sufficient information for us to locate such copyrighted work;
                </p>
                <p>
                    (c) Your address, telephone number, and e-mail address;
                </p>
                <p>
                    (d) A statement by you that you have a good-faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law;
                </p>
                <p>
                    (e) A statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner’s behalf.
                </p>


                <h2>2. DMCA Notices Response</h2>

                <p>
                    After receiving a complete infringement notice, we will take the following actions:
                </p>

                <p>
                    (a) Review and confirm that received documents meet DMCA requirements;
                </p>
                <p>
                    (b) Take proper preliminary actions against said alleged infringement within 1-3 days after receipt of said information, including without limitation link blockage;
                </p>
                <p>
                    (c) Notify the alleged infringer and demand him or her to explain and provide counter evidence.
                </p>

                <h2>3. Counter Notification</h2>

                <p>
                    If you believe in good faith that someone has wrongly filed a notice of copyright infringement against you, you may send us a counter-notice. If you do, we will notify the alleged claimant and hold the process for 10-14 days and then re-enable your content unless the copyright owner initiates a legal action against you before then.
                </p>

                <h2>4. Contact Information</h2>

                <p>
                    Notices and counter-notices should be sent to us via email at: support@candymail.ai. We are committed to addressing concerns in a timely manner and ensuring a positive experience for all our users.
                </p>

                <h2>5. Termination</h2>

                <p>
                    We have the right to suspend or terminate the use of the Services by anyone engaged in suspected infringement described above.
                </p>
            </div>
        </Home>
    );
}

export default DMCAPolicy;
