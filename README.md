# GitHub Event Filter

Simple proxy (based on express-proxy) for filtering out GitHub events.
In GitHub, you can configure a webhook to pass on only certain events. Unfortunately, the combination required for triggering pull-request builds is not available by default. This small script fowards only the following events:

- push -- all push events are forwareded
- pull-request -- only openend PR events are forwarded

This script is supposed to run as proxy for Jenkins, building pre-merged pull-requests. This maybe done in combination with smee.io.

More information about the context to use ghef: see [Blog entry "Setup Github triggered build machine"](https://jevopisdeveloperblog.blogspot.com/2019/10/setup-github-triggered-build-machine.html)

## Install

```npm install --global ghef``

## Usage

```
$ node index.js --help
GitHub event filter, only fowards pushes and opened pull-requests.

Options:
  --version    Show version number                                     [boolean]
  --inPort     Port to which github/smee.io sends events.
                                                        [number] [default: 3000]
  --outServer  Host on which Jenkins runs.       [string] [default: "localhost"]
  --outPort    Port on which Jenkins is listening.      [number] [default: 8080]
  --syncPR     if true, pull_request synchronize actions are forwarded as well.
               This is required if pull requests are to be build (and updated)
               stemming from 3rd party repositories.   [boolean] [default: true]
  --help       Show help                                               [boolean]
```

## Licence

Eclipse Public License, EPL-2.0