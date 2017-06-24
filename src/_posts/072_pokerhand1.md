---
title: "EV Calculation for JJ Facing a 3bet Shove"
type: blog
layout: blog
date: 2014-08-24
id: pokerhand1
tags: [poker]
---

It's the final table of the tournament. There are 8 players left. I have an
above average size stack about 8 times the the size of the pot (M=8). I'm
in early position, UTG+1, with JJ. I raise ~2.2x. It folds around to the BB.
The BB is the chipleader, a southern guy who isn't much of a thinker. I just
saw him 3bet shove over a shortstack with 99, and raise/call with KQo. He 3bet
shoves, putting me all in.

After a few seconds of thinking, I called. I was getting **2.2:1 odds on my
call** (call 34k to win 71k), and guessed that it was good. I was willing to
take the variance hit in order to secure a chip lead to take down the
tournament. Trying to learn how to risk a probable cash-out to make a go for
first place (reduce the ITM% to increase the ROI%). I said that I guessed 2.2:1
odds was good against his shoving range, so let's do the math and see if that
checks out.

---

## Tallying up Combos

First, we ask. What range is he shoving? Not much. I'd wager as a conservative
estimate: **{TT+, AQ+}**. Let's break the range down combinatorically:

- 6 combos of TT
- 1 combo of JJ
- 6 combos of QQ
- 6 combos of KK
- 6 combos of AA
- 16 combos of AQ
- 16 combos of AK

Let's ignore JJ since there's only 1 combo, and it won't have much effect on
our calculations. Let's reduce the hand range to hands that we're dominating,
hands that we're flipping with, and hands that crush us:

- 6 combos of hands we crush (TT)
- 32 combos of hands we're flipping with (AQ, AK)
- 18 combos of hands that crush us (QQ, KK, AA)

## Pair Combos to Known Equities

We can simplify by cancelling out hands that we crush, and hands that crush us,
since they even out. Let's get rid of TT and AA:

- 32 combos of hands we're flipping with (AQ, AK)
- 12 combos of hands that crush us (QQ, KK)

For hands that we're flipping with, we're a 1.2:1 favorite (55%). For hands
that crush us, we're a 4:1 dog (20%). In order to make this call profitable,
our hand equity must be better than our pot equity (2.2:1).

## Combine Analysis

Let's calculate our hand equity. We do this by matching hands that we're
flipping with, with hands that we crush. If we estimate that our equity when
we're flipping is 50%, and our equity when we're crushed is 0%, we can cancel
those equities to average out to ~25-30%.

- 12 combos of hands that have ~30% equity.
- 20 combos of hands that have ~50% equity.

Let's rough up the math. A third of the time, we will win a third of the time.
Two-thirds of the time, we will win half the time. So how often do we win
overall? Let's just average it out:

- (12 * .30) + (20 * .50) / 32

This yields 42.5% equity, giving us **2.35:1 odds on our money**. Since we're
getting 2.2:1 odds on our call, **calling is a profitable play** in terms of
pure chip equity, although we're not too excited by it.

## Other Considerations

Although, there is the bubble factor. When we fold, we keep our percentage of
the prize pool equity, and when we lose, we lose it all. But considering we
were 3-4 spots away from small money, it might not be enough to sway our
decision.

There is also the skill factor. I had a large edge on the player pool, and I
could have passed up this spot and look for a better one later. I only had 2.2x
BB invested, although it was a seventh of my stack. That could have swayed my
decision.

He ended up showing QQ, which held.
