## Create for Initial Project

1. Create Firebase Project
2. Create Provider & Channel LINE Developer
3. Create Dialogflow Agent
4. Register https://upstash.com/ for Redis & Kafka
5. Register EX10 Account 
6. Create Account GPT Developer (optional)

## Installation Tools
1. Postman
2. VS Code
3. Node Version 16.x.x + & NPM npm 9.x.x +
4. LINE Bot Designer
5. Installation Python https://www.python.org/downloads/

## Summary Programe & Tools
    Visual Studio Code : https://code.visualstudio.com/
    Install Node https://nodejs.org/en/
    Install Ngrok https://ngrok.com/download
    Ngrok Other : https://gist.github.com/wosephjeber/aa174fb851dfe87e644e
    POSTMAN : https://www.postman.com/downloads/

    Dialogflow : https://dialogflow.cloud.google.com/
    LINE Developers Console https://developers.line.biz/console/
    Upstash : https://upstash.com/
    Firebase Console : https://console.firebase.google.com
    Medium https://medium.com/@thepnateephojan
    Flex Message Simulator https://developers.line.biz/flex-simulator/
    Flex Formatter https://ex10.tech/portal/tools/flex-formatter
    Stackblitz: https://stackblitz.com/


## Firebase 
1. install firebase cli
````
npm i -g firebae-tools
````
2. Authentication
````
firebase login
````
3.Init Profile
````
firebase init
````
4. Select Service Firebase Cloud Function & Firebase Emulators
5. Select Laguage : Javascript


## Star Project
````
cd functions
````
````
npm i
````

````
mv .env.example .env && 
mv dialogflow_key_example.json dialogflow_key.json  && 
mv firebase_key_example.json firebase_key.json  && 
mv private_key_example.json private_key.json
````

````
npm run serve
````


## Optional Server
1. cloudflare trust zero (Recommend) - Register Domain 3$/year for Multi Tunnels
2. ngrok (Free) - Subscription 8$/month or $96/year


## Generate API Credential Key 
1. APIs & Services
2. Credentials
3. Service Account -> 
  - Name dialogflowAPI
  - Role Dialogflow API Client
  - Save File to Directory functions : dialogflow_key.json
  [IMPORTANT] change name key to dialogflow_key.json

## Generate using Python library jwcrypto
1. Installation Python https://www.python.org/downloads/
2. Install JWCrypto
    ````
    pip install jwcrypto
    ````
3. Create File name : app.py
    ````
    from jwcrypto import jwk
    import json
    key = jwk.JWK.generate(kty='RSA', alg='RS256', use='sig', size=2048)

    private_key = key.export_private()
    public_key = key.export_public()

    print("=== private key ===\n"+json.dumps(json.loads(private_key),indent=2))
    print("=== public key ===\n"+json.dumps(json.loads(public_key),indent=2))
    ````
4. run command generate
    ````
    python app.py
    ````
5. write file  private_key to private_key.json
    ````
    mv private_key_example.json private_key.json
    ````
  


