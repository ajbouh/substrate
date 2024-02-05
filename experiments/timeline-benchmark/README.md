We are interested in various ways for the computer to offer help when human work on an intelectual activity.

An example is something like this: we feed the computer the transcript of a talk that contains references to artifacts created and event that occurred in the past (and future) and make a visual timeline by extracting information from the transcript and format the result as a list with year and description.

Currently we are looking at large languages models. A model would extract such events and artifacts with an instruction like this:

```
    const instruction = `
You output a plain text. Each line represents a description of a
historical event or artifact created. A line begins with year or date,
followed by a ":", and the description of event or artifact.  First,
extract names of historical events and artifacts mentioned. If you
know the year of an invention or artifact mention in text, add
them. For example, if the year of an event is 1994, and the event is
"Introduction of CompactFlash", the line in output is 1994:
Introduction of CompactFlash`;

```

and the transcript. (Often times the full transcript is longer than the context limit of a model, so the transcript is split into smaller chunks and fed through an LLM, and then the resulting chunks are merged. (see query.js).

We encounter problems of LLMs that cannot do the job reliably, and we wanted to write a smaller benchmark program that can tell the "goodness" of the result. This judgement of goodness is a language processing problem itself. For example, a talk might mention the introduction of CompactFlash, and the expected result for that event might be:

  1994: CompactFlash was introduced by SanDisk

but an LLM may produce:

  1994: Introduction of CompactFlash

We would like to say that those two lines are equivalent when shown in the timeline. So we need some natural language processing, and then we need to evaluate the goodness of this judgement as well.

The benachmark.js gives you the result from the judgement. The instruction for the judge is like this:

```
    let instruction = `I will give you two entries describing historical events.
I want you to confirm if these two entries describe the same
event. Please consider the year provided, the nature of the event, and
any specific details mentioned in both descriptions to make your
analysis. I'll give you a few example. If the two entries are "1994:
Introduction of CompactFlash" and "1994: CompactFlash was introduced
by SanDisk", then the answer you give me is "yes". If the two entries
are "1945: Article "As We May Think" by Vannevar Bush" and "1945:
Creation of the ENIAC" then the answer is "no". Your answer should be
one word, yes or no. The answer should be strictly in one word "yes"
or "no", without any markup or other text.`;
```

and actual question is:

```
    let question = `Here are two entries:
"${t}" and "${c}" What is your answer?`;
```

where `t` and `c` (test and control, or test and corrext answer) are the lines.

benchmark.js expects a chat completion style API available at: `http://127.0.0.1:8080/completion`. If you run llamafile (I test v1.5), and mixtral-8x7b-instruct-v0.1.Q5_K_M.gguf, you start the server:

    # ./llava-v1.5-7b-q4.llamafile -m mixtral-8x7b-instruct-v0.1.Q5_K_M.gguf

and then run the benachmark:

    # node benchmark.js test.txt expected.txt

produces three numbers: (1) total number of correct entries, (2) entries missed in `test.txt`, and (3) excess entries that LLM produced.

Currently test.txt has three entries that are duplicate. and expected.txt has two. the order is not sorted. Some LLM may produce a date as "Undated" or "1960's", In any case, we want to check all possibilities so we do NxM comparison at this moment.

At the end of NxM judgements, the program produces a line that looks like this:

   `total = 20, hit = 29, missed = 0`

This means that there are 20 entries in the "expected" file, and they are 29 entries in the "test" file that have the equivalent entry in "expected". Because there are duplicates that "may" be considered equivalent, the hit in this case can be more than `total`. The `missed` value shows how many of  `expected` entries are not hit at all by the "test" entries.

## A test file with some amgibious entries.

`ambigious.txt has some overlapping concepts in it. As above, run an LLM in the server mode:

    # ./llava-v1.5-7b-q4.llamafile -m mixtral-8x7b-instruct-v0.1.Q5_K_M.gguf

and then run:

    # node benchmark.js ambigious.txt ambigious.txt

so that the "test" and "expected" files are the same. An expectation is to get "hit" somewhere between 20-26, and hit should be an even number.

## A less ambigious test

`less-ambigious.txt` has fewer entries than `amgibious.txt`. If you run:

    # node benchmark.js less-ambigious.txt less-ambigious.txt

In this case, the expection is that only the diagonal pairs in the NxN matrix (where N=11)are "yes" as they are the same, and everything else is "no". So the expected output is:

    `total = 11, hit = 11, missed = 0`

For my trials, mixtral-8x7b-instruct-v0.1.Q5_K_M.gguf gives some wrong answers.




