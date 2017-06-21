---
title: "SQLAlchemy is Sorcery"
type: blog
category: blog
date: 2011-12-15
slug: sqlalchemy
tags: code

image:
    url: http://www.sqlalchemy.org/img/sqla-logo6.gif
    where: right
---

Recently at work, I had to populate a database table with contact information
of network admins of secure VLANs behind firewall contexts. The information
would be able to be viewed from Maintain, Oregon State's DNS/DHCP management
web application. I first had to point Maintain towards a new table containing
VLAN and firewall context pairings that was being populated programmatically
whereas the current table containing VLAN information was populated manually.

There was an issue. A subnet table was pointing to the current VLAN table by
referencing its database ID. *cue facepalm*. The decade-old moldy codebase
started to smell yet again. In order to point Maintain to the new table, I had
to port the subnet table to point towards the VLAN ID rather than a database
ID. I dread being a data entry monkey, so I set off to write a script to port
the data. Since it involved handling a database, I figured this would be a good
of a time as any to play with [SQLAlchemy](http://sqlalchemy.org), an SQL ORM
package for Python.

How SQLAlchemy differs from the familiar Django ORM is SQLAlchemy's
over-overwhelming amount of documentation and its concept of sessions. A
session establishes all conversations with a database and acts as a "holding
zone" for all objects loaded or associated with it during its lifespan.
Essentially, it is sentient. A session can be binded to the database and tables
can be mapped to objects like so:


    db = create_engine(DB_STRING, echo=False)
    session = sessionmaker(bind=db)()

    metadata = MetaData(db)
    subnet_table = Table('subnet', metadata, autoload=True)
    vlan_table = Table('vlan', metadata, autoload=True)

    # empty classes that db will be mapped to
    class Subnet(object):
        pass
    class Vlan(object):
        pass
    subnetmapper = mapper(Subnet, subnet_table)
    vlanmapper = mapper(Vlan, vlan_table)

In my case, I wanted the subnet table to point at the vlan id field in the vlan
table, not towards the database index. So I would query it like so:

    for subnet in session.query(Subnet).all():

        vlan_db_id = subnet.vlan

        # get actual vlan id from the vlan db id in subnet field
        for vlan_result in session.query(Vlan).filter(Vlan.id==subnet.vlan):
            subnet.vlan = vlan_result.vlan_id
            break

        session.commit()

In a way, it joins the subnet table to the vlan table. It changes the subnet's
vlan id field and tells the session to commit it to the database. Note that
Django's ORM is similar (object.save()), however there is no recollection of it
after the operation. In SQLAlchemy, the session remembers all.

I am sure there is a more compact way to implement this join given SQLAlchemy's
immense querying API, but for a one-off script, it wasn't bad. I also wanted to
write a script that would ameliorate the boredom of manual entry in populating
the firewall contacts table. So I wrote another script that would ask for user
input and enter data into the database through the command line which would be
a bit faster than clicking around PHPMyAdmin. This was a bit more difficult.

    # get SECURE vlans that don't have ANY contact info
    print "Getting secure VLANs that do not have ANY contact info for you to fill out"
    exists_filter = exists().where(and_(Vlan.vlan_id==Contact.vlan_id, Vlan.context==Contact.context))

    print "%s of those VLANs found" % (session.query(Vlan).filter(and_(Vlan.context!='', ~exists_filter)).count())

This grabs all of the secure VLANs that did not yet have any contact
information filled out. Since it was populating an empty table, I had to check
if a corresponding entry did not exist in the other table. To do this, I had to
write a filter that checked that a corresponding entry DID exist, and later
apply a NOT operator to get what I desired.

    for vlan in session.query(Vlan).filter(and_(Vlan.context!='', ~exists_filter)).order_by('context'):

        if query_yes_no("No contact information found for %s[%s] on %s. Fill it out?" % (vlan.name, vlan.vlan_id, vlan.context)):
            new_contact = Contact()
            new_contact.vlan_id = vlan.vlan_id
            new_contact.context = vlan.context

            new_contact.name = query("    Contact name? ")
            new_contact.email = query("    Contact email? ")
            new_contact.phone = query("    Contact phone? ")
            new_contact.department = query("    Department? ")
            session.add(new_contact)
            session.flush()

Rather than updating information like before, this creates a new object in the
database and adds it. Flushing the session sends the SQL to the database
server. I ended up not using this script because I found a website on our
intranet that contained contact information that I could scrape and enter into
the database programatically. To do this, I used Beautiful Soup, which is
brilliant, alongside SQLAlchemy. You can check out how I did that in a future
blog post. SQLAlchemy is huge, and this was just the tip of the iceberg, but I
simply highlighted how I pulled some basic usage out of it.


