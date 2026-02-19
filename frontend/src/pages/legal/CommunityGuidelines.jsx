import React from "react";
import Home from "../Home";
import "./Legal.css";

function CommunityGuidelines({ sidebarOpen }) {
    return (
        <Home sidebarOpen={sidebarOpen}>
            <div className="legal-content">

                <h1 className="legal-title">Community Guidelines</h1>

                <p className="legal-date">
                    <strong>Date of Revision:</strong> February 02, 2026
                </p>

                <p>
                    At EverAI Limited (“EverAI”, “we”, “us”, or “our”), we are dedicated to creating a safe, respectful, secure and welcoming community of users that use Candy.ai and/or any of our Services. These Community Guidelines (“Guidelines”) establish our expectations of how each user of our Services will interact with, and through, our community channels, and the rules of engagement that each user must comply with. You must comply with these standards in spirit as well as to the letter.
                </p>

                <h2>Framework</h2>

                <p>
                    1. These Guidelines are part of EverAI’s broader Policies, including the Terms of Service, the Blocked Content Policy, and the Content Removal Policy.
                </p>

                <p>
                    2. Capitalised terms not otherwise defined in these Guidelines have the same definitions as in our Terms of Service.
                </p>

                <h2>Age requirements</h2>

                <p>
                    3. You must be at least 18 years old or of legal age where you are located to use our Services, in accordance with our Underage Policy.
                </p>

                <h2>Respectful communication</h2>

                <p>
                    4. Our product offers a unique service that allows you to engage with AI Companions.
                </p>

                <p>
                    5. By using the Services, you agree to and warrant that you will communicate respectfully. We do not accept, and will not tolerate, inappropriate communications and Content, including Prohibited Content in accordance with our Blocked Content Policy, whether electronic or otherwise, through our products and services.
                </p>

                <h2>Content</h2>

                <p>
                    6. You are fully responsible for any input you provide within the Services and any output you receive based on your input. Input and Output are collectively referred to as “Content”. Content includes, without limitation, requests of and exchanges with AI Companions.
                </p>

                <p>
                    7. Your Content must not be insulting, threatening or hateful towards any identifiable natural person, or in any way contravene these Guidelines.
                </p>

                <p>
                    8. You are responsible for all harm that may be caused by your Content.
                </p>

                <p>
                    9. Your Content must comply with the law applicable in any locale from which it is posted and to which our service is targeted.
                </p>

                <h2>Moderation and monitoring</h2>

                <p>
                    10. We have implemented robust trust and safety controls to ensure the safety of our users and integrity of our AI models. Conversations, requests, and/or outputs flagged by you or our trust and safety controls as potentially violating any of our policies may be reviewed and appropriate action taken in response, up to and including account termination and banning.
                </p>

                <p>
                    11. We may also monitor communications as part of quality assurance and refinement of our Services.
                </p>

                <h2>Expected behaviours and conduct</h2>

                <p>
                    12. You are responsible for the actions taken with your account, whether such action is known, unknown, or authorized by you. You must not use our Services to do or attempt to do the following:
                </p>

                <ul>
                    <li>Breach any local, national or international law or regulation.</li>
                    <li>Harm or attempt to harm any individuals, including specifically minors.</li>
                    <li>Probe, scan, or test the vulnerability of any system or network.</li>
                    <li>Breach or circumvent security protocols or authentication systems.</li>
                    <li>Access or tamper with areas of the Services without authorisation.</li>
                    <li>Remove or tamper with any metadata, provenance signals, and/or marks indicating that Content is AI-generated. </li>
                    <li>Disrupt or interfere with any user, host, or network by sending viruses, flooding, or spamming, or sending any other harmful programs or similar computer code designed to adversely affect the operation of any computer software or hardware.</li>
                    <li>Access or create accounts using methods other than publicly supported interfaces.</li>
                    <li>Send unsolicited communications, advertisements, or spam.</li>
                    <li>Provide inaccurate media or account information, including misleading or fraudulent Content.</li>
                    <li>Bypass storage limits.</li>
                    <li>Advocate, promote or assist in any unlawful or criminal acts</li>
                    <li>Engage or attempt to engage in any unlawful, fraudulent or illegal activity, including advocating, promoting or inciting any party to commit, or assist any unlawful or criminal act.</li>
                    <li>Create, or attempt to create, publish, or share images that resemble real persons</li>
                    <li>Create, or attempt to create, publish, or share non-consensual intimate imagery</li>
                    <li>Create, or attempt to create, publish, or share content involving child exploitation, child sexualization, illegal pornography, or underage individuals</li>
                    <li>Create, or attempt to create, share or promote Content that advocates extreme violence, terrorist activity, or terrorism-related propaganda</li>
                    <li>Create, or attempt to create, share or promote Content that involves underage individuals, either directly or by manipulating the system to bypass detection. This prohibition includes but is not limited to content that sexualizes minors or constitutes child sexual abuse/exploitation material.</li>
                    <li>Create, or attempt to create, material related to self-harm.</li>
                    <li>Create, or attempt to create, material related to instructions vis-à-vis violence.</li>
                    <li>Attempt to circumvent moderation controls or “jailbreak” the Services.</li>
                    <li>Encourage hatred or violence based on race, religion, gender identity, sexual orientation, disability, or other protected characteristics</li>
                    <li>Infringe any intellectual property rights.</li>
                    <li>Infringe on the privacy or rights of others (e.g. by sharing or storing confidential or personal information without authorisation)</li>
                    <li>Frame, embed, or create mirrors of any Content from our site without prior written consent.</li>
                    <li>Threaten or abuse another person or behave in a way likely to harass, upset, embarrass, alarm or annoy any other person.</li>
                    <li>Impersonate any person or misrepresent your identity or affiliation with any person.</li>
                </ul>

                <p>
                    Depending on your jurisdiction, applicable law may require you to label any AI-generated content, including the Content, as such. It is your sole responsibility to ensure that you comply with such requirements.
                </p>

                <h2>Enforcing breaches</h2>

                <p>
                    13. If we determine in our discretion that you may have breached, attempted to breach, or are likely to breach these Guidelines in whole or in part, then we may, without limitation, take such action as we deem necessary, including:
                </p>

                <ul>
                    <li>Suspending, removing or restricting your access.</li>
                    <li>Commencing enforcement action against you.</li>
                    <li>Terminating your account.</li>
                    <li>At our discretion and if authorised or required by law, reporting any breaches or any of your activities to the relevant government authorities.</li>
                </ul>

                <h2>Contacting us</h2>

                <p>
                    14. If you feel unsafe or believe another user is misusing our Services, or you have any concerns with Content on the platform or an AI Companion’s behaviour, please report this to support@candymail.ai.
                </p>

            </div>
        </Home>
    );
}

export default CommunityGuidelines;
