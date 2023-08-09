# Intermedia Elevate CC Status local webpages

## Introduction

This is a generic dashboard for the Intermedia Elevate Contact Center.
With just a few changes to the files, you should get a generic dashboard for the 
Contact Center, that you can then customize.


## Installation

***PLEASE NOTE:!!!  YOU SHOULD ONLY RUN THIS WEB SITE BEHIND A FIREWALL NOT
ACCESSABLE FROM THE INTERNET!
***IF THIS SITE IS ACCESSABLE FROM THE INTERNET IT WILL EXPOSE YOUR CC API KEY!!!

This is a self-contained web site. All you have to do is copy the files onto a web
server, and change a few lines.

## Necessary changes

1. Change the API_KEY_VALUE on line 4 of src/script1.js to match your CC instance key.
If you don't know your API key, contact your CC administrator, or see the following KB:

https://developer.elevate.services/api/spec/cc/index.html#dev-guide-auth-guide

const API_KEY_VALUE = "sjDfcIsuBKlsjd8dkdflKSLjdkksxhdiYMc0q6BbbE7k="

2. Change the API_BASE_URL on line 16 of the src/script1.js file
to the appropriate values below

#Base URLs
#Country Base URL

Canada https://pop0-apps.mycontactcenter.net/API

USA https://pop1-apps.mycontactcenter.net/API

London https://pop2-apps.mycontactcenter.net/API

Sydney https://pop3-apps.mycontactcenter.net/API

Japan https://pop4-apps.mycontactcenter.net/API

# The only other thing to setup (optionally) is line 33 of the index.html.
from "Elevate Contact Center" to whatever you want to display.

Thats it!!



