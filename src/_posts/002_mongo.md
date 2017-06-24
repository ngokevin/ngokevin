---
title: "Dumping syslog-ng Logs with MongoDB"
type: blog
layout: blog
date: 2011-11-06
id: syslog-mongo
tags: code

image:
    url: http://i.imgur.com/p7uUwTV.png
    where: right
---

In reference to the recent [ycombinator
post](http://news.ycombinator.com/item?id=3202081) on why one shouldn't use
MongoDB (**EDIT**: the HN post was a hoax), I thought I'd give a chime-in why I went
with MongoDB for one of my work projects,
[netshed](http://github.com/ngokevin/netshed), from a devops standpoint. Why I
Went With MongoDB:

---

- **flat schema**: the purpose of my project was to dump syslog-ng logs, such
  as DHCP, NAPT, or VPN logs, into a database for some wicked querying speeds
that you just don't get with a flat grep on a file. For this, I didn't need a
relational database since the logs are standalone. With the flat schema, I am
also able to add in an extra field to the "schema" whenever I wanted without
having to go through a month-long migration of hundreds of millions of objects.

- **mmm, json**: from a developer standpoint, JSON is awesome. The dictionary,
  especially in Python, is my favorite data structure as it makes representing
data so easy. It removes the obscurity behind throwing in fields that are
referenced by a number and giving it a name. Unline MySQL when you do a
standard query and you get back a plain array and have to know which order the
fields are in, in Mongo, the fields have a name. The JSON allows for very rich
query especially with the lovely PyMongo

- **it's hip**: I'll be honest, it's a shiny new toy that deviates from boring,
  old SQL, but I love playing with it, and initially it was extremely easy
to set up

Now...I encountered **several problems** while working with this project, but
managed to overcome them with some sysadmin-flavored hot sauce.

- **wtf, global write lock**: yes, whenever there is a write operation sent to
  the database server, mongod locks down every collection and queues up the
writes. I hear they are working on collection-level locking, but I haven't seen
any of that yet.  This is very bad; in production at work, it is *extremely*
write-heavy, writing hundreds and thousands of logs per second (especially with
PAT logs for the whole Oregon State University campus, that's 40,000 hosts). In
about a week and a half, the database would be approaching **200 million
objects**.  But I did find a workaround; I set up a master-slave replicated
database between two boxes and had the slave be read-only. That way, it is free
to be read and not to be bogged down with write-locks. This is my main gripe
with MongoDB.

- **indexing**: well, it's not a good idea to put in indexing in a write-heavy
  non-relational database because we might as well use SQL. With hundreds of
thousands of objects per collection, queries were taking about 20 seconds. I
overcame this by putting in a manual index. The log parsers save the log files
to the corresponding collection to the date of the logfile (e.g.
dhcp-20111029). This way, there is no index tree needed to be updated and the
collections are logically partioned. Now, queries are instant.  Scalability for
the win.

MongoDB is a relatively new project, and 10gen has done a great job on
responding to the claims from the ycombinator post and stating that they have
never seen such a case like in the post. Hopefully in the future, these issues
will be a ghost of the past.
