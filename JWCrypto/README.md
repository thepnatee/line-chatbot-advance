# Installation

Install JWCrypto
To install JWCrypto, you will need a Python 3 development environment and pip, a package manager. You can download the Python3 development environment from the Python official site (opens new window). Download the appropriate installer for your OS and install it.

Pip is installed at the same time that Python3 is installed. If pip isn't installed in your environment, refer to the pip documentation (opens new window)and install it separately.

Execute this command to install JWCrypto.
````
$ pip install jwcrypto
````

Create a code for generating private and public keys.
Create a python file that generates private and public keys by specifying kty as RSA, alg as RS256, use as sig, and size as 2048, like below.

Save the python file using any file name you want. In this case, the file name is app.py.
````
from jwcrypto import jwk
import json
key = jwk.JWK.generate(kty='RSA', alg='RS256', use='sig', size=2048)

private_key = key.export_private()
public_key = key.export_public()

print("=== private key ===\n"+json.dumps(json.loads(private_key),indent=2))
print("=== public key ===\n"+json.dumps(json.loads(public_key),indent=2))
````
In the same directory where you saved the python file, run the following command to generate a public key based on the private key.

````
$ python app.py
````

If successful, the following private key (private_key) and public key (public_key) will be generated as standard output.

private_key example:
````
{
  "alg": "RS256",
  "d": "zKh7iwIIPXXFKYQS...",
  "dp": "u1qKg_43UeuGpZFI...",
  "dq": "69AzYgpcg0ckypUrv...",
  "e": "AQ..",
  "kty": "RSA",
  "n": "_RzHf7cgG_i6Pdo_...",
  "p": "_20iRavoSrMIwWuRPxo...",
  "q": "_a5QodMBbEriAgztXvHi...",
  "qi": "JozdjTtK57IFLeVAB...",
  "use": "sig"
}
````
public_key example:
````
{
  "alg": "RS256",
  "e": "AQAB",
  "kty": "RSA",
  "n": "_RzHf7cgG_i6Pdo...",
  "use": "sig"
}
````