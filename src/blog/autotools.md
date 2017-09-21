---
title: GNU Autotools for a legacy project
date: 2017-09-11
blurb: What do you expect from your build tool?
keywords: autotools, autoconf, automake, makefile, build system
draft: true
highlighting: true
---

see blog on using autotools for JS projects

see French PDF presentation on autotools

refer to Pete Hodgson's blog on go script

see pp.54-55
p.59

autoreconf: p.61

AC_SEARCH_LIBS

p.65: AC_CONFIG_FILES([Makefile somedir/Makefile])
  replace any text in templates using @VARIABLE@ syntax

p. 68: VPATH #TODO

p. 69: start with autoscan utility # continue here!

AC_CONFIG_SRCDIR

p72: AC_CONFIG_HEADERS([config.h])
  make source portable by #include "config.h"

p.72: check for programs
AC_PROG_CC for C compiler
AC_PROG_INSTALL for install program

AC_CHECK_HEADERS to check for header files

p. 73: autogen.sh script -- needed?

p. 74: install-sh wrapper around install program

p. 75: what needs to be copied into tarball distribution

p.76ff.: initialization macros, instantiation macros (esp. AC_CONFIG_FILES, AC_CONFIG_HEADERS)
  see also p.84 on autoheader tool to generate an include file template

p. 87: include directives to specify order of search path for compiler

pp.90-91: AC_SUBST and AC_DEFINE

pp.91-92: AC_PROG_CC and AC_PROG_INSTALL

p. 95-96: AC_CHECK_PROG ??? see outside explanation

AC_SEARCH_LIBS
