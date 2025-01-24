---
title: "Vagrant alternative needed"
date: 2025-01-24T19:00:00+01:00
tags: ['virtualization', 'virtual machines', 'libvirt', 'virtualbox']
thumbnail: virtual-machine.svg
---

# The problem

So few months ago I just wanted to start my virtual machine
by using my usual `vagrant` command, and I was greeted with this:

```shell-session
$ vagrant up --provider=libvirt
/usr/lib/ruby/3.2.0/rubygems/specification.rb:2303:in `raise_if_conflicts': Unable to activate vagrant_cloud-3.1.1, because rexml-3.3.2 conflicts with rexml (~> 3.2.5) (Gem::ConflictError)
        from /usr/lib/ruby/3.2.0/rubygems/specification.rb:1432:in `activate'
        from /usr/lib/ruby/3.2.0/rubygems/core_ext/kernel_gem.rb:63:in `block in gem'
        from /usr/lib/ruby/3.2.0/rubygems/core_ext/kernel_gem.rb:63:in `synchronize'
        from /usr/lib/ruby/3.2.0/rubygems/core_ext/kernel_gem.rb:63:in `gem'
        from /opt/vagrant/embedded/gems/gems/vagrant-2.4.1/bin/vagrant:95:in `block (2 levels) in <main>'
        from /opt/vagrant/embedded/gems/gems/vagrant-2.4.1/bin/vagrant:94:in `each'
        from /opt/vagrant/embedded/gems/gems/vagrant-2.4.1/bin/vagrant:94:in `block in <main>'
        from /opt/vagrant/embedded/gems/gems/vagrant-2.4.1/bin/vagrant:105:in `<main>'
$
```

<https://github.com/hashicorp/vagrant/issues/13502>\
Here they suggest to downgrade `ruby-rexml` to 3.2.6.
They don't talk about an actual fix until somebody explicitly asks for it,
getting 12 upvotes.

{% image "github-issue-13502-comment.png" %}

<https://github.com/hashicorp/vagrant/issues/13502#issuecomment-2371368299>

It took over six weeks for [this pull request](https://github.com/hashicorp/vagrant_cloud/pull/87)
to get merged.

{% image "github-vagrant-cloud-fixed.png" %}

<https://github.com/hashicorp/vagrant_cloud/pull/87#pullrequestreview-2414421181>

You can't be too mad at Chris when he apologizes so nicely,
but there were still six weeks in which I couldn't use my machine without hacks.
And it is not the first time for me Vagrant suddenly doesn't work anymore.

I think the reason here is the script-based projects with various dependencies.
I had trouble with multiple (mostly python) applications in the past.

That's why I'm looking for an alternative to Vagrant, which is statically linked.
A Rust project would be perfect.

There also is a second problem with Vagrant:
[Recent version of Virtualbox 7.1.0 is not supported](https://github.com/hashicorp/vagrant/issues/13501),
but I have to admit that could happen to a linked project as well.

Still:

{% image "github-issue-13501-still-no-support.png" %}

<https://github.com/hashicorp/vagrant/issues/13501#issuecomment-2425115546>

{% image "github-issue-13501-completely-broken.png" %}

<https://github.com/hashicorp/vagrant/issues/13501#issuecomment-2561305736>

# Alternatives to Vagrant

My requirements:

- I can start a virtual machine which is defined via a `.yaml` file in a single, simple command.
- The yaml links to a base image, which can ideally run on libvirt and VirtualBox.
- The yaml contains the hostname, usernames, ssh authenticated keys, enable sudo, maybe some network settings, dhcp, ntp etc.
  (Sounds similar to what `cloud-init` does)
- The yaml can contain additional scripts to be run on first boot

To summarize: I wasn't able to find a good alternative for exactly that.
I will keep looking for one, though.

## lima

- written in Go
- doesn't support `libvirt`, but works directly with `qemu`:
  <https://github.com/lima-vm/lima/issues/2031>
- username cannot be changed:
  <https://github.com/lima-vm/lima/issues/1015>
- has a very clean and easy to understand CLI
- the machine can be defined as `.yaml`

So lima comes close to what I need, but without proper `libvirt`
support it is not a solution to me.

```bash
limactl start
limactl list
limactl start my-box.yaml
limactl shell my-box
limactl disk list
limactl stop my-box
limactl remove my-box
```

```{data-filename=./my-box.yaml}
arch: x86_64
cpus: 2
memory: 4GiB
disk: 20GiB
images:
  - location: "https://cloud-images.ubuntu.com/releases/24.04/release-20240821/ubuntu-24.04-server-cloudimg-amd64.img"
    arch: "x86_64"
    digest: "sha256:0e25ca6ee9f08ec5d4f9910054b66ae7163c6152e81a3e67689d89bd6e4dfa69"
```

## multipass

I don't like it.

- written in C++
- heavily focused on Ubuntu
- requires a daemon
- is from Canonical, is distributed via Snap Store :/
- has support for `libvirt` (experimental) and VirtualBox via local "drivers"
