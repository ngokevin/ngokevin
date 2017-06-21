---
title: "Fending Off a Home Server DDoS"
type: blog
category: blog
date: 2011-11-05
slug: ddos
tags: code
---

Give a nice welcome back to my web server. It has been a month since I found my
web server at my apartment to be receiving **anomalous traffic** on port 80. I
had noticed my network being slow, much in the way that cheetahs aren't. I had
an to idea to shut off my webserver and all of a sudden, my network speed
jumped back up to normal (well, as normal as crappy Comcast is). To find out
what was going on, I did a bunch of **TCP dumps** and opened it up in
[Wireshark][wireshark] to see what was going on.

Holy crap, **thousands of packets** in a span of a few seconds, coming from around
the world in places like Singapore, Michigan, and the UK. I let it tcpdump,
again and again. Once, I let it run for an hour and my webserver had used .5gB
of bandwidth just getting pounded by empty packets. Can you say *half a million
packets*...from a single source? I was in a frenzy trying to drop these IPs
from my iptables, but like crazed ants, more and more just kept on coming. Even
weirder, my webserver was responding and sending a lot of packets to Google.

---

Was I some sort of high-profile target for a *DDoS* attack? Am I the future
leader of humanity against the machine race and terminator web servers were
sent back in time to try to kill my box?

I installed [fail2ban][f2b] for apache, but it wasn't doing the job (perhaps I
didn't configure it enough). I was going to try to do a MAC address clone on my
router so that Comcast would lease me a new dynamic IP, but I grew weary and
had little time.  I laid my webserver to sleep and left it under the kitchen
table.

And this weekend, I took my webserver home back to Portland! It was about time
the Internet felt my presence. I reinstalled Debian on my webserver (in case it
was somehow **rooted**), revamped the website from Django to Wok (borrowing
elements from when I had worked on the [LUG website][lug]), and put it back up.

I will probably begin hosting my webserver at my home in Portland since the
internet here is quite a bit faster, and the internet in my apartment is slow,
like slow-like-56k slow. I'll start to write more blog posts and transfer the
blog posts I currently write for the LUG here.

To **mitigate future compromises**, I put my webserver behind two firewalls
(although it probably won't help since port 80 is open), closed off services
such as gnump3d and mediatomb, removed the ability to download documents over
HTTP, and made access to the webserver via public key only (don't allow
password authentication). It helps that this site is static and therefore can't
be injected with anything.

ngokevin.com is back!

[wireshark]:http://wireshark.org
[f2b]:http://fail2ban.org
[lug]:http://lug.oregonstate.edu
