# Adding a slightly more complicated service to Substrate OS

Checkout the basics in ../miniService.md.

When your services is implemented in Python and it requires some dependencies, there are a few steps to follow to set it up.

1. Create an empty directory somewhere outside of the substrate clone.
2. Create a python virtualenv in the directory. If you start from /tmp, from the terminal go go into /tmp, and run:

   $ virtualenv myService

to make a directory called /tmp/myService. (I actually run it as

   $ python3 -m pip install --user virtualenv
   $ ~/Library/Python/3.9/bin/virtualenv myService

)

3. Run `. myService/bin/activate`, and change directory into myService.

4. If the program you would like to use has some required packages install them with

   $ pip install some-packages

5. You'd have to create requirements.txt. Run `pip freeze`, and copy the lines for the packages your python program refers to. The recursive dependencies don't have to be mentioned as the build process recursively installs them.

An example of requirements.txt might look something like:

```
fastapi==0.115.0
torch==2.4.1
parler_tts @ git+https://github.com/huggingface/parler-tts.git@dcaed95e1cce6f616e3e1956f8d63f0f3f5dfe5f
transformers==4.43.3
soundfile==0.12.1
pydantic==2.9.2
uvicorn==0.22.0
```

Once you figure out requirements, you may abandon this virtualenv.

6. Checkout the Dockerfile atimages/faster-whisper/Dockerfile. As you can see, it installs python and pip and install the dependencies based on requirements.txt to make an image. This one assumes that the service is served with the uvicorn server.

7. Create a cue file in /defs. One can start from a simple definition:


```
package defs
enable: "parler-tts": true
imagespecs: "parler-tts": {
  image: "\(#var.image_prefix)parler-tts"
  build: dockerfile: "images/parler-tts/Dockerfile"
}

services: "parler-tts": {
  instances: [string]: {
    environment: {
      PORT: string
    }

    command: ["--port", environment.PORT]
  }
}
```

unless there are larger files that needs a different treatment.

8. If the service requires a large model files, you add resourcedirs declarations in the cue file, and the app.py would use it. Programs from Huggingface Hubs typically has the common calling convention to pass in a pass to the model file, and the resourcedirs mounted to the service' container can look up the dirs.
