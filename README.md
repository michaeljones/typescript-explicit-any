# typescript-explicit-any

Adds an explicit 'any' type annotation where ever the typescript compiler says there
is an implicit 'any'.

This is to aid with the conversion of javascript files to typescript files. Or with
enabling `noImplicityAny` on any code base. I find that the first step to converting
a javascript file is always to fill in all the implicit 'any' points with explicit
'any' so that it will compile and then I can start improving the types. This is a
tedious process to complete in `vim`, hence this script.

I imagine solutions already exist but it is hard to google.
