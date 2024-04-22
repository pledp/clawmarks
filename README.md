# clawmarks
It's never a slow day in HEL!

# How to run:
Required libraries:

Start up Flask server:
```
python clawmarks/scripts/Server.py
```

```
clawmarks/index.html
```

# Basic game design:

You work at an Air Traffic Control Tower! Your job is to offer guidance to aircraft in whatever they need.

Airplanes appear on a table periodically, it's your responsibility to guide them. Airplanes may need guidance in things such as:

- Altitude
- Landing requests
- Takeoff requests
- Heading

It's your responsibility to quickly and efficiently handle the never-ending queue of incoming tasks. The entire premise of the game design revolves around these tasks. To complete the tasks you write in the input-bar, for example:

```
AY285 altitude 5000
AX465 permit takeoff HEL
AX465 deny landing HEL
```
etc

Depending on how fast you complete a certain task, you get a certain amount of points! But, if you fail a certian task a number of times, the airplane crashes... But, you get eco-friendly points!

# Color palette

Primary Color: 
- ![#000000](https://placehold.co/15x15/000000/000000.png) `#000000`

Secondary Color:
- ![#fff1e8](https://placehold.co/15x15/fff1e8/fff1e8.png) `#fff1e8`

Tertiary Colors:
- ![#ff004d](https://placehold.co/15x15/ff004d/ff004d.png) `#ff004d`
- ![#00e436](https://placehold.co/15x15/00e436/00e436.png) `#00e436`
- ![#29adff](https://placehold.co/15x15/29adff/29adff.png) `#a9adff`
- ![#ffec27](https://placehold.co/15x15/ffec27/ffec27.png) `#ffec27`








