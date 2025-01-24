Here's an updated comparison table of VM managers based on your new requirements:

### **New Requirements Recap**:
- Must work on Linux.
- Support for multiple backends (KVM/libvirt, VirtualBox, etc.).
- No need for a background daemon.
- Create a VM using a single CLI command.
- Automatically copy your public SSH key into the VM to allow for passwordless login after boot.

### **Comparison of Popular VM Managers (Updated for SSH Key Copying and One-Command Boot)**

| Feature/Tool          | **Vagrant**     | **GNOME Boxes**  | **Virt-Manager**  | **Lima**         | **AQEMU**        | **UTM**          |
|-----------------------|-----------------|------------------|-------------------|------------------|------------------|------------------|
| **Daemon-Free**        | ✅               | ✅                | ✅                 | ✅                | ✅                | ✅                |
| **Backends**           | VirtualBox, KVM, VMware, Hyper-V | KVM, VirtualBox | KVM, Xen, VirtualBox | KVM/QEMU          | KVM/QEMU, VirtualBox | KVM/QEMU, VirtualBox |
| **Linux Support**      | ✅               | ✅                | ✅                 | ✅                | ✅                | ✅                |
| **One-liner VM Creation** | ✅ (via `vagrant up`) | ❌ (Graphical Only) | ✅ (via `virt-install` CLI) | ✅ (via CLI or YAML) | ❌ (manual setup needed) | ❌ (manual setup needed) |
| **SSH Key Integration (Auto)** | ✅ (using `Vagrantfile` with `config.ssh`) | ❌                 | ✅ (with cloud-init or post-setup scripts) | ✅ (native support) | ❌                  | ❌                  |
| **Ease of Use**        | Medium          | Very Easy        | Medium-High       | Easy             | Medium           | Easy             |
| **Advanced Features**  | High            | Low              | High              | Low              | Medium           | Medium           |
| **Lightweight**        | Medium          | Very Lightweight | Medium-Heavy      | Lightweight      | Lightweight      | Lightweight      |
| **Cross-platform**     | ✅               | Linux only       | Linux only        | Linux & macOS    | Linux only       | Linux & macOS    |
| **Multiple Backends**  | ✅               | Limited          | ✅                | No               | Limited          | Limited          |
| **SSH Setup**          | Built-in SSH provisioning support | ❌ | Requires cloud-init or manual scripting | Supports SSH key injection automatically | ❌ | ❌ |
| **Networking Setup (for SSH)** | Easy NAT, Bridged or Host-only Networking | Bridged (via libvirt) | Bridged (via libvirt) | Bridged networking | Manual setup | Manual setup |
| **Pre-configured Boxes** | ✅ (Vagrant Boxes available) | ❌ | ❌ (Requires cloud image or manual OS installation) | ❌ | ❌ | ❌ |

### Detailed Notes:

---

### 1. **Vagrant**
   - **One-liner Creation**:
     - You can spin up a VM with a single command: `vagrant up`.
     - Public SSH key is easily added to the VM via the `Vagrantfile` with something like:
       ```ruby
       config.ssh.private_key_path = "~/.ssh/id_rsa"
       ```
   - **SSH Key Integration**: Vagrant has built-in support for copying your SSH key into the VM automatically. You can define this in the `Vagrantfile` by using `config.ssh.insert_key = true`, and then access the VM with `vagrant ssh` once it boots.
   - **Backends**: Supports multiple providers like VirtualBox, libvirt/KVM, Hyper-V, and VMware.
   - **Pros**: Very easy to configure SSH, one-liner VM creation (`vagrant up`), and wide backend support. Lots of pre-configured Vagrant boxes available for various OSes.
   - **Cons**: Slightly heavier than more lightweight options like Lima.

---

### 2. **GNOME Boxes**
   - **One-liner Creation**: **No** CLI support for one-liner VM creation. Primarily a GUI tool.
   - **SSH Key Integration**: **No automatic SSH key copying**. Requires manual setup of SSH keys post-installation.
   - **Backends**: Focused on KVM/libvirt. VirtualBox support is limited and experimental.
   - **Pros**: Very easy to use for lightweight VM management.
   - **Cons**: No native CLI support, no built-in SSH key integration. Not suited for automation or scripting-heavy environments.

---

### 3. **Virt-Manager (via `virt-install`)**
   - **One-liner Creation**:
     - **Yes**, using `virt-install`:
       ```bash
       virt-install --name myvm --ram 2048 --vcpus 2 --disk size=20 --os-variant ubuntu20.04 --cloud-init root-password-generate=true,disable=0,ssh-authorized-keys=/path/to/your/pubkey --network bridge=virbr0 --graphics none --noautoconsole
       ```
     - This command creates a VM, boots it, and injects your public SSH key using **cloud-init**.
   - **SSH Key Integration**: Can be done via **cloud-init** or custom scripts to inject your SSH key into the VM during boot.
   - **Backends**: Supports KVM/libvirt natively, with some ability to work with VirtualBox and Xen through libvirt.
   - **Pros**: Extremely flexible, with full support for custom scripts and cloud-init for SSH key injection. Works directly with KVM and libvirt.
   - **Cons**: Slightly more complex to set up for SSH key copying (requires cloud-init configuration or manual post-setup scripts).

---

### 4. **Lima**
   - **One-liner Creation**: **Yes**, can create and configure a VM with a single command using `lima`:
     ```bash
     limactl start --name=myvm --cpus=2 --memory=2GiB --disk=20GiB default
     ```
     Lima automatically injects the host’s SSH key into the VM, so you can `ssh` into it right after booting.
   - **SSH Key Integration**: Native support. Lima copies the SSH key automatically from the host’s `~/.ssh/id_rsa.pub` into the VM during creation.
   - **Backends**: Primarily works with QEMU/KVM on Linux. No direct support for VirtualBox.
   - **Pros**: Very lightweight and fast. Native SSH key injection, so you can SSH into the VM right after it boots. Extremely easy to use for quick VM setups.
   - **Cons**: Limited to KVM/QEMU as the backend, no support for other hypervisors like VirtualBox.

---

### 5. **AQEMU**
   - **One-liner Creation**: **No**, AQEMU is more of a GUI tool for QEMU/KVM management, and there’s no easy CLI equivalent for one-line VM creation.
   - **SSH Key Integration**: **No automatic SSH key injection**. You’d need to manually configure SSH keys after the VM is booted.
   - **Backends**: Supports QEMU/KVM natively, with limited VirtualBox support.
   - **Pros**: Simple and lightweight interface for KVM management.
   - **Cons**: No CLI automation, no built-in SSH support, and limited backend support.

---

### 6. **UTM**
   - **One-liner Creation**: **No**, UTM is primarily a GUI tool with no CLI support for one-liner VM creation.
   - **SSH Key Integration**: **No automatic SSH key copying**. Requires manual configuration post-install.
   - **Backends**: Supports QEMU/KVM natively, with limited VirtualBox support through QEMU emulation.
   - **Pros**: Easy to use with a GUI. Lightweight for macOS and Linux.
   - **Cons**: No CLI, no automatic SSH support, limited backend support.

---

### **Summary & Recommendation:**
For your use case, where you want a one-liner command, multiple backend support, and SSH key integration for passwordless access, **Vagrant** and **Virt-Manager (via `virt-install`)** are the best options.

- **Vagrant**: Best for ease of use and flexibility across multiple backends. It handles SSH key injection and allows you to `vagrant up` a new VM easily.
- **Virt-Manager (`virt-install`)**: Best for more advanced users who prefer native KVM/libvirt control and don’t mind setting up **cloud-init** or custom scripts for SSH key injection.

If you want a lightweight tool focused purely on KVM with automatic SSH key support, **Lima** is also a great option. However, it’s more limited in backend flexibility (KVM-only).
