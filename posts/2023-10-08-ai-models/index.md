---
title: "AI models"
date: 2023-10-08T23:00:00+02:00
tags: []
toc: true
draft: true
---

# Text generation

UIs:

- ollama (CLI)
- GPT4All (GUI)
- serge (web)
- text-generation-webui (web)

Best models:

- https://huggingface.co/TheBloke/Mistral-7B-OpenOrca-GGUF: Runs very fast on Mac M1 via text-generation-webui
- wizardlm-13b-v1.1-superhot-8k.ggmlv3.q4_0.bin (GPT4All): very good, supports LocalDocs
- Mistral (ollama): https://github.com/jmorganca/ollama, very fast and good on Mac M1, supports local files with some coding
- WizardLM-Uncensored-7B (serge): On Intel NUC

# Image generation

https://github.com/AUTOMATIC1111/stable-diffusion-webui

Best models:

?

# Text-to-Speech

https://github.com/rsxdalv/tts-generation-webui

Best model: Bark

With audio/music generation included.

# Image Captioning

BLIP2: Requires a short python code

Best model: Salesforce/blip2-opt-2.7b
