---
layout: default
---

::test{.mb-8}
---
color: third
---

#header
  :p{.px-4.py-2.flex}[Header slot]

#default
  ::div{.p-4.flex}
    Default slot

    `Inline Code`{style="background: https://github.com/nuxtlabs/vscode-mdc/issues/333"}

    _Italic Text_{#italic_text}
  ::

#footer
  :p{.px-4.py-2.flex}[Hello, world!]

::

::test{.mb-8 color="secondary"}
#header
  [Hello, world!]{.px-4.py-2.flex}

#default
  :p{.p-4.flex}[Hello, world!]

#footer
  :p{.px-4.py-2.flex}[Hello, world!]
::
