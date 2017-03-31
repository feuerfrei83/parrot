# parrot
Part of an Alexa project to tweet or post snippets from the recent conversations.

## Inspiration
Shower thoughts or "Woah, dude!" moments are blurbs in time aching to be socialized. Wouldn't it be cool to be able to say "Alexa, tweet that!!!"

## Problem
Alexa cannot "listen" what is being said around it unless someone says "Alexa" or "Echo". We have to have some way to remember history so Alexa can use it.

## Solution
Parrot allows us to overcome Alexa's inability to "listen" without the command word being uttered. It uses Google's Speech API to converts speech to text and then pushes the text to a table of timestamped entries in the cloud database. Alexa can then pull the data out of this database using timestamps and combine the text as a Twitter or Facebook post.
