---
title: "How A-Frame VR is Different from Other 3D Markup Languages"
type: blog
layout: blog
date: 2015-12-21
id: aframe-vs-3dml
tags: [code]

image:
  url: http://i.imgur.com/kFLzzPC.png
  caption: Rough diagram of the A-Frame entity-component system.
---

[awesome]: https://github.com/aframevr/awesome-aframe
[X3Dom]: http://www.x3dom.org
[GLAM]: http://tparisi.github.io/glam
[Unity]: https://unity3d.com
[NPM]: https://npmjs.com
[Slack]: https://aframevr-slack.herokuapp.com/
[geometry]: https://aframe.io/docs/components/geometry.html
[material]: https://aframe.io/docs/components/material.html
[light]: https://aframe.io/docs/components/light.html
[sound]: https://aframe.io/docs/components/sound.html
[lifecycle]: https://aframe.io/docs/core/component.html#Component_Definition_and_Lifecycle
[component-text]: https://github.com/ngokevin/aframe-text-component
[component-layout]: https://github.com/ngokevin/aframe-layout-component
[component-explode]: https://github.com/dmarcos/a-invaders/blob/master/js/components/explode.js
[component-spawner]: https://github.com/dmarcos/a-invaders/blob/master/js/components/spawner.js
[component-extrude]: https://github.com/JosePedroDias/aframe-extrude-and-lathe
[boilerplate]: https://github.com/ngokevin/aframe-component-boilerplate
[ecs]: https://aframe.io/docs/core/

Upon first seeing A-Frame, branded as "building blocks for the web" displaying
markup like `<a-cube>`, developers may conceive A-Frame as yet another 3DML (3D
markup language) such as [X3Dom][X3Dom] or [GLAM][GLAM]. What A-Frame brings to
the game is that it is based off an [entity-component system][ecs], a pattern
used by universal game engines like [Unity][Unity] which favors composability
over inheritance. As we'll see, this makes A-Frame extremely extendable.

And A-Frame VR is extremely mindful of how to start a developer ecosystem.
There are [tools, tutorials, guides, boilerplates, libraries][awesome] being
built and knowledge being readily shared on [Slack][Slack].

---

## Entity-Component System

The [entity-component system][ecs] is a pattern in which every entity, or
object, in a scene are general placeholders. Then components are used to add
appearance, behavior, and functionality. They're bags of logic and data that
can be applied to any entity, and they can be defined to just about do
*anything*, and anyone can easily develop and share their components.  To
imagine this visually, let's revisit this image:

![](http://i.imgur.com/kFLzzPC.png)
<div class="page-caption"><span>
A good diagram for imagining what an entity looks like.
</span></div>

An entity, by itself without components, doesn't render or do anything. A-Frame
ships with over 15 basic components. We can add a [geometry
component][geometry] to give it shape, a [material component][material] to give
it appearance, or a [light component][light] and [sound component][sound] to
have it emit light or sound.

Each component has properties that further defines how it modifies the entity.
And components can be mixed and matched at will, hence the "composable" word
root of "component". In traditional terms, they can be thought of as plugins.
And anyone can write them to do anything, even *explode* an entity. They are
expected to become an integral part of the workflow of building advanced
scenes.

### Writing and Sharing Components

So at what point does the promise of the ecosystem come in? A component is
simply **a plain JavaScript object** that defines several [lifecycle
handlers][lifecycle] that manages the component's data. Here are some
example third-party components that I and other people have written:

- [Text component][component-text]
- [Layout component][component-layout]
- [Explode component][component-explode]
- [Spawner component][component-spawner]
- [Extrude and lathe component][component-extrude]

Small components can be as little as a few lines of code. Under the hood, they
either do three.js object or JavaScript DOM manipulations. I will go into more
detail how to write a component at a later date, but to get started building a
sharable component, check out the [component boilerplate][boilerplate].

## Comparison with Other 3DMLs

Other 3DMLs, or any markup languages at all for that matter, are based on an
inheritance pattern. This is sort of the default pattern to go towards given
the heirarchichal nature of HTML and XML. Even A-Frame was initially built in
this way. The problem is that this lacks composability. Customizing objects to
do something more than basic becomes difficult, both to the user and to the
library developer.

![](http://i.imgur.com/A98j4uM.png)
<div class="page-caption"><span>
Difficulty of extending traditional objects in 3DML.
</span></div>

The functionality of the language then becomes dependent on how many features
the maintainers and the library add. With A-Frame however, composability brings
about limitless functionality:

![](http://i.imgur.com/5SYtEZS.jpg)
<div class="page-caption"><span>
Composability makes it easy to extend objects in A-Frame.
</span></div>

Putting it logically, the different kinds of functionality you can squeeze out
of an object is the permutation of the number of components you have. With the
basic 16 components that A-Frame comes with, that's 65536 different sets of
components that could be used. Add in the fact that components can be further
customized with properties, and that there is an ecosystem of components to tap
into, the previous use of the word "limitless" was quite literal.

With other 3DML libraries, if they ship 50 different kinds of objects, then you
get only get 50 different kinds of objects with fixed behavior.
