<h1 align="center">
  bridge
</h1>

Based on [@GRVYDEV's project S.A.T.U.R.D.A.Y.](https://github.com/GRVYDEV/S.A.T.U.R.D.A.Y)


You need a machine with docker and an Nvidia GPU. To try it out:

```bash
docker compose up --build
```

Then open http://localhost:8088 in a browser

Or...

If your docker host is accessible via ssh, you can run it there with:

```bash
docker -H ssh://user@dockerhost compose up --build
```

And tunnel localhost with a command like...

```bash
ssh -L8088:dockerhost:8088 user@dockerhost
```

And *then* open http://localhost:8088 in a browser
