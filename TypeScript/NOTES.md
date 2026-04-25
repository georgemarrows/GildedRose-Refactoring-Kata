How I will approach this.

1. Check I can build and run tests
Unit tests DONE - one fails with expected
Texttest - found some diffs in output, but not very clear. Will try later, maybe just diffing against master output file. 

2. Do types check?
Run `npm run compile` - 21 problems in files node_modules, so not really.
But if I make an error in gilded-rose.ts, it does show up as compile error. So the main code is typechecking ok.
Will ignore the problems in node_module. 

3. Write up approach for implementing
Initial thought - feels like strategy pattern could be useful.
Ask Codex for alternatives and pros/cons of each.

4. Ask Codex to expand out tests based only on README.md

5. Review tests

6. Implement using Codex

7. Cross check with text tests