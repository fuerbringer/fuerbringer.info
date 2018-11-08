---
title: Generating passwords in the terminal
author: Severin Fürbringer
description: Shell oneliners for when you need more options than your password manager.
---

The following examples use the [/dev/urandom](https://en.wikipedia.org/wiki//dev/random) secure number generator provided by default on Unix-like systems.

## Requirements and tools

- `cat` (included in coreutils)
- `tr` (included in coreutils)
- `base64` (has to be manually installed on FreeBSD)
- `sha256sum` (just `sha256` on FreeBSD)


### Simple
How to generate a generic random char password:
```
$ base64 /dev/urandom | head -c 18 ; echo
```
Example output: `Y+MbzI4w9Pt3BeIHDW`

You can control the amount of characters by modifying the count (`-c`).

### Hash
If a service permits _very_ long passwords, you can use the following to generate hash based passwords:
```
$ head -c 1024 /dev/urandom | sha256sum ; echo
```
Example output: `b4ed295b1ab395a26018aa7e37a19d8408ab686a158fa93b81b3d9cc4432ff19`

This method uses 1KiB of worth of random numbers as the source to generate the hash. Other hashing options include `sha386sum` and `sha512sum`.

### Alphanumeric
You can use the `tr` command to only allow alphanumeric characters:
```
$ base64 /dev/urandom | tr -dc A-Za-z0-9 | head -c 18 ; echo
```
Example output: `tSHfC8VGgw9IhJczy2`

## Password storage
You'll probably want to store the passwords in a _secure_ place. I recommend something like [Keepassx](https://www.keepassx.org/).
