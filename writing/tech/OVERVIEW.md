# Meet Substrate

---

### problem: the state of intelligence

When you read a book or play an instrument, most of the benefit accrues to you, the reader. 
With AI, the more intelligence is accumulated, the more it benefits the technology owner, which in this case, is not the user.

AI has moved fast over the last year. Intelligence is on a path to becoming "too cheap to meter". 

We are simultaneously accumulating and expanding intelligence at a speed like never before, and also consolidating it all in the hands of the technology makers. 

That’s the equivalent of your music knowledge benefiting the company that makes the violin.

At any moment, the company can revoke the knowledge from you, use it for its own benefit, change the rules of engagement, or alter the fundamental architecture of the whole underlying system.

---

### solution: an architecture for intelligence

If you go back to our instrument example:

Imagine as you are using next generation computing systems, your own platforms themselves become more intelligent. These systems can help us better understand each other, better understand the world around us, and better navigate the immense challenges before us. 

The systems we are building return leverage to the end users.  

To do that, we need to turn the creation of AI into an even more open, global and multiplayer activity.

We need it to be both open and accessible.

We need an architecture for intelligence, now. 

Substrate is a new kind of technology organization dedicated to the sole mission of inventing the architecture of intelligence, and developing the technology stack to enable it.

---

### what kind of architecture?

[TODO insert photo]

---

### what is substrate?

A new computer console that's designed for running AI locally. It runs a new OS and has a open, extensible suite of functionality.

A radically accessible project, where we teach the world not just how to use the AI and console itself, but how build on it, how to hack it, and how to (re)make it themselves.

---

### why locally?

It's where the people are!

Lots of local devices and sensors → HCI possibilities are awesome.

When users pay for electricity, there is less need to "monetize" them.

Cheaper, more fun, better alignment with end users.

---

### why open and extensible?

Invites creativity and experimentation.

This allows value accrue to the end users.

Ensures that such a powerful technology can't be captured by any single entity.

---

### why a console?

AI has extreme memory/compute/bandwidth requirements

Phone/tablet/laptop/desktop based designs are limited by space, bandwidth, cooling, and power

But high-end (enterprise grade) hardware is expensive and hard to buy

For things to keep moving, we need a common dev target with a minimum spec

Many similarities to the pre-Xbox and pre-Playstation gaming ecosystem

---

### why an OS?

Optimize performance (per $) and (per watt)

Sub-second model loading requires tuning hardware, drivers, filesystems

Smaller support matrix means higher quality

Initial experience, upgrades, debugging are all easier

---

### substrate: a disclaimer

Under heavy development

This is the first technical presentation about our work

Here be dragons

---

### substrate: intro

Services are accessible via HTTP

UI (if any) is via browser technologies

Everything runs on device and is accessed via LAN or VPN

Access to the internet is restricted

---

### substrate: real-world challenges

The ecosystem is moving quickly (version conflicts) → containers*

Model weights are large and a bad fit for container layers → resourcedirs

Different flavors for each model (size, quantization, precision) → late binding config

Service discovery & orchestration → gateway

Stateful persistence → spaces

SOTA keeps moving, so lots of model churn → blackboard

---

### substrate: model dev experience

Build a container image with an HTTP server listening on $PORT

*optionally*

Declare the resource directories you need (like model weights from huggingface)

Declare environment variables based on CUDA memory, RAM

Declare the request patterns your service can satisfy

---

### substrate: accessing services
  
|   |user|from UI|from backend|
|---|----|-------|------------|
|directly|/gw/whisper/|/gw/whisper/|http://substrate/gw/whisper/|
|indirectly|❌|/bb|http://substrate/bb|

--- 

### substrate: an example service

[TODO] include from elsewhere

---

### substrate: meet blackboard

A response to a number of challenges: adding new models, easier composition, a path to auto optimization, self improvement and self extension

An old idea, new again

Based on ideas from tuple space and Prolog (unification)

Easy to get started with, can be a "drop in" replacement for REST

---

### substrate: meet blackboard
  
|   |blackboard approach|traditional approach|
|---|-------------------|--------------------|
1 request|≥ 0 responses|1 response
routing matches on|full request and response|HTTP method, URL parts
service discovery|builtin|env vars, DNS, hardcoded
shadow traffic|builtin|ad hoc
request tracing|builtin|ad hoc

---

### substrate: an example (before blackboard)

[TODO] include from elsewhere

---

### substrate: a service example (after blackboard)

[TODO include from elsewhere]

---

### status update

We have a team of folks working on this project

Milestone 0 is in progress

System 0 is in progress

---

### follow along

github.com/ajbouh/substrate
adam@bouhenguel.com

---

### Questions?

---

### appendix

---

### how blackboard works

---

### the promise of PCIe

---

### how bridge works

---

### how to make your own os

---

### substrate: blackboard eases model testing

[TODO] show a message sequence diagram for adding a second model

---

### substrate: blackboard and self improvement

[TODO] show a message sequence diagram for self improvement
