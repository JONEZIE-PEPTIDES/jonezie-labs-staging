# RefRef sandbox connection

The Google Apps Script project **Jonezie Partner Sandbox** belongs to `jonezielabs@gmail.com`. Its Script ID is `1_drBdo80jzNY33PvaZBIUiNHL19WZfcgnFOKTxetMva1N1NFtpJhqGd2`. The `REFREF_SANDBOX_API_KEY` property holds a RefRef Integration key restricted to the Jonezie Labs Sandbox project and set to expire after 90 days. Never copy the key into this repository or any browser script.

`Code.gs` contains a read-only connection check. Running it needs the project owner's Google Apps Script authorization to contact an external service. Google may show an unverified-app warning because this is a private script owned by Jonezie Labs. The owner must review and approve that authorization personally. No live RefRef events or public program are connected to this project yet.

The existing live order-request web app was not present in the Google accounts accessible during setup. Do not replace the live checkout endpoint with this sandbox project. Once the live script owner is identified, connect the approved paid-invoice workflow there after sandbox tests pass.
