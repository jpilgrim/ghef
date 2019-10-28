# GitHub Event Filter

Simple proxy (based on express-proxy) for filtering out GitHub events.
In GitHub, you can configure a webhook to pass on only certain events. Unfortunately, the combination required for triggering pull-request builds is not available by default. This small script fowards only the following events:

- push -- all push events are forwareded
- pull-request -- only openend PR events are forwarded

This script is supposed to run as proxy for Jenkins, building pre-merged pull-requests. This maybe done in combination with smee.io.

## Licence

EPL-2.0