---
title: "minikube, a local Kubernetes"
date: 2024-10-23T19:00:00+01:00
tags: ['kubernetes', 'libvirt', 'k3s', 'microk8s']
---

I want to share my short experience with minikube:
[https://minikube.sigs.k8s.io/docs/](https://minikube.sigs.k8s.io/docs/)

I had a look at K3s and MicroK8s also, and I prefer minikube:

>  Minikube is the closest to an official mini distribution for local testing and development, it is run by the same foundation as K8s.
>
> K3s is a project by Rancher, it is compliant but it’s completely up to them what is or isn’t included.
>
> Microk8s is a spin on what minikube tries to do and is run and maintained by Canonical (the Ubuntu people). 

> Fully agree. Also please note that microk8s is being distributed using the proprietary snapcraft store, which could be a concern.

[https://www.reddit.com/r/kubernetes/comments/be0415/k3s_minikube_or_microk8s/](https://www.reddit.com/r/kubernetes/comments/be0415/k3s_minikube_or_microk8s/)

# Driver support

minikube supports [different drivers](https://minikube.sigs.k8s.io/docs/drivers/),
one of them is KVM2 which works on libvirt.

So it starts it's own virtual machine, and everything runs inside it.

This is great, because [I like to use libvirt]({% link-post "2022-11-28-virtual-machines-virtualbox-libvirt-qemu-vagrant" %}).
And other people can use their favorite virtual machines tool, like VirtualBox.

It also makes cleaning up super easy, because your main system remains untouched.

# Installation

```bash
sudo pacman -S minikube kubectl
virt-host-validate
```

# Set driver to libvirt

```bash
minikube config get driver # should be not configured yet
minikube config set driver kvm2
```

# Simple setup

All of the commands from the good documentation worked out-of-the-box.
No struggle at all (which is not always the case for the tech projects I have tried).

```bash
minikube start
minikube dashboard
kubectl config view
kubectl get namespaces
```

# Run your own service

```bash
# Run single container/pod
kubectl run -it --rm --restart=Never --image alpine tmp -- sh
# Single-command deployment
kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.39 -- /agnhost netexec --http-port=8080
# Create deployment from file
kubectl create -f ./hello-world.yaml

# Opens the Service URL in the browser
minikube service hello-world
```

```yaml{data-filename=hello-world.yaml}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-world-deployment
  labels:
    app: hello-world
spec:
  selector:
    matchLabels:
      app: hello-world
  replicas: 2
  template:
    metadata:
      labels:
        app: hello-world
    spec:
      containers:
      - name: hello-world
        image: bhargavshah86/kube-test:v0.1
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: 256Mi
            cpu: "250m"
          requests:
            memory: 128Mi
            cpu: "80m"
---
apiVersion: v1
kind: Service
metadata:
  name: hello-world
spec:
  selector:
    app: hello-world
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
      nodePort: 30081   
  type: NodePort
```

# Some kubectl commands

```bash
kubectl get deployments
kubectl get events
kubectl get pods,services
kubectl logs <pod-name>
```

# Cleanup

```bash
kubectl delete -f ./hello-world.yaml
minikube stop
minikube delete
```
