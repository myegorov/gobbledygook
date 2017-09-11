#!/bin/sh
git add dist && git commit -m "github.io sync up" && git subtree push --prefix dist origin master
