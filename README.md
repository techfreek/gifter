Every year, my family organizes a gift exchange among us. Every year, it takes (what seems like) weeks for someone to figure out the gift exchange.

So I had the thought "I'm a software engineer, I should be able to solve this problem!"

So I did. Well at least, well enough for my purposes.

The rules I added:
1. People with the same last name can't match
..* I have _some_ support for an `id` field so you can get around this
2. Prefer to match people to others (so it is not just a A gives to B who gives to A)
..* After a lot of iterations trying to get this, give up and fall back to allowing it
3. Someone can't match with themselves
..* Who would want to give themselves a gift?

Example:
```
 node index.js --file example.json 
===============================================
Gifter -> Giftee
-----------------------------------------------
Bob Smith -> Example Name
John Smith -> Test Name
John Doe -> Bob Smith
Example Name -> John Smith
Another Name -> John Doe
Test Name -> Joe Schmoe
Joe Schmoe -> Another Name
===============================================
Summary:
-----------------------------------------------
Bob Smith: from: John Doe, to: Example Name
John Smith: from: Example Name, to: Test Name
John Doe: from: Another Name, to: Bob Smith
Example Name: from: Bob Smith, to: John Smith
Another Name: from: Joe Schmoe, to: John Doe
Test Name: from: John Smith, to: Joe Schmoe
Joe Schmoe: from: Test Name, to: Another Name
===============================================
```

### Notes 
This is not perfect, fast, or always good at matching. However with a few tries it is good enough for me to use once a year.