# Multiple script files, classes & namespaces

This is derived from Bruce Mcpherson's insightful article ["Apps Script V8: Multiple script files, classes & namespaces"](https://ramblings.mcpher.com/apps-script/apps-script-v8/multiple-script-files/). Mcpherson provides some great, practical examples on namespacing and caveats when used in [libraries](https://developers.google.com/apps-script/guides/libraries). After working through his example, I made a few modifications that better suit how I currently work. The spreadsheet is available [here](https://docs.google.com/spreadsheets/d/1GssKM9VYpLGYz9EEwJHyFYF4zDHu_8dm5kbwzNqICM0/edit).

## MySheet & Shob

I decided to combine the two classes into a single `Sheet` class, which acts as an enhanced version of the native [Sheet](https://developers.google.com/apps-script/reference/spreadsheet/sheet) object within Apps Script. As the native Sheet object has no unique prototype, creating a new class is really the only way I can think to include these methods without also modifying the prototype of [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) (affecting every object in the script).

The `MySheet` class was an abstraction of the native Sheet object. This class had a primary goal of providing the sheet values via internal memory. This is a relatively trivial feature, but the method I found most interesting was `MySheet.replaceValues()`, which cleared the sheet and wrote a new set of values to it.

The `Shob` class was presented as...

>... [a] class to interact with the sheet data. Each MySheet is abstracted into an array of JSON objects, using this class, which is also going to be the interface to MySheet.

I didn't like the name "Shob", but this is a really useful class as I often use sheets as database tables where every row represents a single record.

After working through Mcpherson's example, I settled on the unified `Sheet` class since

1. there's no immediate benefit to having `Shob` be an interface to `MySheet`, and
2. for the purpose of this example, and many of my own uses of Apps Script, its functionality is a natural extension of a Sheet.

## API Settings

It was unclear to me why the settings for the Sunset API were stored in `Settings` instead of in the `Sunset` class. The `Sunset` class was passing latitude & longitude parameters to `Settings` in order to build the URL, so there wasn't a very strict separation to begin with. So this was simplified, and the class renamed to `SunriseSunset`.